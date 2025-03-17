import { Request, Response } from 'express';
import { config } from '../config/config';
import fs from 'fs';
import path from 'path';
import { uploadImage } from '../services/resources_service';
import multer from 'multer';
import {CustomRequest} from "types/customRequest";
import {updateUserById} from "../services/users_service";
import {handleError} from "../utils/handle_error";


const createUserImageResource = async (req: CustomRequest, res: Response) => {
    try {
        const imageFilename = await uploadImage(req);

        const updatedUser = updateUserById(req.user.id, {imageFilename});

        return res.status(201).send(updatedUser);
    } catch (error) {
        handleError(error, res);
    }
};

const createImageResource = async (req: Request, res: Response) => {
    try {
        const imageFilename = await uploadImage(req);
        return res.status(201).send(imageFilename);
    } catch (error) {
        if (error instanceof multer.MulterError || error instanceof TypeError) {
            return res.status(400).send(error.message);
        } else {
            handleError(error, res);
        }
    }
};

const getImageResource = async (req: Request, res: Response) => {
    try {
        const { filename } = req.params;
        const imagePath = path.resolve(config.resources.imagesDirectoryPath(), filename);

        if (!fs.existsSync(imagePath)) {
            return res.status(404).send('Image not found');
        }

        res.sendFile(imagePath);
    } catch (error) {
        handleError(error, res);
    }
};

export default { createUserImageResource, createImageResource, getImageResource };