import mongoose, { Schema } from 'mongoose';
import { IUser , UserData} from 'types/user_types';

const userSchema: Schema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }, // Store hashed passwords
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true, strict: true, versionKey: false });

userSchema.set('toJSON', {
    transform: (doc, ret): UserData => {
        return {
            id: ret._id,
            username: ret.username,
            email: ret.email,
            createdAt: ret.createdAt,
            updatedAt: ret.updatedAt
        };
    }
});

export const UserModel = mongoose.model<IUser>('User', userSchema);