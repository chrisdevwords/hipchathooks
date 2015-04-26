
var should = require('should');
var supertest = require('supertest');
var sinon = require('sinon');
var server = require('../../../server');
var request = require('request');
var mock = require('../../mock');
var REG_URL_VALID = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

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
                        REG_URL_VALID.test(res.body.message).should.equal(true);
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
                        REG_URL_VALID.test(res.body.message).should.equal(true);
                        return done();
                    });

            });

        });

        describe('handle GET, listing usage instructions', function () {

            it('for /jif', function (done) {
                supertest(server)
                    .get('/api/jif/')
                    .expect(200)
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.text.should.be.a.String;
                        //todo verify it's the chat hook for /jif
                        return done();
                    });

            });

            it('for /gif', function (done) {
                supertest(server)
                    .get('/api/gif/')
                    .expect(200)
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.text.should.be.a.String;
                        //todo verify it's the chat hook for /jif
                        return done();
                    });

            });
        });

    });

});
