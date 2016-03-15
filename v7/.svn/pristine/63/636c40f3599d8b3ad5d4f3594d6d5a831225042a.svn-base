/**
 * @desc	tips 组件
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */


$import("jobs/nineGrid/comps/_comps.js");
$import("jobs/nineGrid/comps/oop.js");
$import("lib/templateUtils.js");

$import("sina/core/dom/getLeft.js");
$import("sina/core/dom/getTop.js");
$import("sina/core/dom/setStyle.js");


Comps.TipsSimp = function(oParam){
	
	this.TOP = 1;
	this.RIGHT = 2;
	this.BOTTOM = 3;
	this.LEFT = 4;
	
	this.nodes = null;
	this.entity = null;
	this.content = null;
	this.arr = null;
	
	var _this = this;
	this.template = oParam.template;		// #{entity} 的模板
	this.idTemplate = oParam.idTemplate;	// 用 id 和 name 共同命名的模板类型
	this.htmlId = oParam.htmlId;			// 用 id 和 name 共同命名的模板类型
	
	this.tipsTxt = oParam.tipsTxt;			// content 节点的 innerHTML。
	this.relNodeStat;						// 备份 tips 位置信息
	this.stat;								// tips 的显示状态。1 显示，0 隐藏。
	
	if(this.htmlId){
		var tipsNode = $E(this.htmlId);
		if(tipsNode){
			this.nodes = this.getIdNodes(tipsNode.innerHTML);
		}
	}else if(this.template){
		this.nodes = this.getTemplateNodes(this.template);
		
	}else if(this.idTemplate){
		this.nodes = this.getIdNodes(this.idTemplate);
	}
	
	// 通过指定 name，让 entity、content、arr 等节点获得正确指向。执行并不影响 #{entity} 模式。
	for(var key in this.nodes){
		switch(this.nodes[key].getAttribute("name")){
			case "entity":
				this.nodes.entity = this.nodes[key];
				break;
			case "content":
				this.nodes.content = this.nodes[key];
				break;
			case "arr":
				this.nodes.arr = this.nodes[key];
				break;
		}
	}
	
	// 必须被正确指向
	if(!this.nodes.entity) return;
	if(this.tipsTxt) this.nodes.content.innerHTML = this.tipsTxt;
	this.nodes.entity.style.position = "absolute";
	this.nodes.entity.style.visibility = "hidden";
	
	document.body.appendChild(this.nodes.entity);
	
	Core.Events.addEvent(window, oParam.resize || function(){
		if(_this.relNodeStat){
			_this.setToNode({
				node:		_this.relNodeStat.rel,
				direct:		_this.relNodeStat.dir,
				offset:		{
					x: _this.relNodeStat.off.x||0,
					y: _this.relNodeStat.off.y||0
				}
			});
		}
	}, "resize");
	
}.$defineProto({
	
	setToPos: function(pos, offset){
		this.relNodeStat = null;
		offset = offset || {};
		this.nodes.entity.style.left = pos.x + offset.x||0;
		this.nodes.entity.style.top = pos.y + offset.y||0;
		
	},
	
	setToNode: function(oCfg){
		
		var _this = this;
		var oCfg = oCfg || {};
		
		var node = oCfg.node;
		var direct = oCfg.direct;
		var offset = oCfg.offset || {};
		var noAjust = oCfg.noAjust || false;
		var fn = oCfg.fn;
		var dur = oCfg.dur;
		
		var posParam = {
			x:	Core.Dom.getLeft(node),
			y:	Core.Dom.getTop(node),
			w:	node.offsetWidth,
			h:	node.offsetHeight
		};
		
		var _width = this.getWidth();
		var _height = this.getHeight();
		
		// 只需要位置相关信息
		this.relNodeStat = {
			rel:	node,
			dir:	direct||this.TOP,
			off:	offset
		};
		
		// 有播放时间，动画（目前是 JQ 版，不要使用！）
		if(dur){
			if(noAjust){
				this.nodes.entity.animate(				// 不需要自动调整居中。不再有上下左右了。
					{
						left:	posParam.x + (offset.x||0),
						top:	posParam.y + (offset.y||0)
					},
					dur,
					"swing",
					fn||function(){}
				);
			}else{
				switch(direct || this.TOP){				// 不方便使用 bottom\right，而且要宽高置换。
					case this.TOP:
						this.nodes.entity.animate(
							{
								left:	posParam.x - _width/2 + posParam.w/2 + (offset.x||0),
								top:	posParam.y - _height + (offset.y||0)
							},
							dur,
							"swing",
							fn||function(){}
						);
						break;
					case this.RIGHT:
						this.nodes.entity.animate(
							{
								left:	posParam.x + posParam.w + (offset.x||0),
								top:	posParam.y - _height/2 + posParam.h/2 + (offset.y||0)
							},
							dur,
							"swing",
							fn||function(){}
						);
						break;
					case this.BOTTOM:
						this.nodes.entity.animate(
							{
								left:	posParam.x - _width/2 + posParam.w/2 + (offset.x||0),
								top:	posParam.y + posParam.h + (offset.y||0)
							},
							dur,
							"swing",
							fn||function(){}
						);
						break;
					case this.LEFT:
						this.nodes.entity.animate(
							{
								left:	posParam.x - _width + (offset.x||0),
								top:	posParam.y - _height/2 + posParam.h/2 + (offset.y||0)
							},
							dur,
							"swing",
							fn||function(){}
						);
						break;
				}
			}
		}else{
			if(noAjust){								// 不需要自动调整居中。不再有上下左右了。
				this.nodes.entity.style.left = (posParam.x + (offset.x||0)) + "px";
				this.nodes.entity.style.top = (posParam.y + (offset.y||0)) + "px";
			}else{
				switch(direct || this.TOP){				// 不方便使用 bottom\right，而且要宽高置换。
					case this.TOP:
						this.nodes.entity.style.left = (posParam.x - _width/2 + posParam.w/2 + (offset.x||0)) + "px";
						this.nodes.entity.style.top = (posParam.y - _height + (offset.y||0)) + "px";
						break;
					case this.RIGHT:
						this.nodes.entity.style.left = (posParam.x + posParam.w + (offset.x||0)) + "px";
						this.nodes.entity.style.top = (posParam.y - _height/2 + posParam.h/2 + (offset.y||0)) + "px";
						break;
					case this.BOTTOM:
						this.nodes.entity.style.left = (posParam.x - _width/2 + posParam.w/2 + (offset.x||0)) + "px";
						this.nodes.entity.style.top = (posParam.y + posParam.h + (offset.y||0)) + "px";
						break;
					case this.LEFT:
						this.nodes.entity.style.left = (posParam.x - _width + (offset.x||0)) + "px";
						this.nodes.entity.style.top = (posParam.y - _height/2 + posParam.h/2 + (offset.y||0)) + "px";
						break;
				}
			}
		}
	},
	appear: function(dur, fn){
		if(this.stat) return;
		if(dur){
			// this.nodes.entity.css("opacity", 0);			// 特别处理
			// this.nodes.entity.css("visibility", "visible");
			// this.nodes.entity.animate({ "opacity": 1 }, dur, "linear", fn||function(){});
		}else{
			this.nodes.entity.style.visibility = "visible";
		}
		this.stat = 1;			//显示中
	},
	disappear: function(dur, fn){
		if(!this.stat) return;
		var _this = this;
		if(dur){
			// this.nodes.entity.animate({ "opacity": 0 }, dur, "linear", fn||function(){
			// 	_this.nodes.entity.css("visibility", "hidden");
			// });
		}else{
			this.nodes.entity.style.visibility = "hidden";
		}
		this.stat = 0;			//隐藏中
	},
	setContent: function(txt){
		if(typeof txt == "object"){
			this.nodes.content.innerHTML = "";
			this.nodes.content.appendChild(txt);
		}else{
			this.nodes.content.innerHTML = txt;
		}
	},
	getWidth: function(){
		return this.nodes.entity.offsetWidth;
	},
	getHeight: function(){
		return this.nodes.entity.offsetHeight;
	},
	getNodes: function(){
		return this.nodes;
	},
	vanish: function(){
		this.nodes.entity.parentNode.removeChild(this.nodes.entity);
	}
}).$mixProto(Lib.templateUtils);

