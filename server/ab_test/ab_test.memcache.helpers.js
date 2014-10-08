var bookshelf = require('../config/bookshelf_config');

var Image = bookshelf.Model.extend({
  tableName: 'ab_imgs'
});
var Campaigns = bookshelf.Model.extend({
  tableName: 'campaigns'
});
var AbTest = bookshelf.Model.extend({
  tableName: 'ab_tests'
});

exports.updateImgsClicksAndViews = function( that, ABTestID ) {
  var ab_imgs = that[ ABTestID ].imgs;
  for( var img in ab_imgs ){
    Image.where({ ab_imgs_id: img })
         .save( { clicks: ab_imgs[img].clicks, views: ab_imgs[img].views }, {method: 'update'} );
  } 
};

exports.updateCampaignsClicksAndViews = function( that, ABTestID ) {
  var campaignID, totalViews = 0, totalClicks = 0, ab_imgs = that[ ABTestID ].imgs;
  AbTest.where( {ab_test_id: ABTestID} )
        .fetch()
        .then(function( abRow ){ 
          for( var img in ab_imgs ){
            totalViews += ab_imgs[img].views;
            totalClicks += ab_imgs[img].clicks;
            ab_imgs[img].clicks = 0;
          }
          Campaigns.where( { campaign_id: campaignID } )
                   .fetch()
                   .then(function( campaignRow ){
                      campaignClicks = campaignRow.attributes.clicks + totalClicks;
                      Campaigns.where( { campaign_id: campaignID } )
                               .save( { clicks: campaignClicks, views: totalViews }, {method: 'update'} );
                   })
        }) 
};