import express from 'express';
import authRoutes from './routes/auth_routes';
import commentsRoutes from './routes/comments_routes';
import postsRoutes from './routes/posts_routes';
import usersRoutes from './routes/users_routes';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import options from './docs/swagger_options';
import {authenticateToken, authenticateTokenForParams} from "./middleware/auth";
import bodyParser from 'body-parser';

const specs = swaggerJsdoc(options);

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add Authentication for all routes except the ones listed below
app.use(authenticateToken.unless({
    path: [
        { url: '/auth/login' },
        { url: '/auth/register' },
        { url: '/auth/refresh' },
        { url: '/auth/logout' },
        { url: /^\/post\/[^\/]+$/, methods: ['GET'] },  // Match /post/{anything} for GET
        { url: /^\/comment\/[^\/]+$/, methods: ['GET'] },  // Match /comment/{anything} for GET
        { url: /^\/comment\/post\/[^\/]+$/, methods: ['GET'] },  // Match /comment/post/{anything} for GET
        { url: '/comment', methods: ['GET'] },
        { url: '/post', methods: ['GET'] }  // Allow GET to /post
    ]
}));

// Add AUTH middleware for params queries
// To block queries without Authentication
app.use(authenticateTokenForParams);



app.use('/auth', authRoutes);
app.use('/comment', commentsRoutes);
app.use('/post', postsRoutes);
app.use('/user', usersRoutes);

export default app;