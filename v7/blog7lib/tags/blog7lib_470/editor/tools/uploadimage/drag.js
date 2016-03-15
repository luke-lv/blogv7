/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 图片拖拽
 */
$import("sina/core/class/create.js");
$import("sina/ui/drag2.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/insertHTML.js");

var ImageDrag = Core.Class.create();

ImageDrag.prototype = {
    BLOCK_ID: "idarg_block",
    BORDER_ID: "id_border",
    BORDER_DIV: '<div id="id_border" style="float: left; width: 2px;height:50px; border: 2px dotted #51bd2f; margin-top: 2px;"></div>',
    CONTAINER_ID: "img_list",
    ITEM_ID: "image_list_",
    IMG_ID: "item_img_",
    ROW: 2,
    COL: 10,
    initialize: function(ele){
        ImageDragArea.setAreaNumber(this.CONTAINER_ID);
        
        var id = ele.id.split("_")[2];
        $E(this.IMG_ID + id).style.cursor = "move";
        Ui.Drag2.init(ele);
        
        ele.onDragStart = this.onDragStart.bind2(this);
        ele.onDrag = this.onDrag.bind2(this);
        ele.onDragEnd = this.onDragEnd.bind2(this);
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
     * 初始化拖动元素的位置
     * @param {Object} ele 拖动的元素
     */
    initDragPosition: function(ele){
        var xy = Core.Dom.getXY($E(this.BLOCK_ID));
        ele.style.position = "absolute";
        ele.style.top = (xy[1] + 1) + "px";
        ele.style.left = (xy[0] + 1) + "px";
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
     * 删除拖动元素占位的虚线方框
     */
    removeBlockEle: function(){
        Core.Dom.removeNode($E(this.BLOCK_ID));
    },
    /**
     * 开始拖动回调
     */
    onDragStart: function(){
        Ui.Drag2.draging = true;
        var id = this.getIdByEle(Core.Events.getEventTarget());
        var ele = $E(this.ITEM_ID + id);
        if (!this.block) {
            this.setBlockNumbers(this.ROW, this.COL);
        }
        this.setBlockEle(ele);
        this.initDragPosition(ele);
        
    },
    /**
     * 拖动中回调
     * @param {String} l left即x
     * @param {String} t top就是y
     */
    onDrag: function(l, t){
        var dargEle = $E(this.ITEM_ID + this.getIdByEle(Core.Events.getEventTarget()));
        if (!dargEle) {
            return;
        }
        var isTrue = this.setArea(dargEle, l, t);
        if (isTrue) {
            return;
        }
        var x = this.getXYNumber(l, 0, this.block.xs);
        var y = this.getXYNumber(t, ImageDragArea.minY, this.block.ys);
        
		
        //		trace("ImageDragArea.minX:"+ImageDragArea.minX+";ImageDragArea.minY:"+ImageDragArea.minY);
        trace("x:" + x + ";y:" + y);
        trace("l:" + l + ";t:" + t);
        
        if (!(isNaN(x) || isNaN(y))) {
            this.showDottedDiv(x, y);
        }
        
    },
    /**
     * 拖动结束回调
     */
    onDragEnd: function(){
		trace("end");
        var ele = Core.Events.getEventTarget();
		var ele_id=this.getIdByEle(ele);
		var border_ele = $E(this.BORDER_ID);
		if(ele_id.length<10){
			var el=$E("idarg_block").nextSibling;
			el.style.position = "";
			this.removeBlockEle();
			if(border_ele){
				Core.Dom.removeNode(border_ele);
			}
			return;
			
		}
        if (border_ele) {
            imageList.inserBefore(border_ele.nextSibling, this.getIdByEle(ele));
            Core.Dom.removeNode(border_ele);
            
        }
        else {
            var item = $E(this.ITEM_ID + this.getIdByEle(ele));
            item.style.position = "";
        }
        this.removeBlockEle();
        Ui.Drag2.draging = false;
        
    },
    /**
     * 获得鼠标在哪个区块中
     * @param {Number} at
     * @param {Number} start 起始数值
     * @param {Array}  array 范围数组
     */
    getXYNumber: function(at, start, array){
        var len = array.length;
        for (var i = 0; i < len; i++) {
            //				trace(array[i]);
            if (at < array[i] && at > start) {
                return i;
            }
            else {
                start = array[i];
            }
        }
    },
    /**
     * 移动占位虚框
     * @param {Number} x left范围
     * @param {Number} y top范围
     */
    showDottedDiv: function(x, y){
        var at = this.COL * y + x;
//        trace(">>>>>>>>>>at:" + at);
        var eles = Core.Dom.getChildrenByClass($E(this.CONTAINER_ID), "orderCell");
        var dragEle = Core.Events.getEventTarget();
//        trace(at);
        if (!eles[at]) {
            return;
        }
        var num = 1;
        if (at === 0) {
            num = 0;
        }
//        trace("at:" + at);
//        trace("selectAt:" + this.selectAt);
        if (this.selectAt) {
            if (this.selectAt == at) {
                return;
            }
        }
        
        Core.Dom.removeNode($E(this.BORDER_ID));
        
        //当前元素的前一个元素
        var p_ele = eles[at - num];
        //当前元素id
        var e_id = this.getIdByEle(eles[at]);
        //拖动元素id
        var d_id = this.getIdByEle(dragEle);
        //当前元素前一个元素id
        var p_id = this.getIdByEle(p_ele);
        
        //		trace("dragEle.id:"+d_id);
        //		trace("p_ele.+id:"+e_id);
        if (p_ele.isadd == "yes" && e_id != d_id && p_id != d_id) {
            trace(at);
            if (at >= this.COL * this.ROW) {
                trace("************");
                Core.Dom.addHTML($E(this.CONTAINER_ID), this.BORDER_DIV);
                //			Core.Dom.insertHTML(ele,this.BORDER_DIV,"AfterBegin");
            }
            else {
                Core.Dom.insertHTML(eles[at], this.BORDER_DIV, "BeforeBegin");
            }
            this.selectAt = at;
        }
        
    },
    /**
     * 将拖动区域划分为区块 存在xs和ys两个数组中
     * @param {Number} rowNum 行数
     * @param {Number} colNum 列数
     */
    setBlockNumbers: function(rowNum, colNum){
        var container = $E(this.CONTAINER_ID);
        var width = container.offsetWidth;
        var height = container.offsetHeight;
        var xy = Core.Dom.getXY(container);
        this.block = {
            xs: [],
            ys: []
        };
        
        var xLen = colNum * 2;
        for (var i = 1; i <= xLen; i++) {
            var step = width / xLen;
            if (i == 1) {
                this.block.xs.push(xy[0] + step);
            }
            else {
                this.block.xs.push(step * 2 + this.block.xs[i - 2]);
            }
        }
        
        var yLen = rowNum * 2;
        for (var j = 1; j <= yLen; j++) {
            var stepj = height / yLen;
            if (j == 1) {
                this.block.ys.push(xy[1] + stepj);
            }
            else {
                this.block.ys.push(this.block.ys[j - 2] + stepj * 2);
            }
        }
        trace("this.block.xs:" + this.block.xs);
        trace("this.block.ys:" + this.block.ys);
    
    },
    /**
     * 限制拖动范围
     * @param {Element} ele 拖动的对象
     * @param {Number} l   当前的left
     * @param {Number} t   当前的top
     */
    setArea: function(ele, l, t){
        if (l < ImageDragArea.minX) {
            ele.style.left = ImageDragArea.minX + 'px';
            return true;
        }
        if (l > ImageDragArea.maxX) {
            ele.style.left = ImageDragArea.maxX + 'px';
            return true;
        }
        if (t < ImageDragArea.minY) {
            ele.style.top = ImageDragArea.minY + 'px';
            trace("t:" + t + ";ele.style.top:" + ele.style.top);
            trace("ImageDragArea.minX:" + ImageDragArea.minX + ";ImageDragArea.minY:" + ImageDragArea.minY);
            return true;
        }
        if (t > ImageDragArea.maxY) {
            ele.style.top = ImageDragArea.maxY + 'px';
            return true;
        }
        return false;
    }
};

ImageDragArea={
	/**
	 * 设置拖动范围
	 */
	setAreaNumber:function(containerId){
		if(this.minX){
			return;
		}
	    var container = $E(containerId);
	    xy = Core.Dom.getXY(container);
	    trace(">>>>>>>>>xy:" + xy);
	    this.minX = xy[0];
	    this.minY = xy[1];
	    this.maxX = xy[0] + container.offsetWidth - 57;
	    this.maxY = xy[1] + container.offsetHeight - 57;
	}
};
