/**
 * @fileoverview
 *	个人信息组件
 		——基础组件，仅包括接口读取和加好友、发纸条部署部分
 		  具体的呈现需要自己实现
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2009.08.11
 * @history
 *
 */
$import("sina/sina.js");
$import("sina/core/dom/setStyle.js");
$import("sina/utils/io/jsload.js");
$import("sina/core/function/bind2.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/core/events/addEvent.js");

$import("lib/component/class/registComp.js");
$import("lib/component/extend/comp_dynamic.js");
$import("lib/msg/componentMSG.js");
$import("lib/checkAuthor.js");
$import("lib/uic.js");
/**
 * 加好友等按钮的状态逻辑
 * 是否博主	-Y->	不显示
 * 			-N->	是否好友	-Y->	webim.js	是否在线	-Y-> 在线聊天按钮可点
 * 														-N-> 在线聊天按钮灰色
 * 							-N->	newall.js
 */

$registComp("901", {
	"load"	: function () {
		Lib.checkAuthor();
		// 如果是访客浏览，就进入加好友等按钮的状态逻辑
		if($isAdmin == false && $isLogin){
			this.loadIsFriend();
		}else if($isAdmin == false && !$isLogin){
			this.isFriend = false;
			this.loadOnline();
		}else{
			this.isOnline = true;
			this.showOnlineInfo();
		}
		this.loadNickname();
		this.loadOtherInfo();
	}
	/*
	 * 判断访客与博主是否好友
	 * 接口可扩展性,当$_GLOBAL.mashAddFriend参数为true时，这个借口将不会再起作用
	 */
	,"loadIsFriend"	: function () {
		if($_GLOBAL.mashAddFriend) {
			this.mashAddFriend = true;
			return;
		}
		var _isFriend = new Interface("http://control.blog.sina.com.cn/riaapi/profile/IsFriend.php", "jsload");
		_isFriend.request({
			GET: {
				"friend_uids": scope.$uid
				,"version": 7
			},
			onSuccess: (function(result){
				this.friendSuccessCallback(result);
			}).bind2(this),
			onError: (function(result){
				this.friendErrorCallback();
			}).bind2(this),
			onFail: (function(){
				this.friendErrorCallback();
			}).bind2(this)
		});
	}
	
	/*
	 * 当判断访客与博主是否好友成功后的回调
	 * @param {Object}	result			返回的数据
	 */
	,"friendSuccessCallback"	:function(result) {
		for(var i = 0, len = result.length; i < len; i ++ ){
			if(result[i].uid == scope.$uid){
				this.isFriend = (result[i].status == 1) ? true : false;
			}
		}
		this.isFriend = (this.isFriend != null) ? this.isFriend : false;
		// 如果是好友，就判断在线与否；否则加载加好友、发纸条JS布码
		this.loadOnline();
	}
	
	/*
	 * 当判断访客与博主是否好友失败后的回调
	 */
	,"friendErrorCallback"	:function() {
		this.isFriend = false;
		this.loadOnline();
	}
	
	/*
	 * 读取博主在线状态
	 */
	,"loadOnline"	: function () {
//		Debug.info("isFriend: true");
		if($isAdmin){
			this.isOnline = true;
			this.showOnlineInfo();
		}else{
			var _isOnline = Utils.Io.JsLoad.request("http://online.sso.sina.com.cn/status/MutiqueryVProduct.php", {
			GET : {
				"UIDS" : '[' + scope.$uid + ']',
				"Check" : scope.$key,
				"ProductType" : "1000",
				"Verbose" : "0",
				"noencode" : true
			},
			//接口传输正常，且状态码为A00006,(可选)
			onComplete : Core.Function.bind2(function(result){
				try {
					var _status = result.Status;
					this.isOnline = (_status[0] == 1) ? true : false;
				}
				catch(e){
					this.isOnline = $isAdmin ? true : false;
				}
				this.showVisitButton();
				this.showOnlineInfo();
			}, this),
			//接口传输异常,(可选)
			onException : Core.Function.bind2(function(){
//				trace("个人信息组件接口读取失败");
				this.isOnline = false;
				this.showVisitButton();
				this.showOnlineInfo();
			}, this)
		});		
		}
	}
	/*
	 * 取博主昵称
	 */
	,"loadNickname"	: function () {
		Lib.Uic.getNickName([scope.$uid], Core.Function.bind2(function(oResult){
			this.showNickName(oResult);
		}, this));
	}
	/*
	 * 必须重载，显示在线图标
	 */
	,"showOnlineInfo"	: function () {}
	/*
	 * 必须重载，显示昵称
	 */
	,"showNickName"	: function () {}
	/*
	 * 必须重载，设置访客状态的四个按钮
	 */
	,"showVisitButton"	: function () {}
	/*
	 * 必须重载，加载其他的附加信息接口
	 */
	,"loadOtherInfo"	: function () {}
	
	/*
	 * 是否合并加好友的标记位置
	 */
	,"mashAddFriend"	: false
	
	/*
	 * 重新加载个人信息组件
	 * @param {Number}	sSize			按什么尺寸重载
	 * @param {Boolean}	bAddManage		是否需要加管理链接
	 * @param {Boolean}	bForceRequest	是否强制刷新
	 */
	,reload		: function (sSize, bAddManage, bForceRequest) {
		var sizeCorrect = sSize == null || (sSize && (sSize == 210 || sSize == 510 || sSize == 730));
		if(!sizeCorrect){
			Debug.error("请检查传入的组件尺寸是否正确。" + sSize);
			return;
		}
		this.size = sSize || this.size;
		if(bForceRequest == true || this.cacheData == null){
			this.load();
		}else{
			this["render_" + this.size]();	
		}
		if(bAddManage){
			this.setManage();
		}
	}	
}, "dynamic");