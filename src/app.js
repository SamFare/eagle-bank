const express = require('express');
const OpenApiValidator = require('express-openapi-validator');
const path = require('path');
const usersRouter = require('./routes/users');
const app = express();

app.use(express.json());
app.use(
    OpenApiValidator.middleware({
        apiSpec: path.join(__dirname, '../openapi.yaml'),
        validateRequests: true,
        validateResponses: true,
        validateFormats: false
    })
);
app.get('/health', (req, res) => {
    res.status(200).send('Hello world');
});

app.use(usersRouter);

// Error handler for validation errors
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors,
    });
});

module.exports = app;