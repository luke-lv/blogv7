/**
 * @fileoverview
 *	延迟加载类定义
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 * @example
	// 图片延迟加载
	Lib.LazyLoad([$E("img1"), $E("img2"), $E("img3")], {
		callback	: function (o) {
			o.src = o.getAttribute("real_src");
		}
	});
 * 
 */
$import("sina/sina.js");
//$import("sina/core/array/without.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/system/pageSize.js");
$import("sina/core/system/winSize.js");
$import("sina/core/system/br.js");

$import("lib/lib.js");

(function(){
	
	function LazyLoad(oObjects, oOptions){
		this.node = oObjects;
		this.config = oOptions;
		for(var key in this.defaultConfig){
			this.config[key] = this.defaultConfig[key];
		}
		this.initialize();
		return this;
	}
	LazyLoad.prototype = {
		// 默认配置选项
		defaultConfig : {
			preloadPixel : 500  // 预加载的高度（相对于当前可视区域），单位：像素
		},
		initialize : function (){
			// 取得需要预加载的区域高度
			this.viewableHeight = LazyLoadListener.getViewableHeight();
			// 注册自己到监听器
			LazyLoadListener.enrol(this);
		},
		callback : function (nHeight){
			if(this.node.length == 0){ return; }
			this.viewableHeight = nHeight || this.viewableHeight;
			// trace("当前屏幕高度 : " + (this.viewableHeight + this.config.preloadPixel) + " px");
			var remanent = [];	// 尚未加载的对象
			for(var i = 0, len = this.node.length; i < len; i ++){//Debug.dir(this.node[i]);return;
				if(this.node[i] && this.node[i].dom == null
					&& Core.Dom.getXY(this.node[i])[1] < this.viewableHeight + this.config.preloadPixel){
					this.config.callback(this.node[i]);
					this.node[i] = null;
				}else if(this.node[i] && this.node[i].dom
					&& Core.Dom.getXY(this.node[i].dom)[1] < this.viewableHeight + this.config.preloadPixel){
					this.node[i].callback(this.node[i].dom);
					this.node[i] = null;
				}else{
					remanent.push(this.node[i]);
				}
			}
			this.node = remanent;
		}
	};
	
	var LazyLoadListener = {
		// 监听器是否初始化
		_isInit : null,
		// 当前 onscroll、onresize 绑定的对象
		_binder : null,
		// 当前监听事件是否绑定的是窗口对象
		_isWindow : null,
		// 被监听后回调的 LazyLoad 类实例合集
		_member : [],

		// 初始化监听器
		initialize : function () {
			var container = window,
			isWindow = container == window || container == document
		            || !container.tagName || (/^(?:body|html)$/i).test(container.tagName);
			if(isWindow) {
				var doc = container.document;
				container = (doc.compatMode == 'CSS1Compat' && ($IE || $FF || $OPERA)) ? doc.documentElement : doc.body;
			}
			this._container = container;
			this._binder = isWindow ? window : container;
			this._isWindow = isWindow;
			this._isInit = true;
			
			this.delayResize();			
			this.bindEvent();
		},
		// 取得可见区域下边缘的像素值
		getViewableHeight : function(){
			var eyeableHeight = LazyLoadListener._container.scrollTop + Core.System.winSize().height;
			this.eyeableHeight = eyeableHeight;
			return eyeableHeight;
		},
		// 绑定浏览器监听事件
		bindEvent : function (){
			if(!this._isInit){
				this.initialize();return;
			}
			Core.Events.addEvent(this._binder, LazyLoadListener.delayLoad, "scroll");
			if(this._isWindow){
				Core.Events.addEvent(this._binder, LazyLoadListener.delayResize, "resize");
			}
			this.binded = true;
		},
		// 取消绑定浏览器监听事件
		unbindEvent : function (){
			Core.Events.removeEvent(LazyLoadListener._binder, LazyLoadListener.delayLoad, "scroll");
			if(this._isWindow){
				Core.Events.removeEvent(LazyLoadListener._binder, LazyLoadListener.delayResize, "resize");
			}
			this.binded = false;
		},
		// 滚动时触发
		delayLoad : function (){
			if(LazyLoadListener.scrollWatch){
				clearTimeout(LazyLoadListener.scrollWatch);
			}
			LazyLoadListener.scrollWatch = setTimeout(function (){
				LazyLoadListener.callback();
				clearTimeout(LazyLoadListener.scrollWatch);
				LazyLoadListener.scrollWatch = null;
			}, 100);
		},
		// 缩放窗口时触发
		delayResize : function (){
			if(LazyLoadListener.resizeWatch){
				clearTimeout(LazyLoadListener.resizeWatch);
			}
			LazyLoadListener.resizeWatch = setTimeout(function (){
				LazyLoadListener.callback();
				clearTimeout(LazyLoadListener.resizeWatch);
				LazyLoadListener.resizeWatch = null;
			}, 100);
		},
		// 注册到监听器
		enrol : function (oLazy) {
			LazyLoadListener._member.push(oLazy);
//			trace("LazyLoadListener._member : " + LazyLoadListener._member.length);
		},
		// 反注册到监听器
//		disenrol : function (oLazy) {
////			LazyLoadListener._member = Core.Array.without(LazyLoadListener._member, [oLazy]);
//		},
		callback : function () {
			LazyLoadListener.getViewableHeight();
			if(LazyLoadListener._member.length > 0){
				for(var i = 0, len = LazyLoadListener._member.length; i < len; i ++){
					LazyLoadListener._member[i].callback(LazyLoadListener.eyeableHeight);
				}
			}
			if(LazyLoadListener.eyeableHeight == Core.System.pageSize()[1]){
//				Debug.log("已经到页面底部，停止滚动");
				LazyLoadListener.unbindEvent();
			}
		}
	};
	
	// 封装的对外方法
	Lib.LazyLoad = function (oObjects, oOptions){
		if(LazyLoadListener.binded != true){
			LazyLoadListener.bindEvent(oObjects, oOptions);
		}
		new LazyLoad(oObjects, oOptions);
	};
})();