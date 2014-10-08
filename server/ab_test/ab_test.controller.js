// 'use strict';

var query = require('./ab_test.queries.js');
var http = require('http');
var fs = require('fs');
var q = require('q');
var bookshelf = require('../config/bookshelf_config.js');
var abMem = require('./ab_test.memcache.js').memCache;

var Image = bookshelf.Model.extend({
  tableName: 'ab_imgs'
});

var AbTest = bookshelf.Model.extend({
  tableName: 'ab_tests'
});

// Fake endTime = true after 60 seconds
// var fake = false;
// setTimeout(function() {
//   fake = true;
// }, 60000);

// *** EMAIL SERVER FUNCTIONS ***
exports.serveImage = function(req, res) {
  var currentHour = new Date().getHours();
  var abTestID = req.params.ab_testID;
  // console.log('REQ: ', req);
  // console.log('ABTESTID: ', abTestID);
  // var userEmail = req.url.match(/\b[a-zA-Z0-9_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9.-]+\b/g)[0];
  var userEmail = req.url.split('.png')[0].split('/').pop();
  // console.log(req.url);
  console.log('[serveImg] userEmail: ', userEmail);
  var campaignImages, servedImage;

  var serveImgLogic = function() {
    // If there is winner
    if( abMem.winnerExists(abTestID) ) {
      // Show winner
      var imageLoc = abMem[ abTestID ].winner.fileLocation;
      console.log('1: image_loc ', imageLoc);
      abMem.winnerViewed(abTestID, userEmail, currentHour);
      return exports.showImage(req, res, imageLoc);
    }
    // If there is !winner && endTime has passed 
    else if ( !abMem.winnerExists(abTestID) && abEndTimePassed(abTestID) ) {
    // else if ( !abMem.winnerExists(abTestID) && fake ) {
      // Set a winner
      console.log('Selecting Winner');
      abMem.selectWinner(abTestID);

      console.log('Winner is: ', abTestID);
      // Show winner
      var imageLoc = abMem[ abTestID ].winner.fileLocation;
      abMem.winnerViewed(abTestID, userEmail, currentHour);
      return exports.showImage(req, res, imageLoc);
    }
    // If endTime hasn't passed
    else {
      // Show random image
      var imageLoc = abMem.getRandomImg(abTestID, userEmail, currentHour);
      console.log('3: image_loc ', imageLoc);
      return exports.showImage(req, res, imageLoc);
    }
  }

  // check memcache, if !in memcache, ping DB for campaign end_time, convert to Date() format
  if(!abMem.hasABTest(abTestID)) {
    exports.getAssociatedImages(req, res, abTestID);
  } else {
    serveImgLogic();
  }
  

};



  // retrieve stored image from Azure blob
  // exports.getImage = function(req) {
  //   console.log('req: ', req);
  //   var imgUrl = typeof(req) === 'string' ? req : req.url.slice(8);
  //   var file = fs.createWriteStream(imgUrl);
  //   http.get("http://clickaroos.blob.core.windows.net/img/client/" + imgUrl, function(response) {
  //     response.pipe(file);
  //     console.log('get img is done');
  //   });
  // };

  exports.getImage = function(imageUrl, imageName) {
    // console.log('req: ', req);
    // var imgUrl = typeof(req) === 'string' ? req : req.url.slice(8);
    var file = fs.createWriteStream(imageName);
    http.get(imageUrl, function(response) {
      response.pipe(file);
      console.log('get img is done');
    });
  };

  // display image when email is opened
  exports.showImage = function(req, res, imagePath) {
    res.writeHead(200, {
     'Content-Type' : 'image/png'
    });
   fs.createReadStream(imagePath, { 'bufferSize': 4 * 1024 }).pipe(res);
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
  var abEndTimePassed = function(abTestID) {
    var endTime = abMem[abTestID].endTime;
    var currentTime = new Date();
    if (currentTime > endTime) return true;
    else return false;
  };

  // find all asset urls associated with ab test and trigger downloadImages
  exports.getAssociatedImages = function(res, req, abTestID) {
    console.log('GETASSOCIATEDIMAGES CALLED');
    // console.log('req: ', req);
    var imgModelArray = [];
    var imgPathAssetUrl = {};
    
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
      var abMemArgs = [abTestID, abModelArray[0]['milliseconds_pick_winner']];
      // './server/client_images/' + 
      // populate imgPathAssetUrl with paths from Image models and write info to memCache
      imgModelArray.forEach(function(element, index, array) {
        var filePathString = element['ab_test_id'] + '_' + element['ab_imgs_id'] + '.png';
        abMemArgs.push([element['ab_imgs_id'], element['redirect_url'], filePathString]);
        imgPathAssetUrl[element['ab_imgs_id']] = { asset_url: element['asset_url'], filePathString: filePathString };
      })

      abMem.addABTest.apply(abMem, abMemArgs);
      console.log('ABMEM CHECK: ', abMem[abTestID]);
    })  
    // download images to server
    .then(function() {
      downloadImages(res, req, imgPathAssetUrl);
    })
    // call serveImage again now that images have been downloaded to server
    .then(function() {
      console.log('outside setTimeout');
      setTimeout(function() {
        exports.serveImage(res, req);
        console.log('inside setTimeout');
      }, 5000);
    })
    .catch(function(err) {
      console.log('error: ', err);
    });
  };

  // download all images from Azure blob and trigger serveImages
  var downloadImages = function(req, res, imgPathAssetUrl) {
    console.log('downloading_images');
    for( var imgId in imgPathAssetUrl ) {
      console.log( imgId, imgPathAssetUrl );
      exports.getImage( imgPathAssetUrl[imgId].asset_url, imgPathAssetUrl[imgId].filePathString );
    }
  };
