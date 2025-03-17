
const commentSchema = {
    type: 'object',
    properties: {
        id: {
            type: 'string',
            description: 'The comment ID'
        },
        postId: {
            type: 'string',
            description: 'The ID of the post the comment belongs to'
        },
        content: {
            type: 'string',
            description: 'The content of the comment'
        },
        owner: {
            type: 'string',
            description: 'The ID of the user who owns the comment'
        },
        createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Timestamp when the comment was created'
        },
        updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Timestamp when the comment was last updated'
        }
    }
};

const security = {
        BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
        }
    };

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
        },
        components: {
            securitySchemes: security,
            schemas: {
                Comment: commentSchema
            }
        },
        security: [
            {
                BearerAuth: []
            }
        ]
    },
    apis: ['./src/routes/*.ts']
};

export default options;

