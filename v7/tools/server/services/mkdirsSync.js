var path = require('path');
var fs = require('fs');
/**
 * 递归创建目录 同步
 * @author wangqiang
 * @date 15/1/7
 */
function mkdirsSync(dirname, mode) {
	if (fs.existsSync(dirname)) {
		return true;
	} else {
		if (mkdirsSync(path.dirname(dirname), mode)) {
			fs.mkdirSync(dirname, mode);
			return true;
		}
	}
}

module.exports = mkdirsSync;