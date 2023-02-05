const mysql = require('mysql2')


console.log(process.env.DB_HOST);

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '19981907Malik.',
  database: 'dictionary',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

module.exports = db
