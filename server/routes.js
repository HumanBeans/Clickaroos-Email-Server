// 'use strict';

//####### to be included later when done with the exports file
// var imageRequestHandlers = require('./api/')

// module.exports = function( app ){
//   console.log('hello');
// };

var express = require('express');
var fs = require('fs');
var ab = require('./ab_test/ab_test.controller.js');
var siteRedirect = require('./ab_test/site_redirect/main');
var useragent = require('useragent');

var UAParser = require('ua-parser-js');
var parser = new UAParser();


module.exports = function(app){
  // app.use('/clicks', imageRequestHandlers);
  
  app.get('/ua', function(req, res) {
    var ua = req.headers['user-agent'];
    console.log( parser.setUA(ua).getResult());
    // res.json('ua: ', ua.toJSON()); 
    res.json( parser.setUA(ua).getResult() );
  });

  app.get('/getImg/*', function(req) {
    ab.getImage(req);
  });

  app.get('/showImg.png', ab.showImage);
  
  app.get('/deleteImg', ab.deleteImage);

  app.get('/img/ab/:ab_testID/*', ab.serveImage);

  app.get('/test', function(req, res) {
    ab.getAssociatedImages({params: {ab_testID: '46'}, url: 'abc@def.com'},{}, 46);
  });

  app.use('/site/ab', siteRedirect);
  // app.use('/site/ab/:ab_testID/*', siteRedirect);

  app.route('/').get(function(req, res){
    res.send('hello world');
  });
};
