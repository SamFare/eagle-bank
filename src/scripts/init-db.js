const pool = require('../config/database');

async function initializeDatabase() {
    const connection = await pool.getConnection();
    
    try {
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(255) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                phone_number VARCHAR(20),
                address_line1 VARCHAR(255),
                address_line2 VARCHAR(255),
                address_line3 VARCHAR(255),
                address_town VARCHAR(255),
                address_county VARCHAR(255),
                address_postcode VARCHAR(20),
                created_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    } finally {
        connection.release();
    }
}

initializeDatabase();