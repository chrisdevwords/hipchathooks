var should = require('should'),
    model = require('../../../app/model/DanBotModel'),
    mock = require('../../mock'),
    util = require('../../../app/lib/util');

describe('The DanBot Model', function () {

    describe('getAdvice', function () {

        it('Resolves with personalized advice from dan', function (done) {
            var advices = [];
            var name = 'Tester';
            for (var i = 0; i < model.advice.length; i ++) {
                advices.push(model.advice[i].replace('{handle}', name));
            }
            model.getAdvice(name)
                .always(function (resp) {
                    resp.success.should.equal(true);
                    resp.text.should.be.a.String;
                    resp.text.indexOf(name).should.be.greaterThan(-1);
                    advices.indexOf(resp.text).should.be.greaterThan(-1);
                    done();
                });
        })

        it('Resolves with generic advice from dan', function (done) {
            var advices = [];
            for (var i = 0; i < model.advice.length; i ++) {
                advices.push(model.advice[i].replace('{handle}', 'Guys'));
            }
            model.getAdvice()
                .always(function (resp) {
                    resp.success.should.equal(true);
                    resp.text.should.be.a.String;
                    resp.text.indexOf('Guys').should.be.greaterThan(-1);
                    advices.indexOf(resp.text).should.be.greaterThan(-1);
                    done();
                });
        })
    });

    describe('getWeather', function () {

        it('Parses a message based on temperature', function (done) {

            var temps = [90, 80, 75, 65, 45, 30];
            var messages = [];
            var msg;
            var i;

            for (i = 0; i < temps.length; i++) {
                msg = model.getTemperatureMsg(temps[i]);
                msg.should.be.a.String;
                messages.indexOf(msg).should.equal(-1);
                messages.push(msg);
            };

            messages.length.should.equal(temps.length);
            done();
        });

        it('Resolves data from MSN Weather with a personalized weather report', function (done) {
            var name = 'Tester';
            var weather = JSON.parse(mock.weatherMSN.connecticut);
            var temp = weather[0].current.feelslike;
            var expectedMessage = model.getTemperatureMsg(temp).replace('{handle}', name);
            model.getWeatherReport(weather[0], name)
                .always(function (resp) {
                    resp.success.should.equal(true);
                    resp.text.should.equal(expectedMessage);
                    done();
                });
        });

        it('Resolves with a generalized weather report even with bad data', function (done) {
            var expectedMessage = model.getTemperatureMsg(0);
            model.getWeatherReport(util.parseJSON('{bad json'))
                .always(function (resp) {
                    resp.success.should.equal(true);
                    resp.text.should.equal(expectedMessage);
                    done();
                });
        });

        it('Resolves with a personalized weather report', function (done) {
            var name = 'Tester';
            var expectedMessage = model.getTemperatureMsg(0, name);
            model.getWeatherReport({}, name)
                .always(function (resp) {
                    resp.success.should.equal(true);
                    resp.text.should.equal(expectedMessage);
                    done();
                });
        })
    });

});
