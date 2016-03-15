/**
 * @fileoverview 面板类,继承于DisplayObject类
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-10-18
 */

$import("sina/sina.js");
$import("sina/core/class/oop.js");
$import("sina/core/dom/setStyle.js");
$import("sina/core/function/defineGetter.js");
$import("sina/ui/template.js");
$import("sina/ui/ui.js");
$import("sina/core/system/br.js");
$import("sina/ui/fixedController/ie6FixedController.js");
$import("sina/ui/displayObject.js");

Ui.Panel = function(parent,node){
	
	/**
	 * 通过模板配置的节点
	 */
	this.nodes={};
	
	this.uniqueID=this.__getUniqueID();
	
	this.entity=null;
	
	this.__iframe=null;
	this.__isSetAdamant=false;
	this.__templateNodesIDs=[];
	this.__isFixed=false;
	$IE6 && (this.__ie6FixedController=new Ui.IE6FixedController());
	
}.$extends(Ui.DisplayObject).$define({
	
	/**
	 * 设置模板
	 * @param {String} tpl
	 */
	setTemplate:function(tpl){
		var nd=$C("div");
		nd.innerHTML=new Ui.Template(tpl).evaluate(this.__getNodes(tpl,"i"));
		nd.style.display="none";
		this.__parent.appendChild(nd);
		this.__updateTemplate(nd);
		this.nodes=this.__getNodes(tpl);
		
		//兼容之前的版本，以后可去掉
		this.entity=this.__entity;
		this.nodes.panel=this.entity;
		
		return this;
	},
	
	/**
	 * 设置当滚动条滚动时，是否固定住对象的功能
	 * @param {Boolean} state
	 */
	setFixed:function(state){
		!this.__isInited && this.__initEntity();
		
		var x=parseInt(this.__entity.style.left),
			y=parseInt(this.__entity.style.top);
		
		if($IE6){
			this.__ie6FixedController.setFixed(this.__entity,state);
			this.__isSetAdamant && this.__ie6FixedController.setFixed(this.__iframe,state);
		}else{
			
			//设置为fixed状态
			if(state && !this.__isFixed){
				this.setPosition({
					x:x-Math.max(document.documentElement.scrollLeft,document.body.scrollLeft),
					y:y-Math.max(document.documentElement.scrollTop,document.body.scrollTop)
				});
				this.__entity.style.position="fixed";
			}
			
			//取消fixed状态
			if(!state && this.__isFixed){
				this.setPosition({
					x:x+Math.max(document.documentElement.scrollLeft,document.body.scrollLeft),
					y:y+Math.max(document.documentElement.scrollTop,document.body.scrollTop)
				});
				this.__entity.style.position="absolute";
			}
			
		}
		this.__isFixed=!!state;
		this.__updateIframe();
		
		return this;
	},

	/**
	 * 设置是否避免被<select>和flash之类的东东给遮挡
	 * @param {Boolean} state
	 */
	setAdamant:function(state){
		this.__isSetAdamant=!!state;
		this.__isSetAdamant && !this.__iframe && this.__createIframe();
		this.__updateIframe();
		return this;
	},
	
	destroy:function(){
		if(!this.__entity){
			return;
		}
		Ui.Panel.$super.destroy.call(this);
		this.__ie6FixedController && this.__ie6FixedController.destroy();
		this.__iframe && this.__iframe.parentNode.removeChild(this.__iframe);
	},
	
	/**
	 * 设置位置,重写了父类的setPosition方法
	 * @param {Object} p
	 * 					x:Number
	 * 					y:Number
	 * 					z:Number
	 */
	setPosition:function(p){
		!this.__isInited && this.__initEntity();
		if ($IE6) {
			this.__ie6FixedController.setPosition(this.__entity,this.__isFixed,p);
		}else{
			Ui.Panel.$super.setPosition.call(this,p);
		}
		this.__updateIframe();
		return this;
	},
	
	/**
	 * 设置大小,重写了父类的setSize方法
	 * @param {Object} p
	 * 					width:Number
	 * 					height:Number
	 */
	setSize:function(p){
		Ui.Panel.$super.setSize.call(this,p).__updateIframe();
		return this;
	},
	
	/**
	 * 显示对象,重写了父类的show方法
	 * @param {IRenderer} renderer
	 */
	show:function(renderer){
		Ui.Panel.$super.show.call(this,renderer).__updateIframe();
		return this;
	},
	
	/**
	 * 隐藏对象,重写了父类的hidden方法
	 * @param {IRenderer} renderer
	 */
	hidden:function(renderer){
		Ui.Panel.$super.hidden.call(this,renderer).__updateIframe();
		return this;
	},
	
	/**
	 * 重写父类的获取x坐标方法，如果是fixed状态，返回的是相对可见区域的x坐标
	 */
	__getX:function(){
		!this.__isInited && this.__initEntity();
		if($IE6){
			return this.__ie6FixedController.getX(this.__entity,this.__isFixed);
		}else{
			return parseInt(this.__entity.style.left);
		}
	},
	
	/**
	 * 重写父类的获取y坐标方法，如果是fixed状态，返回的是相对可见区域的y坐标
	 */
	__getY:function(){
		!this.__isInited && this.__initEntity();
		if($IE6){
			return this.__ie6FixedController.getY(this.__entity,this.__isFixed);
		}else{
			return parseInt(this.__entity.style.top);
		}
	},
	
	__createIframe:function(){
		this.__iframe=$C("iframe");
		this.__iframe.frameBorder="none";
		this.__parent.insertBefore(this.__iframe,this.__entity);
		Core.Dom.setStyle(this.__iframe,"opacity",0);
		this.__ie6FixedController && (this.__ie6FixedController.iframeNode=this.__iframe);		
		this.__updateIframe();
	},
	
	__updateIframe:function(){
		if (this.__iframe) {
			var st = this.__iframe.style;
			st.backgroundColor="#ffffff";
			st.left = this.x + "px";
			st.top = this.y + "px";
			st.width = this.width + "px";
			st.height = this.height + "px";
			st.position=this.__entity.style.position;
			st.display=this.__entity.style.display;
			st.zIndex=this.__entity.style.zIndex;
			$IE6 && this.__ie6FixedController.updateIframe(this.__isFixed);
		}
	},
	
	/**
	 * 更新IE6Fixed控制器设置的原始坐标
	 */
	__updateIE6FCOrgPosition:function(){
		this.__ie6FixedController && this.__ie6FixedController.updateOrgPosition();
	},
	
	/**
	 * 更新设置的模板数据
	 * @param {Object} nd
	 */
	__updateTemplate:function(nd){
		var l,t,z,p,d,
			et=this.__entity;
		
		if(et){
			et.parentNode && et.parentNode.removeChild(et);
			l=et.style.left;
			t=et.style.top;
			z=et.style.zIndex;
			p=et.style.position;
			d=et.style.display;
		}else{
			d="none";
		}
		
		et=this.__entity=$E("_"+this.uniqueID+"_panel");
		
		//加上entity的节点，以兼容老版本的模板，以后不用entity的模板后可以去掉
		if(!et){
			et=this.__entity=$E("_"+this.uniqueID+"_entity");
		}
		if(!et){
			//如果模板内没有指定#{panel}则抛出异常
			throw new Error("[Panel Error]there missing identifier #{panel} in panel template");
		}
		
		et.style.left=l || 0;
		et.style.top=t || 0;
		et.style.zIndex=z || 0;
		et.style.position=p || "absolute";
		et.style.display=d;
		
		this.__parent.replaceChild(et,nd);
		this.__ie6FixedController && (this.__ie6FixedController.node=this.__entity);
	},
	
	/**
	 * 根据模板获取所有可用节点(模板中以{nodeID}这种形式的节点将会被获取到)
	 * @param {String} tempalte 模板HTML
	 * @param {String} mode "o":返回对象的属性为dom对象(默认)
	 *                      "i":返回对象的属性为dom对象的ID
	 */
	__getNodes:function(template,mode){
		var m=mode || "o",
			p=/\{[^\}]+(?=\})/g,
			i,
			nodes={},
			rets,
			r;

		//if(m==="i" || !this.__templateNodesIDs.length){
			this.__templateNodesIDs=template.match(p);
		//}
		rets=this.__templateNodesIDs;
		
		if (rets){
			i=rets.length;
			while(i--){
				r = rets[i].replace("{","");
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
	 * 获取唯一ID
	 */
	__getUniqueID:function(){
		return parseInt(Math.random()*1000).toString()+(new Date).getTime().toString();
	},
	
	/**
	 * 兼容老版本layer的方法
	 */
	setContent:function(str){
		this.nodes.content && (this.nodes.content.innerHTML=str);
	},
	/**
	 * 兼容老版本的getNodes方法
	 */
	getNodes:function(){
		return this.nodes;
	}
});