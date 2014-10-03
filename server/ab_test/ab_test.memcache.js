// Module for creating a MemCache object

<<<<<<< HEAD
var MemCache = function() { 
=======
var MemCache = function() {
>>>>>>> (feat) add getRandomImg and getRedirectUrl methods to MemCache
};

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

<<<<<<< HEAD
MemCache.prototype.hasABTest = function( ABTestID ) {
  return (ABTestID in this);
}


////////////////////////////////////////////////////////
//  .addABTest() adds a new ABTest to a MemCache object
=======
// Gets the Redirect URL for the img viewed by the emial and increments the img clicks count
MemCache.prototype.getRedirectUrl = function( ABTestID, email ){
  imgs = this[ ABTestID ].imgs
  for( var img in imgs ){
    if( email in imgs[img].emails ) {
      imgs[img].clicks++;
      return imgs[img].redirectURL;
    }
  }
}

// Gets a random img, increments img's views, adds email to img's emial object
MemCache.prototype.getRandomImg = function( ABTestID, email ){
  var imgKeys = Object.keys( this[ABTestID].imgs );
  var randomIndex = Math.floor( Math.random() * imgKeys.length );
  var selectedImgKey = imgKeys[ randomIndex ];
  this[ ABTestID ].imgs[ selectedImgKey ].emails[ email ] = email;
  this[ ABTestID ].imgs[ selectedImgKey ].views++;
  return this[ ABTestID ].imgs[ selectedImgKey ].fileLocation;
}

MemCache.prototype.hasABTest = function( ABTestID ) {
  return (ABTestID in this)
}


///////////////////////////////////////////////////////////////////////
//  .addABTest() adds a new ABTest to a memCache object
>>>>>>> (feat) add getRandomImg and getRedirectUrl methods to MemCache
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
      endTime: endTime
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

<<<<<<< HEAD
var memCache = new MemCache();
<<<<<<< HEAD

exports.memCache = memCache;
=======
memCache.addABTest( 3, 500000, [6, 'www.google.com', './somePicture.png'], [7, 'www.facebook.com', './somePicture7.png'] );
console.log( memCache.getRandomImg( 3, 'armandopmj@gmail.com' ) );
console.log( memCache.getRedirectUrl( 3, 'armandopmj@gmail.com' ) )


// exports = memCache;
>>>>>>> (feat) add getRandomImg and getRedirectUrl methods to MemCache
=======
// var memCache = new MemCache();
// memCache.addABTest( 3, 500000, [6, 'www.google.com', './somePicture.png'], [7, 'www.facebook.com', './somePicture7.png'] );
// console.log( memCache.getRandomImg( 3, 'armandopmj@gmail.com' ) );
// console.log( memCache.getRedirectUrl( 3, 'armandopmj@gmail.com' ) )

exports = memCache;
>>>>>>> (test) Comment out test data
