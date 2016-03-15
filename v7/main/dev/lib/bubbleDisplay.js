/**
 * @fileoverview 让指定dom对象冒泡显示的方法(扫盲:所谓的冒泡显示，就是一个对象，忽然从一个地方渐渐冒出来。。。。- -！)
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-10
 */
$import("sina/sina.js");
$import("lib/lib.js");


/**
 * 冒泡显示静态类
 */
Lib.BubbleDisplay={
	
	/**
	 * 正在处于活动状态
	 */
	displaying:false,
	
	/**
	 * 冒泡显示
	 * @param {Object} dom 要显示的对象
	 * @param {Number} speed 显示速度
	 * @param {Function} callBack 回调的方法
	 */
	show:function(dom,speed,callBack){
		dom.style.display="";
		dom.style.top=parseInt(dom.style.top==""?0:dom.style.top) + dom.offsetHeight+"px";
		dom.style.clip = "rect(0 auto 0 0)";
		var displaying=false;
		
		var h=dom.offsetHeight;
		var ch=0;
		if (!displaying) {
			displaying=true;
			var itvID = window.setInterval(function(){
				if (ch + speed <= h) {
					ch += speed;
					dom.style.clip = "rect(0 auto " + ch + "px 0)";
					dom.style.top = parseInt(dom.style.top) - speed + "px";
				}
				else 
					if (speed > h - ch) {
						ch += h - ch;
						dom.style.clip = "rect(0 auto " + ch + "px 0)";
						dom.style.top = parseInt(dom.style.top) - (h - ch) + "px";
						window.clearInterval(itvID);
						displaying = false;
						if (callBack) {
							callBack();
						}
					}
					else {
						window.clearInterval(itvID);
						displaying = false;
						if (callBack) {
							callBack();
						}
					}
			}, 10);
		}
	},

	/**
	 * 冒泡隐藏
	 * @param {Object} dom 要隐藏的对象
	 * @param {Number} speed 隐藏的速度
	 * @param {Function} callBack 回调的方法
	 */
	hidden:function(dom,speed,callBack){
		dom.style.display="";
		dom.style.top=dom.style.top==""?0:dom.style.top;
		
		var displaying=false;
		var h=dom.offsetHeight;
		var ch=0;
		if (!displaying) {
			displaying=true;
			var itvID = window.setInterval(function(){
				if (ch + speed <= h) {
					ch += speed;
					dom.style.clip = "rect(0 auto " + (h - ch) + "px 0)";
					dom.style.top = parseInt(dom.style.top) + speed + "px";
				}
				else 
					if (speed > h - ch) {
						ch += h - ch;
						dom.style.clip = "rect(0 auto " + (h - ch) + "px 0)";
						dom.style.top = parseInt(dom.style.top) + (h - ch) + "px";
						window.clearInterval(itvID);
						displaying = false;
						if (callBack) {
							callBack();
						}
					}
					else {
						window.clearInterval(itvID);
						displaying = false;
						if (callBack) {
							callBack();
						}
					}
			}, 10);
		}
	}
};