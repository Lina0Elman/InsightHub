import mongoose, { Document, Schema } from 'mongoose';
import { IComment } from 'types/comment_types';


const commentSchema: Schema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true, strict: true, versionKey: false });

commentSchema.set('toJSON', {
    transform: (doc: Document, ret: Record<string, any>) => {
        return {
            id: ret._id,
            postId: ret.postId,
            content: ret.content,
            owner: ret.owner,
            createdAt: ret.createdAt,
            updatedAt: ret.updatedAt,
        };
    }
});

export const CommentModel = mongoose.model<IComment>("Comments", commentSchema);


