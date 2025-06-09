const request = require('supertest');
const app = require('../app');

let userData = {};

describe('User Endpoints', () => {
    describe('POST /v1/users', () => {

        beforeEach(() => {
            userData = {
                name: Math.random(1, 1000000).toString(),
                address: {
                    line1: '123 Test St',
                    town: 'Testville',
                    county: 'Testshire',
                    postcode: 'TE1 1ST'
                },
                phoneNumber: '+441234567890',
                email: 'test@example.com'
            };
        })

        it('creates a new user successfully', async () => {
            const response = await request(app)
                .post('/v1/users')
                .set('Authorization', 'Bearer test-token')
                .send(userData);

            expect(response.status).toBe(201);
            expect(response.body.name).toBe(userData.name)
        });


        it('Adds a UUID as the ID for a user', async () => {
            const response = await request(app)
                .post('/v1/users')
                .set('Authorization', 'Bearer test-token')
                .send(userData);

            expect(response.status).toBe(201);
            expect(response.body.id).toBeTruthy()
            expect(response.body.id).toMatch(/^usr-[A-Za-z0-9]+$/)
        });

        it('Adds a created and updated timestamp to the response', async () => {
            const response = await request(app)
                .post('/v1/users')
                .set('Authorization', 'Bearer test-token')
                .send(userData);

            expect(response.status).toBe(201);
            expect(response.body.createdTimestamp).toBeTruthy()
            expect(response.body.updatedTimestamp).toBeTruthy()

        });

    });

    describe('GET /v1/users', () => {
        it('returns the requested user', async () => {
            const newUser = {
                name: Math.random(1, 1000000).toString(),
                address: {
                    line1: '123 Test St',
                    town: 'Testville',
                    county: 'Testshire',
                    postcode: 'TE1 1ST'
                },
                phoneNumber: '+441234567890',
                email: 'test@example.com'
            };

            const newUserResponse = await request(app)
                .post(`/v1/users/`)
                .set('Authorization', 'Bearer test-token')
                .send(newUser);

            const response = await request(app)
                .get(`/v1/users/${encodeURIComponent(newUserResponse.body.id)}`)
                .set('Authorization', 'Bearer test-token');

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(newUserResponse.body.id);
        });
    });

    describe('POST v1/users/login', () => { 
        it('Returns 400 when there is no valid user provided', async () => { 
            const newUserResponse = await request(app)
                .post(`/v1/users/login`)
                .set('Authorization', 'Bearer test-token')
                .send({userID: `usr-notreal`, password: `notreal` });
        })
    })
});