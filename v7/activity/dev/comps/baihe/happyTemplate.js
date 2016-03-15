/**
 * @desc	百合分享浮层模板
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("comps/baihe/_baihe.js");


Baihe.gladTemplate = [
'<div class="bh_login" id="#{entity}">',
	'<h3 id="#{titleBar}">中奖提示<a href="#" class="close_pop" id="#{btnCls}" onclick="return false;">关闭</a></h3>',
	'<div class="add_testimonial no_prize" id="#{content}">',
		'<p>华丽丽的浮云飘过~~啥也没带走！</p>',
		'<p><strong>BUT</strong>，百合网送你—— <br/><b>2 颗百合红豆</b>，寻爱更给力！</p>',
		'<p class="get_hongdou"><a id="#{redirBtn}" href="#" target="_blank">快来领取吧~~</a></p>',
	'</div>',
'</div>'].join("");


Baihe.happyTemplate = [
'<div class="testimonial" id="#{entity}">',
	'<h3 id="#{titleBar}">中奖提示<a href="#" class="close_pop" id="#{btnCls}" onclick="return false;">关闭</a></h3>',
	'<div class="add_testimonial" id="#{content}">',
		'<p><b>恭喜你中大奖啦！</b></p>',
		'<p>奖品是<strong id="#{awardName}"></strong></p>',
		'<div class="edit_testimonial">来几句给力的获奖感言吧，HOHO~~',
			'<form>',
				'<textarea class="ganyan" id="#{happyWords}"></textarea>',
				'<div class="clearit"></div>',
				'<span id="#{remain}">剩 40 字</span>',
				'<p>',
					'<input type="button" class="bh_reedit" value="重写" id="#{rewrite}"/>',
					'<input type="button" class="bh_submit" value="我要提交" id="#{ok}"/>',
				'</p>',
			'</form>',
		'</div>',
		'<div class="clearit"></div>',
	'</div>',
'</div>'].join("");


