'use strict';

var $ = require('jquery-deferred');
var _ = require('underscore');
var genBot = require('./GenericBot');

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
        var msg = this.getMsgText(data);
        def.resolve({
            color: "green",
            message_prefix: "Dan Bot:",
            message: msg,
            message_format: "text"
        });

        return def.promise();
    },

    getMsgText : function (reqData) {
        return this.getAdvice(reqData);
    },

    getAdvice : function(reqData) {
        var advice = this.advice[Math.floor(this.advice.length*Math.random())];
        return advice.replace('{handle}', this.getSenderHandle(reqData));
    }
});