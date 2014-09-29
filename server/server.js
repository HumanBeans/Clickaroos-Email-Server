'use strict';

var express = require('express');
var mysql = require('mysql');
var connection = require('./config/dbconnection')
var configExpress = require('./config/express');
var routes = require('./routes');
var app = express();

var server = require('http').createServer(app);
configExpress(app);
routes(app);

var port = process.env.PORT || 3000;

connection.connect();

server.listen(port,function(){
  console.log('Express server listenning to ', port);
});

exports = module.exports = app;