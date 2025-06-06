const request = require('supertest');
const app = require('../app');

describe('Account Creation Endpoint', () => {
    it('returns 400 if called with incorrect parameters', async () => {
        const response = await request(app)
            .post('/v1/accounts')
            .set('Authorization', 'Bearer test-token')
            .send({});

        expect(response.status).toBe(400);
    });
});