'use strict';

var express = require('express');
var router = express.Router();
var hooks = require('../model/HipChatHooks');

router.get('/', function (req, res) {
    res.render('index', hooks.getHooks(req));
});

module.exports = router;
