import { Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
}


export interface UserData {
    id: string;
    username: string;
    email: string;
    createdAt?: string,
    updatedAt?: string,
}


