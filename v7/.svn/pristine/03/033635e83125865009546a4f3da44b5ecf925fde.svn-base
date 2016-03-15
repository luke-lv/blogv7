/**
 * @fileoverview 发布成功后的回调
 * @author zhihan|zhihan@staff.sina.com.cn
 */

$import("sina/core/string/trim.js");
$import("sina/core/system/getParam.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/function/bind3.js");
$import("sina/ui/dialog/windowDialog.js");
$import("sina/utils/cookie/getCookie.js");


$import("lib/dialogConfig.js");
$import("lib/interface.js");
$import("msg/blogEditorMSG.js");

//callback
scope.postArticleCall = function(frmJson) {
	var isPrivateBlog = (scope.$private.isprivate == '1');
	var isPrivateArticle = $E('componentSelect').value === '0';
	var wl_internalState_cid;
	//取msn登录的cookie
	try{
		var wl_internalState = (new Function('return ' + decodeURIComponent(Utils.Cookie.getCookie('wl_internalState'))))();
		wl_internalState_cid = wl_internalState.wl_cid;
		trace('获取wl_internalState_cid cookies成功');
	}catch(e){
		trace('获取wl_internalState_cid cookies失败！');
	}
	//如果取到msn登录的cookie，且不是私密博客，且不是私密博文，则发送feed
	if (wl_internalState_cid && !isPrivateBlog && !isPrivateArticle){
		new Interface('http://control.blog.sina.com.cn/riaapi/feed/msn_feed.php', 'jsload').request({
			GET: {
				uid: scope.$uid,
				title: encodeURIComponent($E('articleTitle').value),
				link: encodeURIComponent("http://blog.sina.com.cn/s/blog_" + frmJson.data + ".html")
			},
			onSuccess: function(){}
		});
		trace('有msncookie，发送feed, 放弃使用new image方式');
	}else{
		trace('不发送feed，info:' + [wl_internalState_cid , !isPrivateBlog , !isPrivateArticle]);
	}
	var msg=Core.System.getParam("blog_id")?"博文已修改成功":"博文已发布成功";
	var sucdlg = winDialog.alert(msg, {
		funcOk: function(){
			setTimeout(function(){
			  window.onbeforeunload=function(){};
			  window.location.href = "http://blog.sina.com.cn/s/blog_" + frmJson.data + ".html";
			},1);
		},
		textOk: "确定",
		title: "提示",
		icon: "03" // 可选值："01"、"02"、"03"、"04"、"05"
	}, "sendArticleSucsessDialog");
	var closeEle = winDialog.getDialog("sendArticleSucsessDialog").getNodes()["btnClose"];
	Core.Events.addEvent(closeEle, function(){
		setTimeout(function(){
			window.onbeforeunload=function(){};
			window.location.href = window.location.href ="http://blog.sina.com.cn/s/blog_" + frmJson.data + ".html";
		},1);
	}, 'click');
}