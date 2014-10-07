// 'use strict';

// var bookshelf = require('../config/bookshelf_config');

// var Image = bookshelf.Model.extend({
//   tableName: 'ab_imgs'
// });

// var AbTest = bookshelf.Model.extend({
//   tableName: 'ab_tests'
// });

// Module for creating a MemCache object

var MemCache = function() { 
};


MemCache.prototype.winnerExists = function(ABTestID) {
  if(this[ ABTestID ].winner) {
    return true;
  }
  return false;
}


MemCache.prototype.selectWinner = function(ABTestID) {
  var highestClickImageID;
  var highestClickThroughRate = 0;
  var imgs = this[ ABTestID ].imgs;
  var currentImage_clickThroughRate;

  // Check through the imageID images for highest clicks
  for( var img_id in imgs ) {
    if(!imgs[img_id].views) { 
      currentImage_clickThroughRate = 0;
    } else {
      currentImage_clickThroughRate = imgs[img_id].clicks / imgs[img_id].views;
    }

    if( currentImage_clickThroughRate > highestClickThroughRate ) {
      highestClickThroughRate = currentImage_clickThroughRate;
      highestClickImageID = img_id;
    }
  }

  // Set the winner
  this[ ABTestID ].winner = this[ ABTestID].imgs[ highestClickImageID ];
  console.log( 'this is the winner!: ', this[ ABTestID ].winner );
  return highestClickImageID;
}


MemCache.prototype.ABTestImgDBInfo = function( ABTestID ) {
  var results = {}, imgs = this[ ABTestID ].imgs, totalViews = 0, totalClicks = 0;
  for( var img in imgs ){
    totalViews += imgs[img].views;
    totalClicks += imgs[img].clicks;
    results[ img ] = { views: imgs[img].views, clicks: imgs[img].clicks }
  }
  results.campaignViews = totalViews;
  results.campaignClicks = totalClicks;
  return results;
}


MemCache.prototype.hasABTest = function( ABTestID ) {
  return (ABTestID in this);
}


// Gets the Redirect URL for the img viewed by the email and increments the img clicks count
MemCache.prototype.getRedirectUrl = function( ABTestID, email, timeClicked ){
  console.log('abid', this[ ABTestID ]);
  imgs = this[ ABTestID ].imgs;
  for( var img in imgs ){
    if( email in imgs[img].emails ) {
      imgs[img].clicks++;
      this[ ABTestID ].clickTime[ timeClicked ]++;
      var redir = imgs[img].redirectURL;
    }
  }
  return redir;
}

// Gets a random img, increments img's views, adds email to img's email object
MemCache.prototype.getRandomImg = function( ABTestID, email, timeViewed ){
  var imgKeys = Object.keys( this[ABTestID].imgs );
  var randomIndex = Math.floor( Math.random() * imgKeys.length );
  var selectedImgKey = imgKeys[ randomIndex ];
  this[ ABTestID ].imgs[ selectedImgKey ].emails[ email ] = email;
  this[ ABTestID ].imgs[ selectedImgKey ].views++;
  this[ ABTestID ].viewTime[ timeViewed ]++;
  return this[ ABTestID ].imgs[ selectedImgKey ].fileLocation;
}

MemCache.prototype.hasABTest = function( ABTestID ) {
  return (ABTestID in this)
}


///////////////////////////////////////////////////////////////////////
//  .addABTest() adds a new ABTest to a memCache object
//
//  MemCacheExample.addABTest( 
//    ABTestID, 
//    endTime, 
//    [ imgID1, redirectURL1, fileLocation1 ],
//    [ imgID2, redirectURL2, fileLocation2 ],... 
//  );

MemCache.prototype.addABTest = function( ABTestID, endTime ) {
  this[ ABTestID ] = 
    { imgs: { },
      endTime: endTime,
      viewTime: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0,
        12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0, 21: 0, 22: 0, 23: 0 },
      clickTime: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0,
        12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0, 21: 0, 22: 0, 23: 0 },
      winner: null
    }

  for( var i = 2; i < arguments.length; i++ ){
    this[ ABTestID ].imgs[ arguments[i][0] ] = 
      { 
        emails: {},
        views: 0,
        clicks: 0,
        redirectURL: arguments[i][1],
        fileLocation: arguments[i][2]
      }
  }
};

// MemCache.prototype.syncToDatabase = function(){

// }

var memCache = new MemCache();

exports.memCache = memCache;

// memCache.addABTest( 3, 500000, [6, 'www.google.com', './somePicture.png'], [7, 'www.facebook.com', './somePicture7.png'] );
// console.log( memCache.getRandomImg( 3, 'armandopmj@gmail.com' ) );
// console.log( memCache.getRedirectUrl( 3, 'armandopmj@gmail.com' ) )
