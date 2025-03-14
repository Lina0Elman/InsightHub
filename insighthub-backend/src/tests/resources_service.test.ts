import request from 'supertest';
import app from '../app';
import fs from 'fs';
import path from 'path';

describe('Resources Service - Upload Image', () => {
    let accessToken: string;
    let uploadedFileName: string;

    beforeAll(async () => {
        // Register and login to get access token
        const user = {
            email: "test@resources.com",
            password: "123456"
        };
        await request(app).post('/auth/register').send(user);
        const loginResponse = await request(app).post('/auth/login').send(user);
        accessToken = loginResponse.body.accessToken;
    });

    const generateImageBlob = () => {
        // Simulate a small PNG image file
        return Buffer.from([
            0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
            0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
            0x49, 0x48, 0x44, 0x52, // IHDR chunk type
            0x00, 0x00, 0x00, 0x01, // width: 1
            0x00, 0x00, 0x00, 0x01, // height: 1
            0x08, 0x06, 0x00, 0x00, 0x00, // bit depth, color type, compression, filter, interlace
            0x1F, 0x15, 0xC4, 0x89, // CRC
            0x00, 0x00, 0x00, 0x0A, // IDAT chunk length
            0x49, 0x44, 0x41, 0x54, // IDAT chunk type
            0x78, 0x9C, 0x63, 0x60, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, // compressed data
            0x0D, 0x0A, 0x2D, 0xB4, // CRC
            0x00, 0x00, 0x00, 0x00, // IEND chunk length
            0x49, 0x45, 0x4E, 0x44, // IEND chunk type
            0xAE, 0x42, 0x60, 0x82  // CRC
        ]);
    };

    const generateNonImageBlob = () => {
        return Buffer.from('This is a test PDF file content', 'utf-8');
    };

    it('should upload an image successfully', async () => {
        const imageBlob = generateImageBlob();
        const res = await request(app)
            .post('/resource/image')
            .set('Authorization', `jwt ${accessToken}`)
            .attach('file', imageBlob, 'test-image.png');

        expect(res.statusCode).toBe(201);
        expect(res.text).toMatch(/\.png$/);

        // Store the uploaded file name for cleanup
        uploadedFileName = res.text;
    });

    it('should fail to upload a non-image file', async () => {
        const nonImageBlob = generateNonImageBlob();
        const res = await request(app)
            .post('/resource/image')
            .set('Authorization', `jwt ${accessToken}`)
            .attach('file', nonImageBlob, 'test-non-image.pdf');

        expect(res.statusCode).toBe(400);
        expect(res.text).toBe("Invalid file type. Only images are allowed: /jpeg|jpg|png|gif/");
    });

    it('should fail to upload an image larger than the max size', async () => {
        const largeImageBlob = Buffer.alloc(11 * 1024 * 1024); // 11MB
        const res = await request(app)
            .post('/resource/image')
            .set('Authorization', `jwt ${accessToken}`)
            .attach('file', largeImageBlob, 'large-test-image.jpg');

        expect(res.statusCode).toBe(400);
        expect(res.text).toBe("File too large");
    });

    afterAll(async () => {
        if (uploadedFileName) {
            const filePath = path.resolve(__dirname, '../../resources/images', uploadedFileName);
            fs.unlink(filePath, err => {
                if (err) throw err;
            });
        }
    });
}); 