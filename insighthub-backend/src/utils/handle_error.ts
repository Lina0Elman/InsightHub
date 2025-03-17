import { Response } from 'express';
import {ValidationError} from "types/validation_errors";
import mongoose from "mongoose";
import * as expressValidator from "express-validator";


export const isMongoValidationErrors = (err: any) => {
    return err instanceof mongoose.Error.ValidationError;
}

export const isReqValidationErrors = (err: any): err is {
    message: any; errors: expressValidator.ValidationError[]
} => {
    return Array.isArray(err.errors) && err.errors.every((error: any) => {
        return typeof (error.param === 'string' || error.path === 'string') && typeof error.msg === 'string';
    });
};


export const handleError = (err: any, res: Response) => {
    if (isMongoValidationErrors(err)) {
        const errors: ValidationError[] = Object.keys(err.errors).map(field => ({
            field,
            message: err.errors[field].message,
            value: err.errors[field].value
        }));
        res.status(400).json({ message: err.message, errors });
    } else if (isReqValidationErrors(err)) {
        const errors: ValidationError[] = err.errors.map((error: any) => ({
            field: error.parm ?? error.path ,
            message: error.msg,
            value: error.value
        }));
        res.status(400).json({ message: err.message, errors });
    } else {
        res.status(500).json({ message: err.message });
    }
};