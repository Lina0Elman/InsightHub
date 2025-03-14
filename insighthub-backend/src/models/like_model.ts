
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const likeSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Posts',
        required: true
    }
}, {
    versionKey: false,
});

const LikeModel = mongoose.model('Likes', likeSchema);

export default LikeModel;