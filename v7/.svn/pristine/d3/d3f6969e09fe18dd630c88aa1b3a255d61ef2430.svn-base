/**
 *	分享相册 首页图片到微博.
 * @author meichun1@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/dom/contains.js");
$import("sina/core/events/getEvent.js");
$import('sina/core/events/stopEvent.js');
$import("sina/core/function/bind2.js");
$import("lib/uic.js");
$import("lib/jobs.js");
$import("lib/sendLog.js");

$registJob("shareImgList", function() {
		//要分享图片 的地址
		var nickName="", nowImgSrc,link, uid = scope.$uid,
		title="分享一张图：",

		$S = Core.Dom.byClz,
		foreach = Core.Array.foreach,

		sharewrap = $C('div'),
		// div1= $C('div'),
		div2 = $C('div');

		sharewrap.id = "sharePhoto";
		sharewrap.style.display = "none";
		sharewrap.style.width = "120px";
		sharewrap.style.position = "absolute";

		// div1.innerHTML = '<div class="share SG_txtb"><span>分享到新浪Qing</span></div>';
		// div1.className = "picShareQing";
		div2.innerHTML = '<div class="share SG_txtb" style="margin-top:3px;"><span>分享到新浪微博</span></div>';
		div2.className = "picShareFlt";

		// sharewrap.appendChild(div1);
		sharewrap.appendChild(div2);
		document.body.appendChild(sharewrap);

		
		var con = $S(document.body, 'ul', 'pt_list_nb')[0];
		if (!con) {
				return;
		}

		foreach($S(con, 'div', 'pt_border'), function(node) {
				Core.Events.addEvent(node, fnover.bind2(node), 'mouseover');
				Core.Events.addEvent(node, fnout.bind2(node), 'mouseout');
		});

		//得到昵称
		Lib.Uic.getNickName([uid], function(oResult) {
			nickName = oResult[uid];
			title = encodeURIComponent('分享' + nickName + '的相册图片：');
		});


		//鼠标移进图片执行函数

		//分享 按钮的外层div
		var shareCon = sharewrap, //$E('sharePhoto'),
		shareConStyle = shareCon.style;
		
		var cleft=document.documentElement.clientLeft;
		var cTop=document.documentElement.clientTop;
		function fnover() {
				var img=$T(this, 'img')[0];
				shareConStyle.left = Core.Dom.getXY(this)[0] + 82-cleft + "px";
				shareConStyle.top = Core.Dom.getXY(this)[1] + 173 -cTop + "px";
				
				shareConStyle.display = "";
				
				nowImgSrc = img.src.replace('small', 'bmiddle');
				link = img.parentNode.href;

		}
		//鼠标移出图片执行函数
		function fnout() {

				var e = Core.Events.getEvent(),
				et = e.relatedTarget || e.toElement;

				if (!et || !Core.Dom.contains(sharewrap, et)) {
						shareConStyle.display = "none";
				}

		}

		// Core.Events.addEvent(div1, function() {
		// 	var url =  $_GLOBAL.qingURL+'blog/controllers/share.php?searchPics=0&content='
		// 		+ encodeURIComponent('分享'+nickName+'的图片，查看原图：')
		// 		+ "&url=" + encodeURIComponent(location.href)
		// 		+ "&ralateNick=" + encodeURIComponent("新浪博客")
		// 		+ '&pics=' + nowImgSrc;
		// 	window.open(url, 'shareQing', 'toolbar=0,status=0,resizable=1,width=600,height=520,left='
		// 		+ (screen.width-600)/2 + ',top=' + (screen.height-520)/2);
			
		// 	v7sendLog("80_01_02");
		// 	return false;
		// });
		Core.Events.addEvent(div2, function() {
				var f = 'http://v.t.sina.com.cn/share/share.php?',
				r = "新浪-博客",
				l = 'http://blog.sina.com.cn',
				u = 'http://v.t.sina.com.cn/share/share.php?searchPic=false&appkey=1617465124&title=' + title + "&url=" + link + '&source=' + r + '&sourceUrl=' + encodeURIComponent(l) + '&content=utf-8' + '&pic=' + nowImgSrc;
				window.open(u, 'mb', 'toolbar=0,status=0,resizable=1,width=440,height=430,left=' + (screen.width - 440) / 2 + ',top=' + (screen.height - 430) / 2);
				Core.Events.stopEvent();
		});

});