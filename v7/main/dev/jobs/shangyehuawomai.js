/**
 * @fileoverview 我买网商业化
 * @author stoneCC | changchuan@staff.sina.com.cn
 * @created 2013-10-18
 */

$import("sina/utils/cookie/getCookie.js");
$import("sina/utils/cookie/setCookie.js");
$import("sina/utils/io/jsload.js");
$import("component/woMaiAd.js");

$registJob("shangyehuawomai", function () {

	var $getCookie = Utils.Cookie.getCookie;
	var $setCookie = Utils.Cookie.setCookie;
	var $jsLoad = Utils.Io.JsLoad;

	//http://api.wrating.com/sinawratingcookie?callback=fndyxcallback
	var DYX_GET_UID_INTERFACE = "http://api.wrating.com/sinawratingcookie";

	//http://highway.blog.sina.com.cn/getUid?uid=0b9fc3799b96ff20bc9f150365ba318b&varname=requestId_11111111
	var BLOG_WOMAI_USER_INTERFACE = "http://highway.blog.sina.com.cn/getUid";
	var AD_INTERFACE = "";

	var DYX_COOKIE_KEY = "dyxinfo";
	var DYX_COOKIE_LIVE_TIME = 30 * 24;

	var dyxuid = '';
	var iswomai = '0';
	var dyxSort = '';

	//开始流程
	function init(){
		getDYXuserInfoFromCookie();
		if(!dyxuid){
			getDYXuid( onGetDYXuid );
		}else if( iswomai == '1' ){
			getAd();
		}else{
			return;
		}
	}

	//从cookie获取我买网广告信息
	function getDYXuserInfoFromCookie(){
		var cookieinfo = $getCookie( DYX_COOKIE_KEY );
		var t = cookieinfo.split("_");
		if(cookieinfo){
			dyxuid = t[0] || '';
			iswomai = t[1] || '0';
			dyxSort = t[2] || '';
			if(dyxSort){
				dyxSort = decodeURIComponent(dyxSort);
			}
			return true;
		}
		return false;
	}

	//开始获取dyxuid
	function getDYXuid(callback) {
		window.fndyxcallback = function (obj) {
			try{
				callback(obj);
			}catch(e){}
		};
		var node = document.createElement("scr" + "ipt");
		node.src = DYX_GET_UID_INTERFACE + "?callback=fndyxcallback";
		var header = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
		header.appendChild(node);
	}

	//获取到dyxuid
	function onGetDYXuid( obj ){
		if(!obj || obj['code'] !=1 ||  !obj['dyxid']){
			return;
		}
		dyxuid = obj['dyxid'];

		getWomaiSign(dyxuid,function( obj ){
			if(obj && obj.code=="A00006"){
				iswomai = obj.data.status + '';
				dyxSort = obj.data.val + '';
			}
			setDYXuserInfoToCookie(dyxuid,iswomai,dyxSort);
			if(iswomai =='1'){
				getAd();
			}
		});
	}

	//获取我买网标记
	function getWomaiSign(dyxuid, callback) {
		var url = BLOG_WOMAI_USER_INTERFACE + "?" + "uid=" + dyxuid;
		$jsLoad.request(url, {
			onComplete: callback
		});
	}

	//将广告信息设置到cookie中
	function setDYXuserInfoToCookie(id, iwm, sort){
		$setCookie(
			DYX_COOKIE_KEY,
			[id, iwm, sort].join('_'),
			DYX_COOKIE_LIVE_TIME,
			"/",
			"blog.sina.com.cn",
		false);
	}

	//创建广告对象
	function getAd(){
		var woMaiAd = new WoMaiAd(dyxuid, dyxSort);
		//需暴露方法以获取swf回调
		window.dyxSwfTrigger = function(str){
			woMaiAd.dyxSwfTrigger(str);
		};
	}

	init();

});


