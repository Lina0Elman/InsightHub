import request from 'supertest';
import { app } from '../app';
import {PostModel} from '../models/posts_model'; // Adjust the path as necessary
import {UserModel} from '../models/user_model';
import {UserData} from "types/user_types";
import {PostData} from "types/post_types"; // Adjust the path as necessary

let existingPost: PostData;

// @ts-ignore
interface UserInfo extends UserData {
    id?: string;
    accessToken?: string;
    password: string;
}
const userInfo:UserInfo = {
    email: "user1@gmail.com",
    username: "user1",
    password: "123456"
}

const userInfo2:UserInfo = {
    email: "user2@gmail.com",
    username: "user2",
    password: "123456"
}

const testPost1 = {
    "title": "POST1 TITLE",
    "content": "POST1 CONTENT"
};
const testPost2 = {
    "title": "POST2 TITLE",
    "content": "POST2 CONTENT"
};
const testPost3 = {
    "title": "POST3 TITLE",
    "content": "POST3 CONTENT"
};
const testUpdatedPost = {
    "title": "UPDATED POST TITLE",
    "content": "UPDATED POST CONTENT"
};

const testPost4 = {
    "title": "POST4 TITLE",
    "content": "POST4 CONTENT"
}

const addUser = async (userInfo: UserInfo) => {
    await request(app).post('/auth/register').send(userInfo);
    const loginResponse = await request(app).post('/auth/login').send(userInfo);
    userInfo.accessToken = loginResponse.body.accessToken;
    userInfo.id = loginResponse.body.userId;
}

beforeAll(async () => {
    // Clear the DB
    await PostModel.deleteMany();
    await UserModel.deleteMany();

    await addUser(userInfo);
    await addUser(userInfo2);
});

describe('given db empty of posts when http request GET /post', () => {
    it('then should return empty list', async () => {
        const res = await request(app)
            .get('/post')
            .set('Authorization', `jwt ` + userInfo.accessToken);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });
});

describe('when http request POST /post', () => {
    it('then should add post to the db', async () => {

        const currentTime = Date.now();
        const res = await request(app)
            .post('/post')
            .set('Authorization', `jwt ` + userInfo.accessToken)
            .send(testPost1);
        const resBody = res.body;
        existingPost = { ...resBody };

        expect(res.statusCode).toBe(201);
        expect(resBody.title).toEqual(testPost1.title);
        expect(resBody.content).toEqual(testPost1.content);
        expect(resBody.owner).toEqual(userInfo.id);
        expect(new Date(resBody.createdAt).getTime()).toBeGreaterThan(currentTime);
        
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
            .set('Authorization', `jwt ` + userInfo.accessToken)
            .send(testPost1);
        // Post 2
        await request(app)
            .post('/post')
            .set('Authorization', `jwt ` + userInfo.accessToken)
            .send(testPost2);

        // Post 3
        await request(app)
            .post('/post')
            .set('Authorization', `jwt ` + userInfo.accessToken)
            .send(testPost3);

        // Post 4 another owner
        await request(app)
            .post('/post')
            .set('Authorization', `jwt ` + userInfo2.accessToken)
            .send(testPost4);
    });
});

describe('given db initialized with posts when http request GET /post', () => {
    it('then should return all posts in the db', async () => {
        const res = await request(app)
            .get('/post')
            .set('Authorization', `jwt ` + userInfo.accessToken);
        expect(res.statusCode).toBe(200);
        expect(res.body.posts).not.toEqual([]);
        expect(res.body.posts.length).toBeGreaterThan(1);
    });
});

describe('Check the private and public route for the auth need', () => {
    it('should allow GET /post without authentication', async () => {
        const response = await request(app).get('/post');
        expect(response.status).toBe(200);
    });

    it('should allow GET /post/:id without authentication', async () => {
        const response = await request(app).get(`/post/${existingPost.id}`);
        expect(response.status).toBe(200);
    });

    it('should not allow GET /post?owner without authentication', async () => {
        const response = await request(app).get(`/post?owner${existingPost.owner}`);
        expect(response.status).toBe(401);
    });
});

// TODO - change th test to get posts by owner.username
describe('given username when http request GET /post?username', () => {
    it('then should return a post', async () => {
        const res = await request(app)
            .get(`/post?username=${userInfo.username}`)
            .set('Authorization', `jwt ` + userInfo.accessToken);

        expect(res.statusCode).toBe(200);
        res.body.posts.forEach((post: PostData) => {
            expect(post.owner).toEqual(userInfo.id);
        });
    });
});

describe('given unknown userId when http request GET /post?owner', () => {
    it('then should return empty list', async () => {
        const res = await request(app)
            .get('/post?owner=67c8975b8a05aa910017a481')
            .set('Authorization', `jwt ` + userInfo.accessToken);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });
});


describe('given existing username when http request GET /post?owner', () => {
    it('then should return his posts only', async () => {
        // Fetch all posts
        const resAllPosts = await request(app)
            .get('/post')
            .set('Authorization', `jwt ` + userInfo.accessToken);
        const allPosts = resAllPosts.body;

        // Fetch posts by specific user
        const resUserPosts = await request(app)
            .get(`/post?owner=${userInfo2.id}`)
            .set('Authorization', `jwt ` + userInfo.accessToken);
        const userPosts = resUserPosts.body;

        // Check that the response status is 200
        expect(resUserPosts.statusCode).toBe(200);

        // Check that the user posts are a subset of all posts
        const userPostIds = userPosts.posts.map((post: { id: string; }) => post.id);
        const allPostIds = allPosts.posts.map((post: { id: string; }) => post.id);
        userPostIds.forEach((id: string) => {
            expect(allPostIds).toContain(id);
        });

        // Check that all posts belong to the user
        userPosts.posts.forEach((post: PostData) => {
            expect(post.owner).toEqual(userInfo2.id);
        });
    });
});

describe('when http request PUT /post/id of unknown post', () => {
    it('then should return 400 bad request http status', async () => {
        const res = await request(app)
            .put(`/post/UNKNOWN`)
            .set('Authorization', `jwt ` + userInfo.accessToken)
            .send(testUpdatedPost);

        expect(res.statusCode).toBe(400);
    });
});

describe('when http request PUT /post/id of existing post', () => {
    it('then should update post in the db', async () => {
        const resOldPost = await request(app)
            .get(`/post/${existingPost.id}`)
            .set('Authorization', `jwt ` + userInfo.accessToken)

        const oldPost = resOldPost.body;
        const res = await request(app)
            .put(`/post/${existingPost.id}`)
            .set('Authorization', `jwt ` + userInfo.accessToken)
            .send(testUpdatedPost);
        const updatedPost = res.body;

        expect(res.statusCode).toBe(200);

        expect(updatedPost.title).toEqual(testUpdatedPost.title);
        expect(updatedPost.content).toEqual(testUpdatedPost.content);
        expect(updatedPost.owner).toEqual(oldPost.owner);
        expect(updatedPost.createdAt).toEqual(oldPost.createdAt);
        expect((new Date(updatedPost.updatedAt)).getTime()).toBeGreaterThan((new Date(oldPost.updatedAt)).getTime());

    });
});


// TODO - Change to another authenticated user instead of sender
describe('when http request PUT /post/id of existing post but without being the owner', () => {
    it('then should return 403 forbidden http status', async () => {
        const body = {
            "title": "UPDATED POST TITLE",
            "content": "UPDATED POST CONTENT"
        };
        const res = await request(app)
            .put(`/post/${existingPost.id}`)
            .set('Authorization', `jwt ` + userInfo2.accessToken)
            .send(body);

        expect(res.statusCode).toBe(403);
    });
});

describe('when http request PUT /post/id of non existing post', () => {
    it('then should return 404 forbidden http status', async () => {
        const body = {
            "title": "UPDATED POST TITLE",
            "content": "UPDATED POST CONTENT"
        };
        const res = await request(app)
            .put(`/post/67c8a86f81a290f10000e313`)
            .set('Authorization', `jwt ` + userInfo.accessToken)
            .send(body);

        expect(res.statusCode).toBe(404);
    });
});