
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    userIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Users',
        required: true
    },
}, {
    versionKey: false,
});

const RoomModel = mongoose.model('Rooms', roomSchema);

export default RoomModel;