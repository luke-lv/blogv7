/**
 * Copyright (c) 2010, Sina Inc. All rights reserved.
 * @fileoverview 插入表情
 * @author dg.liu | dongguang@staff.sina.com.cn
 */
$import("lib/editor/plugins/plugins.js");
$import("sina/core/class/create.js");
$import("sina/core/dom/addHTML.js");
$import("sina/utils/io/jsload.js");
$import("lib/editor/plugins/face/FaceOperate.js");
$import("lib/editor/plugins/face/FaceDialog.js");
$import("lib/sendLog.js");

Editor.Plugins.FaceMain = Core.Class.create();

Editor.Plugins.FaceMain.prototype = {
	//获取表情数据接口
	url:'http://www.sinaimg.cn/uc/myshow/blog/misc/gif/smileContentConfig.js',
	//varname
	varname:"smileContentConfig",
	initialize: function(parentNode){
		if(parentNode){
			this.initContainer(parentNode);
			this.initFace();
			this.mode="init_show";
		}
		
    },
	/**
	 * 初始化表情列表
	 */
	initFace:function(){
		this.loadData();
	},
	/**
	 * 渲染表情列表
	 */
	renderList:function(){
		var html="";
		scope.faceOperate.renderList($E(scope.faceOperate.container_id),"pop");
		html='<li class="moreface"><a href="#" onclick="return false" id="'+scope.faceOperate.show_dia_id+'"><img alt="" src="http://simg.sinajs.cn/blog7style/images/common/editor/facemore.gif"></a></li>';
		Core.Dom.addHTML($E(scope.faceOperate.container_id),html);
		Core.Events.addEvent($E(scope.faceOperate.show_dia_id),function(){
			v7sendLog("08_"+scope.faceOperate.logType.more+"_000_000",scope.$pageid,"editorFace");
			this.showDialog();
			}.bind2(this)
		);
	},
	/**
	 * 创建并显示弹出层
	 */
	showDialog:function(){
		if(!this.dialog){
			this.dialog=new Editor.Plugins.FaceDialog();
			this.dialog = false;
		}
		this.dialog.show();
	},
	/**
	 * 读取接口加载数据
	 */
	loadData:function(func){
        Utils.Io.JsLoad.request([{ "url" :this.url+"?"+Math.random(),
		  charset:"gbk"
		 }],
		  {
          onComplete  : function(data){
		  	scope.faceOperate.data=window[this.varname];
			if(this.mode){
				this.renderList();
			}else{
				func();
			}
			
		  }.bind2(this)
        });
	},
	/**
	 * 初始化容器节点
	 * @param {Element} parentNode 需要将容器放到其中的，页面中的节点
	 */
	initContainer:function(parentNode){
		var c_html='<div class="module_face"><div class="module_facelist"><ul id="'+scope.faceOperate.container_id+'"></ul></div></div>';
		Core.Dom.insertHTML(parentNode,c_html,"beforebegin");
	}
};
