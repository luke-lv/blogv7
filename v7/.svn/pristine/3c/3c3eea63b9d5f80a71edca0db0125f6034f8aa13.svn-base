/**
 * @desc	百合结果页分享
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */
 
$import("comps/baihe/login.js");
$import("comps/baihe/shareDialog.js");

$import("lib/checkAuthor.js");
$import("lib/dialogConfig.js");
$import("lib/openBlog.js");

$import("sina/core/events/addEvent.js");
$import("sina/core/string/shorten.js");

$import("comps/baihe/pageLogin.js");


$registJob("share", function(){
	
	trace("share job ready");
	
	window.baiheShareJob = function(){
		
		trace("share job running");
		
		var share2blog = $E("share2blog");
		var share2tblog = $E("share2tblog");
		
		var testTitle = $E("question_text");			// 测试的题目
		var testType = $E("your_type");					// 测试结果归类
		var testArticle = $E("answer_content");			// 测试结果
		
		var CUT_LENGTH = 200;
		
		
		// 微博链接
		var share2tblogHref = "javascript:void((function(s,d,e,r,l,p,t,z,c){var%20f='http://v.t.sina.com.cn/share/share.php?appkey=真实的appkey',u=z||d.location,p=['&url=',e(u),'&title=',e(t||d.title),'&source=',e(r),'&sourceUrl=',e(l),'&content=',c||'gb2312','&pic=',e(p||'')].join('');function%20a(){if(!window.open([f,p].join(''),'mb',['toolbar=0,status=0,resizable=1,width=440,height=430,left=',(s.width-440)/2,',top=',(s.height-430)/2].join('')))u.href=[f,p].join('');};if(/Firefox/.test(navigator.userAgent))setTimeout(a,0);else%20a();})(screen,document,encodeURIComponent,'','','http://simg.sinajs.cn/blog7actstyle/images/baiheAward.jpg','我刚参加了“百合网-参加测试赢大奖活动”的测试："+testTitle.value+(testType.innerHTML||Core.String.shorten(testArticle.innerHTML,CUT_LENGTH))+"','http://control.blog.sina.com.cn/baihe/index.php','utf-8'));";
		
		
		// 分享浮层
		if(share2tblog)
		Core.Events.addEvent(share2tblog, function(){
			new Baihe.shareDialog({
				tblogHref:	share2tblogHref,
				testTitle:	testTitle.value || "",
				testType:	testType.innerHTML || (testArticle.innerHTML ? Core.String.shorten(testArticle.innerHTML, CUT_LENGTH) : "")
			}).show();
		}, "click");
		
		
		// 抽奖跳转
		if(share2blog)
		Core.Events.addEvent(share2blog, function(){
			Lib.checkAuthor();
			if($isLogin){
				// new Baihe.pageLogin().updateLoginInfo();
				window.location.href = "http://control.blog.sina.com.cn/baihe/lottery.php";
			}else{
				new Baihe.pageLogin().updateLoginInfo();	// 怕用户取消登录框。
				Baihe.login(function(){
					window.location.href = "http://control.blog.sina.com.cn/baihe/lottery.php";
				});
			}
		},'click');
		
		
	};
	
});

