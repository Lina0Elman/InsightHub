import multer from 'multer';
import { config } from '../config/config';
import fs from 'fs';
import path from 'path';
import { uploadImage } from '../services/resources_service';
import { Request, Response } from 'express';

const createImageResource = async (req: Request, res: Response) => {
    const upload = uploadImage.single('file');
    upload(req, res, error => {
        if (error instanceof multer.MulterError) {
            return res.status(400).send(error.message);
        } else if (error instanceof TypeError) {
            return res.status(400).send(error.message);
        } else if (!req.file) {
            return res.status(400).send('No file uploaded.');
        } else if (error) {
            return res.status(500).send("Internal Server Error");
        }

        return res.status(201).send(req.file.filename);
    })
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
        res.status(500).send('Internal Server Error');
    }
};

export default { createImageResource, getImageResource };
