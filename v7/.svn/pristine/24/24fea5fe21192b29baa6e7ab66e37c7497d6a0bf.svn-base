/**
 * Copyright (c) 2010, Sina Inc. All rights reserved.
 * @fileoverview 进度条
 * @author dg.liu | dongguang@staff.sina.com.cn
 */
$import("sina/core/class/create.js");
$import("sina/core/class/extend.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/function/bind2.js");
$import("lib/editor/tools/Tool.js");
$import("sina/ui/template.js");
$import("sina/core/string/shorten.js");
$import("sina/core/dom/removeNode.js");

Editor.Loading = Core.Class.create();
Editor.Loading.prototype = {
	entity:"qe_loading_",
	plan:"loading_plan_",
	tip:"qe_tip_",
	del:"up_del_",
	upImg:"up_img_",
	linkUil:"http://album.sina.com.cn/pic/",
	uploadingImg:'<a id="#{upImg}#{id}"  href="" target="_blank"><img src="http://simg.sinajs.cn/blog7style/images/center/center_writeloading.gif"></a><br/><br/>',
    initialize: function(container,name){
       this.id = Core.Math.getUniqueId();
	   this.addHTML(container,name);
	   this.addImgToEditor();
	   Core.Events.addEvent($E(this.del+this.id),this.cancel.bind2(this),"click");
    },
	cancel:function(){
		this.removeEntity();
		this.removeTipImg();
	},
	removeEntity:function(){
		Core.Dom.removeNode($E(this.entity+this.id));
	},
	setPlan:function(plan){
		trace("setPlan:"+plan);
		var num=plan+"%";
		$E(this.plan+this.id).style.width=num;
		$E(this.tip+this.id).innerHTML=num;
		
	},
	setFinish:function(pid){
		$E(this.plan+this.id).style.width="100%";
		$E(this.tip+this.id).innerHTML="上传成功";
		
		$E(this.del+this.id).style.display="none";
		var ele=editor.iframeDocument.getElementById(this.upImg+this.id);
		if(ele){
			ele.href=this.linkUil+pid+"&690";
			trace(ele.href);
			var imgEle=ele.getElementsByTagName("img")[0];
			imgEle.src=this._getImgStaticPath(pid,"small");	
		}
		setTimeout(function(){
			this.removeEntity();
		}.bind2(this),2000);
	},
	_getImgStaticPath:function(pid, type){
            if (!pid) {
                return "";
            }
            var type = type || "orignal";
            //Modified by W.Qiang|wangqiang1 , pictures's domain changes to sinaimg.cn, 2011-03-24
            var num = (parseInt("0x" + pid.substring(pid.length - 2)) % 16) + 1;
            //return "http://static" + num + ".photo.sina.com.cn/" + type + "/" + pid;
            return "http://s" + num + ".sinaimg.cn/" + type + "/" + pid;
            //--END W.Qiang ,2011-03-24
    },
	setTip:function(tip){
		$E(this.tip+this.id).innerHTML=tip;
	},
	setError:function(tip){
		this.setTip(tip);
		this.removeTipImg();
		
	},
	removeTipImg:function(){
		var ele=editor.iframeDocument.getElementById(this.upImg+this.id);
		if(ele){
			var parent=ele.parentNode;
			var next=ele.nextSibling;
			var n_next=next.nextSibling;
			if(next.tagName=="BR"){
				parent.removeChild(next);
			}
			if(n_next.tagName=="BR"){
				parent.removeChild(n_next);
			}
			parent.removeChild(ele);	
		}
		
	},
	addImgToEditor:function(){
		if(!this.uploadingTemp){
			this.uploadingTemp=new  Ui.Template(this.uploadingImg);
		}
		var data={
			id:this.id,
			upImg:this.upImg
		};
		editor.insertHTML(this.uploadingTemp.evaluate(data));
	},
	addHTML:function(container,name){
		var html='<div class="file_loading" id="#{entity}#{id}">\
	       		<span class="file_nm" title="#{name}">#{sname}</span>\
		        <div class="loading_box">\
		      	 	<div id="#{plan}#{id}" style="width: 0%;" class="loadingblue"></div>\
		        </div>\
		        <span class="file_count" id="#{tip}#{id}">0%</span>\
				<a title="取消上传" class="cancel" href="#" id="#{del}#{id}" onclick="return false"></a>\
	        </div>';
		var data={
			name:name,
			sname:Core.String.shorten(name,12),
			entity:this.entity,
			plan:this.plan,
			tip:this.tip,
			id:this.id,
			del:this.del
		}
		this.template=new Ui.Template(html);
		Core.Dom.addHTML($E(container),this.template.evaluate(data));
	}
	
};
