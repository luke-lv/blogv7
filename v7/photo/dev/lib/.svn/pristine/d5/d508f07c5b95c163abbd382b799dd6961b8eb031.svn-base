/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 设置工具栏按钮状态类状态
 */
$import("lib/editor/tools/tools.js");
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/function/bind2.js");
$import("sina/core/events/getEventTarget.js");
$import("sina/core/dom/setStyle.js");
$import("sina/core/dom/getStyle.js");

Editor.Tools.Status = Core.Class.create();

Editor.Tools.Status.prototype = {
    config: [],
    initialize: function(id, editor, conf){
        this.id = id;
        this.editor = editor;
        this.config = conf || ["bold", "italic", "underline", "forecolor", "hilitecolor", "fontsize", "family"];
        //trace(this.config);
    },
	/**
	 * 设置this.config中所有元素对应的按钮的状态
	 */
    checkAllStatus: function(){
		//trace("ToolStatus.checkAllStatus");
        for (var i = 0; i < this.config.length; i++) {
            this.setToolItemStatus(this.config[i]);
        }
    },
	/**
	 * 根据类型设置按钮状态
	 * @param {String} actionType this.config 中的值，能够绝对定位到某个按钮元素上
	 */
    setToolItemStatus: function(actionType){
        //trace("ToolStatus.setToolItemStatus:actionType:"+actionType);
		switch(actionType) {
			case "bold":
			case "italic":
			case "underline":
				var isSelect=this.editor.iframeDocument.queryCommandState(actionType);
				this.swapStatus(actionType,isSelect);
				break;
			case "forecolor":
				var elm = this.editor.getFocusElement();
				var forecolor = Core.Dom.getStyle(elm, "color");
				if(!forecolor){
					break;
				}
				try{
					Core.Dom.setStyle($E("forecolor_"+this.id), "backgroundColor", forecolor);	
				}catch(e){
					
				}
				
				break;
			case "hilitecolor":
				var elm = this.editor.getFocusElement();
				var hilitecolor = Core.Dom.getStyle(elm, "backgroundColor");
				if(!hilitecolor){
					break;
				}
				if (hilitecolor == "transparent") {
					hilitecolor = "#ccc";
				}
				try{
					Core.Dom.setStyle($E("hilitecolor_"+this.id), "backgroundColor", hilitecolor);
				}catch(e){
					
				}
				
				break;
			case "fontsize":
				var elm = this.editor.getFocusElement();
				var fontsize = Core.Dom.getStyle(elm, "fontSize");
				if(!fontsize){
					break;
				}
				if(fontsize.indexOf(".")!=-1 || fontsize.indexOf("px")==-1){
					fontsize="";
					return ;
				}
				// 修复IE中使用size设定的文字大小问题, FireFox是正确的px值
				if(fontsize == 1) fontsize = "10px";
				else if(fontsize == 2) fontsize = "13px";
				else if(fontsize == 3) fontsize = "16px";
				else if(fontsize == 4) fontsize = "18px";
				else if(fontsize == 5) fontsize = "24px";
				else if(fontsize == 6) fontsize = "32px";
				else if(fontsize >= 7) fontsize = "48px";
				
				// 解决非IE浏览器显示非整数问题
				if(!$IE) {
					fontsize = window.parseInt(fontsize) + "px";
				}
				$E("fontsize_"+this.id).innerHTML = "<div>" + fontsize + "</div>";
                // console.log(fontsize);
				break;
			case "family":
				var elm = this.editor.getFocusElement();
				var family = Core.Dom.getStyle(elm, "fontFamily");
				if(!family){
					break;
				}
				family = family.split(",");
				family = family[0].replace(/'|"/g, "");
				//trace(family);
				var tmp_fm = family.split("_");
				if(tmp_fm.length > 0) {
					family = tmp_fm[0];
				}
				$E("family_"+this.id).innerHTML= "<div>" + this.__getFontName(family) + "</div>";
				break;
				
			case "redo":
		
				break;
			case "undo":
		
				break;

		}      
    },
	/**
	 * 通过更换className来切换按钮的选择状态与正常状态
	 * @param {String} type 根据类型来确定按钮元素
	 * @param {Boolean} isHot true:为选择状态；false:为正常状态
	 */
    swapStatus: function(type,isHot){
		//trace(type+":"+isHot);
        var target = $E(type + "_" + this.id);
        var idArr = target.className.split("_");
        idArr.pop();
        if (isHot) {
            target.className = idArr.join("_") + "_3";
        }
        else {
            target.className = idArr.join("_") + "_1";
        }
        
    },
	__getFontName: function(font){
		var name = '';
		switch(font.toLowerCase()){
			case 'simsun' : 
				name = '宋体';
				break;
			case 'microsoft yahei' : 
				name = '微软雅黑';
				break;
			default:
				name = font;
		}
		return name;
	}
};
