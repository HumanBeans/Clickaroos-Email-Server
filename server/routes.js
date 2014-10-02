'use strict';

//####### to be included later when done with the exports file
// var imageRequestHandlers = require('./api/')

// module.exports = function( app ){
//   console.log('hello');
// };

var express = require('express');
var fs = require('fs');
var http = require('http');
var ab = require('./ab_test/ab_test.controller.js');

module.exports = function(app){
  // app.use('/clicks', imageRequestHandlers);
  
  app.get('/getImg', ab.getImage);

  app.get('/showImg.png', ab.showImage);
  
  app.get('/deleteImg', ab.deleteImage);

  app.get('/img/ab/:ab_testID/*', ab.serveImage);

  app.route('/').get(function(req, res){
    res.send('hello world');
  });
};
