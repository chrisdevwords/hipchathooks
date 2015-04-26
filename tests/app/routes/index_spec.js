
var should = require('should');
var request = require('supertest');
var server = require('../../../server');

describe('The index route', function () {
    // this should probably go in a spec for index...
    it('Accepts GET requests', function (done) {

        request(server)
            .get('/')
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                res.text.should.be.a.String;
                //todo use cherio to verify that links are rendered
                //res.text.should.equal("oh hey. it's the api.");
                return done();
            });

    });

});
