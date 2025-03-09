import express from 'express';
import authRoutes from './routes/auth_routes';
import commentsRoutes from './routes/comments_routes';
import postsRoutes from './routes/posts_routes';
import usersRoutes from './routes/users_routes';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import options from './docs/swagger_options';
import {authenticateToken} from "./middleware/auth";
import bodyParser from 'body-parser';

const specs = swaggerJsdoc(options);

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(authenticateToken.unless({
    path: [
        { url: '/auth/login' },
        { url: '/auth/register' },
        { url: '/auth/refresh' },
        { url: '/auth/logout' },
        { url: '/post', methods: ['GET'] },
        { url: '/post/:id', methods: ['GET'] },
        { url: '/comment/post/:postId', methods: ['GET'] },
        { url: '/comment', methods: ['GET'] }
    ]
}));


app.use('/auth', authRoutes);
app.use('/comment', commentsRoutes);
app.use('/post', postsRoutes);
app.use('/user', usersRoutes);

export default app;