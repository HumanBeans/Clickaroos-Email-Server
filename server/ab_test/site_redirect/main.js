'use strict';

var express = require('express');
var controller = require('./site_redirect.controller');

var router = express.Router();

router.get('/*', controller.serveSite);