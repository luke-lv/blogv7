$import("sina/core/events/_events.js");
/**
 * @fileoverview 模拟点击事件
 *
 * @create 2012-12-13
 * @author Qiangyee
 */
;Core.Events.click = (function(){
    var isMobile = /mobile/i.test(navigator.userAgent);
    if ($IE && $IE < 9) {
        return function(clickBtn){
            clickBtn.click();  
        }
    } else {
        return function(clickBtn){
            var evt;
            if(isMobile){
                evt = document.createEvent('HTMLEvents');
            }else{
                evt = document.createEvent('MouseEvents');
            }
            evt.initEvent("click",true,true);
            clickBtn.dispatchEvent(evt);  
        }
    }
})();
