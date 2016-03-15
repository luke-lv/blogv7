/**
 * 
 * @fileoverview 
 * @authors yifei2 <yifei2@staff.sina.com.cn>
 * @created
 */

$registJob("padSwitch", function(){
	
	var ua = navigator.userAgent,
		isiPad = /(iPad).*OS\s([\d_]+)/.test(ua);

	var _el_html = '<div class="webSelect"><a id="sw_web" class="current" href="javascript:void(0);">电脑版</a><a id="sw_pad" href="javascript:void(0)">PAD版</a></div>';
	var _addevent = Core.Events.addEvent;
	var url = window.location.href;

	function deleteCookie(name){
		var Then = new Date();
		Then.setTime(Then.getTime() - 1);
		document.cookie = name + "=_pass;path=/;domain=.blog.sina.com.cn;expires=" + Then.toGMTString();
	}


	if(isiPad) {
		Core.Dom.insertHTML($E("sinablogfooter"), _el_html, "AfterBegin");

		_addevent($E("sw_pad"), function(e) {
			e.target.className = "current";
			Core.Dom.removeClass($E("sw_web"), "current");
			//清除cookie，并跳转
			deleteCookie("ipad4web");
			// delCookie("ipad4web");
			url = url.replace("blog", "m.blog");
			window.location.href = url;
			
		});
	}
	
});
