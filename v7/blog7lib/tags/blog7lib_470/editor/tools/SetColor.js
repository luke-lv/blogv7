/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 设置背景色
 * @author dongguang | dongguang@staff.sina.com.cn
 */
$import("lib/editor/tools/tools.js");
$import("sina/core/class/create.js");
$import("sina/ui/panel.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/events/fixEvent.js");
$import("lib/editor/tools/OperateLayer.js");
$import("sina/utils/flash/swf.js");
$import("sina/core/math/getUniqueId.js");

Editor.Tools.SetColor= Core.Class.create();

Editor.Tools.SetColor.prototype = {
initialize:function(editor,tamplate,flashCallback){
		//trace("ForeColor");
		this.stopEvent();
		this.editor=editor;
		this.id=Core.Math.getUniqueId();
		this.layer=new Ui.Panel();
		this.layer.setTemplate(tamplate);
		this.initElement(flashCallback);
		this.setPosition();
	},
	/**
	 * 初始化内容元素
	 * @param {String} flashCallback 供flash回调的全局函数名
	 */
	initElement:function(flashCallback){
		var swf_url=$_GLOBAL.flashBasicURL + "ColorPicker.swf?"+Core.Math.getUniqueId();
		  Utils.Flash.swfView.Add(swf_url, this.layer.entity, "seteditorcolorswf_"+this.id, "251", "264", "8.0.0.0", "#000",{
		  	callback: flashCallback
		  }, {
            scale: "showall",
			loop:"true",
			play:"true",
			pluginspage:"http://www.macromedia.com/go/getflashplayer",
            allowScriptAccess: "always",
            wmode: "window"
        });
		Core.Events.addEvent(this.layer.entity, this.stopEvent.bind2(this), "click");
		Core.Events.addEvent(this.layer.entity, this.hidden.bind2(this), "dblclick");
	}
};
Core.Class.extend(Editor.Tools.SetColor.prototype,Editor.Tools.OperateLayer.prototype,true);
