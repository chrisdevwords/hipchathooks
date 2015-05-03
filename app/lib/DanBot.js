'use strict';

var _ = require('underscore');
var $ = require('jquery-deferred');
var util = require('./util');
var Imgur = require('./Imgur');
var weather = require('weather-js');
var model = require('../model/DanBotModel')
var HipChatBot = require('./HipChatBot');

function DanBot (imgurAPIKey, slug) {
    this.apiKey = imgurAPIKey;
    this.slug = slug || '/dan';
};

_.extend(DanBot.prototype, HipChatBot.prototype);

DanBot.ERROR_NO_WEATHER = 'Oh hey sorry, {handle}. Couldn\'t get the weather. ' +
    'Don\'t move to Connecticut just kidding it\'s great.';

DanBot.ERROR_NO_GIFS = 'Oh hey sorry, {handle}. No pictures of Dan right now. Try Connecticut.';

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

DanBot.prototype.getResponseType = function (data) {
    var msg = data.item.message.message.split(this.slug).pop().toLowerCase();
    if (msg.indexOf('weather') > -1) {
        return 'weather';
    }
    if (msg.indexOf('advice') > -1) {
        return 'advice';
    }
    return 'picture';
};

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

DanBot.prototype.getWeatherErrorMsg = function (handle) {
    return DanBot.ERROR_NO_WEATHER.replace('{handle}', handle);
};

DanBot.prototype.getPictureofDan = function (reqData) {

    var _this = this;
    var def = $.Deferred();
    var imgur = new Imgur(this.apiKey);
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

DanBot.prototype.getGifErrorMsg = function (handle) {
    return DanBot.ERROR_NO_GIFS.replace('{handle}', handle);
};

module.exports = DanBot;
