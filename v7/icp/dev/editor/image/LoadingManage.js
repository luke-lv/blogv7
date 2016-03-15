/**
 * Copyright (c) 2010, Sina Inc. All rights reserved.
 * @fileoverview 进度条管理
 * @author dg.liu | dongguang@staff.sina.com.cn
 */
$import("sina/core/class/create.js");
$import("sina/core/class/extend.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/function/bind2.js");
$import("lib/editor/tools/Tool.js");
$import("sina/ui/template.js");
$import("editor/image/Loading.js");

Editor.LoadingManage = Core.Class.create();
Editor.LoadingManage.prototype = {
	ls:{},
    initialize: function(container){
		this.container=container;
    },
	add:function(name){
		this.ls[name]=new Editor.Loading(this.container,name);
	},
	setPlan:function(name,num){
		this.ls[name].setPlan(num);
	},
	setFinish:function(name,src){
		this.ls[name].setFinish(src);
	},
	setTip:function(name,tip){
		this.ls[name].setTip(tip);
	},
	setError:function(name,tip){
		this.ls[name].error=true;
		this.ls[name].setError(tip);
	},
	clearError:function(){
		for(name in this.ls){
			if(this.ls[name].error){
				this.ls[name].cancel();
			}
		}
	}
};
