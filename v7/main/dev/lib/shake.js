/**
 * @fileoverview 抖动效果
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-04-01
 */

$import("sina/sina.js");
$import("sina/core/class/oop.js");
$import("sina/ui/tween.js");
$import("sina/core/dom/getLeft.js");
$import("sina/core/dom/getTop.js");

$import("lib/lib.js");

/**
 * 抖动类
 * @param {Object} entity 要抖动的节点
 */
Lib.Shake=function(entity){
	this.entity=entity || document.body;
}.$define({
	/**
	 * 要抖动的节点元素
	 */
	entity:null,
	
	/**
	 * 抖动的幅度
	 */
	value:5,
	
	/**
	 * 抖动的速度(1-10)
	 */
	speed:10,
	
	/**
	 * 抖动时间
	 */
	time:3,
	
	/**
	 * 是否正在抖动
	 */
	_isShaking:false,
	
	/**
	 * 抖动速度的范围
	 */
	_spdRange:10,
	
	/**
	 * 开始抖动
	 */
	start:function(){
		if (this._isShaking) {
			return;
		}
		this._isShaking=true;
		
		var me=this,
			et=this.entity,
			_p=et.style.position,
			ox=et.style.left,
			oy=et.style.top,
			offsetX=0,
			offsetY=0;
			
		if(_p=="absolute" || _p=="fixed"){
			offsetX=Core.Dom.getLeft(et);
			offsetY=Core.Dom.getTop(et);
		}else{
			et.style.position="relative";
		}
		
		this._strategy(
			et,
			offsetX,
			offsetY,
			function(){
				et.style.position=_p;
				et.style.left = ox;
				et.style.top = oy;
				et=null;
				me._isShaking=false;
				me.onEnd && me.onEnd();
			}
		);
	},
	
	/**
	 * 抖动的方法
	 * @param {Object} oNode
	 * @param {Number} ox
	 * @param {Number} oy
	 * @param {Function} handle
	 */
	_strategy:function(oNode,ox,oy,handle){
		var v=this.value,
			t=this.time,
			spd=isNaN(this.speed) || this.speed<0 ? 0 : this.speed % (this._spdRange+1),
			itv=230-spd*20,
			step=0,
			itvID,
			map=[
				[ox-v,oy-v],
				[ox-v,oy+v],
				[ox+v,oy+v],
				[ox+v,oy-v]
			];

		itvID=window.setInterval(function(){
			if (++step < t*300 / itv) {
				oNode.style.left = map[step % 4][0] + "px";
				oNode.style.top = map[step % 4][1] + "px";
			}
			else {
				window.clearInterval(itvID);
				handle && handle();
			}
		},itv);
	},
	
	/**
	 * 抖动结束时触发
	 */
	onEnd:function(){}
});