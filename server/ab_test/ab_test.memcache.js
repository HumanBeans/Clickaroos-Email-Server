// Module for creating a memcache object

var memCache = function() { 
};

memCache.prototype.ABTestImgDBInfo = function( ABTestID ) {
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

memCache.prototype.hasABTest = function( ABTestID ) {
  return (ABTestID in this)
}


////////////////////////////////////////////////////////
//  .addABTest() adds a new ABTest to a memCache object
//
//  memCacheExample.addABTest( 
//    ABTestID, 
//    endTime, 
//    [ imgID1, redirectURL1, fileLocation1 ],
//    [ imgID2, redirectURL2, fileLocation2 ],... 
//  );

memCache.prototype.addABTest = function( ABTestID, endTime ) {
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

var memCache = new memCache();

exports = memCache;