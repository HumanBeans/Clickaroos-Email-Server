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

    // if name === Mac OS X|| Windows || Ubuntu || Mint
      // return Desktop
    console.log( 'FINAL Device: ', checkDevice(res, res) );
    
    console.log( type + model + device );
    res.json( type + model + device );
  });

  function checkDevice(req, res) {
    var ua = req.headers['user-agent'];
    console.log( parser.setUA(ua).getResult());

    var type = "type: " + parser.setUA(ua).getDevice().type; // tablet, mobile, console
    var model = "## model: " + parser.setUA(ua).getDevice().model; // iPhone, iPad, GT-I905
    var device = "## device: " + parser.setUA(ua).getOS().name; // Android, iOS, Mac OS X, Windows

    // if model === iPhone
      // return iPhone
    if( device === 'iPhone' ) {
      return 'iPhone';
    }
    // if model === iPad
      // return iPad
    if( device === 'iPad' ) {
      return 'iPad';
    }

    // if type === tablet
    if ( type === 'tablet') {
      // if OS.name === Android
      if ( device === 'Android' ) {
        // return Android tablet
        return 'Android Tablet';
      }
    }

    // if type === mobile
    if ( type === 'mobile') {
      // if OS.name === Android
      if ( device === 'Android' ) {
        // return Android mobile
        return 'Android Phone';
      }
    }

    if ( name.indexOf('Mac') !== -1 || 
          name.indexOf('Windows') !== -1 ||
          name.indexOf('Ubuntu') !== -1 ||
          name.indexOf('Mint') !== -1 ) 
    {
        return 'Desktop';
    }
  };

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
