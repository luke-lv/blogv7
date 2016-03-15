/**
 * @fileoverview 广告suda布码
 * @author jiangwei5@staff.sina.com.cn
 * @date 
 */

$import("lib/sendLog.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/dom/getElementsByAttr.js");
$import("sina/core/dom/getChildrenByClass.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/core/system/getParam.js");

$registJob("articleTj_suda", function (){
    if(Core.System.getParam('tj') != 'fina') return;

	var addEvent = Core.Events.addEvent;
    var getElementsByAttr = Core.Dom.getElementsByAttr;
    var getChildrenByClass = Core.Dom.getChildrenByClass;
    var insertHTML = Core.Dom.insertHTML;

    var rEl = $E('ad_tmp_ztjb');
    var adEl = getElementsByAttr(rEl, 'data-suda', 'art_tj_da')[0];

    var startDate = new Date('2015/04/20').getTime();
    var endDate = new Date('2015/04/25').getTime();

    var startDate2 = new Date('2015/05/04').getTime();
    var endDate2 = new Date('2015/05/09').getTime();
    var currDate = new Date().getTime();
    
    if((currDate > startDate && currDate < endDate) || (currDate > startDate2 && currDate < endDate2)){
        adEl.innerHTML = '今日解密：敢死队突击涨停技巧 免费学习';
        rEl.style.display = "block";
		addEvent(adEl, function(){
			v7sendLog('15_04_12');
		});
    }

    //广告修改 20150601
    if(rEl){
        var adEls = getChildrenByClass(rEl.parentNode, 'into_bloger_ad');
        // var rEl2Html = '<a href="http://jyzd.sina.com/?frm=gupiao_wzy_20150601" target="_blank">新浪微操盘，你出策略，他来投，收益八二开，赶快注册成为点买人吧! </a>';
        if(adEls.length > 1){
            //下线此广告 20150909@zhihang1
            adEls[1].parentNode.removeChild(adEls[1]);
        }
        // else{
        //     insertHTML(rEl, '<div class="into_bloger_ad">' + rEl2Html + '</div>', 'afterend');
        // }
    }
});
