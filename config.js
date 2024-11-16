const { Client } = require('pg');

const client = new Client({
    host: 'localhost',
    user: 'postgres',  // Default PostgreSQL username; change if needed
    password: 'root1234',      // Add your PostgreSQL password here
    database: 'devops'  // Ensure this is your actual PostgreSQL database name
});

const connectToDb = async () => {
    try {
        await client.connect();
        console.log('Connected to the PostgreSQL server.');
    } catch (err) {
        console.error('Error connecting to the database:', err.message);
    }
};

connectToDb();

module.exports = client;
