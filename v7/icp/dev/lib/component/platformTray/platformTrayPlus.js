/**
 * @fileoverview 平台显示的托盘(加强版)
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-09-14
 * @modified xiaoyue3 2012-10-26
 */
$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/utils/form/sinput.js");
$import("sina/core/system/htmlFilter.js");
$import("sina/utils/cookie/getCookie.js");
$import("sina/utils/cookie/setCookie.js");
$import("sina/core/dom/insertAfter.js");
$import("sina/utils/cookie/getCookie.js");
$import("sina/utils/io/loadExternalCSS.js");
$import("sina/core/events/click.js");

$import("lib/lib.js");
$import("lib/panel.js");
$import("sina/core/dom/removeClassName.js");
$import("lib/component/platformTray/templates/trayPlusTemplate.js");
$import("lib/component/platformTray/nicknamePanel.js");
$import("lib/component/platformTray/searchPanel.js");
$import("lib/component/platformTray/newInboxPanel.js");
// $import("lib/component/platformTray/activityPanel.js");	//2013-3-13 modified by gaolei 活动面板已被替换
$import("lib/component/platformTray/addArticlePanel.js");
$import("lib/login/ui.js");
$import("lib/checkAuthor.js");
//托盘统计布码的日志投放，由于PHP还没有下线，暂时放上去
$import("lib/sendLog.js");
$import("sina/utils/io/jsload.js");

//显示用户功能向导提示需依赖的文件
$import("sina/utils/cookie/setCookie.js");
$import("sina/utils/cookie/getCookie.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopBubble.js");
$import("lib/sendLog.js");
$import("lib/login/info.js");
$import("sina/core/dom/getElementsByClass.js");
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
        // Lib.Listener.on({
        //     name     : "tray-data-loaded",
        //     callBack : this.showPublishWare,
        //     scope    : this
        // });
	},
	
	/**
	 * 装载托盘
	 * @param {String} loginState 登录状态
	 * 					"login" 已登录
	 * 					"logout" 未登录
	 *						"oncelogedon" 促登录，
	 */
	load:function(loginState){
		// 圣诞节logo替换，下线的时候直接注释这两行代码就行。
        // xiaoyue3@2012年12月19日
		// 节日logo替换，图片地址直接读取boot.js中的$_GLOBAL.platformTrayLogo对象内容，不需要每次都上线blog7lib，直接修改boot.js即可
        var bar_logo = $E('login_bar_logo_link_350');
		if(bar_logo && $_GLOBAL && $_GLOBAL.platformTrayLogo){
			if (!$IE6 && $_GLOBAL.platformTrayLogo.imgForOtherBrs) {
				bar_logo.children[0].src = $_GLOBAL.platformTrayLogo.imgForOtherBrs;
			}else if($_GLOBAL.platformTrayLogo.imgForIE6){
				bar_logo.children[0].src = $_GLOBAL.platformTrayLogo.imgForIE6;
			};
		}

        switch(loginState){
			/*登录状态下的托盘*/
			case "login":
				if($E("loginBarOptApp") == null || !$isAdmin){
					this.render(scope.trayPlusTemplayLogin);
					trace("++++js渲染 登陆后++++++");
				}
                this.initStatic();
                if (/ipad/i.test(navigator.userAgent)) {
                    v7sendLog("48_01_02");
                }
				//设置鼠标悬停在模块区域的样式改变
				this.setNodesMouseHoverStyle(["loginBarOptApp","loginBarMail","loginBarCenter","loginBarFriend","loginBarInbox"]);

				//初始化昵称下拉面板
				this.initNicknamePanel();

				//初始化新的消息下来面板
				this.initNewInboxPanel();

				//初始化活动面板
				this.initActivityPanel();

				//初始化邮件提醒(请求邮箱接口，判断email字段是否为空，为空的话，没有开通新浪邮箱)
				
				var that = this;
		        Utils.Io.JsLoad.request("http://service.mail.sina.com.cn/mailproxy/mail.php", {
		            onComplete: function(){
		               var email = sinamailinfo.email;
		               if(email != ""){
		               		that.initMailRemind();
		               }
		            },
		            onException: function(){}
		        });

				

				// 初始化
				this.initMsnLogout();
				
				//为msn搬家用户 显示用户功能向导提示
				if(scope && scope.$private && scope.$private.msnfeed){
					var _this=this;
					setTimeout(function(){_this.displayUserGuideTips();},1000);
				}
				break;
				
			/*未登录状态下的托盘*/
			case "logout":  
				this.trayLogin = new Lib.Login.Ui();
				//先写在这里 吧 防止二次渲染 对吧！！！！
				if($E("phprender")===null){
					this.render(scope.trayPlusTemplayLogout);
					trace("-----------js渲染---------");
				}else{
					trace("-----------php渲染---------");
				}
				
				
				//初始化升级功能
				//this._initLevelUp();
				
				//初始化登录
				this.initLogin();
				
				//初始化推广位
				this.initPopularize();

				break;
			
			/*曾经登录过的情况*/
			case "oncelogedon":
				
				this.trayLogin = new Lib.Login.Ui();
				this.render(scope.trayPlusTemplayOnceLoged);
				this.setNodesMouseHoverStyle(["loginBarOptApp","loginBarMail","loginBarCenter","loginBarFriend","loginBarInbox"]);
				
				// var onceloggedonblog = unescape(Utils.Cookie.getCookie("onceloggedonblog"));
				var info = Lib.Login.info();
				// console.log(info);
				var uid = info && info.uid;		
				$E("loginBarAppMenuLabel").innerHTML = info && info.nick;
				
				//初始化推广位
				this.initPopularize();
				
				this.initOnceLogedEvent(["loginBarOptApp","loginBarMail","loginBarCenter","loginBarFriend","loginBarInbox"], uid);
				
				this.initOnceLogedTips(uid);
				
				this.initStatic();
				break;
		}
		
		//初始化发博文下拉面板
		this.initAddArticlePanel();
		
		//初始化搜索选项下拉面板
		this.initSearchPanel();
		
		//初始化 影视搜索 推广
		this.initFilmSearch();

	},
    
    displayUserGuideTips: function(){
    
        //判断当前页是否是个人中心页
        //如果是个人中心  不弹出提示
        if (!window.scope || scope.$pageid === "profile_index") {
            //访问个人中心设置cookie标识已访问过
            Utils.Cookie.setCookie($UID + "alreadyVisitProfileIndex", "true", "86400", "/", ".sina.com.cn");
            return;
        }
        
        var _this = this;
 
        function updateTipPos(){
            var loginBarCenter = $E("loginBarCenter");
            if (loginBarCenter) {
                var pos = Core.Dom.getXY(loginBarCenter), left = pos[0] + loginBarCenter.offsetWidth / 2 - _this.tipsUserGuide.offsetWidth / 2 + "px", top = pos[1] + loginBarCenter.offsetHeight + 10 + "px";
            }
            _this.tipsUserGuide.style.left = left;
            _this.tipsUserGuide.style.top = top;
        }
        
    },
    /**
     * 初始化消息系统通知接口统计
     */
    initStatic : function(){
        if (!this._commetTimer) {
            var send = function(){
                var uid = scope.$uid;
                var blogid = scope.$articleid || '';
                var url = 'http://comet.blog.sina.com.cn/api?maintype=notice';
                Utils.Io.JsLoad.request(url, {
                    GET : {
                        uid : uid || '',
                        blogid : blogid
                    },
                    onComplete  : function(r){
                    }
                });
            };
            this._commetTimer = setInterval(send, 30 * 1000);
            setTimeout(function(){
                send();
            }, 15);
        }
    },
	/**
	 * 显示用户功能向导提示
	 */
	initFilmSearch:function(){
		var ele=$E("loginBarSearchInput");
		ele && (ele.value="");
		
		var tag=$E("loginBarSearchSType");
		tag && (tag.value="title");
	},
	/**
	 * 呈现托盘内容
	 * @param {String} html
	 */
	render:function(html){
		$E("trayContainer").innerHTML=html;
	},
	
	/**
	 * 初始化登录
	 */
	initLogin:function(){
		var me=this;
		var homeNode = Core.Dom.getElementsByClass($E("trayContainer"), 'span', 'link')[0];
		homeNode.onclick = function(){
			v7sendLog('40_01_15');
		};
		
		Core.Events.addEvent($E("linkTrayLogin"),function(){
			v7sendLog('40_01_16');
			
			if (typeof sinaSSOController != 'undefined') sinaSSOController.loginExtraQuery = {}; 
			me.trayLogin.login(function(){
				
				
				//登录统计,01非博主页面登录,02博主页面登录
				Lib.checkAuthor();
				var str= $UID==scope.$uid?"02":"01";
				v7sendLog("87_01_"+str+"_"+$UID,scope.$pageid);
				setTimeout(function(){
					window.location = window.location.toString().replace(/#.*/, "");
				},100);
				
			},false,"referer:"+location.hostname+location.pathname+",func:0007");	//添加统计点，托盘，0007
			
		},"click");
		
		//配置"注册"链接地址
		$E("linkReg").href = "http://login.sina.com.cn/signup/signupmail.php?entry=blog&srcuid="+scope.$uid+"&src=blogicp";
		$E("linkReg").onclick = function(){
			v7sendLog('40_01_17');
		};
		if(scope.$channel) {
			if(scope.$channel == 2) {
				$E("linkReg").href = "http://login.sina.com.cn/signup/signupmail.php?entry=blog&srcuid="+scope.$uid+"&src=baby";
			}
		}
	},
	
	/**
	 * 初始化推广位
	 */
	initPopularize:function(){
        var popEl = $E("divPopularize");
		if( popEl ){
            this.hideActiLink(popEl);
			this._loadPopularizeData(popEl);		
		}			
	},
    // 从后台加载推广位的数据
    _loadPopularizeData:function(parentEl){
        Utils.Io.JsLoad.request("http://blog.sina.com.cn/lm/iframe/283/2012/0705/1.js", {
            charset:"utf-8",
            onComplete:function(data){
                //debugger;
                var cfg = $_GLOBAL.popularizeConfig;
                if (!cfg || parentEl.innerHTML){
                    return;
                }
                var len = cfg.length;
                var cookieUtil = Utils.Cookie;
                var index = parseInt(cookieUtil.getCookie("blogPopularizeIndex") || 0);
                if (len <= index)
                {
                    index = 0;
                }
                cookieUtil.setCookie("blogPopularizeIndex", 1+index, 24, "/", ".blog.sina.com.cn");
                parentEl.innerHTML = cfg[index];
                //如果有错误公告，则需要调整这个长度
                if($E('err_i8t9c')){
                    var txt = parentEl.innerText||parentEl.textContent||'';
                    if(txt.length>10){
                        parentEl.children[0].innerHTML = txt.substr(0,9)+'...';
                    }
                }
            }
        });
    },
	/**
	 * 设置节点的鼠标悬停样式
	 * @param {Array} nodeNames 节点名称数组
	 */
	setNodesMouseHoverStyle:function(nodeNames){
		var i,len=nodeNames.length;
		for (i = 0; i < len; i++) {
			Core.Events.addEvent($E(nodeNames[i]), (function(idx){
				return function(){
					Core.Dom.removeClassName($E(nodeNames[idx]),'current');					
					$E(nodeNames[idx]).className += " current";
				};
			})(i), "mouseover");
			
			Core.Events.addEvent($E(nodeNames[i]), (function(idx){
				return function(){
					Core.Dom.removeClassName($E(nodeNames[idx]),'current');	
					//$E(nodeNames[idx]).className = "link";
				};
			})(i), "mouseout");
		}

		$E("loginBarCenter").onclick = function(){
			v7sendLog('40_01_05_'+$UID);	
		};
		$E("loginBarFriend").onclick = function(){
			v7sendLog('40_01_06_'+$UID);	
		};
		$E("logOut").onclick = function(){
			v7sendLog('40_01_11_'+$UID);	
		};
		
	},
	
	/**
	 * 初始化昵称下拉面板
	 */
	initNicknamePanel:function(){
		var nicknamePanel=new scope.NicknamePanel();
		Lib.checkAuthor();

		nicknamePanel.initUserInfo($UID);
		
		this.addSubPanel(nicknamePanel, $E("loginBarOptApp"), -98, -9);


		//如果是MSN登录的，渲染一个图标上去。
		var me = this;
		if (Utils.Cookie.getCookie("loginFromMsn") && !$E('msnLoginIcon')){
			//这只是一个占位符
			var holder = $C('img');
			holder.src = 'http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif';
			holder.style.cssFloat = holder.style.styleFloat = 'left'; 
			holder.width = '18';
			holder.height = '0';
			holder.style.padding = '9px 0';
			holder.align = 'absmiddle';
			Core.Dom.insertAfter(holder, $E('loginBarAppMenuLabel'));
			trace('创建msn icon');
			createLinkMask(holder); //创建蒙版响应用户点击
		}else{
			trace('不渲染msn icon');
		}

		//由于span mousedown之后会触发stopEvent，内部的click不能被触发，用蒙版代替之。无奈。
		function createLinkMask(holder){
			var mask = $C('a');
			var span = holder.parentNode;
			var container = span.parentNode;
			var node = $C('img');
			container.style.position = 'relative';
			span.style.position = 'relative';
			node.id = 'msnLoginIcon';
			node.className = 'SG_icon SG_icon136';
			node.src = 'http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif';
			node.style.width = '18px';
			node.style.height = '18px';
			node.align = 'absmiddle';
			mask.appendChild(node);
			mask.href = 'http://control.blog.sina.com.cn/blogprofile/msnbind.php?c=' + +new Date();
			mask.target = '_blank';
			mask.style.cssText = 'display:block; width:18px; height:18px; position:absolute; z-index:1024;';
			mask.style.paddingTop = '4px';
			mask.title = 'MSN账号登录';
			container.insertBefore(mask, container.childNodes[0]);
			Core.Events.addEvent(window, relocation, 'resize');
			trace('创建msn icon mask');
			relocation();
			function relocation(){
				//modified xiaoyue3 msn图标渲染位置不对，应该昵称出现之后去渲染位置，
				var  timer = setInterval(function(){
					var adminName =  $E("loginBarAppMenuLabel").innerHTML;
					if(adminName !== "读取中..."){
						var strLeft = holder.offsetLeft + 'px';
						mask.style.left = strLeft;
						trace('刷新msn icon mask');
						clearInterval(timer);	
					}
				},300);
			}
			scope.$msnRelocation = relocation;
		}
	},

	/**
	 * 初始化发博文下拉面板
	 */
	initAddArticlePanel:function(){
		var addArticlePanel=new scope.addArticlePanel();
		this.addSubPanel(addArticlePanel, $E("arrowAddArticle"), -81, 0);
		
		// 发博文下拉箭头
		$E("arrowAddArticle").onclick = function(){
			v7sendLog('40_01_13_'+($UID?$UID:''));
		};
		
		//发博文布码
		$E("arrowAddArticle").parentNode.children[0].onclick = function(){
			v7sendLog('40_01_12_'+($UID?$UID:''));
		};
	},
	/**
     * 显示发商品链接
     */
    showPublishWare:function(data){
        if (data["tbh_status"] && parseInt(data["tbh_status"], 10)) {
            $E("tray_tbh_ware_linedot").style.display = "";
            var publishBtn = $E("tray_tbh_ware_link");
            publishBtn.style.display = "";
            try{
                // 变态需求，在博文编辑页托盘点击“发商品”不新开页面
                var link = $T(publishBtn,"a")[0];
                
                if (scope && "editor" == scope.$pageid) {
                    link.href = "javascript:;";
                    link.target = "";
                    link.onclick = function(){
                        // 模拟点击插件中的发商品按钮
                        var plugin = $E("shortcut_content");
                        var imgs = $T(plugin,"img");
                        for (var i = 0; i < imgs.length; i++) {
                            if (-1 != imgs[i].src.indexOf("element_shop")) {
                                Core.Events.click(imgs[i]);
                            }
                        }
                    };
                }
                link = null;
                publishBtn = null;
            } catch(e) {
            }
        }
        
        Lib.Listener.off({
            name     : "tray-data-loaded",
            callBack : this.showPublishWare,
            scope    : this
        });
    },
	/**
	 * 初始化搜索选项下拉面板
	 */
	initSearchPanel:function(){
        
		var searchPanel=new scope.SearchPanel();

		this.addSubPanel(searchPanel, $E("searchSelect"), -54, -4);
		
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
		
		$E("searchSelect").onclick = function(){
			v7sendLog('40_01_18');
		}
		var searchNode = Core.Dom.getElementsByClass($E("loginBarSearchForm"), 'input', 'topbar_searchBtn')[0];
		searchNode.onclick = function(){
			v7sendLog('40_01_20');
		}
		
		Core.Events.addEvent($E("loginBarSearchInput"),function(e){
			var c = e.keyCode || e.charCode;
			if (c == 15){
				v7sendLog('40_01_20');
			}
		},'keyup');
		
		
		//将指定选项设置为当前选项
		function _setActiveOption(opt){
            var formEl = $E("loginBarSearchForm");
            formEl.action = searchPanel.config[opt]["url"];
            $E("loginBarSearchMenuLabel").innerHTML = spNodes[opt].getElementsByTagName("a")[0].innerHTML;
            
            var searchCEl    = $E("loginBarSearchC"),
                searchTEl    = $E("loginBarSearchT"),
                searchTypeEl = $E("loginBarSearchType"),
                searchSEl    = $E("loginBarSearchS"),
                searchTSEl   = $E("loginBarSearchTS"),
                searchTextEl = $E("loginBarSearchInput");
            
            switch(opt){
                case "all" : 
                case "blog" : 
                case "bauthor" : 
                    if (!searchCEl){
                        searchCEl = $C("input");
                        searchCEl.type = "hidden";
                        searchCEl.name = "c";
                        searchCEl.id = "loginBarSearchC";
                        formEl.appendChild(searchCEl);
                    }
                    //配置隐藏表单的value
                    searchCEl.value="blog";
                    searchTEl.value=searchPanel.config[opt]["range"];
                    searchTEl.name = "range";
                    searchTypeEl.value=searchPanel.config[opt]["by"];
                    searchTypeEl.name = "by";
                    searchTextEl.name = searchPanel.config[opt]["keyName"];
                    break;
                case "song" : 
                case "video" : 
                case "vauthor" : 
                    //配置隐藏表单的value
                    searchCEl && (searchCEl.value="");
                    searchTEl.value=searchPanel.config[opt]["t"];
                    searchTEl.name = "t";
                    
                    searchSEl.value=searchPanel.config[opt]["s"];
                    searchTSEl.value=searchPanel.config[opt]["ts"];
                    searchTypeEl.value=searchPanel.config[opt]["type"];
                    searchTypeEl.name = "type";
                    $E("loginBarSearchSType").value=searchPanel.config[opt]["stype"];
                    searchTextEl.name = searchPanel.config[opt]["keyName"];
                    break;
            }
		}
	},
    
	hideActiLink :function(el){
        var pageId = scope.$pageid;
        if ("pageSetM" !== pageId && "editor" !== pageId){
            el.style.display = "none";
            el.setAttribute("shouldShow", "1");
        }
        // 不管tips广告有没有出来，3秒后显示推广链接
        setTimeout(function(){
            if ((typeof BLOG_AD_TIPS == "undefined") || !BLOG_AD_TIPS){
                el.style.display = "";
                return;
            }
        }, 3000);
    },
	/**
	 * 初始化活动提示面板
	 */
	initActivityPanel:function(){
		if($_GLOBAL){
            // 托盘活动链接广告控制，如果有trayAd则此链接显示在发博文按钮前
            // 有广告时推广文字链接会改为广告的文字链
            // modified by wangqiang1@staff 2011-12-22
            var loginActLink = $E("loginBarActivity");
			if(loginActLink){
                this.hideActiLink(loginActLink);
                this._loadPopularizeData(loginActLink);
            }
		}
		if($_GLOBAL.activityBlackList && $_GLOBAL.activityBlackList[scope.$pageid]) {
			trace('【活动】当前页面在黑名单');
			return;
		}
		// 这里应该没用了, 活动由上面的内容吐出 2013-3-13 modified by gaolei
		// new scope.ActivityPanel().checkActivity();
	},
	
	/**
	 * 初始化 MSN 和 BLOG 退出登录
	 */
	initMsnLogout: function(){
		var _tray = $E("openedBlogTray");
		var _a_list = _tray.getElementsByTagName("a");
		var _logout_a = _a_list[_a_list.length - 1];			// 最后一个 a。
		_logout_a.href = "#";
		_logout_a.onclick = function(){
			return false;
		};
		
		var _tray_noIn = $E("noOpenedBlogTray");
		var _a_list_noIn = _tray_noIn.getElementsByTagName("a");
		var _logout_a_noIn = _a_list_noIn[_a_list_noIn.length - 1];			// 最后一个 a。
		_logout_a_noIn.href = "#";
		_logout_a_noIn.onclick = function(){
			return false;
		};
		
		var _curHref = encodeURIComponent(window.location.href);
		
		if(_tray)		Core.Events.addEvent(_logout_a, logoutMsnAndBlog);
		if(_tray_noIn)	Core.Events.addEvent(_logout_a_noIn, logoutMsnAndBlog);
		
		// logout blog，无论返回什么，都必须退出博客。
		function logoutMsnAndBlog(){
			new Interface("http://control.blog.sina.com.cn/blog_rebuild/msn/api/msnLoginOut.php", "jsload").request({
				onSuccess:function(res){
					window.location.href = "http://login.sina.com.cn/cgi/login/logout.php?r="+_curHref;
				},
				onError:function(res){
					window.location.href = "http://login.sina.com.cn/cgi/login/logout.php?r="+_curHref;
				},
				onFail:function(res){
					window.location.href = "http://login.sina.com.cn/cgi/login/logout.php?r="+_curHref;
				}
			});
		}
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
			if(dom === $E("loginBarOptApp")){
				v7sendLog('40_01_01_'+$UID);
			}
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
	},
	/**
	 * 初始化消息下拉面板
	 */
	initNewInboxPanel:function(){		
		var newInboxPanel=new scope.NewInboxPanel();
		this.addSubPanel(newInboxPanel, $E("loginBarInbox"), -137, -9);		
		try{				
				if(!$E("ccnotepiaohong"))
				{
					var di = $C('div');
					di.className="imforbox";
					di.style.display="none";
					di.id="ccnotepiaohong";
					$E("loginBarInbox").appendChild(di);									 
				}
				$E("loginBarInbox").className ="link imfor";
				/**
				Core.Events.addEvent($E("loginBarInbox"),function(){
					$E("ccnotepiaohong").style.display = "none";
				},'click');
				**/
			}catch(e){}
		//显示用户昵称
		newInboxPanel.onMessageLoad=function(nickname){			
			$E("loginBarAppMenuLabel").innerHTML= nickname;		
			$E("noOpenBlogName").innerHTML=Core.System.htmlFilter(nickname);		
		};
	},
	/**
	 * 初始化邮件提醒
	 */
	initMailRemind: function(){
		if($E("loginBarMail") && $E("line")){
			$E("loginBarMail").style.display = "";
			$E("line").style.display = "";
		}
		
		function remindEmail(){
			var mailInter = new Interface("http://interface.blog.sina.com.cn/riaapi/profile/unreadmail.php", "jsload");
	        mailInter.request({
	            onSuccess: function(data){
                    var tota = parseInt(data,10);
                    if (tota > 99) {
                        tota='99+';
                    }
                    
                    if (tota !== 0 && $E("mailpiaohong")) {
                    	var num = $E("mailpiaohong");
                    	num.style.display="";
                    	num.innerHTML = tota;
                    }else{
                    	$E("mailpiaohong").style.display="none";
                    }
	            },
	            onError: function(){$E("mailpiaohong").style.display="none"}
	        });
		}
		remindEmail();
		var remind = setInterval(remindEmail,5*60*1000);

		Core.Events.addEvent($E("loginBarMail"),function(){
			v7sendLog('40_01_07_'+$UID);
            var redEl = $E("mailpiaohong");
            var isRed = !(redEl.style.display);
            if (isRed) {
                redEl.style.display = "none";
            }
		},"click");
		Core.Events.addEvent($E("mailpiaohong"),function(){
            var redEl = $E("mailpiaohong");
            redEl.style.display = "none";
			window.open("http://mail.sina.com.cn/?s=2");	
		},"click");
	},
	
	/*
	 *	促登陆项目——给促登陆托盘的按钮增加登录事件 
	 */
	initOnceLogedEvent: function(nodeNames, uid){
		var i,len=nodeNames.length;
		var me=this;
		for (i = 0; i < len; i++) {// "loginBarOptApp","loginBarMail","loginBarCenter","loginBarFriend","loginBarInbox"
			$E(nodeNames[i]).onclick = function(){
				switch (this.id){
					case "loginBarOptApp": 
						v7sendLog("44_01_07_"+uid); break;
					case "loginBarMail":
						v7sendLog("44_01_08_"+uid); break;
					case "loginBarCenter":
						v7sendLog("44_01_09_"+uid); break;
					case "loginBarFriend":
						v7sendLog("44_01_10_"+uid); break;
					case "loginBarInbox":
						v7sendLog("44_01_11_"+uid); break;
				}
				if (typeof sinaSSOController != 'undefined') sinaSSOController.loginExtraQuery = {}; 
				me.trayLogin.login(function(){
					setTimeout(function(){
						window.location = window.location.toString().replace(/#.*/, "");
					},100);
				},false);	//添加统计点，托盘，0007
				return false;
			}
		}
	},
	
	/*
	 * 促登陆项目——给促登陆托盘增加新消息提示
	 */
	initOnceLogedTips: function(uid){
		var me = this;
		var messageUrl = "http://interface.blog.sina.com.cn/riaapi/profile/unread.php";
		Utils.Io.JsLoad.request(messageUrl, {
			GET:{
				uid:uid,
				product: "blog"
			},
			onComplete:function(res){
				// console.log(res);
				// if (res.data.nfn >= 1 ) {
                //显示有新动态产生
					if(scope.$pageid == 'profile_index' || scope.$pageid == 'pageSetM' || scope.$pageid == 'editor' ) {
						return;
					}
					var tip = $E('newStatusTip');
					if(!tip) {
						tip = $C('div');
						tip.id = 'newStatusTip';
						tip.className = 'tb_layer_Y tb_layer_w3';
						tip.style.width = '138px';
						tip.innerHTML = scope.onceLogedStatusTipTemplay;
						var a = $T($E('loginBarCenter'),'a')[0];
						var loc = Core.Dom.getXY(a);
						tip.style.left = (loc[0]-(138/2-a.offsetWidth/2)) + 'px';
						tip.style.top = (loc[1]+a.offsetHeight) + 'px';
						tip.style.zIndex = '510';
						tip.style.display = 'none';
						document.body.appendChild(tip);
					}
					
					// 增加判断，因为一个tip层里需要根据条件显示多种提示信息
					if (res.data.unreadnotes >=1){//未读消息数
						v7sendLog("44_01_12_"+uid);
						tip.style.display = 'block';
						$E('nstUnread').style.display = 'block';
						$E('nstUnread').onclick = function(){
							v7sendLog("44_01_13_"+uid);
							if (typeof sinaSSOController != 'undefined') sinaSSOController.loginExtraQuery = {}; 
							me.trayLogin.login(function(){
								setTimeout(function(){
									window.location = "http://i.blog.sina.com.cn/blogprofile/profilelatestnote.php";
								},100);
							},false);
							return false;
						}
					}else if(res.data.nfn >= 1){// 新动态数目 http://i.blog.sina.com.cn/
						v7sendLog("44_01_14_"+uid);
						tip.style.display = 'block';
						$E('nstFeed').style.display = 'block';
						$E('nstFeed').onclick = function(){
							v7sendLog("44_01_15_"+uid);
							if (typeof sinaSSOController != 'undefined') sinaSSOController.loginExtraQuery = {}; 
							me.trayLogin.login(function(){
								setTimeout(function(){
									window.location = "http://i.blog.sina.com.cn/blogprofile/index.php?type=3&from=newstatus&com=2";
								},100);
							},false);
							return false;
						}
					}
					Core.Events.addEvent(window,function(){
						var a = $T($E('loginBarCenter'),'a')[0];
						var loc = Core.Dom.getXY(a);
						tip.style.left = (loc[0]-(138/2-a.offsetWidth/2)) + 'px';
						tip.style.top = (loc[1]+a.offsetHeight) + 'px';
					}, "resize");
				// }
			},
			onException:function(data){
			
			}
		});
	}
};


