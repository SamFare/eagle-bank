const express = require('express');
const router = express.Router();
const { saveNewUserToDatabase, retrieveUserFromDatabaseByUserId } = require('../controllers/userController');
const jwt = require('jsonwebtoken');

router.post('/v1/users', async (req, res) => {
    const user = await saveNewUserToDatabase(req.body);
    res.status(201).json(user);
});

router.post('/v1/users/:userId/login', async (req, res) => {
    const user = await retrieveUserFromDatabaseByUserId(req.params.userId);
    if (!user) {
        return res.status(400).json({ 
            message: 'Invalid user or password', 
            details: [] 
        });
    }
    const token = jwt.sign({ userId: user.id }, 'your-secret-key', {
        expiresIn: '1h',
    });

    res.status(200).send({ authToken: token})
   
})

router.get('/v1/users/:userId', async (req, res) => {
    try { 
        const token = req.header('Authorization').replace("Bearer ", "")
        const decodedToken = jwt.verify(token, 'your-secret-key');
    } catch { 
        res.status(401).send()
    }
    
    const user = await retrieveUserFromDatabaseByUserId(req.params.userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
    
    
    
});



module.exports = router;