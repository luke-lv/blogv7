var logger = require('../services/log4js').getLogger('cheese');
var checkUser = require('../services/checkUser');
/**
 * 登录接口
 * @param req
 * @param res
 * @param next
 */
function login(req, res, next) {
	var username = req.body.username;

	var password = req.body.password;

	if (checkUser(username, password)) {
		logger.info(username + ' is logined');
		req.session.username = username;
		res.send(JSON.stringify({
			code: "A00006",
			data: {
				url: "/"
			}
		}));
		//res.redirect('/home');
	} else {
		res.send(JSON.stringify({
			code: "A00002",
			data: {
				url: "/login"
			}
		}));
	}
	next();
}
module.exports = function (app) {
	app.post('/api/login', login);
};