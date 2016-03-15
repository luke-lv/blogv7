/**
 * Copyright (c) 2009, Sina Inc. All rights reserved. 
 * @ClassName BackShadow
 * @FileOverview 背景阴影类
 * @Author Random | YangHao@sina.staff.com.cn
 * @Created 2009-03-24
 */

$import("sina/sina.js");
$import("sina/core/system/br.js");
$import("sina/core/dom/setStyle.js");
$import("sina/core/events/addEvent.js");

var BackShadow=function(opacity){
	this.entity=null;
	this.isShow=false;
	
	this._ie6Fixed=function(){
		if (_this.entity) {
			_this.entity.style.top = document.documentElement.scrollTop + "px";
			_this.entity.style.left = document.documentElement.scrollLeft + "px";
			if (_this.ifm) {
				_this.ifm.style.top = _this.entity.style.top;
				_this.ifm.style.left = _this.entity.style.left;
			}
			_this.updateSize();
		}
	};
	
	var _this=this;
	
	(function initialize(){
		_this.entity=$C("div");
		_this.entity.style.position="absolute";
		_this.entity.style.width=_this.getAreaWidth()+"px";
		_this.entity.style.height=_this.getAreaHeight()+"px";
		_this.entity.style.left="0px";
		_this.entity.style.top="0px";
		_this.entity.style.zIndex=1024;
		_this.entity.style.backgroundColor="black";
		document.body.appendChild(_this.entity);
		
		_this._setOpacity(_this.entity,isNaN(opacity)?0.5:opacity);
		
		if($IE6){
			_this.entity.style.top=document.documentElement.scrollTop+"px";
			_this.addIframe();
		}
		Core.Events.addEvent(window,function(){
			if (_this.entity) {
				if ($IE6 && _this.isShow) {
					document.documentElement.scrollLeft = 0;
					_this._ie6Fixed();
				}
				setTimeout(function(){
					_this.updateSize();
				}, 1);
			}
		},"resize");
		_this.setFixed(true);
		_this.hidden();
	})();
};

BackShadow.prototype={
	/**
	 * 显示
	 */
	show:function(){
		this.entity.style.display="";
		if(this.ifm){
			this.ifm.style.display="";
		}
		this.isShow=true;
		this.onShow();
	},
	
	/**
	 * 隐藏
	 */
	hidden:function(){
		this.entity.style.display="none";
		if(this.ifm){
			this.ifm.style.display="none";
		}
		this.isShow=false;
		this.onHidden();
	},
	
	/**
	 * 关闭
	 */
	close:function(){
		this.hidden();
		this.destroy();
	},
	
	/**
	 * 销毁
	 */
	destroy:function(){
		Core.Events.removeEvent(window,this._ie6Fixed, "scroll");
		this.entity.parentNode.removeChild(this.entity);
		this.entity=null;
		if(this.ifm){
			this.ifm.parentNode.removeChild(this.ifm);
			this.ifm=null;
		}
	},
	
	/**
	 * 添加背景Iframe
	 */
	addIframe:function(){
		this.ifm=$C("iframe");
		this._setOpacity(this.ifm,0);
		this.ifm.style.position="absolute";
		this.ifm.style.zIndex=this.entity.style.zIndex;
		this.ifm.style.left=this.entity.style.left;
		this.ifm.style.top=this.entity.style.top;
		this.ifm.style.width=this.entity.style.width;
		this.ifm.style.height=this.entity.style.height;
		document.body.insertBefore(this.ifm,this.entity);
		
	},
	
	/**
	 * 插入到指定对象之前
	 * @param {Object} obj 
	 */
	insertBefore:function(obj){
		document.body.insertBefore(this.entity,obj);
		if (this.ifm) {
			document.body.insertBefore(this.ifm,this.entity);
		}
	},
	
	/**
	 * 更新大小
	 */
	updateSize:function(){
		this.entity.style.width=this.getAreaWidth()+"px";
		this.entity.style.height=this.getAreaHeight()+"px";
		if(this.ifm){
			this.ifm.style.width=this.getAreaWidth()+"px";
			this.ifm.style.height=this.getAreaHeight()+"px";
		}
	},
	
	/**
	 * 获取显示窗口区域的高度
	 */
	getAreaHeight:function(){
		return document.documentElement.clientHeight;
	},
	
	/**
	 * 获取显示窗口区域的宽度
	 */
	getAreaWidth:function(){
		return document.documentElement.clientWidth;
	},
	
	/**
	 * 设置是否为Fixed状态
	 * @param {Boolean} state 状态值
	 */
	setFixed:function(state){
		if ($IE6) {
			var _this=this;
			if (state) {
				_this._ie6Fixed();
				Core.Events.addEvent(window,_this._ie6Fixed, "scroll");
			}else{
				Core.Events.removeEvent(window,_this._ie6Fixed, "scroll");
			}
			
		}else{
			this.entity.style.position = state?"fixed":"absolute";
		}
	},
	
	/**
	 * 设置透明度(用Core.Dom.setStyle设置透明度有在IE6下失效的情况发生-_-!)
	 */
	_setOpacity:function(obj,v){
		if ($IE && $IE<=9) {  //$IE 默认值是0 标准浏览器也满足这个条件 $IE10 支持opacity方法
			obj.style.filter = "alpha(opacity=" + v*100 + ")";
		}else{
			obj.style.opacity=v;
		}
	},
	
	/**
	 * 显示时触发
	 */
	onShow:function(){
		
	},
	
	/**
	 * 隐藏时触发
	 */
	onHidden:function(){
		
	}
};
