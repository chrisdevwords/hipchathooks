'use strict';

var req = require('./RequestHelper');
var $ = require('jquery-deferred');
var _ = require('underscore');

function Imgur (apiKey) {
    this.apiKey = apiKey;
}

Imgur.prototype.search = function (query, sort, page) {

    var def = $.Deferred();
    var page = page || 0;
    var sort = sort || 'top';


    var options = {
        host : 'api.imgur.com',
        path : '/3/gallery/search/' + sort + '/' + page + '/?q=' + query,
        headers : {
            'Authorization'	: 'Client-ID ' + this.apiKey
        }
    };

    req.getJSON(options,
        
        function (status, response) {
            var resp = {
                status : status,
                data : response
            };
            if (status === 200) {
                def.resolve(resp);
            } else {
                def.reject(resp);
            }
        }
    );

    return def.promise();
};

Imgur.prototype.getRandom = function(q, sort, page) {
    var def = $.Deferred();
    var _this = this;
    var gifs;
    this.search(q, sort, page)
        .done(function(resp){   
            if (_.isEmpty(resp.data)) {
                def.reject({
                    status : 500, 
                    msg : 'malformed imgur response', 
                    resp : resp
                });
            } else {
                gifs = _this.parseGIFResp(resp.data);
                def.resolve(gifs[Math.floor(gifs.length * Math.random())]);
            } 
        })
        .fail(function(err){
            def.reject(err);
        });
    return def.promise();
};

Imgur.prototype.parseGIFResp = function (data) {
    var json = JSON.parse(data);
    if (_.isArray(json.data)) {
        return json.data;
    } 
    return [];
};


module.exports = Imgur;
