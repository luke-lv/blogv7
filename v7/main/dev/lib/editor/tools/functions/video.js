/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 编辑器工具栏 插入视频 按钮执行的操作
 */
$import("sina/core/class/extend.js");

Core.Class.extend(Editor.Tools.Operate.prototype,{
	video: function(){
		if (!window.VideoDialog || !window.VideoDialog.entity){
			window.VideoDialog = new Editor.Utils.IframeDialog({
				url: "http://weibo.com/aj/video/upload?entry=blog",
				title: "插入视频",
				width: 800,
				height: 517,
				alpha:1
			});
			window.VideoDialog.show();
	        window.insertVideoCallbackXHW = function(vid){
	        	var id = "tmp_id"+ (+new Date());
				editor.insertHTML("<img src='http://simg.sinajs.cn/blog7style/images/common/editor/insetvideo2.gif' width='482' height='388' id='"+id+"' vid='" + vid + "'/>",{
					'id' : id
					,properites : {'vid':vid}
				});
				$E("is_media").value = "true";
				VideoDialog.reset();
			}
		}
	}
});


