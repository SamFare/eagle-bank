const db = require('../config/database');

const saveNewUserToDatabase = async (userData) => {
    const connection = await db.getConnection();
    const userId = `usr-${Date.now()}`;

    try {
        await userInsertRequest(connection, userId, userData);
        const newUser = await userRetreivalRequest(connection, userId);

        return {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            phoneNumber: newUser.phoneNumber,
            address: {
                line1: newUser.address.line1,
                town: newUser.address.town,
                county: newUser.address.county,
                postcode: newUser.address.postcode
            },
            createdTimestamp: newUser.createdTimestamp,
            updatedTimestamp: newUser.updatedTimestamp
        };
    } finally {
        connection.release();
    }
}

const retrieveUserFromDatabaseByUserId = async (userId) => {
    const connection = await db.getConnection();
    try {
        return await userRetreivalRequest(connection, userId);
    } finally {
        connection.release();
    }
}

const userRetreivalRequest = async (connection, userId) => {
    const [users] = await connection.query(
        'SELECT id, name, email, phone_number as phoneNumber, ' +
        'address_line1 as "address.line1", ' +
        'address_town as "address.town", ' +
        'address_county as "address.county", ' +
        'address_postcode as "address.postcode", ' +
        'created_timestamp as createdTimestamp, ' +
        'updated_timestamp as updatedTimestamp ' +
        'FROM users WHERE id = ?',
        [userId]
    );

    if (users.length === 0) {
        return null;
    }

    const user = users[0];
    return {
        ...user,
        address: {
            line1: user['address.line1'],
            town: user['address.town'],
            county: user['address.county'],
            postcode: user['address.postcode']
        }
    };
};

const userInsertRequest = async (connection, userId, userData) => {
    await connection.query(
            `INSERT INTO users (
                id, 
                name, 
                email, 
                phone_number, 
                address_line1,
                address_town,
                address_county,
                address_postcode
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId,
                userData.name,
                userData.email,
                userData.phoneNumber,
                userData.address.line1,
                userData.address.town,
                userData.address.county,
                userData.address.postcode
            ]
        );
}
module.exports = {
    saveNewUserToDatabase,
    retrieveUserFromDatabaseByUserId
};