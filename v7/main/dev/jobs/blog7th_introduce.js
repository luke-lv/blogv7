$import("sina/core/events/addEvent.js");
$import("sina/ui/panel.js");
$import("sina/ui/tween/tweenStrategy.js");
$import("sina/core/dom/opacity.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/dom/getElementsByClass.js");

$registJob('blog7th_introduce', function(){
	var sharebox = $E("shareBox"),
		backTop = $E("backTop");

	var __addEvent = Core.Events.addEvent, 
		__opacity  = Core.Dom.opacity;
	var __getElemByCls = Core.Dom.getElementsByClass;

	if(shareBox){
		shareBox.style.top = "100px";
		shareBox.style.left = "0px";
		shareBox.style.position = "fixed";
	}

	//返回顶部元素
	if(backTop){
		backTop.style.display = "none";
		// backTop.style.top = "580px";
		// backTop.style.right = "100px";
		backTop.style.position = "fixed";
		
	}

	updateLayerPos();

	//首次检查下滚动条位置
	if((document.documentElement.scrollTop || document.body.scrollTop)>0){
		backTop.style.display = "block";
	}

	//resize
	__addEvent(window,updateLayerPos,"resize");
	//注册scroll事件
	__addEvent(window,function(){
		//alert(myPanel.entity.style.left)
		var sTop=document.documentElement.scrollTop || document.body.scrollTop;
		//如果回到顶部元素为隐藏状态 且scrollTop大于0 显示回到顶部元素
		if(backTop.style.display==="none" &&sTop >0){
			backTop.style.display = "block";
		}
		if(sTop===0){
			backTop.style.display = "none";
		}
	},"scroll");

	//为回到顶部按钮注册click事件
	__addEvent(backTop,function(){
		var tween=new Ui.TweenStrategy(document.documentElement.scrollTop || document.body.scrollTop,0,0.8,function(t, b, c, d){
			return -c * ((t=t/d-1)*t*t*t - 1) + b;
		});
		tween.onTween=function(v){
			document.documentElement.scrollTop=document.body.scrollTop=v;
		}
		tween.start();
	});

	/**
	 * 更新返回顶部按钮位置
	 */
	function updateLayerPos(){
		var winWidth = document.documentElement.clientWidth,
			winHeight=document.documentElement.clientHeight;
		
		if(parseInt(winWidth)<930){
			$E("backTop").style.left = (parseInt(winWidth)-100)+"px";
			$E("backTop").style.top = (winHeight-88)+"px";
		}else{
			$E("backTop").style.left = (winWidth -100)+"px";
			$E("backTop").style.top = (winHeight-88)+"px";
		}
	}



	//++++++++++++++++++++++++++++++++++++++++分享按钮们++++++++++++++++++++++++++++++++++++++++++++++++++++++
    var _p_share_title ="新浪博客七周年活动-领取徽章，分享成长_新浪博客";
    var _p_share_pic = "http://ww4.sinaimg.cn/mw600/8a76ffdbjw1dwlf3866w5j.jpg";
    var _p_share_url = "http://control.blog.sina.com.cn/blog_7years/index.php";
    var _p_share_text = "#新浪博客七周年#我们的博客，更开放的博客。博客走过七年的历程，在七岁生日之际，新版博客七大功能七剑齐发，将以更开放的心态和更开放的服务，为全球华人持续提供一流的博客服务。详情请点击：http://control.blog.sina.com.cn/blog_7years/index.php";
    var _p_share_textWeibo = "#新浪博客七周年#我们的博客，更开放的博客。博客走过七年的历程，在七岁生日之际，新版博客七大功能七剑齐发，将以更开放的心态和更开放的服务，为全球华人持续提供一流的博客服务。详情请点击：";

    
    if ($E('share_db')) {
        $E('share_db').href = "javascript:void((function(){var%20u='http://shuo.douban.com/!service/share?image=&href=" + encodeURIComponent(_p_share_url) + "&name=" + encodeURIComponent(_p_share_title) +"';window.open(u,'douban','toolbar=0,resizable=1,scrollbars=yes,status=1,width=450,height=330');return%200;})());";
    }
    if ($E('share_kx')) {
        $E('share_kx').href = "javascript:void(kaixin=window.open('http://www.kaixin001.com/~repaste/share.php?&rurl="+escape(_p_share_url)+"&rtitle="+escape(_p_share_title)+"&rcontent="+escape(_p_share_text)+"','kaixin'));kaixin.focus();";
    }
    // 根据不同的杂志社显示不同的文案
    var x = "javascript:void((function(s,d,e,r,l,p,t,z,c){var%20f='http://v.t.sina.com.cn/share/share.php?appkey=2264489285&ralateUid=2264489285"
    +(scope.$ralateUid?"&ralateUid="+scope.$ralateUid:"")+"',u=z||d.location,p=['&url=',e(u),'&title=',e(t||d.title),'&content=',c||'gb2312','&pic=',e(p||'')].join('');function%20a(){if(!window.open([f,p].join(''),'mb',['toolbar=0,status=0,resizable=1,width=440,height=430,left=',(s.width-440)/2,',top=',(s.height-430)/2].join('')))u.href=[f,p].join('');};if(/Firefox/.test(navigator.userAgent))setTimeout(a,0);else%20a();scope.weiboLog();})(screen,document,encodeURIComponent,'','','"+_p_share_pic+"','"+_p_share_textWeibo+"','"+_p_share_url+"','utf-8'));";
    
    if ($E('share_weibo')) {
        $E('share_weibo').href = x;

    }
    if ($E('share_rr')) {
        $E('share_rr').href = "javascript:void(function(){var renren=window.open('http://share.renren.com/share/buttonshare.do?link="+encodeURIComponent(_p_share_url)+"&title="+encodeURIComponent(_p_share_title)+"&content="+encodeURIComponent(_p_share_text)+"');}())";
    }
    //++++++++++++++++++++++++++++++++++++++++分享按钮们++++++++++++++++++++++++++++++++++++++++++++++++++++++

})