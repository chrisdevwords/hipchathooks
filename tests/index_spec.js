
var should = require('should');
var request = require('supertest');

var server = require('../index');

describe('Web Server', function () {

    it('Accepts GET requests', function (done) {

        request(server)
            .get('/api')
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                res.text.should.be.a.String;
                res.text.should.equal("oh hey. it's the api.");
                return done();
            });

    });

    it('Accepts POST requests', function (done) {

        request(server)
            .post('/api')
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                res.body.should.be.an.Object;
                return done();
            });

    });

});
