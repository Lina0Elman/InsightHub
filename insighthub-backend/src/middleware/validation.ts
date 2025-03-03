import {body, param, validationResult} from 'express-validator';
import {Request, Response, NextFunction} from "express";
import {handleError} from "../utils/handle_error";


export const validatePostId = [
    body('postId').isMongoId().withMessage('Invalid post ID'),
    ]

export const validateComment = [
    ...validatePostId,
    body('content').isString().isLength({ min: 1 }).withMessage('Content is required'),
    body('author').isMongoId().withMessage('Invalid user ID'),
];

export const validateCommentId = [
    param('comment_id').isMongoId().withMessage('Invalid comment ID'),
];


export const validateEmailPassword = [
    body('email').optional().isEmail().withMessage('Invalid email format'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ];

export const validateUserDataOptional = [
    body('username').optional().notEmpty().withMessage('Username is required'),
    ...validateEmailPassword
];

export const validateUserRegister = [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').notEmpty().withMessage('Email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    ...validateUserDataOptional
] ;

export const validateUserId = [
    param('id').isMongoId().withMessage('Invalid user ID'),
];

export const validateLogin = [
    body('email').notEmpty().withMessage('Email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    ...validateEmailPassword
];

export const validateRefreshToken = [
    body('refreshToken').notEmpty().withMessage('Refresh token is required').isString().withMessage('Refresh token must be a string'),
];

export const validatePostDataOptional = [
    body('title').optional().isString().isLength({ min: 1 }).withMessage('Title is required'),
    body('content').optional().isString().isLength({ min: 1 }).withMessage('Content is required'),
];

export const validatePostData = [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    ...validatePostDataOptional
];

export const validatePostIdParam = [
    param('post_id').isMongoId().withMessage('Invalid post ID'),
];

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return handleError({ errors: errors.array(), message: 'Validation failed' }, res);
    }
    next();
};