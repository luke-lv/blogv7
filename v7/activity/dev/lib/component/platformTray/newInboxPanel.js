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
$import("sina/utils/io/loadCss.js");
$import("sina/core/dom/opacity.js");
$import("sina/core/function/bind2.js");
$import("lib/listener.js");
$import("lib/interface.js");
$import("lib/component/platformTray/templates/newInboxTemplate.js");

$import("lib/panel.js");
$import("lib/checkAuthor.js");
$import("lib/LocalDB.js");

$import("lib/component/platformTray/msnTips.js");

$import("sina/core/dom/removeClassName.js");

$import("lib/sendLog.js");

/**
 * 消息下拉面板类，继承于Panel类
 */
scope.NewInboxPanel = Core.Class.define(function(){

    Lib.Panel.prototype.initialize.apply(this, arguments);
    this.setTemplate(scope.newInboxPanelTemplate);
    
    this.nodes = this.getNodes();
    
    
    //return ;
    
    var me = this;
	var t = Lib.LocalDB;
	if(/Mobile/i.test(navigator.userAgent)){
		//移动设备访问
		setTimeout(function(){
			me.requestDataInterface();
		}, 100);
	}else{
		if (!t.FlaDom) {//如果flash 还没有加载
			t._this = me;
			t.loadedFun = me.FlashLoaded;
			t.loadFlash("trayFlashConnetion");
		}else{
			//如果 其他地方先于 托盘 加载flash的话 做如下操作（手动执行 FlashLoaded 函数）
			//trace("Flash在托盘前面加载好了哦，谁干的？");
			me.FlashLoaded(me);
		}
	}
   // this.updateView("loaded");
	
	
	Core.Events.addEvent($E("loginBarInbox"),function(event){
        v7sendLog('40_01_09_'+$UID);
        var target= (event && event.target) || (window.event && window.event.srcElement);
        if(target && target.tagName && target.tagName.toLowerCase() == 'a'){
           v7sendLog('45_01_10_'+ $UID);
        }
		me._hasOverview = true;
		//隐藏飘红
		$E("ccnotepiaohong").style.display = "none";
		me.requestMsgDate();		
	},"click");
		 
    this.interfaceMessages = new Interface("http://interface.blog.sina.com.cn/riaapi/profile/unread.php", "jsload");
	
}, Lib.Panel, {

    /**
     * 模板节点
     */
    nodes: null,
    
    /**
     * flash通信对象
     */
    _connectSWF: null,
    
    /**
     * flash通信对象的通道名称
     */
    _SWFChannelName: "inboxConnection",
    
    /**
     * 消息数据接口对象
     */
    interfaceMessges: null,
    
    /**
     * 消息信息是否已经请求完
     */
    isMessageLoaded: false,
    
    /**
     * 用户服务是否已经请求完
     */
    isUICServiceLoaded: true,
    
    /**
     * 是否提示有新消息
     */
    isHaveNewMessage: false,
    
    _listData: null,
    
    /**
     * 产品ID
     */
    _productIDs: {
        "blog": 0x00000001,
        "vblog": 0x00000002,
        "group": 0x00000004,
        "photo": 0x00000008,
        "cube": 0x00000010
    },
    /**
     * 后来加的读取消息 只读一次
     * @param {Object} me
     */
    _msgIsLoad: false,
    
    /**
     * 飘红数
     */
    _newnote: 0,
    /**
     * 用户是否点击查看了消息
     */
    _hasOverview: false,
    /**
     * 判断用户服务开通接口地址
     */
    interfaceUICServiceURL: "http://uic.sinajs.cn/uic?type=service&uids=#{uids}&varname=service",
    
    /**
     * flash 加载完毕后 执行的函数
     */
    FlashLoaded: function(me){
		
        //trace("Flash加载好了哦");
        var t = Lib.LocalDB;
        var _this = me;
		//t.set("uid_" + $UID + "unread", "");
        window.$updateData = function(dataObj){
            _this.updateData(dataObj);			
        };
        Lib.checkAuthor();
        t.login($UID);
        t.setClientJsFun("$updateData");
        
        setTimeout(function(){
            _this.requestDataInterface();
			//_this.requestMsgDate();
        }, 100)
        
    },
    /**
     *
     */
    requestMsgDate: function(){
		this.updateView("loading");
		
        var me = this;
        /**
         * clearnum   需要清除消息数
         */
        var clearnum = 0;
        if (this._hasOverview) {
            clearnum = this._newnote;
            this._newnote = 0;
            this._hasOverview = false;
        }
        var inter = new Interface("http://control.blog.sina.com.cn/blog_rebuild/riaapi/profile/note/notetips.php?clearnum=" + clearnum, "jsload");
        inter.request({
            GET: {
                uid: $UID
            },
            onSuccess: function(res){
                if (typeof res.announcement != 'undefined' && res.announcement ) {
                    me.nodes['ccsysgonggao'].innerHTML = '[<strong>公告</strong>]&nbsp;<a href="http://control.blog.sina.com.cn/blog_rebuild/profile/controllers/notelist.php?action=profilesysnote">' + res.announcement + "</a>";
                    me.nodes['ccsysgonggao'].parentNode.style.display = "";
                }
                else {
                    me.nodes['ccsysgonggao'].parentNode.style.display = "none";
                }
                
                if (typeof res.sysNote != 'undefined' && res.sysNote) {
                    me.nodes['ccsystongzhi'].innerHTML = '[<strong>通知</strong>]&nbsp;<a href="http://control.blog.sina.com.cn/blog_rebuild/profile/controllers/notelist.php?action=profilesysnote">' + res.sysNote + "</a>";
                    me.nodes['ccsystongzhi'].parentNode.style.display = "";
                }
                else {
                    me.nodes['ccsystongzhi'].parentNode.style.display = "none";
                }
				if(typeof res.sysNote == 'undefined' && typeof res.announcement == 'undefined' )
				{
					 me.nodes['ccsystongzhi'].parentNode.parentNode.style.display = "none";
				}else
				{
					 me.nodes['ccsystongzhi'].parentNode.parentNode.style.display = "";
				}
				me.nodes['nomsgli'].style.display = "";
                if (typeof res.notice != 'undefined' && res.notice) {
                    var aNotice = res.notice;
					
					while(me.nodes['changebgli2'].childNodes.length>2)
					{
						me.nodes['changebgli2'].removeChild(me.nodes['changebgli2'].childNodes[me.nodes['changebgli2'].childNodes.length-3]);
					}					
                    for (var i = aNotice.length - 1; i >= 0; i--) {
                        var li = $C("li");
                        li.innerHTML = aNotice[i].data;
                        li._href = aNotice[i].url;
                        me.nodes['changebgli2'].insertBefore(li, me.nodes['changebgli2'].firstChild);
                        li.onclick = function(){
                            v7sendLog('45_01_11_'+ $UID); 
                            window.location.href = this._href;
                        }
                        me.nodes['nomsgli'].style.display = "none";
                    }					
                }
						
              if(parseInt($E("ccnotepiaohong").innerHTML,10) > 0)
			  {			  	
			   	var num = parseInt($E("ccnotepiaohong").innerHTML,10);
                var cn = me.nodes['changebgli2'].childNodes;
                for (var j = 0; (j < cn.length-2 && j < num); j++) {
                    Core.Dom.removeClassName(cn[j], "cur");
                    cn[j].className += " cur";
                }			   
			  }
              
                me.updateView("loaded");
				 me._msgIsLoad = true;
               // me.requestDataInterface();
                me.bindliEvent();
            },
            onError: function(data){
               /**
			    setTimeout(function(){
                    me.requestMsgDate();
                }, 5000);
                **/
            },
            onFail: function(){
				/**
                setTimeout(function(){
                    me.requestMsgDate();
                }, 5000);
                **/
            }
        });

        //liming9-2012年6月18日 添加邮箱未读数
        var mailInter = new Interface("http://control.blog.sina.com.cn/blog_rebuild/riaapi/profile/note/unreadmail.php", "jsload");
        mailInter.request({
            onSuccess: function(data){
                var tota = parseInt(data) || 0;
                if(tota>99){tota='99+';}
                me.nodes.mailCount.innerHTML = tota || '';
            },
            onError: function(){me.nodes.mailCount.innerHTML=''}
        });

		/**
		setTimeout(function(){
			me.requestMsgDate();
		},60000*3); 
		**/
    },
    /**
     * 请求消息数据接口
     */
    requestDataInterface: function(){
        var _this = this;
        //this.updateView("loading");
        Lib.checkAuthor();
        
        var t = Lib.LocalDB;
        var d = null;
        if (t.isFlashReady && !this.checkCache) {
            //flash 加载完毕 并且  是第一次登录 ，，，尝试缓存
            this.clearCache();// 特殊页面 先清空 特殊的缓存			
            d = t.get("uid_" + $UID + "unread", 60 * 1000 * 4);			
            this.checkCache = true;
        }
        //_this._msgIsLoad=false;
        var unreadOk = function(data,isCache){
            if (!d&&!isCache) {
                t.set("uid_" + $UID + "unread", data);
                //_this._msgIsLoad=true;
            }
            //读取后加的消息接口		------------start
			/**
            if (!_this._msgIsLoad && $UID) {
                _this.requestMsgDate();
                return;
            }
            **/
            //读取后加的消息接口		------------end
			
			if(data["isBindToMsn"]==0 && Utils.Cookie.getCookie("noMoreMsnTips" + $UID) != 1){//
				//非绑定用户 以及 没有点击 不在显示 按钮
				//msnTip下线 by Random 2010-12-22
				//_this.initMsnTips();
			}			
            _this.isMessageLoaded = true;
            _this.onMessageLoad(data["nickname"]);
            _this._listData = data;
            scope.unreadMsg = data;
            //同步微博昵称后昵称改为15个中文
            scope.nickname = data["full_nickname"]; //2010.02
            // 加V类型
            scope.loginUserWtype = data["login_wtype"];

            if (data.svr_time) 
                scope.$svr_time = data.svr_time; //2010.05
            // 增加remind标识有博文被转载/收藏
            //trace('tipremind:加载到这里'+ data.remind);
            //if (data.nfn == 1 || data.remind == 1) {
			if (data.nfn >= 1 ) {
                //显示有新动态产生
                v7sendLog("40_01_03_"+$UID);
                _this.initNewStatusTip(data);
            }
            else {
                /**
                 var tip = $E('newStatusTip');
                 if(tip) {
                 tip.style.display = 'none';
                 }
                 **/
            }
            _this.updateListData(data);
            
            //消息载入完成后触发onLoaded事件
            if (_this.isMessageLoaded) {
                _this.updateData({
                    data: _this._listData
                });
                _this.onLoaded();
            }
            
            scope.hasOpenBlog = data.isbloguser == 1 ? 'open' : 'no';
            //trace('~~~~~~~~~~~~~~~~~~~'+scope.hasOpenBlog);
            scope.bindTrayOpenTime = 1;
            
            Lib.Listener.notify("tray-data-loaded", data);

            if (scope.hasOpenBlog == 'no' && scope.bindTrayOpenTime == 1) {
				if(!$E('openblogcss')) {
					Utils.Io.loadCss({
						id:'openblogcss',
						url:$_GLOBAL.cssBasicURL + 'module/layer/re_nowopen.css'
					});
				}
                $E('openedBlogTray').style.display = 'none';
                $E('noOpenedBlogTray').style.display = '';
                $E('outOfOpenBlogTray').style.display = '';
				scope.addBlogOpenerEvent($E('openBlogBtnTray'));
				/*---deleted by wangqiang/7314, 这个点击事件的处理在openBlog.js中实现
                $E('openBlogBtnTray').onclick = function(){
					scope.addBlogOpenerEvent
                    scope.blogOpener.showDialog(function(){
						//清除flash cookie存储的unread缓存
						//Lib.LocalDB前边已经加载
						Lib.LocalDB.clearCache(1,"uid_"+$UID+"unread");
						
                        if (scope.$pageid == 'fakeIndex') {
							window.location.href='http://blog.sina.com.cn/u/'+$UID;
							return;
                        }
						
						//开通成功 移除问卷调查连接---2011-04-06/wangqiang/7314|下线
						if($E("loginBarActivity") && $E("_questionnaire")){
							$E("loginBarActivity").removeChild($E("_questionnaire"));
						}
						
						$E('openedBlogTray').style.display = '';
                        $E('noOpenedBlogTray').style.display = 'none';
                        $E('outOfOpenBlogTray').style.display = 'none';
						
						//浮层中开通成功 弹出对话框提示开通成功
						var alertConf = {
							subText : ['<div class="CP_w_cnt SG_txtb">欢迎您在新浪博客安家！除了写博客，看博客外，您还可以进入个人中心完善您的个人资料，更有很多有趣的应用等着您哦。</div>'
								, '<ul class="CP_w_part CP_w_aLine">'
									, '<li><a href="http://control.blog.sina.com.cn/blogprofile/index.php" onclick="winDialog.getDialog(\'unregister\').hidden();" target="_blank">到博客个人中心&gt;&gt;</a></li>'
								, '</ul>'].join(""),
							icon:	"03",
							width:	300
						};
						winDialog.alert("开通博客成功",alertConf,"unregister");
						
                    }, true);
                }*/
                $E('noOpenBlogName').href = "http://blog.sina.com.cn/u/" + $UID;
                scope.bindTrayOpenTime = 2;
				
				//未开通博客用户添加问卷调查---2011-04-06/wangqiang/7314|下线
				/*if($E("loginBarActivity")){
					$E("loginBarActivity").innerHTML +='&nbsp;&nbsp;&nbsp;&nbsp;<a id="_questionnaire" href="http://survey.news.sina.com.cn/survey.php?id=55103" class="topbar_Red" target="_blank" >新浪博客用户调查</a>';
				}*/
            }
            //活动面板依据该标记决定何时渲染
            scope.unreadOkExecuted = true;
        }
		//trace(d);
        if (d) {
            unreadOk(d,true);
            trace("-------unread 使用缓存的数据!!!----");
        }
        else {
            trace("-----直接调用unread接口！！！");
            this.interfaceMessages.request({
                GET: {
                    uid: $UID,
                    product: "blog"
                },
                onSuccess: unreadOk,
                onError: function(data){
                },
                onFail: function(){
                }
            });
        }
        
    },
    clearCache: function(){
        var pageId = {
            "profile_notice": "notice",
            "profile_paperlist": "message",
            "profile_invitelist": "invite",
            "profile_commlist": "blogcomment",
            "profile_replylist": "blogrecomment",
            "profile_guestBookM": "gbook",
            "profile_commtrash": "trashcomment",
            "profile_commphotolist": "photocomment",
            "profile_index": "profile_index",
            "profile_remind": "profile_remind"
        };
        var t = Lib.LocalDB;
        var d = t.get("uid_" + $UID + "unread", 60 * 1000 * 4);
        if (d && pageId[scope.$pageid] && typeof(d[pageId[scope.$pageid]]) != undefined) {
            trace("-----清除缓存");
            //d[pageId[scope.$pageid]]=0;
            //t.set("uid_"+$UID+"unread",d);
            t.clearCache(10, "uid_" + $UID + "unread");
            
        }
        
        //如果在活动站进行了操作, 则清空缓存获取最新数据
        var ccn = $UID + '_clear_flash';
        var clearFlash = Utils.Cookie.getCookie(ccn);
        if (clearFlash == 1) {
            trace("【活动】根据cookie标记,清除Flash缓存");
           	t.clearCache(10, "uid_" + $UID + "unread");
            Utils.Cookie.setCookie(ccn, '', 0, '/', '.sina.com.cn');
        }
        
        //如果 是pageId等于 以上的pagid 清除缓存
        /*if(pageId[scope.$pageid]){
         t.clearCache(10,"uid_"+scope.$uid+"unread");
         //trace("清除缓存！"+"uid_"+scope.$uid+"unread");
         
         }*/
    },
	/**
	 * 初始化msnTips
	 */
	initMsnTips:function(){
		Lib.checkAuthor();
		new scope.msnTips().initUserInfo($nick, $UID);
	},
    /**
     * 显示新动态产生提示
     */
    initNewStatusTip: function(data){
        //return;
        
         if(scope.$pageid == 'profile_index' || scope.$pageid == 'pageSetM' || scope.$pageid == 'editor' ) {
         return;
         }
         var tip = $E('newStatusTip');
         if(tip || !data) {
         return;
         }
         v7sendLog('45_01_07_'+ $UID);
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
         if(data.nfn >= 1){
             $E('nstFeed').style.display = 'block';
             $E('nstFeed').onclick = function(){
                v7sendLog('45_01_09_'+ $UID);
                v7sendLog('40_01_04_'+ $UID);
             }
         }
		 if(data.official_blog == 1) {
			$E('gbimg').style.display = '';
			$E('gbmsg').style.display = '';
		 }
         //if(data.remind == 1) $E('nstFavorite').style.display = 'block';
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
		 $E('gbmsg').style.target = '_blank';
         //$E('nstFavorite').parentNode.target = '_blank';
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
    closeTip: function(ele){
        return function(){
            $E('newStatusTip').style.display = 'none';
            ele.href = ele.href.split('?')[0];
        }
    },
    
    /**
     * 实时更新数据(间隔为1分钟)，Server端会向Client端同步数据
     * @param {Object} dataObj
     */
    updateData: function(dataObj){
        var t = Lib.LocalDB;
        var _this = this;
        //_this.updateView("loaded");
        Lib.checkAuthor();
        try {
            if (($UID && $UID == dataObj.uid) || t.getServer() == true) {
                _this.isHaveNewMessage = false;
                _this.isMessageLoaded = false;
                //				trace("获取数据啦，更新");
                _this.updateListData(dataObj.data);
                if(_this._newnote > 0){
                    v7sendLog('45_01_08_'+ $UID);
                    v7sendLog('40_01_08_'+ $UID); 
                }
                if (dataObj.data.nfn >= 1) {
                    _this.initNewStatusTip();
                }
                
            }
        } 
        catch (ex) {
        }
        
        //新的 发送信息 方式
        if (t.getServer() == true) {//trace("向client发送数据ing……");
            Lib.checkAuthor();
            t.sendToClient({
                "data": dataObj.data,
                "uid": $UID
            });
            setTimeout(function(){ //trace("轮询中ing………………");	
                _this.requestUICService();
                _this.requestDataInterface();
            }, 60000 * 4);
            
        }
        else {
            //trace("client 随时准备成为 server 调用接口");
            setTimeout(function(){
                if (t.getServer()) {
                    //trace("本页面已从client--》sever啦");
                    t.setClientJsFun("$updateData");
                    _this.requestUICService();
                    _this.requestDataInterface();
                }
            }, 60000 * 4);
            
        }
        //trace(dataObj["msg"]+"%%%%%%%%%%");
    
    },
    
    /**
     * 初始化消息列表
     * @param {Object} uid 登录用户的ID
     */
    initializeList: function(){
       // this.requestMsgDate();
        this.requestUICService();
        //this.requestDataInterface();
        this.checkCache = false;
    },
    
    
    /**
     * 更新消息面板
     * @param {Object} dataCollection 数据集
     */
    updateListData: function(dataCollection){
        /**  各个标签读取的相应字段
         未读
         评论			blogcomment + blogrecomment + photocomment + trashcomment
         留言			gbook
         好友邀请		invite
         纸条			message
         邮箱
         系统消息		unreadnotices  + notice
         */
        //$E("t").innerHTML+="<br/>"+this._connectSWF.getType(this._SWFChannelName)+":"+dataCollection["invite"];
        //this.nodes["noticeCount"].innerHTML=this._getFormatCountString(dataCollection["notice"]);
        //this.nodes["inviteCount"].innerHTML= this._getFormatCountString(dataCollection["invite"]);
        //this.nodes["messageCount"].innerHTML=this._getFormatCountString(dataCollection["message"]);

        try {
            var tota = 0;
            tota += parseInt(this._getFormatCountString(dataCollection["invite"]) || 0);
			if(tota >500){tota='500+';}
            this.nodes["inviteCount"].innerHTML = tota ? tota : "";

        } 
        catch (e) {
        }
        try {
            var tota = 0;
            tota += parseInt(this._getFormatCountString(dataCollection["message"]) || 0);
			if(tota >500){tota='500+';}
            this.nodes["messageCount"].innerHTML = tota ? tota : "";
        } 
        catch (e) {
        }
        
        
        try {
            var tota = 0;
            tota += parseInt(dataCollection["unreadnotices"] || 0);
            tota += parseInt(dataCollection["notice"] || 0);
			if(tota >500){tota='500+';}
            this.nodes["sysnoticeCount"].innerHTML = tota ? tota : "";
        } 
        catch (e) {
        }
        
        Lib.checkAuthor();
        //this.nodes["guestBookCount"].innerHTML=this._getFormatCountString(dataCollection["gbook"]);
        try {
            var tota = 0;
            tota += parseInt(this._getFormatCountString(dataCollection["gbook"]) || 0);
			tota += parseInt(this._getFormatCountString(dataCollection["trashwall"]) || 0);
			if(tota >500){tota='500+';}
            this.nodes["guestBookCount"].innerHTML = tota ? tota : "";
        } 
        catch (e) {
        }
        
        //		this.nodes["guestBook"].href="http://profile.blog.sina.com.cn/wall.php?uid="+$UID;
        
        //开通相册后才显示相册数据信息
        //	this.nodes["photoCommentCount"].innerHTML = this._getFormatCountString(dataCollection["photocomment"]);
        
        //	this.nodes["vblogCommentCount"].innerHTML=this._getFormatCountString(dataCollection["vblogcomment"]);
        
        
        //开通博客后才显示评论数据信息
        try {
            var tota = 0;
            tota += parseInt(dataCollection["blogcomment"] || 0);
            tota += parseInt(dataCollection["blogrecomment"] || 0);
            tota += parseInt(dataCollection["photocomment"] || 0);
            tota += parseInt(dataCollection["trashcomment"] || 0);
			if (tota > 500) {
                tota = '500+';
            }
            this.nodes["commentRelapseCount"].innerHTML = tota ? tota : "";

        } catch (e) {
        }
        
        /**处理飘红**/
		this._newnote = parseInt(dataCollection['newnotes'], 10);
		
        if (this._newnote > 0) {
            
            //to do 更新飘红显示 
            $E("ccnotepiaohong").innerHTML =this._newnote >500?'500+': this._newnote;
            $E("ccnotepiaohong").style.display = ""; 
              
            /**   
            var num =this._newnote;
            var cn = this.nodes['changebgli2'].childNodes;
            for (var j = 0; (j < cn.length && j < num); j++) {
                Core.Dom.removeClassName(cn[j], "cur");
                cn[j].className += " cur";
            }
            **/
        } else {
			$E("ccnotepiaohong").style.display = "none";
		}
        
//        if (this._newnote > 0 || dataCollection["nfn"]) {
//            var loginBar = $E('loginBarInbox');
//            if (loginBar && !loginBar.getAttribute("bindlog")) {
//                loginBar.onclick = function(){
//                    v7sendLog('48_01_10', scope.$pageid, 'trayred');
//                    loginBar.removeAttribute("bindlog");
//                    loginBar.onclick = null;
//                    loginBar = null;
//                };
//                loginBar.setAttribute("bindlog","1")
//            }
//            if (!this.__logTime) {
//                v7sendLog("48_01_09", scope.$pageid, "trayred");
//                this.__logTime = new Date();
//            } else {
//                var time = new Date() - this.__logTime;
//                if (500 < time) {
//                    v7sendLog("48_01_09", scope.$pageid, "trayred");
//                }
//            }
//            
//        }

        //检测是否有新的消息
        var i, msgCfg = ["notice", "invite", "message", "blogcomment", "blogrecomment", "photocomment", "trashcomment", "vblogcomment", "gbook"], len = msgCfg.length;
        for (i = 0; i < len; i++) {
            if (parseInt(dataCollection[msgCfg[i]]) > 0) {
                this.isHaveNewMessage = true;
                //total += parseInt(dataCollection[msgCfg[i]]);
            }
            /**
             if(typeof dataCollection['newnotes'] != 'undefined' && dataCollection['newnotes'])
             {
             $E("ccnotepiaohong").innerHTML = dataCollection['newnotes'];
             $E("ccnotepiaohong").style.display="";
             
             var num = parseInt(dataCollection['newnotes'],10);
             var cn = this.nodes['changebgli2'].childNodes;
             for(var j=0;(j<cn.length && j<num);j++)
             {
             Core.Dom.removeClassName(cn[j],"cur");
             cn[j].className+=" cur";
             }
             }else
             {
             $E("ccnotepiaohong").style.display="none";
             }
             **/
            var k;
            for (k in dataCollection) {
                if (k != "version" && window.parseInt(dataCollection[k]) > 0) {
                    //this.isHaveNewMessage = true;
                    if ($E("left_" + k)) {
                        $E("left_" + k).innerHTML = '(' + dataCollection[k] + ')';
                    }
                }
            }
        }

    },
    
    /**
     * 请求用户开通服务
     */
    requestUICService: function(){
        Lib.checkAuthor();
        if (this.isMessageLoaded) {
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
    _getFormatCountString: function(count){
        var result = "";
        if (!isNaN(parseInt(count)) && parseInt(count) != 0) {
            if (parseInt(count) > 500) {
                result = "(<strong>500+</strong>)";
            }
            else {
                result = count;
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
    updateView: function(loadState){
        this.nodes["newInboxLoding"].style.display = loadState == "loaded" ? "none" : "";		
		if( loadState == "loading")
		{
			this.nodes["nomsgli"].style.display =  "none";		
		}
		//this.nodes["nomsgli"].style.display = loadState == "loaded" ? "" : "none";		
       // this.nodes["newInboxList"].style.display = loadState == "loaded" ? "" : "none";
    },
    
    /**
     * 信息已经全部装载完成
     */
    onLoaded: function(){
    },
    
    onMessageLoad: function(nickname){
        $E("loginBarAppMenuLabel").innerHTML = Core.System.htmlFilter(nickname);
        $E("noOpenBlogName").innerHTML = Core.System.htmlFilter(nickname);
    },
    
    /**
     绑定鼠标移过事件
     */
    bindliEvent: function(){
        var lis = this.nodes["changebgli1"].getElementsByTagName('li');
        var lis2 = this.nodes["changebgli2"].getElementsByTagName('li');
        for (var i = 0; i < lis.length; i++) {
            lis[i].style.cursor = 'pointer';
			lis[i].onmouseover =function()
			{
				 this._className = this.className;
                this.className = "on";
			}
			lis[i].onmouseout =function()
			{
				 this.className = this._className;
			}
        }
        for (var i = 0; i < lis2.length - 1; i++) {
			if(lis2[i] == this.nodes["nomsgli"]){continue;}
            lis2[i].style.cursor = 'pointer';
			lis2[i].onmouseover= function(){
				 this._className = this.className;
                this.className = "on";
			}
            lis2[i].onmouseout= function(){
                 this.className = this._className;
            }
        }

        var commentdata = $E('commentdata');
        if (commentdata) {
            Core.Events.addEvent(commentdata,function(event){
                logFunc(event);
            });
        };
        Core.Events.addEvent(this.nodes["changebgli1"],function(event){
            logFunc(event);
        });
		Core.Events.addEvent(this.nodes["changebgli2"],function(event){
            logFunc(event);
        });
        function logFunc(event){
            var target= (event && event.target) || (window.event && window.event.srcElement);
            if(target && target.tagName && (target.tagName.toLowerCase() == 'a' || target.tagName.toLowerCase() == 'li') && !target.getAttribute('reject')){
				v7sendLog('40_01_10_'+ $UID);      
                v7sendLog('45_01_11_'+ $UID);      
            }
        }
    }
});

