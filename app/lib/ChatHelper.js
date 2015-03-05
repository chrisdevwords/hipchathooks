'use strict';

var _ = require('underscore');
var $ = require('jquery-deferred');
var Imgur = require('./Imgur');

module.exports = {
	
	parse : function (data) {
		
		var def = $.Deferred();

		def.resolve({
			color: "green",
			message_prefix: "Message Prefix:",
			message: "oh hey. it's the api.",
			message_format: "text"
		});
		
		return def.promise();
	},

	parseDan : function (data) {
		var def = $.Deferred();

		def.resolve({
			color: "green",
			message_prefix: "Message Prefix:",
			message: "oh hey, guys. Don't get married. Just kidding it's great.",
			message_format: "text"
		});
		
		return def.promise();
	},

	parseGif : function (data) {

        var def = $.Deferred();
		var msg = data.item.message.message;
		var query = _.last(msg.split('/gif')) + ' ext:gif';
        var imgur = new Imgur(process.env.IMGUR_ID);

        imgur.getRandom(encodeURIComponent(query))
			.done(function(resp) {
                def.resolve({
                    color: "green",
                    message_prefix: "GIF:",
                    message: resp.link,
                    message_format: "text"
                });
			})
			.fail(function(err){
                def.reject({
                    color: "red",
                    message_prefix: "Whoops:",
                    message: 'Couldn\'t find a GIF with that query. I suck.',
                    message_format: "text"
                });
			});
        return def.promise();
	}

};