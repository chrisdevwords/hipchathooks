var should = require('should'),
    sinon = require('sinon'),
    request = require('request'),
    mockHook = require('../../mock/webHook'),
    HipChatBot = require('../../../app/lib/HipChatBot');

describe('HipChatBot', function () {

    var bot;
    var reqData;
    var name = 'Tester Name';
    var slug = '/gif';
    var msgTxt = 'testing a message';

    beforeEach(function () {
        bot = new HipChatBot();
        reqData = JSON.parse(mockHook.getHook(slug + ' ' + msgTxt, name));
    });

    it('should be able to parse a HipChat Request', function (done) {
        done();
    });

    it('should be able to strip the slug from a request', function (done) {
        var message = bot.stripSlug(slug + ' ' + msgTxt, slug);
        message.should.equal(msgTxt);
        done();
    });

    it('should be able to get the first name of the sender from a request', function (done) {
        var firstName = bot.getSenderHandle(reqData);
        firstName.should.equal('Tester');
        done();
    });

    it('should find the message in a request', function (done) {
        var msg = bot.getMessage(reqData);
        msg.should.be.an.Object;
        msg.should.not.be.empty;
        msg.from.should.be.an.Object;
        msg.from.name.should.equal(name);
        msg.message.should.be.a.string;
        msg.message.should.equal(slug + ' ' + msgTxt);
        done();
    });

    it('should find the message text in a request', function (done) {
        var txt = bot.getMessageText(reqData);
        txt.should.equal(slug + ' ' + msgTxt);
        done();
    });

    it('should separate the components of a message', function (done) {
        var parts = bot.getMessageExploded(reqData, slug);
        parts.should.be.an.Array;
        parts.length.should.equal(3);
        done();
    });
});
