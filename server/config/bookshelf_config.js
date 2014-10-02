var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'clickaroosdb.cloudapp.net',
    user: 'Clickaroos',
    password: 'HumanBeans',
    database: 'clickagoosdb',
    charset  : 'utf8'
  }
});

var bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;