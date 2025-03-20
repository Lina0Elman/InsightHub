import express, {Request, Response, NextFunction, RequestHandler} from 'express';
import authRoutes from './routes/auth_routes';
import commentsRoutes from './routes/comments_routes';
import postsRoutes from './routes/posts_routes';
import usersRoutes from './routes/users_routes';
import swaggerUi, {JsonObject} from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import options from './docs/swagger_options';
import {authenticateToken, authenticateTokenForParams} from "./middleware/auth";
import bodyParser from 'body-parser';
import roomsRoutes from './routes/rooms_routes';
import cors from 'cors';
import {config} from "./config/config";
import validateUser from "./middleware/validateUser";
import loadOpenApiFile from "./openapi/openapi_loader";
import resource_routes from './routes/resources_routes';


const specs = swaggerJsdoc(options);

const app = express();

const corsOptions = {
    origin: [config.app.frontend_url(), config.app.backend_url()],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies to be sent with requests
};

app.use(cors(corsOptions));

const removeUndefinedOrEmptyFields = (req: Request, res: Response, next: NextFunction) => {
    if (req.body && typeof req.body === 'object') {
        for (const key in req.body) {
            if (req.body[key] === undefined || req.body[key] === null || req.body[key] === '') {
                delete req.body[key];
            }
        }
    }
    next();
};

app.use(bodyParser.json());
app.use(removeUndefinedOrEmptyFields);
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/api-docs', (req, res, next) => {
    const prefix = req.headers['x-forwarded-prefix'] || '';
    const swaggerDoc = loadOpenApiFile(prefix);
    swaggerUi.setup(swaggerDoc)(req, res, next);
}, swaggerUi.serve);

// Add Authentication for all routes except the ones listed below
app.use(authenticateToken.unless({
    path: [
        { url: '/auth/login' },
        { url: '/auth/social' },
        { url: '/auth/register' },
        { url: '/auth/refresh' },
        { url: '/auth/logout' },
        { url: /^\/post\/[^\/]+$/, methods: ['GET'] },  // Match /post/{anything} for GET
        { url: /^\/comment\/[^\/]+$/, methods: ['GET'] },  // Match /comment/{anything} for GET
        { url: /^\/comment\/post\/[^\/]+$/, methods: ['GET'] },  // Match /comment/post/{anything} for GET
        { url: '/comment', methods: ['GET'] },
        { url: '/post', methods: ['GET'] },  // Allow GET to /post
        { url: /^\/resource\/image\/[^\/]+$/, methods: ['GET'] },  // Allow GET to /resource/image/{anything}
    ]
}));

// Add AUTH middleware for params queries
// To block queries without Authentication
app.use(authenticateTokenForParams);



app.use('/auth', authRoutes);
app.use('/comment', commentsRoutes);
app.use('/post', postsRoutes);
app.use("/user/:id", validateUser);
app.use('/user', usersRoutes);
app.use('/resource', resource_routes);
app.use('/room', roomsRoutes);

export { app, corsOptions };
