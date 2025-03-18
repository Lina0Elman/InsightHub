import { Request, Response } from 'express';
import * as postsService from '../services/posts_service';
import { handleError } from '../utils/handle_error';
import {CustomRequest} from "types/customRequest";
import {PostData} from "types/post_types";
import {getLikedPostsByUser, getPostLikesCount, postExists, updatePostLike} from "../services/posts_service";
import LikeModel from '../models/like_model';
import mongoose from 'mongoose';


export const addPost = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const postData: PostData = {
            title: req.body.title,
            content: req.body.content,
            owner: req.user.id
        };

        const savedPost: PostData = await postsService.addPost(postData);

        res.status(201).json(savedPost);
    } catch (err) {
        handleError(err, res);
    }
};

export const getPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        let posts;
        if (req.query.owner) {
            posts = await postsService.getPosts(req.query.owner as string);
        } else if (req.query.username)
        {
            posts = await postsService.getPostsByUsername(req.query.username as string);
        }
        else {
            posts = await postsService.getPosts();
        }

        if (posts.length === 0) {
            res.status(200).json([]);
        } else {
            res.json(posts);
        }
    } catch (err) {
        handleError(err, res);
    }
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
    try {
        const post = await postsService.getPostById(req.params.postId);
        if (!post) {
            res.status(404).json({ message: 'Post not found' });
        } else {
            res.json(post);
        }
    } catch (err) {
        handleError(err, res);
    }
};

// TODO - create a difference between PUT and PATCH
export const updatePost = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const owner = req.user.id;
        const postId = req.params.postId;
        const postData: PostData = {
            title: req.body.title,
            content: req.body.content,
            owner
        };

        if (await postsService.postExists(postId)) {

            if (await postsService.isPostOwnedByUser(postId, owner)) {

                const updatedPost = await postsService.updatePost(postId, postData);
                if (!updatedPost) {
                    res.status(404).json({message: 'Post not found'});
                } else {
                    res.status(200).json(updatedPost);
                }
            } else { // If someone not the owner
                res.status(403).json({message: 'Forbidden'});
            }
        } else { // If someone  try to update post that doesn't exist
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (err) {
        handleError(err, res);
    }
};

export const updateLikeByPostId = async (req: CustomRequest, res: Response): Promise<void> => {
    const userId = req.user.id;
    const id = req.params.postId;
    const booleanValue: any = req.body.value;
    try {
        if (booleanValue instanceof String && booleanValue != "false" && booleanValue != "true") {
            res.status(400).send("Bad Request. Body accepts `true` or `false` values only");
        }

        const oldPost = await postExists(id);
        if (oldPost == null) {
            res.status(404).send('Post not found');
        }

        await updatePostLike(id, booleanValue, userId)

        res.status(200).send("Success");
    } catch(err) {
        handleError(err, res);
    }
}

export const getLikesByPostId = async (req: Request, res: Response): Promise<void> => {
    const postId = req.params.postId;

    try {
        // Fetch the count of likes and the list of users who liked the post
        const likes = await LikeModel.find({ postId: new mongoose.Types.ObjectId(postId) }).select('userId').exec();
        const likesCount = likes.length;
        const likedBy = likes.map((like) => like.userId.toString()); // Extract user IDs

        res.status(200).json({ count: likesCount, likedBy });
    } catch (error) {
        console.error(`Error fetching likes for post ${postId}:`, error);
        handleError(error, res);
    }
};



export const getLikedPosts =  async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;
        const likedPostsByUserId = await  getLikedPostsByUser(userId)

        res.status(200).send(likedPostsByUserId);
    } catch(err){
        handleError(err, res);
    }
}


export const deletePostById = async (req: Request, res: Response): Promise<void> => {
    try {
        const postId = req.params.postId;
        const post = await postsService.getPostById(postId);
        if (!post) {
            res.status(404).json({ message: 'Post not found' });
        } else {
            await postsService.deletePostById(postId);
            res.json({ message: 'Post and associated comments deleted successfully' });
        }
    } catch (err) {
        handleError(err, res);
    }
};


