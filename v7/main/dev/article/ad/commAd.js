/**
 * @fileoverview	博文页评论广告链接--除博主外所有访问者全覆盖，文字和链接由投放提供我们只提供投放框
 * @author			dcw1123 | chengwei1@staff.sina.com.cn
 * @modified       Qiangyee | wangqiang1@staff
 */
$import("lib/680/_blogAd.js");
$import("lib/templateUtils.js");
$import("lib/oop2.js");
$import("lib/checkAuthor.js");
$import("lib/commonLog.js");
$import("sina/utils/cookie/setCookie.js");
$import("sina/utils/cookie/getCookie.js");
$import("sina/core/dom/getElementsByClass.js");

blogAd.CommAd = function(oParam){
	Lib.checkAuthor();
	var articleBody, __tempNodes, i;
	var box1 = $E("commAd_1");
	var box2 = $E("commAd_2");
	if(!box1){
		trace("no id");
		articleBody = $E("articlebody");
		__tempNodes = articlebody.getElementsByTagName("strong");
		for(i=0; i<__tempNodes.length; i++){
			if(__tempNodes[i].innerHTML == "评论"){
				box1 = __tempNodes[i].parentNode.getElementsByTagName("span")[0];
			}else if(__tempNodes[i].innerHTML == "发评论"){
				box2 = __tempNodes[i].parentNode.getElementsByTagName("span")[0];
			}
		}
	}
	this.MARK_ID = 2;				// top 0,left 1,comment 2
	this.LIMITED = 24;
	var sinaTemp = [
	'<span style="margin-left:15px; width:220px; display:inline-block;">',
		'<a target="_blank" href="http://blog.sina.com.cn/lm/8/2009/0325/105340.html">重要提示：警惕虚假中奖信息</a>',
	'</span>'].join("");
	var adTemp = '<span style="display:inline-block;width:220px;white-space:nowrap;">#{link}</span>';
	var interTemp = '<span style="margin:0 60px 0 20px; display:inline-block;">|</span>';
	var ad1 = "";
	var ad2 = "";
	var ad3 = "", hasAd = false;
    
    // 博主跟一般人同样处理，此广告木有 ref 属性了，只要不是博主访问自己的博客就显示此广告
	if(!$isAdmin && oParam && (!(+oParam.code)) && oParam.ads){
		if(oParam.ads[0] && oParam.ads[0].link){
            hasAd = true;
			ad1 = this.formatTemplate(adTemp, {
				link:	oParam.ads[0].link
			});
			// 统计广告显示
			if(oParam.ads[0].status && oParam.ads[0].status.adstart)
			new Image().src = oParam.ads[0].status.adstart;
		}
		if(oParam.ads[1] && oParam.ads[1].link){
			hasAd = true;
            ad2 = this.formatTemplate(adTemp, {
				link:	oParam.ads[1].link
			});
			// 统计广告显示
			if(oParam.ads[1].status && oParam.ads[1].status.adstart)
			new Image().src = oParam.ads[1].status.adstart;
		}
		if(oParam.ads[2] && oParam.ads[2].link){
			hasAd = true;
            ad3 = this.formatTemplate(adTemp, {
				link:	oParam.ads[2].link
			});
			// 统计广告显示
			if(oParam.ads[2].status && oParam.ads[2].status.adstart)
			new Image().src = oParam.ads[2].status.adstart;
		}
		// 评论广告位由广告管理后台管理，不进行替换
        // if (box1){
        //     box1.innerHTML = sinaTemp + (ad1?(interTemp + ad1):"");
        // }
		// if (box2){
  //           box2.innerHTML = ad2 + (ad3?(interTemp + ad3):"");
  //       }
	}
    if (box1){
        box1.style.display = "inline-block";		// php 已输出一般文案
    }
    if (box2){
        box2.style.display = "inline-block";
    }

    //liming9-2012年7月18日 添加好耶代码统计
    //hasAd && trace(77777);
    hasAd && commonLog('http://1092.adsina.allyes.com/main/adfshow?user=AFP6_for_SINA|2012_add|2012_blog_tjbw_plq_wzl&db=sina&border=0&local=yes&js=ie');
	
}.$defineProto({
}).$mixProto(Lib.templateUtils);
