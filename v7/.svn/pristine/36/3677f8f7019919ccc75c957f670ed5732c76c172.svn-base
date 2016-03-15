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

$import("lib/interface.js");
$import("lib/component/platformTray/templates/inboxTemplate.js");
$import("lib/panel.js");
$import("lib/checkAuthor.js");

/**
 * 消息下拉面板类，继承于Panel类
 */
scope.InboxPanel=Core.Class.define(function(){
	Lib.Panel.prototype.initialize();
	this.setTemplate(scope.inboxPanelTemplate);
	this.nodes=this.getNodes();
	var me=this;
/*	setTimeout(function(){
		me.createConnectSWF();
	},5000);
	*/
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
	 * 创建Flash通信对象
	 */
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
			try {
				if (!_this._connectSWF.register && count++ < 5) {
					setTimeout(arguments.callee, 1000);
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
		
		this.interfaceMessages.request({
			GET : {
				uid:$UID,
				product:"blog"
			},
			onSuccess : function (data) {
				_this.isMessageLoaded=true;
				_this.onMessageLoad(data["nickname"]);trace("昵称是----》》》"+data["nickname"]);	
				_this._listData = data;
				scope.unreadMsg = data;				//2010.02
				_this.updateListData(data);
				if(data.svr_time) scope.$svr_time = data.svr_time;		//2010.05
				
				// 增加remind标识有博文被转载/收藏
				trace('tipremind:加载到这里'+ data.remind);
				if(data.nfn == 1 || data.remind == 1) {
					//显示有新动态产生
					_this.initNewStatusTip(data);
				}
				//消息和邮件都载入完成后触发onLoaded事件
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
					$E('openBlogBtnTray').onclick = function() {
						scope.blogOpener.showDialog(function() {
							$E('openedBlogTray').style.display = '';
							$E('noOpenedBlogTray').style.display = 'none';
							$E('outOfOpenBlogTray').style.display = 'none';
							if(scope.$pageid == 'fakeIndex') {
								window.location.href = 'http://blog.sina.com.cn/u/'+$UID;
							}
						},true);
					}
					$E('noOpenBlogName').href="http://blog.sina.com.cn/u/"+$UID;
					scope.bindTrayOpenTime = 2;
				}
			},
			onError : function (data) {
			},
			onFail : function (){
			}
		});
	},
	
	/**
	 * 显示新动态产生提示
	 */
	initNewStatusTip:function(data) {
		var tip = $C('div');
		tip.id = 'newStatusTip';
		tip.style.width = '138px';
		tip.className = 'tb_layer_Y tb_layer_w3';
		tip.innerHTML = scope.newStatusTipTemplay;
		var a = $T($E('loginBarCenter'),'a')[0];
		var loc = Core.Dom.getXY(a);
		tip.style.left = (loc[0]-(138/2-a.offsetWidth/2)) + 'px';
		tip.style.top = (loc[1]+a.offsetHeight) + 'px';
		tip.style.zIndex = '511';
		if(a.href.indexOf('?') == -1) {
			a.href += '?type=2&from='+scope.$pageid;
		}
		Core.Dom.opacity(tip, 0);
		document.body.appendChild(tip);
		// 增加判断，因为一个tip层里需要根据条件显示多种提示信息
		if(data.nfn == 1) $E('nstFeed').style.display = 'block';
		if(data.remind == 1) $E('nstFavorite').style.display = 'block';
		for(var i=1; i<=500; i++) {
			(function(val){
				setTimeout(function() {
					Core.Dom.opacity(tip, val*2/10);
				},val*2);
			})(i);
		}
	},
	
	/**
	 * 实时更新数据(间隔为1分钟)，Server端会向Client端同步数据
	 * @param {Object} dataObj
	 */
	updateData:function(dataObj){
		var _this=this;
		_this.updateView("loaded");
		Lib.checkAuthor();
		_this.isHaveNewMessage = false;
		_this.isMessageLoaded = false;
		
		_this.updateListData(dataObj.data);
		
		//轮循从Server端页面向Client端页面发送更新后的数据
	/*	setTimeout(function(){
			//对不支持该flash相应方法的浏览器作容错处理
			try {
				if (_this._connectSWF.getType(_this._SWFChannelName) == "Server") {
					Lib.checkAuthor();
					_this._connectSWF.dispatch(_this._SWFChannelName, "$updateData", {
						data: dataObj.data,
						uid:$UID
					});
					_this.requestDataInterface();
					
				}
			} catch (ex) {}
		}, 1000 * 60 * 4);*/
		
	},
	
	/**
	 * 初始化消息列表
	 * @param {Object} uid 登录用户的ID
	 */
	initializeList:function(){
		this.requestUICService();
		this.requestDataInterface();
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


