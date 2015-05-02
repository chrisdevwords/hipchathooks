'use strict';

var _ = require('underscore');
var $ = require('jquery-deferred');
var util = require('./util');
var Imgur = require('./Imgur');
var weather = require('weather-js');
var model = require('../model/DanBotModel')
var HipChatBot = require('./HipChatBot');

function DanBot (imgurAPIKey, slug) {
    this.imgurApiKey = imgurAPIKey;
    this.slug = slug || '/dan';
};

_.extend(DanBot.prototype, HipChatBot.prototype);

DanBot.ERROR_NO_WEATHER = 'Oh hey sorry, {handle}. Couldn\'t get the weather. ' +
    'Don\'t move to Connecticut just kidding it\'s great.';

DanBot.ERROR_NO_GIFS = 'Oh hey sorry, {handle}. No pictures of Dan right now. Try Connecticut.';

DanBot.prototype.parseReq = function (reqData) {
    var def;
    var type = this.getType(reqData);
    switch (type) {
        case 'picture':
            return this.getPictureofDan(reqData);
            break;
        case 'weather':
            return this.getWeather(reqData);
            break;
        default:
            def = $.Deferred();
            def.resolve(
                this.buildResponse(
                    this.getResponseText(reqData, type)
                )
            );
            break;
    }
    return def.promise();
};

DanBot.prototype.getType = function (reqData) {
    var words = this.getMessageExploded(reqData, '/dan');
    if (words.indexOf('advice') >= 0) {
        return 'advice';
    }
    if (words.indexOf('weather') >= 0) {
        return 'weather';
    }
    return 'picture';
};

DanBot.prototype.getResponseText = function (reqData, type) {
    var txt;
    switch (type) {
        case 'weather':
            txt = this.getWeather(reqData);
            break;
        default:
            txt = this.getAdvice(reqData);
            break;
    }
    return txt;
};

DanBot.prototype.getAdvice = function (reqData) {
    var advice = util.getRandomIndex(model.advice);
    return advice.replace('{handle}', this.getSenderHandle(reqData));
};

DanBot.prototype.getWeather = function (reqData) {

    var def = $.Deferred();
    var _this = this;
    var handle = this.getSenderHandle(reqData);

    weather.find({search: 'Connecticut', degreeType: 'F'}, function (err, result) {
        if (err) {
            def.reject(_this.buildResponse(_this.getWeatherErrorMsg(handle), 'red'));
        } else {
            if (result && result.length) {
                def.resolve(_this.buildResponse(_this.parseWeather(result, handle)));
            } else {
                def.reject(_this.buildResponse(_this.getWeatherErrorMsg(handle), 'red'));
            }
        }
    });

    return def.promise();
};

DanBot.prototype.parseWeather = function (result, handle) {
    var current = result[0].current;
    var temp = +(current.feelslike || current.temperature);
    model.getTemperatureMsg(temp).replace('{handle}', handle);
};

DanBot.prototype.getWeatherErrorMsg = function (handle) {
    return DanBot.ERROR_NO_WEATHER.replace('{handle}', handle);
};

DanBot.prototype.getPictureofDan = function (reqData) {

    var _this = this;
    var def = $.Deferred();
    var imgur = new Imgur(this.imgurApiKey);
    var handle = this.getSenderHandle(reqData);

    imgur.getRandomFromAlbum(model.imgurGalleryId)
        .done(function (gif) {
            def.resolve(
                _this.buildResponse(gif.link)
            );
        }).fail(function () {
            def.reject(
                _this.buildResponse(_this.getGifErrorMsg(handle))
            );
        });

    return def.promise();
};

DanBot.prototype.getGifErrorMsg = function (handle) {
    return DanBot.ERROR_NO_GIFS.replace('{handle}', handle);
};

module.exports = DanBot;
