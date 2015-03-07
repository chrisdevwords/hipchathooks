'use strict';

var _ = require('underscore');
var cheerio = require('cheerio');
var JQDeferred = require('jquery-deferred');
var req = require('./RequestHelper');
var querystring = require('querystring');
var url = require('url');

function Wikipedia () {}

_.extend(Wikipedia.prototype, {

    getCelebrity : function (name, includeWikiData) {

        var pageTitle = name.split(' ').join('_');
        var def = JQDeferred.Deferred();
        var req = this.getPageText(pageTitle);
        var _this = this;

        req.fail(function(resp) {
            def.reject(resp);
        });

        req.done(function(resp){
            _this.parseCelebrity(resp, includeWikiData).done(function (data) {
                def.resolve(data);
            });
        });

        return def.promise();
    },

    parseCelebrity : function (resp, includeWikiData) {

        var def = JQDeferred.Deferred();
        var $ = cheerio.load(resp.data.text['*']);
        var isDead;
        var isCeleb;
        if ($('.redirectText').length > 0) {

            var  link = url.parse($('.redirectText').find('a').attr('href'));
            var redirectName = querystring.parse(link.search.split('?').join('')).title;
            return this.getCelebrity(redirectName, includeWikiData);

        } else {

            isDead = $('.dday').length > 0 || $('.deathplace').length > 0;
            isCeleb = $('.bday').length > 0 || $('.birthplace').length > 0;

            def.resolve({
                status : 200,
                data : {
                    isCelebrity : isCeleb,
                    isDead : isDead,
                    title : resp.data.title,
                    wikiResp : includeWikiData ? resp.data : null
                }
            });
        }
        return def.promise();
    },

    getPageText : function (pageTitle) {
        var params = {
            section: 0,
            action: 'parse',
            format: 'json',
            prop: 'text',
            page: pageTitle
        };
        return this.getPage(querystring.stringify(params));
    },

    getPage : function (qs) {
        var def = JQDeferred.Deferred();
        var data;
        var cb = function (status, response) {
            if (status === 200) {
                data = JSON.parse(response);
                if(_.isEmpty(data.parse)) {
                    def.reject({
                        status : 500,
                        data : data.error
                    });
                } else {
                    def.resolve({
                        status : 200,
                        data : data.parse
                    });
                }
            } else {
                def.reject({
                    status : status,
                    response : response
                });
            }
        };
        req.getJSON({
            host : 'en.wikipedia.org',
            path : '/w/api.php?' + qs
        }, cb);


        return def.promise();
    }

});

module.exports = Wikipedia;