import mongoose, { Document } from 'mongoose';

export interface IPost extends Document {
    id?: string;
    title: string;
    content?: string;
    owner: mongoose.Schema.Types.ObjectId;
}

export interface PostData {
    id?: string;
    title: string;
    content?: string;
    owner: string;
    createdAt?: string;
    updatedAt?: string;
}