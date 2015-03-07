'use strict';

var express = require('express');
var router = express.Router();
var danBot = require('../lib/DanBot');
var chat = require('../lib/ChatHelper');
var Imgur = require('../lib/Imgur');


router.post('/gif', chat.sendGIF);

router.post('/jif', chat.sendJIF);

router.post('/dan',  function (req, res) {
    console.log(JSON.stringify(req.body));
    chat.parseBotReq(danBot, req, res)

});

router.post('/', chat.sendGeneric);

// get endpoints mostly for testing

router.get('/', function (req, res) {
    res.end('oh hey. it\'s the api.');
});

router.get('/gif/dan', function (req, res) {
    var imgur = new Imgur(process.env.IMGUR_ID || '');
    imgur.getAlbum(danBot.IMGUR_GALLERY).always(function(resp) {
        res.send(resp.data);
    })
});

router.get('/gif/dan/random', function (req, res) {
    var imgur = new Imgur(process.env.IMGUR_ID || '');
    imgur.getRandomFromAlbum(danBot.IMGUR_GALLERY).always(function(resp) {
        res.json(resp);
    })
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