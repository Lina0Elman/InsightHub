import mongoose, { ConnectOptions } from 'mongoose';


export const connectToDatabase = async (connectionUri: string): Promise<void> => {
    try {
        await mongoose.connect(connectionUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as  ConnectOptions);
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
};