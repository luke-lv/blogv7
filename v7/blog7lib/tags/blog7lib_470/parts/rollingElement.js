/**
 * @fileoverview 纵向滚动显示的元素
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-04-07
 */

$import("sina/sina.js");
$import("sina/core/class/oop.js");
$import("sina/ui/tween.js");
$import("sina/core/dom/getLeft.js");
$import("sina/core/dom/getTop.js");
$import("sina/core/system/br.js");

$import("lib/lib.js");

/**
 * 纵向滚动显示的元素类
 * @param {Object} node 要滚动显示元素的父节点
 */
Lib.RollingElement=function(node){
	this.node = node;
	node.style.marginTop && (this.orgData.marginTop = node.style.marginTop);
	this.initList();
}.$define({
	
	/**
	 * 要滚动显示元素的父节点
	 */
	node:null,
	
	/**
	 * 原始数据存储
	 */
	orgData:{
		"marginTop":0
	},
	
	/**
	 * 校正的高度(有点shi的方法- -!)
	 */
	adjustHeight:0,
	/**
	 * 有效的元素
	 */
	_list:[],
	
	/**
	 * 当前显示的元素
	 */
	_currentElement:null,
	
	/**
	 * 是否已经在滚动
	 */
	_isScrolling:false,
	
	/**
	 * 滚动到指定的元素
	 * @param {Number} n
	 */
	scrollTo:function(n){
		if(n==0 || n>=this._list.length || this._isScrolling){
			this.onEnd();
			return;
		}
		
		var list = this._list, 
			i,
			v = 0,
			len = list.length;
			
		for (i = 0; i < n; i++) {
			list[i].style.marginTop && (v+=parseInt(list[i].style.marginTop));
			list[i].style.marginBottom && (v+=parseInt(list[i].style.marginBottom));
			v+=this.adjustHeight;
			v+=list[i].offsetHeight;
		}
		
		this._isScrolling = true;
		this._currentElement = list[n];
		this._scrollStrategy(this.node,-v);
	},
	
	/**
	 * 初始化有效元素的列表
	 */
	initList:function(){
		var nodes=this.node.childNodes,
			i,
			len=nodes.length;
		this._list.length=0;
		for(i=0;i<len;i++){
			if(nodes[i].tagName){
				this._list.push(nodes[i]);
			}
		}
	},
	
	/**
	 * 滚动效果的实现
	 * @param {Object} node
	 * @param {Number} v
	 */
	_scrollStrategy:function(node,v){
		var me=this;
		Ui.tween(node,"marginTop",v,0.6,"strongEaseOut",{
			tween:function(){
				
			},
			end:function(){
				me._updateList();
				me._isScrolling=false;
				me.onEnd();
			}
		});
		
	},
	
	/**
	 * 更新滚动的元素列表
	 */
	_updateList:function(){
		var list=this._list,
			i,
			len=list.length;
			
		for (i = 0; i < len; i++) {
			if (list[i] != this._currentElement) {
				this.node.appendChild(list[i]);
			}
			else {
				this.node.style.marginTop = this.orgData.marginTop || "";
				break;
			}
		}

		this._list.length=0;
		this.initList();
		
	},
	
	onEnd:function(){}
});

