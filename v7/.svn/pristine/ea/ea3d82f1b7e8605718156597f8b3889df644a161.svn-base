/**
 * 检查用户是否登录
 * @param req HTTPRequest
 * @param res HTTPResponse
 * @param next next function
 */
function checkAuthorize(req, res, next) {
	var searchPath = req.path;
	var bypass = ['/api/login', '/api/loginOut', '/login'];
	if (-1 !== bypass.indexOf(searchPath)) {
		next();
		return;
	}
	if (!req.session.username) {
		res.redirect('/login');
	} else {
		next();
	}
}

module.exports = function (app) {
	app.all('*', checkAuthorize);
}