import postModel from '../models/posts_model';

export const getAllPosts = async (senderFilter?: string) => {
    if (senderFilter) {
        return postModel.find({ sender: senderFilter });
    } else {
        return postModel.find();
    }
};

export const createPost = async (post: any) => {
    return postModel.create(post);
};

export const getPostById = async (id: string) => {
    return postModel.findById(id);
};

export const updatePostById = async (id: string, post: any) => {
    await new postModel(post).validate();
    const oldPost = await postModel.findByIdAndUpdate(id, post);
    if (oldPost == null) {
        throw new Error('Post not found');
    }
    post._id = oldPost._id;
    return post;
};

export const findPostById = async (id: string) => {
    return postModel.findById(id);
};