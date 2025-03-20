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

router.use('/api-docs', (req: Request, res: Response, next: NextFunction) => {
    const prefix = req.headers['x-forwarded-prefix'] as string || '';
    const swaggerDoc = loadOpenApiFile(prefix) as JsonObject;
    swaggerUi.setup(swaggerDoc)(req, res, next);
}, swaggerUi.serve);

// Add Authentication for all routes except the ones listed below
router.use(authenticateToken.unless({
    path: [
        { url: '/auth/login' },
        { url: '/auth/social' },
        { url: '/auth/register' },
        { url: '/auth/refresh' },
        { url: '/auth/logout' },
        { url: /^\/post\/[^\/]+$/, methods: ['GET'] },
        { url: /^\/comment\/[^\/]+$/, methods: ['GET'] },
        { url: /^\/comment\/post\/[^\/]+$/, methods: ['GET'] },
        { url: '/comment', methods: ['GET'] },
        { url: '/post', methods: ['GET'] },
        { url: /^\/resource\/image\/[^\/]+$/, methods: ['GET'] },
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

// Serve static files from the /static directory
app.use('/static', express.static(path.join(__dirname, 'static')));

app.use('/api', router);

export { app, corsOptions };
g