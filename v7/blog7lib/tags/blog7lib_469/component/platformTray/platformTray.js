/**
 * @fileoverview 平台显示的托盘
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-05
 */

$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/utils/form/sinput.js");
$import("sina/core/system/htmlFilter.js");

$import("lib/panel.js");
$import("lib/component/platformTray/tray.js");
$import("lib/component/platformTray/nicknamePanel.js");
$import("lib/component/platformTray/searchPanel.js");
$import("lib/component/platformTray/inboxPanel.js");
$import("lib/component/platformTray/addArticlePanel.js");
$import("lib/login/ui.js");
$import("lib/checkAuthor.js");

/**
 * 平台显示的托盘
 */
scope.PlatformTray=Core.Class.create();
scope.PlatformTray.prototype={
	/**
	 * 托盘对象
	 */
	tray:null,
	
	/**
	 * 基本配置，针对不同的产品
	 */
	config:{
		//测试
		"platformTray2.0":{
			"img": "http://simg.sinajs.cn/blog7style/images/common/topbar/topbar_logo.gif",
			"href": "http://blog.sina.com.cn"
		},
		//博客
		"blog":{
			"img": "http://simg.sinajs.cn/blog7style/images/common/topbar/topbar_logo.gif",
			"href": "http://blog.sina.com.cn"
		},
		//播客
		"icp":{
			"img": "http://simg.sinajs.cn/blog7style/images/common/topbar/topbar_logo.gif",
			"href": "http://blog.sina.com.cn"
		}
	},
	
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
		this.tray=new scope.Tray();
		switch(loginState){
			/*登录状态下的托盘*/
			case "login":
				this.tray.updateTemplate("login");
				this.tray.setPosition(0,0);
				
				//设置鼠标悬停在模块区域的样式改变
				this.setNodesMouseHoverStyle(["loginBarOptApp","loginBarCenter","loginBarFriend","loginBarInbox"]);
				
				//初始化昵称下拉面板
				this.initNicknamePanel();
		
				//初始化消息下拉面板
				this.initInboxPanel();
				
				break;
				
				
			/*未登录状态下的托盘*/
			case "logout":
				this.tray.updateTemplate("logout");
				this.tray.setPosition(0,0);
				
				this.initPopularize();
				
				//初始化登录
				this.initLogin();
				
				break;
		}
		
		//初始化在不同产品下的呈现形式
		this.initRender();
		
		//初始化发博文下拉面板
		this.initAddArticlePanel();
		
		//初始化搜索选项下拉面板
		this.initSearchPanel();
		
		this.tray.show();

	},
	
	/**
	 * 初始化在不同产品下的呈现形式
	 */
	initRender:function(){
		var trayNodes=this.tray.getNodes();
		//不同产品的logo呈现
		try {
			trayNodes["loginBarLogo"].src = this.config[scope.$PRODUCT_NAME]["img"];
			trayNodes["loginBarLogoLink"].href = this.config[scope.$PRODUCT_NAME]["href"];
		}catch(ex){
			//如果产品名称没有配置则用blog
			trayNodes["loginBarLogo"].src = this.config["blog"]["img"];
			trayNodes["loginBarLogoLink"].href = this.config["blog"]["href"];
		}
	},
	
	/**
	 * 初始化登录
	 */
	initLogin:function(){
		var trayNodes=this.tray.getNodes();
		var trayLogin = new Lib.Login.Ui();
		
		Core.Events.addEvent(trayNodes["trayLogin"],function(){
			trayLogin.login(function(){
				window.location=window.location.toString().replace(/#.*/,"");
			});
		},"click");
		
	},
	
	/**
	 * 初始化推广位
	 */
	initPopularize:function(){
		var trayNodes=this.tray.getNodes();
		trayNodes["linkPopularize"].href=$_GLOBAL.popularizeConfig["link"];
		trayNodes["linkPopularize"].innerHTML=$_GLOBAL.popularizeConfig["text"];
	},
	
	
	/**
	 * 设置节点的鼠标悬停样式
	 * @param {Array} nodeNames 节点名称数组
	 */
	setNodesMouseHoverStyle:function(nodeNames){
		var trayNodes=this.tray.getNodes();
		var i,len=nodeNames.length;
		for (i = 0; i < len; i++) {
			Core.Events.addEvent(trayNodes[nodeNames[i]], (function(idx){
				return function(){
					trayNodes[nodeNames[idx]].className = "link current";
				};
			})(i), "mouseover");
			
			Core.Events.addEvent(trayNodes[nodeNames[i]], (function(idx){
				return function(){
					trayNodes[nodeNames[idx]].className = "link";
				};
			})(i), "mouseout");
			
		}
	},
	
	/**
	 * 初始化昵称下拉面板
	 */
	initNicknamePanel:function(){
		var trayNodes=this.tray.getNodes();
		var nicknamePanel=new scope.NicknamePanel();
		Lib.checkAuthor();
		
		if($E("loginBarAppMenuLabel") != null){
			nicknamePanel.initUserInfo($UID,{
				onSuccessed:function(nickname){
					trayNodes["loginBarAppMenuLabel"].innerHTML=Core.System.htmlFilter(nickname);
				}
			});			
		}
		
		this.tray.addSubPanel(nicknamePanel, trayNodes["loginBarOptApp"], -98, -12, "nicknamePanel");
	},
	
	/**
	 * 初始化消息下拉面板
	 */
	initInboxPanel:function(){
		var trayNodes=this.tray.getNodes();
		var inboxPanel=new scope.InboxPanel();
		this.tray.addSubPanel(inboxPanel, trayNodes["loginBarInbox"], -68, -12, "inboxPanel");
		inboxPanel.initializeList();
		
		//检测是否显示"有新消息"图标
		inboxPanel.onLoaded=function(){
			trayNodes["imgNewMessage"].style.display = this.isHaveNewMessage ? "" : "none";
		};
	},
	
	/**
	 * 初始化发博文下拉面板
	 */
	initAddArticlePanel:function(){
		var trayNodes=this.tray.getNodes();
		var addArticlePanel=new scope.addArticlePanel();
		this.tray.addSubPanel(addArticlePanel, trayNodes["arrowAddArticle"], -81, 0, "addArticlePanel");
	},
    /**
     * 显示发商品链接
     */
    showPublishWare:function(data){
        if (data["tbh_status"]) {
            $E("tray_tbh_ware_linedot").style.display = "";
            $E("tray_tbh_ware_link").style.display = "";
        }
    },
	
	/**
	 * 初始化搜索选项下拉面板
	 */
	initSearchPanel:function(){
		var trayNodes=this.tray.getNodes();
		var searchPanel=new scope.SearchPanel();

		this.tray.addSubPanel(searchPanel, trayNodes["searchSelect"], -69, -3, "searchPanel");
		
		Utils.Form.limitMaxLen(trayNodes["loginBarSearchInput"],50);
		
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
		_setActiveOption("all");
		
		//将指定选项设置为当前选项
		function _setActiveOption(opt){
			
			trayNodes["loginBarSearchForm"].action = searchPanel.config[opt]["url"];
			trayNodes["loginBarSearchMenuLabel"].innerHTML = spNodes[opt].getElementsByTagName("a")[0].innerHTML;
			
			//配置隐藏表单的value
			trayNodes["loginBarSearchT"].value=searchPanel.config[opt]["t"];
			trayNodes["loginBarSearchS"].value=searchPanel.config[opt]["s"];
			trayNodes["loginBarSearchTS"].value=searchPanel.config[opt]["ts"];
			trayNodes["loginBarSearchType"].value=searchPanel.config[opt]["type"];
			trayNodes["loginBarSearchSType"].value=searchPanel.config[opt]["stype"];
			
			trayNodes["loginBarSearchInput"].name = searchPanel.config[opt]["keyName"];
		}
	}
};


