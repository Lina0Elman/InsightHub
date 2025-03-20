import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import authRoutes from './routes/auth_routes';
import commentsRoutes from './routes/comments_routes';
import postsRoutes from './routes/posts_routes';
import usersRoutes from './routes/users_routes';
import swaggerUi, { JsonObject } from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import options from './docs/swagger_options';
import { authenticateToken, authenticateTokenForParams } from "./middleware/auth";
import bodyParser from 'body-parser';
import roomsRoutes from './routes/rooms_routes';
import cors from 'cors';
import { config } from "./config/config";
import validateUser from "./middleware/validateUser";
import loadOpenApiFile from "./openapi/openapi_loader";
import resource_routes from './routes/resources_routes';

const specs = swaggerJsdoc(options);

const router = express.Router();

const corsOptions = {
    origin: [config.app.frontend_url(), config.app.backend_url()],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies to be sent with requests
};

router.use(cors(corsOptions));

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

router.use(bodyParser.json());
router.use(removeUndefinedOrEmptyFields);
router.use(bodyParser.urlencoded({ extended: true }));

router.use('/api-docs', swaggerUi.setup(loadOpenApiFile() as JsonObject), swaggerUi.serve);

// Add Authentication for all routes except the ones listed below
router.use(authenticateToken.unless({
    path: [
        { url: '/api/auth/login' },
        { url: '/api/auth/social' },
        { url: '/api/auth/register' },
        { url: '/api/auth/refresh' },
        { url: '/api/auth/logout' },
        { url: /^\/socket.io\/[^\/]+$/, methods: ['GET'] },
        { url: /^\/api\/api-docs\/[^\/]+$/, methods: ['GET'] },
        { url: /^\/api\/post\/[^\/]+$/, methods: ['GET'] },
        { url: /^\/api\/comment\/[^\/]+$/, methods: ['GET'] },
        { url: /^\/api\/comment\/post\/[^\/]+$/, methods: ['GET'] },
        { url: '/api/comment', methods: ['GET'] },
        { url: '/api/post', methods: ['GET'] },
        { url: /^\/api\/resource\/image\/[^\/]+$/, methods: ['GET'] },
    ]
}));

// Add AUTH middleware for params queries
router.use(authenticateTokenForParams);

router.use('/auth', authRoutes);
router.use('/comment', commentsRoutes);
router.use('/post', postsRoutes);
router.use("/user/:id", validateUser);
router.use('/user', usersRoutes);
router.use('/resource', resource_routes);
router.use('/room', roomsRoutes);

const app = express();

app.use('/api', router);
app.use('/', express.static('/dist'));
app.use((req, res) => {
    res.redirect('/');
});
export { app, corsOptions };
