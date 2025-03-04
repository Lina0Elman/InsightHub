import { Request, Response } from 'express';
import * as commentsService from '../services/comments_service';
import * as postsService from '../services/posts_service';
import { handleError } from '../utils/handle_error';
import {CommentData} from "types/comment_types";
import {CustomRequest} from "types/customRequest";

export const addComment = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const { postId, content } = req.body;
        const owner = req.user.id;

        // Validate if the post exists
        const postExists = await postsService.getPostById(postId);
        if (!postExists) {
            res.status(404).json({ message: "Post not found: " + postId });
            return;
        }

        const commentData: CommentData = { postId, owner, content };
        const savedComment = await commentsService.addComment(commentData);
        res.status(201).json(savedComment);
    } catch (err) {
        handleError(err, res);
    }
};


export const getCommentById = async (req: Request, res: Response): Promise<void> => {
    try {
        const comment = await commentsService.getCommentById(req.params.comment_id);
        if (comment == null) {
            res.status(204).json({ message: 'No comments found for this post' });
        } else {
            res.json(comment);
        }
    } catch (err) {
        handleError(err, res);
    }
};



export const getCommentsByPostId = async (req: Request, res: Response): Promise<void> => {
    try {
        const comments = await commentsService.getCommentsByPostId(req.params.post_id);
        if (comments.length === 0) {
            res.status(204).json({ message: 'No comments found for this post' });
        } else {
            res.json(comments);
        }
    } catch (err) {
        handleError(err, res);
    }
};

export const getAllComments = async (req: Request, res: Response): Promise<void> => {
    try {
        const comments = await commentsService.getAllComments();
        res.json(comments);
    } catch (err) {
        handleError(err, res);
    }
};

export const updateComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedComment = await commentsService.updateComment(req.params.comment_id, req.body);
        if (!updatedComment) {
            res.status(404).json({ message: 'Comment not found' });
        } else {
            res.json(updatedComment);
        }
    } catch (err) {
        handleError(err, res);
    }
};

export const deleteComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedComment = await commentsService.deleteComment(req.params.comment_id);
        if (!deletedComment) {
            res.status(404).json({ message: 'Comment not found' });
        } else {
            res.json({ message: 'Comment deleted successfully' });
        }
    } catch (err) {
        handleError(err, res);
    }
};