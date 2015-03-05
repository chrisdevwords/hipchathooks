'use strict';

var express = require('express');
var router = express.Router();
var Imgur = require('../lib/Imgur');
var chat = require('../lib/ChatHelper');

router.get('/', function (req, res) {
	res.end('oh hey. it\'s the api.' + process.env.IMGUR_SECRET);
});

router.post('/gif', function (req, res) {
	//console.log(JSON.stringify(req.body));
	chat.parseGif(req.body)
		.always(function (resp) {
			res.json(resp);
		});
});

router.post('/jif', function (req, res) {
	//console.log(JSON.stringify(req.body));
	chat.parseGif(req.body)
		.always(function (resp) {
			res.json(resp);
		});
});

router.post('/dan', function (req, res) {
	//console.log(JSON.stringify(req.body));
	chat.parseDan(req.body)
		.always(function (resp) {
			res.json(resp);
		});
});

router.post('/', function (req, res) {
	//console.log(JSON.stringify(req.body));
	chat.parse(req.body)
		.always(function (resp) {
			res.json(resp);
		});
});

router.get('/gif', function (req, res) {
	var q = req.params.q || '';
	var imgur = new Imgur(process.env.IMGUR_ID || '');
	q += '+ext:gif';
	imgur.search(q).always(function(resp) {
		res.send(resp.data);
	})
});

module.exports = router;