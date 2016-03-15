/**
 * @fileoverview 平台显示的托盘(加强版)
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-09-14
 */

$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/utils/form/sinput.js");
$import("sina/core/system/htmlFilter.js");
$import("sina/utils/cookie/getCookie.js");
$import("sina/utils/cookie/setCookie.js");

$import("lib/lib.js");
$import("lib/panel.js");
$import("lib/component/platformTray/templates/trayPlusTemplate.js");
$import("platformTray/nicknamePanel.js");
$import("platformTray/searchPanel.js");
$import("platformTray/inboxPanel.js");
$import("platformTray/addArticlePanel.js");
$import("lib/component/platformTray/activityPanel.js");
$import("lib/login/ui.js");
$import("lib/checkAuthor.js");

/**
 * 平台显示的托盘
 */
Lib.PlatformTrayPlus=Core.Class.create();
Lib.PlatformTrayPlus.prototype={
	/**
	 * 托盘对象
	 */
	tray:null,
	
	/**
	 * 子面板
	 */
	subPanels:[],
	
	/**
	 * 登录操作对象
	 */
	trayLogin:null,
	
	/**
	 * 初始化
	 */
	initialize:function(){
	},
	
	/**
	 * 装载托盘
	 * @param {String} loginState 登录状态
	 * 					"login" 已登录
	 * 					"logout" 未登录
	 */
	load:function(loginState){
		switch(loginState){
			/*登录状态下的托盘*/
			case "login":
				this.render(scope.trayPlusTemplayLogin);
				
				//设置鼠标悬停在模块区域的样式改变
				this.setNodesMouseHoverStyle(["loginBarOptApp","loginBarCenter","loginBarFriend","loginBarInbox"]);

				//初始化昵称下拉面板
				this.initNicknamePanel();

				//初始化消息下拉面板
				this.initInboxPanel();
					
				//初始化活动面板
				this.initActivityPanel();

				break;
				
				
			/*未登录状态下的托盘*/
			case "logout":
				this.trayLogin = new Lib.Login.Ui();
				this.render(scope.trayPlusTemplayLogout);
				
				//初始化升级功能
				//this._initLevelUp();
				
				//初始化登录
				this.initLogin();
				
				//初始化推广位
				this.initPopularize();
				
				break;
		}
		
		//初始化发博文下拉面板
		this.initAddArticlePanel();
		
		//初始化搜索选项下拉面板
		this.initSearchPanel();

	},
	
	/**
	 * 呈现托盘内容
	 * @param {String} html
	 */
	render:function(html){
		$E("trayContainer").innerHTML=html;
//		trace('故障通知链接');
//		setTimeout(function(){
//			$E('loginBarActivity').innerHTML = '<a href="http://blog.sina.com.cn/lm/8/2010/0908/158867.html" target="_blank" class="topbar_Red">博客部分用户访问异常说明</a>';
//		},1000);
	},
	
	/**
	 * 初始化登录
	 */
	initLogin:function(){
		var me=this;
		Core.Events.addEvent($E("linkTrayLogin"),function(){
			me.trayLogin.login(null,false,"referer:"+location.hostname+location.pathname+",func:0007");		//相册托盘登录统计点，0007
		},"click");
		
		//配置"注册"链接地址
		$E("linkReg").href="http://login.sina.com.cn/signup/signup.php?entry=blog&srcuid="+scope.$uid+"&src=blogicp";
	},
	
	/**
	 * 初始化推广位
	 */
	initPopularize:function(){
		$E("divPopularize").innerHTML=$_GLOBAL.popularizeConfig["content"];
	},
	
	/**
	 * 初始化升级功能
	 */
	// 	_initLevelUp:function(){
	// 	var me=this,leveUpTip;
	// 	if(!Utils.Cookie.getCookie("upgd_tips")){
	// 		
	// 		levelUpTip=new Lib.Panel();
	// 		levelUpTip.setTemplate([
	// 			'<div id="#{panel}" style="z-index:1000;" class="tb_layer_Y tb_layer_w4">',
	// 				'<div class="tb_layer_arrow"></div>',
	// 				'<div class="tb_layer_Y_main">',
	// 					'<div class="tb_updatetips">立即升级到<span style="color:red;">新版博客</span>，享受从速度到功能的全面升级吧！</div>',
	// 				'</div>',
	// 			'</div>'].join(""));
	// 
	// 		levelUpTip.showWithDom($E("btnBlog7LevelUp"),-161,0);
	// 		
	// 		Core.Events.addEvent(levelUpTip.entity,function(){
	// 			Utils.Cookie.setCookie("upgd_tips","1",20000,"");
	// 			levelUpTip.close();
	// 		},"click");
	// 	}
	// 	
	// 	Core.Events.addEvent($E("btnBlog7LevelUp"),function(){
	// 		Utils.Cookie.setCookie("upgd_tips","1",20000,"");
	// 		window.location.href="http://control.blog.sina.com.cn/upgrade/invite_upgrade_show.php?version=7";
	// 	},"click");
	// },
	
	/**
	 * 设置节点的鼠标悬停样式
	 * @param {Array} nodeNames 节点名称数组
	 */
	setNodesMouseHoverStyle:function(nodeNames){
		var i,len=nodeNames.length;
		for (i = 0; i < len; i++) {
			Core.Events.addEvent($E(nodeNames[i]), (function(idx){
				return function(){
					$E(nodeNames[idx]).className = "link current";
				};
			})(i), "mouseover");
			
			Core.Events.addEvent($E(nodeNames[i]), (function(idx){
				return function(){
					$E(nodeNames[idx]).className = "link";
				};
			})(i), "mouseout");
		}
	},
	
	/**
	 * 初始化昵称下拉面板
	 */
	initNicknamePanel:function(){
		var nicknamePanel=new scope.NicknamePanel();
		Lib.checkAuthor();
		
		/*nicknamePanel.initUserInfo($UID,{
			onSuccessed:function(nickname){
				$E("loginBarAppMenuLabel").innerHTML=Core.System.htmlFilter(nickname);
			}
		});*/
		
		nicknamePanel.initUserInfo($UID);
		
		this.addSubPanel(nicknamePanel, $E("loginBarOptApp"), -98, -9);
	},
	
	/**
	 * 初始化消息下拉面板
	 */
	initInboxPanel:function(){
		var inboxPanel=new scope.InboxPanel();
		this.addSubPanel(inboxPanel, $E("loginBarInbox"), -68, -9);
		inboxPanel.initializeList();
		
		//检测是否显示"有新消息"图标
		inboxPanel.onLoaded=function(){
			$E("imgNewMessage").style.display=this.isHaveNewMessage?"":"none";
			
		};
		//显示用户昵称
		inboxPanel.onMessageLoad=function(nickname){
			$E("loginBarAppMenuLabel").innerHTML=Core.System.htmlFilter(nickname);			
			$E("noOpenBlogName").innerHTML=Core.System.htmlFilter(nickname);
		};
	},
	
	/**
	 * 初始化发博文下拉面板
	 */
	initAddArticlePanel:function(){
		var addArticlePanel=new scope.addArticlePanel();
		this.addSubPanel(addArticlePanel, $E("arrowAddArticle"), -81, 0);
	},
	
	/**
	 * 初始化搜索选项下拉面板
	 */
	initSearchPanel:function(){
		var searchPanel=new scope.SearchPanel();

		this.addSubPanel(searchPanel, $E("searchSelect"), -54, -3);
		
		Utils.Form.limitMaxLen($E("loginBarSearchInput"),50);
		
		//配置选项节点事件
		var spNodes=searchPanel.getNodes();
		var cfg;
		for (cfg in searchPanel.config) {
			(function(c){
				Core.Events.addEvent(spNodes[c], function(){
					_setActiveOption(c);
				}, "click");
			})(cfg);
		}
		_setActiveOption("blog");
		
		//将指定选项设置为当前选项
		function _setActiveOption(opt){
			$E("loginBarSearchForm").action = searchPanel.config[opt]["url"];
			$E("loginBarSearchMenuLabel").innerHTML = spNodes[opt].getElementsByTagName("a")[0].innerHTML;
			
			//配置隐藏表单的value
			$E("loginBarSearchT").value=searchPanel.config[opt]["t"];
			$E("loginBarSearchS").value=searchPanel.config[opt]["s"];
			$E("loginBarSearchTS").value=searchPanel.config[opt]["ts"];
			$E("loginBarSearchType").value=searchPanel.config[opt]["type"];
			$E("loginBarSearchSType").value=searchPanel.config[opt]["stype"];
			
			$E("loginBarSearchInput").name = searchPanel.config[opt]["keyName"];
		}
	},
	

	/**
	 * 初始化活动提示面板
	 */
	initActivityPanel:function(){
		var activityPanel=new scope.ActivityPanel();
		trace('【活动】提示面板开始加载。');
		activityPanel.checkActivity();
	},

	/**
	 * 添加子面板
	 * @param {Object} panel 面板对象
	 * @param {Object} dom 面板显示时所依赖的dom节点
	 * @param {Number} offsetLeft x的偏移量
	 * @param {Number} offsetTop y的偏移量
	 */
	addSubPanel:function(panel,dom,offsetLeft,offsetTop){
		var _this=this;
		this.subPanels.push(panel);
		
		//面板的显示
		function _showPanel(){
			Core.Events.stopEvent();
			
			//隐藏其它子面板
			var i,len=_this.subPanels.length;
			for(i=0;i<len;i++){
				_this.subPanels[i].hidden();
			}
			
			//根据所依赖的dom显示当前面板
			panel.showWithDom(dom,offsetLeft,offsetTop);
		}
		
		Core.Events.addEvent(dom,function(){
			_showPanel();
		},"click");
		
		
		Core.Events.addEvent(document.body,function(){
			panel.hidden();
		},"click");
		Core.Events.addEvent(panel.entity,function(){
			Core.Events.stopEvent();
		},"mousedown");
		
		Core.Events.addEvent(window,function(){ 
			var x=Core.Dom.getLeft(dom) + dom.offsetWidth + offsetLeft;
			var y=Core.Dom.getTop(dom) + dom.offsetHeight + offsetTop;
			if($IE6 && this.isFixed){
				x=x-document.documentElement.scrollLeft;
				y=y-document.documentElement.scrollTop;
			}
			panel.setPosition(x,y);
			 }, "resize");
	}
};


