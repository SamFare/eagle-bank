# Barclays tech test

An implementation of the tech test in Node and Express

## Prerequisites

- Node.js v16 or higher
- MySQL 8.0 or higher
- npm 

## Database Setup

1. Create the MySQL database:
```bash
mysql -u root -p
CREATE DATABASE eagle_bank;
USE eagle_bank;
```

2. Run the database initialization script:
```bash
npm run init-db
```
## Installation

2. Install dependencies:
```bash
npm install
```

3. (optional if you wanted to rename/replace the db) Create a secrets.json file in env/local with your database credentials:
```json
{
    "DB_HOST": "localhost",
    "DB_USER": "root",
    "DB_PASSWORD": "your_password",
    "DB_NAME": "mydb"
}
```

## Starting the Server

Development mode:
```bash
npm run start
```


The server will be running at `http://localhost:3000`

## Testing

Run the test suite:
```bash
npm run test #single run
or
npm run test-watch # for watch mode
```

## API Documentation

see ```openapi.yaml```
