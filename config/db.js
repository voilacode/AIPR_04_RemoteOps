const mysql = require('mysql2');

const db = mysql
  .createPool({
    host: 'localhost', 
    user: 'root', 
    password: 'root',
    database: 'jobscope', 
  })
  .promise(); 

module.exports = db;