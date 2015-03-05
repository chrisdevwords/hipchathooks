'use strict';

var _ = require('underscore');
var http = require('http');
var https = require('https');

module.exports = {
    
    getJSON : function (options, onResult) {

        var prot;
        var output = '';

        options = options || {};
        options = _.extend({port : 443, method : 'GET'}, options);
        prot = options.port == 443 ? https : http;

        return prot.request(options, function (res) {

            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                output += chunk;
            });
            res.on('end', function () {
                onResult(res.statusCode, output);
            });

        }).end();

    }

}
