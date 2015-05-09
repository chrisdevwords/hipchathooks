var _ = require('underscore'),
    $ = require('jquery-deferred'),
    YouTube = require('youtube-node'),
    HipChatBot = require('./HipChatBot'),
    util = require('./util');

/**
 * Parses HipChat requests, searching youtube for links to videos.
 * Posts one of 5 of the top results for a given query on youtube.com.
 * @see {@link HipChatBot.parseReq}
 * @see {@link https://www.npmjs.com/package/youtube-node}
 * @param {String} apiKey
 * @param {String} slug - optional, default is "tube"
 * @constructor
 * @augments HipChatBot
 */
function TubeBot (apiKey, slug) {
    this.slug = slug || '/tube';
    this.apiKey = apiKey;
};

_.extend(TubeBot.prototype, HipChatBot.prototype);

/**
 * Error message for an inavalid Youtube API Key.
 * @type {string}
 */
TubeBot.ERROR_INVALID_API_KEY = HipChatBot.ERROR_ROOT + ' Invalid Youtube API Key.';

/**
 * Overrides the parent class's Parsing of HipChat WebHook data, returning a promise.
 * Promise resolves with a HipChat message containing a link to a youtube video,
 * matching the content of the message, post-slug.
 * Promise rejects with a HipChat message containing an error indicating no videos were found.
 * Promise rejects with a HipChat message containing an error if there's a server-side exception,
 * such as an invalid API Key or malformed post-data.
 * {@see HipChatBot.parseReq}
 * @param {Object} reqData - the HipChat request body
 * @returns {JqueryDeferred}
 */
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

/**
 * Searches youtube API for videos matching a query, returning a promise.
 * Promise resolves with a link to a youtube video.
 * Promise rejects with an error message indicating no results were found.
 * @see {@link https://www.npmjs.com/package/youtube-node}
 * @param {String} query
 * @param {String} handle - The handle of the user to whom the message is addressed.
 * @returns {JqueryDeferred}
 */
TubeBot.prototype.findTube = function (query, handle) {

    var def = $.Deferred();
    var youtube = new YouTube();
    var _this = this;

    var cb = function (error, result) {

        if (error || !result) {
            def.reject(
                _this.buildResponse(_this.getErrorMsg(error, handle), 'red')
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

/**
 * Builds an Error message based on the response from the Youtube API.
 * @param {Object} error - the Error response object from the Youtube API
 * @param {Array} error.errors - From Youtube API, a list of reasons for the failed request
 * @param {String} handle - The Handle of the user to whom the error message is addressed
 * @returns {String}
 */
TubeBot.prototype.getErrorMsg = function (error, handle) {
    if (util.findBy(error.errors || [], 'reason', 'keyInvalid')) {
        return this.getCustomErrorMsg(handle, TubeBot.ERROR_INVALID_API_KEY);
    }
    return this.get500Msg(handle)
};

/**
 * Parses Youtube API result down to a single link.
 * @param {Object} result - From Youtube API, result for Youtube search.
 * @returns {string}
 */
TubeBot.prototype.parseResultToLink = function (result) {
    var items = result.items;
    var random = util.getRandomIndex(items);
    return 'https://youtube.com/watch?v=' + random.id.videoId;
};

module.exports = TubeBot;
