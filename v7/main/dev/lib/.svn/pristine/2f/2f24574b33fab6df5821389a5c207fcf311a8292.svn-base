/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 编辑器弹出层基类
 * @author dongguang | dongguang@staff.sina.com.cn
 */
$import("lib/editor/tools/tools.js");
$import("sina/core/class/create.js");


Editor.Tools.OperateLayerList = Core.Class.create();
Editor.Tools.OperateLayerList.prototype = {
	names:[],
    initialize: function(){

    },add:function(name,obj){
		this.names.push(name);
		this[name]=obj;
	},
	show:function(name){
		var len=this.names.length;
		for(var i=0;i<len;i++){
			if(this.names[i]!=name && this[this.names[i]].hidden){
				this[this.names[i]].hidden();
			}
		}
		if(this[name] && this[name].show){
			this[name].show();
		}
	}
};

