/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 图片上传进度条
 */
$import("sina/core/class/create.js");
$import("sina/core/math/getUniqueId.js");
$import("sina/ui/template.js");
$import("editor/tools/uploadimage/UploadLoading.js");
$import("sina/core/array/ArrayWithout.js");

var LoadingList= Core.Class.create();

LoadingList.prototype = {
	lst:{},
	key:[],
    initialize: function(){
	},
	add:function(id,name){
		trace("LoadingList.add:"+id);
		this.key.push(name);
		this.lst[name]=new UploadLoading(id,name,this.cancelCallback.bind2(this));
	},
	cancelCallback:function(name){
		//trace("LoadingList.cancelCallback");
//		uploadImage.moveFlash();
		this.key=Core.Array.ArrayWithout(this.key,name);
		if(this.key.length<1){
//			uploadImage.setOperateVeiw();
		}
	},
	setRange:function(name,num){
		var text=num+"%";
		this.lst[name].setRange(text);
		this.lst[name].setTip(text);
		if (num == 100) {
			this.lst[name].state=4;
			this.lst[name].setFinish();
		}else{
			this.lst[name].state=2;
		}
		
	},
	checkIsWoking:function(){
		var len=this.key.length;
		//trace("len:"+len);
		for(var i=0;i<len;i++){
			if (this.lst[this.key[i]].state == 2) {
				return true;
			}
		}
		return false;
	},
	error:function(name,isError,tip){
		this.lst[name].setError(isError,tip);
	},
	allError:function(){
		var len=this.key.length;
		//trace("len:"+len);
		for(var i=0;i<len;i++){
			if (this.lst[this.key[i]].state != 4) {
				this.lst[this.key[i]].setError(true);
			}
		}
	},
	setFinish:function(name){
		this.lst[name].setFinish();
	},
	remove:function(id){
		//trace("remove_name:"+name);
		//trace("remove_value:"+value);
		var i=0;
		for(name in this.lst){
//			if(value && this.lst[name].pid){
//				if(value.indexOf(this.lst[name].pid)!=-1){
//					this.lst[name].cancel();
//					uploadImage.moveFlash();
//				}
//			}
//			i++;
			if(this.lst[name].id==id){
				this.lst[name].cancel();
			}
		}
	},setPid:function(name,pid){
		this.lst[name].pid=pid;
	}
};
