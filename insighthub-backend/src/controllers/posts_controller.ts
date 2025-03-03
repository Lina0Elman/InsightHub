import * as postsService from '../services/posts_service';

const getAllPosts = async (req, res) => {
    const senderFilter = req.query.sender;
    try {
        const posts = await postsService.getAllPosts(senderFilter);
        res.status(200).send(posts);
    } catch (error) {
        res.status(400).send("Bad Request");
    }
};

const createPost = async (req, res) => {
    const post = req.body;
    try {
        const newPost = await postsService.createPost(post);
        res.status(201).send(newPost);
    } catch (error) {
        res.status(400).send("Bad Request");
    }
};

const getPostById = async (req, res) => {
    const id = req.params.id;
    try {
        const post = await postsService.getPostById(id);
        if (!post) {
            return res.status(404).send('Post not found');
        }
        return res.status(200).send(post);
    } catch (error) {
        return res.status(400).send("Bad Request");
    }
};

const updatePostById = async (req, res) => {
    const id = req.params.id;
    const post = req.body;
    try {
        const updatedPost = await postsService.updatePostById(id, post);
        res.status(201).send(updatedPost);
    } catch (error) {
        if (error.message === 'Post not found') {
            res.status(404).send(error.message);
        } else {
            res.status(400).send("Bad Request");
        }
    }
};

export default { getAllPosts, createPost, getPostById, updatePostById };