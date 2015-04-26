var should = require('should'),
    sinon = require('sinon'),
    request = require('request'),
    mock = require('../../mock'),
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
        bot = new TubeBot('AIzaSyC5aHd0uZMA5uA6wKtIJEBTuklIl_z2Uh4');
        reqData = JSON.parse(mock.hipChat.getHook(slug + ' ' + msgTxt, name));
    });

    it('Should resolve with a link to a youtube video', function (done) {
        bot.parseReq(reqData).always(function (resp) {
            console.log('resp.message?',resp.message);
            REG_URL_VALID.test(resp.message).should.equal(true);
            resp.color.should.equal('green');
            resp.notify.should.equal(false);
            resp['message_format'].should.equal('text');
            done();
        });
    });

    it('Should handle a missing or malformed WebHook from HipChat', function (done) {
        var expectedMsg = bot.getBadHookMsg();
        bot.parseReq(null).always(function (resp) {
            resp.message.should.equal(expectedMsg);
            resp.color.should.equal('red');
            resp.notify.should.equal(false);
            resp['message_format'].should.equal('text');
            done();
        });
    });

});