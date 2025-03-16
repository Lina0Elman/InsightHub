import express from 'express';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import bodyParser from 'body-parser';
import posts_routes from './routes/posts_routes';
import comments_routes from './routes/comments_routes';
import auth_routes from './routes/auth_routes';
import swaggerUi from 'swagger-ui-express';
import loadOpenApiFile from './openapi/openapi_loader';
import cors from 'cors';
import { config } from './config';

dotenvExpand.expand(dotenv.config());
const app = express();

app.use(cors({
    origin: [config.app.frontend_url(), config.app.backend_url()],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies to be sent with requests
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Error handler for invalid JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError) {
        return res.status(400).send('Invalid JSON syntax');
    }
    next(err);
});



app.use('/swagger', swaggerUi.serve, swaggerUi.setup(loadOpenApiFile()));
app.use('/post', posts_routes);
app.use('/comment', comments_routes);
app.use('/auth', auth_routes);

export default app;
