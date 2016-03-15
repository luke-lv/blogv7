/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 */
/** 
 * @fileoverview 设置
 * @author stan | chaoliang@staff.sina.com.cn
 */
/**
 * 用户私有数据说明:

 * 私有数据说明
 * blogsize:概要设置(0)/全局设置(1)
 * cms:评论总开关 0(开) 1(关)
 * adver:广告联盟用户 0(不是) 1(是)
 * ad:临时广告用户 0(不是) 1(是)
 * p4p:中小企业联盟用户 0(不是) 1(是)
 * invitationset:好友邀请设置 0(接受好友邀请) 1(不接受好友邀请)
 * pageset:纸条设置 0(接受纸条) 1(不接受纸条) 2(只接受好友的纸条) 


 接口：

 1:获取用户私有数据接口
 http://control.blog.sina.com.cn/riaapi/conf/get_user_private.php?uid=1502832191 

 参数说明
 uid:
 domain:
 varname
 
 返回值:
 系统状态码

 2:修改用户私有数据接口

 http://control.blog.sina.com.cn/riaapi/conf/update_user_private.php?uid=1502832191&privatekey=tj&privatevalue=1

  参数说明：
  privatekey:私有数据key,多个用逗号隔开
  privatevalue:私有数据value,多个用逗号隔开
  uid:
  varname
  domain
 */
$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/utils/form/radio.js");


$import("lib/dialogConfig.js");

PrivateSetting = Core.Class.create();

PrivateSetting.prototype = {
    init: false,
    initialize: function(){
    },
    initDom: function(){
        this.dialog = winDialog.createCustomsDialog();
        this.dialog.setContent(this.struc);
        this.dialog.setTitle("权限设置");
        this.dialog.setMiddle();
		this.dialog.setAreaLocked(true);
    },
    initEvent: function(){
    	Core.Events.addEvent("key_save_btn", this.save.bind2(this));
		Core.Events.addEvent("key_cancel_btn", this.hide.bind2(this));
    },
    show: function(){
        if (!this.init) {
        	this.initDom();
			this.initEvent();
			
            this.init = true;
        }
		this.dialog.show();
		this.get();
		this.get_wall();
    },
	hide : function(){
		this.dialog.hidden();
	},
	/**
	 * 设置初始化值
	 */
	get: function(){
		var inter = new Interface("http://control.blog.sina.com.cn/riaapi/conf/get_user_private.php","jsload");
		inter.request({
			GET : {
				uid: $UID
			},
			onSuccess : function(data){
				trace("private_data : " + data);
				var form = $E("blog_setting_form");
				Utils.Form.Radio.set(form.comment_key, data.cms);
				Utils.Form.Radio.set(form.note_key, data.pageset);
				Utils.Form.Radio.set(form.friend_key, data.invitationset);
				
			},
			onError : function(result){
				showError(result.code);
			},
			onFail : function(){
				
			}
		});
	},
	get_wall: function(){
		var inter = new Interface("http://wall.cws.api.sina.com.cn/get_privacy.php","jsload");
		inter.request({
			onSuccess : function(data){
				var form = $E("blog_setting_form");
				Utils.Form.Radio.set(form.wall_key, data.value);
			},
			onError : function(result){
				showError(result.code);
			},
			onFail : function(){
				
			}
		});
	},
	/**
	 * 保存个人化设置
	 */
	save :function(){
		Core.Events.stopEvent();
		var inter = new Interface("http://control.blog.sina.com.cn/riaapi/conf/update_user_private.php","ijax");
		var form = $E("blog_setting_form");
		var option = {
			"cms" : Utils.Form.Radio.get(form.comment_key),
			"pageset" : Utils.Form.Radio.get(form.note_key),
			"invitationset" : Utils.Form.Radio.get(form.friend_key)
		};
		var key_array = [];
		var value_array = [];
		for(var i in option){
			key_array.push(i);
			value_array.push(option[i]);
		}
		inter.request({
			POST : {
				uid: $UID,
				privatekey: key_array.join(","),
				privatevalue: value_array.join(",")
			},
			onSuccess : function(){
				this.save_wall();
			}.bind2(this),
			onError : function(result){
				showError(result.code);
			},
			onFail : function(){
				
			}
		});
	},
	save_wall: function(){
		var inter = new Interface("http://wall.cws.api.sina.com.cn/set_privacy.php","jsload");
		var form = $E("blog_setting_form");
		inter.request({
			GET : {
				value:Utils.Form.Radio.get(form.wall_key)
			},
			onSuccess : function(){
				winDialog.alert("保存成功",{
					icon:"03"
				});
				this.hide();
			}.bind2(this),
			onError : function(result){
				showError(result.code);
			},
			onFail : function(){
				
			}
		});
	},
    struc: '\
		<div class="CP_layercon3 blogManageItem">\
		<form id="blog_setting_form">\
			<h3>博文评论开关设置</h3>\
			<p>\
			<input type="radio" value="4" id="comment_key_1" name="comment_key" /><label for="comment_key_1">允许所有人评论</label>\
			<input type="radio" value="2" id="comment_key_2" name="comment_key" /><label for="comment_key_2">不允许匿名评论</label>\
			<input type="radio" value="1" id="comment_key_3" name="comment_key" /><label for="comment_key_3">不允许评论</label></p>\
			<h3>纸条接收设置</h3>\
			<p>\
			<input type="radio" value="0" id="note_key_1" name="note_key" /><label for="note_key_1">接收所有纸条</label>\
			<input type="radio" value="2" id="note_key_2" name="note_key" /><label for="note_key_2">接收好友纸条</label>\
			<input type="radio" value="1" id="note_key_3" name="note_key" /><label for="note_key_3">拒绝接收所有纸条</label></p>\
			<h3>好友邀请设置</h3>\
			<p>\
			<input type="radio" value="0" id="friend_key_1" name="friend_key" /><label for="friend_key_1">接收好友邀请</label>\
			<input type="radio" value="1" id="friend_key_2" name="friend_key" /><label for="friend_key_2">拒绝接收好友邀请</label></p>\
			\
			<h3>留言板隐私设置</h3>\
			<p>\
			<input type="radio" value="0" id="wall_key_1" name="wall_key" /><label for="wall_key_1">所有人可见&nbsp;&nbsp;&nbsp;&nbsp;</label>\
			<input type="radio" value="1" id="wall_key_2" name="wall_key" /><label for="wall_key_2">仅自己可见</label>\
			</p>\
			\
			<div class="btn">\
			<a id="key_save_btn" class="SG_aBtn SG_aBtnB" href="#" onclick="return false;"><cite>确定</cite></a>\
			<a id="key_cancel_btn" class="SG_aBtn SG_aBtnB" href="#" onclick="return false;"><cite>取消</cite></a>\
			</div>\
		</form>\
		</div>\
	'
};

