import request from 'supertest';
import {app} from '../app'; // Assuming your Express app is exported from this file


let accessToken1: string;
let accessToken2: string;

const user1 = {
    email: "userRouteTest1@test.com",
    password: "123456",
    username: "userRouteTest1",
    id: undefined,
    createdAt: undefined,
    updatedAt: undefined
};

const user2 = {
    email: "userRouteTest2@test.com",
    password: "123456",
    username: "userRouteTest2",
    id: undefined,
    createdAt: undefined,
    updatedAt: undefined
};


describe('User Routes', () => {
    beforeAll(async () => {
        // Generate tokens for authenticated users
        // Register and login to get access token

        const regRes1 = await request(app).post('/auth/register').send(user1);
        const loginResponse1 = await request(app).post('/auth/login').send(user1);
        user1.id = loginResponse1.body.userId;
        user1.createdAt = regRes1.body.createdAt;
        user1.updatedAt = regRes1.body.updatedAt;
        accessToken1 = loginResponse1.body.accessToken;

        // Register and login to get access token

        const regRes2 = await request(app).post('/auth/register').send(user2);
        const loginResponse2 = await request(app).post('/auth/login').send(user2);
        user2.id = loginResponse2.body.userId;
        user2.createdAt = regRes2.body.createdAt;
        user2.updatedAt = regRes2.body.updatedAt;
        accessToken2 = loginResponse2.body.accessToken;
    });

    describe('GET /user', () => {
        it('should return a list of users', async () => {
            const res = await request(app)
                .get('/user')
                .set('Authorization', `Bearer ${accessToken1}`);
            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
        });
    });

    describe('GET /user/:id', () => {
        it('should return a user by ID', async () => {
            const res = await request(app)
                .get(`/user/${user1.id}`)
                .set('Authorization', `Bearer ${accessToken1}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('id', user1.id);
        });

        it('should return 403 even if user not found', async () => {
            console.info("the user is not authorized to perform on another user even if not exist")

            const res = await request(app)
                .get('/user/000000000000000000000000')
                .set('Authorization', `Bearer ${accessToken1}`);
            expect(res.status).toBe(403);
        });
    });

    describe('PATCH /user/:id', () => {
        it('should update a user by ID', async () => {
            const newUser1 = { username: 'UpdatedName', email:"newmail@gmail.com" }

            const res = await request(app)
                .patch(`/user/${user1.id}`)
                .set('Authorization', `Bearer ${accessToken1}`)
                .send(newUser1);
            expect(res.status).toBe(200);
            expect(res.body.username).toBe(newUser1.username);
            expect(res.body.email).toBe(newUser1.email);
            expect(res.body.createdAt).toBe(user1.createdAt);
            expect(new Date(res.body.updatedAt).getTime()).toBeGreaterThan(new Date(user1.updatedAt as unknown as string).getTime());
            user1.updatedAt = res.body.updatedAt;
            user1.username = res.body.username;
            user1.email = res.body.email;
        });

        it('should update a user password by ID', async () => {
            const newUser1 = { password: '821njK@92', email:"newmail11@gmail.com" }

            const res = await request(app)
                .patch(`/user/${user1.id}`)
                .set('Authorization', `Bearer ${accessToken1}`)
                .send(newUser1);
            expect(res.status).toBe(200);
            expect(res.body.email).toBe(newUser1.email);
            expect(res.body.createdAt).toBe(user1.createdAt);
            expect(new Date(res.body.updatedAt).getTime()).toBeGreaterThan(new Date(user1.updatedAt as unknown as string).getTime());
            user1.updatedAt = res.body.updatedAt;
            user1.username = res.body.username;
            user1.email = res.body.email;
        });

        it('should return 403 if trying to update another user', async () => {
            const res = await request(app)
                .patch(`/user/${user2.id}`)
                .set('Authorization', `Bearer ${accessToken1}`)
                .send({ name: 'Updated Name' });
            expect(res.status).toBe(403);
        });
    });


    describe('User Routes that will not pass for invalid or violations', () => {
        describe('GET /user/:id without Authorization header', () => {
            it('should return 401 for missing Authorization header', async () => {
                const res = await request(app).get(`/user/${user1.id}`);
                expect(res.status).toBe(401);
            });
        });

        describe('PATCH /user/:id with empty request body', () => {
            it('should return 200 for empty request body - the user is the same, and an empty body is fine', async () => {
                const res = await request(app)
                    .patch(`/user/${user1.id}`)
                    .set('Authorization', `Bearer ${accessToken1}`)
                    .send({});
                expect(res.status).toBe(200);
            });
        });

        describe('PATCH /user/:id with invalid data types', () => {
            it('should return 400 for invalid data types', async () => {
                const res = await request(app)
                    .patch(`/user/${user1.id}`)
                    .set('Authorization', `Bearer ${accessToken1}`)
                    .send({ username: 12345, email: true });
                expect(res.status).toBe(400);
            });
        });
    });


    describe('DELETE /user/:id', () => {
        it('should delete a user by ID', async () => {
            const res = await request(app)
                .delete(`/user/${user1.id}`)
                .set('Authorization', `Bearer ${accessToken1}`);
            expect(res.status).toBe(200);
        });

        it('should return 403 if trying to delete another user', async () => {
            const res = await request(app)
                .delete(`/user/${user2.id}`)
                .set('Authorization', `Bearer ${accessToken1}`);
            expect(res.status).toBe(403);
        });

        it('should return 403 if user not found', async () => {
            console.info("the user is not authorized to perform on another user even if not exists")

            const res = await request(app)
                .delete('/user/000000000000000000000000')
                .set('Authorization', `Bearer ${accessToken1}`);
            expect(res.status).toBe(403);
        });
    });

});

