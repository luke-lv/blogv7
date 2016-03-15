/**
 * @author shaomin
 * @modified dcw1123
 */

$import("sina/sina.js");
$import("lib/jobs.js");
$import("sina/utils/flash/swf.js");
$import("sina/core/system/winSize.js");
$import("sina/core/dom/getXY.js");
$import("lib/checkAuthor.js");
$import("lib/interface.js");
$import("sina/utils/io/jsload.js");
$import("lib/dialogConfig.js");
$import("sina/core/system/br.js");
$import("lib/interface.js");
$registJob("initBatchUpload", function(){
	
	var _s = {};
	var _ua = navigator.userAgent.toLowerCase();
	_s.$TT=/tencenttraveler/.test(_ua);
	_s.$360=/360se/.test(_ua);
	_s.$Maxthon=false;
	try{
		var t=window.external;
		_s.$Maxthon=t.max_version?true:false;
	}catch(e){  }
	

            
            
	var reflash;
	var onUpload = false;
	if($E("batchUploadPanel")){
		var checkFlash = function(){		//浏览器是否支持 flash。
			if($IE){
				try{
					var objFlash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
				}catch(e){
					return false;
				}
			}else{
				if(!navigator.plugins["Shockwave Flash"]){
					return false;
				}
			}
			return true;
		}
		
		if(checkFlash){
			document.documentElement.scrollTop = 0;
			var config = {};
			var locked = false;
			var cacheNum = 0;
			
			// scope.batchUploadInfo.ticket = encodeURIComponent(scope.batchUploadInfo.ticket);
			// scope.batchUploadInfo.cookie = encodeURIComponent(scope.batchUploadInfo.cookie);
			
			scope.getMovie = function(movieName){			//获得 object。
				if(navigator.appName.indexOf("Microsoft") != -1){
					return window[movieName];
				}else{
					return document[movieName];
				}
			};
			
			scope.upLoadListener = function(){
				var arg = arguments;
				var sEvent = arg[0];
				var oMovie = scope.getMovie("BatchUpload");
				var mTop = Core.Dom.getXY(oMovie)[1];
				trace(sEvent);
				switch(sEvent){
					case "RESIZE":
						//	window.clearTimeout(clock);
						oMovie.height = arg[1];
						oMovie.style.height = arg[1] + "px";
						break;
					case "UPLOAD_SUCCESS_DATA":
						window.location.href = scope.batchUploadInfo.listUrl;
						break;
					case "SCROLL":
						clearTimeout(reflash);
						reflash = setTimeout(function(){
							try{
								var wSize = Core.System.winSize();
								var sTop = Math.max(document.body.scrollTop, (document.documentElement) ? document.documentElement.scrollTop : 0);
								var sSnap = wSize.height + sTop;
								var itemSnap = mTop + arg[1];
								if(itemSnap > sSnap && !locked){
									locked = true;
									cacheNum = itemSnap;
									var count = 0;
									var step = 15;
									scope.BatchUploadCacheInterval = setInterval(function(){
										if(count == step){
											window.clearInterval(scope.BatchUploadCacheInterval);
											locked = false;
										}
										var s = Math.max(document.body.scrollTop, (document.documentElement) ? document.documentElement.scrollTop : 0);
										var sTo = (cacheNum - s)/5;
										document.documentElement.scrollTop = s + sTo;
										count++;
									},100);
								}
							}catch(e){
								window.clearInterval(scope.BatchUploadCacheInterval);
							}
						}, 200);
						break;
					case "UPLOAD_AGAIN":
						document.documentElement.scrollTop = 0;
						break;
					case "RELOAD":
						window.location.reload(true);
						break;
					case "UPLOAD_EDIT":
						window.location.href = scope.batchUploadInfo.editUrl;
						break;
					case "UPLOAD_HOME":
						window.location.href = scope.batchUploadInfo.listUrl;
						break;
					case "UPLOAD_PROGRESS":
						Kit.checkAuthor();
						if(!$isLogin || !$isAdmin){
							window.location.href = "http://blog.sina.com.cn/login?r=";
						}
						break;
					case "HOME":
						var location = window.location;
						location.href = location.protocol + "//" + location.host + "/" + scope.$uhost + "/home/";
						break;
					case "UPLOAD_START":
						onUpload = true;
						break;
					case "UPLOAD_ENDED":
						onUpload = false;
						break;
					case "UPLOAD_PID": //发图片成功后， 给msn发feed
						trace('UPLOAD_PID:' + arg[1]);
						//只发送一条feed，其他的忽略
						if (!scope.sendFeed) {
							var pid = arg[1];
							var albumName = $E('ctgid').options[$E('ctgid').selectedIndex].innerHTML;
							var isPrivateBlog = (scope.$private && scope.$private.isprivate == '1');
							var isPrivateAlbum = /[加密]/.test(albumName);
							var isLoginFromMsn;
							//取msn登录的cookie
							//isLoginFromMsn = Utils.Cookie.getCookie('loginFromMsn');
							//不是私密博客，且不是私密博文，则发送feed,在msn_photo_feed中进行判断
							if ( !isPrivateBlog && !isPrivateAlbum){
								var url = 'http://control.blog.sina.com.cn/riaapi/feed/msn_photo_feed.php' +
										'?uid=' + scope.$uid +
										'&pid=' + encodeURIComponent(pid) +
										'&album=' + encodeURIComponent(albumName) +
										'&albumlink=' + encodeURIComponent('http://photo.blog.sina.com.cn/category/u/' + scope.$uid + '/s/' + $E('ctgid').value);
								new Interface(url, 'jsload').request({
									onError: function(){},
									onSuccess: function(){}
								});
								scope.sendFeed = 'send';
								trace('有msncookie，发送feed');
							}else{
								//trace('不发送feed，info:' + [isLoginFromMsn , !isPrivateBlog , !isPrivateAlbum]);
							}
						}else{
							trace('UPLOAD_PID:not first');
						}
						trace('UPLOAD_PID: end');
						break;
				}
			};
			
			var swf_url = $_GLOBAL.flashBasicURL + "batchupload.swf?t="+new Date().getTime();
			var params = {
				menu	: "false",
				scale	: "noScale",
				bgcolor	: "#FFFFFF",
				wmode	: "transparent",
				allowFullscreen 	: "true",
				allowScriptAccess	: "always"
			};
			
			if(_s.$360 || _s.$TT || _s.$Maxthon) swf_url+='?t='+new Date().getTime();
			delete scope.batchUploadInfo.cookie;
			//movieUrl，uploadPanel，objId，width，height，version，bgColor，flashVars，innerParams
			Utils.Flash.swfView.Add(swf_url, "batchUploadPanel", "BatchUpload", "650", "200", "9.0.0", "#ffffff", scope.batchUploadInfo, params);
			$E("upload_loading").style.display = "none";
			$E("batchUploadPanel").style.display = "block";
		}
	}
	
	window.showUploadBtn = function(str){
	 	$E("upload_edit").style.display = "";	
	};
	
	window.hideUploadBtn = function(str){
		$E("upload_edit").style.display = "none";
	};
	
	window.getParams = function(){			//选专辑，写标签
		var ctgid = $E("ctgid").options[$E("ctgid").selectedIndex].value;
		var tag = $E("tag").value;
		var isJoined = $E("markonly") ? ($E("markonly").checked ? "1" : "0") : "";
		return [ctgid, tag, isJoined].join("|");
	};
	
	//获取票据。
	window.getTickets = function(num){
		var _reqLink = "http://login.sina.com.cn/sso/getst.php?entry=photo&service=tupian" + (num ? "&cnt="+num : "") + "&cb=getTicketsCallback";
		Utils.Io.JsLoad.request(_reqLink, {
			onComplete : function(){  }
		});
	};
	window.getTicketsCallback = function(data){
		var _objUpload = scope.getMovie("BatchUpload");
		if(data.retcode == 0){
			_objUpload.setTickets(data.ticket);			//AS 里注册的。
		}else if(data.retcode == 6103){					//需要登录。
			winDialog.alert("权限错误，请重新登录");
		}else{
			winDialog.alert("系统繁忙");
		}
	}
	
	/*
	clock = setTimeout(function(){
		window.location.href = "upload/upload_html.php";
	},5000);
	*/
	
	Core.Events.addEvent(window, function(event){
		if(onUpload){
			alert(onUpload);
			event.returnValue = "是否离开，离开可能有部分图片无法上传成功！";
		}
	}, "beforeunload");
	
	
	//samsung 图片活动提示
	window.getActivityCheck = function(){		//默认定义一个。省得在 as 里判断。
		//trace("original func");
		return false;
	};
	window.getSamsungCode = function(){
		return null;
	}
	window.getSamsungTime = function(){
		return null;
	};
	var joinActivity = $E("tagcheck");
	if(joinActivity){
		joinActivity.checked = true;
		window.getActivityCheck = function(){
			//trace("overrided");
			return joinActivity.checked;
		};
		window.getSamsungCode = function(){
			var samsungVcode = $E("sumsung_vcode").value;			//呃…是 samsung 才对。。。。
			return samsungVcode;
		};
		window.getSamsungTime = function(){
			var samsungTime = $E("sumsung_time").value;
			return samsungTime;
		};
	}
	
	
});


