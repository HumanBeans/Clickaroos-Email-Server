var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'clickaroosdb.cloudapp.net',
  user: 'Clickaroos',
  password: 'HumanBeans',
  database: 'clickagoosdb'
});

module.exports = connection;