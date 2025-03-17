import { Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    imageFilename?: string;
}


export interface UserData {
    id: string;
    username: string;
    email: string;
    imageFilename?: string;
    createdAt?: string,
    updatedAt?: string,
}


