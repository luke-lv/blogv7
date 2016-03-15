/**
 * @fileoverview 消息下拉面板
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-04
 */
$import("sina/sina.js");
$import("sina/core/class/define.js");
$import("sina/core/events/addEvent.js");
$import("sina/utils/flash/swf.js");
$import("sina/utils/io/jsload.js");
$import("sina/core/dom/opacity.js");

$import("lib/interface.js");
$import("lib/component/platformTray/templates/inboxTemplate.js");

$import("lib/panel.js");
$import("lib/checkAuthor.js");
$import("lib/LocalDB.js");
$import("lib/component/platformTray/msnMovePanel.js");

$import("lib/sendLog.js");



/**
 * 消息下拉面板类，继承于Panel类
 */
scope.InboxPanel=Core.Class.define(function(){
	Lib.Panel.prototype.initialize.apply(this, arguments);
	this.setTemplate(scope.inboxPanelTemplate);
	this.nodes=this.getNodes();
	var me=this;
		var t=Lib.LocalDB;
		if(!t.FlaDom){//如果flash 还没有加载
			t._this=me;
			t.loadedFun=me.FlashLoaded;		
			t.loadFlash("trayFlashConnetion");
		}else{
			//如果 其他地方先于 托盘 加载flash的话 做如下操作（手动执行 FlashLoaded 函数）
			//trace("Flash在托盘前面加载好了哦，谁干的？");
			me.FlashLoaded(me);		
		}
	
	this.interfaceMessages=new Interface("http://interface.blog.sina.com.cn/riaapi/profile/unread.php","jsload");
},Lib.Panel,{
	
	/**
	 * 模板节点
	 */
	nodes:null,
	
	/**
	 * flash通信对象
	 */
	_connectSWF:null,
	
	/**
	 * flash通信对象的通道名称
	 */
	_SWFChannelName:"inboxConnection",
	
	/**
	 * 消息数据接口对象
	 */
	interfaceMessges:null,
	
	/**
	 * 消息信息是否已经请求完
	 */
	isMessageLoaded:false,
	
	/**
	 * 用户服务是否已经请求完
	 */
	isUICServiceLoaded: true,
	
	/**
	 * 是否提示有新消息
	 */
	isHaveNewMessage:false,
	
	_listData:null,
	
	/**
	 * 产品ID
	 */
	_productIDs:{
		"blog":0x00000001,
		"vblog":0x00000002,
		"group":0x00000004,
		"photo":0x00000008,
		"cube":0x00000010
	},
	
	/**
	 * 判断用户服务开通接口地址
	 */
	interfaceUICServiceURL:"http://uic.sinajs.cn/uic?type=service&uids=#{uids}&varname=service",
	
	/**
	 * 创建Flash通信对象
	 */
	//已经被替代
	createConnectSWF:function(){
		var _this=this;
		try {
			Utils.Flash.swfView.Add($_GLOBAL.flashBasicURL + "share_connect.swf", "trayFlashConnetion", "connectSWF", "1", "1", "8", "#ffffff", {}, {
				allowScriptAccess: "always",
				wmode: "transparent"
			});
			Utils.Flash.swfView.Init();
			this._connectSWF = $E("connectSWF");
		}catch(ex){
			//alert(ex.message);
		}
		//注册flash信息通道
		var count=0;
		(function(){
			try {                     //尝试flash中 是否开放register 接口函数
				if (!_this._connectSWF.register && count++ < 5) {
					setTimeout(arguments.callee, 1000);//执行此匿名函数 注册 只试5次
				}
				else {
					//注册swf通信的function
					window.$registSWFInfo = function(){
						//对不支持该flash相应方法的浏览器作容错处理
						try {
							window.$updateData = function(dataObj){
								_this.updateData(dataObj);
							};
							var serverID = _this._connectSWF.getServer(_this._SWFChannelName);
							_this._connectSWF.send(_this._SWFChannelName, serverID, "$updateData");
						}catch(ex){}
					};
					
					_this._connectSWF.register({
						channel_name: _this._SWFChannelName,
						callback_function: "$registSWFInfo"
					});
					
				}
				
			}catch(ex){}
		})();
	},
	/**
	 * flash 加载完毕后 执行的函数
	 */
	FlashLoaded:function(me){
		//trace("Flash加载好了哦");
		var t=Lib.LocalDB;
		var _this=me;
		window.$updateData = function(dataObj){
								_this.updateData(dataObj);
							};
		Lib.checkAuthor();
		t.login($UID);
		t.setClientJsFun("$updateData");
		/*setInterval(function(){t.sendToClient({
			msg: "hello,world！"
		});},10000);*/
		setTimeout(function(){
			_this.requestDataInterface();
		},100);
		
	},
	/**
	 * 请求消息数据接口
	 */
	requestDataInterface:function(){
		var _this=this;
		this.updateView("loading");
		Lib.checkAuthor();
		
//		var hashProduct={
//			"blog7icp":"icp",
//			"blog7":"blog",
//			"blog7photo":"photo"
//		};
		var t=Lib.LocalDB;
		var d=null;
		if(t.isFlashReady&&!this.checkCache){
			//flash 加载完毕 并且  是第一次登录 ，，，尝试缓存
			this.clearCache();// 特殊页面 先清空 特殊的缓存
			d=t.get("uid_"+$UID+"unread",60*1000*4);
			this.checkCache=true;
		}
		
		var unreadOk=function (data) {
				if(!d){
					t.set("uid_"+$UID+"unread",data);
				}
				_this.isMessageLoaded=true;
				_this.onMessageLoad(data["nickname"]);//trace("昵称是----》》》"+data["nickname"]);	
				_this._listData = data;
				scope.unreadMsg = data;
				if(!scope.msnIsExceBefore) {
					scope.msnIsExceBefore = 1;
					if(data.needMSNSpaceTip) {
						scope.needMSNSpaceTip = 'yes';
						(new scope.MSNMovePanel()).showMsnMove();
					} else {
						scope.needMSNSpaceTip = 'no';
					}
				}
				scope.nickname = data["full_nickname"]; //2010.02
				if(data.svr_time){
					scope.$svr_time = data.svr_time;		//2010.05
				}
				
				// 增加remind标识有博文被转载/收藏
				//trace('tipremind:加载到这里'+ data.remind);
				if(data.nfn >= 1 || data.remind == 1) {
					//显示有新动态产生
					_this.initNewStatusTip(data);
				} else {
					var tip = $E('newStatusTip');
					if(tip) {
						tip.style.display = 'none';						
					}
				}
				_this.updateListData(data);

				//消息载入完成后触发onLoaded事件
				if(_this.isMessageLoaded){
					_this.updateData({
						data: _this._listData
					});
					_this.onLoaded();
				}
				
				scope.hasOpenBlog = data.isbloguser == 1 ? 'open' : 'no';
				//trace('~~~~~~~~~~~~~~~~~~~'+scope.hasOpenBlog);
				scope.bindTrayOpenTime = 1;
				if(scope.hasOpenBlog == 'no' && scope.bindTrayOpenTime == 1) {
					$E('openedBlogTray').style.display = 'none';
					$E('noOpenedBlogTray').style.display = '';
					$E('outOfOpenBlogTray').style.display = '';
					// 未开通博客 也要有 msn 搬家
					if($_GLOBAL&&$_GLOBAL.popularizeConfig&&$_GLOBAL.popularizeConfig["noBlog"]){
						//在 活动位 显示 没办法 只能找个临时节点了
						$E("loginBarActivity").innerHTML=$_GLOBAL.popularizeConfig["noBlog"];		
					}
					
					$E('openBlogBtnTray').onclick = function() {
						scope.blogOpener.showDialog(function() {
							$E('openedBlogTray').style.display = '';
							$E('noOpenedBlogTray').style.display = 'none';
							$E('outOfOpenBlogTray').style.display = 'none';
							if(scope.$pageid == 'fakeIndex') {
								window.location.href = 'http://blog.sina.com.cn/u/'+$UID;
							}
						},true);
					};
					$E('noOpenBlogName').href="http://blog.sina.com.cn/u/"+$UID;
					scope.bindTrayOpenTime = 2;
				}
				//活动面板依据该标记决定何时渲染
				scope.unreadOkExecuted = true;
			};
		if(d){
			unreadOk(d);
			trace("-------unread 使用缓存的数据!!!----");
		}else{
			trace("-----直接调用unread接口！！！");
			this.interfaceMessages.request({
			GET : {
				uid:$UID,
				product:"blog"
			},
			onSuccess : unreadOk,
			onError : function (data) {
			},
			onFail : function (){
			}
		});
		}
	
	},
	//data:{"notice":0,"invite":0,"message":1,"blogcomment":0,"blogrecomment":0,"photocomment":0,"trashcomment":0,
	//"vblogcomment":0,"gbook":1,"nfn":"1","remind":0,"version":"7","foot":0,"isbloguser":1,"svr_time":1280453012}}
	
	/*'<li><a id="#{notice}"  href="http://control.blog.sina.com.cn/blogprofile/profilenoticelist.php">通知</a><em id="#{noticeCount}"></em></li>',
						'<li><a id="#{message}" target="_blank" href="http://control.blog.sina.com.cn/blogprofile/profilepaperlist.php?type=1">纸条</a><em id="#{messageCount}"></em></li>',
						'<li><a id="#{invite}" target="_blank" href="http://control.blog.sina.com.cn/blogprofile/profileinvitelist.php">好友邀请</a><em id="#{inviteCount}"></em></li>',
						'<li id="#{liBlogComment}"><a target="_blank" id="#{blogComment}" href="http://control.blog.sina.com.cn/blogprofile/profilecommlist.php?type=1">博客评论</a><em id="#{blogCommentCount}"></em></li>',
						'<li id="#{liPhotoComment}"><a target="_blank" id="#{photoComment}" href="http://control.blog.sina.com.cn/blogprofile/profilecommlist.php?type=2">图片评论</a><em id="#{photoCommentCount}"></em></li>',
						'<li id="#{liVblogComment}"><a target="_blank" id="#{vblogComment}" href="http://icp.api.sina.com.cn/pubcontrol/index.php?ptype=10">播客评论</a><em id="#{vblogCommentCount}"></em></li>',
						'<li id="#{liCommentRelapse}"><a target="_blank" id="#{commentRelapse}" href="http://control.blog.sina.com.cn/blogprofile/profilereplylist.php">评论回复</a><em id="#{commentRelapseCount}"></em></li>',
						'<li><a id="#{guestBook}" target="_blank" href="http://i.blog.sina.com.cn/blogprofile/wall.php">留言</a><em id="#{guestBookCount}"></em></li>',
						'<li id="#{liGarbageBox}"><a target="_blank" href="http://control.blog.sina.com.cn/blogprofile/profilecommtrash.php" id="#{garbageBox}" href="javascript:;">垃圾箱</a><em id="#{garbageBoxCount}"></em></li>',
	*/clearCache:function(){
		var pageId={"profile_notice":"notice",
					"profile_paperlist":"message",
					"profile_invitelist":"invite",
					"profile_commlist":"blogcomment",
					"profile_replylist":"blogrecomment",
			    	"profile_guestBookM":"gbook",
					"profile_commtrash":"trashcomment",
					"profile_commphotolist":"photocomment",
					"profile_index":"profile_index",
					"profile_remind":"profile_remind"
					};		
		var t=Lib.LocalDB;
		var d=t.get("uid_"+$UID+"unread",60*1000*4);
        if(d && pageId[scope.$pageid] && typeof(d[pageId[scope.$pageid]])!=undefined){
            trace("-----清除缓存");
            //d[pageId[scope.$pageid]]=0;
            //t.set("uid_"+$UID+"unread",d);
            t.clearCache(10,"uid_"+$UID+"unread");

        }

        //如果在活动站进行了操作, 则清空缓存获取最新数据
        var ccn = $UID + '_clear_flash'; 
        var clearFlash = Utils.Cookie.getCookie(ccn);
        if (clearFlash == 1){
            trace("【活动】根据cookie标记,清除Flash缓存");
            t.clearCache(10,"uid_"+$UID+"unread");
            Utils.Cookie.setCookie(ccn, '', 0, '/', '.sina.com.cn');
        }

		//如果 是pageId等于 以上的pagid 清除缓存
		/*if(pageId[scope.$pageid]){
			t.clearCache(10,"uid_"+scope.$uid+"unread");
			//trace("清除缓存！"+"uid_"+scope.$uid+"unread");
			
		}*/		
	},
	/**
	 * 显示新动态产生提示
	 */
	initNewStatusTip:function(data) {
		if(scope.$pageid == 'profile_index' || scope.$pageid == 'pageSetM' || scope.$pageid == 'editor') {
			return;
		}
		var tip = $E('newStatusTip');
		if(tip) {
			return;
		}		
			
		tip = $C('div');
		tip.id = 'newStatusTip';
		tip.className = 'tb_layer_Y tb_layer_w3';
		tip.style.width = '138px';
		tip.innerHTML = scope.newStatusTipTemplay;
		var a = $T($E('loginBarCenter'),'a')[0];
		var loc = Core.Dom.getXY(a);
		tip.style.left = (loc[0]-(138/2-a.offsetWidth/2)) + 'px';
		tip.style.top = (loc[1]+a.offsetHeight) + 'px';
		tip.style.zIndex = '510';
		if(a.href.indexOf('?') == -1) {
			a.href += '?type=2&from='+scope.$pageid;
		}
		Core.Dom.opacity(tip, 0);
		document.body.appendChild(tip);
		// 增加判断，因为一个tip层里需要根据条件显示多种提示信息
		if (data.nfn >= 1) {
			$E('nstFeed').style.display = 'block';
		}
		if (data.remind == 1) {
			$E('nstFavorite').style.display = 'block';
		}
		for(var i=1; i<=500; i++) {
			(function(val){
				setTimeout(function() {
					Core.Dom.opacity(tip, val*2/10);
				},val*2);
			})(i);
		}
		if(scope.$pageid == 'editor') {
			a.target = '_blank';
			$E('nstFeed').parentNode.target = '_blank';
			$E('nstFavorite').parentNode.target = '_blank';
			Core.Events.addEvent(a,this.closeTip(a),"click");
		}
		Core.Events.addEvent(window,function(){ 
				var a = $T($E('loginBarCenter'),'a')[0];
				var loc = Core.Dom.getXY(a);
				tip.style.left = (loc[0]-(138/2-a.offsetWidth/2)) + 'px';
				tip.style.top = (loc[1]+a.offsetHeight) + 'px';
			 }, "resize");
	},
	
	/**
	 * 专为写博客页面做的操作，当来新消息，用户点击时,浮层会消失，并清除后面的参数
	 * @param {Element} ele '个人中心' 链接
	 */
	closeTip : function(ele) {
		return function() {
			$E('newStatusTip').style.display = 'none';
			ele.href = ele.href.split('?')[0];
		};
	},
	
	/**
	 * 实时更新数据(间隔为1分钟)，Server端会向Client端同步数据
	 * @param {Object} dataObj
	 */
	updateData:function(dataObj){
		var t=Lib.LocalDB;
		var _this=this;
		_this.updateView("loaded");
		Lib.checkAuthor();
		try {
			if (($UID && $UID == dataObj.uid)||t.getServer() == true) {
				_this.isHaveNewMessage = false;
				_this.isMessageLoaded = false;
//				trace("获取数据啦，更新");
				_this.updateListData(dataObj.data);
				if(dataObj.data.nfn >= 1) {
					_this.initNewStatusTip();
				} else {
					var tip = $E('newStatusTip');
					if(tip) {
						tip.style.display = 'none';
					}
				}
				
			}
		}catch(ex){}
		
		//轮循从Server端页面向Client端页面发送更新后的数据
		/*setTimeout(function(){
			//对不支持该flash相应方法的浏览器作容错处理
			try {
				if (_this._connectSWF.getType(_this._SWFChannelName) == "Server") {
					Lib.checkAuthor();
					_this._connectSWF.dispatch(_this._SWFChannelName, "$updateData", {
						data: dataObj.data,
						uid:$UID
					});
					_this.requestUICService();
					_this.requestDataInterface();
					
				}
			} catch (ex) {}
		}, 1000 * 60 * 4);*/
		//新的 发送信息 方式
		if(t.getServer()==true){//trace("向client发送数据ing……");
			Lib.checkAuthor();
			t.sendToClient({
						"data": dataObj.data,
						"uid":$UID
					});
			setTimeout(function(){		//trace("轮询中ing………………");	
						_this.requestUICService();
						_this.requestDataInterface();
						},60000*4);
			
		}else{
			//trace("client 随时准备成为 server 调用接口");
			setTimeout(function(){
				if(t.getServer()){
					//trace("本页面已从client--》sever啦");
					t.setClientJsFun("$updateData");
					_this.requestUICService();
					_this.requestDataInterface();
				}
			},60000*4);
			
		}
		//trace(dataObj["msg"]+"%%%%%%%%%%");
		
	},
	
	/**
	 * 初始化消息列表
	 * @param {Object} uid 登录用户的ID
	 */
	initializeList:function(){
		this.requestUICService();
		//this.requestDataInterface();
		this.checkCache=false;
	},
	
	
	//博客消息需要部署的调查统计代码
	
	v7sendLog: function() {
				Lib.checkAuthor();

				var nodes = $T(this.nodes['inboxList'], 'li');
				
				Core.Array.foreach(nodes, function(node, i) {
						var a=$T(node, 'a')[0];						
						if(a.onclick){
							a.onclick=null;
						}
						if ($T(node, 'strong').length) {
								a.onclick = function() {
										v7sendLog("91_03-0" + (i + 1) +'_'+ $UID,scope.$pageid,'');
										this.onclick = null;
								}
						}
				})
	},
	
	
	/**
	 * 更新消息面板
	 * @param {Object} dataCollection 数据集
	 */
	updateListData:function(dataCollection){
		//$E("t").innerHTML+="<br/>"+this._connectSWF.getType(this._SWFChannelName)+":"+dataCollection["invite"];
		this.nodes["noticeCount"].innerHTML=this._getFormatCountString(dataCollection["notice"]);
		this.nodes["inviteCount"].innerHTML=this._getFormatCountString(dataCollection["invite"]);
		this.nodes["messageCount"].innerHTML=this._getFormatCountString(dataCollection["message"]);
		
		Lib.checkAuthor();
		this.nodes["guestBookCount"].innerHTML=this._getFormatCountString(dataCollection["gbook"]);
//		this.nodes["guestBook"].href="http://profile.blog.sina.com.cn/wall.php?uid="+$UID;
		
		//垃圾箱
		if (parseInt(dataCollection["trashcomment"]) > 0) {
			this.nodes["garbageBoxCount"].innerHTML = "*";
		}else{
			this.nodes["garbageBoxCount"].innerHTML = "";
		}
		
//		var uicKey=this._uicService[$UID];
		
		//开通博客后才显示博客数据信息
//		if (parseInt(this._productIDs["blog"] & parseInt(uicKey,16))==parseInt(this._productIDs["blog"])) {
			this.nodes["liBlogComment"].style.display = "";
			this.nodes["blogCommentCount"].innerHTML = this._getFormatCountString(dataCollection["blogcomment"]);
//		}else{
//			this.nodes["liBlogComment"].style.display="none";
//		}
		
		//开通相册后才显示相册数据信息
//		if (parseInt(this._productIDs["photo"] & parseInt(uicKey,16))==parseInt(this._productIDs["photo"])) {
			this.nodes["liPhotoComment"].style.display = "";
			this.nodes["photoCommentCount"].innerHTML = this._getFormatCountString(dataCollection["photocomment"]);
//		}else{
//			this.nodes["liPhotoComment"].style.display="none";
//		}
		
		//开通播客后才显示播客数据信息
//		if(parseInt(this._productIDs["vblog"] & parseInt(uicKey,16))==parseInt(this._productIDs["vblog"])){
			this.nodes["liVblogComment"].style.display = "";
			this.nodes["vblogCommentCount"].innerHTML=this._getFormatCountString(dataCollection["vblogcomment"]);
//		}else{
//			this.nodes["liVblogComment"].style.display="none";
//		}
		
		//开通博客后才显示评论数据信息
//		if (parseInt(this._productIDs["blog"] & parseInt(uicKey,16))==parseInt(this._productIDs["blog"])) {
			this.nodes["liCommentRelapse"].style.display = "";
			this.nodes["commentRelapseCount"].innerHTML = this._getFormatCountString(dataCollection["blogrecomment"]);
//		}else{
//			this.nodes["liCommentRelapse"].style.display="none";
//		}
		
		//检测是否有新的消息
		var i,
			msgCfg=["notice","invite","message","blogcomment","blogrecomment","photocomment","trashcomment","vblogcomment","gbook"],
			len=msgCfg.length;
		for(i=0;i<len;i++){
			if(parseInt(dataCollection[msgCfg[i]])>0){			
				this.isHaveNewMessage = true;
			}
		}
		
		var k;
		for(k in dataCollection){
			if(k != "version" && window.parseInt(dataCollection[k])>0){
				//this.isHaveNewMessage = true;
				if($E("left_" + k)){
					$E("left_" + k).innerHTML = '(' + dataCollection[k] + ')';
				}
			}
			// else if(k == "version" && dataCollection[k] * 1 == 7){
			// 	this.isVersion7 = true;
			// }
		}
		
		// if(this.isVersion7){
		// 	this.nodes["liInviteUpgrade"].style.display = "";
		// }
		
		//绑定 布码
		var _this=this;
		setTimeout(function(){_this.v7sendLog()},100);
		
	},
	
	/**
	 * 请求用户开通服务
	 */
	requestUICService:function(){
		Lib.checkAuthor();
		if(this.isMessageLoaded){
			this.updateData({
				data: this._listData
			});
			this.onLoaded();
		}
	},
	
	/**
	 * 获取格式化后的数字字符串
	 * @param {String} count
	 */
	_getFormatCountString:function(count){
		var result="";
		if(!isNaN(parseInt(count)) && parseInt(count)!=0){
			if(parseInt(count)>500){
				result="(<strong>500+</strong>)";
			}else{
				result="(<strong>"+count+"</strong>)";
			}
		}
		return result;
	},
	
	/**
	 * 更新显示状态
	 * @param {String} loadState 装载状态
	 * 				"loading" 正在装载
	 * 				"loaded" 装载完成
	 */
	updateView:function(loadState){
		this.nodes["inboxLoding"].style.display=loadState == "loaded" ? "none" : "";
		this.nodes["inboxList"].style.display=loadState == "loaded" ? "" : "none";
	},
	
	/**
	 * 信息已经全部装载完成
	 */
	onLoaded:function(){
	},
	onMessageLoad:function(){}
});
