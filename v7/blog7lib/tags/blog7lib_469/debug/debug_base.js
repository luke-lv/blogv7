/**
 * @fileoverview
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2009
 */
(function (){
	/**
	 * 绑定对象
	 * @method bind
	 * @param {Function} fFunction	被绑定的函数
	 * @param {Object} object		被绑定的对象
	 */
	var bind = function(fFunction, object) { 
		var __method = fFunction; 
		return function() { 
			return __method.apply(object, arguments); 
		};
	};
	/* >>>>> 创建 Debug 基础方法 */
	var debug_namespace = "Debug";
	if (window[debug_namespace] == null || typeof window[debug_namespace].log == "undefined") {
		window[debug_namespace] = {
			// 数组——用于缓存数据保存
			 "cacheData" : []
			 ,"base_url" : "http://sjs.sinajs.cn/bind2/"
			 ,"product"	 : scope.$PRODUCT_NAME
			// 五种基本色彩
			,"baseColor" : {
				 1 : {	color : "#FFF", bgcolor : "#E00"	}	// fatal	- 红底白字
				,2 : {	color : "#F00"						}	// error	- 红字
				,3 : {	color : "#FFF000"					}	// warning	- 黄字
				,4 : {	color : "#0F0"						}	// info		- 绿字
				,5 : {	color : "#FFF"						}	// log		- 白字
			}
			// 五种基本方法的封装
			,"fatal"	:	function (sInfo) { this.addData(sInfo, 1); }
			,"error"	:	function (sInfo) { this.addData(sInfo, 2); }
			,"warning"	:	function (sInfo) { this.addData(sInfo, 3); }
			,"info"		:	function (sInfo) { this.addData(sInfo, 4); }
			,"log"		:	function (sInfo) { this.addData(sInfo, 5); }
			,"dir"		:	function (oInfo) { this.addData(oInfo, 5); }
			// 向缓存数组保存数据
			,"addData"	: function(sInfo, nType, sColor, sBgColor){
				if(sInfo == null){ return; }
				if(typeof sInfo != "object"){
					sInfo = sInfo.toString();
				}
				var oOption = {
					"type" :	nType || "5",
					"color" :	sColor || this.baseColor[nType].color,
					"bgcolor" : sBgColor || this.baseColor[nType].bgcolor
				};
				this.cacheData.push([sInfo, oOption]);
				if(this.initFinished == true){
					this.showCurrentData([sInfo, oOption]);
				}
			}
		};
		// 注册自己的全局函数
		window.trace = bind(window[debug_namespace].log, window[debug_namespace]);
		window.traceError = bind(window[debug_namespace].error, window[debug_namespace]);
		/* 创建 DEBUG 结束 <<<<< */
	}
})();
