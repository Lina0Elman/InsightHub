import request from 'supertest';
import { app } from '../app';
import roomModel from '../models/room_model';

describe('Rooms Controller', () => {
    let initiatorUser :any = {
        username: "test",
        email: "test@resources.com",
        password: "123456"
    };
    let receiverUser :any = {
        username: "test2",
        email: "test2@resources.com",
        password: "123456"
    };

    beforeAll(async () => {
        // Register and login to get access token
        await request(app).post('/api/auth/register').send(initiatorUser);
        const loginResponse = await request(app).post('/api/auth/login').send(initiatorUser);
        initiatorUser = loginResponse.body;

        // Register and login to get access token
        await request(app).post('/api/auth/register').send(receiverUser);
        const loginResponse2 = await request(app).post('/api/auth/login').send(receiverUser);
        receiverUser = loginResponse2.body;
    });

    afterEach(async () => {
        // Clean up the database after each test
        await roomModel.deleteMany({});
    });

    it('should return a room if it exists for the given user IDs', async () => {
        // Create a room for testing
        const room = await roomModel.create({
            userIds: [initiatorUser.userId, receiverUser.userId]
        });

        const response = await request(app)
            .get(`/api/room/user/${receiverUser.userId}`)
            .set('Authorization', `Bearer ${initiatorUser.accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id', room._id.toString());
        expect(response.body.userIds).toEqual(expect.arrayContaining([receiverUser.userId, initiatorUser.userId]));
    });

    it('should return a room with himself if it exists for the given user IDs', async () => {
        // Create a room for testing
        const room = await roomModel.create({
            userIds: [initiatorUser.userId, receiverUser.userId]
        });

        // Create a room with himself, for testing
        const room1 = await roomModel.create({
            userIds: [initiatorUser.userId, initiatorUser.userId]
        });

        const response = await request(app)
            .get(`/api/room/user/${initiatorUser.userId}`)
            .set('Authorization', `Bearer ${initiatorUser.accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id', room1._id.toString());
        expect(response.body.userIds).toEqual(expect.arrayContaining([initiatorUser.userId, initiatorUser.userId]));
    });

    it('should create a new room if it does not exist', async () => {
        const response = await request(app)
            .get(`/api/room/user/${receiverUser.userId}`)
            .set('Authorization', `Bearer ${initiatorUser.accessToken}`);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('userIds');
        expect(response.body.userIds).toEqual(expect.arrayContaining([receiverUser.userId, initiatorUser.userId]));
    });

    it('should return 400 for invalid user IDs', async () => {
        const invalidUserId = "invalidUserId"
        const response = await request(app)
            .get(`/api/room/user/invalidUserId`)
            .set('Authorization', `Bearer ${initiatorUser.accessToken}`)
            .query({ userId: 'invalidUserId' });

        expect(response.status).toBe(400);
        expect(response.text).toBe(`{"message":"Validation failed","errors":[{"field":"receiverUserId","message":"Invalid user ID","value":"${invalidUserId}"}]}`);
    });
}); 