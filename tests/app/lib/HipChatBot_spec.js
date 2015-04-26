var should = require('should'),
    sinon = require('sinon'),
    request = require('request'),
    mock = require('../../mock'),
    HipChatBot = require('../../../app/lib/HipChatBot');

describe('HipChatBot', function () {

    var bot;
    var reqData;
    var firstName = 'Tester';
    var name = firstName + ' Jones';
    var slug = '/gif';
    var msgTxt = 'testing a message';

    beforeEach(function () {
        bot = new HipChatBot();
        reqData = JSON.parse(mock.hipChat.getHook(slug + ' ' + msgTxt, name));
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

    it('Builds a HipChat response w/ defaults, requiring only a message', function (done) {
        var response = bot.buildResponse(msgTxt);
        response.should.be.an.Object;
        response.message.should.equal(msgTxt);
        response.color.should.equal('green');
        response.notify.should.equal(false);
        response['message_format'].should.equal('text');
        done();
    });

    it('Builds a HipChat responses, with a message color', function (done) {
        var response = bot.buildResponse(msgTxt, 'red');
        response.color.should.equal('red');
        done();
    });

    it('Builds a HipChat responses, with a notify flag', function (done) {
        var response = bot.buildResponse(msgTxt, 'red', true);
        response.notify.should.equal(true);
        done();
    });

    it('Builds a HipChat responses, with a format', function (done) {
        var response = bot.buildResponse(msgTxt, 'red', true, 'html');
        response['message_format'].should.equal('html');
        done();
    });

    describe('HipChatBot async methods', function (done) {

        it('Resolves w/ a generic HipChat response object', function (done) {
            bot.parseReq(reqData)
                .done(function (resp) {
                    resp.message.indexOf(firstName).should.be.greaterThan(-1);
                    resp.color.should.equal('green');
                    resp.notify.should.equal(false);
                    resp['message_format'].should.equal('text');
                    done();
                });
        });

        it('Resolves w/ error if passed a HipChat hook w/ bad JSON', function (done) {
            bot.parseReq(null)
                .fail(function (resp) {
                    resp.color.should.equal('red');
                    resp.message.should.equal(HipChatBot.ERROR_BAD_HOOK);
                    done();
                });
        });
        it('Resolves w/ error if passed a HipChat hook w/ missing data', function (done) {
            bot.parseReq({item:{}})
                .fail(function (resp) {
                    resp.color.should.equal('red');
                    resp.message.should.equal(HipChatBot.ERROR_BAD_HOOK);
                    done();
                });
        });

    });

    describe('HipChatBot async calls to Imgur', function (done) {

        afterEach(function (done) {
            request.get.restore();
            done();
        });

        it('Resolves a GIF req w/ a GIF response object', function (done) {
            sinon
                .stub(request, 'get')
                .yields(null, {statusCode: 200}, mock.imgur.search);
            bot.parseGifReq(reqData, slug)
                .always(function (resp) {
                    // need regex to test if it's a valid link resp.message.
                    resp.color.should.equal('green');
                    resp.notify.should.equal(false);
                    resp['message_format'].should.equal('text');
                    done();
                });
        });

    });

    describe('HipChatBot async error handling for Imgur', function () {

        afterEach(function (done) {
            request.get.restore();
            done();
        });

        it('Resolves an invalid Imgur API Key w/ a message for HipChat', function (done) {

            var errorMsg = JSON.parse(mock.imgur.serviceError.apiKey).data.error;

            sinon
                .stub(request, 'get')
                .yields(null, {statusCode: 403}, mock.imgur.serviceError.apiKey);

            bot.parseGifReq(reqData, slug)
                .fail(function (resp) {
                    resp.should.be.an.Object;
                    resp.color.should.equal('red');
                    resp.message.indexOf(errorMsg)
                        .should.be.greaterThan(-1);
                    done();
                });
        });

        it('Resolves a search with no results w/ a message for HipChat', function (done) {
            sinon
                .stub(request, 'get')
                .yields(null, {statusCode: 200}, mock.imgur.serviceError.emptySearch);

            bot.parseGifReq(reqData, slug)
                .fail(function (resp) {
                    resp.should.be.an.Object;
                    resp.color.should.equal('red');
                    resp.message.indexOf(HipChatBot.ERROR_NO_RESULTS)
                        .should.be.greaterThan(-1);
                    done();
                });
        });

        it('Resolves an http error w/ a custom message for HipChat', function (done) {
            // should pass a 500 here
            var errorMsg = 'Internet borked.';
            sinon
                .stub(request, 'get')
                .yields(new Error(errorMsg));
            bot.parseGifReq(reqData, slug)
                .fail(function (resp) {
                    resp.should.be.an.Object;
                    resp.color.should.equal('red');
                    resp.message.indexOf(errorMsg)
                        .should.equal(-1);
                    resp.message.indexOf(HipChatBot.ERROR_500)
                        .should.be.greaterThan(-1);
                    done();
                });
        });

    });

});
