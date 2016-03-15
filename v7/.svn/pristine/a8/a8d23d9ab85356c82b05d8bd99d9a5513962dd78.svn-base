/**
 * @fileoverview 推荐博文 鼠标随时行广告中的小广告
 * @author wujian wujian@staff.sina.com.cn
 */
$import("lib/oop2.js");
$import("lib/templateUtils.js");
$import("other/sinaflash.js");
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
// code structure modified for compsition reason
// code reformated

var MiniTip = function(oParam, countPlay, adMgr){			// 可能的广告类型。flash 和 img。
	oParam = oParam || {};
	this.statistics = oParam.status;
    this.logurl = oParam.logurl;
	var imgSrc = "http://simg.sinajs.cn/blog7style/images/common/img_ad_s.gif";
	var imgTemp = '<img height="#{height}" width="#{width}" src="#{src}" alt="" />';
	var panel = new Ui.Panel();
	var ppos = this.__getDocumentSize();
	var left = ppos.width;
	
	panel.setTemplate(this.template);
	panel.setFixed(true);
	panel.show();
	
	this.alienBox = $E("ramdomVisitDiv"); // 随便看看的 div
	this.dialog = panel;
	this.panel = panel.entity;
	this._nodes = panel.nodes;
	this._nodes.content.style.height = oParam.height+"px";
	this._nodes.content.style.width = oParam.width+"px";
	this._evt = new Core.Events.EventDispatcher(this);		// 构造 evt
	
	if(oParam.type == "swf"){
		this.appendSwf(oParam.ref, "", oParam.width, oParam.height, this._nodes.content.id);
	}else if(oParam.type == "pic"){
		var adMini = this.formatTemplate(imgTemp, {
			src:	oParam.ref,
			height:	oParam.height,
			width:	oParam.width
		});
		this._nodes.content.innerHTML = adMini;
	}
	if(oParam.click){
		this._nodes.content.style.position = "relative";
		this._nodes.cantSeeMe = this.createNode('<a href="#" target="_blank"></a>');
		this._nodes.cantSeeMe.href = oParam.click;
		this._nodes.cantSeeMe.style.cssText
		= ($IE?"filter:alpha(opacity=0);":"opacity:0")
		+ "; height:"+oParam.height+"px; width:"+oParam.width+"px; background:#F00; display:block;"
		+ "z-index:1020; position:absolute; left:0; top:0;";
		this._nodes.content.appendChild(this._nodes.cantSeeMe);
	}
	
	trace("dcw: "+left);
	trace("dcw: "+panel.entity.clientWidth);
	panel.setPosition({
		x:	left - panel.entity.clientWidth,
		y:	ppos.height - panel.entity.clientHeight,
		z:	103
	});
	panel.hidden();
	this.initEventFuns();
	if(countPlay >= 2){
		this.addEvent();
	}
	panel = null;
	this.addEvent();
	
}.$defineProto({
	isHidden : true,
	template:[
	'<div class="ad_layer" id="#{entity}" style="position:fixed; padding-top:0px;">',
		'<p id="#{content}"></p>',
		'<div class="ad_con">',
			'<p><a href="#" style="background:url(http://simg.sinajs.cn/blog7style/images/common/ad/blogAdClose.jpg) 0 0; display:inline-block; width:25px; height:24px;" onclick="return false;" title="重新播放" id="#{replayBtn}"></a></p>',
			'<div class="ad_c"><a href="#" onclick="return false;" title="关闭" id="#{closeBtn}" style="background:url(http://simg.sinajs.cn/blog7style/images/common/ad/blogAdClose.jpg) 0 -24px; display:inline-block; width:25px; height:45px;"></a></div>',
		'</div>',
	'</div>'].join(""),
	
	_evt:null,
	
	_nodes:null,
	
	// 获取当前可见区域的尺寸
	__getDocumentSize:function(){
		var w = document.documentElement.clientWidth || document.body.clientWidth;
		var h = document.documentElement.clientHeight || document.body.clientHeight;
		return { width:w, height:h };
	},
	
	// 
	createNode:function(txt){
		var _box = $C("div");
		_box.innerHTML = txt;
		return _box.childNodes[0];
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
	
	// 初始化 事件处理函数 方便remove
	initEventFuns:function(){
		var n = this._nodes;
		var evt = this._evt;
		var that = this;
		scope.miniTipsReplay = function(e){		// 重播
			that.hide(e);
			evt.dispatchEvent("replay");
		};
		scope.miniTipsClose = function(e){		// 关闭
			that.close(e);
		};
		scope.miniTipsScroll = function(){		// 滚动
			that.scroll();
		};
	},
	
	// 绑定 重播 关闭 滚动事件
	addEvent:function(){
		var n = this._nodes;
		var that = this;
		Core.Events.addEvent(window, function(){
			that.changeHeight();
		},"resize");
		Core.Events.addEvent(n.replayBtn, scope.miniTipsReplay, "click");
		Core.Events.addEvent(n.closeBtn, scope.miniTipsClose, "click");
		// Core.Events.addEvent(window, scope.miniTipsScroll, "scroll");
	},
	
	// 
	removeEvent:function(){
		trace("remove event");
		// 绑定 重播 关闭 滚动事件
		var n = this._nodes;
		// Core.Events.removeEvent(window,scope.miniTipsScroll,"scroll");		
		Core.Events.removeEvent(n.replayBtn, scope.miniTipsReplay, "click");		
		Core.Events.removeEvent(n.closeBtn, scope.miniTipsClose, "click");
	},
    //设置此广告关联的广告
	setRelativeAd : function(ad){
        this.relativeAd = ad;
    },
	/**
	 * 添加监听
	 * @param {Object} type
	 * @param {Object} fun
	 */
	addEventListener:function(type, fun){
		this._evt.addEventListener(type,fun);
	},
	
	// 
	scroll:function(){
		if(this.twn){		// 强制动画停止
			// Ui.tween.stop(this.div);
			this.twn.stop();
		}
		if(this.t){
			window.clearTimeout(this.t);
			this.t = null;
		}
		// 时时保证广告在可视区域中
		var top = Core.Dom.getTop(this.panel);
		var pos = Core.System.getScrollPos();
		var win = Core.System.winSize();
		// trace("top==="+top);
		// trace("posTop=="+pos[0])
		if(this.panel.style.position != "fixed"){
			// console.log("手动scroll");
			if(top < pos[0]){			
				if($IE6){
					this.panel.style.top = pos[0]+"px";
				}else{
					this.panel.style.position = "fixed";			
					this.panel.style.top = "0px"
				}			
			}
			if(top > (pos[0]+win.height-this.panel.clientHeight)){			
				if($IE6){
					this.panel.style.top = (pos[0]+win.height-this.panel.clientHeight)+"px";
				}else{
					this.panel.style.position = "fixed";
					this.panel.style.top = (win.height-this.panel.clientHeight)+"px";
				}
			}
		}
		var that = this;
		this.t = setTimeout(function(){
			that.tween(win);
		}, 300);
		// console.log("手动 scroll");
	},
	
	// 
	tween:function(win){
		// console.log("twn start 1");
		var _this = this;
		if(!this.twn){
			// console.log("twn start 2");
			this.twn = new Ui.TweenStrategy(parseInt(this.panel.style.top),this.changePos(win),1,Ui.Transition.strongEaseOut);
			// console.log("twn start 3");
			this.twn.onTween = function(value){
				_this.panel.style.top = value + "px";
			};
			this.twn.onEnd = function(){
				_this.twn = null;
			};
			this.twn.start();
		}
	},
	
	// 
	close:function(e){
		this.hide(e);
		Core.Events.stopEvent(e);
		// Core.Events.stopBubble();
			
		// 关闭后 24小时 cookie
		Utils.Cookie.setCookie("scrollAd", true, 24, "");
		this.panel.parentNode.removeChild(this.panel);
		this.panel = null;
		
		// 统计用户关闭
		if(this.statistics.adclose)
		new Image().src = this.statistics.adclose;
	},
	
	// 
	hide:function(e){
		//this.removeEvent();
        this.isHidden = true;
		this.panel.style.display = "none";
		Core.Events.stopEvent(e);
		//this._nodes.entity.style.visibility="hidden";
		
		// 统计自动消失
		if(this.statistics.adend)
		new Image().src = this.statistics.adend;
	},
	
	// 
	show:function(){
        //console.log("浮动广告："+(this.relativeAd.isHidden));
        if(this.relativeAd && !this.relativeAd.isHidden){
            return;
        }
        this.isHidden = false;
		this.dialog.show();
		this.changeHeight();
		
		// 统计广告显示
		if(this.statistics.adstart){
            new Image().src = this.statistics.adstart;
        }
        //liming9-2012年7月18日 添加好耶代码统计
        //trace('11111');
        //commonLog('');
	},
	
	// 动态改变 标签的高度 防止与680广告冲突
	changeHeight:function(){
        if (scope && scope.$pageid == "articletj" || this.alienBox){
            var _h = 0;
            if (this.alienBox){
                _h = this.alienBox.offsetHeight;			// 随便看看的高度
            }
            
            var eyesize = this.__getDocumentSize();

            this.dialog.setPosition({
                x:	eyesize.width - this.dialog.entity.clientWidth,
                y:	_h + 75
            });
        }
	},

	// 
	changePos:function(twin){
		var dom = this.panel;
		var pos = Core.System.getScrollPos();
		
		var page = Core.System.pageSize();
		
		// 计算显示 比率
		var rat = (page[1]-page[3])/page[3];
		// 计算 滚动条实际的高度
		var scroll = page[3]-21*2;
		// 计算 滚动条 块状高度
		var height = parseInt(scroll/(rat+1));
		// 计算 当前 滚动条的移动距离
		var scrollPos = parseInt((scroll-height)*pos[0]/(page[1]-page[3]));
		
		var h = dom.clientHeight;
		// console.log("hhhh=="+h);
		if($IE6){					// 浮层 position 为 absolute
			// var top=pos[0]+scrollPos+parseInt(height/2)+21-parseInt(dom.clientHeight/2)+5+25;
			var top = pos[0]+scrollPos+parseInt(height/2)+20-h/2;
			// 纠正 位置
			var min = pos[0]>30?pos[0]:30;
			top = top<pos[0]?min:top;
			var max=page[1]-h;
			top = top<max?top:max;
		}else{						// 浮层 position 为 fixed
			// var top = scrollPos+parseInt(height/2)+21-parseInt(dom.clientHeight/2)+30;
			var top = scrollPos + parseInt(height/2)+20-h/2;
			// 纠正 位置
			// console.log(top);
			var min = pos[0] > 30 ? 0 : 30;
			// top = top>0?top:0;	
			top = top > min ? top : min;
			var win = twin || Core.System.winSize();
			var max = win.height - h;
			top = top < max ? top : max;
		}
		// console.log("change pos=="+top);
		return top;
	}
}).$mixProto(Lib.templateUtils);
