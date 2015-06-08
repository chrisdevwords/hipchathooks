
var _ = require('underscore');
var $ = require('jquery-deferred');
var HipChatBot = require('hipchat-bot');
var Wikipedia = require('./Wikipedia');

function VigodaBot () {}

_.extend(VigodaBot.prototype, HipChatBot.prototype);

VigodaBot.hashCheck = {
    'madonna': 'Madonna_(singer)',
    'sting': 'Sting_(musician)',
    'prince': 'Prince_(musician)',
    'apollonia': 'Apollonia_Kotero',
    'vanity': 'Vanity_(singer)',
    'dio': 'Ronnie James Dio'
};

VigodaBot.prototype.parseReq = function (reqData) {

    var def = $.Deferred();
    var wikipedia = new Wikipedia();
    var query = this.getSearchValue(reqData);
    var handle = this.getSenderHandle(reqData);
    var _this = this;

    wikipedia.getCelebrity(query, false)
        .done(function (resp) {
            def.resolve(
                _this.buildResponse(
                    _this.getResponseText(resp.data, handle),
                    resp.data.isDead ? 'purple' : 'green'
                )
            );
        })
        .fail(function (err) {
            def.reject(
                _this.buildResponse(
                    _this.getCelebNotFoundMsg(handle, query),
                    'red'
                )
            );
        });
    return def.promise();
};

VigodaBot.prototype.getCelebNotFoundMsg = function (handle, query) {
    return 'Sorry, ' + handle + '. Not sure who ' + query + ' is. Did you spell that right?'
};

VigodaBot.prototype.getSearchValue = function (reqData) {
    var query = '';
    var words = this.getMessageExploded(reqData, '/vigoda');
    _.each(words, function (word) {
        query += word.charAt(0).toUpperCase() + word.slice(1) + ' ';
    });
    query = query.trim();
    return VigodaBot.hashCheck[query.toLocaleLowerCase()] || query;

};

VigodaBot.prototype.getResponseText = function (data, handle) {
    if (data.isCelebrity) {
        if (data.isDead) {
            return 'Yup. ' + data.title + ' is fucking dead. RIP.';
        } else {
            return 'Nope. ' + data.title + ' is not dead.';
        }
    }
    return handle + ', ' +  data.title + ' is not a celebrity. ' + 'Who the fuck cares?'

};

module.exports = VigodaBot;
