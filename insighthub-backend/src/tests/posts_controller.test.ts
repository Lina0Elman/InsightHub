import request from 'supertest';
import app from '../app';
import postsModel from '../models/posts_model'; // Adjust the path as necessary
import userModel from '../models/user_model'; // Adjust the path as necessary
import mongoose from 'mongoose';
import likeModel from '../models/like_model';

let existingPost = null;

type UserInfo = {
    email: string;
    password: string;
    accessToken?: string;
    _id?: string;
}
const userInfo:UserInfo = {
    email: "berrebimevo@gmail.com",
    password: "123456"
}

const testPost1 = {
    "sender": "USERNAME1",
    "title": "POST1 TITLE",
    "content": "POST1 CONTENT"
};
const testPost2 = {
    "sender": "USERNAME2",
    "title": "POST2 TITLE",
    "content": "POST2 CONTENT"
};
const testPost3 = {
    "sender": "USERNAME2",
    "title": "POST2 TITLE",
    "content": "POST2 CONTENT"
};
const testUpdatedPost = {
    "sender": "UPDATED USERNAME",
    "title": "UPDATED POST TITLE",
    "content": "UPDATED POST CONTENT"
};

beforeAll(async () => {
    // Clear the DB
    await postsModel.deleteMany();
    await userModel.deleteMany();	
    // Register and login to get access token
    await request(app).post('/auth/register').send(userInfo);
    const loginResponse = await request(app).post('/auth/login').send(userInfo);

    userInfo.accessToken = loginResponse.body.accessToken;
    userInfo._id = loginResponse.body._id;
});

describe('given db empty of posts when http request GET /post', () => {
    it('then should return empty list', async () => {
        const res = await request(app).get('/post');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });
});

describe('when http request POST /post', () => {
    it('then should add post to the db', async () => {
        const res = await request(app)
            .post('/post')
            .set('Authorization', `jwt ${userInfo.accessToken}`)
            .send(testPost1);
        const resBody = res.body;
        existingPost = { ...resBody };
        delete resBody._id;
        expect(res.statusCode).toBe(201);
        expect(resBody).toEqual(testPost1);
    });
});

/**
 * Already tested this.
 * We need this just for initializing some more posts.
 */
describe('when http request POST /post', () => {
    it('then should add posts to the db', async () => {
        // Post 1
        await request(app)
            .post('/post')
            .set('Authorization', `jwt ${userInfo.accessToken}`)
            .send(testPost1);
        // Post 2
        await request(app)
            .post('/post')
            .set('Authorization', `jwt ${userInfo.accessToken}`)
            .send(testPost2);

        // Post 3
        await request(app)
            .post('/post')
            .set('Authorization', `jwt ${userInfo.accessToken}`)
            .send(testPost3);
    });
});

describe('when http request POST /post without required sender field', () => {
    it('then should return 400 bad request http status', async () => {
        const tempPostTest = {
            "title": "POST1 TITLE",
            "content": "POST1 CONTENT"
        };
        const res = await request(app)
            .post('/post')
            .set('Authorization', `jwt ${userInfo.accessToken}`)
            .send(tempPostTest);

        expect(res.statusCode).toBe(400);
    });
});

describe('given db initialized with posts when http request GET /post', () => {
    it('then should return all posts in the db', async () => {
        const res = await request(app).get('/post');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});

describe('given unknown username when http request GET /post?sender', () => {
    it('then should return empty list', async () => {
        const res = await request(app).get('/post?sender=UNKNOWN');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });
});

describe('given existing username when http request GET /post?sender', () => {
    it('then should return his posts only', async () => {
        const res = await request(app).get('/post?sender=USERNAME1');
        const resBody = res.body;
        const senderList = resBody.map((post) => post.sender);

        // Use filter and return array with unique values
        const uniqueSenderList = senderList.filter(
            (e, i, self) => i === self.indexOf(e));

        expect(res.statusCode).toBe(200);
        expect(uniqueSenderList.length).toBe(1);
        expect(uniqueSenderList[0]).toEqual(resBody[0].sender);
    });
});

describe('when http request PUT /post/id of unknown post', () => {
    it('then should return 404 not found http status', async () => {
        const res = await request(app)
            .put(`/post/${new mongoose.Types.ObjectId()}`)
            .set('Authorization', `jwt ${userInfo.accessToken}`)
            .send(testUpdatedPost);

        expect(res.statusCode).toBe(404);
    });
});

describe('when http request PUT /post/id of bad format post.id', () => {
    it('then should return 400 bad request http status', async () => {
        const res = await request(app)
            .put(`/post/UNKNOWN`)
            .set('Authorization', `jwt ${userInfo.accessToken}`)
            .send(testUpdatedPost);

        expect(res.statusCode).toBe(400);
    });
});

describe('when http request PUT /post/id of existing post', () => {
    it('then should update post in the db', async () => {
        const res = await request(app)
            .put(`/post/${existingPost._id}`)
            .set('Authorization', `jwt ${userInfo.accessToken}`)
            .send(testUpdatedPost);
        const resBody = res.body;
        delete resBody._id;

        expect(res.statusCode).toBe(201);
        expect(resBody).toEqual(testUpdatedPost);
    });
});

describe('when http request PUT /post/id of existing post but without required sender field', () => {
    it('then should return 400 bad request http status', async () => {
        const body = {
            "title": "UPDATED POST TITLE",
            "content": "UPDATED POST CONTENT"
        };
        const res = await request(app)
            .put(`/post/${existingPost._id}`)
            .set('Authorization', `jwt ${userInfo.accessToken}`)
            .send(body);

        expect(res.statusCode).toBe(400);
    });
});

describe('Posts Controller', () => {
    describe('GET /post', () => {
        it('should return all posts', async () => {
            const response = await request(app).get('/post');
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

        it('should return posts by sender', async () => {
            const sender = 'testSender';
            const response = await request(app).get(`/post?sender=${sender}`);
            expect(response.status).toBe(200);
        });

        it('should handle errors gracefully', async () => {
            jest.spyOn(postsModel, 'find').mockImplementationOnce(() => {
                throw new Error('Database error');
            });
            const response = await request(app).get('/post');
            expect(response.status).toBe(400);
            expect(response.text).toBe('Bad Request');
        });
    });

    describe('POST /post', () => {
        it('should create a new post', async () => {
            const newPost = { title: 'Test Post', sender: 'testSender', content: 'Test Content' };
            const response = await request(app)
                .post('/post')
                .set('Authorization', `jwt ${userInfo.accessToken}`)
                .send(newPost);
            expect(response.status).toBe(201);
            expect(response.body.title).toBe(newPost.title);
        });

        it('should return 400 for invalid post data', async () => {
            const invalidPost = { title: '' }; // Assuming title is required
            const response = await request(app)
                .post('/post')
                .set('Authorization', `jwt ${userInfo.accessToken}`)
                .send(invalidPost);
            expect(response.status).toBe(400);
            expect(response.text).toBe('Bad Request');
        });
    });
});
