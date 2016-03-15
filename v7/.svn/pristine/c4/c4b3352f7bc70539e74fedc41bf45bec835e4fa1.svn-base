/**
 * @fileoverview 昵称下拉面板
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-04
 */
$import("sina/sina.js");
$import("sina/core/class/define.js");
$import("sina/core/events/addEvent.js");
$import("sina/utils/io/jsload.js");
$import("sina/utils/cookie/getCookie.js");

$import("lib/component/platformTray/templates/nicknameTemplate.js");
$import("lib/panel.js");

// $import("lib/LocalDB.js");
/**
 * 昵称下拉面板类，继承于Panel类
 */
scope.NicknamePanel = Core.Class.define(function() {
	Lib.Panel.prototype.initialize.apply(this, arguments);
	this.setTemplate(scope.nicknamePanelTemplate);
}, Lib.Panel, {

	/**
	 * 根据用户ID初始化用户信息
	 * @param {String} uid
	 * @param {Object} objCallBack 回调函数对象
	 *					 onSuccssed 成功后的回调函数
	 *					 onException 有异常时的回调函数
	 */
	initUserInfo:function(uid) {
		var nodes = this.getNodes();
		/*var t = "";
		 if (Lib.LocalDB.isFlashReady) {
		 t = Lib.LocalDB.get("nick_"+uid, 86400000);//昵称数据一天失效     86400000
		 }    */

		/*if (t) {
		 if (objCallBack["onSuccessed"]) {
		 objCallBack["onSuccessed"](t.nick);
		 trace("看到此条信息则json对象存储成功！"+t.nick);
		 }
		 }else{
		 //获取用户昵称
		 Utils.Io.JsLoad.request("http://uic.sinajs.cn/uic?type=nick&uids=" + uid + "&varname=platformNickTray", {
		 onComplete: function(){
		 if (objCallBack["onSuccessed"]) {
		 objCallBack["onSuccessed"](platformNickTray[uid]);
		 }
		 if (Lib.LocalDB.isFlashReady) {
		 Lib.LocalDB.set("nick_"+uid, {"nick":platformNickTray[uid]});

		 }
		 },
		 onException: function(){
		 if (objCallBack["onException"]) {
		 objCallBack["onException"]();
		 }
		 }
		 });
		 }*/
		
		//IE6竟然能快到按顺序执行，真日和
		scope.$bindEmail = function(data) {
			var node = nodes['bindEmail'];
			if (data.ret != 'y' && data.errcode != 'not_verify') {
				node.parentNode.removeChild(node);
			} else {
				node.href = "http://login.sina.com.cn/bindmail/bindmail.php?entry=blog";
			}
		}
		
		try{
			var username = /user=([^&]+)&/g.exec(decodeURIComponent(Utils.Cookie.getCookie("SUP")))[1];
			//判断用户是否需要绑定邮箱
			Utils.Io.JsLoad.request("http://login.sina.com.cn/bindmail/checkmailuser.php?entry=blog&name=" + encodeURIComponent(username) + "&utf82bgk=1&callback=scope.$bindEmail", {
				noreturn: true
			});
		}catch(e){}
		


		//配置链接
		nodes["linkBlog"].href = "http://blog.sina.com.cn/u/" + uid;
		nodes["linkPhoto"].href = "http://photo.blog.sina.com.cn/u/" + uid;
		nodes["linkVBlog"].href = "http://you.video.sina.com.cn/m/" + uid;
		nodes["miniblog"].href = "http://control.blog.sina.com.cn/t_sina_blog/tb.php?uname=" + uid;
        // nodes["qingblog"].href = "http://qing.blog.sina.com.cn/fancy.html";
		nodes["mySpace"].href = "http://blog.sina.com.cn/s/profile_" + uid + ".html";
		nodes["linkChangeFace"].href = "http://control.blog.sina.com.cn/blogprofile/nick.php";
		nodes["linkChangePassword"].href = "http://login.sina.com.cn/member/security/password.php";
		nodes["linkAccountSetup"].href = "http://login.sina.com.cn/member/security.php";
		
		// console.log(nodes);
		var node = ["linkBlog","linkPhoto","linkVBlog","miniblog","mySpace","linkChangeFace","linkChangePassword","linkAccountSetup"];
		
		for(var i=0; i<node.length; i++){
			nodes[node[i]].onclick = function(){
				v7sendLog('40_01_02_'+$UID);
			}
		}
	}
});


