$import('sina/core/class/create.js');
$import('sina/core/dom/getChildrenByClass.js');
$import('sina/core/dom/insertHTML.js');
$import('sina/core/dom/contains.js');
$import('sina/core/dom/insertAfter.js');
$import('sina/core/events/addEvent.js');
$import('sina/core/events/removeEvent.js');
$import('sina/core/events/stopEvent.js');
$import("sina/utils/cookie/getCookie.js");
$import("sina/utils/cookie/setCookie.js");

$import('lib/lib.js');
$import('lib/apply.js');
$import('lib/register.js');
$import('lib/panel.js');
$import('lib/listener.js');
$import('lib/htmlTemplate.js');
$import('lib/util/json.js');
$import('lib/util/hoverJq.js');
$import('lib/tray/tpl/trayMenu.js');
$import('lib/tray/userMenuPanel.js');
$import('lib/tray/blogMenuPanel.js');
$import('lib/tray/searchFormPanel.js');
$import('lib/tray/loadUserInfo.js');
$import('lib/tray/msgLoader.js');
$import('lib/tray/loginOut.js');
$import('lib/tray/blogNotice.js');

$import('lib/util/getActionData.js');
//$import("lib/component/sysmsg/msgPanel.js");
$import('lib/tray/unReadMsgPanel.js');
$import('lib/tray/msgSummaryPanel.js');

$import('lib/openBlog.js');
/**
 * @fileoverview 托盘右侧面板，登录、未开通博客与非登录状态显示，单例模式
 * @author Qiangyee | wangqiang1@staff
 * @created 2013-04-12
 */
Lib.register('TrayPanel', function(lib){
    var _addEvt = Core.Events.addEvent;
    var _removeEvt = Core.Events.removeEvent;
    var _getCookie = Utils.Cookie.getCookie;
    var _contains = Core.Dom.contains;
    var JSON = lib.util.JSON;
    var byClass = Core.Dom.getChildrenByClass;
    var logoId = 'login_bar_logo_link_350';
    var _trayHolder = '______noticeTrayHolder';
    // 加载托盘的次数
    var loadCount = 0;
    var tray = null;
    var renderLogin = !1;

    var attr = function(el, attr, v){
        if (typeof v !== "string") {
            return el.getAttribute(attr);
        } else {
            el.setAttribute(attr, v);
        }
    };

    var TrayPanel = Core.Class.define(function() {

        var $topBaner = byClass(document.body, 'nsinatopbar')[0];
        var $main = this.$main = byClass($topBaner, 'ntopbar_main')[0];
        //消息飘红布玛（飘红第一次显示的时候才布码，以后显示不布玛）
        this.newTipsLog = 0;
        
        lib.Panel.prototype.initialize.call(this, {
            appendTo : $main,
            isPostion : !1,
            noIframe : !0
        });
        // 初始化发送数据消息
        lib.Listener.on({
            name     : 'tray-data-loaded',
            callBack : this.showPublishWare,
            scope    : this
        }, {
            name     : 'tray-newmsg-loaded',
            callBack : this.showNewMsgTips,
            scope    : this
        }, {
            name     : 'global-login-out',
            callBack : function(){
                clearInterval(this._msgTimer);
            },
            scope    : this
        }, {
            name     : 'tray-announce-loaed',//tray-announce-close
            callBack : function(json){
                
                var args = arguments;
                var $this = this;
                if (this.notice) {
                    this.notice.update(json);
                    return;
                }
                setTimeout(function(){
                    args.callee.call($this, json);
                }, 200);
            },
            scope    : this
        },{
            name     : 'tray-unread-panel-hide',//未读消息隐藏
            callBack : function(){
                var $trayMsg = this.getNode('trayMsg');
                var data = JSON.parse($trayMsg.getAttribute("msg-count"));
                this.showNewMsgTips(data,1);//新加来自未读消息的标志
            },
            scope    : this
        },
        {
            name     : 'tray-unread-panel-show',//未对消息显示
            callBack : function(){
                var $tips = this.getNode('newTips');
                $tips.style.display = "none";
            },
            scope    : this
        },
        {
            name     : 'tray-msg-panel-hide',//下拉消息隐藏
            callBack : function(){
                var $trayMsg = this.getNode('trayMsg');
                var data = JSON.parse($trayMsg.getAttribute("msg-count"));
                this.showNewMsgTips(data,1);
            },
            scope    : this
        },
         {
            name     : 'tray-announce-close',//tray-announce-close
            callBack : function(json){
                this.setTrayPosition();
            },
            scope    : this
        },{
            name : "topad680-show-start",
            callBack : function(data){
                this._hideActiveSub();
            },
            scope    : this
        }/*, {
            name  : 'tray-msg-click',
            callBack : function(d){
                console.log('tray-msg-click', d);
            }
        }*/);

        if (loadCount) {
            loadCount ++;
        }
        
    }, lib.Panel, {
        /**
         * 子面板
         */
        subPanels:[],
		/*
		 * 面板hover时的延时
		 */
		hoverTimeout: '',
		/* 
		 * 面板hover时的延迟时间
		 */
		hoverTime: 400,
        /**
         * 装载托盘
         * @param {String} loginState 登录状态
         *                  'login' 已登录
         *                  'logout' 未登录
         *                  'oncelogedon' 促登录，
         */
        load : function(loginState){

            // 节日logo替换，图片地址直接读取boot.js中
            // 的$_GLOBAL.platformTrayLogo对象内容，
            // 不需要每次都上线blog7lib，直接修改boot.js即可
            if (!loadCount) {
                var $logo = $E(logoId);
                if($logo && $_GLOBAL && $_GLOBAL.platformTrayLogo){
                    if (!$IE6 && $_GLOBAL.platformTrayLogo.imgForOtherBrs) {
                        $logo.children[0].src = $_GLOBAL.platformTrayLogo.imgForOtherBrs;
                    }else if($_GLOBAL.platformTrayLogo.imgForIE6){
                        $logo.children[0].src = $_GLOBAL.platformTrayLogo.imgForIE6;
                    };
                }

                this.initSearch();
            }
            

            switch(loginState){
                // 登录状态下的托盘
                case 'login':
                    if (/ipad/i.test(navigator.userAgent)) {
                        v7sendLog('48_01_02');
                    }
                    var start_time = new Date;
                    var $this = this;

                    // 读取用户信息
                    lib.tray.loadUserInfo($UID, function(info){
                        //脚印接口信息
                        scope.unreadMsg = info;
                        //info["full_nickname"] = "asdlfalsdjflaskdfjasldfjaa";
                        //info["login_wtype"] = 1;
                        //同步微博昵称后昵称改为15个中文
                        scope.nickname = info["full_nickname"]; //2013.04
                        // 加V类型
                        scope.loginUserWtype = info["login_wtype"];
                        
                        //TODO 调试完毕删除此行
                        //info.isbloguser = !1;
                        if (!$this._isRenderUser) {
                            $this.renderRight(lib.tray.tpl.loginMemu);
                            $this._isRenderUser = !0;
                        }
                        
                        
                        var $nick, $userInfo, $msnHolder;
                        
                        // 开通博客状态
                        if (info.isbloguser) {
                            var $noOpenBlog = $this.getNode('noOpenBlog');
                            $noOpenBlog.style.display = "none";
                            
                            $this.initUserMenu();
                            
                            $this.initBlogMenu(info);
                            // 消息处理，先初始化小消息面板，在加载消息
                            $this.initNewMsgEvt();
                            
                            $this.initMsg();
                            
                            $this.initMsgLoder();
                            
                            $this.initHideSub();

                            $this.initunReadMsgPanel();

                            $nick = $this.getNode('userNick');
                            $userInfo = $this.getNode('openBlog');

                        } else {

                            // 未开通博客
                            $nick = $this.getNode('ssoNick');
                            $nick.href = 'http://control.blog.sina.com.cn/myblog/htmlsource/blog_notopen.php?uid='
                                + $UID + '&version=7';

                            $this.initOpenBlog();
                            $this.initLogout();

                            $userInfo = $this.getNode('noOpenBlog');
                        }
                        $nick.innerHTML = '';
                        var $nickTxt = document.createTextNode(info.nickname);
                        $nick.appendChild($nickTxt);
                        // 显示用户信息
                        $userInfo.style.display = 'block';

                        // msn登录处理
                        var isMsnLogin = Utils.Cookie.getCookie("loginFromMsn");
                        
                        if (isMsnLogin && $nick){
                            $msnHolder = $this.getNode('msnHolder');
                            $msnHolder.style.display = 'block';
                            var $msnLink = $this.getNode('msnLink');
                            $msnLink.href += $UID;
                        }
                        if ($msnHolder) {
                            Core.Dom.insertAfter($msnHolder, $nick.parentNode);
                        }

                        $this.initNotice();
                        
                    });
                    
                    break;
                    
                // 未登录状态下的托盘
                case 'logout':  
                    if (!this.trayLogin) {
                        this.trayLogin = new lib.Login.Ui();
                        //先写在这里 吧 防止二次渲染 对吧！！！！
                        this.renderRight(lib.tray.tpl.loginOutMemu);
                    }
                    this.initLogin();
                    this.initNotice();
                    break;
                
                // 曾经登录过的情况
                case 'oncelogedon':

                    break;
            }
            
            loadCount ++;
        }

        /**
         * 初始化消息加载
         */
        ,initMsgLoder : function(){
            if (!this.msgLoader) {
                this.msgLoader = new lib.tray.MsgLoader();
            
                this.msgLoader.load($UID);
                
                var $this = this;
                this._msgTimer = setInterval(function(){
                    $this.msgLoader.load($UID);
                }, 30*1000);
            }
        }

        /**
         * 初始化登录按钮事件
         */
        ,initLogin : function(){

            var $this = this;
            var isInit = attr(this._el, 'login');
            if (!isInit) {
                attr(this._el, 'login', '1');
                _addEvt(this._el, function(evt){
                    
                    var data = lib.util.getActionData(evt, 'tray-login-btn');
                    if (!data) {
                        return;
                    }

                    if (typeof sinaSSOController != 'undefined') 
                        sinaSSOController.loginExtraQuery = {};

                    // 处理登录
                    $this.trayLogin.login(function(){
                        //登录统计,01非博主页面登录,02博主页面登录
                        Lib.checkAuthor();
                        var str= $UID==scope.$uid ? "02" : "01";
                        v7sendLog("87_01_"+str+"_"+$UID,scope.$pageid);
                        setTimeout(function(){
                            window.location = window.location.toString().replace(/#.*/, "");
                        }, 100);
                        
                    },false,"referer:"+location.hostname+location.pathname+",func:0007");   //添加统计点，托盘，0007

                },"click");
            }
        }

        /**
         * 初始化未开通博客退出按钮
         */
        ,initLogout : function(){
            var $loginOut = this.getNode('ssoLoginOut');
            var isInit = attr($loginOut, 'loginout');
            if (!isInit) {
                attr(this._el, 'login', '1');
                _addEvt($loginOut, function(){
                    lib.tray.loginOut(null, !0);
                });
            }
            $loginOut = null;
        }
        /**
         * 初始化隐藏面板
         */
        ,initHideSub : function(){
            var $this = this;
            
            // 隐藏面板
            _addEvt(document.body, function(evt){
                if (!$this._activeTab) {
                    return;
                }
                var target = evt.target || evt.srcElement;

                var panels = $this.subPanels;
                var item;

                // 检查是否点击的是下拉面板或是tab按钮
                for (var i = panels.length - 1; i >= 0; i--) {
                    item = panels[i];
                    if (item.tab === target || _contains(item.tab, target)) {
                        return;
                    }
                    if (item.panel.entity === target || _contains(item.panel.entity, target)) {
                        return;
                    }
                }
                $this._hideActiveSub();
                // var tabEl = $this._activeTab.tab;
                // var panel = $this._activeTab.panel;

                // // 清空当前显示的面板
                // $this._activeTab = null;
                // panel.hidden();
                // tabEl.className = tabEl.className
                //         .replace(/(?:[ ]*)\bcurrent\b/g,'');

            }, 'click');

            
            // 窗口重置处理，更新位置
            _addEvt(window, function(){
                var activeTab = $this._activeTab;
                if (!activeTab) {
                    return;
                }
                
                var $tabEl = activeTab.tab;
                var panel = activeTab.panel;
                var offsetLeft = activeTab.left;
                var offsetTop = activeTab.top;

                var x=Core.Dom.getLeft($tabEl) + $tabEl.offsetWidth + offsetLeft;
                var y=Core.Dom.getTop($tabEl) + $tabEl.offsetHeight + offsetTop;
                if($IE6 && this.isFixed){
                    x=x-document.documentElement.scrollLeft;
                    y=y-document.documentElement.scrollTop;
                }
                panel.setPosition(x,y);
            }, 'resize');
        }
        ,_hideActiveSub:function() {
            var $this = this;
            if($this._activeTab){
                var tabEl = $this._activeTab.tab;
                var panel = $this._activeTab.panel;
                // 清空当前显示的面板
                $this._activeTab = null;
                panel.hidden();
                tabEl.className = tabEl.className
                        .replace(/(?:[ ]*)\bcurrent\b/g,'');
            }
        }
        /**
         * 初始化用户昵称下拉面板
         */
        ,initUserMenu : function(){
            var $bindEl = this.getNode('userMenu');
            var isInit = attr($bindEl, 'init');
            if (!isInit) {
                attr($bindEl, 'init', '1');
                var $this = this;
                var hasEmail;
				var $tabEl = $this.getNode('userMenu');
				var userMenu = $this._findSub('userMenu');
				var flag = 0;
				
				Lib.util.hoverJq({
					elm : $bindEl,
					mouseenter : function(e, el, i){
						clearTimeout($this.hoverTimeout);
						if (!flag){
							flag = 1;
							var panel;
							if (!userMenu) {
								panel = new lib.tray.UserMenuPanel();
								$this.addSubPanel('userMenu', panel, $bindEl, $tabEl);
							} else {
								panel = userMenu.panel;
							}
							var $userPanelNode = panel.getNode('panel');
							panel.initUserInfo($UID);

							Lib.util.hoverJq({
								elm : $userPanelNode,
								mouseenter : function(e, el, i){
									clearTimeout($this.hoverTimeout);
									$this._showPanel('userMenu', -160, 0);
								},
								mouseleave : function(e, el, i){
									$this.hoverTimeout = setTimeout(function(){
										$this._hideActiveSub();
									}, $this.hoverTime)
								}
							});
							
							getEmail(function(hasEmail){
								if (hasEmail) {
									panel.getNode('mail').style.display = '';
								}
							});
						}
						$this._showPanel('userMenu', -160, 0);
					},
					mouseleave : function(e, el, i){
						$this.hoverTimeout = setTimeout(function(){
							$this._hideActiveSub();
						}, $this.hoverTime)
					}
				});
                
                var getEmail = function(cb){
                    if (typeof hasEmail === 'boolean') {
                        cb(hasEmail);
                    } else {
                        //初始化邮件提醒(请求邮箱接口，判断email字段是否为空，
                        //为空的话，没有开通新浪邮箱)
                        Utils.Io.JsLoad.request("http://service.mail.sina.com.cn/mailproxy/mail.php", {
                            onComplete: function(){
                                var email = sinamailinfo.email;
                                if(email != ""){
                                    hasEmail = !0;
                                } else {
                                    hasEmail = !1;
                                }
                                cb(hasEmail);
                            },
                            onException: function(){}
                        });
                    }
                }
            }
        }
        /**
         * 初始化发博文下拉面板
         */
        ,initBlogMenu : function(info){
            var $bindEl = this.getNode('addArticle');
            var isInit = attr($bindEl, 'init');
            if (!isInit) {
                attr($bindEl, 'init', '1');
                var $this = this;
				var $tabEl = $this.getNode('blogMenu');
				var flag=0;
				Lib.util.hoverJq({
					elm : $tabEl,
					mouseenter : function(e, el, i){
						clearTimeout($this.hoverTimeout);
						if (!flag){
							flag = 1;
							var blogMenu = $this._findSub('blogMenu');
							var panel;
							if (!blogMenu) {
								panel = new lib.tray.BlogMenuPanel();
								$this.addSubPanel('blogMenu', panel, $bindEl, $tabEl);
								if (info['tbh_status'] === 1) {
									panel.getNode('tbh_status').style.display = "";
								}
							}
							var $blogMenuPanel = panel.getNode('panel');
							Lib.util.hoverJq({
								elm: $blogMenuPanel,
								mouseenter: function(e, el, i){
									clearTimeout($this.hoverTimeout);
									$this._showPanel('blogMenu', -74, 0);
								},
								mouseleave: function(e, el, i){
									$this.hoverTimeout = setTimeout(function(){
										$this._hideActiveSub();
									}, $this.hoverTime)
								}
							});
						}
						$this._showPanel('blogMenu', -74, 0);
					},
					mouseleave : function(e, el, i){
						$this.hoverTimeout = setTimeout(function(){
							$this._hideActiveSub();
						}, $this.hoverTime)
					}
				});
            }
        }
        /**
         * 初始化博客公告
         */
        ,initNotice : function(){
            var productName = scope.$PRODUCT_NAME;
            var pageId = scope.$pageid;
            if ('blog7' !== productName) {
                this.noNotice = !0;
                return;
            }
            // blog7工程的各种article页面与index页面，显示博客推广告广告
            if ( -1 === pageId.indexOf('article') 
                && -1 === pageId.indexOf('index') ) {

                this.noNotice = !0;
                return;
            }

            // 检查用户是否关闭过推广告广告
            var flagUid = _getCookie('closeNotice_fzp');
            var $blogBody = $E("sinablogHead");

            Lib.checkAuthor();

            if((flagUid && flagUid === $UID) || !$blogBody){
                this.noNotice = !0;
                return;
            }

            if (!this.notice) {
                var notice = new lib.tray.BlogNotice({
                        appendTo : $E(logoId).parentNode,
                        isPostion : !1,
                        noIframe : !0
                    });
                
                this.notice = notice;

                var $this = this;

                var height = $blogBody.offsetHeight + 30;
                var logFlag;

                var onshow = function(){
                    var doc = document;
                    var scrolltop = doc.body.scrollTop 
                                + doc.documentElement.scrollTop;
                    if(scrolltop > height){
                        $this.hideActive();
                        $this.setTrayFixed();
                        if(!logFlag){
                            logFlag = 1;
                            v7sendLog('48_01_11_' + scope.$pageid);
                        }
                    } else {
                        setTimeout(function(){
                            $this.setTrayPosition();
                            notice.hide();
                        });
                    }
                };

                _addEvt(window, onshow, "scroll");

                lib.Listener.on({
                    name : 'tray-announce-close',
                    callBack : function(){
                        _removeEvt(window, onshow, "scroll");
                    }
                });
            }

        }

        /**
         * 初始化新消息点击事件
         */
        ,initNewMsgEvt : function(){
            var tpl = this.tpl;
            
            var $newTips = this.getNode('newTips');
            var isInit = attr($newTips, 'init');
            if (!isInit) {
                attr($newTips, 'init', '1');
                var $this = this;
                _addEvt($newTips, function(evt){
                    evt = evt || window.event;
                    var $target = evt.target || evt.srcElement;
                    // 阻止点击事件，防止关闭tab页签
                    Core.Events.stopEvent(evt);
                    $target.style.display = 'none';
                    $target.innerHTML='';
                    
                    // 处理新消息提醒
                    var $msgTab = $this.getNode('trayMsg');
                    Core.Events.fireEvent($msgTab, 'click');
                    //$this.notifyMsgPanel($msgTab);
                }, 'click');
                $newTips = null;
            }
        }
        /**
         * 初始化消息按钮事件
         */
        ,initMsg : function(){
            var $bindEl = this.getNode('trayMsg');
            var isInit = attr($bindEl, 'init');
            if (!isInit) {
                attr($bindEl, 'init', '1');
                var $this = this;
				var flag = 0;
				Lib.util.hoverJq({
					elm : $bindEl,
					mouseenter : function(e, el, i){
						clearTimeout($this.hoverTimeout);
						if (!flag){
							flag = 1;
							//阻止默认事件，解决ie6下请求被abort的问题
							var ev = window.event || e;
							if(ev.preventDefault){
								ev.preventDefault();
							}else{
								ev.returnValue = false;
							}
							var $bindEl = $this.getNode('trayMsg');
							var msgPanel = $this._findSub('msgPanel');
							var panel;
							if (!msgPanel) {
								// panel = new Lib.sysmsg.MsgPanel();
                                panel = new Lib.tray.msgSummaryPanel($bindEl);
								$this.addSubPanel('msgPanel', panel, $bindEl, $bindEl);
							}
							var $msgPanel = panel.getNode('panel');
							
							Lib.util.hoverJq({
								elm: $msgPanel,
								mouseenter: function(e, el, i){
									clearTimeout($this.hoverTimeout);
									$this._showPanel('msgPanel', -400, 0);
								},
								mouseleave: function(e, el, i){
									$this.hoverTimeout = setTimeout(function(){
										$this._hideActiveSub();
									}, $this.hoverTime)
								}
							});
						}
						$this._showPanel('msgPanel', -400, 0);
					},
					mouseleave : function(e, el, i){
						$this.hoverTimeout = setTimeout(function(){
							$this._hideActiveSub();
						}, $this.hoverTime)
					}
				});
            }
        }
        /**
         * 未读消息面板
         **/
        ,initunReadMsgPanel:function() {
            var $bindEl = this.getNode('trayMsg');
            var isInit = attr($bindEl, 'init-unre');
            if (!isInit) {
                attr($bindEl, 'init-unre', '1');
                new lib.tray.unReadMsgPanel($bindEl);
            }
        }
        /**
         * 初始化博文搜索
         */
        ,initSearch : function(){
            if (!loadCount) {
                var panel = new lib.tray.SearchFormPanel({
                        isPostion : !1,
                        appendTo  : 'traySearchBar',
                        noIframe  : !0
                    });
                
                panel.show();
                _addEvt(document.body, function(evt){
                    evt = evt || window.event;
                    var target = evt.target || evt.srcElement;
                    var $query = panel.getNode('queryTxt');
                    if ($query !== target && panel.entity !== target 
                        && !_contains(target, panel.entity)) {
                        panel.catePanel.hide();
                    }
                },'click');
            }
        }
        /**
         * 初始化开通博客按钮
         */
        ,initOpenBlog : function(){
            var $openblogcss = $E('openblogcss');
            if(!$openblogcss) {
                Utils.Io.loadCss({
                    id:'openblogcss',
                    url:$_GLOBAL.cssBasicURL + 'module/layer/re_nowopen.css'
                });
                var $openBlog = this.getNode('openBlogBtn');
                scope.addBlogOpenerEvent($openBlog);
            }
        }
        /**
         * 通知消息下拉面板
         */
        ,notifyMsgPanel : function($msgTab){
            var newMsg = $msgTab.getAttribute('msg-count');
            if (newMsg) {
                try {
                    newMsg = JSON.parse(newMsg);
                } catch(e) {
                    newMsg = {};
                }
            } else {
                newMsg = -1;
            }

            // lib.Listener.notify('tray-msg-click', newMsg);	未定义tray-msg-click事件  gaolei2@
            //$msgTab.setAttribute('msg-count', '');
            // this.stopTitleTips();	避免hover的时候title值被清空  gaolei2@
        }
        /**
         * 渲染右侧面板
         * @param {String} tpl 面板html
         */
        ,renderRight : function(tpl){

            this.setTemplate(tpl);
            // 设置模板将html插入托盘中
            this._el = this.entity;

            // 显示右侧面板内容，是否要动画？
            var $loading = byClass(this.$main, 'ntopbar_loading')[0];
            $loading.style.display = 'none';
            this.show();
        }

        /**
         * 添加子面板
         * @param {String} name  面板名称
         * @param {Object} panel 面板对象
         * @param {Object} bindEl 用户点击按钮绑定事件的dom节点
         * @param {Object} tabEl 面板显示时所依赖的dom节点
         * @param {Number} offsetLeft x的偏移量
         * @param {Number} offsetTop y的偏移量
         */
        ,addSubPanel:function(name, panel, bindEl, tabEl){
            var $this=this;
            this.subPanels.push({
                name  : name,
                tab   : tabEl, 
                bind  : bindEl,
                panel : panel
            });
        }


        //面板的显示
        ,_showPanel : function (name, offsetLeft, offsetTop){
            var subBar = this._findSub(name);
            if (!subBar) {
                return;
            }
            var panel = subBar.panel;
            var $tabEl = subBar.tab;

            panel.entity.style.zIndex = 512;
            // 发消息给消息下拉面板
            if ('msgPanel' === name) {
                var $newTips = this.getNode('newTips');
                this.notifyMsgPanel($tabEl);
                $newTips.style.display = 'none';
            }

            //隐藏其它子面板
            var i, item, $tab;

            // 清除当前面板激活状态
            item = this._activeTab;
            if (item) {
                $tab = item['tab'];
                if ($tab === $tabEl) { // 点击同一个tab页签就不处理了
                    return;
                }
                item['panel'].hide();
                $tab.className = $tab.className
                                .replace(/(?:[ ]*)\bcurrent\b/g,'');
            }

            // 设置点击tab
            var className = $tabEl.className;
            if (!/\bcurrent\b/.test(className)) {
                $tabEl.className += ' current'
            }

            // 设置当前激活的面板，面板消失时清空
            this._activeTab = {
                name  : name, 
                tab   : $tabEl, 
                panel : panel,
                left  : offsetLeft,
                top   : offsetTop
            };
            var $entity = panel.entity;
            if (this.isFixed && (!$IE || $IE > 6)) {
                $entity.style.position = 'fixed';
            } else {
                $entity.style.position = 'absolute';
            }

            //根据所依赖的dom显示当前面板
            panel.showWithDom($tabEl, offsetLeft, offsetTop);
        }
            
        /**
         * 查询托盘右侧子面板
         * @param {String} name  面板名称
         */
        ,_findSub : function(name){
            var item;
            for (var i = this.subPanels.length - 1; i >= 0; i--) {
                item = this.subPanels[i];
                if (name === item.name) {
                    return item;
                }
            }
            return null;
        }
        /**
         * 显示新消息提醒
         */
        ,showNewMsgTips : function(data,sign){
            // var sum = data.feed + data.mine + data.like;
			var sum = data.sum - data.feed;
            var $tips = this.getNode('newTips');
                var $trayMsg = this.getNode('trayMsg');
            if (sum) {
                // 显示消息飘红
                if($trayMsg.getAttribute("unread-show-state") == 0 && $trayMsg.getAttribute("msg-panel-show-state") == 0){//未读消息层&下拉浮层显示时不显示消息数
                    $tips.style.display = 'block';
                }
                if(scope.$pageid == "editor"){//发博文页只显示飘红
                    $tips.style.display = 'block';
                }
                var offsetWidth = this.entity.offsetWidth;
                $tips.style.left = (offsetWidth-$tips.offsetWidth-10) + 'px';
                if (sum < 10) {
                    $tips.innerHTML = sum;
                } else {
                    $tips.innerHTML = '•••';
                }
                if(!this.newTipsLog){
                     v7sendLog('40_01_49_'+$UID);
                     this.newTipsLog = 1;
                }
               
                // 设置新消息数据
                $trayMsg.setAttribute('msg-count', JSON.stringify(data));

                // 播放声音
                // this.msgLoader.play();
				
				// title显示消息数
				this.startTitleTips(sum);
            }else{
                // 设置新消息数据
                $trayMsg.setAttribute('msg-count', JSON.stringify(data));
				this.stopTitleTips();
			}
			
			// 显示个人中心飘红
			var feed = data.feed;
			if (feed){
				var $feed = this.getNode('newFeed');
				$feed.style.display = 'block';
				var offsetWidth = this.entity.offsetWidth;
				$feed.style.left = (offsetWidth-$feed.offsetWidth-197)+'px';
				feed = (feed < 10) ? feed : '•••';
				$feed.innerHTML = feed;
				
				if (!$feed.addEvt){
					$feed.addEvt = 1;
					_addEvt($feed, function(){
						location.href = 'http://i.blog.sina.com.cn/blogprofile/index.php?com=1';
						$feed.style.display = 'none';
						$feed.innerHTML = '';
					});
				}
			}
			
        }
        /**
         * 停止新消息提醒
         */
        ,stopTitleTips : function(){
            if(scope.$pageid == "editor"){
                return;
            }
			var title = document.title.replace(/\(\d+\+*\)/, '')
			document.title = title;
            // return;
            // if (this.titleTimer) {
                // var tips = '【新消息】',
                    // doc = document;
                // doc.title = doc.title.replace(tips, '');
                // clearInterval(this.titleTimer);
                // this.titleTimer = 0;
            // }
        }
        /**
         * 开始新消息提醒
         */
        ,startTitleTips : function(sum){
            if(scope.$pageid == "editor"){
                return;
            }
			var title;
			if (sum){
				sum = (sum >= 100000) ? '99999+' : sum;
                if(/\(\d+\+*\)/.test(document.title)){
				    title = document.title.replace(/\(\d+\+*\)/, '('+sum+')');
                }else{
                    title = "("+sum+")"+document.title;
                }
			}
			document.title = title;
			
            // return;
            // if (this.titleTimer){
                // return this.titleTimer;
            // }
            
            // var tips = '【新消息】',
                // doc = document;
            
            // this.titleTimer = setInterval(function(){
                // var title = doc.title;
                // if (-1 !== title.indexOf(tips)) {
                    // doc.title = title.replace(tips, '');
                // } else {
                    // doc.title = tips + title;
                // }
                
            // }, 500);
            // return this.titleTimer;
        }
        ,hideActive : function(){
            //$this._activeTab = {name:name, tab: tabEl, panel: panel };
            var item, $tab;
            if (item = this._activeTab) {
                item['panel'].hide();
                $tab = item['tab']
                $tab.className = $tab.className
                                .replace(/(?:[ ]*)\bcurrent\b/g,'');
                this._activeTab = null;
            }
        }
        ,setTrayFixed : function () {
            var $logo = $E(logoId);
            //此处浮层显示采用渐显渐隐的方式
            this.notice.show();
            
            var $this = this;
            // ie处理
            setTimeout(function(){

                $E('traySearchBar').parentNode.style.display = 'none';
                $logo.style.display = 'none';
                var $tray = $logo.parentNode.parentNode;
                if (!$IE || $IE > 6) {
                    lib.Listener.notify('tray-scrolling-fix',{});//固定时对外发广播
                    $tray.style.position = 'fixed';
                    $tray.style.top = '0px';

                } else if ($IE === 6) {
                    // IE6通过滚动处理
                    if (!$this.__isFixie6) {
                        _addEvt(window, function(evt){
                            if (!$this.isFixed) {
                                return;
                            }
                            var oldScrollTop = document.documentElement.scrollTop;
                            setTimeout(function(){
                                var current = document.documentElement.scrollTop;
                                if (oldScrollTop === current) {
                                    $tray.style.display = 'block';
                                    $this._ie6fix(evt);
                                } else if ($this.isFixed) {
                                    $tray.style.display = 'none';
                                }
                            }, 50);
                        }, 'scroll');
                        $this.__isFixie6 = !0;
                    }
                }
                
                $tray.style.width = '100%';
                if (!$E(_trayHolder)) {
                    var height = $tray.offsetHeight;
                    var $holder = $C('div');
                    $holder.style.height = height + 'px';
                    $holder.id = _trayHolder;
                    Core.Dom.insertAfter($holder, $tray);
                }
                $this.isFixed = !0;
            });
        }

        ,_ie6fix : function(evt){
            if (this.isFixed) {
                var $logo = $E(logoId);
                var $tray = $logo.parentNode.parentNode;
                $tray.style.position = 'absolute';
                $tray.style.top = document.documentElement.scrollTop + 'px';
                var trayMsg =  this.getNode('trayMsg');
                if(trayMsg){//未登陆没有trayMsg节点
                trayMsg.style.display = "none";
                trayMsg.style.display = "";
                }
                lib.Listener.notify('tray-scrolling-fix',{});//固定时对外发广播
            }
        }

        ,setTrayPosition : function () {
            if($IE6){
                var trayMsg =  this.getNode('trayMsg');
                if(trayMsg){//未登陆没有trayMsg节点
                trayMsg.style.display = "none";
                trayMsg.style.display = "";
                }
            }
            lib.Listener.notify('tray-scrolling-nofix',{});//不固定时对外发广播
            var $logo = $E(logoId);
            var $tray = $logo.parentNode.parentNode;
            
            if ($E(_trayHolder)) {
                $tray.parentNode.removeChild($E(_trayHolder));
            }
            $tray.style.position = '';

            var $search = $E('traySearchBar');
            $search.style.position = '';
            $search.style.top = '';

            //此处浮层显示采用渐显渐隐的方式
            this.notice.hide();
            $tray.style.display = 'block';
            $logo.style.display = 'block';
            $E('traySearchBar').parentNode.style.display = 'block';
            this.isFixed = !1;
        }
    });

    Lib.tray.TrayPanel = TrayPanel;

    return function(){
        if (!tray) {
            tray = new TrayPanel();
        }
        return tray;
    };
});
