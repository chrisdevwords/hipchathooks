'use strict';

var $ = require('jquery-deferred');
var _ = require('underscore');
var genBot = require('./GenericBot');
var Imgur = require('./Imgur');
var weather = require('weather-js');

var danBot = {
    IMGUR_GALLERY : '5CoxY',
    advice : [
        'Oh hey, {handle}. Don\'t get married. Just kidding it\'s great.',
        'Oh hey, {handle}. Don\'t eat street meat. Just kidding it\'s great.',
        'Seriously. Don\'t have kids. {handle}, you know what I\'m talking about...',
        '{handle}, pull my finger. C\'mon... Do it.',
        'Have you seen CakeFarts? {handle} hasn\'t seen it, guys! Go to cakefarts.com. So funny, you guys.',
        '{handle}, check out 2 girls 1 cup. So gross. Google it. Seriously.'
    ]
};

module.exports = _.extend(danBot, genBot, {

    parseReq : function (data) {

        var def;
        var type = this.getType(data);
        switch (type) {
            case "picture":
                return this.getPictureofDan(data);
                break;
            case 'weather':
                return this.getWeather(data);
                break;
            default:
                def = $.Deferred()
                def.resolve({
                    color: "green",
                    message_prefix: "Dan Bot:",
                    message: this.getResponseText(data, type),
                    message_format: "text"
                });
                break;
        }
        return def.promise();
    },

    getType : function (reqData) {
        var words = this.getMessageExploded(reqData, '/dan');
        if (words.indexOf('advice') >= 0) {
            return 'advice';
        }
        if (words.indexOf('weather') >= 0) {
            return 'weather';
        }
        return 'picture';
    },

    getResponseText : function (reqData, type) {
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
    },

    getAdvice : function(reqData) {
        var advice = this.advice[Math.floor(this.advice.length*Math.random())];
        return advice.replace('{handle}', this.getSenderHandle(reqData));
    },

    getWeather : function (reqData) {

        var def = $.Deferred();
        var _this = this;
        var handle = this.getSenderHandle(reqData);

        weather.find({search: 'Connecticut', degreeType: 'F'}, function (err, result) {
            if (err) {
                def.reject({
                    color : "red",
                    message : 'Oh hey. Couldn\'t get the weather. Don\'t move to Connecticut just kidding it\'s great.',
                    message_format: "text"
                });
            } else {
                def.resolve({
                    color : "green",
                    message : _this.parseWeather(result, handle),
                    message_format: "text"
                });
            }
        });
        return def.promise();
    },

    parseWeather : function (result, handle) {

        var current = result[0].current;
        var temp = +(current.feelslike || current.temperature);

        if (temp >= 90) {
            return 'So sweaty, ' + handle + '. Had to sleep on the couch. Better call in sick.';
        }
        if (temp >= 80) {
            return 'So sweaty, ' + handle + '. Seriously. Metro North is so gross.';
        }
        if (temp >= 75) {
            return 'Getting kind of sweaty, ' + handle + '. Too hot for rollerblading. Might be a good day for Hershey Park.';
        }
        if (temp >= 65) {
            return 'Should be a good day for Hershey Park, {handle}. Or Rollerblading. Better leave early.';
        }
        if (temp >= 45) {
            return 'Warm enough for rollerblading. Not quite nice enough for Hershey Park. You know what I\'m talking about.';
        }

        return 'Way too cold for Rollerblading, but they\'re turning up the heat on the Metro North. So sweaty. Better sleep on the couch.';
    },


    getPictureofDan : function (reqData) {

        var def = $.Deferred();
        var imgur = new Imgur(process.env.IMGUR_ID);
        var handle = this.getSenderHandle(reqData);

        imgur.getRandomFromAlbum(this.IMGUR_GALLERY)
            .done(function (gif){
                def.resolve({
                    color: "green",
                    message: gif.link,
                    message_format: "text"
                });
            }).fail(function () {
                def.reject({
                    color: "red",
                    message_prefix: "Dan Bot:",
                    message: 'Oh, hey. Sorry, ' + handle + ' no pictures of Dan right now. Try Connecticut.',
                    message_format: "text"
                });
            });
        return def.promise();
    }
});