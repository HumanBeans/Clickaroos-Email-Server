// Module for creating a MemCache object

var MemCache = function() { 
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

MemCache.prototype.hasABTest = function( ABTestID ) {
  return (ABTestID in this)
}


////////////////////////////////////////////////////////
//  .addABTest() adds a new ABTest to a MemCache object
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

var cache = new MemCache();
console.log('MemCache addabttest:', cache.addABTest);

exports.cache = cache;