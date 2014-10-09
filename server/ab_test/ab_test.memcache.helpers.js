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
    console.log('ab_imgs[img].clicks: ', ab_imgs[img].clicks);
    Image.where({ ab_imgs_id: img })
         .save( { clicks: ab_imgs[img].clicks, views: ab_imgs[img].views }, {method: 'update'} )
         .then(function(result) {
            console.log('updateImgs result: ', result);
         });
  } 
};

exports.updateCampaignsClicksAndViews = function( that, ABTestID ) {
  var campaignID, totalViews = 0, totalClicks = 0, ab_imgs = that[ ABTestID ].imgs;
  var campaign_data = {};
  AbTest.where( {ab_test_id: ABTestID} )
        .fetch()
        .then(function( abRow ){ 
          for( var img in ab_imgs ){
            totalViews += ab_imgs[img].views;
            totalClicks += ab_imgs[img].clicks;
            // ab_imgs[img].clicks = 0;
          }
          campaignID = abRow.attributes.campaign_id;
          Campaigns.where( { campaign_id: campaignID } )
                   .fetch()
                   .then(function( campaignRow ){
                      // campaignClicks = campaignRow.attributes.clicks + totalClicks;
                      campaign_data.iphone = that[ABTestID].device['iPhone'];
                      campaign_data.ipad = that[ABTestID].device['iPad'];
                      campaign_data.android_phone = that[ABTestID].device['Android Phone'];
                      campaign_data.android_pad = that[ABTestID].device['Android Tablet'];
                      campaign_data.desktop = that[ABTestID].device['Desktop'];
                      campaign_data.device_other = that[ABTestID].device['Other'];


                      campaign_data.clicks = totalClicks;
                      campaign_data.views = totalViews;

                      console.log('campaign_data========', campaign_data);

                      Campaigns.where( { campaign_id: campaignID } )
                               .save( campaign_data, {method: 'update'} );
                   })
        }) 
};

