/**
 * 使用正则表达式来转换千分位表示
 * @id Core.String.formatnumber
 * @param {Number} n 需要format的数
 */
$import("sina/core/string/_string.js");
Core.String.formatNumber = function (n) {
		// 使用正则表达式来转换千分位表示
		n = n + "";
		return n.replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
};