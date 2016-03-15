/**
 * @fileoverview 文章页 选中文字、图片分享到微博
 * @author wujian wujian@staff.sina.com.cn
 * @create 2010-12-20 
 */
$import("sina/sina.js");
$import("sina/core/string/trim.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/dom/getStyle.js");
$import("sina/core/dom/contains.js");

$registJob("selectionShare",function(){
	if(!$E("sina_keyword_ad_area2")){
		return;
	}
	
	//1、给文章 节点  绑定监听 mouseup事件 
	//2、然后判断 是否有选区  有：显示分享到微博。
	var	tipsNode = $C('div');
	//div.innerHTML = '<div class="share SG_txtb"><a href="#"><img height="18"align="absmiddle"width="18"title=""src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif"class="SG_icon SG_icon110"></a><span>分享到新浪微博</span></div>';
	//tipsNode.innerHTML = '<div class="share SG_txtb" ><span>分享到新浪微博</span></div>';
	tipsNode.innerHTML ='<img src="http://simg.sinajs.cn/blog7style/images/common/share.gif" title="将选中内容分享到新浪微博"/>';
	tipsNode.id = "selectionShare";
	
	//tipsNode.className = "picShareFlt";

	tipsNode.style.display = "none";
	
	//tipsNode.style.width = "120px";
	tipsNode.style.position = "absolute";
	tipsNode.style.cursor="pointer";

	document.body.appendChild(tipsNode);
	
	Core.Events.addEvent(document.body,function(){
		hideTips();
	});
	Core.Events.addEvent(tipsNode,function(){
		//点击 按钮 打开分享
		
		shareToT();
		Core.Events.stopEvent();
	});
	var nickName=null;
	//得到昵称
    Lib.Uic.getNickName([scope.$uid], function(oResult) {
        nickName = oResult[scope.$uid];
    });
	
	//闭包参数
	var mx=0,my=0;
	var sx=0,sy=0;
	var shareWord,shareImg;
	Core.Events.addEvent($E("sina_keyword_ad_area2"),function(e){
		var e = Core.Events.getEvent();
		e=Core.Events.fixEvent(e);
		setTimeout(function(){
			//判断选区		
			var isExist=getSelectContent();
			if(isExist){//有内容 显示 tips
				
				setTimeout(function(){
					showTips();
				},100);
				setMousePosition(e);			

			}else{
				hideTips()
			}
		})
		
		
	},'mouseup');
	
		Core.Events.addEvent($E("sina_keyword_ad_area2"),function(e){
		var e = Core.Events.getEvent();
		e=Core.Events.fixEvent(e);
		
		sx=e.pageX;
		sy=e.pageY;
		
		
	},'mousedown');
    
	/**
	 * 尝试获取 选择内容
	 */
	function getSelectContent(){
		shareWord=null;shareImg=null;
        var _trim = Core.String.trim;
		if(document.selection){//ie通过选区 创建范围
			var sel= document.selection.createRange();
			var w=sel.text;
			//w=w.replace(/\s/ig,"");
			
			if(w.length>=10){
				shareWord=w;//保存文字
				//trace(shareWord)
			}
						
			var html=sel.htmlText;			
			var s=/<img[\s\S]+src="(\S+)"[\s\S]+>/img;
			if(s.test(html)){
				shareImg=RegExp.$1;
				//trace(shareImg)
			}		
			
		}else{//标准浏览器 创建范围
			try{
				var sel = window.getSelection().getRangeAt(0);
				//页面全选后，取词内容过滤出现问题，导致页面卡死bug修复 @modified xiaoyue3 20140214 
				if(!Core.Dom.contains($E("sina_keyword_ad_area2"),sel.commonAncestorContainer)){
					return;
				}
				var w = sel.toString();
				//w = w.replace(/\s/ig,"");
				
				if(w.length>=10){
					shareWord=w;//保存文字
					//trace(shareWord)
				}
				
				var div=$C("div");
				div.appendChild(sel.cloneContents());
				var img=$T(div,"img");
				if(img.length>0){
					shareImg=img[0].src||img[0].real_src;
				}
			}catch(e){}
		}
		if (shareWord){// 如果shareWord为空，trim的时候会报错  modify by gaolei2@ 2013-12-12
			shareWord = _trim(shareWord).replace(/\r|\n/g,'');
		}
		return shareWord;
	}
	
	/**
	 * 分享到微博
	 */
	function shareToT(){
		if(shareWord&&shareWord.length>80){
			shareWord=shareWord.substr(0,80)+"……";			
		}
        var blogTitleEl = Core.Dom.byClz(document.body, 'h2', 'titName')[0];
        var blogTitle = blogTitleEl.textContent || blogTitleEl.innerHTML;
        
		if(shareWord){
			var	title = encodeURIComponent(shareWord + "——博文片段来自"
                        + nickName + '：' + blogTitle);
		}else{
			var	title = encodeURIComponent('分享' + nickName 
                        + '的博文图片：' + blogTitle);
		}
		
		var f = 'http://v.t.sina.com.cn/share/share.php?',		
		
		r = "新浪-博客",
		l = 'http://blog.sina.com.cn',
		u = 'http://v.t.sina.com.cn/share/share.php?searchPic=false&title=' + title 
		+ "&url=" + document.location
		+ '&source=' + r 
		+ '&sourceUrl=' + encodeURIComponent(l) 
		+ '&content=utf-8&appkey=1617465124'
		if(shareImg){
			u=u+'&pic=' + shareImg;
		}		
		window.open(u, 'selectionshare', 'toolbar=0,status=0,resizable=1,width=440,height=430,left=' + (screen.width - 440) / 2 + ',top=' + (screen.height - 430) / 2);
		hideTips();
	}
	/**
	 * 显示 tips
	 */
	function showTips(){	
		tipsNode.style.left=mx+"px";
		tipsNode.style.top=my+"px";
		tipsNode.style.display="";
	}
	/**
	 * 隐藏 tips
	 */
	function hideTips(){
		tipsNode.style.display="none";
	}
	/**
	 * 鼠标位置
	 */				
	function setMousePosition(e){	
		if(!$IE) {
			_setLoc();
			return;
		}	
		//1、先判断前后		
		var sel= document.selection.createRange();	
		var sel2=sel.duplicate(); 		
		sel2.collapse(false);
		sel2.moveStart("word",-1);
		while(sel2.text.length==0)
		{
			sel2.moveStart("word",-1);
		}
		var isFront=false;
		if(e.pageY-sy<=-sel2.boundingHeight){//不在一行上 并且 是在前面
			isFront=true;trace(11111)
		}
		if(Math.abs(e.pageY-sy)<sel2.boundingHeight){//在一行上 
			if(e.pageX-sx<0){
				isFront=true;trace(11111)
			}else{
				isFront=false;trace(22222)
			}
		}
		
		sel.collapse(isFront);
		if(!isFront){
			sel.moveStart("word",-1);
			while(sel.text.length==0)
			{
				sel.moveStart("word",-1);
				sel.moveEnd("word",-1);
			}
			//trace(sel)
			//sel.collapse(isFront);
		}
		//trace(sel)
		var tHtml=sel.htmlText;	
		
		var id="temp_"+parseInt(Math.random()*1000);
		var width=sel.boundingWidth,height=sel.boundingHeight;
		
		sel.pasteHTML('<a id="'+id+'" >$</a>'+tHtml);
		
		var ele=$E(id);
		if(isFront){
			mx=Core.Dom.getLeft(ele)+10;
			my=Core.Dom.getTop(ele)-26-7;
		}else{
			mx=Core.Dom.getLeft(ele)+width-36;
			my=Core.Dom.getTop(ele)+height;
		}
		
		ele.parentNode.removeChild(ele);
	}
	function _setLoc() {
		//字数超高10个，才出现分享
		var sel=window.getSelection();
		var index = sel.rangeCount - 1;
		var range = sel.getRangeAt(index);
		var testSpan = $C('span');
		var clone = range.cloneRange();
		var beforeToEnd = false;
		var refElem;
		var fontSize;
		var pos;
		
		//判断前后
		refElem = range.startContainer;
		if(range.startContainer != range.endContainer) {
			//非同一个节点
			if(sel.focusNode != range.startContainer) {
				//前->后
				beforeToEnd = true;
				refElem = range.endContainer;
			}
		} else {
			//同一个节点
			if(sel.focusOffset > sel.anchorOffset) {
				//前->后
				beforeToEnd = true;
			}
		}
		
		clone.collapse(!beforeToEnd);
		clone.insertNode(testSpan);
		pos = Core.Dom.getXY(testSpan);
		
		if(refElem.nodeType == 3) {
			refElem = refElem.parentNode;
		}
		
		if(refElem.tagName.toUpperCase() == 'IMG') {
			fontSize = refElem.offsetWidth;
		} else {
			fontSize = Core.Dom.getStyle(refElem, 'fontSize');
			fontSize = parseInt(fontSize.substring(0,fontSize.length-2));
		}
		
		if(beforeToEnd) {
			//7px的要求，26px的tip图片的宽
			mx=pos[0] - 33;
			//10px的要求
			my=pos[1] + 10;
			if(!$FF) {
				my += fontSize;
			}
		} else {
			//7px的要求
			mx=pos[0] + 7;
			//10px的要求，26px的tip高
			my=pos[1] - 36;
			if($FF) {
				my -= fontSize;
			}
		}
		
		testSpan.parentNode.removeChild(testSpan);
		
		sel.removeAllRanges();
		sel.addRange(range);
	}
});
