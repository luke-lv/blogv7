/**
 * home页渲染html处理。
 * @author wangqiang
 * @date 14-9-11
 */
function home(req, res, next) {
//	res.setHeader('Content-Type', 'text/html');
	res.render('home', {
		clientAssetsPath: '/static',
		username: req.session.username,
		products: [
			{name: 'blog7', svnname: 'main', type: 'js'},
			{name: 'blog7icp', svnname: 'icp', type: 'js'},
			{name: 'blog7photo', svnname: 'photo', type: 'js'},
			{name: 'blog7activity', svnname: 'activity', type: 'js'},
			{name: 'blog7style', svnname: 'style', type: 'css'}
		],
		machines: [
			{ip: '1.0.0.1'}
		]
	});
}
module.exports = function (app) {
	app.get('/tmpl/home', home);
};
