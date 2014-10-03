'use strict';

var query = require('./ab_test.queries.js');
var http = require('http');
var fs = require('fs');
var q = require('q');
var bookshelf = require('../config/bookshelf_config.js');
var abMem = require('./ab_test.memcache.js').cache;
console.log('abMem check', abMem.addABTest);

var Image = bookshelf.Model.extend({
  tableName: 'ab_imgs'
});

var AbTest = bookshelf.Model.extend({
  tableName: 'ab_tests'
});

// *** EMAIL SERVER FUNCTIONS ***
exports.serveImage = function(req, res) {
  var abTestID = req.params.ab_testID;
  var userEmail = req.url.match(/\b[a-zA-Z0-9_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9.-]+\b/g)[0];
  var endTime, campaignImages, servedImage;

  // check memcache, if !in memcache, ping DB for campaign end_time, convert to Date() format
  if(!abMem.hasABTest(abTestID)) {
    exports.getAssociatedImages(req, res, abTestID);
    return;
  }
  
  return 'WINNER WINNER CHICKEN DINNER';
  // campaignImages = [];
  // endTime = abMem[abTestID].endTime;
  
  // for(var img in abMem[abTestID].imgs) {
  //   campaignImages.push(img.fileName);
  // } 

  // if(abEndTimePassed(endTime)) {
  //   // populate winner *** How will we know which is winner on memcache without pinging DB???
  //   servedImage; // most clicks
      
  //     // if URL !in memcache -> get image from blob

  // } else {
  //   // populate campaignImages with campaign URLs
  //     // if URLs !in memcache -> get images from blob

  //   servedImage = pickRandomImage(campaignImages);
  // }
  // //serve servedImage
};



  // retrieve stored image from Azure blob
  exports.getImage = function(req) {
    var imgUrl = typeof(req) === 'string' ? req : req.url.slice(8);
    var file = fs.createWriteStream(imgUrl);
    http.get("http://clickaroos.blob.core.windows.net/img/client/" + imgUrl, function(response) {
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

  // check if ab test trial period has elapsed
  var abEndTimePassed = function(endTime) {
    var currentTime = new Date();
    if (currentTime > endTime) return true;
    else return false;
  };

  // select random image to serve for ab test
  var pickRandomImage = function(imageArray) {
    var length = imageArray.length;
    var randomIndex = Math.floor(Math.random() * length);
    return imageArray[randomIndex];
  };

  // find all asset urls associated with ab test and trigger downloadImages
  exports.getAssociatedImages = function(res, req, abTestID) {
    var imgModelArray = [];
    var imgArray = [];
    
    // query db for image models associated with ab test id
    Image.collection().query().where({
      ab_test_id: abTestID
    })
    .select()
    //query db for end time
    .then(function(result) {
      imgModelArray = result;

      return AbTest.collection().query().where({
        ab_test_id: abTestID
      }).select();
    })

    .then(function(abModelArray) {
      console.log('level 1');
      console.log('abModelArray: ', abModelArray);

      var abMemArgs = [abTestID, abModelArray[0]['milliseconds_pick_winner']];

      // populate imgArray with paths from Image models and write info to memcache
      imgModelArray.forEach(function(element, index, array) {
        var filePathString = element['ab_test_id'] + '_' + element['ab_imgs_id'] + '.png';
        abMemArgs.push([element['ab_test_id'], element['redirect_url'], filePathString]);
        imgArray[index] = array[index]['asset_url'];
      });

      console.log(abMem);

      abMem.addABTest.apply(abMem, abMemArgs);
      console.log(abMem);
    })  
    // download images to server
    .then(function() {
      console.log('level 2');
      downloadImages(res, req, imgArray);
    })
    // call serveImage again now that images have been downloaded to server
    .then(function() {
      console.log('level 3');
      exports.serveImage(res, req);
    })
    .catch(function(err) {
      console.log(err);
    });
  };

  // download all images from Azure blob and trigger serveImages
  var downloadImages = function(req, res, imgArray) {
    imgArray.forEach(function(element, index, array) {
      exports.getImage(array[index]);
    });
  };






