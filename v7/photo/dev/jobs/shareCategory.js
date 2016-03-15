/**
 *	分享 相册专辑 图片到微博.
 * @author meichun1@staff.sina.com.cn
 *
 */
$import("sina/sina.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/getEvent.js");
$import('sina/core/events/stopEvent.js');
$import("lib/uic.js");
$import("lib/jobs.js");
$import("lib/sendLog.js");

$registJob("shareCategory", function() {
		var _stopEvent = Core.Events.stopEvent,
			foreach = Core.Array.foreach,
			$S=Core.Dom.byClz,
			pageid = scope.$pageid,
			uid = scope.$uid,
			title = "图片专辑：";
		
		var node = $S($E('ctgLayer'), 'li', 'current')[0],
			pshare = $S(document.body, 'div', 'photoShare')[0];
		if (!node || !pshare) {
			return;
		}

		var img = $T(node, 'img')[0],
			cateName = img.title,
			src = img.src.replace('square', 'middle'),
			url = encodeURIComponent(img.parentNode.href),
			nickname = "";

		//得到昵称
		Lib.Uic.getNickName([uid], function(oResult) {
			nickname = oResult[uid];
			title = encodeURIComponent('分享' + nickname + '的图片专辑：' + cateName);
		});

		var links = $T(pshare, 'a');
		links[0].onclick = function() {
				var f = 'http://v.t.sina.com.cn/share/share.php?',
				r = "新浪-博客",
				l = 'http://blog.sina.com.cn',
				u = 'http://v.t.sina.com.cn/share/share.php?searchPic=false&appkey=1617465124&title=' + title + "&url=" + encodeURIComponent(url) + '&source=' + r + '&sourceUrl=' + encodeURIComponent(l) + '&content=utf-8' + '&pic=' + src;
				window.open(u, 'mb', 'toolbar=0,status=0,resizable=1,width=440,height=430,left=' + (screen.width - 440) / 2 + ',top=' + (screen.height - 430) / 2);
				_stopEvent();
		};
		//分享到轻博客
		links[1].onclick = function() {
			var ctn = cateName,
				pics=[],
				plist = $T($S(document.body, 'ul', 'pt_list_nb')[0], 'img');
			if(ctn.length>120){
				ctn = ctn.substr(0,120)+"…";
			}
			for(var i=0,len=Math.min(20,plist.length); i<len; i++){
				pics.push(plist[i].src.replace(/small/,"middle"));
			}
			var qing =  $_GLOBAL.qingURL+'blog/controllers/share.php?searchPics=0&content='
				+ encodeURIComponent('分享' + nickname + '的《'+ctn+'》图片专辑，查看专辑全部内容：')
				+ "&url=" + encodeURIComponent(location.href)
				+ "&ralateNick=" + encodeURIComponent("新浪博客")
				//+ '&shareType=0'
				+ '&pics=' + encodeURIComponent(pics.join(","));
			window.open(qing, 'shareQing', 'toolbar=0,status=0,resizable=1,width=600,height=520,left='
				+ (screen.width-600)/2 + ',top=' + (screen.height-520)/2);

			v7sendLog("80_01_03");
			_stopEvent();
		};
		links[2].onclick = function() {
				window.open('http://share.xiaonei.com/share/buttonshare.do?link=' + url + '&title=' + title, 'xiaonei', 'toolbar=0,resizable=1,scrollbars=yes,status=1,width=626,height=436');
				_stopEvent();
		};
		links[3].onclick = function() {
				window.open("http://www.douban.com/recommend/?url=" + url + "&title=" + title, 'douban', 'toolbar=0,resizable=1,scrollbars=yes,status=1,width=450,height=330');
				_stopEvent();
		};
		links[4].onclick = function() {
				window.open('http://www.kaixin001.com/~repaste/repaste.php?&rurl=' + url + '&rtitle=' + title + '&rcontent=' + title);
				_stopEvent();
		};

});