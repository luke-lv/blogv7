/**
 * @fileoverview 博客推荐
 * @author Cai Yue | caiyue0911@gmail.com
 * @created 2009-12-31
 */

$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/system/br.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/eventDispatcher.js");

$import("sina/core/function/bind2.js");
$import("sina/core/system/pageSize.js");
$import("sina/utils/io/jsload.js");
$import("sina/ui/panel.js");
$import("sina/ui/slide.js");

$import("sina/utils/cookie/getCookie.js");
$import("sina/utils/cookie/setCookie.js");

$import("lib/lib.js");
$import("other/sinaflash.js");

/**
 * BlogRecommendDialog is the "680" which could be got at the bottom-right corner.
 * Because of reserve slide activities, its Ui.Slide should be rewritten. Also the needed
 * style has been updated into "blog7style/css/blog/blog.css". 
 * All the relatively attributes started with "blogreco".
 */


Lib.BlogRecommendDialog = Core.Class.create();
Lib.BlogRecommendDialog.prototype = {
	template: [
		'<div class="blogreco" id="#{panel}">', 
			'<div id="#{frame}">',
			'<div class="TB" id="#{titleBar}">', 
				'<a id="blogNorAd_Cls" class="btnClose" style="position:absolute;left:240px;" href="javascript:">&nbsp;</a>', 
				'<a class="btnMin" style="position:absolute;left:220px;" id="#{btnMin}" href="javascript:">&nbsp;</a>', 
			'</div>', 
			'<div id="#{content}"></div>', 
			'</div>',
		'</div>'
	].join(""),
	
	contentUrl: '<iframe frameborder="0" scrolling="no" class="IF" src="http://blog.sina.com.cn/lm/mini/01.html"></iframe>',

	// BlogRecommendDialog needs a self Ui.Slide which has reserve abilities. To identify the original Ui.Slide
	name:				"blogRecoDialog",
	_slide:				null,
	_dialog:			null,			// the entity of BlogRecommendDialog
	_cookie: "dlg680",
	_mode:				null,
	_timePoints:		null,
	_toolbarHeight:		0,
	width: 260,
	height: 210,
	isMin:				false,
	displayState:		"max",
	closedADLayer:		null,
	closedFlashTemplate:"",
	_evt:				null,			// 事件处理器
	// 
	initialize: function(mode, timePoints, oParam) {
		var me = this;
		var nodes;
		this._mode = mode;
		this._timePoints = timePoints;
		this.oParam = oParam;
        this.isShowClosedAD = !(+oParam.code);
		
		// create entity of dialog
		if(!this._dialog){
			this._dialog = new Ui.Panel();
			this._dialog.setTemplate(this.template);
			nodes = this._dialog.nodes;
			nodes.btnClose = $E("blogNorAd_Cls");
			this._dialog.entity.style.zIndex = "100";
			this._dialog.ifm && (this._dialog.ifm.style.zIndex = "100");
			
			// this._dialog.setSize({'width': this.width, 'height': this.height});
			this._dialog.setContent(this.contentUrl);
			this._dialog.setFixed(true);
			this.setPos();
            // 注册关闭搜索浮层时更改博客推荐浮层的Top值
			if (scope.isFromSearchEngine){
                this._searchToQing();
            }
		}
		// 事件对象
		this._evt = new Core.Events.EventDispatcher(this);
		
		// bind event to button
		Core.Events.addEvent(nodes.btnClose, this.close.bind2(this));
		Core.Events.addEvent(nodes.btnMin, this.toggle.bind2(this));
		
		Core.Events.addEvent(window, function(){
			if(me._dialog && me._dialog.entity){
                var clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
                var clientHeight = document.documentElement.clientHeight || document.body.clientHeight
                var _x = Math.max(clientWidth) - me.width,
                    _y = Math.max(clientHeight) - me.height - me._toolbarHeight;
                // 搜索浮层显示时，需要更改广告浮层的Top高度
                if (scope.isFromSearchEngine){
                    _y -= 100;
                }
				me._dialog.setPosition({
					x: _x,
					y: _y
				});
			}
		}, "resize");
		
	},
	// 
	setPos:function(){
		// var pageSize = Core.System.pageSize();
		// var _x = Math.min(pageSize[2], document.documentElement.clientWidth) - this.width;
		// var _y = Math.min(pageSize[3], document.documentElement.clientHeight) - this.height - this._toolbarHeight;
		var w = document.documentElement.clientWidth || document.body.clientWidth;
		var h = document.documentElement.clientHeight || document.body.clientHeight;
		var _x = w - this.width;
   		var _y = h - this.height - this._toolbarHeight;
        // 搜索浮层显示时，需要更改广告浮层的Top高度
        if (scope.isFromSearchEngine){
            _y -= 100;
        }
		this._dialog.setPosition({
			x: _x,
			y: _y
		});
	},
	
	// 
	show:function(){
		var me = this;
		// cookie check
		//Utils.Cookie.setCookie(this._cookie, this._timePoints, 24, "/"); //liming9 2012年5月24日
		this._dialog.show();
		this._evt.dispatchEvent("show");		// 680 show 事件
		this.uiStatus = "2";
		// rewrite slide
		// this._slide = new Ui.Slide($E(this._dialog.nodes.frame.id));
		this._slide = new Ui.Slide($E(this._dialog.entity.id));
		// slide 组件的 ie6 兼容，否则会延长底部 200px 左右的空白。
		var cs = this._slide.container.style;
		if($IE6){
			cs.overflow = "visible";
			cs.height = 0;				// 底部 200px 空白
		}else{
			cs.position = "absolute";
		}
		this._slide.onSlideMax = function(){
			me._evt.dispatchEvent("max");		// 还需传递事件参数
		};
		this._slide.slideMax = function(){
			this.node.style.marginTop = this.offset + "px";
			new Ui.tween(this.node, "marginTop", 0, this.duration, this.animation, {
				tween:function(x){
					//trace(this.node.style.marginTop);
				}.bind2(this),
				end:	this.onSlideMax
			});
		}.bind2(this._slide);
		
		this._slide.onSlideMin = function(){
			me._evt.dispatchEvent("min");		// 还需传递事件参数
		};
		this._slide.slideMin = function() {			
			new Ui.tween(this.node, "marginTop", this.offset - 28, this.duration, this.animation, {
				tween:function(x){
					//trace(this.node.style.marginTop);
				}.bind2(this),
				end:	this.onSlideMin
			});
		}.bind2(this._slide);
		this._slide.slideIn = function() {
			new Ui.tween(this.node, "marginTop", this.offset, 5 * this.duration, this.animation, {
				tween:function(x){
					//trace(this.node.style.marginTop);
				}.bind2(this),
				end:	this.onSlideIn
			});
		}.bind2(this._slide);
		this._slide.onSlideIn = function(){
			Core.Dom.removeNode(this._dialog.entity);
			this._dialog.entity = null;
			me._evt.dispatchEvent("close");		// 还需传递事件参数

			setTimeout(function() {
				// 调整右侧大家在看位置!
				var rightADWrap = $E('rightADWrap');
				if(rightADWrap) {
					Core.Dom.setStyle(rightADWrap, 'right', '0');
				}
			}, 1000);

		}.bind2(this);
		this._slide.slideMax();

		// 2011 video 版
		if(!blogAd.getInitPermission(this.oParam)) return;
		this.oParam = this.oParam.ads[0];

		// 调整右侧大家在看位置!
		var rightADWrap = $E('rightADWrap');
		var rightWidth = this.width;
		if(rightADWrap) {
			Core.Dom.setStyle(rightADWrap, 'right', rightWidth + 'px');
		}
        
	},
	// 
	toggle:function(){
		if(this._dialog.nodes.btnMin){
			var clazz = this._dialog.nodes.btnMin.className;
			if (clazz == "btnMin") {
				clazz = "btnMax";
				this.uiStatus = "1";
				this._slide.slideMin();
			}else{
				clazz = "btnMin";
				this.uiStatus = "2";
				this._slide.slideMax();
			}
			this._dialog.nodes.btnMin.className = clazz;
			clazz = null;
			
			this.onToggle();
		}
	},
	// 推荐关闭窗口
	close:function(){
        Utils.Cookie.setCookie(this._cookie, new Date().getHours(), 24, "/");
		var me = this;
		me.uiStatus = "0";
		
		// 关闭按钮广告，不需要我们来维护了，终于解脱了！
        Lib.execZhitou(function(res){
            //放在推荐弹窗后边
            var ad = new sinaadToolkit.Box({
					position: "right bottom",
					width: 260,
					height: 210,
					follow: 1
				});
			ad.getMain().innerHTML = '<ins class="sinaads" id="PDPS000000025956" data-ad-status="async" data-ad-pdps="PDPS000000025956"></ins>';
			setTimeout(function(){
				(sinaads = window.sinaads || []).push({
					element : $E('PDPS000000025956'),
					params : {
						sinaads_success_handler : function () {
							ad.show();
							setTimeout(function () {
								ad.hide();
							}, 5000)
						}
					}
				});
			}, 1000);
        });
	
		this._slide.slideIn();
		
	},
	// 
	createNode:function(txt){
		var _box = $C("div");
		_box.innerHTML = txt;
		return _box.childNodes[0];
	},
	// 初始化关闭时显示的广告
	_initClosedAD:function(){
		// video 版		2011
		this.closedFlashTemplate = [
		'<div id="#{panel}">',
			'<div id="#{content}">',
				// '<iframe id="blogVideoAd" width="'+this.oParam.width+'" height="'+this.oParam.height+'" frameborder="0" scrolling="no"></iframe>',
				'<div id="blogVideoAd" width="'+this.oParam.width+'" height="'+this.oParam.height+'"></div>',
			'</div>',
		'</div>'
		].join("");
		this.closedADLayer = new Ui.Panel();
		this.closedADLayer.setTemplate(this.closedFlashTemplate);
		this.closedADLayer.entity.style.zIndex = "100";
		this.closedADLayer.__iframe && (this.closedADLayer.__iframe.style.zIndex = "100");
		var pageSize = Core.System.pageSize();
		// var _x = Math.min(pageSize[2], document.documentElement.clientWidth) - this.closedADLayer.width;
		// var _y = Math.min(pageSize[3], document.documentElement.clientHeight) - this.closedADLayer.height;
		var _x = Math.min(pageSize[2], document.documentElement.clientWidth) - this.oParam.width;
		var _y = Math.min(pageSize[3], document.documentElement.clientHeight) - this.oParam.height;
        // 搜索浮层显示时，需要更改广告浮层的Top高度
        if (scope.isFromSearchEngine){
            _y -= 100;
        }
		this.closedADLayer.setFixed(true).setPosition({
			x:	_x,
			y:	_y
		});
		var obj = this.oParam;
		var nodes = this.closedADLayer.nodes;
		var ctx = $E("blogVideoAd");
		if(!ctx) return;
		switch(obj.type){
			case "mixed":
				ctx.innerHTML = obj.content;
				trace(obj.content);
				break;
			case "pic":
				ctx.innerHTML = '<img src="'+obj.ref+'" style="width:'+obj.width+'px; height:'+obj.height+'px;" />';
				if(obj.click){
					ctx.style.position = "relative";
					nodes.cantSeeMe = this.createNode('<a href="#" target="_blank"></a>');
					nodes.cantSeeMe.href = obj.click;
					nodes.cantSeeMe.style.cssText
					= ($IE?"filter:alpha(opacity=0);":"opacity:0")
					+ "; height:"+obj.height+"px; width:"+obj.width+"px; background:#F00; display:block;"
					+ "z-index:1020; position:absolute; left:0; top:0;";
					ctx.appendChild(nodes.cantSeeMe);
				}
				break;
			case "swf":		// 盖一层 透明 div 绑定事件
				this.appendSwf(obj.ref, "", obj.width, obj.height, ctx.id);		// 事实上是 innerHTML 的
				if(obj.click){
					ctx.style.position = "relative";
					nodes.cantSeeMe = this.createNode('<a href="#" target="_blank"></a>');
					nodes.cantSeeMe.href = obj.click;
					nodes.cantSeeMe.style.cssText
					= ($IE?"filter:alpha(opacity=0);":"opacity:0")
					+ "; height:"+obj.height+"px; width:"+obj.width+"px; background:#F00; display:block;"
					+ "z-index:1020; position:absolute; left:0; top:0;";
					ctx.appendChild(nodes.cantSeeMe);
				}
				break;
		}
	},
	// 
	appendSwf:function(url, ObjId, width, height, targetId){
		// V_movie, x_id, X_width, Z_height, v_version, z_bgColor, i_useExpressInstall, c_quality, I_xir, l_redirectUrl, o_detectKey
		if(typeof sinaFlash == "undefined") return;
		var swfAdder = new sinaFlash(
			url,							// flash 的地址
			ObjId,							// 写入到页面后的 object id。
			width+"",						// 宽
			height+"",						// 高
			"9",							// flash 版本
			"#FFFFFF",						// flash 背景色
			false,							// 是否使用 flash 快速升级
			"High",							// 清晰度
			"http://www.sina.com.cn/",		// 快速升级 url
			"http://www.sina.com.cn/",		// 快速升级重定向 url
			false							// 是否检测flash
		);
		swfAdder.addParam("allowScriptAccess", "always");	// 是否允许脚本互访
		swfAdder.addParam("wmode", "transparent");			// 透明度，FF 下使用 window 模式。解决输入法问题。
		swfAdder.write(targetId);			// 写入容器的 id。
	},
	onToggle:function(){},
	/**
	 * 外部向 本对象实例绑定  事件处理函数 wujian 2011-3-8 广告开发
	 * 事件类型：
	 * 1、close 关闭
	 * 2、show  显示
	 * 3、scroll 滚动或者调整位置
	 * 4、min 最小化
	 * 5、max 最大化
	 */
	addEventListener:function(type,fun){
		this._evt.addEventListener(type,fun);
	},
	getHeight:function(){
		var flashAd = this.closedADLayer;
		var height = 0;
		if(this._dialog.entity){
			trace("dialog height");
			height = this._dialog.entity.clientHeight - parseInt(this._slide.node.style.marginTop);
			height > 0 ? height : 0;
			// 没有关闭flash的时候 680广告 在视觉上占据的空间
			trace("dialog height" + height);
		}
		
		if(flashAd){
			trace("flash height====")
			height = flashAd.clientHeight;
			trace("flash height====" + height);
		}
		return height;
	},
    //因为在tjAd.js里面加了一个全局变量scope.isFromSearchEngine,所以不再需要节点判断
	_searchToQing: function(){//如果是从搜索引擎进入到的博客正文页，将会显示qing发现iframe，将会影响KFC的广告，需要修改该广告位置
		var me = this;
		//关闭搜索浮层时，需要调整博客推荐浮层的Top值
		Core.Events.addEvent($E("serachToQingCloseBtn"), function(){
			if(scope.isFromSearchEngine){
				scope.isFromSearchEngine = !1;
                if(me._dialog && me._dialog.entity){
                    var y = Math.max(document.documentElement.clientHeight) - me.height - me._toolbarHeight,
                        x = Math.max(document.documentElement.clientWidth) - me.width;
                    me._dialog.setPosition({
                        x: x,
                        y: y
                    });
                }
                if(me.closedADLayer && me.closedADLayer.entity){
                    var closeADLayer = me.closedADLayer.entity;
                    var top = closeADLayer.style.top;
                    closeADLayer.style.top = parseInt(top)+100 + 'px';
                }
			}
		}, "click");
	}
};



