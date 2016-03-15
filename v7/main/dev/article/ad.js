/**
 * @author 武建 wujian@staff.sina.com.cn
 * @fileoverview 推荐 博文 滚动条 广告！！！
 */
$import("lib/oop2.js");
$import("lib/templateUtils.js");
$import("lib/commonLog.js");
$import("other/sinaflash.js");
$import("sina/core/class/create.js");
$import("sina/core/system/br.js");
$import("sina/utils/cookie/getCookie.js");
$import("sina/utils/cookie/setCookie.js");
$import("sina/core/system/getScrollPos.js");
$import("sina/core/system/winSize.js");
$import("sina/core/system/pageSize.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/events/stopBubble.js");
$import("sina/core/events/eventDispatcher.js");
$import("sina/core/dom/getTop.js");
$import("sina/ui/panel.js");
$import("sina/ui/tween.js");
$import("sina/ui/tween/tweenStrategy.js");
$import("sina/ui/tween/transition.js");
$import("sina/utils/io/jsload.js");

// code structure modified for Interface updated		dcw1123 | chengwei1@staff.sina.com.cn
// code reformated

var ScrollAd = function(obj, countPlay){			// mixed、swf、pic 三种广告类型
	trace("start:"+countPlay);
	if(countPlay >= 2){
		this.__approve = false;
	}
	this.countPlay = countPlay;
	this.initAd(obj);
	this._evt = new Core.Events.EventDispatcher(this);
	
}.$defineProto({
	div:		null,				// 广告浮层 dom
	closeTip:	null,				// 关闭按钮 dom
	timerAll:	3,					// 广告播放总时间
	timeCount:	3,					// 广告播放当前时间
	timer:		null,
	_evt:		null,				// 设置 cookie 的 name
	__approve:	true,
	cookieName:	"scrollAd",
	isHidden : true,
	// 加载广告回调函数
	initAd:function(obj){
		var div = new Ui.Panel();
		var html = [
		'<div class="ad_layer" id="#{entity}" style="position:fixed; padding-top:0;">',
			'<p class="close_x" style="margin-left:'+(obj.width-35)+'px;">',
				'<a href="#" id="#{closeBtn}" title="关闭" onclick="return false;"><img height="18" align="absmiddle" width="40" title="关闭" src="http://simg.sinajs.cn/blog7style/images/common/ad/closenew.jpg" class="adclose"></a>',
			'</p>',
			'<p class="right_arr adtop"></p>',
			'<div class="center adlist" id="#{content}"></div>',
		'</div>'].join("");
		
		// 要算高度的 没办法  放到看不到的地方吧
		div.setTemplate(html);
		div.setPosition({
			x:	-1000,
			y:	-1000,
			z:	102
		});
		div.show();
		var nodes = div.nodes;
		switch(obj.type){
			case "mixed":
				nodes.content.innerHTML = obj.content;
				break;
			case "pic":
				nodes.content.innerHTML = '<img src="'+obj.ref+'" style="width:'+obj.width+'px; height:'+obj.height+'px;" />';
				if(obj.click){
					nodes.content.style.position = "relative";
					nodes.cantSeeMe = this.createNode('<a href="#" target="_blank"></a>');
					nodes.cantSeeMe.href = obj.click;
					nodes.cantSeeMe.style.cssText
					= ($IE?"filter:alpha(opacity=0);":"opacity:0")
					+ "; height:"+obj.height+"px; width:"+obj.width+"px; background:#F00; display:block;"
					+ "z-index:1020; position:absolute; left:0; top:0;";
					nodes.content.appendChild(nodes.cantSeeMe);
				}
				break;
			case "swf":		// 盖一层 透明 div 绑定事件
				this.appendSwf(obj.ref, "", obj.width, obj.height, nodes.content.id);
				if(obj.click){
					nodes.content.style.position = "relative";
					nodes.cantSeeMe = this.createNode('<a href="#" target="_blank"></a>');
					nodes.cantSeeMe.href = obj.click;
					nodes.cantSeeMe.style.cssText
					= ($IE?"filter:alpha(opacity=0);":"opacity:0")
					+ "; height:"+obj.height+"px; width:"+obj.width+"px; background:#F00; display:block;"
					+ "z-index:1020; position:absolute; left:0; top:0;";
					nodes.content.appendChild(nodes.cantSeeMe);
				}
				break;
		}
		// if(obj.type == "swf"){
		// 	var w = nodes.content.clientWidth;
		// 	var h = nodes.content.clientHeight;
		// 	if($IE){
		// 		nodes.alphaDiv.style.cssText = "background:#F00; position:absolute; width:"+w+"px; height:"+h+"px; filter:alpha(opacity=0); top:14px; left:0px;";
		// 	}else{
		// 		nodes.alphaDiv.style.cssText = "background:#F00; position:absolute; width:"+w+"px; height:"+h+"px; opacity:0; top:14px; left:0px;";
		// 	}
		// 	Core.Events.addEvent(nodes.alphaDiv, function(){
		// 		window.open(obj.click);
		// 	}, "click");
		// }else{
		// 	nodes.alphaDiv.style.cssText += "; display:none;";
		// }
		
		this.obj = obj;
		this.div = nodes.entity;
		this.closeTip = nodes.closeBtn;
		this.bindCloseEvent();		// 绑定 关闭 广告事件
		// this.changePos();
		// this.onscroll();			// 调用一次 主要是 开启定时开关
		this.bindEvent();
		
		// 时时保证 广告在 可视区域中
		var top = Core.Dom.getTop(this.div);
		var pos = Core.System.getScrollPos();
		var win = Core.System.winSize();
		// trace("top==="+top);
		// trace("posTop=="+pos[0])
		if(this.div.style.position != "fixed"){
			if(top < pos[0]){
				if($IE6){
					this.div.style.top = pos[0]+"px";
				}else{
					this.div.style.position = "fixed";			
					this.div.style.top = "0px"
				}			
			}
			if(top > (pos[0]+win.height-this.div.clientHeight)){			
				if($IE6){
					this.div.style.top = (pos[0]+win.height-this.div.clientHeight)+"px";
				}else{
					this.div.style.position = "fixed";
					this.div.style.top = (win.height-this.div.clientHeight)+"px";
				}
			}
		}
		
		if($IE6){
			this.div.style.position = "absolute";
			trace("ie6");
		}

        //liming9-2012年7月18日 添加好耶代码统计
        //trace('11111');
        commonLog('http://1086.adsina.allyes.com/main/adfshow?user=AFP6_for_SINA|2012_add|2012_blog_tjbw_sxan&db=sina&border=0&local=yes&js=ie');
	},
	
	// 
	appendSwf:function(url, id, width, height, targetId){
		// V_movie, x_id, X_width, Z_height, v_version, z_bgColor, i_useExpressInstall, c_quality, I_xir, l_redirectUrl, o_detectKey
		if(typeof sinaFlash == "undefined") return;
		var sinaFlash2 = new sinaFlash(
			url,							//flash 的地址
			id,								//写入到页面后的 object id。
			width+"",						//宽
			height+"",						//高
			"9",							//flash 版本
			"#FFFFFF",						//flash 背景色
			false,							//是否使用 flash 快速升级
			"High",							//清晰度
			"http://www.sina.com.cn/",		//快速升级 url
			"http://www.sina.com.cn/",		//快速升级重定向 url
			false							//是否检测flash
		);
		sinaFlash2.addParam("allowScriptAccess", "always");		//是否允许脚本互访
		sinaFlash2.addParam("wmode", "transparent");			//透明度，FF 下使用 window 模式。解决输入法问题。
		// 现在改回transparent，因为window模式的flash，会遮盖js对话框，如果用原生alert，win7下的FF会停止响应
		sinaFlash2.write(targetId);			//写入容器的 id。
	},
	
	/**
	 * 添加监听
	 * @param {Object} type
	 * @param {Object} fun
	 */
	addEventListener:function(type, fun){
		this._evt.addEventListener(type, fun);
	},
	
	// 
	createNode:function(txt){
		var _box = $C("div");
		_box.innerHTML = txt;
		return _box.childNodes[0];
	},
	
	// 滚动条 滚动时 检查 位置 重置动画参数
	onscroll:function(){
        //console.log("onscroll收缩广告："+(this.relativeAd.isHidden));
        if(this.relativeAd && !this.relativeAd.isHidden){
            return;
        }
		this.show();
		if(this.twn){
			// Ui.tween.stop(this.div);
			this.twn.stop();
		}
	
		// 时时保证 广告在 可视区域中
		var top = Core.Dom.getTop(this.div);
		var pos = Core.System.getScrollPos();
		var win = Core.System.winSize();
		// trace("top==="+top);
		// trace("posTop=="+pos[0])
		if(this.div.style.position != "fixed"){
			if(top < pos[0]){			
				if($IE6){
					this.div.style.top = pos[0]+"px";
				}else{
					this.div.style.position = "fixed";			
					this.div.style.top = "0px";
				}			
			}
			if(top > (pos[0] + win.height - this.div.clientHeight)){			
				if($IE6){
					this.div.style.top = (pos[0]+win.height-this.div.clientHeight)+"px";
				}else{
					this.div.style.position = "fixed";
					this.div.style.top = (win.height-this.div.clientHeight)+"px";
				}			
			}
		}
		
		// 重置计时器
		// this.timerCount = this.timerAll;
		this.startTimer();
	},
	
	// 
	startTimer:function(){
		// trace("-----start-------")
		// 重置计时器
		this.timerCount = this.timerAll;
		if(!this.timer){
			var _this = this;
			this.timer = setInterval(function(){
				_this.timerCount -= 0.25;
				if(_this.timerCount < 0){			// 播放时间结束了 
					Core.Events.removeEvent(window, scope.scrollFun, "scroll");
					_this.stopTimer();
					// if(_this.replayState){
						_this.replayState = false;
						_this.hidden();
						_this._evt.dispatchEvent("close");
					// }
				}
				if(_this.timerCount <= (_this.timerAll-0.5)){			
					if(!_this.twn || !_this.twn._isTweenning){
						var win = Core.System.winSize();
						_this.tween(win);
					}
				}
			}, 250);
		}
	},
	
	// 
	stopTimer:function(){
		//trace("----stop-----")
		if(this.timer){
			window.clearInterval(this.timer);
			this.timer = null;
		}
	},
	
	// 绑定 关闭广告按钮事件
	bindCloseEvent:function(){
		var _this = this;
		Core.Events.addEvent(this.closeTip, function(e){
			Core.Events.removeEvent(window, scope.scrollFun, "scroll");
			_this.hidden();
			_this._evt.dispatchEvent("close");
			_this.stopTimer();
			Core.Events.stopEvent(e);
			// Core.Events.stopBubble();
			
			// 统计链接
			if(_this.obj.status.adclose)
			new Image().src = _this.obj.status.adclose;
		}, "click");
	},
	
	// 
	hideBig:function(){
		this.stopTimer();
		Core.Events.removeEvent(window, scope.scrollFun, "scroll");
		this.hidden();
	},
	//设置此广告关联的广告
	setRelativeAd : function(ad){
        this.relativeAd = ad;
    },
	// 
	show:function(){
        //console.log("收缩广告："+(this.relativeAd.isHidden));
        if(this.relativeAd && !this.relativeAd.isHidden){
            return;
        }
		trace("show? "+this.__approve);
		trace("show? "+this.countPlay);
        this.isHidden = false;
		if(this.__approve){
			var tomorrow = new Date();
			var today = new Date();
			d = today.getDate();
			tomorrow.setDate(d + 1);
			tomorrow.setHours(0, 0, 0, 0);
			var between = (tomorrow - today) / 3600000;
			Utils.Cookie.setCookie("count", this.countPlay+1, between, "/", ".blog.sina.com.cn");
			this.div.style.display = "block";
		}
        trace('show 3333333333333333');
	},
	
	// 
	hidden:function(){
        this.isHidden = true;
		if(this.twn){
			// Ui.tween.stop(this.div);
			this.twn.stop();
		}
		Core.Events.removeEvent(window, scope.scrollFun, "scroll");
		// this.div.style.visibility = "hidden";
		this.div.style.display = "none";
	},
	
	// 
	replay:function(){
		this.replayState = true;	
		// this.show();
		Core.Events.addEvent(window, scope.scrollFun, "scroll");
		var win = Core.System.winSize();
		var top = this.changePos(win);
		var ppos = this.__getDocumentSize();
		var left = ppos.width;

		this.div.style.display = "block";
		this.div.style.top = top + "px";
		trace("------------");
		trace(left);
		trace(this.div.clientWidth);
		trace(this.div.offsetWidth);
		trace(this.div.style.left);
		this.div.style.left = left - this.div.clientWidth - 6 + "px";
		this.bindMouseInAndOut();		// 绑定鼠标进入与移开事件
		this.scrollFun();
	},
	
	// 
	bindMouseInAndOut:function(){
		var node = this.div;
		var _this = this;
		Core.Events.addEvent(node, function(){
			_this.onscroll = function(){};
			_this.stopTimer();
		}, "mouseover");
		Core.Events.addEvent(node, function(){
			_this.startTimer();
			_this.onscroll = _this.scrollFun;
		}, "mouseout");
	},
	
	// 
	tween:function(pos, win){
		var _this = this;
		if(!this.twn){
			this.twn = new Ui.TweenStrategy(parseInt(this.div.style.top), this.changePos(win), 1, Ui.Transition.strongEaseOut);
			this.twn.onTween = function(value){
				_this.div.style.top = value+"px";
			};
			this.twn.onEnd = function(){
				_this.twn = null;
			};
			this.twn.start();
		}
	},
	
	// 绑定 滚动条 事件
	bindEvent:function(){
		var _this = this;			// 注册为全局函数 方便 移除
		scope.scrollFun = function(){
			_this.onscroll();
		};
		this.scrollFun = this.onscroll;
		Core.Events.addEvent(window, scope.scrollFun, "scroll");
		Core.Events.addEvent(window, function(){
			_this.x = null;
			var size = Core.System.pageSize();
			var min = 1024;
			if($IE){
				min = 1003;
			}
			if(size[2] >= min){
				// _this.show = function(){
				// 	trace("fake show");
				// 	this.div.style.display = "block";
				// }
				//_this.changePos();
			}else{
				trace("replacement");
				// _this.show = function(){
				// 	trace("fuck show");
				// };
				_this.hidden();
			}
		}, "resize");
	},
	
	// 具体的计算 好麻烦啊
	changePos:function(twin){
		var dom = this.div;
		var pos = Core.System.getScrollPos();
		var page = Core.System.pageSize();
		
		var rat = (page[1]-page[3])/page[3];		// 计算显示 比率
		var scroll = page[3]-21*2;					// 计算 滚动条实际的高度
		var height = parseInt(scroll/(rat+1));		// 计算 滚动条 块状高度
		var scrollPos = parseInt((scroll-height)*pos[0]/(page[1]-page[3]));		//计算 当前 滚动条的移动距离
		
		// 纠正 浮层左侧位置
		if(this.x == null){
			var ppos = this.__getDocumentSize();
			var left = ppos.width;

			dom.style.left = left - dom.clientWidth - 6 + "px";
			trace("============")
			trace(left);
			trace(dom.clientWidth);
			trace(dom.offsetWidth);
			trace(dom.style.left);
			this.x = true;
		}
		if($IE6){										// 浮层 position 为absolute
			var top = pos[0] + scrollPos + parseInt(height/2) - dom.clientHeight/2+20	//-45;
			var min = pos[0] > 30 ? pos[0] : 30;		// 纠正 位置
			top = top < pos[0] ? min : top;
			var max = page[1] - dom.clientHeight;
			top = top < max ? top : max;
		}else{											// 浮层 position 为fixed
			var top = scrollPos+parseInt(height/2)-dom.clientHeight/2+20		// -45;
			var min = pos[0] > 30 ? 0 : 30;				// 纠正 位置
			top = top > min ? top : min;
			var win = twin || Core.System.winSize();
			var max = win.height - dom.clientHeight;
			top = top < max ? top : max;
		}
		return top;
	},
	
	// 获取当前可见区域的尺寸
	__getDocumentSize:function(){
		var w = document.documentElement.clientWidth || document.body.clientWidth;
		var h = document.documentElement.clientHeight || document.body.clientHeight;
		return { width:w, height:h };
	}
});




