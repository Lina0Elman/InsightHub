import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import mongoose, {ConnectOptions} from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';




/*
 * Each `*.test.js` file is called a test "Suite".
 * This file configures each test suite.
 *
 * - The `global.beforeAll` function configures a global hook to run when a
 *   suite is being initialzed, and is about to begin running its tests.
 * - The `global.afterAll` function configures a global hook to run when a
 *   suite has finished running all of its tests, and is about to close itself.
 */


// Configure environment variables, and allow expand.
dotenvExpand.expand(dotenv.config());



let mongoServer: MongoMemoryServer;


/**
 * Before each test suite:
 *
 * - Generate a new db name.
 * - Connect to the database.
 */
global.beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as ConnectOptions);
});

/**
 * After each test suite:
 *
 * - Drop the database.
 * - Close the connection to the database.
 */
global.afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});