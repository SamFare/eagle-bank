const express = require('express');
const router = express.Router();
const { saveNewUserToDatabase, retrieveUserFromDatabaseByUserId } = require('../controllers/userController');

router.post('/v1/users', async (req, res) => {
    const user = await saveNewUserToDatabase(req.body);
    res.status(201).json(user);
});

router.get('/v1/users/:userId', async (req, res) => {
    const user = await retrieveUserFromDatabaseByUserId(req.params.userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
});

module.exports = router;