/**
 *	分享相册图片到微博.
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

$registJob("sharePhoto", function() {

		//要分享图片 的地址
		var nickName = "",

		uid = scope.$uid,
		blogpic = scope.$pageid == 'blogpic',
		from = blogpic ? "博客": "相册",
		url = blogpic ? "http://blog.sina.com.cn/s/blog_" + picInfo.ctg_id + ".html": document.location,
		
		title="分享一张图：",

		sharewrap = $C('div'),
		// div1= $C('div'),
		div2 = $C('div');

		sharewrap.id = "sharePhoto";
		sharewrap.style.display = "none";
		sharewrap.style.width = "120px";
		sharewrap.style.position = "absolute";

		// div1.innerHTML = '<div class="share SG_txtb"><span>分享到新浪Qing</span></div>';
		// div1.className = "picShareQing";
		div2.innerHTML = '<div class="share SG_txtb" style="margin-top:5px;"><span>分享到新浪微博</span></div>';
		div2.className = "picShareFlt";

		// sharewrap.appendChild(div1);
		sharewrap.appendChild(div2);
		document.body.appendChild(sharewrap);

		//鼠标移进图片执行函数
		function fnover() {
				var left = Core.Dom.getXY(this)[0] + this.width - 126;

				shareConStyle.left = left + "px";
				shareConStyle.top = Core.Dom.getXY(this)[1] + this.height - 34 + "px";

				shareConStyle.display = "";
				nowImgSrc = encodeURIComponent(this.src);
		}
		//鼠标移出图片执行函数
		function fnout() {

				var e = Core.Events.getEvent(),
				et = e.relatedTarget || e.toElement;

				if (!et || !Core.Dom.contains(sharewrap, et)) {
						shareConStyle.display = "none";
				}

		}

		//分享 按钮的外层div
		var shareCon = sharewrap, //$E('sharePhoto'),
		shareConStyle = shareCon.style;
		
		//得到昵称
		Lib.Uic.getNickName([uid], function(oResult) {			
			nickName = oResult[uid];
			title = encodeURIComponent('分享' + nickName + '的' + from + '图片：');
		});

		// Core.Events.addEvent(div1, function() {
		// 	//var ttl = "";
		// 	//if(window.picInfo && picInfo.pic_id){
		// 	//	ttl = $E("title_"+picInfo.pic_id).children[0].innerHTML;
		// 	//}
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
				u = 'http://v.t.sina.com.cn/share/share.php?searchPic=false&appkey=1617465124&title=' + title + "&url=" + encodeURIComponent(url) + '&source=' + r + '&sourceUrl=' + encodeURIComponent(l) + '&content=utf-8' + '&pic=' + nowImgSrc;
				window.open(u, 'mb', 'toolbar=0,status=0,resizable=1,width=440,height=430,left=' + (screen.width - 440) / 2 + ',top=' + (screen.height - 430) / 2);
				Core.Events.stopEvent();
		});

		var imgCon = Core.Dom.byClz(document.body, 'div', 'photoContDesc')[0];

		if (imgCon) {
				var img = $T(imgCon, 'img')[0];
				var image = new Image;
				image.onload = function bindFn() {
						if (this.width > 150 && this.height > 30) {
								Core.Events.addEvent(img, fnover.bind2(img), 'mouseover');
								Core.Events.addEvent(img, fnout.bind2(img), 'mouseout');
						}
				};

				//图片完全加载 完全后绑定 分享 事件
				image.src = img.src;
		}
});