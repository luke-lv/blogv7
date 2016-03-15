/**
 * Copyright (c) 2010, Sina Inc. All rights reserved.
 * @fileoverview 博客乐库合作项目
 * @author dg.liu | dongguang@staff.sina.com.cn
 */
$import("editor/plugins/plugins.js");

Editor.Plugins.WebMusic = Core.Class.create();
Editor.Plugins.WebMusic.prototype = {
	//音乐输入框id
	int_id:"m_web_int",
	//错误信息提示div id
	tip_id:"m_web_tip",
	addBnt_id:"m_web_add",
	//输入框中默认提示文案
	int_tip:"请输入音乐地址(http://)，支持MP3格式",
	initialize:function(){
		this.renderHtml();
		this.addEvents();
		var me = this;
		scope.musicOperate.resetTip = function() {
			me.setInputTip.call(me, true);
			me.setTip.call(me, 'A00006');
		};
	},
	/**
	 * 事件输入框、确定按钮绑定事件
	 */
	addEvents:function(){
		Core.Events.addEvent($E(this.int_id),this.clearInputTip.bind2(this),"focus");
		Core.Events.addEvent($E(this.int_id),this.setInputTip.bind2(this),"blur");
		Core.Events.addEvent($E(this.addBnt_id),this.add.bind2(this));
	},
	/**
	 * 向选择列表添加歌曲
	 */
	add:function(){
		var ele=$E(this.int_id);
		var value=ele.value;
		if(this.checkUrl(value)){
			scope.musicOperate.select('web',value);
			scope.musicOperate.resetTip();
		}
	},
	/**
	 * 输入框得到焦点时，清除输入框中的提示
	 */
	clearInputTip:function(){
		var ele=$E(this.int_id);
		if(ele.value==this.int_tip){
			ele.value="";
		}
	},
	/**
	 * 当输入框失去焦点并且输入框中没有内容时，设置提示框中默认提示
	 */
	setInputTip:function(force){
		var ele=$E(this.int_id);
		if(ele.value=="" || force == true){
			ele.value=this.int_tip;
		}
	},
	/**
	 * 验证url
	 */
	checkUrl:function(value){
		if (value == this.int_tip) {
			scope.musicOperate.resetTip();
			return;
		}
		var value=value.toLowerCase();
        if (value == this.addBnt_id || value.indexOf("http://") != 0) {
            this.setTip("B79002");
			editorTabs.showTab("music");
            return false;
        }
        if (value.indexOf(".mp3") == -1) {
            this.setTip("B79001");
			editorTabs.showTab("music");
            return false;
        }
		this.setTip("A00006");
        return true;
	},
	setTip:function(code){
		var ele=$E(this.id=this.tip_id);
		if(code== "A00006"){
			ele.style.display="none";
		}else{
			var liEle=ele.getElementsByTagName("li")[0];
			ele.style.display="";
			liEle.style.color = 'red';
			liEle.innerHTML=$SYSMSG[code];
		}

	},
	renderHtml:function(){
		var html='<div class="searchCondi">\
				音乐地址：<input type="text"  class="" id="'+this.int_id+'" value="'+this.int_tip+'" size="36" maxlength="255">\
				<a class="SG_aBtn SG_aBtnB inputbtn" href="#"><cite id="'+this.addBnt_id+'" onclick="return false">确定</cite></a>\
			</div>\
			<div class="searchNote"  id="'+this.tip_id+'" style="display:none">\
			    <ul>\
				  <li class="fb" id="">抱歉！是无效地址，请重新输入，或去<a href="#">新浪乐库</a>中直接搜索。</li>\
				</ul>\
			</div>';
		Core.Dom.addHTML($E(scope.musicHash.web_container),html);
	}
};