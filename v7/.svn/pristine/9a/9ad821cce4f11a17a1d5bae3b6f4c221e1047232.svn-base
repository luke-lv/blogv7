/**
 * @author dcw1123 | chengwei1@staff.sina.com.cn
 */
$import("lib/interface.js");
$import("sina/core/string/format.js");
$import("sina/core/string/shorten.js");
$import("sina/core/string/trim.js");
$import("sina/core/array/foreach.js");
$import("sina/ui/tween.js");
$import("sina/core/dom/getElementsByAttr.js");
$import("lib/suggest.js");
$import("lib/checkAuthor.js");

//zIndex：1、储备，2、预备、3、当前。
$registJob("wcQuot", function() {
	
	//需要共享的信息
	var shareData = {
		userSubsData	:null,			//用户的定制信息
		userLoginId		:null			//用户登录 id
	};
	
	//统一会员登录配置。
    window.sinaSSOConfig = new function(){
        this.noActiveTime	= 14400;	// 不活跃时间
		this.pageCharset	= "utf-8";
		this.entry			= 'blog';
        this.setDomain		= true;
	    this.useIframe		= true;
        this.customInit		= function(){  };
        this.customLogoutCallBack	= function(result){  };
        this.customLoginCallBack	= function(){  };
        //this.service = 'uc'; // 本产品的标识
        //this.domain = '51uc.com'; // 所在域的根域，如果时sina.com.cn 的子域，该配置可以忽略
        //this.feedBackUrl = "http://control.blog.sina.com.cn/riaapi/login/ajaxlogin.php?version=7"+(clearDomain?"&clearDomain":"");
    };
	
	//状态管理器，默认状态两个：master 和 guest，都需要 theQuot 数据。
	var statMgr = (function(){
		
		var ZINDEX_RESERVE	= 1;
		var ZINDEX_NEXT		= 2;
		var ZINDEX_SHOW		= 3;
		var ASSET_WIDTH		= 318;
		
		var statDom;				//状态实例
		var theQuot;				//语录集合
		var curStat;				//当前状态
		var isTween;				//只能一个东西 tween。
		var tweenStat;
		var changeTable;
		var reinitTable;
		var wait4loading;
		
		var blogDataReady = 0;		//用户数据请求回来。
		var ssoLoginReady = 0;		//统一会员 js 回来。
		
		tweenStat = {
			stat		:false,
			name		:""
		};
		curStat = "loading";
		statDom = {					//各页签 DOM
			"guest"			:$E("wc_quot_guest"),
			"master"		:$E("wc_quot_master"),
			"login"			:$E("wc_quot_login"),
			"fav"			:$E("wc_quot_fav"),
			"loading"		:$E("wc_quot_loading"),
			"transLoading"	:$E("wc_trans_loading")
		};
		initDom = {					//对应的初始化函数
			"guest"		:initGuest,
			"master"	:initMaster,
			"login"		:initLogin,
			"fav"		:initFav,
			"loading"	:initLoading
		};
		testInited = {				//初始化状态
			"guest"		:false,
			"master"	:false,
			"login"		:false,
			"fav"		:false,
			"loading"	:true
		};
		changeTable = {					//行为的切换路径。//特定动作生效后需要重新初始化的页签，一般而言都是请求。
			"fav":{
				"ok"		:"master",	//其实就是 json 配置文件。
				"cancel"	:"master"
			},
			"login":{
				"ok"		:"fav",
				"cancel"	:"guest",
				"error"		:"login",
				"vip"		:"master"
			},
			"master":{
				"ok"		:"fav"
			},
			"guest":{
				"ok"		:"login"
			},
			"loading":{
				"ok"		:"loading"
			}
		};
		reinitTable = {						//行为的影响范围，loading 没有行为，但有初始化（为统一模块）。这是重初始化！第一次不用管。
			"fav":{
				"ok"		:"master",		//格式诸如：master|fav|login
				"cancel"	:""
			},
			"login":{
				"ok"		:"",
				"cancel"	:"",
				"error"		:""
			},
			"master":{
				"ok"		:""
			},
			"guest":{
				"ok"		:""
			},
			"loading":{
				"ok"		:""
			}
		};
		
		//完全初始化。
		function reset(){
			for(var key in testInited){
				testInited[key] = false;
			}
			shareData.userSubsData = "";			//唯一的受限请求也要开放。
		}
		function getTheQuot(){
			return theQuot;
		}
		function isTween(next){					//操作 tween 状态。
			tweenStat.name = next;
			tweenStat.stat = true;
		}
		function tweenOver(){
			tweenStat.name = "";
			tweenStat.stat = false;
		}
		
		function showLoading(){					//不用初始化任何东西，不同于切换页签的逻辑。
			statDom.transLoading.style.zIndex = 10;
		}
		function endLoading(){
			statDom.transLoading.style.zIndex = 1;
		}
		function changeStat(nextStat){					//改变状态，动画执行器。
			
			var nextStatDom = statDom[nextStat];
			var curStatDom = statDom[curStat];			//只要上次 tween 没完，curStat 就不会变。
			if(tweenStat.stat){
				if(tweenStat.name == "loading"){		//如果正在 loading 动画就返回结果，则在中断前，记入动作。
				wait4loading = nextStat;}
				//traceError("changeStat(): "+nextStat+" has been returned");
				return;									//但是依然会中断操作，带 loading 动画完再操作。
			}
			
			Lib.checkAuthor();
			if(shareData.userLoginId != $UID){
				//trace("changeStat(): Id confused, reset");
				reset();								//id 错误，全部初始化开放。
				shareData.userLoginId = $UID;
			}
			
			if(!testInited[nextStat]){					//初始化下一页签。
				initDom[nextStat]();					//执行。
				testInited[nextStat] = true;
			}
			
			for(var key in statDom){					//除当前节点，zIndex 归 1
				if(key != curStat)
				statDom[key].style.zIndex = ZINDEX_RESERVE;
			}
			
			endLoading();								//任何动画开始前，就将此节点下潜。
			isTween(nextStat);
			nextStatDom.style.zIndex = ZINDEX_NEXT;		//动画时下一节点垫底。
			Ui.tween(curStatDom, ["left"], ASSET_WIDTH, 0.4, "regularEaseIn", {
				end:function(){
					nextStatDom.style.zIndex = ZINDEX_SHOW;		//垫完底，就显示了。
					curStatDom.style.zIndex = ZINDEX_RESERVE;	//
					curStatDom.style.left = "-1px";
					curStat = nextStat;
					tweenOver();
					
					//trace("changeStat(): wait4loading "+wait4loading);
					if(wait4loading){
					changeStat(wait4loading);
					wait4loading = "";}
				}
			});
		}
		function reinitConfirm(someStat){
			if(!someStat) return;
			var eArr = someStat.split("|");
			Core.Array.foreach(eArr, function(elem, i){
				//trace(elem+" was reset");
				testInited[elem] = false;
			});
		}
		function parseAction(actCode, loading){
			var splitArr = actCode.split("|");
			var reinitParam = reinitTable[splitArr[0]][splitArr[1]];
			var changeParam = changeTable[splitArr[0]][splitArr[1]];
			//trace("reinitParam："+reinitParam);
			//trace("changeParam："+changeParam);
			reinitConfirm(reinitParam);
			changeStat(changeParam);
		}
		function theFirstStep(){
			//trace("blogDataReady = "+blogDataReady);
			//trace("ssoLoginReady = "+ssoLoginReady);
			if(!blogDataReady || !ssoLoginReady){
			//trace("theFirstStep(): not ready, return");
			return;}
			//trace("theFirstStep(): now autoLogin ...");
			sinaSSOController.autoLogin(function(coki){			//成功，则尝试自动登录。
				if(coki){
					//traceError("user is master");
					changeStat("master");
				}else{
					//traceError("user is guest");
					changeStat("guest");
				}
			});
		}
		
		//获得 theQuot
		Utils.Io.JsLoad.request("http://blog.sina.com.cn/main/top_new/article_sort_worldcup/json_wc_13blogs_data.js", {
			GET:{
				t:new Date().getTime()
			},
			onComplete:function(){
				if(typeof json_wc_13blogs_data == "undefined"){
				return;}
				theQuot = json_wc_13blogs_data;
				blogDataReady = 1;
				theFirstStep();
			}
		});
		
		Utils.Io.JsLoad.request("http://i.sso.sina.com.cn/js/ssologin.js", {	//然后获取统一会员 js
		    onComplete: function(){
				ssoLoginReady = 1;
				theFirstStep();
		    }
		});
		
		return {
			getTheQuot:		getTheQuot,
			parseAction:	parseAction,
			showLoading:	showLoading,
			endLoading:		endLoading
		};
	})();
	
	//初始化选人页签。
	function initFav(){
		//traceError("initFav");	
		var favOk = $E("wc_fav_ok");
		var favCancel = $E("wc_fav_cancel");
		var favAll = $E("wc_fav_all");
		var allCheckbox = $T($E("wc_quot_fav"), "input");
		var subData = "";
		var choosenBox = [];
		var i;
		var codeBefore = 0;
		var codeSubmit = 0;
		
		//长度算出一个值，遍历再算出一个值，判断。
		function checkedIfAll(){
			var len = allCheckbox.length-1;			//不算全选那个。
			var lenCode = 0;
			for(i=0; i<allCheckbox.length-1; i++){	//不算全选那个。
				lenCode += Math.pow(2, i);
			}
			boxCode = genCode_a();
			//trace(boxCode+"_"+lenCode);
			if(boxCode == lenCode){
			return true;}
			else{
			return false;}
		}
		function genCode_a(){
			var tempNum = 0;
			for(i=0; i<allCheckbox.length-1; i++){
				if(allCheckbox[i].checked){
				tempNum += Math.pow(2, i);}			//2^0 + 2^1 + 2^2 ...
			}
			return tempNum;
		}
		function noChange(){						//生成两个队列编码，判断是否有改动。
			return (codeBefore==codeSubmit) ? true : false;
		}
		function renderFavFrame(res){
			var tempCheck;
			var matchCase = new RegExp(res.join("|"));
			var len = allCheckbox.length - 1;
			var i;
			for(var i=0; i<len; i++){
				if(matchCase.test(allCheckbox[i].getAttribute("id"))){				//exec() 是返回匹配好的数组。
				//trace("i: "+i);
				allCheckbox[i].checked = true;}
				else{
				//trace("i: "+i);
				allCheckbox[i].checked = false;}
			}
			
			codeBefore = genCode_a();
			//trace("codeBefore: "+codeBefore);
			
			if(checkedIfAll()){				//全选，则全选钮要点中。
			//trace("all checked");
			favAll.checked = true;}
			else{							//有任何一个没选。
			//trace("all canceled;");
			favAll.checked = false;}
		}
		
		favAll.onclick = function(){
			if(this.checked){
				for(i=0; i<allCheckbox.length; i++){	//不用排除“全选”本身的勾选，状态相同。
				allCheckbox[i].checked = true;}
			}else{
				for(i=0; i<allCheckbox.length; i++){
				allCheckbox[i].checked = false;}
			}
		};
		favOk.onclick = function(){
			codeSubmit = genCode_a();
			//trace("codeSubmit: "+codeSubmit);
			//trace("codeBefore: "+codeBefore);
			if(noChange()){
			//trace("noChange");
			statMgr.parseAction("fav|cancel");			//加新动作？不加了。碰巧 fav|cancel 可以用
			return;}
			
			statMgr.showLoading();
			
			subData = "";
			choosenBox = [];
			for(i=0; i<allCheckbox.length-1; i++){		//排除“全选”，这个不是数据。
				if(allCheckbox[i].checked){
				choosenBox.push(allCheckbox[i].getAttribute("id"));}
			}
			subData = choosenBox.join("|");
			
			//trace("subData: "+subData);
			new Interface("http://control.blog.sina.com.cn/2010worldcup/api/set_user_choose_uids.php", "jsload").request({
				GET:{
					suid	:subData
				},
				onSuccess:function(res){
					//如果 set 成功，可以考虑更新 codeBefore，这样会减少一个重新初始化的请求。
					codeBefore = genCode_a();
					shareData.userSubsData = null;			//置空，让三个请求重新获取。间接更新 userSubsData。
					statMgr.parseAction("fav|ok");
				},
				onError:function(res){
					//接口回传失败了，则相当于取消。但暂不能提示用户接口错误，唉遗漏了。。。
					//trace("set_user_choose_uids: code "+res.code);
					//stat.endLoading();		//或者需要手动取消。
					statMgr.parseAction("fav|cancel");
				}
			});
			
			return false;
		};
		favCancel.onclick = function(){
			statMgr.parseAction("fav|cancel");
			setTimeout(function(){
				//trace("favCancel: canceling");
				renderFavFrame(shareData.userSubsData);
			}, 500);
			return false;
		};
		
		//所有 checkbox 注册事件。
		for(var i=0; i<allCheckbox.length-1; i++){
			(function(idx){
				var totalBox = allCheckbox.length-1;
				allCheckbox[idx].onclick = function(){
					var curBox = 0;
					for(i=0; i<allCheckbox.length-1; i++){
						if(allCheckbox[i].checked == true){
							curBox++;
						};
					}
					//trace(curBox+"_"+totalBox);
					if(curBox == totalBox){
						favAll.checked = true;
					}else{
						favAll.checked = false;
					}
				};
			})(i);
		}
		
		//渲染页面。
		if(!shareData.userSubsData){
			//trace("fav get data");
			new Interface("http://control.blog.sina.com.cn/2010worldcup/api/get_user_choose_uids.php", "jsload").request({
				onSuccess:function(res){
					res = res[0].split("|");						//PHP 说这个也这样。而且传回一个数组包住的字符串 -__-b
					shareData.userSubsData = res;
					renderFavFrame(shareData.userSubsData);
				},
				onError:function(res){
					//什么都不干。不帮用户选中人物。
					//trace("get_user_choose_uids: code "+res.code);
				}
			});
		}else{
			renderFavFrame(shareData.userSubsData);
		}
	}
	
	//初始化登录的列表页签。
	function initMaster(){
		//traceError("initMaster");
		var tempLi = '<li><span>&middot;<a href="{1}" target="_blank">{0}</a></span><em><a href="{3}" target="_blank">{2}</a></em></li>';
		var theQuot = statMgr.getTheQuot();
		var masterSubs = $E("wc_master_subs");
		var masterList = $E("wc_master_list");
		var choosenArt = [];
		var str = "";
		
		function renderFrame(res){
			Core.Array.foreach(theQuot, function(elem, i){		//遍历文章
				if(choosenArt.length >= 10){					//只取十个。
				return false;}
				
				for(var i=0; i<res.length; i++){		//遍历关注的名博。
					if(res[i] == elem.uid){				//有一个等于就 OK。
					choosenArt.push(elem);
					break;}
				}
			});
			if(choosenArt.length>0){					//未选择，则默认十个。
				//trace("initMaster(): choosenArt > 0");
				Core.Array.foreach(choosenArt, function(elem, i){
				var ttl = Core.String.shorten(elem.blog_title, 32);
				var nic = Core.String.shorten(elem.nick, 10);
				ttl = ttl.replace(/ /g, "&nbsp;");		//得处理标题的多个空格，应该原样输出
				str += tempLi.format(ttl, "http://blog.2010.sina.com.cn/s/blog_"+elem.blog_id+".html", nic, "http://blog.sina.com.cn/u/"+elem.uid);
				});}
			else{
				//trace("initMaster(): choosenArt = 0");
				Core.Array.foreach(theQuot, function(elem, i){		//重新选择文章前十个
				if(choosenArt.length >= 10){
				return false;}
				choosenArt.push(elem);
				});
				
				Core.Array.foreach(choosenArt, function(elem, i){
				var ttl = Core.String.shorten(elem.blog_title, 32);
				var nic = Core.String.shorten(elem.nick, 10);
				ttl = ttl.replace(/ /g, "&nbsp;");		//得处理标题的多个空格，应该原样输出
				str += tempLi.format(ttl, "http://blog.2010.sina.com.cn/s/blog_"+elem.blog_id+".html", nic, "http://blog.sina.com.cn/u/"+elem.uid);
				});}
			masterList.innerHTML = str;
		}
		
		masterSubs.onclick = function(){		//登录判断搬到 changeStat 里面。你只管自己切。
			sinaSSOController.autoLogin(function(coki){
				if(coki){
				//trace("master: to master");
				statMgr.parseAction("master|ok");}
				else{
				//trace("master: to guest");
				statMgr.parseAction("guest|ok");}
			});
			return false;
		};
		
		if(!shareData.userSubsData){			//渲染页面。
			//trace("master get data");
			new Interface("http://control.blog.sina.com.cn/2010worldcup/api/get_user_choose_uids.php", "jsload").request({
				onSuccess:function(res){
					res = res[0].split("|");
					shareData.userSubsData = res;
					renderFrame(shareData.userSubsData);
				},
				onError:function(res){
					//这个错误比较严重。提示用户刷新。不能显示用户没有定制的人物。
					//trace("get_user_choose_uids: code "+res.code);
					masterList.innerHTML = "<p class='wc_err_interface'>系统繁忙，请<a onclick='window.location.reload();'>刷新</a>重试</p>";
				}
			});
		}else{
			renderFrame(shareData.userSubsData);
		}
	}
	
	//初始化默认列表页签。
	function initGuest(){
		//traceError("initGuest");
		var tempLi = '<li><span>&middot;<a href="{1}" target="_blank">{0}</a></span><em><a href="{3}" target="_blank">{2}</a></em></li>';
		var theQuot = statMgr.getTheQuot();
		var guestSubs = $E("wc_guest_subs");
		var guestList = $E("wc_guest_list");
		var choosenArt = [];
		var str = "";
		
		Core.Array.foreach(theQuot, function(elem, i){		//遍历文章
			if(choosenArt.length >= 10){					//只取十个。
			return false;}
			choosenArt.push(elem);
		});
		Core.Array.foreach(choosenArt, function(elem, i){
			var ttl = Core.String.shorten(elem.blog_title, 32);
			var nic = Core.String.shorten(elem.nick, 10);
			ttl = ttl.replace(/ /g, "&nbsp;");		//得处理标题的多个空格，应该原样输出
			str += tempLi.format(ttl, "http://blog.2010.sina.com.cn/s/blog_"+elem.blog_id+".html", nic, "http://blog.sina.com.cn/u/"+elem.uid);
		});
		guestList.innerHTML = str;
		
		guestSubs.onclick = function(){			//这里同 master onclick
			sinaSSOController.autoLogin(function(coki){
				if(coki){
				//trace("guest: to master");
				statMgr.parseAction("master|ok");}
				else{
				//trace("guest: to guest");
				statMgr.parseAction("guest|ok");}
			});
			return false;
		};
	}
	
	//初始化登录页签。
	function initLogin(){
		var INPUTNAME = "请输入正确的登录名";
		var INPUTPASS = "请输入正确的密码";
		//traceError("initLogin");
		
		var loginBtn	= $E("wc_login_submit");
		var loginCancel	= $E("wc_login_return");
		var loginRemm	= $E("wc_login_remm");
		var loginInput	= $E("wc_login_input");
		var loginPass	= $E("wc_login_pass");
		var loginErr	= $E("wc_login_err");
		var loginSug;
		var errTimer = 0;
		
		function exeErr(errMsg){
			clearTimeout(errTimer);
			loginErr.innerHTML = errMsg;
			loginErr.style.visibility = "visible";
			errTimer = setTimeout(function(){ loginErr.style.visibility = "hidden"; }, 2000);
		}
		
		loginErr.style.visibility = "hidden";
		loginPass.onfocus = function(){
			this.select();
		};
		loginPass.onkeydown = function(event){
			event = event || window.event;
			var key = event.keyCode || event.which;
			if(key == 13){
			loginBtn.onclick();}
		};
		loginBtn.onclick = function(){		//name, pass, remmTime
			loginErr.style.visibility = "hidden";
			
			var uName = loginInput.value;
			var uPass = loginPass.value;
			var remmTime = loginRemm.checked ? 15 : 0;
			
			if(!Core.String.trim(uName)){
				exeErr(INPUTNAME);
				return false;
			}else if(!Core.String.trim(uPass)){
				exeErr(INPUTPASS);
				return false;
			}
			statMgr.showLoading();
			window.sinaSSOController.login(uName, uPass, remmTime);
			return false;
		};
		loginCancel.onclick = function(){
			statMgr.parseAction("login|cancel");
			loginPass.value = "";
			return false;
		};
		
		//重新初始化 sso 登录。传入本登录页签的回调。
		window.sinaSSOConfig.customLoginCallBack = function(res){
			if(res.result){
				loginPass.blur();						//这种 zindex 分层机制，输入符竟然可以穿透。
				loginPass.value = "";					//不能保存密码。
				
				if(!shareData.userSubsData){
					//trace("login get data");
					new Interface("http://control.blog.sina.com.cn/2010worldcup/api/get_user_choose_uids.php", "jsload").request({
						onSuccess:function(res){
							res = res[0].split("|");
							shareData.userSubsData = res;
							if(shareData.userSubsData[0]){
								//trace("to vip");
								statMgr.parseAction("login|vip");
							}else{
								//trace("to fav");
								statMgr.parseAction("login|ok");
							}
						},
						onError:function(res){
							
						}
					});
				}else{
					if(shareData.userSubsData[0]){
						//trace("to vip");
						statMgr.parseAction("login|vip");
					}else{
						//trace("to fav");
						statMgr.parseAction("login|ok");
					}
				}
			}else{
				//statMgr.parseAction("login|error");		//本来可以不用新加这个动作的，但是加入 loading frame 之后，有时必须切回来。
				//setTimeout(function(){ exeErr(res.reason); }, 400);
				statMgr.endLoading();
				exeErr(res.reason);
				loginPass.value = "";
				loginPass.focus();
			}
		};
		window.sinaSSOController.init();
		
		if(!loginSug){
		Lib.passcardOBJ.init(				//Suggest。
			loginInput,
			null,							//颜色。
			loginPass,						//回车才能跳过来。iframe 不知道是否正常。
			null
		);
		loginSug = true;}
	}
	
	//初始化 loading 页签。做样子而已……
	function initLoading(){
		//traceError("initLoading");
	}
	
	
});




