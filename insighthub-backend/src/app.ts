import express from 'express';
import authRoutes from './routes/auth_routes';
import commentsRoutes from './routes/comments_routes';
import postsRoutes from './routes/posts_routes';
import usersRoutes from './routes/users_routes';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import options from './docs/swagger_options';
import {authenticateToken} from "./middleware/auth";

const specs = swaggerJsdoc(options);

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// const bodyParser = require('body-parser');
import bodyParser from 'body-parser';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(authenticateToken.unless({ path: ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'] }));


app.use('/auth', authRoutes);
app.use('/comment', commentsRoutes);
app.use('/post', postsRoutes);
app.use('/users', usersRoutes);

export default app;