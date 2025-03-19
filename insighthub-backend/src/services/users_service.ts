import { UserModel } from '../models/user_model';
import {IUser, UserData} from 'types/user_types';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RefreshTokenModel } from '../models/refresh_token_model';
import {config} from '../config/config'
import {Document} from "mongoose";
import { BlacklistedTokenModel } from '../models/Blacklisted_token_model';

const userToUserData = (user: Document<unknown, {}, IUser> & IUser): UserData => {
    return { ...user.toJSON(), id: user.id.toString() };
};


export const addUser = async (username: string, password: string, email: string, authProvider: string): Promise<UserData> => {
    const newUser = new UserModel({username, password, email, authProvider: authProvider || 'local'});
    await newUser.save()
    return userToUserData(newUser);
};

export const getUsers = async (): Promise<UserData[]> => {
    const users = await UserModel.find().exec();
    return users.map(userToUserData);
}

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
    return await  UserModel.findOne({ email }).exec();
};

export const getUserById = async (id: string): Promise<UserData | null> => {
    const user = await UserModel.findById(id).exec();
    return user ? userToUserData(user) : null;
};



export const updateUserById = async (id: string, updateData: Partial<UserData>): Promise<UserData | null> => {
    const user = await UserModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    return user ? userToUserData(user) : null;
};

export const deleteUserById = async (id: string): Promise<UserData | null> => {
    const user = await UserModel.findByIdAndDelete(id).exec();
    return user ? userToUserData(user) : null;
};

export const registerUser = async (username: string, password: string, email: string, authProvider: string): Promise<UserData> => {
    let hashedPassword: string = '';
    // If registering with a password (local registration)
    if (password && authProvider === 'local') {
        const salt = config.token.salt();
        hashedPassword = await bcrypt.hash(password, salt);
    }
    return await addUser(username, hashedPassword, email, authProvider);
};

export const getUserByUsernameOrEmail = async (username: string, email: string) => {
    return await UserModel.findOne({ $or: [{ username }, { email }] }).exec();
};


/** Generate access and refresh tokens */
const generateTokens = (id: string): { accessToken: string, refreshToken: string } => {
    const random = Math.floor(Math.random() * 1000000);
    const accessToken = jwt.sign(
        {
            userId: id,
            random: random
        },
        config.token.access_token_secret(),
        { expiresIn: config.token.token_expiration() as jwt.SignOptions['expiresIn'] });

    const refreshToken = jwt.sign(
        {
            userId: id,
            random: random
        },
        config.token.refresh_token_secret(),
        { expiresIn: config.token.refresh_token_expiration() as jwt.SignOptions['expiresIn'] });

    return { accessToken, refreshToken };
}

export const loginUserGoogle = async (email: string, authProvider: string) => {
    let user = await UserModel.findOne({ email });

    // If the user does not exist, create a new user
    if (!user) {
        user = await UserModel.create({
            email,
            authProvider,
        });
    }
    const tokens = generateTokens(user.id.toString());
    console.log("Sending response:", { tokens });
    return {tokens}
}

export const loginUser = async (email: string, password: string, authProvider?: string): Promise<{ accessToken: string, refreshToken: string, userId: string, username: string, imageFilename?: string } | null> => {
    const user = await getUserByEmail(email);
    if (!user) {
        return null;
    }
     // Local login (with password)
     if (authProvider === 'local') {
        if ((await bcrypt.compare(password, user.password))) {
            return null;
        }
     }
      // OAuth login (Google)
    if (authProvider === 'google') {
        if (user.authProvider !== authProvider) {
            throw new Error(`User is registered with ${user.authProvider}, not ${authProvider}.`);
        }
    }
    const { accessToken, refreshToken } = generateTokens(user.id);

    await new RefreshTokenModel({ userId: user.id, token: refreshToken, accessToken: accessToken }).save();

    return { accessToken, refreshToken, userId: user?.id, username: user.username, imageFilename: user.imageFilename };
};

export const refreshToken = async (refreshToken: string): Promise<{ newRefreshToken: string; accessToken: string }> => {

        const existingToken = await findRefreshToken(refreshToken);
        if (!existingToken) {
            throw new Error('Invalid refresh token');
        }

        const decoded = jwt.verify(refreshToken, config.token.refresh_token_secret()) as { userId: string };
        const user = await getUserById(decoded.userId);
        if (!user) {
            throw new Error('Invalid refresh token');
        }

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(user.id);
        await updateRefreshTokenAccessToken(refreshToken, newAccessToken, newRefreshToken);

        return { accessToken: newAccessToken, newRefreshToken };
}


/**
 * Invalidate the refresh token for a user
 * If the user didn't send a refresh -> cancel them all (as required)
 * If sent and the token is valid -> cancel it
 * If sent and the token is invalid -> return false
 * @param refreshToken
 * @param userId
 */
export const logoutUser = async (refreshToken: string | undefined, userId: string): Promise<boolean> => {
    if (refreshToken) {
        // Find the refresh token document
        const tokenDoc = await findRefreshToken(refreshToken);
        if (tokenDoc && tokenDoc.userId === userId) {
            // Delete the specific refresh token
            await RefreshTokenModel.findOneAndDelete({token: refreshToken}).exec();
            await BlacklistedTokenModel.create({token: tokenDoc.accessToken});
            return true;
        } else {
            // Invalid refresh token
            return false;
        }
    }
    return false;
    // } else {
    //     // None or invalid refresh token provided, delete all refresh tokens for the user
    //     const refreshTokens = await RefreshTokenModel.find({ userId }).exec();
    //     for (const tokenDoc of refreshTokens) {
    //         await BlacklistedTokenModel.create({ token: tokenDoc.accessToken });
    //     }
    //     await RefreshTokenModel.deleteMany({ userId }).exec();
    //     return true;
    // }
};

export const findRefreshToken = async (token: string) => {
    return await RefreshTokenModel.findOne({ token }).exec();
};

export const updateRefreshTokenAccessToken = async (oldRefreshToken: string, newAccessToken: string, newRefreshToken: string): Promise<void> => {
    await RefreshTokenModel.findOneAndUpdate(
        { token: oldRefreshToken },
        { token: newRefreshToken, accessToken: newAccessToken }
    ).exec();
};

export const blacklistToken = async (token: string): Promise<void> => {
    await new BlacklistedTokenModel({ token }).save();
};

export const isAccessTokenBlacklisted = async (token: string): Promise<boolean> => {
    const blacklistedToken = await BlacklistedTokenModel.findOne({ token }).exec();
    return !!blacklistedToken;
};