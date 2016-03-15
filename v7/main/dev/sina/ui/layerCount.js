$import("sina/ui/ui.js");
/**
 * @fileoverview 浮层zIndex，模式窗口需要覆盖原来的浮层,
    因此需要动态技算z-index的值
 * @create 2012-08-28
 * @author Qiangyee | wangqiang1@staff
 */
Ui.LayerCount = (function(){
    var zIndex = 500;
    var modeIndex = 1024;
    return function(type){
        if ("mode" === type) {
            return modeIndex;
        } else {
            zIndex += 24;
        }
        
        return zIndex > modeIndex ? modeIndex-50 : zIndex;
    }
})();