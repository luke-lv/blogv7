/**
 * 登出
 * @author wangqiang
 * @date 14-9-11
 */
function loginOut(req, res) {
	res.send('Hello world');
}

module.exports = function (app) {
	app.get('/api/login', loginOut);
};