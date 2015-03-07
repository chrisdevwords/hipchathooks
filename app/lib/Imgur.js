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

Imgur.prototype.getRandomFromSearch = function(q, sort, page) {

    var def = $.Deferred();
    var _this = this;
    var gifs;

    this.search(q, sort, page)
        .done(function(resp){   

            gifs = _this.parseGIFResp(resp);
            if (gifs.length) {
                def.resolve(gifs[Math.floor(gifs.length * Math.random())]);
            } else {
                def.reject({msg: 'no gifs found'});
            }

        })
        .fail(function(err){
            def.reject(err);
        });
    return def.promise();
};

Imgur.prototype.getAlbum = function(id) {

    var def = $.Deferred();
    var options = {
        host : 'api.imgur.com',
        path : '/3/album/' + id + '/images',
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

Imgur.prototype.getRandomFromAlbum = function(albumId) {

    var def = $.Deferred();
    var _this = this;
    var gifs;

    this.getAlbum(albumId)
        .done(function(resp){
            gifs = _this.parseGIFResp(resp);
            if (gifs.length) {
                def.resolve(gifs[Math.floor(gifs.length * Math.random())]);
            } else {
                def.reject({msg: 'no gifs found'});
            }
        })
        .fail(function(err){
            def.reject(err);
        });

    return def.promise();
};

Imgur.prototype.parseGIFResp = function (resp) {
    var data = resp.data ? resp.data : '{"data":{}}';
    var json = JSON.parse(data);
    if (_.isArray(json.data)) {
        return json.data;
    } 
    return [];
};


module.exports = Imgur;
