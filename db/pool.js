const { process_params } = require('express/lib/router');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.ENV_HOST,
  database: process.env.ENV_DATABASE,
  port: process.env.ENV_PORT,
  user: process.env.ENV_USER,
  password: process.env.ENV_PASSWORD,
  ssl: {
    sslmode: 'require',
    rejectUnauthorized: false,
  },
});

module.exports = pool;
