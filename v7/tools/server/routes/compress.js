/**
 * 渲染打包信息页面
 * @author wangqiang
 * @date 14-10-15
 */
function home(req, res, next) {
	res.render('compressProcessing', {
		clientAssetsPath: '/static',
		username: req.session.username
	});
}
module.exports = function (app) {
	app.get('/tmpl/compress', home);
};