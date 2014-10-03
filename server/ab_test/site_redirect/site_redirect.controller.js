'use strict';

var memcache = {};
// TODO: Require the appropriate memcache file
// var memcache = require('../ab_test_memcache');

var bookshelf = require('../../config/bookshelf_config');
var ABImg = bookshelf.Model.extend({ tableName: 'ab_imgs' });

exports.serveSite = function(req, res) {
  var abTestID = req.params.ab_testID;
  var userEmail = req.url.match(/\b[a-zA-Z0-9_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9.-]+\b/g)[0];
  var targetImgID;
  var redirectUrl;

  // If AB Test doesn't exist
  if(!memcache[abTestID]) { return res.status(404); }

  // Check if there's a winner!
  if(memcache[abTestID].winner) {
    var winner = memcache[abTestID].winner;
    winner.clicks++;
    return res.redirect(winner.redirect);
  }

  for(var imgID in memcache[abTestID].img) {
    // Increment clicks for proper image
    if(userEmail in imgID.emails) {
      targetImgID = imgID;
      redirectUrl = imgID.redirect;
      imgID.clicks++;
    }
  }

  if(redirectUrl) { return res.redirect(redirectUrl); }

  // Find redirect_url from database
  ABImg.fetch()
    .where({ ab_test_id: abTestID })
    .then(function(abImg) {
      redirectUrl = abImg.redirect_url;
      // Save redirect url in memcache
      memcache[abTestID].img.targetImgID.redirect = redirectUrl;
      // Redirect user
      res.redirect(redirectUrl);
    });
};

// TODO: Helper functions