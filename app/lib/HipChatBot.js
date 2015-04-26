'use strict';

var $ = require('jquery-deferred');
var _ = require('underscore');
var Imgur = require('./Imgur');

/**
 * Parses HipChat requests.
 * Promises resolve with HipChat response objects,
 * and fail with HipChat response objects.
 * @see {@link https://www.hipchat.com/docs/apiv2/webhooks}
 * @constructor
 */
function HipChatBot () {};

/**
 * start every error with an apology...
 * @type {string}
 */
HipChatBot.ERROR_ROOT = 'Sorry, {n}. ';

/**
 * error message for empty search result.
 * @type {string}
 */
HipChatBot.ERROR_NO_RESULTS = HipChatBot.ERROR_ROOT +
    'I couldn\'t find anything with the query: "{q}". I suck.';

/**
 * error message for 500.
 * @type {string}
 */
HipChatBot.ERROR_500 = HipChatBot.ERROR_ROOT +
    'Something\'s borked. Try again later...';

/**
 * error message for 500.
 * @type {string}
 */
HipChatBot.ERROR_BAD_HOOK = HipChatBot.ERROR_ROOT +
    'Something\'s borked. HipChat data looks funny.';

/**
 * Generic request Parser for HipChat WebHooks
 * Override this in subclasses.
 * Returns a promise that resolves with a generic HipChat message
 * Should reject with an error in subclassed implementations.
 * @param {Object} reqData - the HipChat request body
 * @returns {JqueryDeferred}
 */
HipChatBot.prototype.parseReq = function (reqData) {

    var _this = this;
    var def = $.Deferred();
    var sender = this.getSenderHandle(reqData);
    var message = this.getMessageText(reqData);

    if (!sender || !message) {
        def.reject(
            _this.buildResponse(HipChatBot.ERROR_BAD_HOOK.replace('{n}', sender || 'guys'), 'red')
        );
    } else {
        def.resolve(
            _this.buildResponse('oh hey, ' + sender + '. it\'s a generic bot.')
        );
    }

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
    var query = this.stripSlug(msg, slug) + Imgur.EXT_GIF;
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

    var _this = this;
    var imgur = new Imgur(process.env.IMGUR_ID);
    var def = $.Deferred();
    var handle = this.getSenderHandle(reqData);
    var errorMsg;
    imgur.getRandomFromSearch(encodeURIComponent(query))
        .done(function (resp) {
            def.resolve(_this.buildResponse(resp.link));
        })
        .fail(function (resp) {
            switch (resp.status) {
                case 500 :
                    errorMsg = HipChatBot.ERROR_500.replace('{n}', handle);
                    break;
                case 200 :
                    errorMsg = HipChatBot.ERROR_NO_RESULTS
                        .replace('{n}', handle)
                        .replace('{q}', unescape(resp.data.query).replace(Imgur.EXT_GIF, ''));
                    break;
                default :
                    errorMsg = HipChatBot.ERROR_ROOT.replace('{n}', handle) +
                                resp.data.error;
                    break;
            }
            def.reject(_this.buildResponse(errorMsg, 'red'));
        });

    return def.promise();
};

/**
 * Builds a response object to be sent to HipChat.
 * @param {String} message
 * @param {String} color - optional, defaults to green
 * @param {Boolean} notify - optional, defaults to false
 * @returns {Object} response
 * @returns {String} response.color
 * @returns {String} response.message
 * @returns {String} response.message_format
 * @returns {Boolean} response.notify
 */
HipChatBot.prototype.buildResponse = function (message, color, notify, format) {
    return {
        color: color || 'green',
        message: message,
        'message_format': format || 'text',
        notify: !!notify
    }
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
    return null;
};

/**
 * finds the message object in the req body
 * @param {Object} reqData - hip chat request body
 * @returns {Object} - message object from a HipChat request
 */
HipChatBot.prototype.getMessage = function (reqData) {
    if (reqData && reqData.item) {
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
    return this.getMessage(reqData).message;
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
