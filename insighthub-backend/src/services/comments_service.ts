import commentModel from '../models/comments_model';
import mongoose from 'mongoose';
import { findPostById } from './posts_service';

export const createComment = async (comment: any) => {
    if (!comment.postId || !mongoose.Types.ObjectId.isValid(comment.postId)) {
        throw new Error("Invalid post ID");
    }

    const post = await findPostById(comment.postId);
    if (!post) {
        throw new Error('Post not found');
    }

    const utcNow = new Date().toISOString();
    comment.createdAt = utcNow;
    comment.updatedAt = utcNow;
    return commentModel.create(comment);
};

export const updateCommentById = async (id: string, comment: any) => {
    const oldComment = await commentModel.findById(id);
    if (oldComment == null) {
        throw new Error('Comment not found');
    }

    comment.postId = oldComment.postId;
    comment.updatedAt = new Date().toISOString();
    comment.createdAt = oldComment.createdAt;
    await new commentModel(comment).validate();
    await commentModel.findByIdAndUpdate(id, comment);

    comment._id = oldComment._id;
    return comment;
};

export const getByPostId = async (postId: string) => {
    const post = await findPostById(postId);
    if (post == null) {
        throw new Error('Post not found');
    }
    return commentModel.find({ postId: post._id });
};

export const deleteCommentById = async (id: string) => {
    const comment = await commentModel.findById(id);
    if (comment == null) {
        throw new Error('Comment not found');
    }
    return commentModel.findByIdAndDelete(id);
};

export const getAllComments = async () => {
    return commentModel.find();
};