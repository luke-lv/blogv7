/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @ClassName Layer
 * @FileOverview 基础页面显示层
 * @Author Random | YangHao@sina.staff.com.cn
 * @Created 2009-03-24
 * @Updated 2009-05-15
 * @Updated 2009-06-01
 */

$import("sina/sina.js");
$import("sina/core/system/parseParam.js");
$import("sina/core/system/br.js");
$import("sina/core/dom/setStyle.js");
$import("sina/ui/template.js");

/**
 * @param {String} template 模板的HTML
 */
var Layer=function(template){
	this.entity=null;
	this.ifm=null;
	
	var _this=this;
	var Property={
		width:0,
		height:0,
		x:0,
		y:0,
		isFixed:false,
		uniqueID:"",
		entityID:"",
		contentID:"",
		template:template,
		templateString:"",
		nodes:{}
	};
	
	
	this.getProperty = function () {
		return Property;
	};
	
	(function initialize(){
		
		var p=_this.getProperty();
		p.uniqueID="_"+_this.getUniqueID();
		p.entityID=p.uniqueID+"_entity";
		p.contentID=p.uniqueID+"_content";

		_this.setTemplate(p.template);
		p.width=parseInt(_this.entity.style.width);
		if($IE6){
			_this.addIframe();
		}
		document.body.appendChild(_this.entity);

		_this.hidden();
		
	})();
	
	
	//特殊处理layer在IE6下滚动条滚动的时候相对于屏幕位置不改变
	this._ie6Fixed=function(){
		_this.entity.style.left = document.documentElement.scrollLeft + _this.getProperty().x + "px";
		_this.entity.style.top = document.documentElement.scrollTop + _this.getProperty().y + "px";

		if (_this.ifm){
			_this.ifm.style.left = document.documentElement.scrollLeft + _this.getProperty().x + "px";
			_this.ifm.style.top = document.documentElement.scrollTop + _this.getProperty().y + "px";
		}
	};
};

Layer.prototype={
	
	/**
	 * 设置模板
	 * @param {String} template 模板HTML
	 */
	setTemplate:function(template){
		var p = this.getProperty();
		if(this.entity){
			this.entity.parentNode.removeChild(this.entity);
			this.entity = null;
		}
		if(typeof template == "object"){		// 可以是(非#{}模板)的参数，但需要拥有(相同数据结构的nodes对象)
			p.nodes = template;
			if(this.entity){
				this.entity.parentNode.removeChild(this.entity);
				this.entity = null;
			}
			this.entity = p.nodes.entity;
			document.body.appendChild(this.entity);
			if(!p.nodes.entity || !p.nodes.content){
				throw new Error("[layer.js] missing entity or content in layer nodes");
			}else {
				this.entity.style.position = "absolute";
				this.entity.style.zIndex = "1024";
				this.entity.style.left = p.x+"px";
				this.entity.style.top = p.y+"px";
			}
			return;
		}
		var pattern = /[^\{\}]+(?=\})/g;
		p.template = template;
		p.templateString = p.template.match(pattern);
		this.entity = $C("div");
		var tempEntity = $C("div");
		var tmp = new Ui.Template(p.template);
		tempEntity.innerHTML = tmp.evaluate(this.getNodes("i"));
		document.body.appendChild(tempEntity);
		if (!$E(p.entityID) || !$E(p.contentID)) {
			throw new Error("[layer.js] there missing #{entityID} or #{contentID} in layer template");
		}else {
			this.entity = $E(p.entityID);
			this.entity.style.position  = "absolute";
			this.entity.style.zIndex ="1024";
			this.entity.style.left = p.x+"px";
			this.entity.style.top = p.y+"px";
			document.body.replaceChild(this.entity, tempEntity);
			tempEntity = null;
		}
		p.nodes=this.getNodes();
	},
	
	/**
	 * 设置高度和宽度，这里设置的是内容器的高度和宽度来撑开外容器
	 * opts.width:[number]
	 * opts.height:[number]
	 */
	setSize:function(opts){
		var p = this.getProperty();
		Core.System.parseParam(p,opts);
		
		if (opts.width) {
			p.nodes.content.style.width = p.width + "px";
		}
		if(opts.height){
			p.nodes.content.style.height = p.height+"px";
		}
		
		this.updateIfmSize();
	},
	
	
	/**
	 * 设置对象的位置
	 * opts.x:[number]
	 * opts.y:[number]
	 */
	setPosition:function(opts){
		var p = this.getProperty();
		Core.System.parseParam(p, opts);
		this.entity.style.left=p.x+"px";
		this.entity.style.top=p.y+"px";
		
		if($IE6 && p.isFixed){
			this.entity.style.left=p.x+document.documentElement.scrollLeft+"px";
			this.entity.style.top=p.y+document.documentElement.scrollTop+"px";
		}
		
		if(this.ifm){
			this.ifm.style.left=this.entity.style.left;
			this.ifm.style.top=this.entity.style.top;
		}
	},
	
	/**
	 * 获取宽度
	 */
	getWidth:function(){
		var ld=this.entity.style.display;
		var lv=this.entity.style.visibility;
		this.entity.style.visibility="hidden";
		this.entity.style.display="";
		w=this.entity.offsetWidth;
		
		this.entity.style.display=ld;
		this.entity.style.visibility=lv;
		return w;
	},
	
	/**
	 * 获取高度
	 */
	getHeight:function(){
		var ld=this.entity.style.display;
		var lv=this.entity.style.visibility;
		this.entity.style.visibility="hidden";
		this.entity.style.display="";
		h=this.entity.offsetHeight;
		
		this.entity.style.display=ld;
		this.entity.style.visibility=lv;
		return h;
	},
	
	/**
	 * 获取横坐标
	 */
	getX:function(){
		return parseInt(this.entity.style.left);
	},
	
	/**
	 * 获取纵坐标
	 */
	getY:function(){
		return parseInt(this.entity.style.top);
	},
	
	/**
	 * 如果有背景iframe的时候，实时更新iframe的大小与对象保持一致
	 */
	updateIfmSize:function(){
		if(this.ifm){
			var _this=this;
			_this.ifm.style.width=_this.entity.offsetWidth + "px";
			_this.ifm.style.height=_this.entity.offsetHeight + "px";
		}
	},
	
	/**
	 * 设置layer是否在滚动条滚动的时候相对于屏幕位置不改变
	 * @param {Bool} isFixed
	 */
	setFixed:function(isFixed){
		var p = this.getProperty();
		p.isFixed=isFixed;
		var _this=this;
		
		//针对IE6的Fixed
		if($IE6){
			_this.entity.style.position = "absolute";
			if(p.isFixed){
				_this._ie6Fixed();
				Core.Events.addEvent(window,_this._ie6Fixed, "scroll");
			}else{
				Core.Events.removeEvent(window,_this._ie6Fixed, "scroll");
			}
			return;
		}
		
		//针对FF2的Fixed
		if(p.isFixed && $FF2){
			_this.updateFixed();
			return;
		}
		
		this.entity.style.position=p.isFixed?"fixed":"absolute";
	},
	
	
	/**
	 * 修复在FF2下设置position="fixed"的问题
	 */
	updateFixed:function(){
		var p = this.getProperty();
		if(p.isFixed && $FF2){
			var _this = this;
			var lastX = p.x, lastY = p.y;
			_this.entity.style.position = "absolute";
			_this.setPosition({
				x: p.x + document.documentElement.scrollLeft,
				y: p.y + document.documentElement.scrollTop
			});
			
			_this.entity.style.position = "fixed";
			_this.setPosition({
				x: lastX,
				y: lastY
			});
		}
	},
	
	
	/**
	 * 显示对象，如果有背景iframe则一起显示
	 */
	show:function(){
		this.entity.style.display="";
		if(this.ifm){
			this.ifm.style.display="";
			this.updateIfmSize();
		}
	},
	
	/**
	 * 隐藏对象，如果有背景iframe则一起隐藏
	 */
	hidden:function(){
		this.entity.style.display="none";
		if(this.ifm){
			this.ifm.style.display="none";
		}
	},
	
	/**
	 * 添加背景iframe(在IE6下可以挡住传说中的<select>)
	 */
	addIframe:function(){
		this.ifm=$C("iframe");
		this.ifm.style.position="absolute";
		this.ifm.style.zIndex="1024";
		this.ifm.style.left=this.entity.style.left;
		this.ifm.style.top=this.entity.style.top;
		document.body.appendChild(this.ifm);
		Core.Dom.setStyle(this.ifm,"opacity",0);
	},
	
	/**
	 * 根据模板获取所有可用节点
	 * @param {String} mode "o":返回对象的属性为dom对象(默认)
	 *                      "i":返回对象的属性为dom对象的ID
	 */
	getNodes:function(mode){
		var p=this.getProperty();
		var m=mode || "o";
		var i;
		var nodes={};
		var result=p.templateString;
		if (result) {
			for (i = 0; i < result.length; i++) {
				var r = result[i];
				switch (m) {
					case "o":
						nodes[r] = $E(p.uniqueID + "_" + r);
						break;
					case "i":
						nodes[r] = p.uniqueID + "_" + r;
						break;
				}
			}
		}
		return "entity" in nodes ? nodes : p.nodes;
	},
	
	
	/**
	 * 获取唯一ID
	 */
	getUniqueID:function(){
		return parseInt(Math.random()*10000).toString()+(new Date).getTime().toString();
	},
	
	/**
	 * 设置Layer中content的innerHTML值
	 * @param {Object} sHTML
	 * @author FlashSoft | fangchao@staff.sina.com.cn
	 * 
	 */
	setContent: function (sHTML) {
		var p = this.getProperty();
		
		if (sHTML) {
			p.nodes.content.innerHTML = sHTML;
		}
	}
};
