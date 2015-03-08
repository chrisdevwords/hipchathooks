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
        //console.log(JSON.stringify(req.body));
        bot.parseGifReq(req.body, '/gif')
            .always(function (resp) {
                res.json(resp);
            });
    },

    /**
     * post handler for jif endpoints
     * @param {Express.Request} req
     * @param {Express.Respone} res
     */
    sendJIF : function (req, res) {
        //console.log(JSON.stringify(req.body));
        bot.parseGifReq(req.body, '/jif')
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
        //console.log(JSON.stringify(req.body));
        myBot.parseReq(req.body)
            .always(function(msg){
                res.send(msg);
            });
	},

    /**
     * example post data for testing endpoints in PostMan or Chrome DHC
     * @param {string} exampleMessage
     * @returns {{event: string, item: {message: {date: string, from: {mention_name: string, name: string}, message: *, type: string}, room: {id: number, name: string}}}}
     */
    getExamplePostData : function (exampleMessage) {
        return {
            event:  "room_message",
            item : {
                message : {
                    date : new Date().toTimeString(),
                    from : {
                        mention_name : "BuzzBoyardee",
                        name : "Chris Edwards"
                    },
                    message : exampleMessage,
                    type : "message"
                },
                room : {
                    id : 211269,
                    name : "Hook Testing"
                }
            }
        };
    }


};
