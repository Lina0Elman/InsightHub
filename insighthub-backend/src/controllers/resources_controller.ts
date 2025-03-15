import { config } from '../config';
import fs from 'fs';
import path from 'path';
import { uploadImage } from '../services/resources_service';
import userModel from '../models/user_model';
import { consts } from '../consts';
import multer from 'multer';


const createUserImageResource = async (req, res) => {
    try {
        const imageFilename = await uploadImage(req);
        const user = await userModel.findById(req.query.userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        user.imageFilename = imageFilename;
        await user.save();
        return res.status(201).send(user);
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

const createImageResource = async (req, res) => {
    try {
        const imageFilename = await uploadImage(req);
        return res.status(201).send(imageFilename);
    } catch (error) {
        if (error instanceof multer.MulterError || error instanceof TypeError) {
            return res.status(400).send(error.message);
        } else {
            return res.status(500).send(error.message);
        }
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

export default { createUserImageResource, createImageResource, getImageResource };
