/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 */
/** 
 * @fileoverview 发起登录请求
 * @author stan | chaoliang@staff.sina.com.cn
 */
$import("sina/core/class/create.js");
$import("sina/sina.js");
$import("sina/utils/io/jsload.js");

$import("lib/login/_login.js");

Lib.Login.LoginPost = Core.Class.create();

Lib.Login.LoginPost.prototype = {
    /**
     * sso登陆所需js
     */
    url: "http://i.sso.sina.com.cn/js/ssologin.js",
    /**
     * 回调函数
     */
    callback: null,
    initialize: function(callback,clearDomain,from){			//添加 from 统计点数据。
        window.sinaSSOConfig = new function(){
			if (from) {
				this.from = from;
			}
			this.pageCharset="utf-8";
            //this.service = 'uc'; // 本产品的标识
            //this.domain = '51uc.com'; // 所在域的根域，如果时sina.com.cn 的子域，该配置可以忽略
            this.noActiveTime = 14400; // 不活跃时间
            this.setDomain=true;
			this.entry='boke';
            this.customInit = function(){
            };
            this.customLoginCallBack = callback;
            this.customLogoutCallBack = function(result){
            	
            };
            //this.feedBackUrl = "http://control.blog.sina.com.cn/riaapi/login/ajaxlogin.php?version=7"+(clearDomain?"&clearDomain":"");
           	//trace(this.feedBackUrl);
		    this.useIframe = true;
        };
    },
    /**
     * 登陆
     * @param {Object} userName 用户名
     * @param {Object} userPass 密码
     * @param {int} time 延迟登录的时间
     */
    login: function(username, password, time){
		var _this = this;
		if (typeof sinaSSOController=="undefined" || !sinaSSOController) {
			trace("no sso");
			Utils.Io.JsLoad.request(this.url, {
				onComplete: function(){
					__login();
				},
				onException: function(){ },
				timeout: 30000
                ,isRemove : false
			});
		}else{
			trace("has sso");
			sinaSSOController.init();			// 则需要重新获取一次 sinaSSOConfig。

      // js加密登录方式
      if (typeof sinaSSOController.setLoginType == 'function'){
        sinaSSOController.setLoginType(2);
      }
      if (typeof sinaSSOController.getServerTime == 'function'){
        //注释掉，会请求同一接口2次，内部人家自己已经做了判断 by fuqiang3
        //sinaSSOController.getServerTime(username); // 不需要关心成功与失败
      }

			trace("init ok");

			__login();
		}
		function __login(){
			if(typeof time == "undefined"){
				sinaSSOController.login(username, password);
			}else{
				sinaSSOController.login(username, password, time);
			}
		}
    },
    /**
     * 处理登陆操作状态
     * @param {Object} loginStatus 登陆状态
     */
    parse: function(loginStatus){
        //trace("登陆状态 : " + loginStatus);
        this.callback.call(loginStatus);
    }
};
