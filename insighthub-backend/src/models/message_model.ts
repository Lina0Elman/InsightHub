
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rooms',
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    content: String,
}, {
    versionKey: false,
});

const RoomModel = mongoose.model('Messages', messageSchema);

export default RoomModel;