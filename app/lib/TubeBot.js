var _ = require('underscore');
var $ = require('jquery-deferred');
var YouTube = require('youtube-node');
var HipChatBot = require('./HipChatBot');
var util = require('./util');

function TubeBot (apiKey) {
    this.slug = '/tube';
    this.apiKey = apiKey;
};

_.extend(TubeBot.prototype, HipChatBot.prototype);

TubeBot.prototype.parseReq = function (reqData) {

    var msg = this.getMessageText(reqData);
    var sender = this.getSenderHandle(reqData);
    var query;

    if (msg && sender) {
        query = this.stripSlug(msg, this.slug);
        return this.findTube(query, sender);
    } else {
        return $.Deferred()
            .reject(this.buildResponse(this.getBadHookMsg(sender), 'red'))
            .promise();
    }
};

TubeBot.prototype.findTube = function (query, handle) {

    var def = $.Deferred();
    var youtube = new YouTube();
    var _this = this;

    var cb = function (error, result) {

        if (error || !result) {
            def.reject(
                _this.buildResponse(_this.get500Msg(handle), 'red')
            );
        } else if (result.items && result.items.length) {
            def.resolve(
                _this.buildResponse(
                    _this.parseResultToLink(result)
                )
            );
        } else {
            def.reject(
                _this.buildResponse(_this.getNoResultsMsg(handle, query), 'red')
            );
        }
    };

    youtube.setKey(this.apiKey);
    youtube.search(query, 5, cb);

    return def.promise();
};

TubeBot.prototype.parseResultToLink = function (result) {
    var items = result.items;
    var random = util.getRandomIndex(items);
    return 'https://youtube.com/watch?v=' + random.id.videoId;
};

module.exports = TubeBot;
