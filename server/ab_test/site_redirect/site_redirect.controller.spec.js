'use strict';

var app = require('../../server.js');
var bookshelf = require('../../config/bookshelf_config.test');
var request = require('supertest');
var chai = require('chai');
var expect = chai.expect;

describe('Tests: site_redirect.controller', function() {

  // TODO: Figure out how to access this memcache
  var memcache = {
    1: {
      img: {
        1: {
          emails: { '1email@1image.com': true, '2email@1image.com': true },
          redirect: 'http://redirect1.com',
          clicks: 0
        },
        2: {
          emails: { '1email@2image.com': true, '2email@2image.com': true },
          clicks: 0
        },
        3: {
          emails: { '1email@3image.com': true, '2email@3image.com': true },
          clicks: 0
        }
      }
    }
  };

});