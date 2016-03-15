/**
 * @author darkty2009
 */
$import("lib/jobs.js");
$import("jobs/checkAccount.js");
$import("jobs/tray.js");
$import("jobs/index.js");
// $import("jobs/addAttention.js");
//$import("jobs/write.js");
$import("jobs/Comp_render_push.js");
$import("jobs/Comp_clone.js");
$import("jobs/insertDynaMoban.js");
// $import("jobs/modifyTitle.js");
// $import("jobs/addWeibo.js");
$import("jobs/templateClone.js");
$import("jobs/modify_tip.js");
$import("jobs/temp_module_bind.js");
$import("lib/component/deleteVisitByUid.js");
// $import("jobs/diggerAction.js");
// $import("jobs/clickMore.js");
//$import("jobs/quick_sendArticle.js");
// $import("jobs/fackSend.js");
//$import("jobs/dynaRecomm.js");
// $import("jobs/feedMenu.js");
// $import("jobs/cancelAttention.js");
// $import("jobs/friendlist.js");
// $import("jobs/digger.js");
// $import("jobs/blogRadio.js");
$import("jobs/baby_headPhoto.js");
// $import("jobs/createHideTab.js");
//官博新动态
// $import("jobs/guanboFeed.js");
//个人中心改版后用户引导
$import("jobs/profileUserGuide.js");
$import("jobs/delAttentionTags.js");
//21010广州亚运会投票
//$import("jobs/gz2010.js");
//功能引导
//$import("jobs/userGuide.js");
//msn搬家引导
//$import("jobs/msnGuide.js");

//增加测试统计
// $import("jobs/zoneStatic.js");
//群博客推广
//$import("jobs/promoteBlog7Crowd.js");
//$import("jobs/rightBusinessNews.js");
//推广链接广告
$import("jobs/trayTipsAd.js");
$import("jobs/errorTips.js");
$import("jobs/attenBlogerRank.js");

//$import("jobs/mojie/feed.js");
//$import("jobs/mojie/checkNewFeed.js");
$import("jobs/mojie/pages.js");
$import("jobs/mojie/dragTag.js");
$import("jobs/mojie/goToTop.js");
//$import("jobs/mojie/feedType.js");
$import("jobs/loginStatus.js");
$import("jobs/suda.js");
$import("lib/sendLog.js");

//uatrack布码
$import("jobs/uatrack.js");
$import("jobs/blogAppAd.js");

//积分消费推广
$import("jobs/pointsAdInsert.js");

if(window!=parent){parent.location.href=window.location.href;} //防止发布页被iframe
function main() {
	v7sendLog('42_01_13');
	var job = new Jobs();
    job.add("checkAccount");
	job.add("tray");
	job.add("suda");
    job.add("trayTipsAd");
    job.add("loginStatus");

    job.add("pointsAdInsert");
    //mojie
			    // job.add("feed");
			    // job.add("checkNewFeed");
    job.add("pages");
    job.add("dragTag");
    // job.add("guanboFeed");
    job.add("goToTop");
    			// job.add("feedType");

	// job.add("cancelAttention");
	// job.add("friendlist");
	// job.add("digger");
	// job.add("diggerAction");
	// job.add("feedMenu");
	// job.add("clickMore");
//	job.add("quick_sendArticle");
	job.add("index");
	// job.add('modifytitle',3);
				//job.add("dynaRecomm");
	// job.add("addAttention");
				// job.add("write");
	job.add("render_push");
	job.add("insertDynaMoban");
	// job.add("addWeibo");

	//个人中心改版后用户引导
	job.add("profileUserGuide");
	//个人中心改版后取消关注标签
	job.add("delAttentionTags");
	job.add("attenBlogerRank");

	job.add("templateClone", 3);
	job.add("modify_tip");
	job.add("moduleBind");
	// job.add("fackSend");
	// job.add("blogRadio");
	// job.add("createHideTab");
	job.add("errorTips");
	
	//育儿博客相框头图
	job.add("baby_headPhoto");
	
	//21010广州亚运会投票
//	job.add("gz2010");
	//功能引导
	//job.add("userGuide");
	
	//msn搬家引导
	//job.add("msnGuide");
	
	//增加测试统计
	// job.add("toZoneStatic",3);
	
	//增加群博客推广
//	job.add("promoteBlog7Crowd",2);
//    job.add("rightBusinessNews",2);

	job.add("uatrack");
	job.add("blogAppAd");
	
	job.start();
}