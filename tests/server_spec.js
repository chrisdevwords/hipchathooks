
var should = require('should');
var request = require('supertest');
var sinon = require('sinon');
var server = require('../server');

describe('Web Server', function () {

    it('Handles 404s', function (done) {
        request(server)
            .get('/bork')
            .expect(404)
            .end(function (err, res) {
                should.not.exist(err);
                res.text.should.be.a.String;
                return done();
            });
    });

    it('Displays an error page for 500s', function (done) {

        sinon.stub(server, 'get', function () {
            new Error('break damnit!');
        });

        request(server)
            .get('/')
            .expect(500)
            .end(function (err, res) {
                should.not.exist(err);
                res.text.should.be.a.String;
                server.get.restore();
                return done();
            });

    });

});
