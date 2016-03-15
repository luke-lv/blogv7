/**
 * 获取本机ip地址
 * @author wangqiang
 * @date 14/11/17
 */
var os = require('os');
var ifaces = os.networkInterfaces();
for (var dev in ifaces) {
	var alias = 0;
	ifaces[dev].forEach(function (details) {
		if (details.family == 'IPv4') {
			console.log(dev + (alias ? ':' + alias : ''), details.address);
			++alias;
		}
	});
}