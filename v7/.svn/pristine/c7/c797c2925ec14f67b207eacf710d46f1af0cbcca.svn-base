/**
 * Copyright (c) 2010, Sina Inc. All rights reserved.
 * @fileoverview 更具参数判断，像编辑器中插入内容
 * @author dg.liu | dongguang@staff.sina.com.cn
 */
$import('sina/core/system/getParam.js');
$import("sina/utils/io/jsload.js");
$registJob("insert_to_editor", function () {
	//插入图片
	var ctg_id=Core.System.getParam("ctg_id"); 
	if(ctg_id){
		editor.operate.ctg_id=ctg_id;
		editor.operate.img();
	}
	//插入视频
	var vid=Core.System.getParam("videoId"); 
	var vtitle=getParam("videoTitle"); 
	
	//新增获取flash地址新方法
	//如果url参数中带有videoUrl参数 则去请求接口获得flash地址
	var vURL=Core.System.getParam("videoUrl");
	var html;
	if(vid && !vURL){
		html='<div><object width="480" height="370" >\
		<param name="allowScriptAccess" value="always" />\
		<embed pluginspage="http://www.macromedia.com/go/getflashplayer"\
			   src="http://you.video.sina.com.cn/api/sinawebApi/outplayrefer.php/vid='+vid+'/s.swf"\
			   type="application/x-shockwave-flash"\
				name="ssss"\
				 wmode="transparent"\
				allowFullScreen="true" \
				allowScriptAccess="always" \
				width="480"\
				height="370">\
		</embed></object></div>'
		editor.insertHTML(html);
	}else if(vURL){
		//新增获取flash地址方法
		Utils.Io.JsLoad.request("http://video.sina.com.cn/api/sinaVideoApi.php",{
			GET:{
				pid:60,
				data:"json",
				url:vURL
			},
			onComplete:function(data){
				if(data && data.result===1){
					//正常返回
					html='<div><object width="480" height="370" >\
					<param name="allowScriptAccess" value="always" />\
					<embed pluginspage="http://www.macromedia.com/go/getflashplayer"\
						   src="'+data.playswf+'"\
						   type="application/x-shockwave-flash"\
							name="ssss"\
							 wmode="transparent"\
							allowFullScreen="true" \
							allowScriptAccess="always" \
							width="480"\
							height="370">\
					</embed></object></div>'
					editor.insertHTML(html);
				}
			}
		});
	}
	
	if(vtitle){
		$E("articleTitle").value="分享视频："+vtitle;
	}
	
	//插入userData数据
	
	var isImgEdit=Core.System.getParam("imgedit"); 
	if(isImgEdit){
		this.userData=new Utils.UserData();
		var imgData=this.userData.load("image_edit_data_"+scope.$uid,["content"]);
		if(imgData.content){
			editor.insertHTML(imgData.content);
			this.userData.clear("image_edit_data_"+scope.$uid,["content"]);	
			editor.initImageOpertae();
		}
		
	}
	
	function getParam(name) {
  		var arr = window.location.search.match(new RegExp("(\\?|&)"+name+"=([^&]*)(&|$)"));
 		 if(arr != null) return decodeURI(arr[2]); return null;
	};
	
});