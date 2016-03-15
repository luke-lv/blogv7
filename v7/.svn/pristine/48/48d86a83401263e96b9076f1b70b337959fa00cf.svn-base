var logger = require('../services/log4js').getLogger('cheese');
var user = require('../services/user');
/**
 * 查询用户
 * @param req
 * @param res
 * @param next
 */
function load(req, res, next) {
	res.send(JSON.stringify({
		code: 'A00006',
		data: user.loadUsers()
	}));
};
module.exports = function (app) {
	app.get('/api/loadUsers', load);
};