$import('sina/core/dom/insertHTML.js');

/**
 * @fileoverview 推荐fina页面广告
 *
 * @create 2015-08-26
 * @author zhihang1
 */
$registJob("tjFinaAd", function(){
	var target = $E('ad_tmp_ztjb');
	var tpl = '\
		<div class="info_blogpic_ad">\
				<a href="http://finance.sina.com.cn/mobile/comfinanceweb.shtml" target="_blank">\
					<img src="http://simg.sinajs.cn/blog7style/images/blog_editor/cj_ad.png" />\
				</a>\
		</div>';
	var now = (new Date()).getTime();
	var dest = (new Date(2015,11,31,23,59,59)).getTime();
	if(target && now <= dest){
		Core.Dom.insertHTML(target, tpl, 'beforebegin');
	}
});