const express = require('express');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');


const router = express.Router();

router.post('/v1/users', async (req, res) => {
    connection = await pool.getConnection();    
    
    const userId = `usr-${Date.now()}`;
    
    try {
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
                req.body.name,
                req.body.email,
                req.body.phoneNumber,
                req.body.address.line1,
                req.body.address.town,
                req.body.address.county,
                req.body.address.postcode
            ]
        );

        const [newUser] = await connection.query(
            'SELECT * FROM users WHERE id = ?',
            [userId]
        );

        res.status(201).json({
            id: newUser[0].id,
            name: newUser[0].name,
            email: newUser[0].email,
            phoneNumber: newUser[0].phone_number,
            address: {
                line1: newUser[0].address_line1,
                town: newUser[0].address_town,
                county: newUser[0].address_county,
                postcode: newUser[0].address_postcode
            },
            createdTimestamp: newUser[0].created_timestamp,
            updatedTimestamp: newUser[0].updated_timestamp
        });
    } finally {
        connection.release();
    }
});
router.get('/v1/users/:userId', async (req, res) => {
    connection = await pool.getConnection();
    try {
        const [users] = await connection.query(
            'SELECT id, name, email, phone_number as phoneNumber, ' +
            'address_line1 as "address.line1", ' +
            'address_town as "address.town", ' +
            'address_county as "address.county", ' +
            'address_postcode as "address.postcode", ' +
            'created_timestamp as createdTimestamp, ' +
            'updated_timestamp as updatedTimestamp ' +
            'FROM users WHERE id = ?',
            [req.params.userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const user = users[0];
        res.status(200).json({
            ...user,
            address: {
                line1: user['address.line1'],
                town: user['address.town'],
                county: user['address.county'],
                postcode: user['address.postcode']
            }
        });
    } finally {
        connection.release();
    }
});
module.exports = router;