/**
 * @desc	百合分享浮层模板
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("comps/baihe/_baihe.js");

Baihe.shareTemplate = [
'<div class="bh_login" id="#{entity}">',
	'<h3 id="#{titleBar}">邀请好友<a href="#" class="close_pop" id="#{btnCls}" onclick="return false;">关闭</a></h3>',
	'<div class="bh_share_form" id="#{content}">',
		'<p class="share_fr" style="margin-bottom:10px;">分享到微博、分享到博客<br/>可分别获得 2 次抽奖机会！</p>',
		'<p class="share_sinablog"><a href="#" class="share_sina" id="#{share2tblog}">分享给微博好友</a></p>',
		'<p class="share_blog"><a href="#" class="share_b" id="#{share2blog}" onclick="return false;">分享给博客好友</a></p>',
	'</div>',
	'<div class="clearit"></div>',
'</div>'].join("");


