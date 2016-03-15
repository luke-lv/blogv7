/**
 * @fileoverview 面板类，所有显示面板的基础类
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-03
 */
$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/dom/setStyle.js");
$import("sina/core/system/br.js");
$import("sina/core/dom/getTop.js");
$import("sina/core/dom/getLeft.js");

$import("lib/lib.js");
$import("lib/apply.js");
$import("lib/htmlTemplate.js");
/**
 * 面板类
 */
Lib.Panel=Core.Class.create();
Lib.Panel.prototype={
	/**
	 * 是否需要设置iframe遮罩层
	 * Boolean
	 */
	noIframe : !1,
	/**
	 * 是否需要设置定位
	 * Boolean
	 */
	isPostion : !0,
	/**
	 * 添加到哪个节点
	 * String | HTMLElement
	 */
	appendTo : null,
	/**
	 * 面板实体对象(div)
	 */
	entity:null,
	
	/**
	 * 背景Iframe,用来挡住<select>和Flash控件
	 */
	backIframe:null,
	
	/**
	 * 唯一ID
	 */
	uniqueID:null,
	
	/**
	 * 是否为fixed状态
	 */
	isFixed:false,

	/**
	 * 是否为显示状态
	 */
	isShow : !1,
	
	/**
	 * 是否为隐藏状态
	 */
	isHidden : !0,
	
	/**
	 * 横坐标
	 */
	x:0,
	
	/**
	 * 纵坐标
	 */
	y:0,
	
	/**
	 * 模板HTML
	 */
	template:"",
	
	/**
	 * 初始化操作
	 */
	initialize : function(cfg){
		// 覆盖自身属性
		Lib.apply(this, cfg);

		var _this=this;

		this.uniqueID = this._getUniqueID();
		
		this._ie6Fixed = function(){
			if(_this.entity){
				_this.entity.style.left = document.documentElement.scrollLeft + _this.x + "px";
				_this.entity.style.top = document.documentElement.scrollTop + _this.y + "px";
			}
			if(_this.backIframe){
				_this.backIframe.style.left = _this.entity.style.left;
				_this.backIframe.style.top = _this.entity.style.top;
			}
		};
	},
    /**
     * 获取#{name}节点
     * @param {String} name 节点名称
     */
	getNode : function(name){
        return this.tpl.getNode(name);
    },
	/**
	 * 初始化面板的呈现方式
	 * @param {String} tempalte 模板HTML
	 */
	setTemplate:function(template){

		this.template = template;
		//移除原有的entity,用新的entity将其替换,这样可以不用在外层再套一个div
		if(this.entity && this.entity.parentNode){
			this.entity.parentNode.removeChild(this.entity);
			this.backIframe && this.backIframe.parentNode.removeChild(this.backIframe);
		}
		this.entity=$C("div");
		var tempEntity=$C("div");
		var tmp = new Lib.HtmlTemplate(this.template, this.uniqueID);
        this.tpl = tmp;
		
		tempEntity.innerHTML = tmp.getHtmlString();
        
		tempEntity.style.display="none";
		//console.log('appendTo',this.appendTo);
		if (this.appendTo) {
			$E(this.appendTo).appendChild(tempEntity);
		} else {
			document.body.appendChild(tempEntity);
		}
		
		
		this.entity = $E("_"+this.uniqueID+"_panel");
		if (this.isPostion) {
			this.entity.style.position="absolute";
		}
		this.entity.style.display="none";
		if (this.appendTo) {
			$E(this.appendTo).replaceChild(this.entity, tempEntity);
		} else {
			document.body.replaceChild(this.entity, tempEntity);
		}
		
		
		tempEntity = null;
		if (!this.noIframe) {
			//添加背景层的Iframe
			this.backIframe=$C("iframe");
			
			this.backIframe.style.display="none";
			this.backIframe.style.border="none";
			this.backIframe.style.zIndex=this.entity.style.zIndex-1;
			document.body.appendChild(this.backIframe);
			//document.body.appendChild(this.entity);

			this._updateBackIframe();
		}
	},
	
	/**
	 * 设置对象的位置
	 * @param {Number} x 横坐标
	 * @param {Number} y 纵坐标
	 */
	setPosition:function(x,y){
		this.x=x;
		this.y=y;
		this.entity.style.left=x+"px";
		this.entity.style.top=y+"px";
		
		if($IE6 && this.isFixed){
			this.entity.style.left=x+document.documentElement.scrollLeft+"px";
			this.entity.style.top=y+document.documentElement.scrollTop+"px";
		}
		if (this.backIframe) {
			this.backIframe.style.left=this.entity.style.left;
			this.backIframe.style.top=this.entity.style.top;
		}
		
	},
	
	/**
	 * 设置面板是否fixed方式(不随屏幕滚动)呈现
	 * @param {Boolean} state
	 */
	setFixed:function(state){
		this.isFixed=state;
		//针对IE6的Fixed
		if($IE6){
			var _this=this;
			this.entity.style.position = "absolute";
			if(this.isFixed){
				_this._ie6Fixed();
			
				Core.Events.addEvent(window,_this._ie6Fixed, "scroll");
			}else{
				Core.Events.removeEvent(window,_this._ie6Fixed, "scroll");
			}
			return;
		}
		
		this.entity.style.position=this.isFixed?"fixed":"absolute";
		if (this.backIframe) {
			this.backIframe.style.position=this.entity.style.position;
		}
	},
	
	/**
	 * 显示面板
	 */
	show:function(){
		this.entity.style.display="";
		this.isHidden = !1;
		this.isShow = !0;
		if (this.backIframe) {
			this._updateBackIframe();
			this.backIframe.style.display="";
		}
		
	},
	
	/**
	 * 隐藏面板
	 * @deprecated 槽糕的api命名
	 */
	hidden:function(){
		this.hide();
	},
	/**
	 * 隐藏面板
	 */
	hide : function(){
		this.entity.style.display="none";
		this.isHidden = !0;
		this.isShow = !1;
		if (this.backIframe) {
			this.backIframe.style.display="none";
		}
	},
	/**
	 * 关闭面板
	 */
	close:function(){
		this.hidden();
		this.destroy();
	},
	
	/**
	 * 销毁对象
	 */
	destroy:function(){
		Core.Events.removeEvent(window, this._ie6Fixed, "scroll");
		this.entity.parentNode.removeChild(this.entity);
		this.entity=null;
		if (this.backIframe) {
			this.backIframe.parentNode.removeChild(this.backIframe);
			this.backIframe = null;
		}
	},
	
	/**
	 * 依赖于指定的dom节点显示，位于所依赖节点的右下方
	 * @param {Object} dom 依赖的dom节点
	 * @param {Number} offsetLeft x的偏移量
	 * @param {Number} offsetTop y的偏移量
	 */
	showWithDom:function(dom,offsetLeft,offsetTop){
		var x=Core.Dom.getLeft(dom) + dom.offsetWidth + offsetLeft;
		var y=Core.Dom.getTop(dom) + dom.offsetHeight + offsetTop;
		if($IE6 && this.isFixed){
			x=x-document.documentElement.scrollLeft;
			y=y-document.documentElement.scrollTop;
		}
		this.setPosition(x,y);
		this.show();
		
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
	 * 根据模板获取所有可用节点(模板中以{nodeID}这种形式的节点将会被获取到)
	 * @param {String} tempalte 模板HTML
	 * @param {String} mode "o":返回对象的属性为dom对象(默认)
	 *                      "i":返回对象的属性为dom对象的ID
	 */
	getNodes:function(mode){
		var m=mode || "o";
		var pattern=/[^\{\}]+(?=\})/g;
		var i;
		var nodes={};
		
		var result = this.template.match(pattern);
		if (result) {
			for (i = 0; i < result.length; i++) {
				var r = result[i];
				switch (m) {
					case "o":
						nodes[r] = $E("_"+this.uniqueID + "_" + r);
						break;
					case "i":
						nodes[r] = "_"+this.uniqueID + "_" + r;
						break;
				}
			}
		}
		return nodes;
	},
	
	/**
	 * 更新背景Iframe
	 */
	_updateBackIframe:function(){
		Core.Dom.setStyle(this.backIframe,"opacity",0);
		this.backIframe.style.display="";
		this.backIframe.style.position=this.entity.style.position;
		this.backIframe.style.width=this.entity.offsetWidth+"px";
		this.backIframe.style.height=this.entity.offsetHeight+"px";
		this.backIframe.style.left=this.entity.style.left;
		this.backIframe.style.top=this.entity.style.top;
	},
	
	/**
	 * 获取唯一ID
	 */
	_getUniqueID:function(){
		return parseInt(Math.random()*1000).toString()+(new Date).getTime().toString();
	}
};