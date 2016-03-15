/**
 *	分享博文中的图片到微博.
 * @author meichun1@staff.sina.com.cn
 *
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
$import("other/SinaEx.js");
//$import("sina/utils/io/jsload.js");

$registJob("sharePhoto", function() {
		var foreach = Core.Array.foreach,
            pageid = scope.$pageid,
            isArt = pageid == "article" || pageid == "articleM" || pageid == 'article_new' || pageid == 'articleM_new',
            uid = scope.$uid,
            nickName,
            //要分享图片 的地址
            nowImgSrc,
            //要分享的图片
            nowImg,
            //图片所在栏目
            wrap = $E('sina_keyword_ad_area2')||document.body,
            //图片所在栏目的left值
            wrapLeft,
            image,
            //最小高度，小于这个高度就不出现分享按钮
            minHeight = 62, //83
            fixAutoHover = 1;

        var sharewrap = SinaEx.createNode('<div id="sharePhoto" style="display:none;width:120px;position:absolute;">' +
            //'<div class="picAward" style="margin-bottom:3px;"><a href="http://qing.weibo.com/2264489285/86f95d4533001j3u.html" target="_blank"><img width="18" height="18" align="absmiddle" title="" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon140" /></a></div>' +
            // '<div class="picShareQing"><div class="share SG_txtb"><span>分享到新浪Qing</span></div></div>' +
            '<div class="picShareFlt"><div class="share SG_txtb" style="margin-top:5px;"><span>分享到新浪微博</span></div></div>' +
        '</div>');
        // var div1 = sharewrap.children[0];
        // var div2 = div1.nextSibling;
        var div2 = sharewrap.children[0];
        document.body.appendChild(sharewrap);

        //liming9-2012年6月14日 对指定用户增加分享按钮 2012年6月20日-又说全部都加了
//        Utils.Io.JsLoad.request('http://control.blog.sina.com.cn/riaapi/icon_uid.php', {
//            onComplete: function(res){
//                //trace(res);
//                if(res && res.ret==1 ){
//                    var div0 = SinaEx.createNode('<div class="picAward" style="margin-bottom:3px;"><a href="http://qing.weibo.com/2264489285/86f95d4533001j3u.html" target="_blank"><img width="18" height="18" align="absmiddle" title="" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon140" /></a></div>');
//                    sharewrap.insertBefore(div0, div1);
//                    minHeight = 83;
//
//                    var jiang = '<a href="http://qing.weibo.com/2264489285/86f95d4533001j3u.html" target="_blank" style="margin-left:5px;"><img width="18" height="18" align="absmiddle" title="" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon140" /></a>';
//                    $E('sharewb') && $E('sharewb').parentNode.appendChild( SinaEx.createNode(jiang) );
//                }
//            },
//            onException: function(){}
//        });

		//得到昵称 @xiaoyue3 modified 此处延时处理，主要是在改造个人信息组件昵称获取的时候，防止另一个接口没返回来，重复请求昵称接口！
		setTimeout(function(){
			Lib.Uic.getNickName([uid], function(oResult) {
				nickName = oResult[uid];
			});
		},500);
		

		//鼠标移进图片执行函数
		function fnover() {
				//if (this.width < 165 || this.height < 62) {
				if (this.width < 165 || this.height < minHeight) {
						return false;
				}
				var left = Core.Dom.getXY(this)[0] + this.width - 124;
				//若图片超出容器
				left = Math.min(left, wrapLeft - 134);
				shareConStyle.left = left + "px";
				//shareConStyle.top = Core.Dom.getXY(this)[1] + this.height - 58 + "px";
				shareConStyle.top = Core.Dom.getXY(this)[1] + this.height - minHeight + 27 + "px";
				if (fixAutoHover) {
						shareConStyle.display = "";
				}
				nowImgSrc = encodeURIComponent(this.getAttribute('real_src') || this.src);
				nowImg = this;
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

		// Core.Events.addEvent(div1, function() {
		// 	var ttl = isArt ? '的《'+Core.Dom.byClz(document.body, 'h2', 'titName')[0].innerHTML+'》': "",
		// 		url = $_GLOBAL.qingURL+'blog/controllers/share.php?searchPics=0&content='
		// 		+ encodeURIComponent('分享'+nickName+ttl+'的博文图片，查看原文：')
		// 		+ "&url=" + encodeURIComponent(findLink(nowImg) || location.href)
		// 		+ "&ralateNick=" + encodeURIComponent("新浪博客")
		// 		+ '&pics=' + nowImgSrc;
		// 	window.open(url, 'shareQing', 'toolbar=0,status=0,resizable=1,width=600,height=520,left='
		// 		+ (screen.width-600)/2 + ',top=' + (screen.height-520)/2);
			
		// 	v7sendLog("80_01_02");
		// 	if (typeof SUDA != 'undefined') {
		// 		SUDA.uaTrack('blog_article', 'h_article20');
		// 	}
		// 	return false;
		// });
		Core.Events.addEvent(div2, function() {
				var f = 'http://v.t.sina.com.cn/share/share.php?',
				title = encodeURIComponent('分享' + nickName + '的博文图片：' + (isArt ? Core.Dom.byClz(document.body, 'h2', 'titName')[0].innerHTML: "")),
				r = "新浪-博客",
				l = 'http://blog.sina.com.cn',
				u = 'http://v.t.sina.com.cn/share/share.php?searchPic=false&title=' + title + "&url=" + encodeURIComponent(findLink(nowImg) || document.location) + '&source=' + r + '&sourceUrl=' + encodeURIComponent(l) + '&content=utf-8&appkey=1617465124&pic=' + nowImgSrc;
				window.open(u, 'mb', 'toolbar=0,status=0,resizable=1,width=440,height=430,left=' + (screen.width - 440) / 2 + ',top=' + (screen.height - 430) / 2);
				//guanghui2 分享到微博布码
				v7sendLog("80_01_09");
					if (typeof SUDA != 'undefined') {
					SUDA.uaTrack('blog_article', 'h_article21');
				}
				Core.Events.stopEvent();
		});

		function bindFn(img, attr) {
				//表情图片 不出现 分享链接
				if (! (img.getAttribute(attr) || "").indexOf("http://www.sinaimg.cn/uc/myshow/blog/misc/gif/E___") || !Core.Dom.contains(wrap, img)) {
						return;
				}
				getWrapLeft();
				image = new Image;
				Core.Events.addEvent(image, function() {
						if (this.width > 165 && this.height > 35) {
								Core.Events.addEvent(img, fnover.bind2(img), 'mouseover');
								Core.Events.addEvent(img, fnout.bind2(img), 'mouseout');
						}
				}.bind2(image), 'load');
				//图片完全加载 完全后绑定 分享 事件
				image.src = img.getAttribute(attr);
		}

		function getWrapLeft() {
				wrapLeft = Core.Dom.getXY(wrap)[0] + wrap.clientWidth;
		}

		Core.Events.addEvent(window, getWrapLeft, 'resize');

    if (pageid == "index" || pageid == "indexM" || pageid == 'article' || pageid == 'articleM' || pageid == 'article_new' || pageid == 'articleM_new') {
        foreach([$E('module_10001'), $E('module_10002'), $E('module_10003'),$E('module_920')], function(comp) {
            if (comp && comp.clientWidth > 500) {
                wrap = comp;
                bindWrapFn();
            }
        });
    }

		//找出当分享图片 所在博文的href
		function findLink(node) {
				if (isArt) {
						return;
				}
				var tagMore;
				while (node = node.parentNode) {
						if (node.className == "content" && node.nodeName == "DIV" && (tagMore = node.nextElementSibling || node.nextSibling).className == "tagMore") {
								return ($T(tagMore, 'a')[0] || {}).href || "";
						}
				}
		}

		function bindWrapFn() {
				fixAutoHover = 1;
				foreach($T(wrap, 'img'), function(img) {
						bindFn(img, 'src');
				});
		}

		//博客首页 博文列表组件 翻页后 图片分享
		if (Lib && Lib.Component["Comp_10001"]) {
				var _afterLoadList = Lib.Component["Comp_10001"].prototype.afterLoadList;
				Lib.Component["Comp_10001"].prototype.afterLoadList = function() {
						fixAutoHover = 0;
						shareConStyle.display = "none";
						_afterLoadList.apply(this, arguments);
						setTimeout(bindWrapFn, 100);
				};
		}

		scope.sharePhoto = {
				bindFn: bindFn
		};

});
