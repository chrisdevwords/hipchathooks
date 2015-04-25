'use strict';

var $ = require('jquery-deferred');
var _ = require('underscore');
var Imgur = require('./Imgur');

function HipChatBot () {};

/**
 * Generic request Parser for HipChat WebHooks
 * Override this in subclasses.
 * Returns a promise that resolves with a generic HipChat message
 * Should reject with an error in subclassed implementations.
 * @param {Object} reqData - the HipChat request body
 * @returns {JqueryDeferred}
 */
HipChatBot.prototype.parseReq = function (reqData) {

    var def = $.Deferred();
    var sender = this.getSenderHandle(reqData);
    def.resolve({
        color: 'green',
        message: 'oh hey, ' + sender + '. it\'s a generic bot.',
        'message_format': 'text'
    });

    return def.promise();
};

/**
 * Parses a chat message to return gif based on text after the slug
 * Returns a promise that resolves with a HipChat message consisting of a link to an Imgur GIF.
 * Promise rejects with a HipChat message object containing an error indicating no GIFs were found.
 * @param {Object} reqData - the HipChat request body
 * @param {String} slug - optional, the slug to remove from the message, default is "/gif"
 * @returns {JqueryDeferred}
 *
 */
HipChatBot.prototype.parseGifReq = function (reqData, slug) {
    var msg = this.getMessageText(reqData);
    var query = this.stripSlug(msg, slug) + ' ext:gif';
    return this.findImg(query, reqData);
};

/**
 * Searches Imgur.com for an image, returning a promise.
 * The promise resolves with a HipChat response message containing a link to an Imgur image.
 * The promise rejects with a HipChat error response if no images could be found.
 * @param {String} query - what you're searching for
 * @param {Object} reqData - the HipChat request body
 * @returns {JqueryDeferred}
 */
HipChatBot.prototype.findImg = function (query, reqData) {

    var imgur = new Imgur(process.env.IMGUR_ID);
    var def = $.Deferred();
    var handle = this.getSenderHandle(reqData);
    imgur.getRandomFromSearch(encodeURIComponent(query))
        .done(function (resp) {
            def.resolve({
                color: 'green',
                message: resp.link,
                'message_format': 'text'
            });
        })
        .fail(function (err) {
            def.reject({
                color: 'red',
                message: 'Sorry, ' + handle + '. I couldn\'t find a GIF with that query. I suck.',
                'message_format': 'text'
            });
        });

    return def.promise();
};

/**
 * Remove the slug from a HipChat message string, returning the message.
 * @param {String} msg - the string of a HipChat message
 * @param {String} slug - the hook/slug of the message, ex: '/gif'
 * @returns {String}
 */
HipChatBot.prototype.stripSlug = function (msg, slug) {
    return _.last(msg.split(slug)).trim();
};

/**
 * Retrieves a sender handle from a HipChat request object.
 * @param {object} reqData - HipChat request body
 * @returns {string} - an appropriate recipient name for personalized responses
 */
HipChatBot.prototype.getSenderHandle = function (reqData) {
    var msg = this.getMessage(reqData);
    if (msg.from && _.isString(msg.from.name)) {
        return msg.from.name.split(' ')[0];
    }
    return 'guys';
};

/**
 * finds the message object in the req body
 * @param {Object} reqData - hip chat request body
 * @returns {Oject} - message object from a hipchat request
 */
HipChatBot.prototype.getMessage = function (reqData) {
    if (reqData.item) {
        return reqData.item.message || {};
    }
    return {};
};

/**
 * Finds the message string in the req body.
 * @param {Object} reqData - hip chat request body
 * @returns {String} - message string from a HipChat request
 */
HipChatBot.prototype.getMessageText = function (reqData) {
    return this.getMessage(reqData).message || '';
};

/**
 * Finds the message string in the req body, removes the slug and separates it into lower case fragments
 * @param {Object} reqData - hip chat request body
 * @param {String} slug - optional, the slug to be removed from the message
 * @returns {Array}
 */
HipChatBot.prototype.getMessageExploded = function (reqData, slug) {
    var message = this.getMessageText(reqData);
    message = this.stripSlug(message, slug).toLowerCase();
    return message.split(' ');
};

module.exports = HipChatBot;
