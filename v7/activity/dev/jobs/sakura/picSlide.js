 /*
 * @fileoverview 樱花页面图片轮播效果
 * @author gaolei | gaolei2@
 * @date   2015-3-9
 */
$import("lib/jobs.js");
$import("comps/switchable.js");

$registJob('picSlide', function(){

    var Slide = $('#slide').switchable({
        triggersWrapCls: 'rslides_point',
        currentTriggerCls: 'cur',
        triggers: '<a href="javascript:;" onclick="v7sendLog&&v7sendLog(\'10_01_32\')"></a>',
        panels: 'li',
        initIndex: 0, // display the first panel
        effect: 'scrollLeft', // taking effect when autoplay == true
        easing: 'cubic-bezier(.455, .03, .515, .955)', // equal to 'easeInOutQuad'
        end2end: true, // if set to true, loop == true
        autoplay: true,
        interval: 5,
        api: true // if set to true, Switchable returns API
    });
});