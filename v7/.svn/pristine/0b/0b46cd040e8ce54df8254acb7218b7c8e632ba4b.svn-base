/**
 * 处理template目录下的文件
 * @author wangqiang
 * @date 14-9-11
 */
function process(req, res, next) {
//	res.setHeader('Content-Type', 'text/html');
	var page = req.params.page;
	res.render('./template/'+page, {});
}
module.exports = function (app) {
	app.get('/template/:page?', process);
};