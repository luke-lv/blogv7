/** 
 * @fileoverview 顶踩功能
 * @author zhihan | zhihan@sina.staff.com.cn
 */
$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/dom/insertAfter.js");
$import("lib/lib.js");

$import("sina/utils/flash/swfObject.js");
$import("sina/core/math/getUniqueId.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/dom/opacity.js");
$import("lib/checkAuthor.js");

$import("sina/ui/tween.js");
$import("sina/core/system/br.js");
$import("msg/diggMSG.js");

$registJob('digger',function(){
	if(!scope.digger) {
		scope.digger = {};
	}
	scope.digger.flashReady = function(){};
	scope.digger.diggerPer = function(){};
	scope.digger.diggerNums = function(){};
	scope.digger.setData = function(){};
	scope.digger.diggerPost = function(){};
	scope.digger.bindEvent = function(){};
	scope.digger.showLast10 = function(){};
	scope.digger.hiddenLast10 = function(){};
	
	if(!$E('diggerFla')) {
		//确定是老页面
		trace('no diggerFla');
		return;
	}
	
	if(!$_GLOBAL.diggerOpenFlag) {
		//不启用
		trace('close...');
		return;
	}
	
	Lib.checkAuthor();
	var currentUser = '';
	if($isLogin) {
		currentUser = $UID;
		trace("当前用户:"+$UID);
	}
	
	var flashReady = false;
	
	//超过$_GLOBAL.diggerFlashTimeout ,则failed = true，并且这是一个不可逆的过程
	var failed = false;
	
	scope.digger.flashReady = function() {
		trace('--------顶踩加载完毕....');
		flashReady = true;
	}

	trace('--------顶踩开始加载完毕....');
	var random="";
		
		if(window.$Maxthon||window.$360||window.$TT){
			random="?t="+Core.Math.getUniqueId();
		}
	var FlashPlayer = new Utils.Flash.swfObject($_GLOBAL.flashBasicURL + "digger.swf"+random, "digger", "1", "1", "9", "#00ff00");			
	FlashPlayer.addParam("quality", "high");
	FlashPlayer.addParam("wmode", "transparent");
	FlashPlayer.addParam("allowScriptAccess", "always");
	//FlashPlayer.addVariable("readyFun", readyFun);
	FlashPlayer.write("diggerFla");
	
	var digger = $E("digger");
	
	scope.digger.diggerPer = function(opt) {
		if(!opt.params) {
			opt.params = {
				'res_id' : opt.res_id
				,'res_uid' : opt.res_uid || scope.$uid
			};
		}
		opt.url = 'http://control.blog.sina.com.cn/riaapi/digg/get_digg.php';
		makeReq(opt);
	}
	
	scope.digger.diggerNums = function(opt) {
		if(!opt.params) {
			opt.params = {
				'res_id' : opt.res_id
				,'res_uid' : opt.res_uid || scope.$uid
			};
		}
		opt.url = 'http://blogtj.sinajs.cn/api/get_digg_num.php';
		makeReq(opt);
	}
	
	//等待设置，要是超过规定的时间，则认为flash不能被加载
	function delaySet(_opt) {
		var timmer = 0;
		var inter = setInterval(function(){
			timmer += 500;
			if(timmer >= $_GLOBAL.diggerFlashTimeout) {
				trace('已超时，不再尝试放进flash cookie:'+_opt.res_id+'_'+(_opt.res_uid || scope.$uid)+'_'+currentUser+'_'+_opt.res_type);
				clearInterval(inter);
				failed = true;
			}
			if(flashReady) {
				clearInterval(inter);
				waitToSet(_opt);
			}
		},500);
	}
	
	function waitToSet(_opt) {
		if(failed) {
			trace('不等待,flash已经是不可靠的，顶没有放入flash cookie');
			return;
		}
		if(!flashReady) {
			delaySet(_opt);
		} else {
			digger.setData(_opt.res_id+'_'+(_opt.res_uid || scope.$uid)+'_'+currentUser+'_'+_opt.res_type);
			trace(_opt.res_id+'_'+(_opt.res_uid || scope.$uid)+'_'+currentUser+'_'+_opt.res_type+'放入成功!');
		}
	}
	
	scope.digger.setData = function(rss_id,uid,type) {
		waitToSet({
			'res_id' : rss_id
			,'res_uid' : uid
			,'res_type' : type
		})
	}
	
	scope.digger.diggerPost = function(opt) {
		if(!opt.params) {
			opt.params = {
				'res_id' : opt.res_id
				,'res_uid' : opt.res_uid || scope.$uid
				,'action' : opt.action || '0'
				,'res_type' : opt.res_type
				,'ti_title' : opt.ti_title
			};
		}
		/*
		res_id:资源编号,比如是博文编号
		res_uid:资源号博主uid
		action:0(代表顶)/1(代表踩)
		res_type:1(代表博文)/2(代表图片)/3(代表专辑)
		*/
		opt.url = 'http://control.blog.sina.com.cn/admin/digg/post_digg.php';
		if(!opt.onSuccess) {
			opt.onSuccess = function(data) {
				//设置进cookie
				//todo 这里的存的问题还没有验证
				waitToSet(opt);
			}
		} else {
			var temp = opt.onSuccess;
			opt.onSuccess = function(data) {
				temp(data);
				waitToSet(opt);
			}
		}
		makeReq(opt);
	}
	
	//等待flash的加载,失败后就直接执行事件绑定
	function waitOrExecute(_opt) {
		var timmer = 0;
		var inter = setInterval(function(){
			timmer += 500;
			trace('waitOrExecute:等待flash加载...'+timmer);
			if(flashReady) {
				clearInterval(inter);
				scope.digger.bindEvent(_opt);
			}
			if(timmer >= $_GLOBAL.diggerFlashTimeout) {
				trace('响应超时，直接执行代码');
				clearInterval(inter);
				whenFailed(_opt);
				failed = true;
				return;
			}
		},500);
	}
	
	//当flash加载失败或没有参与过投票时调用
	function whenFailed(_opt) {
		for(var event in _opt.events) {
			_opt.targetEle['on'+ event] = _opt.events[event](_opt);
		}
	}
	
	//暂时直接置为不可以
	//failed = true;
	//Error in Actionscript. Use a try/catch block to find error.
	//window.testDigger = digger;
	
	//确认默认显示的样式，这里需要调用到flash的防刷新
	scope.digger.bindEvent = function(opt) {
		if(failed) {
			trace('不等待,flash已经是不可靠的，直接执行代码');
			whenFailed(opt);
			return;
		}
		if(!flashReady) {
			trace('falsh还没有加载完毕');
			waitOrExecute(opt);
		} else {
			//判断是否已经顶过
			//todo 这里怎么取
			trace('读取'+opt.res_id+'_'+(opt.res_uid || scope.$uid)+'_'+currentUser+'_'+opt.res_type+':'+digger.getData(opt.res_id+'_'+(opt.res_uid || scope.$uid)+'_'+currentUser+'_'+opt.res_type));
			if(digger.getData(opt.res_id+'_'+(opt.res_uid || scope.$uid)+'_'+currentUser+'_'+opt.res_type)) {
				trace(opt.res_id+'_'+(opt.res_uid || scope.$uid)+'_'+currentUser+'_'+opt.res_type+': 找到，不绑定事件');
				opt.whenFind && opt.whenFind(opt);
			} else {
				trace(opt.res_id+'_'+(opt.res_uid || scope.$uid)+'_'+currentUser+'_'+opt.res_type+': 未找到，绑定事件');
				whenFailed(opt);
			}
		}
	}
	
	function makeReq(opt) {
		new Interface(opt.url,'jsload').request({
            GET: opt.params,
            onSuccess: function(_data){
				opt.onSuccess  && opt.onSuccess(_data);
            },
            onError: function(_data){
				opt.onError  && opt.onError(_data);
            },
            onFail: function(){
				opt.onFail && opt.onFail();
            }
        });
	}
	
	var div = document.createElement('div');
	div.className = 'tb_layer_Y tb_layer_w3';
	div.style.cssText = 'z-index: 511;position:absolute;display:none;width:160px';
	var arrDiv = document.createElement('div');
	arrDiv.className = 'tb_layer_arrow';
	var content = document.createElement('div');
	content.className = 'tb_layer_Y_main tip_ps';
	content.style.cssText = 'width:auto;';
	content.innerHTML = '<a style="margin-top: 5px;" title="关闭" class="tb_friend_inputDel" href="javascript:void(0)"></a>\
						<div style="text-align:left;color:#999999">最近喜欢了的博主：</div>\
						<div></div>';
	div.appendChild(arrDiv);
	div.appendChild(content);
	document.body.appendChild(div);
	var close = content.getElementsByTagName('a')[0];
	var con = content.getElementsByTagName('div')[1];
	con.style.whiteSpace = 'nowrap';
	//con.style.wordWrap = 'break-word';
	//con.style.wordBreak = 'normal';
	
	function changeToLoadind() {
		con.innerHTML = '<div style="text-align:center;"><img src="http://simg.sinajs.cn/blog7style/images/common/loading.gif" />加载中…</div>';
	}
	
	changeToLoadind();
	
	close.onclick = function() {
		scope.digger.hiddenLast10();
	};
	
	scope.digger.showLast10 = function(opt) {
		changeToLoadind();
		scope.digger.diggerPer(opt);
		
		var loc = Core.Dom.getXY(opt.ele);
		
		opt.onError = function(data) {
			con.innerHTML = '<div style="text-align:center;color:#999999;font-weight:bolder;">数据请求失败，请稍后重试</div>';
		};
		opt.onFail = opt.onError;
		
		opt.onSuccess = function(data) {
			//当一个返回超级长时间时候，用户关闭，就不会在往里面写入了
			//todo 但是不能控制它再次打开不清除
			if(div.style.display) {
				trace('已经被关闭，不再往里面写入信息');
				return;
			}
			var pers = [];
			for(var i=0; data[i]; i++) {
				var per = data[i];
				//var sName = per['action_uname'].length > 8 ? per['action_uname'].substring(0,7)+'…' : per['action_uname']
				var sName = per['action_uname'];
				pers.push('<div><a target="_blank" title="到'+per['action_uname']+'的博客去看看" href="http://blog.sina.com.cn/u/'+per['action_uid']+'">'+sName+'</a></div>');
			}
			if(!pers.length) {
				con.innerHTML = '<div style="text-align:center;color:#999999;font-weight:bolder;">暂无登录用户喜欢过</div>';
			} else {
				con.innerHTML = pers.join('');
			}
			if(opt.callBack) {
				opt.callBack(div);
			}
		};
		
		
		
		var opa = 0;
		var ddy = 50;
		var dx = (opt.dx || -76) + loc[0];
		var dy = (opt.dy || 10) + loc[1];
		if($IE) {
			dx -= 1;
			dy -= 2;
		}
		if($SAFARI) {
			dx += 1;
		}
		if($CHROME) {
			dx += 1;
			dy += 2;
		}
		
		div.style.display = '';
		div.style.left = dx +'px';
		div.style.top = dy + 'px';
		Core.Dom.opacity(div, opa);
		
		new Ui.tween(div, ["opacity"], [1], 0.3, "strongEaseIn");
		
		window.onresize = function(){
			var nLoc = Core.Dom.getXY(opt.ele);
			div.style.left = nLoc[0] - 76 +'px';
			div.style.top = nLoc[1] + 10 + 'px';
		};
	}
	
	scope.digger.hiddenLast10 = function() {
		 var opa = 1;
		 new Ui.tween(div, ["opacity"], [0], 0.3, "strongEaseOut");
		 setTimeout(function(){
		 	div.style.display = 'none';
		 },350);
	}
});
