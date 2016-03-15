$import("sina/core/function/_function.js");
/**
 * @author xp
 * @for Core.Function.times
 * Invoke this function several time
 * 重复执行1个函数多次
 * @param {Function} fFunc 执行函数
 * @param {Number} n 执行次数
 */
Core.Function.times = function (fFunc, n){
	for (var i = 0;i < n; i ++){
		fFunc();
	}
};