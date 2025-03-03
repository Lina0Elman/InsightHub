import { NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import * as userService from '../services/user_service';

const register = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return res.status(400).send("Missing email or password");
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await userService.createUser(email, hashedPassword);
        res.status(200).send(user);
    } catch (err) {
        return res.status(500).send(err.message);
    }
};

const generateTokens = (_id: string): { accessToken: string, refreshToken: string } => {
    const random = Math.floor(Math.random() * 1000000);
    const accessToken = jwt.sign(
        { _id, random },
        config.token.access_token_secret(),
        { expiresIn: process.env.TOKEN_EXPIRATION as jwt.SignOptions['expiresIn'] }
    );

    const refreshToken = jwt.sign(
        { _id, random },
        config.token.access_token_secret(),
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION as jwt.SignOptions['expiresIn'] }
    );

    return { accessToken, refreshToken };
};

const login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return res.status(400).send("Missing email or password");
    }
    try {
        const user = await userService.findUserByEmail(email);
        if (!user) {
            return res.status(400).send("Wrong email or password");
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).send("Invalid password");
        }

        const userId: string = user._id.toString();
        const tokens = generateTokens(userId);
        if (!tokens) {
            return res.status(500).send("missing auth config");
        }
        if (user.refreshTokens == null) {
            user.refreshTokens = [];
        }
        user.refreshTokens.push(tokens.refreshToken);
        await userService.saveUser(user);
        res.status(200).send({
            email: user.email,
            _id: user._id,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        });
    } catch (err) {
        return res.status(400).send(err.message);
    }
};

const logout = async (req, res) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        return res.status(400).send("missing refresh Token");
    }
    jwt.verify(refreshToken, config.token.access_token_secret(), async (err, data) => {
        if (err) {
            return res.status(403).send("Invalid Token");
        }
        const payload = data as TokenPayload;
        try {
            const user = await userService.findUserById(payload._id);
            if (!user) {
                return res.status(400).send("Invalid Token");
            }
            if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
                user.refreshTokens = [];
                await userService.saveUser(user);
                return res.status(400).send("Invalid Token");
            }
            const tokens = user.refreshTokens.filter((token) => token !== refreshToken);
            user.refreshTokens = tokens;
            await userService.saveUser(user);
            res.status(200).send("Logged out");
        } catch (err) {
            return res.status(400).send("Invalid Token");
        }
    });
};

const refresh = async (req, res) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        return res.status(400).send("invalid refresh token");
    }
    jwt.verify(refreshToken, config.token.access_token_secret(), async (err, data) => {
        if (err) {
            return res.status(403).send("Invalid Token");
        }
        const payload = data as TokenPayload;
        try {
            const user = await userService.findUserById(payload._id);
            if (!user) {
                return res.status(400).send("Invalid Token");
            }
            if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
                user.refreshTokens = [];
                await userService.saveUser(user);
                return res.status(400).send("Invalid Token");
            }
            const newTokens = generateTokens(user._id.toString());
            if (!newTokens) {
                user.refreshTokens = [];
                await userService.saveUser(user);
                return res.status(400).send("missing auth config");
            }
            user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
            user.refreshTokens.push(newTokens.refreshToken);
            await userService.saveUser(user);
            res.status(200).send({
                accessToken: newTokens.accessToken,
                refreshToken: newTokens.refreshToken,
            });
        } catch (err) {
            return res.status(400).send("Invalid Token");
        }
    });
};

type TokenPayload = {
    _id: string
};

export const authMiddleware = (req, res, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send("missing token");
    }
    jwt.verify(token, config.token.access_token_secret(), (err, data) => {
        if (err) {
            return res.status(403).send("Invalid Token");
        }

        const payload = data as TokenPayload;
        req.query.userId = payload._id;
        next();
    });
};

export default { register, login, refresh, logout };