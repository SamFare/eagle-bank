const express = require('express');
const router = express.Router();

router.post('/v1/users', (req, res) => {
    res.status(201).json({
        id: 'usr-123abc',
        name: req.body.name,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        createdTimestamp: new Date().toISOString(),
        updatedTimestamp: new Date().toISOString()
    });
});
module.exports = router;