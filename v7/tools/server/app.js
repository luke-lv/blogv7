/**
 * 打包服务器平台入口
 * @author wangqiang
 * @date 14-9-11
 */
'use strict';
var log4js = require('./services/log4js');
var express = require('express');
var ejs = require('ejs');
var session = require('cookie-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var timeout = require('connect-timeout');
var favicon = require('serve-favicon');
var app = express();
var expressWs = require('express-ws');
var http = require('http');
var path = require('path');

function main(cb) {

	// Without this you would need to
	// supply the extension to res.render()
	// ex: res.render('users.html').
	app.engine('.html', ejs.__express);
	app.set('view engine', 'html');

	// Optional since express defaults to CWD/views
	app.set('views', __dirname + '/views');

	app.set('port', 8009);

	app.set('DOCUMENT_ROOT', path.resolve(__dirname + '/../'));

	// configure stuff here
	//app.use(express.cookieParser('sctalk admin manager'));
	app.use(cookieParser());
	app.use(session({keys: ['username'], secret: 'SESSION_ID', cookie: {maxAge: 30 * 60 * 1000}}));

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));

	app.use(timeout('5s'));

	app.use(haltOnTimedout);

	app.use('/static', express.static(__dirname + '/../public'));
	app.use(favicon(path.join(__dirname, '/../public/style/images/favicon.ico')));
	// 配置日志
	app.use(log4js.connectLogger(log4js.getLogger('access'), {level: log4js.levels.INFO}));

	// Configure the application.
	var env = process.env.NODE_ENV || 'development';
	if ('development' == env) {
	}

	var server = http.createServer(app);

	expressWs(app, server);
	// load config
	require('./config')(app);

	// Load all api.
	require('./api')(app);

	// Load all routes.
	require('./routes')(app);

	app.use(function (err, req, res, next) {
		if (err) {
			var errorLogger = log4js.getLogger('error');
			errorLogger.error(err.stack);
		}
		next();
	});

	process.on('uncaughtException', function (err) {
		var errorLogger = log4js.getLogger('error');
		errorLogger.error(err);
	});

	// Listen on http port.
	server.listen(app.get('port'), function () {
		cb(server, app);
	});

}

function haltOnTimedout(req, res, next) {
	if (!req.timedout) next();
}

exports.start = function (cb) {
	main(cb)
};