var _ = require('underscore'),
    $ = require('jquery-deferred'),
    HipChatBot = require('./HipChatBot'),
    util = require('./util'),
    swig = require('swig'),
    Twitter = require('twitter');

function TwittyBot(apiCreds, slug) {
    this.slug = slug || '/twitty';
    this.apiCreds = apiCreds || {};

}

_.extend(TwittyBot.prototype, HipChatBot.prototype);

TwittyBot.prototype.parseReq = function (reqData) {
    var def = $.Deferred();
    var twitter = new Twitter(this.apiCreds);
    var sender = this.getSenderHandle(reqData);
    var queryData = this.buildQueryData(reqData);
    var _this = this;
    twitter.get('search/tweets', queryData, function (error, tweets, resp) {
        if (error) {
            def.reject(_this.buildResponse(
                error.message,
                'red'
            ));
        } else if (tweets && tweets.statuses.length) {
            /*
            def.resolve(util.getRandomIndex(tweets.statuses));
            /*/
            def.resolve(_this.buildResponse(
                swig.renderFile('app/views/twittyResponse.swig', {tweet:util.getRandomIndex(tweets.statuses)}),
                'green',
                false,
                'html'
            ));
            //*/
        } else {
            def.reject(_this.buildResponse(
                _this.getNoResultsMsg(sender, queryData.q),
                'yellow'
            ));
        }
    });
    return def.promise();
};

TwittyBot.prototype.buildQueryData = function (reqData) {
    var query = this.stripSlug(this.getMessageText(reqData), this.slug);
    return {
        q: query
    }
};

module.exports = TwittyBot;
