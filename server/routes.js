'use strict';

//####### to be included later when done with the exports file
// var imageRequestHandlers = require('./api/')

// module.exports = function( app ){
//   console.log('hello');
// };

var express = require('express');
var fs = require('fs');
var http = require('http');

module.exports = function(app){
  // app.use('/clicks', imageRequestHandlers);

  app.get('/getImg', function(req, res){
    var file = fs.createWriteStream("bg.jpg");
    var request = http.get("http://clickaroos.blob.core.windows.net/img/client/bg.jpg", function(response) {
      console.log(response); 
      response.pipe(file);
      console.log('get img is done');
    });
  });

  app.get('/showImg.png', function(req, res){
    var img = fs.readFileSync('./bg.jpg');
    res.writeHead(200, {'Content-Type': 'image/jpg' });
    res.end(img, 'binary');
  });

  app.get('/deleteImg', function(req, res) {
    fs.unlink('./bg.jpg', function(err) {
      if (err) throw err;
      console.log('successfully deleted');
    });
  });

  app.route('/').get(function(req, res){
    res.send('hello world');
  });
};
