var should = require('should'),
    util = require('../../../app/lib/util'),
    mock = require('../../mock'),
    DanBot = require('../../../app/lib/DanBot'),
    model = require('../../../app/model/DanBotModel'),
    config = require('../../config.conf.js'),
    sinon = require('sinon'),
    request = require('request'),
    weatherjs = require('weather-js'),
    apiKey = config.imgur.API_KEY;

describe('DanBot', function () {

    var bot;
    var reqData;
    var firstName = 'Tester';
    var name = firstName + ' Jones';
    var slug = '/dan';

    var getReqData = function (msg) {
        return JSON.parse(mock.hipChat.getHook(msg, name));
    };

    describe('DanBot getType', function () {

        beforeEach(function (done) {
            bot = new DanBot();
            done();
        });

        it('returns a pic by default', function (done) {
            var type = bot.getResponseType(getReqData(slug));
            type.should.equal('picture');
            done();
        });

        it('correctly determines a request for advice', function (done) {
            var type = bot.getResponseType(getReqData(slug + ' How about some advice?'));
            type.should.equal('advice');
            done();
        });

        it('correctly determines a request for weather', function (done) {
            var type = bot.getResponseType(getReqData(slug + ' How\'s the weather?'));
            type.should.equal('weather');
            done();
        });
    });

    describe('DanBot Imgur API integration', function () {

        beforeEach(function (done) {
            bot = new DanBot();
            done();
        });

        afterEach(function (done) {
            request.get.restore();
            done();
        });

        it('Should resolve with a picture of Dan by default', function (done) {
            sinon
                .stub(request, 'get')
                .yields(null, {statusCode: 200}, mock.imgur.album);
            reqData = getReqData(slug);
            bot.parseReq(reqData)
                .always(function (resp) {
                    resp.color.should.equal('green');
                    config.imgur.REG_VALID_URL.test(resp.message).should.equal(true);
                    done();
                })
        });

        it('Should resolve with an error response if Imgur API call fails', function (done) {
            var expectedMsg = bot.getGifErrorMsg(firstName);
            sinon
                .stub(request, 'get')
                .yields(null, {statusCode: 403}, mock.imgur.serviceError.apiKey);
            reqData = getReqData(slug);
            bot.parseReq(reqData)
                .always(function (resp) {
                    resp.color.should.equal('red');
                    resp.message.should.equal(expectedMsg);
                    done();
                })
        });
    });

    describe('/dan advice', function () {
        it('Resolves with advice from Dan', function (done) {
            var reqData = getReqData(slug + ' advice');
            var advices = [];
            for (var i = 0; i < model.advice.length; i ++) {
                advices.push(model.advice[i].replace('{handle}', firstName));
            }
            bot = new DanBot();
            bot.parseReq(reqData)
                .always(function (resp) {
                    resp.color.should.equal('green');
                    resp.message.should.be.a.String;
                    resp.message.indexOf(firstName).should.be.greaterThan(-1);
                    advices.indexOf(resp.message).should.be.greaterThan(-1);
                    done();
                });
        });
    });

    describe('/dan weather', function () {

        var weather = JSON.parse(mock.weatherMSN.connecticut);
        var temp = weather[0].current.feelslike;

        beforeEach(function (done) {
            bot = new DanBot();
            reqData = getReqData(slug + ' weather');
            done();
        });

        afterEach(function (done) {
            weatherjs.find.restore();
            done();
        });

        it('Resolves with a personalized weather report from Dan', function (done) {
            var expectedMessage = model.getTemperatureMsg(temp).replace('{handle}', firstName);
            sinon
                .stub(weatherjs, 'find')
                .yields(null, weather);
            bot.parseReq(reqData)
                .always(function (resp) {
                    resp.color.should.equal('green');
                    resp.message.should.be.a.String;
                    resp.message.indexOf(firstName).should.be.greaterThan(-1);
                    resp.message.should.equal(expectedMessage);
                    done();
                });
        });

        it('Resolves null result from weatherjs with an error message', function (done) {
            var expectedMessage = bot.getWeatherErrorMsg(firstName);
            sinon
                .stub(weatherjs, 'find')
                .yields(null, {});
            bot.parseReq(reqData)
                .always(function (resp) {
                    resp.color.should.equal('red');
                    resp.message.should.be.a.String;
                    resp.message.indexOf(firstName).should.be.greaterThan(-1);
                    resp.message.should.equal(expectedMessage);
                    done();
                });
        });

        it('Resolves an Error from weatherjs with an error message', function (done) {
            var expectedMessage = bot.getWeatherErrorMsg(firstName);
            sinon
                .stub(weatherjs, 'find')
                .yields(new Error('Connecticut exploded.'), null);
            bot.parseReq(reqData)
                .always(function (resp) {
                    resp.color.should.equal('red');
                    resp.message.should.be.a.String;
                    resp.message.indexOf(firstName).should.be.greaterThan(-1);
                    resp.message.should.equal(expectedMessage);
                    done();
                });
        });
    });

});
