"use strict";

var path = require('path');
var express = require('express');
var logger = require('morgan');
var cookies = require('cookie-parser');
var body = require('body-parser');
var swig = require('swig');

var routes = require('./app/routes/index');
var api = require('./app/routes/api');

var app = express();

// set views to render with swig
app.engine('swig', swig.renderFile);
app.set('view engine', 'swig');
app.set('views', path.join(__dirname, 'app', 'views'));
app.use('/test-coverage', express.static(path.join(__dirname , 'test-coverage')));
app.set('port', (process.env.PORT || 5000))

app.use(logger('dev'));
app.use(body.json());
app.use(body.urlencoded({extended : false}));
app.use(cookies());
app.use('/', routes);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message : err.message,
			error : err
		});
	});
}
// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message : err.message,
		error : {}
	});
});
app.listen(app.get('port'), function () {
	console.log('Node app is running at localhost:' + app.get('port'));
});
module.exports = app;

