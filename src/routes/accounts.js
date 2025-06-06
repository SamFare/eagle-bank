const express = require('express');
const router = express.Router();

router.post('/v1/accounts', (req, res) => {
    
    res.status(400).json({
        message: "",
        details: [
            {
                field: "",
                message: "",
                type: ""
            }
        ]
    });
});

module.exports = router;