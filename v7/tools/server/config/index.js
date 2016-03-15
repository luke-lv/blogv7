/**
 * 配置管理
 * @author wangqiang
 * @date 14-9-11
 */
'use strict';
var fs = require('fs');
var path = require('path');

var currentDir = path.resolve(__dirname);

module.exports = function (app) {
	var jsFileReg = /\.js$/;
	//console.log(__dirname);
	fs.readdirSync(currentDir).forEach(function (filename) {
		// Avoid to read this current file.
		if (filename === path.basename(__filename) || !jsFileReg.test(filename)) {
			return;
		}

		// Load the route file.
		require('./' + filename)(app);
	});
};

module.exports.logDir = path.resolve(currentDir + '/../../logs');
module.exports.userConfDir = path.resolve(currentDir + '/user.conf');