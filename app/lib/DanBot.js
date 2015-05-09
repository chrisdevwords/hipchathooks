'use strict';

var _ = require('underscore');
var $ = require('jquery-deferred');
var util = require('./util');
var Imgur = require('./Imgur');
var weather = require('weather-js');
var model = require('../model/DanBotModel')
var HipChatBot = require('./HipChatBot');

/**
 * DanBot - the Official Chat Bot of the Dan Curis Fanclub.
 * Gets the weather from Connecticut, gives advice, sends pictures of Dan.
 * @param {String} imgurID - needed for calls to Imgur API for pictures of Dan.
 * @param {String} slug - optional, defaults to "/dan"
 * @constructor
 * @augments HipChatBot
 */
function DanBot (imgurID, slug) {
    this.imgurID = imgurID;
    this.slug = slug || '/dan';
};

_.extend(DanBot.prototype, HipChatBot.prototype);

/**
 * Error message for failed weather API call.
 * @type {String}
 */
DanBot.ERROR_NO_WEATHER = 'Oh hey sorry, {handle}. Couldn\'t get the weather. ' +
    'Don\'t move to Connecticut just kidding it\'s great.';

/**
 * Error message for failed Imgur API Call
 * @type {String}
 */
DanBot.ERROR_NO_GIFS = 'Oh hey sorry, {handle}. No pictures of Dan right now. Try Connecticut.';

/**
 * Overrides the parent class's Parsing of HipChat WebHook data, returning a promise.
 * Promise resolves with a HipChat message matching the content of the message, post-slug.
 *      "/dan *advice* = Advice from Dan.
 *      "/dan *weather* = A weather report from Connecticut.
 *      "/dan" =  (default) A Picture of Dan.
 * Promise rejects with a HipChat message containing an error if there's a server-side exception,
 * such as an invalid API Key or malformed post-data.
 * {@see HipChatBot.parseReq}
 * @param {Object} reqData - the HipChat request body
 * @returns {JqueryDeferred}
 */
DanBot.prototype.parseReq = function (reqData) {
    var type = this.getResponseType(reqData);
    var def;
    switch (type) {
        case 'advice':
            def = this.getAdvice(reqData);
            break;
        case 'weather':
            def = this.getWeather(reqData);
            break;
        default:
            def = this.getPictureofDan(reqData);
            break;
    }
    return def.promise();
};

/**
 * Determines the type of response based on message content, post-slug.
 * Can be "weather", "advice" or "picture".
 * @param {Object} reqData
 * @returns {string}
 */
DanBot.prototype.getResponseType = function (reqData) {
    var msg = this.getMessageText(reqData).split(this.slug).pop().toLowerCase();
    if (msg.indexOf('weather') > -1) {
        return 'weather';
    }
    if (msg.indexOf('advice') > -1) {
        return 'advice';
    }
    return 'picture';
};

/**
 * Queries the DanBotModel for personalized advice from Dan.
 * {@see DanBotModel.getAdvice}
 * Returns a promise that resolves with advice.
 * @param {Object} reqData - the HipChat request body
 * @returns {JqueryDeferred}
 */
DanBot.prototype.getAdvice = function (reqData) {

    var _this = this;
    var def = $.Deferred();
    var handle = this.getSenderHandle(reqData);

    model.getAdvice(handle)
        .always(function (resp) {
            def.resolve(
                _this.buildResponse(resp.text, 'green')
            )
        });
    return def.promise();
};

/**
 * Queries the MSN Weather API for the current weather in Connecticut.
 * Resolves with a HipChat Message w/ a personalized Weather report from Dan.
 * Rejects with personalized error message if call fails to MSN Weather API.
 * {@see DanBotModel.getWeatherReport}
 * Returns a promise that resolves with advice.
 * @param {Object} reqData - the HipChat request body
 * @returns {JqueryDeferred}
 */
DanBot.prototype.getWeather = function (reqData) {

    var _this = this;
    var def = $.Deferred();
    var handle = this.getSenderHandle(reqData);

    weather.find({search: 'Connecticut', degreeType: 'F'}, function (err, result) {

        if (err) {
            def.reject(_this.buildResponse(_this.getWeatherErrorMsg(handle), 'red'));
        } else if (result && result.length) {
            model.getWeatherReport(result[0], handle)
                .always(function (resp) {
                    def.resolve(
                        _this.buildResponse(resp.text, 'green')
                    );
                });

        } else {
            def.reject(_this.buildResponse(_this.getWeatherErrorMsg(handle), 'red'));
        }
    });

    return def.promise();
};

/**
 * A personalized Error message from Dan for failed MSN Weather API calls.
 * @param {String} handle
 * @returns {String}
 */
DanBot.prototype.getWeatherErrorMsg = function (handle) {
    return DanBot.ERROR_NO_WEATHER.replace('{handle}', handle);
};

/**
 * Queries Imgur API for An Official Dan Curis Fan Club Picture of Dan.
 * Resolves with a message containing a link to a picture of Dan.
 * Rejects with personalized error message if call fails to Imgur API.
 * @param {Object} reqData - the HipChat request body
 * @returns {JqueryDeferred}
 */
DanBot.prototype.getPictureofDan = function (reqData) {

    var _this = this;
    var def = $.Deferred();
    var imgur = new Imgur(this.imgurID);
    var handle = this.getSenderHandle(reqData);

    imgur.getRandomFromAlbum(model.imgurGalleryId)
        .done(function (gif) {
            def.resolve(
                _this.buildResponse(gif.link)
            );
        }).fail(function () {
            def.reject(
                _this.buildResponse(_this.getGifErrorMsg(handle), 'red')
            );
        });

    return def.promise();
};

/**
 * A personalized Error message from Dan for failed Imgur API calls.
 * @param {String} handle
 * @returns {String}
 */
DanBot.prototype.getGifErrorMsg = function (handle) {
    return DanBot.ERROR_NO_GIFS.replace('{handle}', handle);
};

module.exports = DanBot;
