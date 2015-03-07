'use strict';

var _ = require('underscore');
var bot = require('../lib/GenericBot');

var chatHelper = module.exports = {

    /**
     * post handler for gif endpoints
     * @param {Express.Request} req
     * @param {Express.Respone} res
     */
    sendGIF : function (req, res) {
        console.log(JSON.stringify(req.body));
        bot.parseGifReq(req.body)
            .always(function (resp) {
                res.json(resp);
            });
    },

    /**
     * post handler for generic endpoints
     * @param {Express.Request} req
     * @param {Express.Respone} res
     */
    sendGeneric : function (req, res) {
        chatHelper.parseBotReq(bot, req, res);
    },

    /**
     * post route, interfaces with subclass of /lib/GenericBot
     * @param {object} myBot - your bot module
     * @param {Express.Request} req
     * @param {Express.Respone} res
     */
	parseBotReq : function (myBot, req, res) {
        console.log(JSON.stringify(req.body));
        myBot.parseReq(req.body)
            .always(function(msg){
                res.send(msg);
            });
	}

};
