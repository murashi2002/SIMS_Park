const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  // Allow an empty password when DB_PASSWORD is intentionally blank.
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME || 'SIMS',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
