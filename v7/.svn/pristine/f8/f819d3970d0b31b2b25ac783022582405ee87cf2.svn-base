/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 博客编辑器右面的快捷菜单初始化
 */
$import("editor/plugins/plugins.js");
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/function/bind3.js");


Editor.Plugins.RightMenu = Core.Class.create();
Editor.Plugins.RightMenu.prototype = {
  
    initialize: function(eleId,content_id){
       this.eleId=eleId;
	   this.content_id=content_id;
    },
	addItem:function(imageSrc,title,callback){
		var ele=$E(this.content_id);
		var uls=ele.getElementsByTagName("ul");
		var ul,isNewUl;
		if(uls.length<1 || uls[uls.length-1].getElementsByTagName("li").length>1){
			ul=$C("ul");
			isNewUl=true;
		}else{
			ul=uls[uls.length-1];
		}
		
		var li=$C("li");
		var a=$C("a");
		var img=$C("img");
		img.width=40;
		img.height=40;
		
		var span=$C("span");
		a.href="javascript:;"
		//a.onclick="return false";
		a.onclick = function(){
			return false;
		}
		img.src=imageSrc;
		span.innerHTML=title;
		a.appendChild(img)
		li.appendChild(a);
		li.appendChild(span);
		ul.appendChild(li);
		if(isNewUl){
			ele.appendChild(ul);
		}
		Core.Events.addEvent(img,callback,"click");
		Core.Events.addEvent(span,callback,"click");
	},
	setOpen:function(itemIds){
		var ele=$E(this.eleId);
		var className=ele.className;
	
		var arr=className.split(" ");
		if(arr.length<2){
			return;
		}
		ele.className=arr[0];
		$E(this.content_id).style.display="block";
		this.setTitleBold(ele);
		//ele.parentNode.className="hB";
		this.closeOther(itemIds);
	},
	closeOther:function(itemIds){
		var len=itemIds.length;
		for(var i=0;i<len;i++){
			var eleTitle=$E(itemIds[i].title);
			var classNames=eleTitle.className.split(" ");
			eleTitle.className=classNames[0]+" down";
			this.setTitleBold(eleTitle);
			$E(itemIds[i].content).style.display="none";
		}
	},
	setTitleBold:function(titleEle){
		var ele=titleEle.getElementsByTagName("h2")[0]
		if(ele.className=="hB"){
			ele.className="";
		}else{
			ele.className="hB";
		}
	},
	initSwap:function(itemIds){
		//trace("initSwap"+this.eleId);
		Core.Events.addEvent($E(this.eleId),Core.Function.bind3(this.setOpen,this,[itemIds]),"click");
	}
};
