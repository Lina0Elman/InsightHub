import { Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    imageFilename?: string;
    authProvider?: string;
}


export interface UserData {
    id: string;
    username: string;
    email: string;
    password: string;
    imageFilename?: string;
    createdAt?: string,
    updatedAt?: string,
}


