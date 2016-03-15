
/**
 * Copyright (c) 2010, Sina Inc. All rights reserved.
 * @fileoverview 插入表情分页
 * @author dg.liu | dongguang@staff.sina.com.cn
 */
$import("lib/editor/plugins/plugins.js");
$import("sina/core/class/create.js");
$import("sina/core/dom/addHTML.js");

Editor.Plugins.FacePage = Core.Class.create();

Editor.Plugins.FacePage.prototype = {
	//总数
	count:0,
	//每页几个
	pageSize:0,
	//总页数元素id
	total_id:"ep_t_",
	//下一页数元素id
	next_id:"ep_n_",
	//上一页数元素id
	back_id:"ep_b_",
	initialize: function(parentNode,count,pageSize,callbackFunc){
		this.id=Core.Math.getUniqueId();
		this.parentNode=parentNode;
		this.count=count;
		this.pageSize=pageSize;
		this.callbackFunc=callbackFunc;
		
		this.initTemplate();
		this.page(1);
    },
	/**
	 * 初始化分页html
	 */
	initTemplate:function(){
		this.con_temp='<ul class="SG_pages">#{back}<li class="SG_s_pgnum">#{at}/#{total}</li>#{next}</ul>';
		this.back_temp='<li class="SG_s_pgprev"><a href="#" onclick="return false" id="'+this.back_id+this.id+'">上一页</a></li>';
		this.next_temp='<li class="SG_s_pgnext"><a href="#" onclick="return false" id="'+this.next_id+this.id+'">下一页</a></li>';
	},
	/**
	 * 分页
	 * @param {Number} _at 页码，默认为1
	 */
	page: function(_at){
		var data={};
		data.at = _at||1;
		if(this.count%this.pageSize==0){
			data.total=this.count/this.pageSize;
		}else{
			data.total=parseInt(this.count/this.pageSize)+1;
		}
		if(data.total<=1){
			this.callbackFunc(data.at);
			return;
		}
		data.id=this.id;
		if(data.at==1){
			data.back="";
		}else{
			data.back=this.back_temp;
		}
		if(data.at==data.total){
			data.next="";
		}else{
			data.next=this.next_temp;
		}
		var temp=new Ui.Template(this.con_temp);
		this.parentNode.innerHTML=temp.evaluate(data);
		this.callbackFunc(data.at);
		
		if(data.next!=""){
			Core.Events.addEvent($E(this.next_id+this.id),Core.Function.bind3(this.page,this,[data.at+1]));
		}
		if(data.back!=""){
			Core.Events.addEvent($E(this.back_id+this.id),Core.Function.bind3(this.page,this,[data.at-1]));
		}
	}
};


