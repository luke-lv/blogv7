/**
 * @desc 基础接口代码
 * @author stan | chaliang@staff.sina.com.cn
 * @modified 090806删除processTip by stan
 */
$import("sina/utils/url.js");
$import("sina/core/string/j2o.js");
$import("sina/utils/io/jsload.js");
$import("sina/utils/io/ijax.js");
$import("sina/utils/io/ajax.js");
$import("sina/core/class/create.js");
$import("sina/core/function/bind2.js");
/**
 * 构造函数
 * @param {Object} url 接口地址
 * @param {Object} type 数据通讯类型
 */
var Interface = function(url, type){
	this.url = new Utils.Url(url);
	this.type = type.toLowerCase();
};
Interface.prototype = {
	url : null,
	type : "",
	/**
	 * 请求参数列表
	 * @param {Object} option
	 * - GET		get参数
	 * - PSOT		post参数,script方式下无效
	 * - onSuccess	接口返回格式正常且状态码等于A00006
	 * - onError	接口返回格式一场且状态码不等于A00006
	 * - onFail		接口返回异常/格式错误
	 */
	request : function(option){
		var err = option.onError;
		var suc = option.onSuccess;

		var utf8bombug = function(str){
			if(!str || str == ""){
				return null;
			}
			var str2 = str.replace(/\uFEFF/g, '');
			trace(str2);
			if (str != str2){trace('utf8bom \uFEFF bug!');}
			//try{
				var o = window.eval("(" + str2 + ")");
				return o;
			//}
			//catch(e){
			//	trace("j2o : 数据分析出错");
			//	traceError(e);
			//	return null;
			//}
		};

		option.onComplete = option.onSuccess = function(result){
			try{
				// 过滤接口未提供 varname 时 JSON 对象最后的分号，避免 j2o 出错
				if(typeof result == "string"){
					result = result.replace(/;$/, "");
				}
				result = (typeof result == "string" && (/\s*{/.test(result))) ? utf8bombug(result) : result;
				// 如果接口返回对象没有 code 属性，视为接口异常
				if(result != null && typeof result.code == "undefined"){
					trace("接口数据异常：" + this.url, "#F00");
					return;
				}
				if(result != null){
					if(result.code == "A00006"){
						suc(result.data);
					}
					else{
						err(result);
					}
				}else{
					err(result);
				}
			}catch(e){
				traceError(e);
			}
		}.bind2(this);
		option.onException = option.onError = option.onFail || function(){
			trace("接口失败：" + this.url, "#F00");
			if(arguments.length > 0){
				for(var i = 0, len = arguments.length; i < len ; i ++ ){
					if (arguments[i] && typeof arguments[i] != "undefined") {
						trace("错误信息：" + arguments[i].toString());
					}
				}
			}
		}.bind2(this);
		var requestURL = this.url.toString();
		switch(this.type){
			case "ijax":
				Utils.Io.Ijax.request(requestURL, option);
				break;
			case "ajax":
				Utils.Io.Ajax.request(requestURL, option);
				break;
			case "script":
			case "jsload":
				Utils.Io.JsLoad.request(requestURL, option);
				break;
			default:
				throw new Error("未指定有效的数据传输类型");
		}
	}
};
