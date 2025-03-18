import request from 'supertest';
import app from '../app';
import {PostData} from "types/post_types";
import {CommentData} from "types/comment_types";

let existingPost1: PostData;
let existingPost2:PostData;
let existingComment:CommentData;
let accessToken: string;

const user = {
    email: "test2@test.com",
    password: "123456",
    username: "test2",
    id: undefined
};

beforeAll(async () => {
    // Register and login to get access token

    await request(app).post('/auth/register').send(user);
    const loginResponse = await request(app).post('/auth/login').send(user);
    user.id = loginResponse.body.userId;
    accessToken = loginResponse.body.accessToken;
});

describe('given db empty of comments when http request GET /comment', () => {
    it('then should return empty list', async () => {
        const res = await request(app)
            .get('/comment')
            .set('Authorization', `jwt ${accessToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });
});

/**
 * Already tested in posts_controller.
 * We need this just for initializing `existingPost`.
 */
describe('when http request POST /post', () => {
    it('then should add post to the db', async () => {
        // Post 1
        const body1 = {
            "title": "POST1 TITLE",
            "content": "POST1 CONTENT"
        };
        const res1 = await request(app)
            .post('/post')
            .set('Authorization', `jwt ${accessToken}`)
            .send(body1);
        const resBody1 = res1.body;
        existingPost1 = { ...resBody1 };

        // Post 2
        const body2 = {
            "title": "POST2 TITLE",
            "content": "POST2 CONTENT"
        };
        const res2 = await request(app)
            .post('/post')
            .set('Authorization', `jwt ${accessToken}`)
            .send(body2);
        const resBody2 = res2.body;
        existingPost2 = { ...resBody2 };
    });
});

describe('when http request POST /comment to an unknown post', () => {
    it('then should return 400 bad request http status', async () => {
        const body = {
            "postId": "UNKNOWN",
            "content": "COMMENT1 CONTENT"
        };
        const res = await request(app)
            .post('/comment')
            .set('Authorization', `jwt ${accessToken}`)
            .send(body);

        expect(res.statusCode).toBe(400);
    });
});

describe('when http request POST /comment without required postId field', () => {
    it('then should return 400 bad request http status', async () => {
        const body = {
            "content": "COMMENT1 CONTENT"
        };
        const res = await request(app)
            .post('/comment')
            .set('Authorization', `jwt ${accessToken}`)
            .send(body);

        expect(res.statusCode).toBe(400);
    });
});

describe('when http request POST /comment  to an existing post', () => {
    it('then should add comment to the db', async () => {
        const body = {
            "postId": `${existingPost1.id}`,
            "content": "COMMENT1 CONTENT",
            owner: undefined
        };
        const res = await request(app)
            .post('/comment')
            .set('Authorization', `jwt ${accessToken}`)
            .send(body);

        body.owner = user.id;
        const resBody = res.body;
        existingComment = { ...resBody };
        delete resBody.id;
        delete resBody.createdAt;
        delete resBody.updatedAt;

        expect(res.statusCode).toBe(201);
        expect(resBody).toEqual(body);
    });
});

/**
 * Already tested this.
 * We need this just for initializing some more comments.
 */
describe('when http request POST /comment  to an existing post', () => {
    it('then should add comment to the db', async () => {
        // Comment 1
        const body1 = {
            "postId": `${existingPost1.id}`,
            "content": "COMMENT1 CONTENT"
        };
        await request(app)
            .post('/comment')
            .set('Authorization', `jwt ${accessToken}`)
            .send(body1);

        // Comment 2
        const body2 = {
            "postId": `${existingPost1.id}`,
            "content": "COMMENT2 CONTENT"
        };
        await request(app)
            .post('/comment')
            .set('Authorization', `jwt ${accessToken}`)
            .send(body2);

        // Comment 3
        const body3 = {
            "postId": `${existingPost1.id}`,
            "content": "COMMENT3 CONTENT"
        };
        await request(app)
            .post('/comment')
            .set('Authorization', `jwt ${accessToken}`)
            .send(body3);
    });
});

describe('given db initialized with comments when http request GET /comment', () => {
    it('then should return all coments in the db', async () => {
        const res = await request(app)
            .get('/comment')
            .set('Authorization', `jwt ${accessToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.statusCode).not.toEqual([]);
    });
});



describe('Check the private and public route for the auth need', () => {
    it('should allow GET /comment without authentication', async () => {
        const response = await request(app).get('/comment');
        expect(response.status).toBe(200);
    });

    it('should allow GET /comment/:id without authentication', async () => {
        const response = await request(app).get(`/comment/${existingComment.id}`);
        expect(response.status).toBe(200);
    });

    it('should not allow GET /comment?owner without authentication', async () => {
        const response = await request(app).get(`/comment?owner=${existingComment.owner}`);
        expect(response.status).toBe(401);
    });

    it('should allow GET /comment/:id without authentication', async () => {
        const response = await request(app).get(`/comment/post/${existingComment.postId}`);
        expect(response.status).toBe(200);
    });
});

describe('when http request PUT /comment/id of unknown post', () => {
    it('then should return 200 for update http status', async () => {
        const body = {
            "postId": "UNKNOWN",
            "content": "UPDATED COMMENT CONTENT"
        };
        const res = await request(app)
            .put(`/comment/${existingComment.id}`)
            .set('Authorization', `jwt ${accessToken}`)
            .send(body);
        const resBody = res.body;

        expect(res.statusCode).toBe(200);
        expect(new Date(resBody.updatedAt).getTime())
            .toBeGreaterThan(new Date(resBody.createdAt).getTime());
        delete resBody.id;
        delete resBody.createdAt;
        delete resBody.updatedAt;
        expect(resBody.postId).toEqual(existingPost1.id);
    });
});

describe('when http request PUT /comment/id of unknown comment', () => {
    it('then should return 400 bad request http status', async () => {
        const body = {
            "postId": `${existingPost1.id}`,
            "content": "UPDATED COMMENT CONTENT"
        };
        const res = await request(app)
            .put(`/comment/UNKNOWN`)
            .set('Authorization', `jwt ${accessToken}`)
            .send(body);

        expect(res.statusCode).toBe(400);
    });
});

describe('when http request PUT /comment/id without required postId field', () => {
    it('then should return 200 created http status', async () => {
        const body = {
            "content": "UPDATED COMMENT CONTENT"
        };
        const res = await request(app)
            .put(`/comment/${existingComment.id}`)
            .set('Authorization', `jwt ${accessToken}`)
            .send(body);
        const resBody = res.body;

        expect(res.statusCode).toBe(200);
        expect(new Date(resBody.updatedAt).getTime())
            .toBeGreaterThan(new Date(resBody.createdAt).getTime());
        delete resBody.id;
        delete resBody.createdAt;
        delete resBody.updatedAt;
        expect(resBody.postId).toEqual(existingPost1.id);
    });
});


describe('when http request PUT /comment/id of existing post and comment', () => {
    it('then should update comment in the db', async () => {
        const body = {
            "postId": `${existingPost1.id}`,
            "content": "UPDATED COMMENT CONTENT"
        };
        const res = await request(app)
            .put(`/comment/${existingComment.id}`)
            .set('Authorization', `jwt ${accessToken}`)
            .send(body);
        const resBody = res.body;

        expect(res.statusCode).toBe(200);
        expect(new Date(resBody.updatedAt).getTime())
            .toBeGreaterThan(new Date(resBody.createdAt).getTime());
        delete resBody.id;
        delete resBody.createdAt;
        delete resBody.updatedAt;
        delete resBody.owner;
        expect(resBody).toEqual(body);
    });
});

describe('given existing post when http request GET /comment/post/id', () => {
    it('then should return its comments only', async () => {
        const res = await request(app)
            .get(`/comment/post/${existingPost1.id}`)
            .set('Authorization', `jwt ${accessToken}`);
        expect(res.statusCode).toBe(200);

        const resBody = res.body;
        expect(Array.isArray(resBody)).toBe(true);

        if (resBody.length > 0) {
            const postIds: string[] = resBody.map((comment: CommentData) => comment.postId);
            const uniquePostIds = [...new Set(postIds)];
            expect(uniquePostIds.length).toBe(1);
            expect(uniquePostIds[0]).toEqual(existingPost1.id);
        }
    });
});

describe('given unknown post when http request GET /comment/post/id', () => {
    it('then should return 400 bad request http status', async () => {
        const res = await request(app)
            .get(`/comment/post/UNKNOWN`)
            .set('Authorization', `jwt ${accessToken}`);

        expect(res.statusCode).toBe(400);
    });
});

describe('given existing post without any comments when http request GET /comment/post/id', () => {
    it('then should return list with mocked aiChat comment', async () => {
        const res = await request(app)
            .get(`/comment/post/${existingPost2.id}`)
            .set('Authorization', `jwt ${accessToken}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].content).toBe("Mocked response");
    });
});

describe('given unknown comment when http request DELETE /comment/id', () => {
    it('then should return 400 bad request http status', async () => {
        const res = await request(app)
            .delete(`/comment/UNKNOWN`)
            .set('Authorization', `jwt ${accessToken}`);

        expect(res.statusCode).toBe(400);
    });
});

describe('given existing comment when http request DELETE /comment/id', () => {
    it('then should return 200 success http status', async () => {
        // First create a comment to delete
        const createComment = await request(app)
            .post('/comment')
            .set('Authorization', `jwt ${accessToken}`)
            .send({
                postId: existingPost1.id,
                content: "Comment to delete"
            });

        const commentId = createComment.body.id;
        
        const res = await request(app)
            .delete(`/comment/${commentId}`)
            .set('Authorization', `jwt ${accessToken}`);

        expect(res.statusCode).toBe(200);
    });
});
