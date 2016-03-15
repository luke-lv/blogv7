/**
 * @fileoverview 组件 文章页 相关博文
 * @author stan | chaoliang@staff.sina.com.cn
 * @modified dcw1123 | chengwei1@staff.sina.com.cn
 */
$import("lib/component/class/registComp.js");
$import("lib/component/extend/comp_dynamic.js");
$import("sina/core/function/bind2.js");
$import("sina/core/events/addEvent.js");
$import("sina/utils/io/ijax.js");
$import("sina/utils/io/ajax.js");
$import("lib/sendLog.js");

/**
 * 增加判断浏览器类型的函数，暴露到scope上，供他人使用
 * 随时会下掉 2012-11-16
 * 规则：高级浏览器有约50%的可能执行回调函数，50%直接跳转；其他浏览器直接跳转
 * modify 2012-11-22 领导说下线，暂时注释，没准儿啥时候就上线了

 if (window.scope){
	// var ua = navigator.userAgent.toLowerCase();
	scope.preventA = function(obj, otherUrl){

		if ($OPERA || $SAFARI || $CHROME || $FF){
			var random = Math.ceil(Math.random()*100);
			var href = obj && obj.href;
			var target = obj && obj.target && (obj.target == "_blank");
			if (random%2 === 0){
				otherUrl && gotoPage(otherUrl, target);
			}else{
				gotoPage(href, target);
			}
		}else{
			gotoPage(href, target);
		}
		
		return false;
	}
	
	function gotoPage(url, target){
		var referLink = document.createElement('a');
		referLink.href = url;
		if (target){
			referLink.target = "_blank"
		}
		document.body.appendChild(referLink);
		
		if ($IE){
			referLink.click();  
		} else {
			var evt;
			if(/Mobile/i.test(navigator.userAgent)){
				evt = document.createEvent('HTMLEvents');
			}else{
				evt = document.createEvent('MouseEvents');
			}
			evt.initEvent("click",true,true);
			referLink.dispatchEvent(evt);  
		}

		setTimeout(function(){
			document.body.removeChild(referLink);
		}, 30);
	}
}

 if ($OPERA || $SAFARI || $CHROME || $FF){
	var temp = $E("module_903") && $E("module_903").getElementsByTagName("li")[0];
	temp = temp && temp.getElementsByTagName("a")[0];

	if (temp && temp.href === "http://blog.sina.com.cn/s/blog_49ba2b940102dy7d.html?tj=1"){
		temp.onclick = function(){
			v7sendLog('69_01_09');
			scope.preventA && scope.preventA(this, 'http://blog.sina.com.cn/lm/iframe/229/2012/1120/18.html');
			return false;
		}
	}
}
 */
$registComp(903, {
    load: function () {
        //下线相关博文组件布玛 @modified xiaoyue3
        // v7sendLog('45_01_20_' + scope.$uid);
        // if((scope.$pageid === "articleM" || scope.$pageid === "article") && $E("module_903")){
        // 	Core.Events.addEvent($E("module_903"),function(event){
        // 		var target= (event && event.target) || (window.event && window.event.srcElement);
        //         if(target && target.tagName && target.tagName.toLowerCase() == 'a'){
        //         	v7sendLog('45_01_01');
        //         }
        // 	});
        // }
        if ($E("atcPicList")) {
            this.loadPicture_new();
        } else {
            this.loadArticle();
        }
    },
    loadArticle: function () {
        //测试
        //var $tag = '杂谈';
        //var $tag_code = '475e351841a0da840987bbef3f1c7f14';
        var _tagcode = (typeof $tag_code != "undefined") ? $tag_code : "";
        Utils.Io.Ijax.request("http://tag.blog.sina.com.cn/tag/tag_walist_v7.php", {
            GET: {
                blog_id: scope.$articleid,
                tag: encodeURI($tag),
                tag_code: _tagcode
            },
            onComplete: function (data) {
                this.loadPicture('<div class="atcTitList relaList">' + data + "</div>");
            }.bind2(this),
            onException: function () {
            }
        });
    },
    loadPicture: function (sResult) {
        var _pic_url = "http://blog.sina.com.cn/lm/iframe/article/sort_" + this.articleCate[scope.$sort_id] + "_" + Math.ceil(Math.random() * 3) + "_v7.html";
        Utils.Io.Ajax.request(_pic_url, {
            onComplete: function (data) {
                // Modified by L.Ming @2009.10.22 如果返回的推荐图片列表为空，就替换为空字符串
                var noPicture = /<ul>\s+<\/ul>/i.test(data);
                this.getContent().innerHTML = sResult.replace(/<!-- relative_pic_blog-->/, noPicture ? "" : data);
            }.bind2(this), onException: function () {
            }
        });
    },
    loadPicture_new: function (sResult) {
        var _pic_url = "http://blog.sina.com.cn/lm/iframe/article/sort_" + this.articleCate[scope.$sort_id] + "_" + Math.ceil(Math.random() * 3) + "_v7.html";
        Utils.Io.Ajax.request(_pic_url, {
            onComplete: function (data) {
                var picList = $E("atcPicList");
                picList.innerHTML = data;
            }.bind2(this), onException: function () {
            }
        });
    },
    /**
     * 投稿分类和运营分类对应表，前面是发表文章的投稿分类
     */
    articleCate: {
        "105": "105",
        "102": "117",
        "104": "104",
        "149": "149",
        "113": "113",
        "153": "117",
        "111": "117",
        "152": "122",
        "122": "122",
        "131": "131",
        "127": "108",
        "134": "149",
        "145": "108",
        "108": "108",
        "130": "130",
        "116": "116",
        "129": "129",
        "136": "129",
        "125": "125",
        "141": "108",
        "118": "118",
        "117": "117"
    }
}, 'dymanic');