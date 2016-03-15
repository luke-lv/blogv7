/**
 * This module loads dynamically all routes modules located in the routes/
 * directory.
 */
'use strict';
var fs = require('fs');
var path = require('path');

function index(req, res) {
	if (req.session.username) {
		res.render('index', {
			clientAssetsPath: '/static',
			username: req.session.username,
			products: [
				{name: 'blog7', type: 'js'},
				{name: 'blog7style', type: 'css'}
			],
			machines: [
				{ip: '1.0.0.1'}
			]
		});
	} else {
		res.redirect('/login');
	}
}

module.exports = function (app) {
	var jsFileReg = /\.js$/;
	fs.readdirSync(__dirname).forEach(function (filename) {
		// Avoid to read this current file.
//console.log(filename);
		if (filename === path.basename(__filename) || !jsFileReg.test(filename)) {
			return;
		}

		// Load the route file.
		require('./' + filename)(app);
	});
	app.get('/', index);
	app.get('/:path?', index);
};
