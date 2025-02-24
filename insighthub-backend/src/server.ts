import app from './app';
import mongoose from 'mongoose';
import { config } from './config';


// Start app while verifying connection to the database.
const port = config.app.port();
app.listen(port, () => {    
    mongoose.connect(config.mongo.uri())
    const db = mongoose.connection;
    db.on('error', (error) => console.error(error));
    db.once('open', () => console.log("Connected to DataBase"));
    console.log(`Example app listening at http://localhost:${port}`);
});
