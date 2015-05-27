var _ = require('underscore'),
    $ = require('jquery-deferred'),
    HipChatBot = require('./HipChatBot'),
    psi = require('psi');

function PSIBot (apiKey, slug) {
    this.slug = slug || '/psi';
    this.apiKey = apiKey;
}

_.extend(PSIBot.prototype, HipChatBot.prototype);

PSIBot.prototype.parseReq = function (reqData) {

    var def = $.Deferred();
    var msg = this.getMessageText(reqData);
    var query = this.stripSlug(msg, this.slug);
    var sender = this.getSenderHandle(reqData);
    var _this = this;

    psi(query, function (err, data) {

        if (err) {
            def.reject(
                _this.buildResponse(
                    _this.getCustomErrorMsg(sender, err.message),
                    'red'
                )
            );
        } else {
            def.resolve(
                _this.buildPSIResponse(sender, data)
            );
        }
    });
    return def.promise();
};

PSIBot.prototype.buildPSIResponse = function (sender, data) {

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

PSIBot.prototype.buildResponseMsg = function (sender, data) {

    return '<p>Well, ' + sender + '. ' +
        data.id + ' has a PSI score of: ' + data.score + '.</p>' +
        '<pre>' + JSON.stringify(data.pageStats) + '</pre>';
};

module.exports = PSIBot;
