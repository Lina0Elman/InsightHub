import mongoose, { Schema } from 'mongoose';
import { IUser , UserData} from 'types/user_types';

const userSchema: Schema = new Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
    }, // Store hashed passwords
    imageFilename: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    authProvider: {
        type: String
    }
}, { timestamps: true, strict: true, versionKey: false });

userSchema.set('toJSON', {
    transform: (doc, ret): UserData => {
        return {
            id: ret._id,
            username: ret.username,
            email: ret.email,
            password: ret.password,
            imageFilename: ret?.imageFilename,
            createdAt: ret.createdAt,
            updatedAt: ret.updatedAt
        };
    }
});

export const UserModel = mongoose.model<IUser>('User', userSchema);