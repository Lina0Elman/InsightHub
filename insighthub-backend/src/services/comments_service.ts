import { CommentModel } from '../models/comments_model';
import { IComment, CommentData } from 'types/comment_types';
import { Document } from 'mongoose';
import { UserModel } from '../models/user_model';

const commentToCommentData = async (comment: Document<unknown, {}, IComment> & IComment): Promise<CommentData> => {
    const user = await UserModel.findById(comment.owner).select('imageFilename').exec();
    return { ...comment.toJSON(), owner: comment.owner.toString(), postId: comment.postId.toString(), ownerProfileImage: user?.imageFilename };
};

export const addComment = async (commentData: CommentData): Promise<CommentData> => {
    const comment = new CommentModel(commentData);
    await comment.save();
    return commentToCommentData(comment);
};

export const getCommentsWithAuthorsByPostId = async (postId: string): Promise<CommentData[]> => {
    const comments = await CommentModel.find({ postId })
        .populate('author', 'username email')
        .exec();
    return Promise.all(comments.map(commentToCommentData));
};

export const getCommentsByPostId = async (postId: string): Promise<CommentData[]> => {
    const comments = await CommentModel.find({ postId }).exec();
    return Promise.all(comments.map(commentToCommentData));
};

export const getAllComments = async (): Promise<CommentData[]> => {
    const comments = await CommentModel.find().exec();
    return Promise.all(comments.map(commentToCommentData));
};

export const updateComment = async (commentId: string, commentData: Partial<CommentData>): Promise<CommentData | null> => {
    const comment = await CommentModel.findByIdAndUpdate(commentId, {content: commentData?.content}, { new: true }).exec();
    return comment ? commentToCommentData(comment) : null;
};

export const deleteComment = async (commentId: string): Promise<CommentData | null> => {
    const comment = await CommentModel.findByIdAndDelete(commentId).exec();
    return comment ? commentToCommentData(comment) : null;
};

export const getCommentById = async (commentId: string): Promise<CommentData | null> => {
    const comment = await CommentModel.findById(commentId).exec();
    return comment ? commentToCommentData(comment) : null;
};

export const deleteCommentsByPostId = async (postId: string): Promise<void> => {
    await CommentModel.deleteMany({ postId }).exec();
};