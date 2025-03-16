import request from 'supertest';
import { app } from '../app';
import roomModel from '../models/room_model';

describe('Rooms Controller', () => {
    let initiatorUser :any = {
        email: "test@resources.com",
        password: "123456"
    };
    let receiverUser :any = {
        email: "test2@resources.com",
        password: "123456"
    };

    beforeAll(async () => {
        // Register and login to get access token
        await request(app).post('/auth/register').send(initiatorUser);
        const loginResponse = await request(app).post('/auth/login').send(initiatorUser);
        initiatorUser = loginResponse.body;

        // Register and login to get access token
        await request(app).post('/auth/register').send(receiverUser);
        const loginResponse2 = await request(app).post('/auth/login').send(receiverUser);
        receiverUser = loginResponse2.body;
    });

    afterEach(async () => {
        // Clean up the database after each test
        await roomModel.deleteMany({});
    });

    it('should return a room if it exists for the given user IDs', async () => {
        // Create a room for testing
        const room = await roomModel.create({
            userIds: [initiatorUser._id, receiverUser._id]
        });

        const response = await request(app)
            .get(`/room/user/${receiverUser._id}`)
            .set('Authorization', `Bearer ${initiatorUser.accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id', room._id.toString());
        expect(response.body.userIds).toEqual(expect.arrayContaining([receiverUser._id, initiatorUser._id]));
    });

    it('should create a new room if it does not exist', async () => {
        const response = await request(app)
            .get(`/room/user/${receiverUser._id}`)
            .set('Authorization', `Bearer ${initiatorUser.accessToken}`)

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('userIds');
        expect(response.body.userIds).toEqual(expect.arrayContaining([receiverUser._id, initiatorUser._id]));
    });

    it('should return 400 for invalid user IDs', async () => {
        const response = await request(app)
            .get(`/room/user/invalidUserId`)
            .set('Authorization', `Bearer ${initiatorUser.accessToken}`)
            .query({ userId: 'invalidUserId' });

        expect(response.status).toBe(400);
        expect(response.text).toBe("Bad Request");
    });
}); 