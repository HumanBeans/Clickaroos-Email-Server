'use strict';

var query = require('./ab_test.queries.js');
var fs = require('fs');

// var dummyABTestID = 1;
// var dummyEmail = joe@gmail.com;
// var dummyImages = ['1432.png', '6565.png', '4545.png'];

exports.serveImage = function(req, res, endTime) {
  var abTestID = req.params.ab_testID;
  var userEmail = req.url.match(/\b[a-zA-Z0-9_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9.-]+\b/g)[0];
  var currentTime = new Date();




  //check for file on server
  path.open('' + '.png', 'r', function(err, fd) {
    var image = '';
    if(err) exports.getImage(image);



  });
};


// retrieve stored image from Azure blob
  exports.getImage = function(img) {
    var file = fs.createWriteStream(img);  
    http.get("http://clickaroos.blob.core.windows.net/img/client/" + img, function(response) {
      console.log(response); 
      response.pipe(file);
      console.log('get img is done');
    });
  };

  // display image when email is opened
  exports.showImage = function(req, res) {
    res.writeHead(200, {
     'Content-Type' : 'image/png'
    });
   fs.createReadStream('./bg.jpg', { 'bufferSize': 4 * 1024 }).pipe(res);
  };

  // delete image from server when no longer required
  exports.deleteImage = function(img) {
    fs.unlink(img, function(err) {
      if (err) throw err;
      console.log('successfully deleted');
    });
  };


};