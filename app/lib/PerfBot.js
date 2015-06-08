var _ = require('underscore'),
    $ = require('jquery-deferred'),
    HipChatBot = require('hipchat-bot'),
    WebPageTest = require('webpagetest');

function PerfBot (apiKey, slug) {
    this.slug = slug || '/perf';
    this.apiKey = apiKey;
}

_.extend(PerfBot.prototype, HipChatBot.prototype);

PerfBot.prototype.parseReq = function (reqData) {

    var def = $.Deferred();
    var msg = this.getMessageText(reqData);
    var query = this.stripSlug(msg, this.slug);
    var sender = this.getSenderHandle(reqData);
    var _this = this;
    var wpt = new WebPageTest('www.webpagetest.org', this.apiKey);
    wpt.runTest(query, {pageSpeed: true}, function (err, data) {

        if (err) {
            def.reject(
                _this.buildResponse(
                    _this.getCustomErrorMsg(sender, err.message),
                    'red'
                )
            );
        } else {
            if (data.statusCode  == 200) {
                def.resolve(
                    _this.buildResponse(data.data.userUrl)
                );
            } else {
                def.reject(
                    _this.buildResponse(
                        _this.getCustomErrorMsg(sender, data.statusText),
                        'red'
                    )
                );
            }


        }
    });
    return def.promise();
};

PerfBot.prototype.buildPerfResponse = function (sender, data) {

    var color = 'red';

    if (data.score > 70) {
        color = 'green'
    } else if (data.score > 50) {
        color = 'yellow';
    }

    return this.buildResponse(
        this.buildResponseMsg(sender, data),
        color,
        false,
        'html'
    );
};

PerfBot.prototype.buildResponseMsg = function (sender, data) {

    return '<p>Well, ' + sender + '. ' +
        data.id + ' has a PSI score of: ' + data.score + '.</p>' +
        '<pre>' + JSON.stringify(data.pageStats) + '</pre>';
};

module.exports = PerfBot;
