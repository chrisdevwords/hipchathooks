'use strict';

var express = require('express');
var router = express.Router();
var mockHook = require('../../tests/mock/webHook');
var HipChatBot = require('../lib/HipChatBot');

var DanBot = require('../lib/DanBot');
var VigodaBot = require('../lib/VigodaBot');
var TubeBot = require('../lib/TubeBot');

/**
 * GifBot
 */
router.get('/gif', function (req, res) {
    res.json({
        status: 200,
        msg: 'Hit this endpoint with POST for GifBot.' +
        ' Use the example data for testing in Chrome DHC or Postman.',
        example: mockHook.getHook('/gif mj dunk', 'Your Name')
    });
});

router.post('/gif', function (req, res) {
    var bot = new HipChatBot(process.env.IMGUR_ID || '');
    bot.parseGifReq(req.body, '/gif')
        .always(function (resp) {
            res.json(resp)
        });
});

/**
 * JifBot
 */
router.get('/jif', function (req, res) {
    res.json({
        status: 200,
        msg: 'Hit this endpoint with POST for JifBot.' +
        ' Use the example data for testing in Chrome DHC or Postman.',
        example: mockHook.getHook('/jif Worf', 'Your Name')
    });
});

router.post('/jif', function (req, res) {
    var bot = new HipChatBot(process.env.IMGUR_ID || '');
    bot.parseGifReq(req.body, '/jif')
        .always(function (resp) {
            res.json(resp)
        });
});

/**
 * VigodaBot
 */
router.get('/vigoda', function (req, res) {
    res.json({
        status: 200,
        msg: 'Hit this endpoint with POST for VigodaBot.' +
        ' Use the example data for testing in Chrome DHC or Postman.',
        example: mockHook.getHook('/vigoda Geddy Lee', 'Your Name')
    });
});

router.post('/vigoda',  function (req, res) {
    var bot = new VigodaBot();
    bot.parseReq(req.body)
        .always(function (msg) {
            res.send(msg);
        });
});

/**
 * TubeBot
 */
router.get('/tube', function (req, res) {
    res.json({
        status: 200,
        msg: 'Hit this endpoint with POST for TubeBot.' +
        ' Use the example data for testing in Chrome DHC or Postman.',
        example: mockHook.getHook('/tube Leroy Jenkins', 'Your Name')
    });
});

router.post('/tube',  function (req, res) {
    var bot = new TubeBot(process.env.YOUTUBE_KEY || '');
    bot.parseReq(req.body)
        .always(function (msg) {
            res.send(msg);
        });
});

/**
 * DanBot
 */
router.get('/dan', function (req, res) {
    res.json({
        status: 200,
        msg: 'Hit this endpoint with POST for DanBot.' +
        ' Use the example data for testing in Chrome DHC or Postman.',
        example: mockHook.getHook('/dan advice', 'Your Name')
    });
})

router.post('/dan',  function (req, res) {
    var bot = new DanBot(process.env.IMGUR_ID || '');
    bot.parseReq(req.body)
        .always(function (msg) {
            res.send(msg);
        });
});

/**
 * generic handler.
 */
router.post('/', function (req, res) {
    var bot = new HipChatBot();
    bot.parseReq(req.body)
        .always(function (msg) {
            res.send(msg);
        });
});

router.get('/', function (req, res) {
    res.end('oh hey. it\'s the api.');
});

module.exports = router;
