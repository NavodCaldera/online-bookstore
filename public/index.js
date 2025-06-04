const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'online_bookstore'
});

db.connect(err => {
  if (err) console.log(err);
  else console.log('MySQL Connected...');
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
