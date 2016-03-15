/**
 * @desc	注册成功页面
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("comps/ijax_2.js");
$import("lib/checkAuthor.js");
$import("sina/utils/url.js");

$registJob("regOk", function(){
	
	var congratulations = $E("congratulations");
	var sorry = $E("sorry");
	var pageLoading = $E("pageLoding");
	var pageLoaded = $E("pageLoaded");
	var btnTxt = $E("btnTxt");
	var babyNext = $E("babyNext");
	
	var __url = new Utils.Url(window.location.href);
	Lib.checkAuthor();
	
	Utils.Io.Ijax_2.request("http://control.blog.sina.com.cn/riaapi/reg/open_blog_simple.php", {
		timeout:		20000,
		POST:{
			src:		__url.query.src,
			srcuid:		__url.query.srcuid
		},
		onComplete:function(res){
			if(res.code == "A00006" || res.code == "A00113"){		// 一个成功，一个已经开通
				showCongratulations();
			}else{
				showSorry();
			}
		},
		onException:function(res){
			if(res == "timeout"){			// 接口延时
				showSorry();
			}
			else{							// 其他接口访问异常
				showSorry();
			}
		}
	});
	
	function showSorry(){
		sorry.style.display = "block";
		btnTxt.innerHTML = "进入我的博客";
		btnTxt.parentNode.href = "http://blog.sina.com.cn/u/"+$UID;
		if(babyNext) babyNext.style.display = "none";		// 育儿博客专有
		
		pageLoading.style.display = "none";
		pageLoaded.style.display = "block";
	}
	function showCongratulations(){
		congratulations.style.display = "block";
		pageLoading.style.display = "none";
		pageLoaded.style.display = "block";
	}
	
});


