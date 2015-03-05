'use strict';

var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {

	res.send('oh hey. I guess this is where one could add the hooks to his/her chat room.');
});

module.exports = router;