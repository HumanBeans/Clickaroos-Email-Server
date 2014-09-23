'use strict'

var express = require('express');
var mysql = require('mysql');

var app = express();

var server = require('http').createServer(app);

var config = {};
config.dbConnect = {
  host: 'us-cdbr-azure-west-a.cloudapp.net',
  user: 'b017f8a5a6d3e8',
  password: '46c0073d',
  database: 'ClickagoosDB'
};
config.port = process.env.PORT || 3000;

var connection = mysql.createConnection(config.dbConnect);

connection.connect();

var helper = {};

helper.counter = function(req,res){
  connection.query('SELECT * FROM users', function(err,results){
    if(err) res.send('err');
    res.send(results);
  })
};

server.listen(config.port,function(){
  console.log('Express server listenning to ', config.port);
});

app.get('/', function(req,res){
  res.send('hello world');
});

app.get('/counter', helper.counter);

exports = module.exports = app;