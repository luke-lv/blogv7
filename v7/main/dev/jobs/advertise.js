/**
 * Copyright (c) 2008, Sina Inc. All rights reserved.
 * @fileoverview 根据 Conf 判断用户是否参与广告共享计划，如果有就写入 HTML 节点，并载入广告资源 JS
 * 由于广告是定向投放，即——即便加入了广告共享计划，也不一定会显示广告，所以写入节点后，仍然是由 Space 的 JS 来控制广告是否显示出来
 *
 * 流程：( Space 接口负责人：赵立元 分机：5155)
 * 1、读取 Conf，获得当前用户是否加入广告共享计划
 * 2、如果加入了，就引入 Space 广告渲染程序 JS ：http://spacejs.sinajs.cn/view/js/adwidget.js
 * 3、载入该 JS 完毕后，执行：adShare.init($uid, 'sinablog', 'SINABLOG'); ，广告加载剩余流程由 Space JS 完成。
 *
 * @author L.Ming
 * @modify xy xinyu@staff.sina.com.cn
 */
$import("sina/utils/io/jsload.js");
$import("sina/core/dom/insertAfter.js");
$import("other/sinaflash.js");
addAdvertise = function(){
	var adDiv = $E('blogads');
	if (scope.$pageid.indexOf('article') > -1) {
		if (adDiv != null) {
			var div2 = $C('div');
			div2.id = 'blogads2';
			div2.className = 'blogads2 borderc';
			div2.innerHTML = '<p><a href="javascript:;" id="adversite_bottom"></a></p><p class="SG_txtc">新浪广告共享计划</p>'
				+ ($isAdmin ? '<div class="manage SinaAd_mg2">' + '<a href="http://share.sass.sina.com.cn/widget_ad/index_out.php?done" class="SinaAd_linkcolor SinaAd_link" target="_blank">[管理]</a></div>' : '');
			div2.style.display = 'none';
			if(scope.$pn_x_rank && window.parseInt(scope.$pn_x_rank) == 0){
				if($E('nextprev_' + scope.$articleid)){									//节点存在再操作。过渡期，有两种 nextprev。2010.03.08.
					Core.Dom.insertAfter(div2, $E('nextprev_' + scope.$articleid));
				}else if($E("new_nextprev_" + scope.$articleid)){
					Core.Dom.insertAfter(div2, $E('new_nextprev_' + scope.$articleid));
				}
			}
		}
	}
    // 修改adwidget.js后，需要在此升级版本号，否则JS可能不会立即生效
	Utils.Io.JsLoad.request("http://sjs.sinajs.cn/blog7/adwidget.js?v1", {
		onComplete	:	function (){
			if (typeof adShare != 'undefined') {
				adShare.init(scope.$uid, 'sinablog', 'SINABLOG');
			}
		},
		noreturn	: true
        ,isRemove : false
	});
};
// 去掉博主首页和正文页上进行广告投放并进行分成的请求 zhihang1@2014-12-16
// addAdvertise2 = function(){
// 	var adDiv = $E('adps_person');
//     if (adDiv != null) {
// 		Utils.Io.JsLoad.request("http://ba.sass.sina.com.cn/front/blog/deliver?p1=" + scope.$uid + ",adps000001|adps000002", {
// 			onComplete	:	function (){
// 				var adps = $E('adps000001');
// 	            if (adps != null) {
// 					var divs = $T(adps, 'div');
// 					for (var i = 0, len =  divs.length; i < len; i ++) {
// 						if (divs[i].className == 'widgetconn') {
// 							adps.innerHTML = divs[i].innerHTML;
// 							adps.style.paddingTop = '10px';
// 							adDiv.style.display = '';
// 							break;
// 						}
// 					}
// 				}
// 			},
// 			noreturn	: true
// 		});
//     }
// };
$registJob("renderAd", function(){
	scope.$private.ad = scope.$private.ad || 0;
	if (scope.$private.ad > 0) {
//		trace("该用户有广告 类型1，开始载入数据。。。");
		addAdvertise();
		// addAdvertise2();
    }
});