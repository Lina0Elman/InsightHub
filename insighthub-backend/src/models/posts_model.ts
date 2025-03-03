import mongoose, { Document, Schema } from 'mongoose';
import {IPost, PostData} from 'types/post_types';

const postSchema: Schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {  timestamps: true, strict: true });

postSchema.set('toJSON', {
    transform: (doc: Document, ret: Record<string, any>): PostData => {
        return {
            id: ret._id,
            title: ret.title,
            content: ret.content,
            owner: ret.owner._id.toString(),
            createdAt: ret.createdAt,
            updatedAt: ret.updatedAt

        };
    }
});

export const PostModel = mongoose.model<IPost>("Posts", postSchema);
