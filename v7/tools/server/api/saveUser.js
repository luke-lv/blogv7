var logger = require('../services/log4js').getLogger('cheese');
var user = require('../services/user');
/**
 * 查询用户
 * @param req
 * @param res
 * @param next
 */
function save(req, res, next) {
	var params = req.body;
	if (params.name && user.addUser(params.name, params.dirtyPsw || '123456', params.dirtyIp)) {
		res.send(JSON.stringify({
			code: 'A00006',
			message: '保存成功'
		}));
	} else {
		res.send(JSON.stringify({
			code: 'A00010',
			message: '保存失败'
		}));
	}
};
module.exports = function (app) {
	app.post('/api/saveUser', save);
};