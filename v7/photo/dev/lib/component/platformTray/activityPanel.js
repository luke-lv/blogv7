/**
 * @fileoverview 活动提示面板
 * @author Rui Luo | luorui1@staff.sina.com.cn
 * @created 2010-08-16
 */
$import("sina/sina.js");
$import("sina/core/class/define.js");
$import("sina/core/events/addEvent.js");
$import("sina/utils/io/jsload.js");
$import("sina/core/dom/setStyle.js");
$import("sina/utils/cookie/setCookie.js");
$import("sina/utils/cookie/getCookie.js");

$import("lib/component/platformTray/templates/activityTemplate.js");
$import("lib/panel.js");
$import("lib/interface.js");
$import("lib/checkAuthor.js");

// 活动提示面板类，继承于 Panel 类
scope.ActivityPanel = Core.Class.define(function() {
	Lib.Panel.prototype.initialize.apply(this, arguments);
	this.setTemplate(scope.activityPanelTemplate);
	this.activityDataURL = 'http://sjs.sinajs.cn/blog7activity/activityJS.js';
}, Lib.Panel, {
	// 检查活动并显示活动面板
	checkActivity:function() {
		// 下线
		//return;
		
		var nodes = this.getNodes();
		var _this = this;
		// 初始化活动面板
		function init(){
			if(scope.actInited) return;
			// 如果执行了 inboxPanel 中的 unreadOk，(unread 接口的数据下线了,不用判断 unreadOk 了)
			// 且活动平台js文件准备好了，
			// 且活动站返回的数据准备好了，(已经合并到 unread 接口,不用判断 activityResponsed)
			// 则初始化活动面板。
			if(!window.activityDate){
				init.retry = typeof init.retry == 'undefined' ? 0 : (init.retry + 1);
				if(init.retry > 5 /*|| scope.activityResponsed === false*/){
					trace('【活动】加载数据异常，放弃渲染');
					return;
				}
				trace('【活动】数据没有准备好，等待并重试。'+init.retry);
				setTimeout(init, 3000);
				return;
			}
			// 数据缓存到 scope 对象
			scope.activityDate = window.activityDate;
			scope.actInited = true;
			trace('【活动】初始化数据成功');
			renderPanel();
		}
		// 确定是否要显示活动面板，显示哪个活动，并排重
		function renderPanel(){
			var data = scope.activityDate;
			// var dataSite = scope.activitySiteData;		// 旧的结构
			// var dataSite = scope.unreadMsg;				// 五周年以下线，dataSite 不再产生作用
			scope.$o2j = _o2j;
			var closed = false;
			try{
				var obj = null;
				var actArr = [];
				var time = +new Date();
				var cookieType = 0;
				var rule = new Function('return ' + decodeURIComponent(Utils.Cookie.getCookie('actTips')))() || {};
				trace('【活动】get cookie:'+decodeURIComponent(Utils.Cookie.getCookie('actTips')));
				if(typeof rule != 'object'){
					rule = {};
				}
				// 筛选出时间匹配的活动
				for(var n=0,m=data.activityArr.length; n<m; n++){
					if(time<=data.activityArr[n].end*1000 && time>=data.activityArr[n].begin*1000){
						actArr.push(data.activityArr[n]);
					}
				}
				// 显示优先级较高的活动
				actArr.sort(function(a, b){ return b.begin-a.begin; });
				if(actArr.length > 0){
					obj = actArr[0];
				}
				// 没有活动要显示
				if(obj == null){
					trace('【活动】没有活动要显示。结束');
					return;
				}
				// tips排重，活动站提示优先于活动平台提示，彪哥的规则
				for (var key in obj.apps){
					if (obj.apps[key].name == 'invite_tips'){
						var objInvite = obj.apps[key];
					}
					if (obj.apps[key].name == 'tips'){
						var objTips = obj.apps[key];
					}
				}
				// 没有活动要显示
				if((+obj.id)!=7 || !isValidPage()){
					trace('id != 7 ，且pageid不对，'+scope.$pageid);
					return;
				}
				// 显示当前活动链接, 地址是写死的, 活动平台没有对应的数据, 二期再改
				// 注释掉了，让PHP端渲染
				// $E('loginBarActivity').innerHTML = '<a href="http://joy.blog.sina.com.cn/blog_5years/index.php?from=tray" target="_blank" class="topbar_Red">'+obj.title+'</a>';
				// 活动平台提示
				cookieType = 2;
				if(!_checkExpiry()) return;			// 检查当前用户是否显示。
				var __relNode = $E('trayContainer');
				_this.showWithDom(__relNode, -100, -0);
				nodes['content'].innerHTML = objTips.content;
				// _setCookie(cookieType, 24);				// 一天内不再显示
				Core.Events.addEvent(window, function(){	// 绑定resize事件
					if(!closed) _this.showWithDom(__relNode, -100, -0);
				}, 'resize');
				// 关闭浮层事件
				Core.Events.addEvent($E('actclose'), whenTipsCls,'click');
				// Core.Events.addEvent($E("baihe_baihe"), whenTipsCls,'click');
				Core.Events.addEvent($E('baihe_avatar'), whenTipsCls,'click');
				Core.Events.addEvent($E('baihe_join_btn'), onlyCls,'click');
				trace('【活动】预渲染面板成功');
				showPanel();
			}catch(e){
				trace('【活动】预渲染面板发生异常');
			}
			// 
			function whenTipsCls(){
				trace("cookie1123");
				_setCookie(cookieType, 24);
				_this.hidden();
				closed = true;
			}
			function onlyCls(){
				trace("dcw1123");
				_this.hidden();
				closed = true;
			}
			// 白名单一枚
			function isValidPage(){
				return (scope.$pageid == "index")
					|| (scope.$pageid == "indexM")
					|| (scope.$pageid == "article")
					|| (scope.$pageid == "articleM");
			}
			/**
			 * 设置cookies
			 * @param cookieType 1好友邀请 0系统tips
			 * @param hours 隐藏小时数
			 */
			function _setCookie(cookieType, hours){
				rule[$UID] = {
					tipsType: cookieType,
					expiry: time + 60 *60 * 1000 * hours
				};
				Utils.Cookie.setCookie('actTips', _o2j(rule), 24 * 3, '/', '.blog.sina.com.cn');
				trace('【活动】set cookie:'+_o2j(rule));
			}
			// 检查tips是否过期
			function _checkExpiry(){
				if(rule[$UID] && rule[$UID].tipsType == cookieType){
					if(rule[$UID].expiry > time){
						trace('【活动】根据规则一段时间内不再显示。结束。type:'+cookieType);
						return false;
					}else{
						delete rule[$UID];
					}
				}
				return true;
			}
			// sina 包里没提供对象转字符串，自己写。
			function _o2j(o){
				var str = '';
				var me = arguments.callee;
				var ts = Object.prototype.toString.call(o);
				if (ts == '[object Array]'){
					str = '[';
					for(var n = 0, m = o.length; n < m; n++){
						str += me(o[n]);
						if(n+1 < m) str += ',';
					}
					str += ']';
				}else if(ts == '[object Object]'){
					str = '{';
					for(var key in o){
						str += "'"+key+"':"+me(o[key])+',';
					}
					if(str != '{'){
						str = str.slice(0,-1);
					}
					str += '}';
				}else if(ts == '[object Number]' || ts == '[object Boolean]'){
					str = o;
				}else if(ts == '[object String]'){
					str = '\''+o.replace(/\\/g, '\\\\').replace(/'/g, '\\\'').replace(/"/g, '\\\"')+'\'';
				}else{
					//str = "'"+(o+"").replace(/\\/g, '\\\\').replace(/\n/g, '').replace(/'/g, '\\\'').replace(/"/g, '\\\"')+"'";
					str = "'[unsupported]'";
				}
				return str;
			}
		}
		
		// 显示活动面板
		function showPanel(){
			try{
				var tip = _this.entity;
				var __tween;
				var __articleHref = "http://ad-apac.doubleclick.net/click;h=v2|3DAB|0|0|%2a|g;238897343;0-0;0;61876925;31-1|1;41286698|41304485|1;;%3fhttp://www.dove.com.cn/beautystory?utm_source=SinaWeibo&utm_medium=CPD&utm_term=v1&utm_content=DS16&utm_campaign=UL_Dove_Master_Band";
				// 昵称有可能取不到，嚓。
				// id='baihe_uname'		昵称
				// id='baihe_avatar'	头像
				// id="baihe_join_btn"	按钮
				// id="tips_impress"	统计
				// id="actclose"		关闭按钮
				Lib.checkAuthor();
				var __avatar = $E("baihe_avatar");
				var __userNode = $E('baihe_uname');
				var __tryTimes = 7;
				(function(){
					if(scope.nickname){
						trace("nick 找到了");
						__userNode.innerHTML = ", "+scope.nickname;
					}else if(__tryTimes--){
						trace("nick 木有，重试ing，第"+(7-__tryTimes)+"次");
						setTimeout(arguments.callee, 400);
					}else{
						trace("nick 还是木有");
					}
				})();
				// __avatar.href = "http://blog.sina.com.cn/u/"+$UID;
				// __avatar.getElementsByTagName("img")[0].src = "http://portrait"+($UID%8+1)+".sinaimg.cn/"+$UID+"/blog/50";
				__avatar.src = "http://portrait" + ($UID%8+1) + ".sinaimg.cn/" + $UID + "/blog/50";
				$E("baihe_join_btn").href = __articleHref;
				// $E("tips_impress").href = "#";
				trace('【活动】面板渲染成功');
			}catch(e){
				trace('【活动】面板渲染失败');
			}
		}
		trace('【活动】开始初始化数据');
		Utils.Io.JsLoad.request(this.activityDataURL, { GET:{'varname':'fix' } });
		init();
	}
});




