// 'use strict';

var bookshelf = require('../config/bookshelf_config');
var updateImgsClicksAndViews = require('./ab_test.memcache.helpers').updateImgsClicksAndViews;
var updateCampaignsClicksAndViews = require('./ab_test.memcache.helpers').updateCampaignsClicksAndViews;

var Image = bookshelf.Model.extend({
  tableName: 'ab_imgs'
});

var AbTest = bookshelf.Model.extend({
  tableName: 'ab_tests'
});

var AB_Open_Time = bookshelf.Model.extend({
  tableName: 'ab_open_time'
});

var AB_Click_Time = bookshelf.Model.extend({
  tableName: 'ab_click_time'
});

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

  // Copy the winner object out so that the imgs object can be 'frozen'
  // this[ ABTestID ].winner = this[ ABTestID].imgs[ highestClickImageID ];
  var winner = this[ ABTestID].imgs[ highestClickImageID ];
  var newWinner = {};
  for( var key in winner ) {
    newWinner[key] = winner[key];
  }
  console.log( 'newWinner: ', newWinner );

  newWinner.imgid = highestClickImageID;
  this[ ABTestID ].winner = newWinner;
  console.log( 'this is the winner!: ', this[ ABTestID ].winner );
  return highestClickImageID;
}


MemCache.prototype.ABTestImgDBInfo = function( ABTestID ) {
  var results = {}, ab_imgs = this[ ABTestID ].imgs, totalViews = 0, totalClicks = 0;
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
  var redir;
  imgs = this[ ABTestID ].imgs;
  if( this.winnerExists(ABTestID) ) {
    this[ ABTestID ].winner.clicks++;
    redir = this[ ABTestID ].winner.redirectURL;
  } else {
    for( var img in imgs ){
      if( imgs[img].emails[email] ) {
        console.log('inside if')
        imgs[img].clicks++;
        redir = imgs[img].redirectURL;
      }
    }
  }
  this[ ABTestID ].clickTime[ timeClicked + '_' + (timeClicked + 1) ]++;
  return redir;
}

// Gets a random img, increments img's views, adds email to img's email object
MemCache.prototype.getRandomImg = function( ABTestID, email, timeViewed ){
  var imgKeys = Object.keys( this[ABTestID].imgs );
  var randomIndex = Math.floor( Math.random() * imgKeys.length );
  var selectedImgKey = imgKeys[ randomIndex ];
  this[ ABTestID ].imgs[ selectedImgKey ].emails[ email ] = email;
  this[ ABTestID ].imgs[ selectedImgKey ].views++;
  this[ ABTestID ].viewTime[ timeViewed + '_' + (timeViewed + 1) ]++;
  return this[ ABTestID ].imgs[ selectedImgKey ].fileLocation;
}

MemCache.prototype.winnerViewed = function( ABTestID, email, timeViewed ) {
 this[ ABTestID ].winner.emails[ email ] = email;
 this[ ABTestID ].winner.views++;
 this[ ABTestID ].viewTime[ timeViewed + '_' + (timeViewed + 1) ]++;
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
      viewTime: { '0_1': 0, '1_2': 0, '2_3': 0, '3_4': 0, '4_5': 0, '5_6': 0, '6_7': 0, '7_8': 0, '8_9': 0, '9_10': 0, '10_11': 0, '11_12': 0,
        '12_13': 0, '13_14': 0, '14_15': 0, '15_16': 0, '16_17': 0, '17_18': 0, '18_19': 0, '19_20': 0, '20_21': 0, '21_22': 0, '22_23': 0, '23_24': 0 },
      clickTime: { '0_1': 0, '1_2': 0, '2_3': 0, '3_4': 0, '4_5': 0, '5_6': 0, '6_7': 0, '7_8': 0, '8_9': 0, '9_10': 0, '10_11': 0, '11_12': 0,
        '12_13': 0, '13_14': 0, '14_15': 0, '15_16': 0, '16_17': 0, '17_18': 0, '18_19': 0, '19_20': 0, '20_21': 0, '21_22': 0, '22_23': 0, '23_24': 0 },
      winner: null,
      device_open: {
        'iPhone': 0,
        'iPad': 0,
        'Android Phone': 0,
        'Android Tablet': 0,
        'Desktop': 0,
        'Other': 0
      }
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
  var context = this;
  setInterval( function() { context.syncToDatabase( ABTestID ) }, 10000 );
};

MemCache.prototype.syncToDatabase = function( ABTestID ){
  console.log( 'syncToDatabase' );
 
  //Override clicks and views for each image
  updateImgsClicksAndViews( this, ABTestID );

  //Override views and clicks for the campaign
  updateCampaignsClicksAndViews( this, ABTestID );

  //Override click time for ab_test_id
  syncViewTime( ABTestID, this );
  //Override view time for ab_test_id
  syncClickTime( ABTestID, this );
  //Update winner clicks/views if there is a winner
  if( this.winnerExists(ABTestID) ) {
    syncWinner( ABTestID, this );
  }

};

var syncViewTime = function(ABTestID, context) {
  var ab_test_obj = context[ABTestID].viewTime;

  AB_Open_Time.where({ab_test_id: ABTestID}).save(ab_test_obj,{method: 'update'})
    .then(function(ab_test){
      // console.log('result++++', ab_test);
    });
}

var syncClickTime = function(ABTestID, context) {
  var ab_test_obj = context[ABTestID].clickTime;

  AB_Click_Time.where({ab_test_id: ABTestID}).save(ab_test_obj,{method: 'update'})
    .then(function(ab_test){
      // console.log('result++++', ab_test);
    });
}

var syncWinner = function(ABTestID, context) {
  var ab_test_obj = context[ ABTestID ].winner;
  var ab_winner_obj = {};
  ab_winner_obj.winner_imgid = ab_test_obj.imgid;
  ab_winner_obj.winner_views = ab_test_obj.views;
  ab_winner_obj.winner_clicks = ab_test_obj.clicks;

  AbTest.where({ab_test_id: ABTestID}).save(ab_winner_obj,{method: 'update'})
    .then(function(ab_test) {
    });
}


var memCache = new MemCache();

exports.memCache = memCache;

// memCache.addABTest( 3, 500000, [6, 'www.google.com', './somePicture.png'], [7, 'www.facebook.com', './somePicture7.png'] );
// console.log( memCache.getRandomImg( 3, 'armandopmj@gmail.com' ) );
// console.log( memCache.getRedirectUrl( 3, 'armandopmj@gmail.com' ) )
