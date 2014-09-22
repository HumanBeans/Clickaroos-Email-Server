'use strict'

var express = require('express');

var app = express();

var server = require('http').createServer(app);

var config = {};
config.port = process.env.PORT || 3000;

server.listen(config.port,function(){
  console.log('Express server listenning to ', config.port);
});

app.get('/', function(req,res){
  res.send('hello world');
});

exports = module.exports = app;