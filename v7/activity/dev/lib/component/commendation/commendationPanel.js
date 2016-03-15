/**
 * @fileoverview 推荐面板类
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-10
 */
$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/system/winSize.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");

$import("lib/panel.js");
$import("lib/bubbleDisplay.js");
$import("lib/component/commendation/commendationTemplate.js");


/**
 * 推荐面板类,继承于Panel类
 */
scope.CommendationPanel=Core.Class.create();
scope.CommendationPanel.prototype={
	/**
	 * 所继承的父类对象
	 */
	panel:null,
	
	/**
	 * 显示时间
	 */
	showingTime:-1,
	
	/**
	 * 显示状态
	 * 		"show"
	 * 		"hidden"
	 * 		"showing"
	 * 		"hiddening"
	 */
	state:"hidden",
	
	/**
	 * 显示的优先级
	 */
	priority:1,
	
	/**
	 * 最大化时的模板
	 */
	maxTemplate:"",
	
	/**
	 * 最小化时的模板
	 */
	minTemplate:"",
	
	/**
	 * 最大化时的位置
	 */
	maxPosition:{},
	
	/**
	 * 标题
	 */
	title:"",
	
	/**
	 * 内容
	 */
	content:"",
	
	/**
	 * 初始化
	 */
	initialize:function(){
		this.panel=new Lib.Panel();
		this.panel.setTemplate(scope.commendationTemplate);
		this.panel.setFixed(true);
		this.panel.hidden();
		
		//初始化最大化和最小化模板
		this.maxTemplate=scope.commendationTemplate;
		this.minTemplate='<div id="#{panel}">最小化的默认模板</div>';
		
		var nodes=this.panel.getNodes();
		var _this=this;
		
		//设置关闭按钮的事件
		Core.Events.addEvent(nodes["btnClose"],function(){
			if (_this.state == "show") {
				_this.hidden();
			}
		},"click");
		
		//设置点击内容后面板隐藏
		Core.Events.addEvent(nodes["content"],function(){
			if (_this.state == "show") {
				_this.hidden();
			}
		},"click");
		
		Core.Events.addEvent(nodes["btnMin"],function(){
			_this.min();
		},"click");
		
	},
	
	/**
	 * 设置标题
	 * @param {String} title 标题文字
	 */
	setTitle:function(title){
		var nodes=this.panel.getNodes();
		nodes["title"].innerHTML=title;
	},
	
	/**
	 * 设置内容
	 * @param {String} cotent 内容
	 */
	setContent:function(content){
		var nodes=this.panel.getNodes();
		nodes["content"].innerHTML=content;
	},
	
	/**
	 * 设置位置
	 * @param {Number} x 横坐标
	 * @param {Number} y 纵坐标
	 */
	setPosition:function(x,y){
		this.x=x;
		this.y=y;
		this.panel.setPosition(x,y);
	},
	
	/**
	 * 设置是否fixed方式(不随屏幕滚动)呈现
	 * @param {Boolean} state
	 */
	setFixed:function(state){
		this.panel.setFixed(state);
	},
	
	/**
	 * 最大化
	 */
	max:function(){
		this.panel.setTemplate(this.maxTemplate);
		this.setPosition(this.x,this.maxPosition.y);
		this.setTitle(this.title);
		this.setContent(this.content);
		this.setFixed(true);
		
		var _this=this;
		var nodes=this.panel.getNodes();
		//设置关闭按钮的事件
		Core.Events.addEvent(nodes["btnClose"],function(){
			if (_this.state == "show") {
				_this.hidden();
			}
		},"click");
		
		//设置点击内容后面板隐藏
		Core.Events.addEvent(nodes["content"],function(){
			if (_this.state == "show") {
				_this.hidden();
			}
		},"click");
		
		//最小化按钮事件
		Core.Events.addEvent(nodes["btnMin"],function(){
			_this.min();
		},"click");
	},
	
	/**
	 * 最小化
	 */
	min:function(){
		//获取最大化时的面板高度
		var maxH=this.panel.entity.offsetHeight;
		
		this.panel.setTemplate(this.minTemplate);
		this.setFixed(true);
		
		var _this=this;
		var nodes=this.panel.getNodes();
		
		//更新显示位置
		var minH=this.panel.entity.offsetHeight;
		var y=this.y + maxH - minH;
		this.setPosition(this.x,y);
		
		//最大化按钮事件
		Core.Events.addEvent(nodes["btnMax"],function(){
			_this.max();
		},"click");
		//关闭按钮事件
		Core.Events.addEvent(nodes["btnClose"],function(){
			if (_this.state == "show") {
				_this.hidden();
			}
		},"click");
	},
	
	/**
	 * 显示对象
	 */
	show:function(){
		this.panel.show();
		this.state="showing";
		var win = Core.System.winSize();
		var x = win.width - this.panel.entity.offsetWidth;
		var y = win.height - this.panel.entity.offsetHeight;
		this.setPosition(x, y);
		
		
		Lib.BubbleDisplay.show(this.panel.entity,3,callBack);
		Lib.BubbleDisplay.show(this.panel.backIframe,3);
		
		//回调方法
		var _this=this;
		function callBack(){
			//根据显示时间设置对象是否在指定时间内自动隐藏
			if(_this.showingTime!=-1){
				window.setTimeout(function(){
					if (_this.state == "show") {
						_this.hidden();
					}
				},_this.showingTime);
			}
			
			//获取当前坐标为最大化时的坐标
			_this.maxPosition.x=_this.x;
			_this.maxPosition.y=_this.y;
			
			//更新显示状态
			_this.state="show";
			_this.onShow();
		}
	},
	
	/**
	 * 隐藏对象
	 */
	hidden:function(){
		this.state="hiddening";
		
		Lib.BubbleDisplay.hidden(this.panel.entity,3,callBack);
		Lib.BubbleDisplay.hidden(this.panel.backIframe,3);
		
		//更新显示状态
		var _this=this;
		function callBack(){
			_this.state="hidden";
			_this.onHidden();
		}
	},
	
	/**
	 * 显示时的事件
	 */
	onShow:function(){
		
	},
	
	/**
	 * 隐藏时的事件
	 */
	onHidden:function(){
		
	}
};
	