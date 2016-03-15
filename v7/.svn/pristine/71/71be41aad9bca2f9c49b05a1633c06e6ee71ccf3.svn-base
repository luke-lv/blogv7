
$import("sina/utils/io/jsload.js");
$import("lib/checkAuthor.js");

function v6SendLog(type, label){
    //2009-1-17 改为空函数
    //	var o = new Image();
    //	o.src = "http://statv5.blog.sina.com.cn/i.html?type="+ type +"&label=" + label + "&" + new Date().valueOf();
}

function v7sendLog(type, pageid, msg){
	if(!type) {
		return false;
	}
	if(type.split('_').length == 3) {
		Lib.checkAuthor();
		if($isLogin) {
			type += '_' + $UID;
		}
	}
	if(typeof scope == 'undefined') {
		window.scope = {};
		scope.$pageid = '';
	}
	pageid = pageid || scope.$pageid;
	msg = msg || '';
    Utils.Io.JsLoad.request("http://hits.sinajs.cn/A2/b.html?type=" +type + "&pageid="+pageid+"&msg="+msg, {
        onComplete: function(){
        }
    });
}
