const request = require('supertest');
const app = require('../app');

describe('Health Endpoint', () => {
    it('should return Hello world', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Hello world');
    });
});