import mongoose, { Document, Schema } from 'mongoose';
import {config} from '../config/config';


interface IBlacklistedToken extends Document {
    token: string;
    createdAt: Date;
}

const BlacklistedTokenSchema: Schema = new Schema({
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: config.token.token_expiration() }
}, { timestamps: true, strict: true, versionKey: false });

export const BlacklistedTokenModel = mongoose.model<IBlacklistedToken>('BlacklistedToken', BlacklistedTokenSchema);

