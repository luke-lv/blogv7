/**
 * @fileoverview 可旋转的元素类
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-07-06
 */

$import("sina/sina.js");
$import("sina/core/class/oop.js");
$import("sina/core/system/br.js");

$import("lib/lib.js");

Lib.Rotation=function(node){
	this.node=node;
	this._initNode();
}.$define({
	node:null,
	_orgW:0,
	_orgH:0,
	_orgX:0,
	_orgY:0,
	_initNode:function(){
		if($IE){
			this.node.style.filter="progid:DXImageTransform.Microsoft.Matrix";
			this._orgW=this.node.offsetWidth;
			this._orgH=this.node.offsetHeight;
			this._orgX=isNaN(parseInt(this.node.style.left))?0:parseInt(this.node.style.left);
			this._orgY=isNaN(parseInt(this.node.style.top))?0:parseInt(this.node.style.top);
		}
	},
	
	/**
	 * 旋转
	 * @param {Number} angle 角度
	 */
	rotate:function(angle){
		this._rotateStrategy(angle);
	},
	
	/**
	 * 设置X坐标
	 * @param {Number} x
	 */
	setX:function(x){
		if ($IE) {
			this._orgX=x;
		}else{
			this.node.style.left = x + "px";
		}
	},
	
	/**
	 * 设置Y坐标
	 * @param {Number} y
	 */
	setY:function(y){
		if($IE){
			this._orgY=y;
		}else{
			this.node.style.top=y+"px";
		}
	},
	
	/**
	 * 获取X坐标
	 */
	getX:function(){
		var x;
		if($IE){
			x=this._orgX;
		}else{
			x=parseInt(this.node.style.left);
		}
		return x;
	},
	
	/**
	 * 获取Y坐标
	 */
	getY:function(){
		var y;
		if($IE){
			y=this._orgY;
		}else{
			y=parseInt(this.node.style.top);
		}
		return y;
	},
	
	/**
	 * 旋转的实现
	 * @param {Number} angle 角度
	 */
	_rotateStrategy:function(angle){
		if($IE){
			this._ieRotate(angle);
		}else if(typeof(this.node.style.MozTransform)!=="undefined"){
			this._mozRotate(angle);
		}else if(typeof(this.node.style.webkitTransform)!=="undefined"){
			this._webkitRotate(angle);
		}else if(typeof(this.node.style.OTransform)!=="undefined"){
			this._operaRotate(angle);
		}else{
			this._otherRotate(angle);
		}
	},
	
	_ieRotate:function(angle){
		var sinA=Math.sin(angle * Math.PI / 180),
			cosA=Math.cos(angle * Math.PI / 180),
			M11=cosA,
			M12=-sinA,
			M21=sinA,
			M22=cosA,
			node=this.node,
			filters=node.filters,
			k="DXImageTransform.Microsoft.Matrix";
			
		filters.item(k).M11=M11;
		filters.item(k).M12=M12;
		filters.item(k).M21=M21;
		filters.item(k).M22=M22;
		filters.item(k).SizingMethod="auto expand";

		node.style.top=this._orgY+(this._orgH-node.offsetHeight)/2+"px";
		node.style.left=this._orgX+(this._orgW-node.offsetWidth)/2+"px";
		
	},
	
	_mozRotate:function(angle){
		this.node.style.MozTransform="rotate("+angle+"deg)";
	},
	
	_webkitRotate:function(angle){
		this.node.style.webkitTransform="rotate("+angle+"deg)";
	},
	
	_operaRotate:function(angle){
		this.node.style.OTransform="rotate("+angle+"deg)";
	},
	
	_otherRotate:function(angle){
		this.node.style.transform="rotate("+angle+"deg)";
	}
	
});
