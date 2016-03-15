/**
 * @fileoverview 文章页点击地图suda布码
 *
 * @create 2014-03-31
 * @author yifei2@staff
 */

$import("sina/sina.js");
$import("sina/core/events/addEvent.js");

$registJob("articleSuda", function(){
	var __addEvent = Core.Events.addEvent;
	var __getByClass = Core.Dom.getElementsByClass;
	var __byClass = Core.Dom.byClass;
	var __getByAttr = Core.Dom.getElementsByAttr;
	// 发送suda
	function sudaTrack(value) {
		if (typeof SUDA != 'undefined') {
			SUDA.uaTrack('blog_article', value);
		}
	}

	/*** 头图区域 ***/
	// 博客名称
	var elBlogName = __getByClass($E('blogname'), 'a', '')[0];
	// 博客地址
	var elBlogLink = __getByClass($E('bloglink'), 'a', '')[0];
	// 订阅
	var elSubScribe = $E('SubscribeNewRss');
	// 手机订阅
	var elSubScribeMobile = __getByClass($E('bloglink'), 'a', 'CP_a_fuc')[1];
	// 首页
	var elHeadHomeLink = __getByClass(__byClass('blognavInfo')[0], 'a', '')[0];
	// 博文目录
	var elHeadListLink = __getByClass(__byClass('blognavInfo')[0], 'a', 'on')[0];
	// 图片
	var elHeadPicLink = __getByClass(__byClass('blognavInfo')[0], 'a', '')[1];
	// 关于我
	var elHeadAboutLink = __getByClass(__byClass('blognavInfo')[0], 'a', '')[2];

	__addEvent(elBlogName, function(e){
		Core.Events.stopDefaultEvent(e);
		var targetHref = elBlogName.getAttribute('href');
		sudaTrack('h_article0');
		window.setTimeout(function(){
			window.location.href = targetHref;
		}, 500);
	}, 'click');
	__addEvent(elBlogLink, function(e){
		Core.Events.stopDefaultEvent(e);
		var targetHref = elBlogLink.getAttribute('href');
		sudaTrack('h_article1');
		window.setTimeout(function(){
			window.location.href = targetHref;
		}, 500);
	}, 'click');
	__addEvent(elSubScribe, function(e){
		sudaTrack('h_article2');
	}, 'click');
	__addEvent(elSubScribeMobile, function(e){
		Core.Events.stopDefaultEvent(e);
		var targetHref = elSubScribeMobile.getAttribute('href');
		sudaTrack('h_article3');
		window.setTimeout(function(){
			window.location.href = targetHref;
		}, 500);
	}, 'click');
	__addEvent(elHeadHomeLink, function(e){
		Core.Events.stopDefaultEvent(e);
		var targetHref = elHeadHomeLink.getAttribute('href');
		sudaTrack('h_article4');
		window.setTimeout(function(){
			window.location.href = targetHref;
		}, 500);
	}, 'click');
	__addEvent(elHeadListLink, function(e){
		Core.Events.stopDefaultEvent(e);
		var targetHref = elHeadListLink.getAttribute('href');
		sudaTrack('h_article5');
		window.setTimeout(function(){
			window.location.href = targetHref;
		}, 500);
	}, 'click');
	__addEvent(elHeadPicLink, function(e){
		Core.Events.stopDefaultEvent(e);
		var targetHref = elHeadPicLink.getAttribute('href');
		sudaTrack('h_article6');
		window.setTimeout(function(){
			window.location.href = targetHref;
		}, 500);
	}, 'click');
	__addEvent(elHeadAboutLink, function(e){
		Core.Events.stopDefaultEvent(e);
		var targetHref = elHeadAboutLink.getAttribute('href');
		sudaTrack('h_article7');
		window.setTimeout(function(){
			window.location.href = targetHref;
		}, 500);
	}, 'click');


	/*** 个人资料 ***/
	// 勋章
	var elHeadLink = __getByClass($E('comp_901_head'), 'a', '')[0];
	// Qing
	var elQingBtn = __getByClass(__byClass('info_btn1')[0], 'a', 'SG_aBtn SG_aBtn_ico')[0];
	// 微博
	var elWeiboBtn = __getByClass(__byClass('info_btn1')[0], 'a', 'SG_aBtn SG_aBtn_ico')[1];
	// 加好友
	var elInviteBtn = $E('comp901_btn_invite');
	// 发纸条
	var elPaperBtn = $E('comp901_btn_sendpaper');
	// 写留言
	var elMsgInfo = $E('comp901_btn_msninfo');
	// 加关注
	var elFollowBtn = $E('comp901_btn_follow');

	__addEvent(elHeadLink, function(e){
		sudaTrack('h_article8');
	}, 'click');
	__addEvent(elQingBtn, function(e){
		sudaTrack('h_article9');
	}, 'click');
	__addEvent(elWeiboBtn, function(e){
		sudaTrack('h_article10');
	}, 'click');
	__addEvent(elInviteBtn, function(e){
		sudaTrack('h_article11');
	}, 'click');
	__addEvent(elPaperBtn, function(e){
		sudaTrack('h_article12');
	}, 'click');
	__addEvent(elMsgInfo, function(e){
		Core.Events.stopDefaultEvent(e);
		var targetHref = elMsgInfo.getAttribute('href');
		sudaTrack('h_article13');
		window.setTimeout(function(){
			window.location.href = targetHref;
		}, 500);
	}, 'click');
	__addEvent(elFollowBtn, function(e){
		sudaTrack('h_article14');
	}, 'click');


	/*** 正文上部 ***/
	// 推荐标记
	var elTjIcon = __getByClass(__byClass('articalTitle')[0], 'a', '')[0];
	// 标签
	var elTagsLink = __getByClass($E('sina_keyword_ad_area'), 'a', '');
	
	__addEvent(elTjIcon, function(e){
		sudaTrack('h_article15');
	}, 'click');
	if(elTagsLink && elTagsLink.length) {
		for(var i=0; i<elTagsLink.length; i++) {
			__addEvent(elTagsLink[i], function(e){
				sudaTrack('h_article18');
			}, 'click');
		}
	}


	/*** 正文下 ***/
	// 分享
	var elShareWeimi = $E('shareweimi');
	var elShareQing = $E('shareqing');
	var elShareMail = $E('sharemail');
	var elShareWeibo = __byClass('bshare-sinaminiblog')[0];
	var elShareWeixin = __byClass('bshare-weixin')[0];
	var elShareQQim = __byClass('bshare-qqim')[0];
	var elShareRenren = __byClass('bshare-renren')[0];
	var elShareQzone = __byClass('bshare-qzone')[0];
	var elShareDouban = __byClass('bshare-douban')[0];
	var elShareMore = __byClass('bshare-more bshare-more-icon more-style-addthis')[0];
	// 评论
	var elCommentLink = __getByClass(__byClass('IL')[0], 'a', '')[0];
	// 收藏
	var elCollectLink = __getByClass(__byClass('IL')[0], 'a', '')[1];
	// 转载
	var elQuoteLink = $E('quote_set_sign');
	// 喜欢
	var elLikeLink = $E('d1_digg_' + scope.$articleid);
	// 打印
	var elPrintLink = __getByClass(__byClass('IL')[0], 'a', '')[5];
	// 举报
	var elReportLink = __getByClass(__byClass('IL')[0], 'a', '')[6];
	// 排行榜
	var elRankLink = __getByClass(__byClass('IR_list')[0], 'a', 'SG_linkb')[0];
	// 圈子
	var elCircleLink = __getByClass(__byClass('IR_list')[0], 'a', 'SG_linkb')[1];
	// 喜欢（方框）
	var elLikeBox = $E('dbox_' + scope.$articleid).parentNode;
	// 前一篇
	var elPrevBlogLink = __getByClass($E('new_nextprev_' + scope.$articleid), 'a', '')[0];
	// 后一篇
	var elNextBlogLink = __getByClass($E('new_nextprev_' + scope.$articleid), 'a', '')[1];

	__addEvent(elShareWeimi, function(e){
		sudaTrack('h_article22');
	}, 'click');
	__addEvent(elShareQing, function(e){
		sudaTrack('h_article22');
	}, 'click');
	__addEvent(elShareMail, function(e){
		sudaTrack('h_article22');
	}, 'click');
	__addEvent(elShareWeibo, function(e){
		sudaTrack('h_article22');
	}, 'click');
	__addEvent(elShareWeixin, function(e){
		sudaTrack('h_article22');
	}, 'click');
	__addEvent(elShareQQim, function(e){
		sudaTrack('h_article22');
	}, 'click');
	__addEvent(elShareRenren, function(e){
		sudaTrack('h_article22');
	}, 'click');
	__addEvent(elShareQzone, function(e){
		sudaTrack('h_article22');
	}, 'click');
	__addEvent(elShareDouban, function(e){
		sudaTrack('h_article22');
	}, 'click');
	__addEvent(elShareMore, function(e){
		sudaTrack('h_article22');
	}, 'click');
	__addEvent(elCommentLink, function(e){
		sudaTrack('h_article23');
	}, 'click');
	__addEvent(elCollectLink, function(e){
		sudaTrack('h_article24');
	}, 'click');
	__addEvent(elQuoteLink, function(e){
		sudaTrack('h_article25');
	}, 'click');
	__addEvent(elLikeLink, function(e){
		sudaTrack('h_article26');
	}, 'click');
	__addEvent(elPrintLink, function(e){
		sudaTrack('h_article27');
	}, 'click');
	__addEvent(elReportLink, function(e){
		sudaTrack('h_article28');
	}, 'click');
	__addEvent(elRankLink, function(e){
		sudaTrack('h_article29');
	}, 'click');
	__addEvent(elCircleLink, function(e){
		sudaTrack('h_article30');
	}, 'click');
	__addEvent(elLikeBox, function(e){
		sudaTrack('h_article31');
	}, 'click');
	__addEvent(elPrevBlogLink, function(e){
		Core.Events.stopDefaultEvent(e);
		var targetHref = elPrevBlogLink.getAttribute('href');
		sudaTrack('h_article32');
		window.setTimeout(function(){
			window.location.href = targetHref;
		}, 500);
	}, 'click');
	__addEvent(elNextBlogLink, function(e){
		Core.Events.stopDefaultEvent(e);
		var targetHref = elNextBlogLink.getAttribute('href');
		sudaTrack('h_article33');
		window.setTimeout(function(){
			window.location.href = targetHref;
		}, 500);
	}, 'click');

	

	/*** 评论区 ***/
	// 评论第一个文字链
	var elCommentWords1 = __getByClass($E('commAd_1'), 'a', '')[0];
	// 发评论链接
	var elCommentPostLink = __getByAttr($E('articlebody'), 'href', '#post')[0];
	
	__addEvent(elCommentWords1, function(e){
		sudaTrack('h_article34');
	}, 'click');
	__addEvent(elCommentPostLink, function(e){
		sudaTrack('h_article36');
	}, 'click');


	/*** 发评论区 ***/
	var elCommentPostBtn = $E('postcommentid');
	var elComPrevBlogLink = __getByClass(__byClass('articalfrontback articalfrontback2 clearfix')[0], 'a', '')[0];
	var elComNextBlogLink = __getByClass(__byClass('articalfrontback articalfrontback2 clearfix')[0], 'a', '')[1];

	__addEvent(elCommentPostBtn, function(e){
		sudaTrack('h_article46');
	}, 'click');
	__addEvent(elComPrevBlogLink, function(e){
		Core.Events.stopDefaultEvent(e);
		var targetHref = elComPrevBlogLink.getAttribute('href');
		sudaTrack('h_article47');
		window.setTimeout(function(){
			window.location.href = targetHref;
		}, 500);
	}, 'click');
	__addEvent(elComNextBlogLink, function(e){
		Core.Events.stopDefaultEvent(e);
		var targetHref = elComNextBlogLink.getAttribute('href');
		sudaTrack('h_article48');
		window.setTimeout(function(){
			window.location.href = targetHref;
		}, 500);
	}, 'click');


	
});