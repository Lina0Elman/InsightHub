import { Request, Response } from 'express';
import * as usersService from '../services/users_service';
import { handleError } from '../utils/handle_error';
import {registerUser} from "./auth_controller";

// export const addUser = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { username, password, email } = req.body;
//         const hashedPassword = await bcrypt.hash(password, config.default.auth.salt); // Hash the password
//         const userData = {username, password: hashedPassword, email};
//         const savedPost = await usersService.addUser(userData);
//         res.status(201).json(`Added user ${username} with id: ${savedPost._id}`);
//     } catch (err) {
//         handleError(err, res);
//     }
// };

export const createUser = async (req: Request, res: Response): Promise<void> => {
    await registerUser(req, res);
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await usersService.getUsers();
        if (users.length === 0) {
            res.status(204).json({ message: 'No users found' });
        } else {
            res.json(users);
        }
    } catch (err) {
        handleError(err, res);
    }
};



export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await usersService.getUserById(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    } catch (err) {
        handleError(err, res);
    }
}


export const updateUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await usersService.updateUserById(req.params.id, req.body);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    } catch (err) {
        handleError(err, res);
    }
}


export const deleteUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await usersService.deleteUserById(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        handleError(err, res);
    }
}
