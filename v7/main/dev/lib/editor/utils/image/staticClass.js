/**
 * Copyright (c) 2010, Sina Inc. All rights reserved.
 * @fileoverview 图片编辑静态类
 * @author dg.liu | dongguang@staff.sina.com.cn
 */
$import("lib/ticket.js");
$import("lib/editor/utils/utils.js");
$import("sina/utils/UserData.js");

Editor.Utils.staticClass={
	 //图片编辑的flash id
	 flash_id:"image_modify_emb",
	 userData:null,
	 /**
	  * flash回调函数
	  * @param {String} key 回调类型
	  * @param {String} pid 图片id [ClientName:图片来源，PicUrl:需要编辑的图片地址，Ticket：取票据，Domain:flash域名及目录,UploadUrl:上传地址,Close:关闭dialog,ReturnPicId：上传成功返回pid]
	  */
	 getArgs:function(key,pid){
	 	trace(key);
		switch(key) {
			case "ClientName":
				return "sinaBowen"; //表示该来源来自新浪博文
			case "PicUrl":
				return scope.editImage.src; //返回690px大小的图片URL地址
			case "Ticket":
				Lib.Ticket.get(function(ticket){
					this.setArgs(ticket);
				}.bind2(this),1);
				break;
			case "Domain":
				//trace(scope.modify_flash_domain);
				return scope.modify_flash_domain;
			case "UploadUrl":
				return "http://upload.photo.sina.com.cn/interface/pic_upload.php?app=blog&data=1&mime=image/jpeg&ticket="; //上传给马程钟接口的URL地址Url
			case "Close":
				this.closeEditLayer();
				break;
			case "ReturnPicId":
				this.changeImg(pid);
				
		}
	},
	refresh:function(){
		if(!this.userData){
			this.userData=new Utils.UserData();
		}
		this.userData.save("image_edit_data_"+scope.$uid,{content:editor.iframeDocument.body.innerHTML});
		
		window.location.href=this.setParam(window.location.href,"imgEdit=1");
		//window.location.reload();
		return false;
	},
	setParam:function(url,param){
//		if(url.indexOf("?")!=-1){
//			if(url.indexOf("imgEdit")==-1){
//				url+="&="+param;
//			}
//		}else{
//			url+="?="+param;
//		}
//		return url;
		return "http://control.blog.sina.com.cn/admin/article/article_add.php?imgedit=1";
	},
	changeImg:function(){},
	closeEditLayer:function(){},
    setArgs:function(ticket) {
		var swf = $E(this.flash_id);
		try {
			swf.setArgs("SINA_BLOG_TICKET", ticket.ticket[0]);
		} catch(e) {
		}
	}
};
