'use strict';

var _ = require('underscore');
var express = require('express');
var router = express.Router();
var danBot = require('../lib/DanBot');
var vigodaBot = require('../lib/VigodaBot');
var tubeBot = require('../lib/TubeBot');
var chat = require('../lib/ChatHelper');

/**
 * GifBot
 */
router.get('/gif', function(req, res){
    res.json({
        status : 200,
        msg : 'Hit this endpoint with POST for GifBot.' +
        ' Use the example data for testing in Chrome DHC or Postman.',
        example : chat.getExamplePostData('/gif mj dunk')
    });
});

router.post('/gif', chat.sendGIF);

/**
 * JifBot
 */
router.get('/jif', function(req, res){
    res.json({
        status : 200,
        msg : 'Hit this endpoint with POST for JifBot.' +
        ' Use the example data for testing in Chrome DHC or Postman.',
        example : chat.getExamplePostData('/jif worf')
    });
});

router.post('/jif', chat.sendJIF);

/**
 * VigodaBot
 */
router.get('/vigoda', function(req, res){
    res.json({
        status : 200,
        msg : 'Hit this endpoint with POST for VigodaBot.' +
        ' Use the example data for testing in Chrome DHC or Postman.',
        example : chat.getExamplePostData('/vigoda Geddy Lee')
    });
});

router.post('/vigoda',  function (req, res) {
    chat.parseBotReq(vigodaBot, req, res)
});

/**
 * TubeBot
 */
router.get('/tube', function(req, res){
    res.json({
        status : 200,
        msg : 'Hit this endpoint with POST for TubeBot.' +
        ' Use the example data for testing in Chrome DHC or Postman.',
        example : chat.getExamplePostData('/tube Leroy Jenkins')
    });
});

router.post('/tube',  function (req, res) {
    chat.parseBotReq(tubeBot, req, res)
});

/**
 * DanBot
 */
router.get('/dan', function(req, res){
    res.json({
        status : 200,
        msg : 'Hit this endpoint with POST for DanBot.' +
        ' Use the example data for testing in Chrome DHC or Postman.',
        example : chat.getExamplePostData('/dan advice')
    });
})

router.post('/dan',  function (req, res) {
    chat.parseBotReq(danBot, req, res)
});

/**
 * generic handler.
 */
router.post('/', chat.sendGeneric);

router.get('/', function (req, res) {
    res.end('oh hey. it\'s the api.');
});

module.exports = router;