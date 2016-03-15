/**
 * @fileoverview 向Qing博客发送统计日志，链接跳转时Chrome有BUG不会发送图片请求
 * @author Qiangyee | wangqiang1@staff
 * @date  2011-12-07
 */
window.sendLogToQing = function(log,uid){
	if(typeof scope === 'undefined') {
		window.scope = {};
		scope.$uid=scope.$pageid = '';
	}
	//	msg参数值：
	//日志|时间戳|pageid|uid
	var _log = log || "",
		_uid=  uid || scope.$uid,
		_pageId=scope.$pageid,
		 timestamp=new Date().getTime(),
		 value=_log+"|"+timestamp+"|"+_pageId+"|"+_uid;
		 
	var image = window["actlog_img"]= new Image();
	image.onLoad = image.onError = function(){window["actlog_img"]=null;};
	image.src=$_GLOBAL.qingURL+"blog/api/actlog.php?msg="+encodeURIComponent(value);
	image = null;
};