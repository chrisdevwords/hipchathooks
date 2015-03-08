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

        var msg = this.getMessageText(data);
        var query = this.stripSlug(msg, slug) + ' ext:gif';
        return this.findImg(query, data);

    },

    /**
     * searches imgur for an img
     * @param {string} query
     * @param {object} reqData - the hipchat request body
     * @returns {jquery-deferred} - promise
     *           resolves with hipchat response message containing img
     *           rejects with hipchat error response if no imgs found with that query
     */
    findImg : function (query, reqData) {

        var imgur = new Imgur(process.env.IMGUR_ID);
        var def = $.Deferred();
        var handle = this.getSenderHandle(reqData);
        imgur.getRandomFromSearch(encodeURIComponent(query))
            .done(function(resp) {
                def.resolve({
                    color: "green",
                    message: resp.link,
                    message_format: "text"
                });
            })
            .fail(function(err){
                def.reject({
                    color: "red",
                    message: 'Sorry, ' + handle + '. I couldn\'t find a GIF with that query. I suck.',
                    message_format: "text"
                });
            });

        return def.promise();
    },

    /**
     * remove the slug from a string
     * @param {string} msg
     * @param {string} slug
     * @returns {string}
     */
    stripSlug : function (msg, slug) {
        return  _.last(msg.split(slug)).trim();
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
    },

    /**
     * finds the message string in the req body
     * @param {object} reqData - hip chat request body
     * @returns {string} - message string from a hipchat request
     */
    getMessageText : function (reqData) {
        return this.getMessage(reqData).message || '';
    },

    /**
     * finds the message string in the req body, removes the slug and seperates it into lower case fragments
     * @param {object} reqData - hip chat request body
     * @param {string} slug (optional) - the slug to be removed from the message
     * @returns {array} - array of words in chat message
     */
    getMessageExploded : function(reqData, slug) {
        var message = this.getMessageText(reqData);
        message = this.stripSlug(message, slug).toLowerCase();
        return message.split(' ');
    }

};