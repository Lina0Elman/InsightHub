import { config } from '../config';
import multer from 'multer';
import path from 'path';
import { randomUUID } from 'crypto';
import fs from 'fs';

const createImagesStorage = () => {
    
    // Ensure the directory exists
    const imagesResourcesDir = config.resources.imagesDirectoryPath();
    if (!fs.existsSync(imagesResourcesDir)) {
        fs.mkdirSync(imagesResourcesDir, { recursive: true });
    }

    const imagesStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `${imagesResourcesDir}/`);
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const id = randomUUID();
            cb(null, id + ext);
        }
    });

    const uploadImage = multer({
        storage: imagesStorage,
        limits: {
            fileSize: 10 * 1024 * 1024 // Max file size: 10MB
        },
        fileFilter: (req, file, cb) => {
            const allowedTypes = /jpeg|jpg|png|gif/;
            const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
            const mimetype = allowedTypes.test(file.mimetype);

            if (extname && mimetype) {
                return cb(null, true);
            } else {
                cb(new Error('Invalid file type. Only images are allowed.'));
            }
        }
    });

    return uploadImage;
};

const uploadImage = createImagesStorage();

export { uploadImage };