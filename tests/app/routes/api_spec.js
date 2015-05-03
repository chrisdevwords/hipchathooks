
var should = require('should');
var supertest = require('supertest');
var sinon = require('sinon');
var server = require('../../../server');
var request = require('request');
var mock = require('../../mock');
var config = require('../../config.conf.js');

describe('The API Endpoints', function () {

    describe('the root endpoint: /api', function () {

        it('Accepts GET requests', function (done) {

            supertest(server)
                .get('/api')
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.text.should.be.a.String;
                    res.text.should.equal('oh hey. it\'s the api.');
                    return done();
                });

        });

        it('Accepts POST requests', function (done) {

            supertest(server)
                .post('/api')
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.body.should.be.an.Object;
                    return done();
                });

        });

    });

    describe('the Jif/GifBot endpoints: /gif and /jif', function () {
        describe('handle POST', function () {

            beforeEach(function (done) {
                sinon
                    .stub(request, 'get')
                    .yields(null, {statusCode: 200}, mock.imgur.search);
                done();
            });

            afterEach(function (done) {
                request.get.restore();
                done();
            });

            it('for /gif', function (done) {
                supertest(server)
                    .post('/api/gif/')
                    .send(JSON.parse(mock.hipChat.getHook('/gif')))
                    .expect(200)
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.body.should.be.an.Object;
                        res.body.message.should.be.a.String;
                        config.imgur.REG_VALID_URL.test(res.body.message).should.equal(true);
                        return done();
                    });

            });
            it('for /jif', function (done) {

                supertest(server)
                    .post('/api/jif/')
                    .send(JSON.parse(mock.hipChat.getHook('/jif')))
                    .expect(200)
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.body.should.be.an.Object;
                        res.body.message.should.be.a.String;
                        config.imgur.REG_VALID_URL.test(res.body.message).should.equal(true);
                        return done();
                    });

            });

        });

        describe('handle GET, listing usage instructions', function () {

            it('for /jif', function (done) {

                var resJSON;
                var exampleJSON;

                supertest(server)
                    .get('/api/jif/')
                    .expect(200)
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.text.should.be.a.String;
                        resJSON = JSON.parse(res.text);
                        exampleJSON = JSON.parse(resJSON.example);
                        resJSON.should.be.an.Object;
                        resJSON.msg.should.be.a.String;
                        resJSON.example.should.be.a.String;
                        exampleJSON.should.be.an.Object;
                        exampleJSON.should.not.be.empty;
                        return done();
                    });

            });

            it('for /gif', function (done) {

                var resJSON;
                var exampleJSON;

                supertest(server)
                    .get('/api/gif/')
                    .expect(200)
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.text.should.be.a.String;
                        resJSON = JSON.parse(res.text);
                        exampleJSON = JSON.parse(resJSON.example);
                        resJSON.should.be.an.Object;
                        resJSON.msg.should.be.a.String;
                        resJSON.example.should.be.a.String;
                        exampleJSON.should.be.an.Object;
                        exampleJSON.should.not.be.empty;
                        return done();
                    });

            });
        });

    });

    describe('the TubeBot endpoint: /tube', function () {

        it('Accepts GET requests', function (done) {

            var resJSON;
            var exampleJSON;

            supertest(server)
                .get('/api/tube')
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.text.should.be.a.String;
                    resJSON = JSON.parse(res.text);
                    exampleJSON = JSON.parse(resJSON.example);
                    resJSON.should.be.an.Object;
                    resJSON.msg.should.be.a.String;
                    resJSON.example.should.be.a.String;
                    exampleJSON.should.be.an.Object;
                    exampleJSON.should.not.be.empty;
                    return done();
                });

        });

        it('Accepts POST requests', function (done) {

            supertest(server)
                .post('/api/tube')
                .send(JSON.parse(mock.hipChat.getHook('/tube')))
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.body.should.be.an.Object;
                    return done();
                });

        });

    });

    describe('the VigodaBot endpoint: /vigoda', function () {

        it('Accepts GET requests', function (done) {

            var resJSON;
            var exampleJSON;

            supertest(server)
                .get('/api/vigoda')
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.text.should.be.a.String;
                    resJSON = JSON.parse(res.text);
                    exampleJSON = JSON.parse(resJSON.example);
                    resJSON.should.be.an.Object;
                    resJSON.msg.should.be.a.String;
                    resJSON.example.should.be.a.String;
                    exampleJSON.should.be.an.Object;
                    exampleJSON.should.not.be.empty;
                    return done();
                });

        });

        it('Accepts POST requests', function (done) {

            supertest(server)
                .post('/api/vigoda')
                .send(JSON.parse(mock.hipChat.getHook('/vigoda')))
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.body.should.be.an.Object;
                    return done();
                });

        });

    });

    describe('the DanBot endpoint: /dan', function () {

        it('Accepts GET requests', function (done) {

            var resJSON;
            var exampleJSON;

            supertest(server)
                .get('/api/dan')
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.text.should.be.a.String;
                    resJSON = JSON.parse(res.text);
                    exampleJSON = JSON.parse(resJSON.example);
                    resJSON.should.be.an.Object;
                    resJSON.msg.should.be.a.String;
                    resJSON.example.should.be.a.String;
                    exampleJSON.should.be.an.Object;
                    exampleJSON.should.not.be.empty;
                    return done();
                });

        });

        it('Accepts POST requests', function (done) {

            supertest(server)
                .post('/api/dan')
                .send(JSON.parse(mock.hipChat.getHook('/dan advice')))
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.body.should.be.an.Object;
                    return done();
                });

        });

    });

});
