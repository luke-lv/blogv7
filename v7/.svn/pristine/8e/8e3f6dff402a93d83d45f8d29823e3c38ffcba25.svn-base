/*
 * @fileoverview  得到一个元素是否在页面的可见区域
 * 				  
 * @author xy xinyu@staff.sina.com.cn
 * 
 */

$import("sina/utils/utils.js");
$import("sina/core/system/getScrollPos.js");
$import("sina/core/system/pageSize.js");

/**
 * 得到一个元素是否在页面的可见区域
 * @param {Object} obj
 * @param {Object} useCenterPoint 是否使用中心点计算，true代表使用中心点计算。
 */
Utils.isInViewPage=function(obj,useCenterPoint){
	var centerPoint=useCenterPoint||false;
	if(obj.style.display=="none")
		return false;
		
	var sizearr=Core.System.pageSize();
	var size={
		viewheight:sizearr[3],
		viewwidth:sizearr[2],
		totalheight:sizearr[1],
		totalwidth:sizearr[0]
	};
	
	var scrollarr=Core.System.getScrollPos();
	var scroll={
		top:scrollarr[0],
		left:scrollarr[1],
		width:scrollarr[2],
		height:scrollarr[3]
	};

	var objinfo={
		top:Core.Dom.getTop(obj),
		left:Core.Dom.getLeft(obj),
		bottom:Core.Dom.getTop(obj)+obj.offsetHeight,
		right:Core.Dom.getLeft(obj)+obj.offsetWidth
	};
	var flag=false;
	
	if (centerPoint) {//使用中心点计算
		var centerpos={
			x:Math.ceil((objinfo.left+objinfo.right)/2),
			y:Math.ceil((objinfo.top+objinfo.bottom)/2)
		};
		if(centerpos.x <= scroll.left ||
		centerpos.x >= (scroll.left + size.viewwidth) ||
		centerpos.y >= (scroll.top + size.viewheight) ||
		centerpos.y <= scroll.top){
			flag = false;
		}else{
			flag = true;
		}
	}
	else {
		if (objinfo.right <= scroll.left ||
		objinfo.left >= (scroll.left + size.viewwidth) ||
		objinfo.top >= (scroll.top + size.viewheight) ||
		objinfo.bottom <= scroll.top) {
			//说明不在屏幕显示范围内
			flag = false;
		}
		else {
			flag = true;
		}
	}
	return flag;
};
