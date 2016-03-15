/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 图片操作浮层，美化图片
 */
$import("lib/editor/utils/utils.js");
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/getEventTarget.js");
$import("sina/core/dom/addHTML.js");
$import("sina/core/dom/getLeft.js");
$import("sina/core/dom/setStyle.js");
$import("sina/core/dom/getTop.js");
$import('sina/core/system/getScrollPos.js');
$import("sina/ui/panel.js");
$import("lib/editor/utils/image/Modify.js");


Editor.Utils.ImageOperate = Core.Class.create();
Editor.Utils.ImageOperate.prototype = {
    sizeStatus: ["mw690", "bmiddle", "small"], //middle
    size: "big",
    isShow: false,
    regStr: "",
    sizeOperate: true,
    initialize: function(reg){
        //trace("ImageOperate.initialize");
        var template = '<div id="#{panel}" class="img_ediLayer" style="position:absolute;"><div id="#{content}"></div></div>';
        //this.regStr = reg || "photo.sina.com.cn";
		//Modified by W.Qiang , pictures's domain changes to sinaimg.cn, 2011-03-15
		this.regStr = reg || "sinaimg.cn";
        this.layer = new Ui.Panel();
        this.layer.setTemplate(template);
        this.initElement();
        var ifameEle = $E("SinaEditor_Iframe");
        
        this.editorTop = Core.Dom.getTop(ifameEle);
        this.editorLeft = Core.Dom.getLeft(ifameEle);
        
        this.editorBottom = this.editorTop + ifameEle.offsetHeight;
        this.editorRight = this.editorLeft + ifameEle.offsetWidth;
        this.setOpacity();
        
    },
    setOpacity: function(num){
        num = num || 0.8;
        Core.Dom.setStyle(this.layer.entity, "opacity", "0.8");
    },
    show: function(ele){
        var size;
        this.target = ele;
        //插入表情和插入股票的图片不显示图片操作浮层
        if (this.target.src.indexOf("sinajs.cn") != -1 || this.target.src.indexOf("/myshow/") != -1) {
            return;
        }
		
        if (ele.src.indexOf(this.regStr) != -1) {
            if (!this.sizeOperate) {
                this.showSizeOperate();
            }
            ele.src.replace(/(\/)(small|bmiddle|mw690|middle)(\/)/g, function(a, b, c){ //middle 兼容老博文
                size = c;
            });
            this.setSize(size);
            this.setSizeColor();
            this.setAllCacheImage();
            if (this.checkFlashVersion()) {
                this.showEdit();
            }
            else {
                this.hiddenEdit();
            }
            
        }
        else {
            this.hiddenEdit();
            if (this.sizeOperate) {
                this.hiddenSizeOperate();
            }
        }
        this.setPosition();
        this.layer.show();
        this.isShow = true;
    },
    checkFlashVersion: function(){
        var obj = deconcept.SWFObjectUtil.getPlayerVersion();
        if (obj.major < 10) {
            return false;
        }
        return true;
    },
    setCacheImage: function(size){
        var data = {
            size: size
        };
        data.url = this.target.src.replace(/(\/)(small|bmiddle|bmiddle)(\/)/g, "$1" + size + "$3");
        var html = '<img style="display:none" src="#{url}" id="image_operate_cache_#{size}"/>';
        var template = new Ui.Template(html);
        //editor.insertHTML(template.evaluate(data));
        Core.Dom.addHTML(document.body, template.evaluate(data));
    },
    setAllCacheImage: function(){
        var len = this.sizeStatus.length;
        for (var i = 0; i < len; i++) {
            this.setCacheImage(this.sizeStatus[i]);
        }
    },
    removeAllCache: function(){
        var len = this.sizeStatus.length;
        for (var i = 0; i < len; i++) {
            //var ele=editor.iframeDocument.getElementById("image_operate_"+this.sizeStatus[i]);
            var ele = $E("image_operate_cache_" + this.sizeStatus[i]);
            if (ele) {
                ele.parentNode.removeChild(ele);
            }
        }
    },
    setPosition: function(){
        var scrollPos = Core.System.getScrollPos(editor.iframeDocument);
        var top = this.editorTop + Core.Dom.getTop(this.target) - scrollPos[0];
        if (top < this.editorTop) {
            top = this.editorTop;
        }
        var left = this.editorLeft + Core.Dom.getLeft(this.target) + 19;
        
        this.layer.setPosition({
            x: left,
            y: top
        });
    },
    getTop: function(element){
        var top = 0;
        var el = element;
        if (el.offsetParent) {
            while (el.offsetParent) {
                top += el.offsetTop;
                el = el.offsetParent;
            }
        }
        else 
            if (el.y) {
                top += el.y;
            }
        return top;
    },
    getLeft: function(element){
        var left = 0;
        var el = element;
        if (el.offsetParent) {
            while (el.offsetParent) {
                left += el.offsetLeft;
                el = el.offsetParent;
            }
        }
        else 
            if (el.x) {
                left += el.x;
            }
        return left;
    },
    hidden: function(){
        if (this.isShow) {
            this.removeAllCache();
            this.layer.hidden();
            this.finalize();
            this.isShow = false;
        }
    },
    finalize: function(){
        if (this.target) {
            //            this.target.id = "";
            this.target = null;
        }
    },
    change: function(){
        if (!window.templateDialog || !window.templateDialog.entity) {
            window.templateDialog = new Editor.Utils.IframeDialog({
                url: "http://control.blog.sina.com.cn/admin/ria/article_addM_image.php?type=1",
                title: "插入图片",
                width: 650,
                height: 500,
                dialogName: "templateDialog"
            });
        }
        window.templateDialog.show();
        editor.iframeWindow.focus();
        this.layer.hidden();
    },
    del: function(){
        //trace("imageOperate.del");
        this.target.parentNode.removeChild(this.target);
        this.hidden();
    },
    edit: function(){
        if (!this.modify) {
            this.modify = new Editor.Utils.Modify();
        }
        rssSendLog('11_31_pic_tupianchuli2');
        scope.editImage = this.target;
        this.modify.show();
        this.hidden();
        return false;
    },
    setBig: function(){
        if (this.size == "big") {
            return;
        }
        this.clearWidth();
        this.target.src = this.target.src.replace(/(\/)(small|bmiddle)(\/)/g, "$1mw690$3"); //middle
        this.size = "big";
        this.setSizeColor();
        this.hidden();
    },
    setMiddle: function(){
        if (this.size == "middle") {
            return;
        }
        this.clearWidth();
        this.target.src = this.target.src.replace(/(\/)(small|mw690)(\/)/g, "$1bmiddle$3"); //middle
        this.size = "middle";
        this.setSizeColor();
        this.hidden();
    },
    setSmall: function(){
        if (this.size == "small") {
            return;
        }
        this.clearWidth();
        this.target.src = this.target.src.replace(/(\/)(mw690|bmiddle)(\/)/g, "$1small$3"); //middle
        this.size = "small";
        this.setSizeColor();
        this.hidden();
    },
    clearWidth: function(){
        this.target.style.height = "";
        this.target.style.width = "";
        this.target.removeAttribute("width");
        this.target.removeAttribute("height");
    },
    setSize: function(type){
        switch (type) {
            case "mw690": //middle
            case "middle": //middle //兼容老博文
                this.size = "big";
                break;
            case "bmiddle":
                this.size = "middle";
                break;
            case "small":
                this.size = "small";
                break;
        }
    },
    showSizeOperate: function(){
		var imgOpSize = $E("image_operate_size");
		if(imgOpSize)
        	imgOpSize.style.display = "";
        $E("image_operate_big").style.display = "";
        $E("image_operate_middle").style.display = "";
        $E("image_operate_small").style.display = "";
		imgOpSize = null;
        this.sizeOperate = true;
    },
    showEdit: function(){
        //$E("image_operate_edit").style.display = "";
    },
    hiddenEdit: function(){
        //$E("image_operate_edit").style.display = "none";
    },
    hiddenSizeOperate: function(){
		//Modify by W.Qiang
		var imgOpSize = $E("image_operate_size");
		var imgOpBig = $E("image_operate_big");
		var imgOpMiddle = $E("image_operate_big");
		var imgOpSmall = $E("image_operate_small");
		if(imgOpSize)
        	imgOpSize.style.display = "none";
		if(imgOpBig)
        	imgOpBig.style.display = "none";
		if(imgOpMiddle)
        	imgOpMiddle.style.display = "none";
		if(imgOpSmall)
        	imgOpSmall.style.display = "none";
		imgOpSize = imgOpBig = imgOpMiddle = imgOpSmall=null;
        this.sizeOperate = false;
    },
    setSizeColor: function(){
        $E("image_operate_big").className = "";
        $E("image_operate_middle").className = "";
        $E("image_operate_small").className = "";
        $E("image_operate_" + this.size).className = "size";
    },
    initElement: function(){
        var html = '<div class="conn">\
						<div class="tit">编辑图片</div>\
						<ul>\
							<li><a href="javascript:void(0);" onclick="return false" id="image_operate_change">更改图片</a></li>\
							<li><a href="javascript:void(0);" onclick="return false" id="image_operate_del">删除图片</a></li>\
							<li>\
								<a href="javascript:void(0);" onclick="return false" id="image_operate_big" class="size">大</a>\
								<a href="javascript:void(0);" onclick="return false" id="image_operate_middle" class="mid">中</a>\
								<a href="javascript:void(0);" onclick="return false" id="image_operate_small">小</a>\
							</li>\
						</ul>\
					</div>';
        var template = new Ui.Template(html);
        var data = {};
        this.layer.setContent(template.evaluate(data));
        Core.Events.addEvent($E("image_operate_change"), this.change.bind2(this));
        Core.Events.addEvent($E("image_operate_del"), this.del.bind2(this));
        //Core.Events.addEvent($E("image_operate_edit"), this.edit.bind2(this));
        Core.Events.addEvent($E("image_operate_big"), this.setBig.bind2(this));
        Core.Events.addEvent($E("image_operate_middle"), this.setMiddle.bind2(this));
        Core.Events.addEvent($E("image_operate_small"), this.setSmall.bind2(this));
    }
};
