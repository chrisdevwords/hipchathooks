'use strict';

var _ = require('underscore');
var $ = require('jquery-deferred');
var YouTube = require('youtube-node');
var genBot = require('./GenericBot');

/**
 * extend this module if you want your bot to have youtube search functionality
 */
module.exports = _.extend({}, genBot, {

    slug : '/tube',

    parseReq : function (data) {
        var msg = this.getMessageText(data);
        var query = _.last(msg.split(this.slug)).trim();
        return this.findTube(query, data);
    },

    findTube : function (query, reqData) {

        var def = $.Deferred();
        var youtube = new YouTube();
        var handle = this.getSenderHandle(reqData);
        var _this = this;

        var cb = function (error, result) {

            if (error) {
                def.reject({
                    color: "red",
                    message: 'Sorry, ' + handle + '. I couldn\'t find a Tube with "' + query + '". I suck.',
                    message_format: "text"
                });
            } else {
                def.resolve({
                    color: "green",
                    message: _this.parseTubeResult(result),
                    message_format: "text"
                });
            }
        };

        youtube.setKey(process.env.YOUTUBE_KEY || '');
        youtube.search(query, 5, cb);

        return def.promise();
    },

    parseTubeResult : function (result) {
        var items = result.items;
        var random = items[Math.floor(Math.random()*items.length)];
        return "http://youtube.com/watch?v=" + random.id.videoId;
    }
});



