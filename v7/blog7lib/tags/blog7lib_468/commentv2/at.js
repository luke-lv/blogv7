/**
 * @功能
 */
$import("lib/commentv2/_comment.js");
$import("lib/commentv2/TextAreaUtils.js");

CommentV2.at = function(tarea){
	this._src = tarea;
	this._oldStart = null;
}
CommentV2.at.prototype = {
	//获取被@的用户昵称
	getAtName :function(val) {
		var val = val || this._src.value;
		var currValue = val.replace(/\r/g,'');
		if(currValue == ""){
			return "";
		}
		var start   = CommentV2.TextAreaUtils.selectionStart(this._src);
		//无法获取光标位置,退出
		if(start<0 || start == this._oldStart){return ""}
		//设置start位置缓存
		this._oldStart = start;
		//获取光标之前文本
		var before = currValue.slice(0, start);
		var key      = before.match(new RegExp(['(','@',')([a-zA-Z0-9\u4e00-\u9fa5_-]{0,20})$'].join('')));
		var out = "";
		if(key){
			out = key[2];
		}
		trace(out+"-----")
		return out;
	}
}