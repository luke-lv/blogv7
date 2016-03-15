/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 编辑器弹出层基类
 * @author dongguang | dongguang@staff.sina.com.cn
 */
$import("lib/editor/utils/utils.js");
$import("sina/core/class/create.js");
$import("sina/ui/panel.js");
$import("sina/ui/template.js");
$import("sina/core/dom/getLeft.js");
$import("sina/core/dom/getTop.js");

Editor.Utils.EditorLayer = Core.Class.create();
Editor.Utils.EditorLayer.prototype = {
    initialize: function(){
		this.initLayer();
    },
	initLayer:function(){
		var template='<div id="#{entity}" class="editor_tip"><div id="#{content}">dd</div></div>';
		this.layer=new Ui.Panel();
		this.layer.setTemplate(template);
	},
	/**
	 * 初始化内容节点，需要子类覆盖
	 */
    setContent: function(tip){
		var data={};
		//new Date().toLocaleString().replace(/[(^\s)*](\d*:\d*:\d*)/g,function(a,b){data.time=b;});
		new Date().toLocaleString().replace(/[(^\s)*](\d*:\d*)/g,function(a,b){data.time=b;});
		data.tip=tip||"";
		var template=new Ui.Template('<span>#{time}</span>#{tip}');
		//template.evaluate(data);
		this.layer.setContent(template.evaluate(data));
    },
	/**
	 * 设置位置 即 left top
	 */
    setPosition: function(){
        var ele = $E("SinaEditor_Iframe");
        var left = Core.Dom.getLeft(ele)+ele.offsetWidth-this.layer.entity.offsetWidth-43;
        var top = Core.Dom.getTop(ele);
        this.layer.setPosition({
            x: left,
            y: top
        });
    },
    hidden: function(){
        //trace("hidden");
        this.layer.hidden();
		this.isShow=false;
        
    },
	/**
	 * 显示
	 */
    show: function(){
		this.isShow=this.isShow||false;
		if(this.isShow){
			this.hidden();
		}else{
        	this.layer.show();
			this.setPosition();
			this.isShow=true;
		}
		
    }
};

