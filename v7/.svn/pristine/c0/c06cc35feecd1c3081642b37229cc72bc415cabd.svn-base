/**
 * @fileoverview 将原来博客版本中的$uidhex移植过来
 * @author xy xinyu@staff.sina.com.cn
 */
$import('lib/lib.js');

Lib.getUidhex = function(){
	if (!scope.$uidhex) {
		scope.$uidhex = window.parseInt(scope.$uid).toString(16);
		// 将不足8位数长度的十六进制 UID 进行补全
		scope.$uidhex = (scope.$uidhex.length < 8) ? ("00000000" + scope.$uidhex).match(/(\w{8})$/i)[1] : scope.$uidhex;
	}
};  