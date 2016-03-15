/**
 * @fileoverview 相册冲印 尺寸大小提示
 * @author wujian|wujian@staff.sina.com.cn
 * 
 */
$import("sina/core/events/getEvent.js");
$import("sina/core/dom/getXY.js");
/**
 * 显示提示
 * @param {Object} e
 */
window.showTip=function(e){			
	var a=Core.Events.getEvent();
	var _this=a.target||a.srcElement;
	if(!$E("tipEle")){
				//var s='<div class="tip_info" style="display:none" ></div>'
		var ele=$C("div");
		ele.className="tip_info";
		ele.id="tipEle";
		ele.innerHTML="为保证优质的冲印效果，我们建议您使用的照片尺寸大于800 x 600像素";
			
		document.body.appendChild(ele);		
	}
	
	var re=Core.Dom.getXY(_this);
	var l=re[0]+7;ri=re[1]-80;
	var ss="left:"+l+"px;top:"+ri+"px;";
			
	$E("tipEle").style.cssText=ss;
			
};

/**
 * 隐藏提示
 * @param {Object} e
 */
window.hideTip=function(e){
	var a=Core.Events.getEvent();
	var _this=a.target||a.srcElement;			
	$E("tipEle").style.cssText="left:-3000px;";
};