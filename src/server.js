const app = require('./app');
const db = require('../config/database');

const port = 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

process.on('SIGINT', () => {
    db.end((err) => {
        console.log('MySQL connection closed.');
        process.exit(err ? 1 : 0);
    });
});

process.on('SIGTERM', () => {
    db.end((err) => {
        console.log('MySQL connection closed.');
        process.exit(err ? 1 : 0);
    });
});