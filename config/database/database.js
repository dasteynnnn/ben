const mysql = require('mysql2/promise');

const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost'
const MYSQL_USER = process.env.MYSQL_USER || 'user'
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || 'password'
const MYSQL_DB = process.env.MYSQL_DB || 'db name'

var config = {
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DB
};

async function query(sql, params) {
    const connection = await mysql.createConnection(config);
    const [results, ] = await connection.execute(sql, params);
    
    return results;
}

module.exports = {
    query
}