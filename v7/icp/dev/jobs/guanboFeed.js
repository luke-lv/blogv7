/**
 * @fileoverview 官博新动态
 * @author zhihan | zhihan@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/utils/cookie/getCookie.js");
$import("sina/utils/cookie/setCookie.js");
$import("sina/core/dom/opacity.js");
$import("sina/ui/tween/transition.js");
$import("sina/core/events/addEvent.js");
$import('mojie/feedTypeList.js');

$registJob("guanboFeed", function(){
	var feedOut = $E('guanbofeedout');
	if (!feedOut) {
		return;
	};
	var cver;
	var ver = Utils.Cookie.getCookie('guanbofeedver'+scope.$uid);
	feedOut.style.overflow = "hidden";
	
	var sourceArr = ['SLOT_38'];
	// var sloturl = 'http://interface.blog.sina.com.cn/riaapi/pageslot/pageslot.php';
	var sloturl = 'http://comet.blog.sina.com.cn/api?maintype=pageslot';
	var reqdata = {
		id : sourceArr
	};
	if(typeof scope != 'undefined') {
		reqdata.blogeruid = scope.$uid;
	}
	if($UID) {
		reqdata.loginuid = $UID;
	}

	function play(time,func,endCall) {
		var perTime = 20;
		var curr = 0;
		var val = setInterval(function(){
			if(time < curr) {
				if(endCall) {
					endCall();
				}
				clearInterval(val);
			} else {
				func(curr);
				curr += perTime;
			}
		},perTime);
	}
	
	function feedOutShow() {
		feedOut.style.width = '153px';
		feedOut.style.height = '0px';
		feedOut.style.display = '';
		
		var time = 400;
		//var w = 1;//553/time; //690
		var h = 40/time;
		
		play(time,function(curr){
			feedOut.style.width = (curr+153)+'px';//parseInt(w*curr) + 'px';
			feedOut.style.height = parseInt(h*curr) + 'px';
			//feed下拉列表的位置在官博feed动画执行完毕后设置。
			var hg = parseInt(feedOut.style.height);
			if( hg === 40){
				Mojie.feedTypeList(24, 23, 21);
			}
		});
	}
	
	// function feedOutHidden() {
		
	// 	var time = 400;
	// 	var perTime = 20;
	// 	var w = 553/time; //470
	// 	var h = 40/time;
		
	// 	play(time,function(curr){
	// 		feedOut.style.width = parseInt(553 - w*curr) + 'px'; //690
	// 		feedOut.style.height = parseInt(40 - h*curr) + 'px';
	// 	},function() {
	// 		feedOut.style.display = 'none';
	// 	});
	// }
	
	//节点是否存在
	if(feedOut) {
		//是否点了关闭,并判断一下是不是最新
		// cver = feedOut.getAttribute('ver');
		// if(cver != ver) {
		// 	feedOutShow();
		// }
		// 只判断是否关闭，ver目前没用了
		var closeCookie = Utils.Cookie.getCookie('guanbofeedver'+scope.$uid);
		if(!closeCookie) {
			Utils.Io.JsLoad.request(sloturl, {
                GET : reqdata,
                onComplete: function(res) {
                    var blog_info = res[sourceArr[0]].res;
                    var randomIndex = 0;

                    if(blog_info.length) {
                    	// 多条内容随机出
                    	if(blog_info.length > 1) {
                    		randomIndex = Math.floor((blog_info.length+1)*Math.random());
                    	}
                    	// 没有内容不显示
                    	if(!blog_info[randomIndex].words) {
                    		return;
                    	}
                    	var linkhtml = '<a target="_blank" '+ blog_info[randomIndex].a_c_suda +' href="'+blog_info[randomIndex].a_href+'" title="'+blog_info[randomIndex].a_title+'">'+ blog_info[randomIndex].words +'</a>';
                    	Core.Dom.insertHTML(feedOut, linkhtml, 'BeforeEnd');
                    	feedOutShow();
                    	if(typeof SUDA != 'undefined') {
                    		SUDA.uaTrack(blog_info[randomIndex].a_v_suda_key, blog_info[randomIndex].a_v_suda_value);
                    	}
                    }
                    
                },
                onException: function(res) {
                }
            });
		}
	}
	scope.guanbofeedclose = function() {
		Utils.Cookie.setCookie('guanbofeedver'+scope.$uid,true,24);
		feedOut.style.display = "none";
		var el = $E('newFeedTips');
		Mojie.feedTypeList(24, 23, 21);
		$E("feedWrap").style.zoom = 1;
	}
});
