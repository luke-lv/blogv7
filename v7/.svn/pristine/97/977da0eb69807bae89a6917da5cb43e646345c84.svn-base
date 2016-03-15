/**
 * This module loads dynamically all api modules located in the routes/
 * directory.
 * @author wangqiang
 * @date 14-10-13
 */
'use strict';
var fs = require('fs');
var path = require('path');
module.exports = function (app) {
	var jsFileReg = /\.js$/;
	fs.readdirSync(__dirname).forEach(function (filename) {
		// Avoid to read this current file.
		if (filename === path.basename(__filename) || !jsFileReg.test(filename)) {
			return;
		}

		// Load the route file.
		require('./' + filename)(app);
	});
};