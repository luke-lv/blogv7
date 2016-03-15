/**
 * 设置log
 * @author wangqiang
 * @date 14/11/26
 */
var fs = require('fs');
var log4js = require('log4js');
var path = require('path');
var conf = require('../config');

var logDir = conf.logDir;
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir);
}
console.log(logDir);
var maxLogSize = 1024 * 1024;
log4js.configure({
	appenders: [
		{
			type: 'console'
		},
		{
			type: 'file',
			filename: logDir + '/cheese.log',
			maxLogSize: maxLogSize,
			backups: 4,
			category: 'cheese'
		},
		{
			type: 'file',
			filename: logDir + '/access.log',
			maxLogSize: maxLogSize,
			backups: 4,
			category: 'access'
		},
		{
			type: 'file',
			filename: logDir + '/error.log',
			maxLogSize: maxLogSize,
			backups: 4,
			category: 'error'
		}
	],
	replaceConsole: true
});

var loggerLevel = log4js.levels.INFO;
var errorLogger = log4js.getLogger('error');
errorLogger.setLevel(loggerLevel)

var accessLogger = log4js.getLogger('access');
accessLogger.setLevel(loggerLevel)

var cheeseLogger = log4js.getLogger('cheese');
cheeseLogger.setLevel(loggerLevel)

var loggers = {
	error: errorLogger,
	access: accessLogger,
	cheese: cheeseLogger
}

module.exports = {
	levels: log4js.levels,
	log4js: log4js,
	getLogger: function (name) {
		return loggers[name];
	},
	connectLogger: function (logger, conf) {
		return log4js.connectLogger(logger, conf);
	}
};