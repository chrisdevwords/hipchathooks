'use strict';

var $ = require('jquery-deferred');
var _ = require('underscore');
var genBot = require('./GenericBot');
var Imgur = require('./Imgur');

var danBot = {
    IMGUR_GALLERY : '5CoxY',
    advice : [
        'Oh hey, {handle}. Don\'t get married. Just kidding it\'s great.',
        'Oh hey, {handle}. Don\'t eat street meat. Just kidding it\'s great.',
        'Seriously. Don\'t have kids. {handle}, you know what I\'m talking about...',
        '{handle}, pull my finger. C\'mon... Do it.',
        'Have you seen CakeFarts? {handle} hasn\'t seen it, guys! Go to cakefarts.com. So funny, you guys.',
        '{handle}, check out 2 girls 1 cup. So gross. Google it. Seriously.'
    ],
    weather : [
        'Too cold for Rollerblading, {handle}.',
        'Too cold for Hershey Park, , {handle}.',
        'Still too cold for Hershey Park, {handle}.',
        'Warm enough for rollerblading. Not quite nice enough for Hershey Park.',
        'Great weather for Hershey Park, {handle}. Better leave early.',
        'Getting kind of sweaty.',
        'So sweaty, {handle}. Seriously. Metro North is so gross.',
        'So sweaty. Don\'t take the Metro North. {handle}, you know what I\'m talking about...',
        'Should be a good day for Hershey Park, {handle}. Better leave early.',,
        'Last chance to get to Hershey Park or do some rollerblading. Better leave early, {handle}.',
        'Too cold for Hershey Park, but still really sweaty on the Metro North. Had to sleep on the couch, {handle}.',
        'Hershey Park is closed, but you can probably rollerblade just don\'t wear cargo shorts. I\'m kidding. They\'re great.',
        'Too cold for Rollerblading, but they\'re turning up the heat on the Metro North. So sweaty. Had to sleep on the couch.'
    ]
};

module.exports = _.extend(danBot, genBot, {

    parseReq : function (data) {

        var def;
        var type = this.getType(data);

        if (type === 'picture') {
            return this.getPictureofDan(data);
        } else {
            def = $.Deferred()
            def.resolve({
                color: "green",
                message_prefix: "Dan Bot:",
                message: this.getResponseText(data, type),
                message_format: "text"
            });
        }

        return def.promise();
    },

    getType : function (reqData) {
        var words = this.getMessageExploded(reqData, '/dan');
        if (words.indexOf('advice') > 0) {
            return 'advice';
        }
        if (words.indexOf('weather') > 0) {
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

    getWeather : function(reqData) {
        var month = new Date().getMonth();
        var weather  = this.weather[month];
        return weather.replace('{handle}', this.getSenderHandle(reqData));
    },

    getPictureofDan : function (reqData) {

        var def = $.Deferred();
        var imgur = new Imgur(process.env.IMGUR_ID);
        var handle = this.getSenderHandle(reqData);

        imgur.getRandomFromAlbum(this.IMGUR_GALLERY)
            .done(function (gif){
                def.resolve({
                    color: "green",
                    message_prefix: "Dan Bot:",
                    message: gif.link,
                    message_format: "text",
                    from : {
                        name : 'Dan Bot'
                    }
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