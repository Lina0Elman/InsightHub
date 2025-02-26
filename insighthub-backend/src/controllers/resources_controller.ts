import multer from 'multer';
import { config } from '../config';
import fs from 'fs';
import path from 'path';

const createImageResource = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        res.status(201).send(req.file.filename);
    } catch (error) {
        if (error instanceof multer.MulterError) {
            return res.status(400).send(error.message);
        }
        res.status(500).send("Internal Server Error");
    }
};

const getImageResource = async (req, res) => {
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
