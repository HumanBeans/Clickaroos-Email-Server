'use strict';

//####### to be included later when done with the exports file
// var imageRequestHandlers = require('./api/')

// module.exports = function( app ){
//   console.log('hello');
// };

var express = require('express');
var fs = require('fs');
var http = require('http');
var ab = require('/ab_test/ab_test.controller.js');

module.exports = function(app){
  // app.use('/clicks', imageRequestHandlers);

  // retrieve stored image from Azure blob
  app.get('/getImg', function(req, res){
    var file = fs.createWriteStream("bg.jpg");
    http.get("http://clickaroos.blob.core.windows.net/img/client/bg.jpg", function(response) {
      console.log(response); 
      response.pipe(file);
      console.log('get img is done');
    });
  });

  // called to display image when email is opened
  app.get('/showImg.png', function(req, res){
    var img = fs.readFileSync('./bg.jpg');
    res.writeHead(200, {'Content-Type': 'image/jpg' });
    res.end(img, 'binary');
  });

  // called to delete image from server when no longer required
  app.get('/deleteImg', function(req, res) {
    fs.unlink('./bg.jpg', function(err) {
      if (err) throw err;
      console.log('successfully deleted');
    });
  });

  app.get('/img/ab/:ab_testID/*', ab.serveImage);

  app.route('/').get(function(req, res){
    res.send('hello world');
  });
};
