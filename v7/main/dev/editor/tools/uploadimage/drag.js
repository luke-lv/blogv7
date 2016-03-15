/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 图片拖拽
 */
$import("sina/core/class/create.js");
$import("sina/ui/drag2.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopBubble.js");
$import("sina/core/events/stopDefaultEvent.js");
var ImageDrag = Core.Class.create();
/**
 * 使用拖拽图片次数
 */
ImageDrag.dragElementCounter=0;

/**
 * 拖拽排序要用到的属性
 */
ImageDrag.dragSortObj={
	/**
	 * 第一个图片框相对于文档的水平偏移
	 */
	baseOffsetLeft:0,
	/**
	 * 第一个图片框相对于文档的垂直偏移
	 */
	baseOffsetTop:0,
	/**
	 * 图片框区域的宽
	 */
	imgOffsetWidth:0,
	/**
	 * 图片框区域的高
	 */
	imgOffsetHeight:0,
	/**
	 * 图片框间的水平间隙宽度
	 */
	horizontalGap:0,
	/**
	 * 图片框间的垂直间隙高度
	 */
	verticalGap:0
};

ImageDrag.prototype = {
	/**
	 * ImageDrag实例的构造器指向
	 */
	constructor:ImageDrag,
	/**
	 * 被拖拽元素在图片数组中的索引值
	 */
	dragElementIndex:0,
    BLOCK_ID: "idarg_block",
    BORDER_ID: "id_border",
    BORDER_DIV: '<div id="id_border" style="position:absolute;top:0;left:0;float:left;width:2px;height:50px;border:2px dotted #51bd2f; margin-top: 2px;"></div>',
    CONTAINER_ID: "img_list",
    ITEM_ID: "image_list_",
    IMG_ID: "item_img_",
    ROW: 2,
    COL: 10,
	/**
	 * 图片拖拽排序的算法实现
	 * @param {Object} event 事件对象
	 */
	sortImagesByDrag:function(event){
	
		var dso=this.constructor.dragSortObj;
		
		//如果页面只添加了一个图片 不执行拖拽排序代码
		if(this.constructor.dragElementCounter<=1){
			return;
		}
		
		//得到鼠标的当前坐标 并判断该坐标是属于哪个图片框中
		var mX=event.clientX,
		    mY=event.clientY,
			v=mX-dso.baseOffsetLeft,
			v1=mY-dso.baseOffsetTop,
			modX=v%(dso.imgOffsetWidth+dso.horizontalGap),
		    modY=v1%(dso.imgOffsetHeight+dso.verticalGap);
		
		//鼠标点不在图片框区域 
		if( modX<0 || modX > dso.imgOffsetWidth || modY <0 || modY > dso.imgOffsetHeight ){
			return;
		}
		
		var xMouseoverImgIndex=Math.ceil(v/(dso.imgOffsetWidth+dso.horizontalGap)),
			yMouseoverImgIndex=Math.ceil(v1/(dso.imgOffsetHeight+dso.verticalGap)),
			f=(yMouseoverImgIndex-1)*this.COL+xMouseoverImgIndex-1;
		
		//鼠标点在当前拖拽元素图片框的区域内 或在当前元素的后一个图片框区域内 不做插入提示
		if(f==this.dragElementIndex || f == this.dragElementIndex+1){
			$E(this.BORDER_ID).style.display="none";
			return;
		}
		
		var eles = Core.Dom.getChildrenByClass($E(this.CONTAINER_ID), "orderCell");
		if(eles[f].getAttribute("isadd")=="yes" || f==this.constructor.dragElementCounter){
			var xy=Core.Dom.getXY(eles[f]);
			$E(this.BORDER_ID).style.display="";
			$E(this.BORDER_ID).style.left=xy[0]-5+"px";
			$E(this.BORDER_ID).style.top=xy[1]+"px";
			$E(this.BORDER_ID).borderIndex=f;
		}else{
			$E(this.BORDER_ID).style.display="none";
		}
	},
	initialize: function(ele){
		var dso=this.constructor.dragSortObj;
		
		//添加图片数量记数
		if(++this.constructor.dragElementCounter==1){
			//创建插入提示框 图片拖拽时使用
			var d=document.createElement("div");
			d.id="id_border";
			d.style.cssText="display:none;position:absolute;top:0;left:0;float:left;width:2px;height:50px;border:2px dotted #51bd2f; margin-top: 2px;";
			document.body.appendChild(d);
		}
		
		//第一个图片框区域相对于文档的偏移 随后的图片框区域都根据此值+图片框offsetWidth,offsetHeight,水平间隙,垂直间隙来计算
		var r=Core.Dom.getElementsByClass($E(this.CONTAINER_ID),"div","divImg");
		if(r.length!=this.ROW*this.COL){
			return;
		}
		
		//得到第一个图片框相对于文档的偏移
		var firstImg=r[0].getElementsByTagName("img")[0];
		var xy=Core.Dom.getXY(firstImg);
		dso.baseOffsetLeft=xy[0];
		dso.baseOffsetTop=xy[1];
		
		dso.imgOffsetWidth=firstImg.offsetWidth;
		dso.imgOffsetHeight=firstImg.offsetHeight;
		
		//得到第this.COL+1个图片框相对于文档的偏移
		var nImg=r[this.COL+1].getElementsByTagName("img")[0];
		var xy1=Core.Dom.getXY(nImg);
		dso.horizontalGap=xy1[0]-dso.baseOffsetLeft-dso.imgOffsetWidth;
		dso.verticalGap=xy1[1]-dso.baseOffsetTop-dso.imgOffsetHeight;
		
        ImageDragArea.setAreaNumber(this.CONTAINER_ID);
        
		//为我的电脑 博客图片 网上图片三个选项卡注册click事件 
		//当在这三个选项切换的时候 拖动区域的offsetleft,offsettop是变化的 要及时更新
		var _this=this;
		var headerTab=$E("headerTab");
		if(headerTab){
			var _CONTAINER_ID=this.CONTAINER_ID;
			var liArr=headerTab.getElementsByTagName("li");
			for(var i=0;i<liArr.length;i++){
                Core.Events.addEvent(liArr[i], function(){
					//ie6下要延迟执行
                    setTimeout(function(){
						var xy=Core.Dom.getXY($E(_CONTAINER_ID).firstChild.getElementsByTagName("img")[0]);
						dso.baseOffsetLeft=xy[0];
						dso.baseOffsetTop=xy[1];
						ImageDragArea.setAreaNumber(_CONTAINER_ID);
					},100);
                });
			}
		}
		
        var id = ele.id.split("_")[2];
        $E(this.IMG_ID + id).style.cursor = "move";
		
		Core.Events.addEvent(ele,function(e){_this.drag(e,ele);},"mousedown",false);
				
		//mousedown
        ele.onDragStart = this.onDragStart.bind2(this);
        //mousemove
		ele.onDrag = this.onDrag.bind2(this);
        //mouseup
		ele.onDragEnd = this.onDragEnd.bind2(this);
    },
	/**
	 * 图片拖拽函数
	 * @param {Object} e		   事件对象
	 * @param {Object} dragElement 要拖拽的dom元素
	 * 如果dragElement元素的三个属性onDragStart,onDrag,onDragEnd有值 且为函数
	 * 那么会在mousedown,mousemove,mouseup时分别触发这三个函数
	 */
    drag: function(e, dragElement){
		//如果拖拽元素mousedown的时候 position就为absolute
		//则认为是在非ie浏览器下 鼠标在iframe外释放 直接return
		if(!document.all && dragElement.style.position=="absolute"){
			return;
		}
		
        e = e || window.event;
		
		if(!e.target){
			e.target=e.srcElement;
		}
		//如果激活事件元素是超链接 该行为为删除图片 不做拖拽处理
		if(e.target.tagName.toUpperCase() == "A"){
			this.constructor.dragElementCounter--;
			return;
		}
		
		var xy=Core.Dom.getXY(dragElement);
        var startX = e.clientX - xy[0], startY = e.clientY - xy[1];
        
		if(Object.prototype.toString.call(dragElement.onDragStart)=== "[object Function]"){
			dragElement.onDragStart();
		}
		
        if (document.addEventListener) {
            document.addEventListener("mousemove", mousemove, true);
            document.addEventListener("mouseup", mouseup, true);
        }
        else {
            dragElement.setCapture();
            dragElement.attachEvent("onmousemove", mousemove);
            dragElement.attachEvent("onmouseup", mouseup);
            dragElement.attachEvent("onlosecapture", mouseup);
        }
        
        Core.Events.stopBubble(e);
        Core.Events.stopDefaultEvent(e);
		
        function mousemove(moveEvent){
            moveEvent = moveEvent || windwo.event;
			
            var currentLeft = moveEvent.clientX - startX;
            var currentTop = moveEvent.clientY - startY;
            
			//如果ImageDragArea.minX属性存在 说明设置了拖动区域
            //判断当前currentLeft currentTop是否在拖动区域内
			if (ImageDragArea.minX) {
				currentLeft = Math.max(Math.min(currentLeft,ImageDragArea.maxX),ImageDragArea.minX);
                currentTop = Math.max(Math.min(currentTop,ImageDragArea.maxY),ImageDragArea.minY);
			}
            
            dragElement.style.left = currentLeft + "px";
            dragElement.style.top = currentTop + "px";
            
            Core.Events.stopBubble(e);
        	Core.Events.stopDefaultEvent(e);
            
			if(Object.prototype.toString.call(dragElement.onDrag)=== "[object Function]"){
				dragElement.onDrag(moveEvent);
			}
        }
        
        function mouseup(upEvent){
            upEvent = upEvent || window.event;
            
            if (document.removeEventListener) {
                document.removeEventListener("mousemove", mousemove, true);
                document.removeEventListener("mouseup", mouseup, true);
            }
            else {
                dragElement.detachEvent("onmousemove", mousemove);
                dragElement.detachEvent("onmouseup", mouseup);
                dragElement.detachEvent("onlosecapture", mouseup);
                dragElement.releaseCapture();
            }
			
            Core.Events.stopBubble(e);
        	Core.Events.stopDefaultEvent(e);
			
			if(Object.prototype.toString.call(dragElement.onDragEnd)=== "[object Function]"){
				dragElement.onDragEnd();
			}
        }
    },
	/**
     * 设置替拖动元素占位的虚线方框
     */
    setBlockEle: function(ele){
		var html = '<div id="' + this.BLOCK_ID + '" style="border: 2px dotted #51bd2f; float:left;height:58px;margin-left:4px;margin-bottom:12px;overflow:hidden;width:54px;"></div>';
        var blockEle = $E(this.BLOCK_ID);
        if (blockEle) {
            this.removeBlockEle();
        }
		Core.Dom.insertHTML(ele, html, "BeforeBegin");
    },
	/**
     * 初始化拖动元素的位置
     * @param {Object} ele 拖动的元素
     */
    initDragPosition: function(ele){
		//虚线框的offsetleft offsettop
        var xy = Core.Dom.getXY($E(this.BLOCK_ID));
		
		//ele div
		//最好使用csstext设置样式属性
        ele.style.position = "absolute";
		ele.style.zIndex = 1000000;
        ele.style.top = (xy[1] + 1) + "px";
        ele.style.left = (xy[0] + 1) + "px";
    },
	/**
     * 开始拖动回调
     */
    onDragStart: function(e){
		
        var id = this.getIdByEle(Core.Events.getEventTarget());
		
		//ele=<div>
        var ele = $E(this.ITEM_ID + id);
		
		//确定拖拽元素在图片数组中的索引值
		var child=$E("img_list").childNodes;
		for(var i=0;i<child.length;i++){
			if(ele==child[i]){
				this.dragElementIndex=i;
				break;
			}
		}
		child=null;
		
		//先将拖动元素设置成absolute 否则在ie下 拖拽第11个图片元素时会出现位置错乱
		ele.style.position="absolute";
		
		//虚线框
        this.setBlockEle(ele);
		//初始化拖动元素的位置
        this.initDragPosition(ele);
		
		//如果拖动时当前选项卡是我的电脑 
		//当鼠标在flash组件上的mouseup时候 程序会接收不到 导致被拖拽元素没有归位
		//解决办法:把flash组件 隐藏掉 mouseup时再显示出来
		var useClient = $E("useClient");
		if(useClient && useClient.style.display != "none"){
			var flashDiv=useClient.lastChild;
			if(flashDiv.tagName=="DIV"){
				flashDiv.style.display="none";
			}
		}
    },
    /**
     * 拖动中回调
     * @param {Object} event 事件对象
     */
    onDrag: function(event){
		this.sortImagesByDrag(event);
    },
    /**
     * 拖动结束回调
     */
    onDragEnd: function(){
		//显示flash
		var useClient = $E("useClient");
		if(useClient && useClient.style.display != "none"){
			var flashDiv=useClient.lastChild;
			if(flashDiv.tagName=="DIV"){
				flashDiv.style.display="block";
			}
		}
		
		var border_ele = $E(this.BORDER_ID);
		
		var eles = Core.Dom.getChildrenByClass($E(this.CONTAINER_ID), "orderCell");
        if (border_ele.style.display=="") {
            imageList.inserBefore(eles[border_ele.borderIndex], eles[this.dragElementIndex]);
			border_ele.style.display="none";
        }
        else {
			//将拖动的div放回原来的位置
            var item = eles[this.dragElementIndex];
            item.style.position = "";
			if(!document.all){
				item.getElementsByTagName("a")[1].blur();
			}else{
				//解决ie下拖拽排序后鼠标移动到拖动范围外释放  拖拽元素归为后依然保持a:hover状态
				item.firstChild.getElementsByTagName("div")[0].firstChild.style.borderColor="#F5F5F5";
			}
        }
        this.removeBlockEle();
    },
    /**
     * 获得每个item的唯一id
     * @param {Object} ele item元素或其子元素
     */
    getIdByEle: function(ele){
        var arr = ele.id.split("_");
        return arr[arr.length - 1];
    },
    
    
    /**
     * 删除拖动元素占位的虚线方框
     */
    removeBlockEle: function(){
        Core.Dom.removeNode($E(this.BLOCK_ID));
    }
};

ImageDragArea={
	/**
	 * 设置拖动范围
	 */
	setAreaNumber:function(containerId){
		
	    var container = $E(containerId);
		//拖动区域距body的offsetleft offsettop
	    xy = Core.Dom.getXY(container);
	    trace(">>>>>>>>>xy:" + xy);
		//minX为拖动区域的offsetleft
	    this.minX = xy[0];
		//minY为拖动区域的offsettop
	    this.minY = xy[1];
		//57应该是拖动div的宽 高
		//拖动最大的offsetleft
	    this.maxX = xy[0] + container.offsetWidth - 57;
		//拖动最大的offsettop
	    this.maxY = xy[1] + container.offsetHeight - 57;
		//alert(this.minX+" "+this.maxX+" "+this.minY+" "+this.maxY);
	}
};
