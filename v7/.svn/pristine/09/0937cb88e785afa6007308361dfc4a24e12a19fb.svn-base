var logger = require('../services/log4js').getLogger('cheese');
/**
 * 查询日志
 * @param req
 * @param res
 * @param next
 */
function load(req, res, next) {
	res.send(JSON.stringify({
		data: []
	}));
};
module.exports = function (app) {
	app.get('/api/loadLogs', load);
};