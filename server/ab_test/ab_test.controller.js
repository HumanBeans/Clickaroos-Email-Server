'use strict';

var query = require('./ab_test.queries.js');
var fs = require('fs');


// *** EMAIL SERVER FUNCTIONS ***
exports.serveImage = function(req, res) {
  var abTestID = req.params.ab_testID;
  var userEmail = req.url.match(/\b[a-zA-Z0-9_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9.-]+\b/g)[0];
  var endTime; //bookshelf query for end_time
  var campaignImages, randomImage, winner;

  if(abEndTimePassed(endTime)) {
    //populate winner with bookshelf query for image with greatest clicks
  } else {
    // populate campaignImages with bookshelf query for all campaign images
    randomImage = pickRandomImage(campaignImages);
  }

  if(winner) // serve winner
  else if (randomImage) // serve randomImage 
  else throw 'Error loading image'; 

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


  // *** HELPER FUNCTIONS ***
  var abEndTimePassed= function(endTime) {
    var currentTime = new Date();
    if (currentTime > endTime) return true;
    else return false;
  };

  var pickRandomImage = function(imageArray) {
    var length = imageArray.length;
    var randomIndex = Math.floor(Math.random() * length);
    return imageArray[randomIndex];
  };
