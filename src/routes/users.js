const express = require('express');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

router.post('/v1/users', (req, res) => {
    res.status(201).json({
        id: uuidv4(),
        name: req.body.name,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        createdTimestamp: new Date().toISOString(),
        updatedTimestamp: new Date().toISOString()
    });
});
module.exports = router;