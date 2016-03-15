/**
 * @fileoverview 博客推荐广告
 * @author Book | liming9@staff
 * @created 2012年7月18日
 */
$import("sina/sina.js");
$import("sina/core/class/create.js");
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
$import("lib/commonLog.js");
$import("lib/execZhitou.js");
$import("other/sinaflash.js");
/**
 * BlogRecommendDialog is the "680" which could be got at the bottom-right corner.
 * Because of reserve slide activities, its Ui.Slide should be rewritten. Also the needed
 * style has been updated into "blog7style/css/blog/blog.css". 
 * All the relatively attributes started with "blogreco".
 */
Lib.ADBlogRecommendDialog = Core.Class.create();
Lib.ADBlogRecommendDialog.prototype = {
	template: [ //调整flash广告层，将flash广告层下移，更改此层必须先知会董靖和永莉 by wangqiang1@staff
	'<div id="#{panel}" class="popBox">',
		'<div id="#{frame}" class="popBox_bg">',
			'<div id="#{popFlashContent}" class="popFlash" style="z-index:10;">',
				'<a target="_blank" id="#{clickURL}" style="display:none;position:absolute;"></a>',
			'</div>',
			'<div id="#{popMain_bg}" class="popMain_bg" style="z-index:11;"></div>',
			'<div class="popMain" style="z-index:12">',
				'<div id="#{content}">',
				'</div>',
			'</div>',
			'<div id="#{titleBar}" class="popBox_btn" style="z-index:12;">',
				'<a id="#{btnMin}" href="#" onclick="return false;" title="" class="mini"></a>',
				'<a id="blogNorAd_Cls" href="#" onclick="return false;" title="" class="close"></a>',
			'</div>',
		'</div>',
	'</div>'].join(""),
	
	//http://p4p.sina.com.cn/test/sina/ftp/xuyafeng/boke/index11.html
	contentUrl: '<iframe style="width:100%;height:185px;" allowtransparency="yes" frameborder="0" scrolling="no" src="http://blog.sina.com.cn/lm/mini/noborder/01.html"></iframe>',
	
	// BlogRecommendDialog needs a self Ui.Slide which has reserve abilities. To identify the original Ui.Slide
	name:				"blogRecoDialog",
	_slide:				null,
	_dialog:			null,			// the entity of BlogRecommendDialog
	_cookie:			"ad680",
	_mode:				null,
	_timePoints:		null,
	flashURL:			"",
	picURL:				"",
	flashWidth:			0,
	flashHeight:		0,
	tjURL:				"",
	btnURL:				"",
	clickURL:			"",
	_toolbarHeight:		0,
	width:				262,
	height:				255,
	isMin:				false,
	displayState:		"max",
	closedADLayer:		null,
	closedFlashTemplate:"",
	_evt:				null,			// 事件处理器
	// 
	initialize:function(mode, timePoints, picURL, flashURL, flashWidth, flashHeight, tjURL, btnURL, clickURL, oParam){
		var me = this;
		var nodes;
		this._mode = mode;
		this.flashURL = flashURL;
		this.picURL = picURL;
		this.flashWidth = flashWidth;
		this.flashHeight = flashHeight;
		this.tjURL = tjURL;
		this.btnURL = btnURL;
		this.clickURL = clickURL;
		this._timePoints = timePoints;
		this.oParam = oParam;
		if (!(+oParam.code)){
            this.isShowClosedAD = true;
        }
		// create entity of dialog
		if(!this._dialog){
			this._dialog = new Ui.Panel();
			this._dialog.setTemplate(this.template);
			nodes = this._dialog.nodes;
			nodes.btnClose = $E("blogNorAd_Cls");
			this._dialog.entity.style.zIndex = "1000";
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
                var y = Math.max(document.documentElement.clientHeight) - me.height - me._toolbarHeight,
                    x = Math.max(document.documentElement.clientWidth) - me.width;
                if (scope.isFromSearchEngine){
                    //发现浮层的问题，浮层的高度为 100 px  需要把Top的值改一下
                    y -= 100;
                }
				me._dialog.setPosition({
					x: x,
					y: y
				});
			}
		}, "resize");
		!this.clickURL && this.initFlashAD(nodes.popFlashContent.id);
	},
	// 
	setPos:function(){
		var w = document.documentElement.clientWidth || document.body.clientWidth;
		var h = document.documentElement.clientHeight || document.body.clientHeight;
		var _x = w - this.width;
		var _y = h - this.height - this._toolbarHeight;
 		if (scope.isFromSearchEngine){
			_y -= 100;
		}
        // console.log(_x);
        // console.log(_y);
		this._dialog.setPosition({
			x: _x,
			y: _y
		});
	},
	// 
	initFlashAD:function(nodeID){
		var sinaFlash2 = new sinaFlash(
			this.flashURL,
			"popSmallFlash",
			this.flashWidth,
			this.flashHeight,
			"8",
			"#FFFFFF",
			false,
			"High",
			"http://www.sina.com.cn/",
			"http://www.sina.com.cn/",
			false
		);
		sinaFlash2.addParam("allowScriptAccess", "always");
		sinaFlash2.addParam("wmode", "transparent");
		sinaFlash2.write(nodeID);
	},
	// 
	show:function(){
		var nodes = this._dialog.nodes;
		nodes.frame.style.backgroundImage = "url("+this.picURL+")";
		nodes.btnClose.style.backgroundImage = "url("+this.btnURL+")";
		nodes.btnMin.style.backgroundImage = "url("+this.btnURL+")";
		nodes.popMain_bg.style.backgroundImage = "url("+this.tjURL+")";
		if(this.clickURL){
			nodes.clickURL.style.display = "";
			nodes.clickURL.style.width = (this.flashWidth || 260)+"px";
			nodes.clickURL.style.height = (this.flashHeight || 50)+"px";
			nodes.clickURL.href = this.clickURL;
		}
		var me = this;
		// cookie check
		//Utils.Cookie.setCookie(this._cookie, this._timePoints, 24, "/"); //liming9-不关闭就一直显示 2012年5月24日
		this._dialog.show();
		this._evt.dispatchEvent("show");		// 680 show 事件
		this.uiStatus = "2";
		// rewrite slide
		// this._slide = new Ui.Slide($E(this._dialog.nodes.frame.id));
		this._slide = new Ui.Slide($E(this._dialog.entity.id));
		// slide 组件的 ie6 兼容，否则会延长底部 200px 左右的空白。
		var cs = this._slide.container.style;
		// 修改IE底部多一块空白的问题 zhihang1@2014-12-18
		cs.top = '0px';
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
			new Ui.tween(this.node, "marginTop", this.offset - 55, this.duration, this.animation, {
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
/* 与底通冲突-》下线20140414
			setTimeout(function() {
				// 调整右侧大家在看位置!
				var rightADWrap = $E('rightADWrap');
				if(rightADWrap) {
					Core.Dom.setStyle(rightADWrap, 'right', '0');
				}
			}, 1000);
*/			

		}.bind2(this);
		this._slide.slideMax();
		// 2011 video 版
		if(!blogAd.getInitPermission(this.oParam)) return;
		this.oParam = this.oParam.ads[0];

        //liming9-2012年7月18日 添加好耶代码统计
        //trace('22222');
        commonLog('http://1088.adsina.allyes.com/main/adfshow?user=AFP6_for_SINA|2012_add|2012_blog_fdtc_bk&db=sina&border=0&local=yes&js=ie');
//        if(this.oParam.logurl){
//            new Image().src = this.oParam.logurl;
//        }
		
		// 调整右侧大家在看位置!
		var rightADWrap = $E('rightADWrap');
		if(rightADWrap) {
			Core.Dom.setStyle(rightADWrap, 'right', '260px');
		}

	},
	// 
	toggle:function(){
		if(this._dialog.nodes.btnMin){
			if(this.displayState=="max"){
				this.uiStatus = "1";
				this._slide.slideMin();
				this.displayState = "min";
			}else{
				this.uiStatus = "2";
				this._slide.slideMax();
				this.displayState = "max";
			}
			this.onToggle();
		}
	},
	// 
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
					height: 190,
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
							}, 5000);
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
		if(flashAd && flashAd.entity.style.display != "none"){
			trace("flash height====");
			// height = flashAd.height;
			height = this.oParam.height;
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



