/**
 * @fileoverview 680，仅供首页使用
 * @author dcw1123 | chengwei1@staff.sina.com.cn
 * @created 2011-3
 * @modified  包窗广告修改 Modified by gaolei2@ 2013-12-10
 */


$import("lib/jobs.js");
$import("lib/execZhitou.js");
$import("jobs/680.js");
$import("article/ad/insertIns.js");

$registJob("680job", function(){
	Lib.execZhitou(function(res){
		 // 包窗广告修改
		 // Modified by gaolei2@ 2013-12-10
		var $adEl = blogAd.insertIns('PDPS000000051781');
		var popAd = blogAd.popAd();
		(window.sinaads || []).push({
			element: $adEl,
			params: {
				sinaads_success_handler: function(elem, data){
					var result;
					function sinaadsAdapter(saxData) {
						var result = {};
						if(data.content[0].src[0].replace(/(^\s*)|(\s*$)/g, "").length === 0) {
							result.isAD = false;
						} else {
							result = {
								isAD : true,
								flashURL:"http://d3.sina.com.cn/litong/kuaijieweibo/yafeng/boke/sc/bk.swf",
								flashWidth:293,
								flashHeight:60,
								picURL : saxData.content[0].src[0],
								clickUrl : saxData.content[0].link[0],
								borderImg:"http://d1.sina.com.cn/litong/kuaijieweibo/yafeng/boke/images/imgbgnn.gif",
								btnImg:"http://d1.sina.com.cn/201007/09/237719_btn.gif",
								logurls:saxData.content[0].monitor
							};
						}
						return result;
					};
					
					result = sinaadsAdapter(data);
					popAd.renderPopAd(result);

				},
				sinaads_fail_handler: function(elem, data){
					popAd.renderPopAd({isAD: false})
				}
			}
		});
	});
});


