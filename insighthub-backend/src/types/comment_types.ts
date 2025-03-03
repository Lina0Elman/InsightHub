import mongoose, {Document} from "mongoose";

export interface IComment extends Document {
    postId: mongoose.Schema.Types.ObjectId;
    content: string;
    author: string;

}

export interface CommentData {
    id?: string;
    postId: string;
    content: string;
    author: string;
    createdAt?: Date;
    updatedAt?: Date;
}