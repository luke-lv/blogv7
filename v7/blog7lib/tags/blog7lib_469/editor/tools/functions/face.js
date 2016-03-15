/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 编辑器工具栏 插入表情 按钮执行的操作
 */
$import("sina/core/class/extend.js");
$import("lib/editor/plugins/face/FaceOperate.js");
Core.Class.extend(Editor.Tools.Operate.prototype,{
	    face: function(){
		  v7sendLog("08_"+scope.faceOperate.logType.tool+"_000_000",scope.$pageid,"editorFace");
	   	  window.editorFace.showDialog();
	        
	    }
	}
);


