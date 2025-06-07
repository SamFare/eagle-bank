const request = require('supertest');
const app = require('../app');

describe('User Endpoints', () => {
    describe('POST /v1/users', () => {
        it('creates a new user successfully', async () => {
            const userData = {
                name: 'Test User',
                address: {
                    line1: '123 Test St',
                    town: 'Testville',
                    county: 'Testshire',
                    postcode: 'TE1 1ST'
                },
                phoneNumber: '+441234567890',
                email: 'test@example.com'
            };
        });
    });
});