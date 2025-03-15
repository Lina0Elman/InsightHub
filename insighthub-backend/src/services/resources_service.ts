import { config } from '../config';
import multer from 'multer';
import path from 'path';
import { randomUUID } from 'crypto';
import fs from 'fs';
import { consts } from '../consts';

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
            fileSize: config.resources.imageMaxSize()
        },
        fileFilter: (req, file, cb) => {
            const allowedTypes = /jpeg|jpg|png|gif/;
            const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
            const mimetype = allowedTypes.test(file.mimetype);

            if (extname && mimetype) {
                return cb(null, true);
            } else {
                return cb(new TypeError(`Invalid file type. Only images are allowed: ${allowedTypes}`));
            }
        }
    });

    return uploadImage;
};

const uploadImage = (req) : Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        createImagesStorage().single('file')(req, {}, (error) => {
            if (error) {
                if (error instanceof multer.MulterError || error instanceof TypeError) {
                    return reject(error);
                } else if (!req.file) {
                    return reject(new TypeError(consts.errorMessages.NoFileUploaded));
                } else {
                    return reject(new Error(consts.errorMessages.internalServerError));
                }
            }
            resolve(req.file.filename);
        });
    });
};

export { uploadImage };