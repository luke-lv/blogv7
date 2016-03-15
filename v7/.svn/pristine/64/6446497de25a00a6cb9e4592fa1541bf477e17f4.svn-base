/**
 * Copyright (c) 2010, Sina Inc. All rights reserved.
 * @fileoverview 育儿博客模板内容
 */
$import("editor/plugins/plugins.js");
$import("sina/ui/template.js");

Editor.Plugins.BabyTemplate = Core.Class.create();
Editor.Plugins.BabyTemplate.prototype = {
    initialize: function(){
    }
	,_tmp : [
		[
			'<div style="margin:0; padding:0; clear:both; color:#333; font-size:14px;">',
			'  <div style="margin:0; padding:0;height:112px; overflow:hidden;clear:both;  background:url(#{bannerpic})  repeat-x left top; text-align:center;border-left:1px solid #fce6e9; border-right:1px solid #fce6e9;">',
			'    <h2 style=" margin:0; padding:0; padding-top:48px;"><span style="margin:0; padding:0; font-size:28px; text-align:center; display:inline;line-height:38px; padding:3px 7px; text-align:center; font-family:\'微软雅黑\',\'黑体\';  color:#fff; background-color:##{titlebgcolor};">#{title}</span></h2>',
			'<br class="hereistheend" style="display:none"/></div>',
			'<div style="margin:0; padding:0; overflow:hidden;clear:both; border-left:1px solid #fce6e9; border-right:1px solid #fce6e9; background-color:##{bgcolor};" >',
			'    <div style="margin:0; padding:0; clear:both; padding:10px 25px 15px; font-size:12px; position:relative;">',
			'        <img src="#{focuspic}" style="margin:0; padding:0; position:absolute; right:22px; top:0;" align="right" alt="" />',
			'        <div style="margin:0; padding:0; margin-right:200px; line-height:150%; min-height:140px; _height:140px;">',
			'          <h4 style="margin:0; padding:0; font-size:14px;">导语</h4>',
			'          <p style="margin:0; padding:0;">#{text}</p>',
			'        </div>',
			'    </div>',
			'    <div style="margin:0; padding:0; clear:both;  margin:0 13px; padding:16px; background-color:#fffdfe; border:1px solid ##{bordercolor};line-height:150%;">',
			'      <h4 style="margin:0; padding:0; font-size:14px;">我的想法:</h4>',
			'        <div id="#{babyThink}">&nbsp;#{beforeContent}</div>',
			'    </div>',
			'  </div>',
			//'  <div style="margin:0; padding:0; min-height:85px;  height:auto!important; height:85px;  padding:0 15px 20px;clear:both;background:url(#{footpic}) repeat-x left bottom;  border:1px solid #fce6e9; border-top:none; "></div>',
			'</div>'
		].join('')
	]
	,get : function(num,param) {
		param['babyThink'] = 'babyTopicContent_'+ +new Date();
		var obj = {};
		obj['content'] = new Ui.Template(this._tmp[num]).evaluate(param);
		obj['id'] = param['babyThink'];
		return obj;
	}
};