import mongoose, {Document} from "mongoose";

export interface IComment extends Document {
    postId: mongoose.Schema.Types.ObjectId;
    content: string;
    owner: string;

}

export interface CommentData {
    id?: string;
    postId: string;
    content: string;
    owner: string;
    createdAt?: Date;
    updatedAt?: Date;
    ownerProfileImage?: string;
}