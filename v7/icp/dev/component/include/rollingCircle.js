/**
 * @fileoverview
 *	循环滚动
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/dom/getStyle.js");
$import("sina/core/dom/contains.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/events/fixEvent.js");
$import("sina/core/events/removeEvent.js");

$import("lib/app.js");

App.rollingCircle = Core.Class.create();
/**
 * 
 * @param {String|HTMLElement} sContainer	容器的ID，容器必须固定高度(style.height)，且设置overflow:hidden;
 * @param {String} sData	字符串，包含循环滚动的所有数据 HTML
 * @param {JSONObject} oOption	循环滚动的其他选项
 * 	{
 * 		containerHeight	容器高度,必选值,单位像素
 * 		timer			滚动时间间隔,可选值,单位毫秒,默认值5000表示每5秒滚动一次
 * 		direction		滚动方向,可选值up|down|left|right,默认值up
 * 	}
 */
App.rollingCircle.prototype = {
	// 默认配置
	defaultConfig	: {
//		containerHeight	: 200,
		timer			: 6000,
		direction		: "up",
		speed			: 20
	},
	// 初始化参数
	initialize	: function (sContainer, sData, oOption){
		this.container = $E(sContainer);
		if(sData != null || sData != ""){
			this.container.innerHTML = sData;
		}
		this.config = oOption || {};
		for(var key in this.defaultConfig){
			if(this.config[key] == null){
				this.config[key] = this.defaultConfig[key];
			}
		}
		this.config.containerHeight = window.parseInt(Core.Dom.getStyle(this.container, "height"));
		this.contentHeight = this.container.scrollHeight;
		this.content = this.container.innerHTML.replace(/^<div[^>]+>/i, "");
		var _newContent = this.container.innerHTML.replace(/<\/div>$/i, this.content);
		this.container.innerHTML = _newContent;
		this.step = Math.floor(this.config.containerHeight / this.config.speed);

		this.reset();
		var __this = this;
		
		// 指定时间后启动
		this.timer = setTimeout(function (){
			__this.gotoNext();
		}, this.config.timer);
	},
	// 开始滚动动画效果
	scrollExec	: function (){
		var __this = this;
		this.pix = 1;
		this.scroll = setInterval(function (){
			if(__this.pix <= __this.config.speed){
				__this.container.scrollTop += __this.step;
				__this.pix ++;
			}else{
				__this.container.scrollTop += (__this.config.containerHeight - __this.step * __this.config.speed);
				clearInterval(__this.scroll);
				__this.pix = null;
				// 开始下一次滚动的计时

				__this.timer = setTimeout(function (){
					__this.count ++;
					if(__this.container.scrollTop >= __this.contentHeight){
						__this.reset();
					}
					__this.gotoNext();
				}, __this.config.timer);
			}
		}, 10);
	},
	gotoNext	: function (){
		if(this.pix != null){return;}
		if(this.timer != null){
			clearTimeout(this.timer);
			this.timer = null;
		}
//		trace("Go To Next " + this.count +" ...");
		this.scrollExec();
	},
	reset	: function (){
		this.container.scrollTop = 0;
		this.pix = null;
		this.timer = null;
		this.count = 1;
	}
};