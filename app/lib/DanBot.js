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
        'Seriously. Don\'t have kids. {handle}, you know what I\'m talking about...'
    ]
};

module.exports = _.extend(danBot, genBot, {

    parseReq : function (data) {

        var def = $.Deferred();
        var type = this.getType(data);
        var imgur;

        if (type === 'picture') {
            imgur = new Imgur(process.env.IMGUR_ID);
            imgur.getRandomFromAlbum(this.IMGUR_GALLERY)
                .done(function (gif){
                    def.resolve({
                        color: "green",
                        message_prefix: "Dan Bot:",
                        message: gif.link,
                        message_format: "text"
                    });
                }).fail(function () {
                    def.reject({
                        color: "red",
                        message_prefix: "Dan Bot:",
                        message: 'Oh, sorry. no pictures of Dan right now. Try Connecticut.',
                        message_format: "text"
                    });
                });
        } else {
            def.resolve({
                color: "green",
                message_prefix: "Dan Bot:",
                message: this.getResponseText(data),
                message_format: "text"
            });
        }

        return def.promise();
    },

    getType : function (reqData) {
        var message = this.getMessageText(reqData);
        var words = _.last(message.split('/dan')).toLowerCase().split(' ');
        if (words.indexOf('gif') > 0) {
            return 'picture';
        }
        if (words.indexOf('jif') > 0) {
            return 'picture';
        }
        if (words.indexOf('picture') > 0) {
            return 'picture';
        }
        return 'advice';
    },

    getResponseText : function (reqData) {
        return this.getAdvice(reqData);
    },

    getAdvice : function(reqData) {
        var advice = this.advice[Math.floor(this.advice.length*Math.random())];
        return advice.replace('{handle}', this.getSenderHandle(reqData));
    }
});