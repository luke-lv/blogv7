$import("sina/sina.js");
$import("sina/core/events/addEvent.js");
$registJob("article_10years_suda", function () {
    var md = $E('module_920') || $E('module_10001'); 
    Core.Events.addEvent(md, function(evt){
        if(evt.target && evt.target.tagName === 'A' && evt.target.href == 'http://blog.sina.com.cn/lm/ten') {
            v7sendLog('15_04_17_' + scope.$uid);
        }
    }); 
});
