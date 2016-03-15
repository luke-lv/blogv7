/**
 * @fileoverview 移动博客标题位置
 * @author xinyu@staff.sina.com.cn
 * @date 2009-08-06
 */

$import("sina/sina.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/fixEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/function/bind2.js");
$import("sina/core/dom/getStyle.js");
$import("pageSet/pageSetVariables.js");
var makeDrag_flag=false;

function moveTitle(){
	var obj=$E('blogTitle');
	var head=$E('sinablogHead');
	obj.onmouseover=function(){
		obj.style.border="1px dashed #AAAAAA";
		obj.style.cursor="move";
	};
	obj.onmouseout=function(){
		obj.style.border="";
	};

	obj.onmousedown = function (){
		e = Core.Events.fixEvent(Core.Events.getEvent());
		Core.Events.stopEvent();
		var obj=$E('blogTitle');


		var cPos = getCurPos();//按下时的鼠标坐标
		var orgPos={//拖动对象原来的left,top
			x:obj.offsetLeft,
			y:obj.offsetTop
		};
		trace("标题原来的位置是(offset...得到)："+orgPos.x+","+orgPos.y);
		makeDrag_flag = true;
		document.onmouseup = function (){
			if (makeDrag_flag == true) {
				makeDrag_flag = false;
				document.onmousemove = null;
				document.onmouseup = null;
			}		

	    };
		document.onmousemove = function (){
			var obj=$E('blogTitle');
			var head=$E('sinablogHead');
			obj.style.border="1px dashed #AAAAAA";
			if (makeDrag_flag){//移动中计算坐标
				
				$E('blogTitle').style.position = 'absolute';
				var Pos = getCurPos();

				if(Pos.y-cPos.y+orgPos.y<0){
					obj.style.top=0+'px';
				}else if(Pos.y-cPos.y+orgPos.y+obj.offsetHeight-head.offsetHeight>0){
					obj.style.top=head.offsetHeight-obj.offsetHeight+'px';
				}else{
					obj.style.top=orgPos.y+Pos.y-cPos.y+'px';
				}
				
				if(Pos.x-cPos.x+orgPos.x<0){
					obj.style.left=0+'px';
				}else if(Pos.x-cPos.x+orgPos.x+obj.offsetWidth-head.offsetWidth>0){
					obj.style.left=head.offsetWidth-obj.offsetWidth+'px';
				}else{
					obj.style.left=orgPos.x+Pos.x-cPos.x+'px';
				}
				
			}
			return false;
		};
	};
	
	
}

function getObjPos(obj){
	var x =0, y = 0;
	if (obj.getBoundingClientRect)
	{
		var box = obj.getBoundingClientRect();
		var D = document.documentElement;
		var DD= obj.ownerDocument;
		x = box.left + Math.max(D.scrollLeft, document.body.scrollLeft) - D.clientLeft;
		y = box.top + Math.max(D.scrollTop, document.body.scrollTop) - D.clientTop;		
	}
	else
	{
		for(; obj != document.body; x += obj.offsetLeft, y += obj.offsetTop, obj = obj.offsetParent );
	}
	return {'x':x, 'y':y};
}

function getCurPos(){
	e = Core.Events.fixEvent(Core.Events.getEvent());

	return {
		x: e.clientX,
		y: e.clientY	
	};
}

