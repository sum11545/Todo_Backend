const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.POSTGRESS_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect((err) => {
  if (err) console.log(err);
  else {
    console.log("Connected to the database successfully!");
  }
});

pool.query(
  `CREATE TABLE IF NOT EXISTS Sumit (
  id SERIAL PRIMARY KEY,
  taskname varchar(200)
  
  )`,
  (err, res) => {
    if (err) console.log(err);
    else {
      console.log("Table created successfully");
    }
  }
);

module.exports = pool;
