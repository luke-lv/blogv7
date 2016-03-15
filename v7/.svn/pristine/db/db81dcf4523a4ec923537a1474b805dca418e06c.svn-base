/**
 * @fileoverview 简单的纵向元素滚动类
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-06-18
 */

$import("sina/sina.js");
$import("sina/core/class/oop.js");
$import("sina/ui/tween/tweenStrategy.js");
$import("sina/ui/tween/transition.js");
$import("sina/core/dom/getStyle.js");

$import("lib/lib.js");

Lib.ScrollElement=function(els,tweenTransition){
	if(els && els.length && els.length>0){
		var me=this;
		
		this.elements=els;
	 	this._node=els[0].parentNode;
		this._length=els.length;
		this._tweenStrategy=new Ui.TweenStrategy(0,0,0.5,tweenTransition || Ui.Transition.simple);
		this._tweenStrategy.onEnd=function(){
			me._isScrolling=false;
			me.onStop && me.onStop(me.index);
			me.index==0 && me.onTop && me.onTop();
			me.index==me._length-1 && me.onBottom && me.onBottom();
		};
		this._tweenStrategy.onTween=function(value){
			me._node.style.marginTop=value+"px";
		};
	}
}.$define({
	elements:null,
	
	index:0,
	
	_tweenStrategy:null,
	
	_length:0,
	
	_node:null,
	
	_isScrolling:false,
	
	/**
	 * 父节点的当前marginTop值
	 */
	_mtValue:0,
	
	/**
	 * 设置滚动速度
	 * @param {Number} sv (1-50)
	 */
	setSpeed:function(sv){
		var v=-0.02*sv+1;
		v=Math.min(v,1);
		v=Math.max(v,0.01);
		this._tweenStrategy.duration=v;
	},
	
	previous:function(){
		if(!this._node || this.index<=0 || this._isScrolling){
			return;
		}
		this._scroll(1);
		
	},
	
	next:function(){
		if(!this._node || this.index>=this._length-1 || this._isScrolling){
			return;
		}
		this._scroll(-1);
	},
	
	_scroll:function(flag){
		var nd=this._node,
			els=this.elements;
			
		this._isScrolling=true;
		this.index-=flag;
		this._tweenStrategy.startValue=this._mtValue;
		this._tweenStrategy.endValue=this._mtValue+flag*this._getDelta(els[this.index]);
		this._tweenStrategy.start();
		this._mtValue=this._tweenStrategy.endValue;
	},
	
	_getDelta:function(node){
		return node.offsetHeight+parseInt(Core.Dom.getStyle(node,"marginTop"))+parseInt(Core.Dom.getStyle(node,"marginBottom"));
	},
	
	onStop:function(index){},
	onTop:function(){},
	onBottom:function(){}
	
});
