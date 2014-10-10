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
var AB_Click_Device = bookshelf.Model.extend({
  tableName: 'ab_click_device'
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
                      campaign_data.iphone = that[ABTestID].device_open['iPhone'];
                      campaign_data.ipad = that[ABTestID].device_open['iPad'];
                      campaign_data.android_phone = that[ABTestID].device_open['Android Phone'];
                      campaign_data.android_pad = that[ABTestID].device_open['Android Tablet'];
                      campaign_data.desktop = that[ABTestID].device_open['Desktop'];
                      campaign_data.device_other = that[ABTestID].device_open['Other'];


                      campaign_data.clicks = totalClicks;
                      campaign_data.views = totalViews;

                      console.log('campaign_data======== ', campaign_data);

                      Campaigns.where( { campaign_id: campaignID } )
                               .save( campaign_data, {method: 'update'} );
                   })
        })
        .then(function(){
          var abClickDeviceObj = {};
          abClickDeviceObj.iphone = that[ABTestID].device_click['iPhone'];
          abClickDeviceObj.ipad = that[ABTestID].device_click['iPad'];
          abClickDeviceObj.android_phone = that[ABTestID].device_click['Android Phone'];
          abClickDeviceObj.android_pad = that[ABTestID].device_click['Android Tablet'];
          abClickDeviceObj.desktop = that[ABTestID].device_click['Desktop'];
          abClickDeviceObj.device_other = that[ABTestID].device_click['Other'];

          console.log('ab_click_device data========, ', abClickDeviceObj);

          AB_Click_Device.where({ ab_test_id: ABTestID }).save(abClickDeviceObj, {method: 'update'});
        }); 
};

