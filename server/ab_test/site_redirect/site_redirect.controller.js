// 'use strict';

// var memCache = {};
// TODO: Require the appropriate memcache file
var memCache = require('../ab_test.memcache').memCache;

var bookshelf = require('../../config/bookshelf_config');
var ABImg = bookshelf.Model.extend({ tableName: 'ab_imgs' });
var checkDevice = require('../../helpers.js').checkDevice;

exports.serveSite = function(req, res) {
  // var currentHour = new Date().getHours();

  var currentDate_UTC = new Date();
  // convert to msec
  // add local time zone offset
  // get UTC time in msec
  var offset = -7;
  console.log('timezone offset: ', currentDate_UTC.getTimezoneOffset());
  var currentHour_UTC = currentDate_UTC.getTime() + (currentDate_UTC.getTimezoneOffset() * 60000);

  // create new Date object for different city
  // using supplied offset
  var currentHour = new Date(currentHour_UTC + (3600000*offset)).getHours();

  console.log('in click currentHour: ', currentHour);

  var abTestID = req.params.abTestID;
  console.log('abTestID ', abTestID);
  // var userEmail = req.url.match(/\b[a-zA-Z0-9_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9.-]+\b/g)[0];

  var userEmail = req.originalUrl.split('/').pop();
  console.log('useremail: ', userEmail);

  //collect the device_click data
  var device = checkDevice(req, res);
  memCache[ abTestID ].device_click[device]++;

  var redirectUrl = memCache.getRedirectUrl(abTestID, userEmail, currentHour);

  // If AB Test or redirectUrl doesn't exist
  if(!memCache[abTestID] || !redirectUrl) { return res.status(404); }
  
  res.redirect(redirectUrl);

  // for(var imgID in memCache[abTestID].img) {
  //   // Increment clicks for proper image
  //   if(userEmail in imgID.emails) {
  //     targetImgID = imgID;
  //     redirectUrl = imgID.redirect;
  //     imgID.clicks++;
  //   }
  // }

};