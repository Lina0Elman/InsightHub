
import mongoose, {Document} from "mongoose";
const Schema = mongoose.Schema;

export interface IMessage extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    roomId: mongoose.Schema.Types.ObjectId;
    content: string
}

export interface MessageData {
    id?: string;
    userId: string;
    roomId: string;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
}


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
    content: {
        type: String,
        required: true
    }
}, {
    versionKey: false,
});

messageSchema.set('toJSON', {
    transform: (doc: Document, ret: Record<string, any>) => {
        return {
            id: ret._id,
            userId: ret.userId,
            roomId: ret.roomId,
            content: ret.content,
            createdAt: ret.createdAt,
        };
    }
});

const RoomModel = mongoose.model<IMessage>('Messages', messageSchema);

const messageToMessageData = (message: Document<unknown, {}, IMessage> & IMessage): MessageData => {
    return { ...message.toJSON(), userId: message.userId.toString(), roomId: message.roomId.toString() };
};

export default RoomModel;