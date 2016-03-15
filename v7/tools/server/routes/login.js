/**
 * 渲染登录页面
 * @author wangqiang
 * @date 14-9-11
 */
function renderLogin(req, res, next) {
	res.render('login', {
		error: 'A00001',
		clientAssetsPath: '/static'
	});
	//next();
}
module.exports = function (app) {
	app.get('/login', renderLogin);
};