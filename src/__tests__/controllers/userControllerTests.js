const { saveNewUserToDatabase, retrieveUserFromDatabaseByUserId } = require('../../controllers/userController');
const db = require('../../config/database');

jest.mock('../../config/database');

describe('User Controller', () => {
    const mockConnection = {
        query: jest.fn(),
        release: jest.fn()
    };

    beforeEach(() => {
        db.getConnection.mockResolvedValue(mockConnection);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('saveNewUserToDatabase', () => {
        const mockUserData = {
            name: 'Test User',
            email: 'test@example.com',
            phoneNumber: '+441234567890',
            address: {
                line1: '123 Test St',
                town: 'Testville',
                county: 'Testshire',
                postcode: 'TE1 1ST'
            }
        };

        it('successfully saves user data', async () => {
            const mockNewUser = [{
                id: 'usr-123',
                name: mockUserData.name,
                email: mockUserData.email,
                phoneNumber: mockUserData.phoneNumber,
                'address.line1': mockUserData.address.line1,
                'address.town': mockUserData.address.town,
                'address.county': mockUserData.address.county,
                'address.postcode': mockUserData.address.postcode,
                createdTimestamp: '2023-01-01T00:00:00Z',
                updatedTimestamp: '2023-01-01T00:00:00Z'
            }];

            mockConnection.query
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([mockNewUser]);

            const result = await saveNewUserToDatabase(mockUserData);

            expect(result).toMatchObject({ 
            name: 'Test User',
            email: 'test@example.com',
            phoneNumber: '+441234567890',
            address: {
                line1: '123 Test St',
                town: 'Testville',
                county: 'Testshire',
                postcode: 'TE1 1ST'
            }
            });
            expect(mockConnection.query).toHaveBeenCalledTimes(2);
            expect(mockConnection.release).toHaveBeenCalled();
        });

        it('releases connection when save fails', async () => {
            mockConnection.query.mockRejectedValue(new Error('Database error'));

            await expect(saveNewUserToDatabase(mockUserData)).rejects.toThrow('Database error');
            expect(mockConnection.release).toHaveBeenCalled();
        });
    });

    describe('retrieveUserFromDatabaseByUserId', () => {
        it('successfully retrieves user data', async () => {
            const mockUser = [{
                id: 'usr-123',
                name: 'Test User',
                'address.line1': '123 Test St',
                'address.town': 'Testville',
                'address.county': 'Testshire',
                'address.postcode': 'TE1 1ST',
                phoneNumber: '+441234567890',
                email: 'test@example.com',
                createdTimestamp: '2023-01-01T00:00:00Z',
                updatedTimestamp: '2023-01-01T00:00:00Z'
            }];

            mockConnection.query.mockResolvedValue([mockUser]);

            const result = await retrieveUserFromDatabaseByUserId('usr-123');

            expect(result).toMatchObject({
                id: 'usr-123',
                name: 'Test User',
                address: {
                    line1: '123 Test St',
                    town: 'Testville',
                    county: 'Testshire',
                    postcode: 'TE1 1ST'
                }
            });
            expect(mockConnection.query).toHaveBeenCalledTimes(1);
            expect(mockConnection.release).toHaveBeenCalled();
        });

        it('returns null for non-existent user', async () => {
            mockConnection.query.mockResolvedValue([[]]);

            const result = await retrieveUserFromDatabaseByUserId('usr-nonexistent');

            expect(result).toBeNull();
            expect(mockConnection.release).toHaveBeenCalled();
        });

        it('releases connection when retrieval fails', async () => {
            mockConnection.query.mockRejectedValue(new Error('Database error'));

            await expect(retrieveUserFromDatabaseByUserId('usr-123')).rejects.toThrow('Database error');
            expect(mockConnection.release).toHaveBeenCalled();
        });
    });
});