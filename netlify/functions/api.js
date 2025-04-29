// Netlify serverless function to handle API requests
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
// IMPORTANT: Completely avoid pg-native
process.env.NODE_PG_FORCE_NATIVE = '0';
// Use pg with JS implementation only
const pg = require('pg');
// Force disable native bindings programmatically
pg.native = null;
const { Pool } = pg;
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const bcrypt = require('bcryptjs');

// Initialize Express
const app = express();
app.use(express.json());
app.use(cors());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Rest of your code remains the same...
