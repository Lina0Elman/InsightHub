import * as commentsService from '../services/comments_service';

const createComment = async (req, res) => {
    const comment = req.body;
    try {
        const newComment = await commentsService.createComment(comment);
        return res.status(201).send(newComment);
    } catch (error) {
        return res.status(400).send(error.message);
    }
};

const updateCommentById = async (req, res) => {
    const id = req.params.id;
    const comment = req.body;
    try {
        const updatedComment = await commentsService.updateCommentById(id, comment);
        return res.status(201).send(updatedComment);
    } catch (error) {
        return res.status(400).send(error.message);
    }
};

const getByPostId = async (req, res) => {
    const postId = req.params.postId;
    try {
        const comments = await commentsService.getByPostId(postId);
        return res.status(200).send(comments);
    } catch (error) {
        return res.status(400).send(error.message);
    }
};

const deleteCommentById = async (req, res) => {
    const id = req.params.id;
    try {
        const deletedComment = await commentsService.deleteCommentById(id);
        return res.status(200).send(deletedComment);
    } catch (error) {
        return res.status(400).send(error.message);
    }
};

const getAllComments = async (req, res) => {
    try {
        const comments = await commentsService.getAllComments();
        return res.status(200).send(comments || []);
    } catch (error) {
        return res.status(400).send(error.message);
    }
};

export default { createComment, getByPostId, updateCommentById, deleteCommentById, getAllComments };