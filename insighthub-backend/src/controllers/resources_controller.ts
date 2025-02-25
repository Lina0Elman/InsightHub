import multer from 'multer';

const createImageResource = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        res.status(201).send({ imagePath: req.file.path });
    } catch (error) {
        if (error instanceof multer.MulterError) {
            return res.status(400).send(error.message);
        }
        res.status(500).send("Internal Server Error");
    }
};

export default { createImageResource };
