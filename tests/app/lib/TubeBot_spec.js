var should = require('should'),
    mock = require('../../mock'),
    util = require('../../../app/lib/util'),
    TubeBot = require('../../../app/lib/TubeBot');

describe('TubeBot', function () {

    var bot;
    var reqData;
    var firstName = 'Tester';
    var name = firstName + ' Jones';
    var slug = '/tube';
    var msgTxt = 'stuff';
    var REG_URL_VALID = /https:\/\/(?:www\.)?youtube.*watch\?v=([a-zA-Z0-9\-_]+)/;

    beforeEach(function () {
        var key = 'AIzaSyC5aHd0uZMA5uA6wKtIJEBTuklIl_z2Uh4';
        bot = new TubeBot(key);
        reqData = JSON.parse(mock.hipChat.getHook(slug + ' ' + msgTxt, name));
    });

    it('Should resolve with a link to a youtube video', function (done) {
        bot.parseReq(reqData).always(function (resp) {
            REG_URL_VALID.test(resp.message).should.equal(true);
            resp.color.should.equal('green');
            resp.notify.should.equal(false);
            resp['message_format'].should.equal('text');
            done();
        });
    });

    it('Resolve an invalid API key with a message to hipchat', function (done) {
        var expectedMsg =  bot.getCustomErrorMsg(firstName, TubeBot.ERROR_INVALID_API_KEY);
        bot.apiKey = 'invalid';
        bot.parseReq(reqData).always(function (resp) {
            resp.message.should.equal(expectedMsg);
            resp.color.should.equal('red');
            resp.notify.should.equal(false);
            resp['message_format'].should.equal('text');
            done();
        });
    });

    it('Resolves w/ a no results message to hipchat', function (done) {
        var badQuery = 'daklskjfas aweidkalll111! 33k3k';
        var expectedMessage = bot.getNoResultsMsg(firstName, badQuery);
        reqData = JSON.parse(mock.hipChat.getHook(slug + ' ' + badQuery, name));
        bot.parseReq(reqData).always(function (resp) {
            resp.color.should.equal('red');
            resp.notify.should.equal(false);
            resp.message.should.equal(expectedMessage);
            resp['message_format'].should.equal('text');
            done();
        });
    });

    it('Resolves a missing or malformed WebHook from HipChat', function (done) {
        var expectedMsg = bot.getBadHookMsg();
        bot.parseReq(null).always(function (resp) {
            resp.message.should.equal(expectedMsg);
            resp.color.should.equal('red');
            resp.notify.should.equal(false);
            resp['message_format'].should.equal('text');
            done();
        });
    });

    it('Returns a 500 error message when passed bad JSON', function (done) {
        var expectedMsg = bot.get500Msg(firstName);
        var errorMsg = bot.getErrorMsg(util.parseJSON('{bad JSON'), firstName);
        errorMsg.should.equal(expectedMsg);
        done();
    });

});
