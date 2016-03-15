/**
 * 渲染打包信息页面
 * @author wangqiang
 * @date 14-10-15
 */
function alert(req, res, next) {
	res.render('template/alert/alert', {
		clientAssetsPath: '/static',
		username: req.session.username
	});
}
module.exports = function (app) {
	app.get('/tmpl/alert', alert);
};