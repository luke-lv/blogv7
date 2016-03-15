/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 使用userData存储数据
 * @author dongguang | dongguang@staff.sina.com.cn
 */
$import('sina/utils/utils.js');
$import("sina/core/class/create.js");
$import("sina/core/math/getUniqueId.js");
$import("sina/core/dom/addHTML.js");

Utils.UserData= Core.Class.create();
Utils.UserData.prototype={
	initialize:function(id){
		if(!$IE)return;
		trace("UserData");
		this.id=id||"sina_user_data";
		Core.Dom.addHTML(document.body,'<img style="width: 1px; display: none;" id="'+this.id+'" />');
		this.setDefaultProperty();
	},
	setDefaultProperty:function(){
		if(!$IE)return;
		$E(this.id).addBehavior("#default#userData");
	},
	save:function(key,data){
		if(!$IE)return;
		try{
			if(this[key] == false)return;
			if(data.length > 20000)return;
		
			var ud_ele=$E(this.id);
			for(var name in data){
				ud_ele.setAttribute(name, data[name]);
			}
			ud_ele.save(key);
		}catch(e) {
			traceError(e);
		}
	},
	load:function(key,attributes){
		if(!$IE)return {};
		try{
			var ud_ele=$E(this.id);
			var data={};
			$E(this.id).load(key);
			var len=attributes.length;
			for(var i=0;i<len;i++){
				data[attributes[i]]= ud_ele.getAttribute(attributes[i] || "");
			}
			this[key] = true;
			return data;
			trace("暂存的内容长度: " + editorStr.length);
			trace("暂存内容的UID: " + editorUID);
		}catch(e) {
			traceError(e);
		}
	},
	clear:function(key,attributes){
		if(!$IE)return;
		try{
			trace("userData.clear");
			this[key] = false;
			var ud_ele=$E(this.id);
			var len=attributes.length;
			for(var i=0;i<len;i++){
				ud_ele.setAttribute(attributes[i],"");
			}
			ud_ele.save(key);
		}catch(e) {
			traceError(e);
		}
	}
	
};
	
