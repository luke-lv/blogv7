/**
 * Copyright (c) 2010, Sina Inc. All rights reserved.
 * @fileoverview 博客乐库合作项目——搜素提示
 * @author dg.liu | dongguang@staff.sina.com.cn
 */

$import("editor/plugins/plugins.js");
Editor.Plugins.Suggest = Core.Class.create();
Editor.Plugins.Suggest.prototype = {
	//接口地址
	url:" http://music.sina.com.cn/shequ/port/sinablog/blog_ajax_associatewords.php",
	//列表项html结构
	tempHtml:"<li><a href='#' onclick='scope.musicOperate.sm.search(event,\"select\");return false'>#{name}</a></li>",
	//搜索提示列表数据
	s_data:{},
	isShow:false,
	//Template对象，永远html和data组合
	template:null,
	initialize:function(){
		this.initInterface();
		this.initEvents();
	},
	/**
	 * 初始化事件绑定
	 */
	initEvents:function(){
		var oNode=$E(scope.musicHash.searchInput);
		Core.Events.addEvent(document, this.hide.bind2(this), "click");
		Core.Events.addEvent(oNode, this.clearTip, "click");
//		Core.Events.addEvent(oNode, this.hide, "blur");
		Core.Events.addEvent(oNode, this.loadData.bind2(this), "keyup");
		Core.Events.addEvent(oNode, function (e) {
			
			},
		"keydown");
	},
	/**
	 * 单击输入框后清除输入框默认提示内容
	 */
	clearTip:function(){
		var oNode=$E(scope.musicHash.searchInput);
		if(oNode.value==scope.musicOperate.searchTip){
			oNode.value="";
		}
	},
	setTip:function(){
		var oNode=$E(scope.musicHash.searchInput);
		if(oNode.value==""){
			oNode.value=scope.musicOperate.searchTip;
		}
	},
	/**
	 * 隐藏搜索提示框
	 */
	hide:function(){
		if(this.isShow){
			trace("hide");
			var ulNode=$E(scope.musicHash.searchSuggest);
//			this.setTip();
			ulNode.style.display="none";
			this.isShow=false;
		}
		
	},
	/**
	 * 展示搜索提示框
	 */
	show:function(){
		
		var seNode=$E(scope.musicHash.searchSuggest);
		if(!this.isShow) {
			seNode.style.display="";
		}
		
		trace("show");
		this.isShow=true;
	},
	/**
	 * 初始化interface
	 */
	initInterface:function(){
		this._interface = new Interface(this.url, "jsload");
	},
	/**
	 * 根据数据渲染搜素提示列表
	 */
	renderList:function(){
		var lData=this.s_data.info;
		var type=this.s_data.type;
		var sNode=$E(scope.musicHash.searchSuggest);
		var ul=sNode.getElementsByTagName("ul")[0];
		var len=lData.length;
		if(len<1){
			this.hide();
			return false;
		}
		var html="";
		if(!this.template){
			this.template=new Ui.Template(this.tempHtml);
		}
		for (var i=0; i<len; i++) {
			var cData={};
			if(type=="wpp_song"){
				cData.name=lData[i].SONGNAME;
			}else{
				cData.name=lData[i].ALBUMNAME;
			}
			
			html+=this.template.evaluate(cData);
		}
		ul.innerHTML=html;
		
	},
	/**
	 * 读取数据
	 * @param {String} txt 搜素的文本
	 * @param {String} type 搜素类型 歌曲(song)|专辑(album)
	 */
	loadData:function(){
		var iNode=$E(scope.musicHash.searchInput);
		// var sNode=$E(scope.musicHash.searchSelect);
			var keyCodeNum = Core.Events.getEvent().keyCode;
		if(keyCodeNum == 38 || keyCodeNum == 40)  {
			return false;
		}
		var txt=iNode.value;
		// var type=sNode.value;
		var type = 'wpp_song';

		var param={
			query:txt,
			charset:"utf-8",
			limit:10,
			type:type
		};
		this._interface.request({
            GET: param,
            onSuccess: function(_data){
				this.s_data=_data;
				this.renderList();
				if(_data.info.length>0){
					this.show();
				}else{
					this.hide();
				}
				
			}.bind2(this)            ,
            onError: function(_data){
				traceError("接口异常");
				this.hide();
            }.bind2(this),
            onFail: function(){
				traceError("请求失败");
				this.hide();
            }.bind2(this)
        });
	}
	
};