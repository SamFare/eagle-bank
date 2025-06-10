const request = require('supertest');
const app = require('../app');
const db = require('../config/database');

let userData = {};

describe('User Endpoints', () => {
    afterAll(async () => {
        await db.end();
        jest.clearAllTimers();
    });

   describe('POST /v1/users', () => {
        beforeEach(() => {
            userData = {
                name: generateRandomName(),
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
                .send(userData);

            expect(response.status).toBe(201);
            expect(response.body.name).toBe(userData.name)
        });


        it('Adds a UUID as the ID for a user', async () => {
            const response = await request(app)
                .post('/v1/users')
                .send(userData);

            expect(response.status).toBe(201);
            expect(response.body.id).toBeTruthy()
            expect(response.body.id).toMatch(/^usr-[A-Za-z0-9]+$/)
        });

        it('Adds a created and updated timestamp to the response', async () => {
            const response = await request(app)
                .post('/v1/users')
                .send(userData);

            expect(response.status).toBe(201);
            expect(response.body.createdTimestamp).toBeTruthy()
            expect(response.body.updatedTimestamp).toBeTruthy()

        });

        it('Returns 400 when  invalid user details are inserted', async () => { 
            userData.name = null;

            const response = await request(app)
                .post('/v1/users')
                .send(userData);

            expect(response.status).toBe(400);
        });

    }); 

    describe('GET /v1/users', () => {
        it('requires a new auth token to access the user', async () => { 
            const newUser = {
                name: generateRandomName(),
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
                .set('Authorization', 'Bearer eyJhbthseiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c3ItMTc0OTQ4MTk1MDEwNCIsImlhdCI6MTc0OTQ4MjAxNiwiZXhwIjoxNzQ5NDg1NjE2fQ.zZhvJSj4Oq5VAywgS6etryNenZTSA1Ra3EpkiDxkrNM');
            
            expect(response.status).toBe(401);

        });

        it('returns the requested user', async () => {
            const newUser = {
                name: generateRandomName(),
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

            const authKeyResponse = await request(app)
                .post(`/v1/users/${newUserResponse.body.id}/login`)

            const response = await request(app)
                .get(`/v1/users/${encodeURIComponent(newUserResponse.body.id)}`)
                .set('Authorization', `Bearer ${authKeyResponse.body.authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(newUserResponse.body.id);
        });
    }); 

   describe('POST v1/users/:userId/login', () => {
        it('Returns 400 when there is no valid user provided', async () => {
            const response = await request(app)
                .post(`/v1/users/${encodeURIComponent(`usr-notreal`)}/login`)

            expect(response.status).toBe(400);
        });

        it('Returns 200 when the user exists', async () => {
            const newUser = {
                name: generateRandomName(),
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
                .send(newUser);

            const response = await request(app)
                .post(`/v1/users/${newUserResponse.body.id}/login`)

            expect(response.status).toBe(200);
        })
    })
});

const generateRandomName = () => { 
    const lowercaseAsciiStart = 97;
    let name = '';

    var rand = Math.floor((Math.random() + 1) * 8)

    for (var i = 0; i < rand; i++) {
        const letterIndex = Math.floor(Math.random() * 26);
        const letter = String.fromCharCode(lowercaseAsciiStart + letterIndex);
        name += letter
    }
    
    return name

}