'use strict';

var $ = require('jquery-deferred');
var _ = require('underscore');
var Imgur = require('./Imgur');

module.exports = {

    /**
     * generic request parser,
     * override this in subclasses
     * @param {object} reqData  - the hipchat request body
     * @returns {jquery-deferred} - promise
     *          resolves with generic hipchat message
     *          should reject with hipchat error message in subclasses
     */
    parseReq : function (reqData) {

        var def = $.Deferred();
        var sender = this.getSenderHandle(reqData);
        def.resolve({
            color: 'green',
            message_prefix: 'Message Prefix:',
            message: 'oh hey, ' + sender + '. it\'s a generic bot.',
            message_format: "text"
        });

        return def.promise();
    },

    /**
     * parses chat message to return gif based on text after slug
     * @param {object} reqData - the hipchat request body
     * @param {string} slug (optional) - the slug to remove from the message, default is "/gif"
     * @returns {jquery-deferred} - promise
     *           resolves with hipchat response message containing gif
     *           rejects with hipchat error response if no gifs found
     */
    parseGifReq : function (data, slug) {

        var msg = data.item.message.message;
        var query = _.last(msg.split(slug || '/gif')) + ' ext:gif';

        return this.findGIF(query, data);
    },

    /**
     * searches imgur for a gif
     * @param {string} query
     * @param {object} reqData - the hipchat request body
     * @returns {jquery-deferred} - promise
     *           resolves with hipchat response message containing gif
     *           rejects with hipchat error response if no gifs found with that query
     */
    findGIF : function (query, reqData) {

        var imgur = new Imgur(process.env.IMGUR_ID);
        var def = $.Deferred();
        var handle = this.getSenderHandle(reqData);

        imgur.getRandomFromSearch(encodeURIComponent(query))
            .done(function(resp) {
                def.resolve({
                    color: "green",
                    message_prefix: "GIF:",
                    message: resp.link,
                    message_format: "text"
                });
            })
            .fail(function(err){
                def.reject({
                    color: "red",
                    message_prefix: "Whoops:",
                    message: 'Sorry, ' + handle + '. I couldn\'t find a GIF with that query. I suck.',
                    message_format: "text"
                });
            });

        return def.promise();
    },

    /**
     * @param {object} reqData - hip chat request body
     * @returns {string} - an appropriate recipient name for personalized responses
     */
    getSenderHandle : function (reqData) {
        var msg = this.getMessage(reqData);
        if (msg.from && _.isString(msg.from.name)) {
            return msg.from.name.split(' ')[0];
        }
        return 'guys';
    },

    /**
     * finds the message object in the req body
     * @param {object} reqData - hip chat request body
     * @returns {object} - message object from a hipchat request
     */
    getMessage : function (reqData) {
        if (reqData.item) {
            return reqData.item.message || {};
        }
        return {};
    }



};