var $packInfo = require('../models/packInfo');
var CMDMessage = require('../models/CMDMessage');
var MessagePool = require('../models/MessagePool');
var log4js = require('../services/log4js');
var packJsTask = require('../services/packJsTask');
var packStyleTask = require('../services/packStyleTask');
var logger = log4js.getLogger('cheese');

var docRoot;

/**
 * 接收打包参数，并且将这些参数发送到后台执行
 * @author wangqiang
 * @date 14-10-15
 * @param {HTTPRequest} req express服务器的请求
 * @param {HTTPResponse} res express服务器的响应
 * @param {Function} next 执行下一个route的函数
 */
function sendPackMsg(req, res, next) {

	var user = req.session.username;

	$packInfo.set(req.param('productName'), req.param('productType'), req.param('svnUrl'), req.param('svnAccount'), req.param('svnPwd'), req.param('isPackOnline'), req.param('mode'), req.param('machineIp'), user);

	if (!$packInfo.isValidate()) {
		res.send(JSON.stringify({
			code: "A00009",
			message: "非法访问!",
			data: {
			}
		}));
		next();
		return;
	}

	if (user) {
//		$packInfo.svnAccount = 'wangqiang1';
//		$packInfo.svnPwd = 'tom123$sTaff';
		logger.info('Start pack: ' + $packInfo.productName+ ' User:' + $packInfo.svnAccount);
		var cmdMsg = new CMDMessage();
		var channel = MessagePool.getId();
		MessagePool.set(channel, cmdMsg);

		res.status(200).send(JSON.stringify({
			code: "A00006",
			message: "数据提交成功!",
			data: {
				channel: channel
			}
		}));

		var processUser = process.env.USER;

		if($packInfo.productType === 'js') {
			// 打包js
			packJsTask.start($packInfo, cmdMsg, processUser, docRoot);
		}else if($packInfo.productType === 'css') {
			// 打包样式
			packStyleTask.start($packInfo, cmdMsg, processUser, docRoot);
		}
	} else {
		res.send(JSON.stringify({
			code: "A00003",
			message: "未登录",
			data: {}
		}), 200);
	}

}

/**
 * 客户端 websocket 处理，向客户端发送信息
 * @param ws
 * @param req
 */
function echo(ws, req) {
	var user = req.session.username;
	if (!user) {
		ws.send(JSON.stringify({
			code: "A00003",
			message: "未登录",
			data: {}
		}));
	} else {
		function onPackMsg(cmdMsg, ws) {
			cmdMsg.on('data', function () {
				var caches = this.getData();
				if (ws.readyState == ws.OPEN && caches.length > 0) {
					ws.send(JSON.stringify({
						code: "A00006",
						message: "成功",
						data: caches
					}));
					cmdMsg.clear();
				}
			});
			cmdMsg.on('end', function () {
				ws.close();
			});
		}

		ws.on('message', function (msg) {
			var channel = msg;
			var cmdMsg = MessagePool.get(channel);
			if (!cmdMsg) {
				ws.close();
				return;
			}
			var caches = cmdMsg.getData();

			if (caches.length) {
				ws.send(JSON.stringify({
					code: "A00006",
					message: "成功",
					data: caches
				}));
				cmdMsg.clear();
			}
			if (cmdMsg.isEnd) {
				console.log('websocket close -> cmdMsg is end');
				MessagePool.remove(cmdMsg);
				ws.close();
			} else {
				onPackMsg(cmdMsg, ws);
			}
		});
	}
}

module.exports = function (app) {
	docRoot = app.get('DOCUMENT_ROOT');
	app.ws('/echo', echo);
	app.post('/api/sendPackMsg', sendPackMsg);
};