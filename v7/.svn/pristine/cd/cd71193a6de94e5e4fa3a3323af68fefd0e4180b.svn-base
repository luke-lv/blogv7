var trim = require('../services/trim');
/**
 * 服务器端打包信息
 * @author wangqiang
 * @date 14/11/7
 */
module.exports = {
	productName: '',
	productType: '',
	svnUrl: '',
	svnAccount: '',
	svnPwd: '',
	isPackOnline: '0',
	mode: '',
	machineIp: '',
	user: '',
	set: function (productName, productType, svnURL, svnAccount, svnPwd, isPackOnline, mode, machineIp, username) {
		this.productName = productName;
		this.productType = productType;
		this.svnUrl = svnURL;
		this.svnAccount = svnAccount;
		this.svnPwd = svnPwd;
		this.isPackOnline = isPackOnline;
		this.mode = mode;
		this.machineIp = machineIp;
		this.user = username;
	},
	isValidate: function () {
		if (!/^(http|https)\:\/\/.+/.test(this.svnUrl)) {
			return false;
		}
		if (!trim(this.productName)) {
			return false;
		}
		if (!trim(this.productType)) {
			return false;
		}

		return true;
	}
}
