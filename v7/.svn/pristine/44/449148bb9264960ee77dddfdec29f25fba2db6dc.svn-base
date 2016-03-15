/**
 * Copyright (c) 2010, Sina Inc. All rights reserved.
 * @fileoverview 插入表情的静态全局操作对象
 * @author dg.liu | dongguang@staff.sina.com.cn
 */
$import("editor/plugins/plugins.js");
$import("sina/core/events/getEventTarget.js");
$import("lib/sendLog.js");

scope.faceOperate={
	//最热门表情
	container_id:"face_container",
	show_dia_id:"show_dialog_id",
	hot_container:"fd_hot_list",
	//最潮IN语
	hot_in_container:"fd_hot_in_list",
	//更多精彩表情
	high_container:"fd_high_list",
	//更多精彩IN语
	in_container:"fd_in_list",
	//"更多精彩表情"分页
	high_page_container:"fd_high_page",
	//"更多精彩in语"分页
	in_page_container:"fd_in_page",
	//更多精彩表情/更多精彩in语选项卡
	tab_container:"fd_tab",
	//对应”更多精彩表情“选项卡中内容
	high_content:"fd_tab_high_con",
	//对应”更多精彩in语“选项卡中内容
	in_content:"fd_tab_in_con",
	//推荐
	pop:"371",
	//最热门表情
	high:"372",
	//最潮IN语
	iny:"373",
	//更多精彩表情"
	morehigh:"374",
	//更多精彩IN语
	moreiny:"375",
	//senglog type中的位置标识
	logType:{
		//“常用功能”上方9个推荐为止
		pop:[17,18,19,20,21,22,23,24,25],
		//”常用功能“上方”更多“按钮
		more:"26",
		//工具栏中插入表情按钮
		tool:"27",
		//表情弹出层中
		dialog:"28"
	},
	//"更多精彩表情"的每页显示个数
	highpage:55,
	//"更多精彩IN语"的每页显示个数
	inypage:8,
	//“最潮IN语”显示个数
	inyCount:2,
	//“最热门表情”显示个数
	highCount:12,
	//编辑器右侧”常用功能“上方推荐的表情显示个数
	popCount:9,
	//普通表情html结构的template
	itemTemp:'<li><a href="#" onclick="scope.faceOperate.toEditor();return false"><img title="#{name}" src="#{imgSrc}"></a></li>',
	//IN语表情html结构的template
	itemTemp_name:'<li onclick="scope.faceOperate.toEditor()">#{divStart}<span><img onmouseover="scope.faceOperate.onmouseIn()" onmouseout="scope.faceOperate.onmouseOut()" title="#{name}" src="#{imgSrc}"></span><p onmouseover="scope.faceOperate.onmouseIn()" onmouseout="scope.faceOperate.onmouseOut()">#{name}</p>#{divEnd}</li>',
	/**
	 * 点击某表情后将其插入到博文发布器中
	 */
	toEditor:function(){
		var ele=Core.Events.getEventTarget();
		
		var parent=this.getLiEle(ele);
	
		var txt;
		if($IE){
			txt=parent.innerText;
		}else{
			txt=parent.textContent;
		}
		var type=ele.tagName.toLowerCase();
		if(type!="img"){
			ele=parent.getElementsByTagName("img")[0];
		}
		this.sendLog(ele);
		var html="";
		if(txt==""){
			html='<img type="face" src="'+ele.src+'">';
		}else{
			html='<img type="face" src="'+ele.src+'">'+txt;	
		}
		editor.insertHTML(html);
		var dialog=winDialog.getDialog("face");
		if(dialog){
			dialog.hidden();
		}
	},
	/**
	 * 点击某表情后 调用接口投log
	 * @param {ImgElement} ele 被点击的img标签对象 
	 */
	sendLog:function(ele){
		var type="08_";
		var liEle=this.getLiEle(ele);
		var ulEle=liEle.parentNode;
		 var reg=/.*\/(E[^\.]*).gif/gi;
		if(ulEle.id==this.container_id){
			//编辑器“常用功能”上方表情
			var uls=ulEle.childNodes;
			var len =uls.length;
			for(var i=0;i<len;i++){
				if(liEle==uls[i]){
					type+=this.logType.pop[i];
					break;
				}
			}
		}else{
			type+=this.logType.dialog;
		}
		type+="_010_"+ele.src.replace(reg,"$1");
		v7sendLog(type,scope.$pageid,"editorFace");
	},
	/**
	 * 渲染各类型的表情列表
	 * @param {Object} container
	 * @param {String} _type 
	 *         |morehigh  更多精彩表情
	 *         |moreiny   更多精彩IN语
	 *         |iny       最潮IN语
	 *         |high      最热门表情
	 *         |pop       页面中推荐的表情
	 * @param {String} listType 标示采用哪种html结构，值为name 则采用itemTemp_name 结构
	 * @param {Object} _page 页码，默认为1
	 */
	renderList:function(container,_type,listType,_page){
		var it;
		var type=_type;
		var page=_page||1;
		if(listType&& listType=="name"){
			it= new Ui.Template(this.itemTemp_name);
		}else{
			it=new Ui.Template(this.itemTemp);
		}
		var html="",pageData;
		var _data=this.getData(type).data;
		var _len=_data.length;
		var max,data,len;
		switch(type) {
			case "morehigh":
				var h_at=(page-1)*this.highpage;
				pageData=_data.slice(h_at,h_at+this.highpage);
				max=this.highpage;
				break;
			case "moreiny":
				var i_at=(page-1)*this.inypage;
				pageData=_data.slice(i_at,i_at+this.inypage);
				max=this.inypage;
				break;
			case "iny":
				pageData=_data.slice(0,this.inyCount);
				break;
			case "high":
				pageData=_data.slice(0,this.highCount);
				break;
				
			case "pop":
				pageData=_data.slice(0,this.popCount);
				break;
		}
		data=pageData;
		len=data.length;
		if(!max){
			max=len;
		}
		var at=0;
		for(var i=0;i<len;i++){
			var d={
				imgSrc:'http://www.sinaimg.cn/uc/myshow/blog/misc/gif/'+data[i].code+'G.gif',
				name:data[i].name
				//imgSrc:"http://simg.sinajs.cn/blog7style/images/common/editor/temp_icon_b1.gif"
			};
			if(type=="moreiny"){
				d.divStart='<div class="facein_bg">';
				d.divEnd="</div>";
			}else{
				d.divStart="";
				d.divEnd="";
			}
			html+=it.evaluate(d);
			if(at>=max){
				break;
			}
			at++;
		}
		container.innerHTML=html;
	},
	/**
	 * 根据类型获取数据
	 * @param {String} type (pop|high|iny|morehigh|moreiny)
	 */
	getData:function(type){
		trace("getData:type:"+type);
		return this.data[this[type]];
	},
	/**
	 * 获取距离该元素最近的祖先li元素
	 * @param {Element} ele 
	 */
	getLiEle:function(ele){
		while(true){
			var tagName=ele.tagName.toLowerCase();
			trace(tagName);
			if(tagName=="li"){
				return ele;
			}
			ele=ele.parentNode;
		}
	},
	/**
	 * In语表情的鼠标移入效果
	 */
	onmouseIn:function(){
		var ele=Core.Events.getEventTarget();
		this.getLiEle(ele).className="hover";
	},
	/**
	 * In语表情的鼠标移出效果
	 */
	onmouseOut:function(){
		var ele=Core.Events.getEventTarget();
		this.getLiEle(ele).className="";
	}
	
};

