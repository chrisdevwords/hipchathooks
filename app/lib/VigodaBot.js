"use strict";

var _ = require('underscore');
var genBot = require('./GenericBot');
var Wikipedia = require('./Wikipedia');
var $ = require('jquery-deferred');

var vigodaBot = {
    hashCheck : {
        'madonna' : 'Madonna_(singer)',
        'sting'   : 'Sting_(musician)',
        'prince'  : 'Prince_(musician)',
        'apollonia' : 'Apollonia_Kotero',
        'vanity'    : 'Vanity_(singer)',
        'dio'     : 'Ronnie James Dio'
    }
}

module.exports = _.extend(vigodaBot, genBot, {

    parseReq : function (reqData) {

        var def = $.Deferred();
        var query = this.getSearchValue(reqData);
        var wikipedia = new Wikipedia();
        var handle = this.getSenderHandle(reqData);
        var _this = this;


        wikipedia.getCelebrity(query, false)
            .done(function(resp){
                def.resolve({
                    color: resp.data.isDead ? 'purple' : 'green',
                    message: _this.getResponseText(resp.data, handle),
                    message_format: 'text'
                });
            }).fail(function(err){
                def.reject({
                    color: 'red',
                    message: 'Sorry, ' + handle + '. Not sure who ' + query + ' is. Did you spell that right?',
                    message_format: 'text'
                });
            });

        return def.promise();
    },

    getSearchValue : function (reqData) {
        var query = '';
        var words = this.getMessageExploded(reqData, '/vigoda');
        _.each(words, function(word){
            query += word.charAt(0).toUpperCase() + word.slice(1) + ' ';
        });
        query = query.trim();
        return this.hashCheck[query.toLocaleLowerCase()] || query;

    },

    getResponseText : function(data, handle) {

        if (data.isCelebrity) {
            if (data.isDead) {
                return "Yup. " + data.title + ' is fucking dead. RIP.';
            } else {
                return "Nope. " + data.title + ' is not dead.';
            }
        }
        return  handle + ', ' +  data.title + ' is not a celebrity. ' + 'Who the fuck cares?'
    }

});