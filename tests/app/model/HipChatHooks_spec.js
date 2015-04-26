
var should = require('should');
var hipChatHooks = require('../../../app/model/HipChatHooks');

describe('The HipChatHooks Model', function () {

    it('correctly formats a stubUrl based on a request', function (done) {
        var hooks = hipChatHooks.getHooks({
            protocol:'https',
            originalUrl: '/',
            get: function () {
                return 'foo.heroku.app.com'
            }
        });
        hooks.stubUrl.should.be.a.String;
        hooks.stubUrl.should.equal('https://foo.heroku.app.com/');
        done();
    });

    it('provides a root / for stubUrl if no req is provided', function (done) {
        var hooks = hipChatHooks.getHooks(null);
        hooks.stubUrl.should.be.a.String;
        hooks.stubUrl.should.equal('/');
        done();
    });
});