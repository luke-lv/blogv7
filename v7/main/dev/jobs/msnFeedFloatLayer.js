$import("sina/ui/panel.js");
$import('sina/core/system/winSize.js');
$import("sina/core/events/addEvent.js");
$import("sina/utils/cookie/getCookie.js");
$import("sina/utils/cookie/setCookie.js");
$import("sina/utils/io/jsload.js");
/**
 * @fileoverview 点MSN FEED回流用户 显示浮层
 * @author zhangkai2@staff.sina.com.cn
 * @created 2010-12-22
 */
$registJob("msnFeedFloatLayer",function(){
	
	//由于需要此功能页面squite缓存html 新加载样式有可能未更新
	//所以判断该样式存不存在 如果不存在直接返回
	if(!$E("msnGuide_newCss")){
		return;
	}
	
	//判断url参数中是否有from=msn 或是referrer中是否存在http://blog.sina.com.cn/main_v5/ria/frommsn.html
	if(window.location.search.indexOf("from=msn")>-1 || document.referrer.indexOf("http://blog.sina.com.cn/main_v5/ria/frommsn.html")>-1){
		//有 则为回访 显示浮层
		var msnFeedFloatLayerTemplateHTML=
		'<div id="#{msnGuide_MSNFeedFloatLayer}" class="moveTip">'+
		  '<div class="con">'+
		    '<div class="mid">'+
		      '<div class="rgt"><a id="#{msnGuide_AddToMyFavorite}" title="请拖拽到浏览器收藏夹栏收藏该博客" href="javascript:void(0)">拖拽收藏该博客</a></div>'+
		      '<div class="midWrap">'+
		        '<div class="links"><span class="b1">可用<a target="_blank" href="http://login.sina.com.cn/signup/signin.php?entry=blog" onclick="Utils.Io.JsLoad.request(\'http://control.blog.sina.com.cn/blog_rebuild/msn/api/msnGuideCount.php?type=msnlogin\',{onComplete: function(){}});">MSN账号登录</a>新浪博客</span><span class="sx"></span><span class="b2"><a target="_blank" href="http://move.blog.sina.com.cn/msnmove/index.php" onclick="Utils.Io.JsLoad.request(\'http://control.blog.sina.com.cn/blog_rebuild/msn/api/msnGuideCount.php?type=msnmove\',{onComplete: function(){}});">查看怎样搬家</a>到新浪博客</span></div>'+
		      '</div>'+
		    '</div>'+
		    '<a href="javascript:void(0)" id="#{msnGuide_CloseButton}" class="shut"></a>'+
		  '</div>'+
		'</div>';
		
		
		var myPanel=new Ui.Panel();
		myPanel.setTemplate('<div id="#{panel}">'+msnFeedFloatLayerTemplateHTML+'</div>')
			.setFixed(true);
		
		//为关闭按钮注册clcik事件
		myPanel.nodes.msnGuide_CloseButton.onclick=function(){
			myPanel.destroy();
		}
		
		myPanel.show();
		
		myPanel.entity.style.zIndex=2000;
		//更新浮层位置	
		updatemsnFeedFloatLayerPos();
		
		//窗口重置大小
        Core.Events.addEvent(window, function(){
			setTimeout(function(){updatemsnFeedFloatLayerPos();},10);
        }, "resize");
		
		//根据cookie检测是否本机已经显示过 显示过不再发送统计数据
		if(Utils.Cookie.getCookie('floatLayerDisplay')!=="true"){
			Utils.Io.JsLoad.request("http://control.blog.sina.com.cn/blog_rebuild/msn/api/msnGuideCount.php?type=bak");
			Utils.Cookie.setCookie('floatLayerDisplay', 'true', '86400', '/', '.blog.sina.com.cn');
		}
	}
	/**
	 * 更新浮层位置
	 */
	function updatemsnFeedFloatLayerPos(){
		//不判断了 
		var winWidth = document.documentElement.clientWidth,
			winHeight=document.documentElement.clientHeight;
			
		myPanel.setPosition({x:0,y:winHeight-38});
		myPanel.nodes.msnGuide_MSNFeedFloatLayer.style.width=winWidth+"px";
	}
});
