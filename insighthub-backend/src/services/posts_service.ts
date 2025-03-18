import {PostModel } from '../models/posts_model';
import { IPost, PostData } from 'types/post_types';
import {ClientSession, Document} from 'mongoose';
import * as mongoose from 'mongoose';
import * as commentsService from './comments_service';
import * as usersService from './users_service';
import {UserModel} from "../models/user_model";
import likeModel from "../models/like_model";
import {CommentData} from "types/comment_types";
import {UserData} from 'types/user_types';
import * as chatService from './chat_api_service';
import {config} from "../config/config";


const postToPostData = (post: Document<unknown, {}, IPost> & IPost): PostData => {
    return { ...post.toJSON(), owner: post.owner.toString() };
};


const addMisterAIComment = async (postId: string, postContent: string) => {
    let misterAI: UserData | null = await usersService.getUserByEmail('misterai@example.com');
    if (!misterAI) {
        misterAI = await usersService.addUser('misterai', 'securepassword', 'misterai@example.com');
    }

    const comment = await chatService.chatWithAI(postContent);
    const commentData: CommentData = { postId, owner: misterAI.id, content: comment };
    const savedComment = await commentsService.addComment(commentData);
    return savedComment;
};



/***
    * Add a new post
    * @param postData - The post data to be added
    * @returns The added post
    */
export const addPost = async (postData: PostData): Promise<PostData> => {
    const newPost = new PostModel(postData);
    await newPost.save();
    const turn = config.chatAi.turned_on();
    if(postData.content && turn) {
        addMisterAIComment(newPost.id, postData.content);
    }
    return postToPostData(newPost);
};

/***
    * Get all posts
    * @param owner - The owner of the posts to be fetched
    * @returns The list of posts
    */
export const getPosts = async (owner?: string): Promise<PostData[]> => {
    if (owner) {
        const posts = await PostModel.find({ owner }).exec();
        return posts.map(postToPostData);
    } else {
         const posts = await PostModel.find().exec();
        return posts.map(postToPostData);
    }
};

/***
 * Get posts by username
 * @param username - The username of the posts to be fetched
 * @returns The list of posts
 */
export const getPostsByUsername = async (username: string): Promise<PostData[]> => {
    if (!username) return [];

    // Find the user first
    const user = await UserModel.findOne({ username }).select('_id').lean().exec();
    if (!user) return [];

    // Then find posts with that user's ID
    const posts = await PostModel.find({ owner: user._id }).exec();
    return posts.map(postToPostData);
};

/**
 * Get a post by ID
 * @param postId
 */
export const getPostById = async (postId: string): Promise<PostData | null> => {
    const post = await PostModel.findById(postId).exec();
    return post ? postToPostData(post) : null;
};


/**
 * Delete a post by ID
 * @param postId
 */
export const deletePostById = async (postId: string): Promise<PostData | null> => {
    const session: ClientSession = await mongoose.startSession();
    session.startTransaction();
    try {
        await commentsService.deleteCommentsByPostId(postId, session );
        const post = await PostModel.findByIdAndDelete(postId, { session }).exec();
        await session.commitTransaction();
        return post ? postToPostData(post) : null;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
};


/**
 * Update a post
 * @param postId
 * @param postData
 */
export const updatePost = async (postId: string, postData: Partial<PostData>): Promise<PostData | null> => {
    const updatedPost = await PostModel.findByIdAndUpdate(postId, { ...postData }, { new: true, runValidators: true }).exec();
    return updatedPost ? postToPostData(updatedPost) : null;
};

/**
 * Check if a post is owned by a specific user
 * @param postId
 * @param ownerId
 * @returns boolean indicating ownership
 */
export const isPostOwnedByUser = async (postId: string, ownerId: string): Promise<boolean> => {
    const post = await PostModel.findById(postId).exec();
    return post ? post.owner.toString() === ownerId : false;
};


/**
 * Check if a post exists by ID
 * @param postId
 * @returns boolean indicating existence
 */
export const postExists = async (postId: string): Promise<boolean> => {
    const post = await PostModel.exists({ _id: postId }).exec();
    return post !== null;
};

export const updatePostLike = async (postId: string, booleanValue: string, userId: string): Promise<void> => {
    const post = await getPostById(postId);
    if(post != null) {
        if (booleanValue == "true") {
            // Upsert
            await likeModel.updateOne({
                    userId: new mongoose.Types.ObjectId(userId),
                    postId: post?.id
                },
                {},
                {upsert: true}
            );
        } else {
            // Delete like document if exists
            await likeModel.findOneAndDelete({
                userId: new mongoose.Types.ObjectId(userId),
                postId: post?.id
            });
        }
    }
    else{
        throw new Error("Post not found")
    }
}

export const getLikedPostsByUser = async (userId: string) => {
    const likedPostsByUserId = await likeModel.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: 'posts',
                localField: 'postId',
                foreignField: '_id',
                as: 'post'
            }
        },
        {
            $unwind: {
                path: '$post'
            }
        },
        {
            $replaceRoot: {
                newRoot: '$post'
            }
        }
    ]);
    return likedPostsByUserId;
}
