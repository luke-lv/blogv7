/*
 * Copyright (c) 2009, Sina Inc. All rights reserved. 
 * @ClassName Dialog
 * @FileOverview 对话框类
 * @Author Random | YangHao@staff.sina.com.cn
 * @Created 2009-03-24
 * @updated 2009-05-15
 * @Updated 2009-06-01
 */

$import("sina/sina.js");
$import("sina/ui/dialog/layer.js");
$import("sina/ui/dialog/dialogDisplaySet.js");
$import("sina/ui/drag3.js");
$import("sina/core/system/parseParam.js");
$import("sina/core/system/winSize.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/system/br.js");

/**
 * @param {String} template 模板的HTML
 */
var Dialog=function(template){
	var _this=this;
	_this.entity=null;
	_this.ifm=null;
	var Property={
		id:"",
		x:0,
		y:0,
		width:0,
		height:0,
		isFixed:false,
		layer:new Layer(template),
		template:template,
		canDrag:false,
		dragEntity:null,
		name:"",
		uniqueID:"",
		isShow:false,
		nodes:{},
		focusNode:null,
		
		/**
		 * 对话框呈现的模式
		 * 		"normal" 正常显示
		 * 		"alpha" 渐显(隐)效果
		 */
		displayMode:"normal",
		
		/**
		 * 当前的特效显示(隐藏)是否在进行
		 */
		_modeDisplayRuning:false,
		
		/**
		 * 当前实例是否可用
		 */
		enabled:true
	};
	
	this.getProperty = function(){
		return Property;
	};
	
	(function initialize(){
		var p = _this.getProperty();
		var i;
		p.uniqueID=p.layer.getProperty().uniqueID;
		p.id=p.uniqueID+"_dialog";
		p.nodes=_this.getNodes();
		_this.entity=p.layer.entity;
		_this.ifm=p.layer.ifm;
		p.width=parseInt(_this.entity.style.width);
		
		
		//设置Dialog通过标题栏来拖动
		if (p.nodes.titleBar) {
			p.dragEntity = new Ui.Drag3(p.nodes.titleBar, _this.ifm ? [_this.ifm, _this.entity] : [_this.entity]);
			p.nodes.titleBar.style.cursor = "move";
			Core.Events.addEvent(p.nodes.titleBar, function(){
				return false;
			}, "selectstart");
			
			p.dragEntity.onDrag=function(){
				_this.onDrag();
			};
		}
		
		//窗体大小改变时，将fixed的对话框置于居中位置
		Core.Events.addEvent(window,function(){
			if(p.isShow && p.isFixed){
				var win = Core.System.winSize();
				var _x=win.width/2-_this.getWidth()/2;
				var _y=win.height/2-_this.getHeight()/2;
				_x=_x<0?0:_x;
				_y=_y<0?0:_y;
				_this.setPosition({x:_x,y:_y});
			}
		},"resize");
		
	})();
	
};

Dialog.prototype={
	
	/**
	 * 设置对象的位置，继承于Layer类
	 * opts.x:[number]
	 * opts.y:[number]
	 */
	setPosition:function(opts){
		var p = this.getProperty();
		Core.System.parseParam(p,opts);
		this.getProperty().layer.setPosition(opts);
	},
	
	/**
	 * 设置对象的高度和宽度，继承于Layer类
	 * opts.width:number
	 * opts.height:number
	 */
	setSize:function(opts){
		var p = this.getProperty();
		Core.System.parseParam(p,opts);
		p.layer.setSize(opts);
	},
	
	/**
	 * 设置对象是否在滚动条滚动的时候相对于屏幕位置不改变，继承于Layer类
	 * @param {Bool} isFixed
	 */
	setFixed:function(isFixed){
		var p = this.getProperty();
		p.isFixed=isFixed;
		this.getProperty().layer.setFixed(p.isFixed);
	},
	
	/**
	 * 设置Dialog中content的innerHTML值，继承于Layer类
	 * @param {String} sHTML 
	 */
	setContent:function(sHTML){
		var p = this.getProperty();
		this.getProperty().layer.setContent(sHTML);
	},

	/**
	 * 设置模板，继承于Layer类
	 * @param {String} template 模板的HTML
	 */
	setTemplate:function(template){
		var p = this.getProperty();
		p.template=template;
		p.layer.setTemplate(p.template);
	},
	
	/**
	 * 设置对象是否可以拖动
	 * @param {Bool} canDrag
	 */
	setDrag:function(canDrag){
		var p = this.getProperty();
		p.canDrag=canDrag;
		if(p.canDrag){
			p.dragEntity.capture();
		}else{
			p.dragEntity.release();
		}
	},
	
	/**
	 * 获取宽度，继承于Layer类
	 */
	getWidth:function(){
		return this.getProperty().layer.getWidth();
	},
	
	/**
	 * 获取高度，继承于Layer类
	 */
	getHeight:function(){
		return this.getProperty().layer.getHeight();
	},
	
	/**
	 * 获取横坐标，继承于Layer类
	 */
	getX:function(){
		return this.getProperty().layer.getX();
	},
	
	/**
	 * 获取纵坐标，继承于Layer类
	 */
	getY:function(){
		return this.getProperty().layer.getY();
	},
	
	/**
	 * 显示对象
	 */
	show:function(mode){
		var p=this.getProperty();
		var _this=this;
		
		p.isShow=true;
		if (this.ifm) {
			this.ifm.style.display = "";
		}
		this.onShow();
		
		if (p.displayMode == "normal" || mode == "normal") {
			this.entity.style.display="";
		}
		else {
			p._modeDisplayRuning = true;
			p.enabled = false;
			
			this._showWithMode(function(){
				p._modeDisplayRuning = false;
				p.enabled = true;
				
				if (_this.onDisplaied) {
					_this.onDisplaied();
				}
			});
		}
	},
	
	/**
	 * 关闭对象
	 */
	close:function(mode){
		var _this=this;
		var p=this.getProperty();

		if(p.displayMode=="normal" || mode=="normal"){
			p.isShow=false;
			p.layer.hidden();
			this.destroy();
			this.onClose();
			if (_this.onDisplayFinished) {
				_this.onDisplayFinished();
			}
			
		}else if(!p._modeDisplayRuning){
			p._modeDisplayRuning=true;
			p.enabled=false;
			this._hiddenWithMode(function(){
				p.isShow=false;
				p.layer.hidden();
				p._modeDisplayRuning=false;
				p.enabled=true;
				_this.destroy();
				_this.onClose();
				
				if (_this.onDisplayFinished) {
					_this.onDisplayFinished();
				}
			});
		}
	},
	
	/**
	 * 隐藏对象
	 */
	hidden:function(mode){
		var _this=this;
		var p=this.getProperty();
		
		if(p.displayMode=="normal" || mode=="normal"){
			p.isShow=false;
			p.layer.hidden();
			this.onHidden();
			if (_this.onDisplayFinished) {
				_this.onDisplayFinished();
			}
		}else if(!p._modeDisplayRuning){
			p._modeDisplayRuning=true;
			p.enabled=false;
			this._hiddenWithMode(function(){
				p.isShow=false;
				p.layer.hidden();
				_this.onHidden();
				p._modeDisplayRuning=false;
				p.enabled=true;
				
				if (_this.onDisplayFinished) {
					_this.onDisplayFinished();
				}
			});
		}
	},
	
	/**
	 * 根据模式显示
	 */
	_showWithMode:function(callBack){
		var p=this.getProperty();
		var win = Core.System.winSize();
		var _this=this;
		
		switch(p.displayMode){
			
			//渐显效果
			case "alpha":
				DialogDisplaySet["alpha"].show(this.entity,20,callBack);
				break;
		}
	},
	
	/**
	 * 根据模式隐藏
	 */
	_hiddenWithMode:function(callBack){
		var p=this.getProperty();
		var _this=this;
		var win = Core.System.winSize();
		
		switch(p.displayMode){
		
			//渐隐效果
			case "alpha":
				DialogDisplaySet["alpha"].hidden(this.entity,20,callBack);
				break;
		}

	},
	
	/**
	 * 销毁对象
	 */
	destroy:function(){
		
		//修复在IE6下移除Iframe会使窗体中的控件丢失焦点的BUG
		try {
			if (this.getProperty().nodes.iframe) {
				this.getProperty().nodes.iframe.src = "";
			}
		}catch(ex){}
		
		this.entity && this.entity.parentNode.removeChild(this.entity);
		this.entity=null;
		if (this.ifm) {
			this.ifm.parentNode.removeChild(this.ifm);
			this.ifm = null;
		}
	},
	
	/**
	 * 当对象显示的时候执行
	 */
	onShow:function(){
	},
	
	/**
	 * 当对象关闭的时候执行
	 */
	onClose:function(){
	},
	
	/**
	 * 当对象隐藏的时候执行
	 */
	onHidden:function(){
	},
	
	/**
	 * 当对象被拖动的时候执行
	 */
	onDrag:function(){

	},
	
	/**
	 * 特效展示完全后触发
	 */
	onDisplaied:function(){
		
	},
	
	/**
	 * 特效消失完全后触发
	 */
	onDisplayFinished:function(){
		
	},
	
	/**
	 * 设置当对象拖动时，是否将其限制在窗口的可视区域内
	 * @param {Bool} state
	 */
	setAreaLocked:function(state){
		var p = this.getProperty();
		p.dragEntity.isLock=state;
		var _this=this;
		if(state){
			_this._updateLockArea();
			Core.Events.addEvent(window,function(){
				_this._updateLockArea();
			},"resize");
		}
	},
	
	/**
	 * 根据窗口的可视区域来更新当前对象拖动时要限制的坐标区域
	 */
	_updateLockArea:function(){
		var p = this.getProperty();
		var win = Core.System.winSize();
		if (p.isFixed) {
			if($IE6){
				p.dragEntity.lockArea = {
					left: document.documentElement.scrollLeft,
					right: document.documentElement.scrollLeft + win.width,
					top: document.documentElement.scrollTop,
					bottom: document.documentElement.scrollTop + win.height
				};
								
				Core.Events.addEvent(window,function(){
					p.dragEntity.lockArea = {
						left: document.documentElement.scrollLeft,
						right: document.documentElement.scrollLeft + win.width,
						top: document.documentElement.scrollTop,
						bottom: document.documentElement.scrollTop + win.height
					};
				},"scroll");
				Core.Events.addEvent(window,function(){
					p.dragEntity.lockArea = {
						left: document.documentElement.scrollLeft,
						right: document.documentElement.scrollLeft + win.width,
						top: document.documentElement.scrollTop,
						bottom: document.documentElement.scrollTop + win.height
					};
				},"resize");
			}else{
				p.dragEntity.lockArea = {
					left: 0,
					right: win.width,
					top: 0,
					bottom: win.height
				};
			}
		}else{
			p.dragEntity.lockArea = {
				left: 0,
				right: document.documentElement.scrollWidth,
				top: 0,
				bottom: document.documentElement.scrollHeight
			};
		}
	},
	
	/**
	 * 修复在FF2下设置position="fixed"的问题，继承于Layer类
	 */
	updateFixed:function(){
		this.getProperty().layer.updateFixed();
	},
	
	/**
	 * 根据模板获取所有可用节点，继承于Layer类	
	 * @param {String} mode "o":返回对象的属性为dom对象(默认)
	 * 						"i":返回对象的属性为dom对象的ID
	 */
	getNodes:function(mode){
		return this.getProperty().layer.getNodes(mode);
	},
	
	/**
	 * 设置聚焦
	 */
	setFocus:function(){
		var p=this.getProperty();
		if(p.focusNode && p.focusNode.style.display!="none"){
			try {
				p.focusNode.focus();
			}catch(ex){
				
			}
		}else if(this.entity.style.display!="none"){
			this.entity.focus();
		}
	},
	
	/**
	 * 获取唯一ID，继承于Layer类
	 */
	getUniqueID:function(){
		return this.getProperty().layer.getUniqueID();
	}
};