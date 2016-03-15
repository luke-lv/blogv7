var fs = require('fs'); 
var path = require('path');
module.exports = function (app) {
	app.get('/getFile', function (req, res, next) {

		var options = {
			root: path.resolve(app.get('DOCUMENT_ROOT')),
			headers: { 'x-timestamp': Date.now(),
				'x-sent': true
				}
			};

		var fileName = req.query.name;

		res.set('Content-Type','text/plain;charset=utf-8');
		res.sendFile(fileName, options, function (err) {
			if (err) {
				res.status(err.status).end();
			}
		});

	})
};
