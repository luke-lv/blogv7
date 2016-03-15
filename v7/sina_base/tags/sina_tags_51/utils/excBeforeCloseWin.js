/**
 * @fileoverview 在关闭浏览器或页签时会提示用户，确定则执行传入的函数
 * 				 当什么参数都不传入的时候，直接执行系统的提示框
 *
 * @param function func 需要执行的函数
 * @param string tips1 当采用系统关闭浏览器的提示框时需要的文案，可以为''
 * @param string tips2 当采用系统confrim框时需要的提示文案
 * @param anytype args 可有可无
 * @author xy xinyu@staff.sina.com.cn
 * @date 2009-09-11
 * @example
 * 				Utils.excBeforeCloseWin('','是否保存？',funcs);
 * 				Utils.excBeforeCloseWin('离开页面导致数据丢失！');
 */
$import("sina/utils/utils.js");
$import("sina/core/function/bind3.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/stopBubble.js");
$import("sina/core/events/stopDefaultEvent.js");

Utils.excBeforeCloseWin = function(tips1, tips2, func, args){
    closeVar = {};
    closeVar.func = func;
    closeVar.tips1 = tips1;
    closeVar.tips2 = tips2;
    closeVar.args = args;
    closeVar.length = arguments.length;
    window.beforeunloadfunc = function(){
        if (closeVar.length == 1) {
            return closeVar.tips1;
            Core.Events.stopEvent();
        }
        else {
            if ($IE) {
                var e = Core.Events.fixEvent(Core.Events.getEvent());
                if (e.clientY < 0 || e.altKey) {
                    if (confirm(closeVar.tips2)) {
                        if (closeVar.args) 
                            Core.Function.bind3(closeVar.func, closeVar.func, [closeVar.args])();
                        else 
                            closeVar.func();
                    }
                    else {
                        //用户已经通过confrim框选择了取消，则不再有系统提示框
                    }
                }
            }
            else {
                function func(value){
                    if (value == true) {
                        if (closeVar.args) 
                            Core.Function.bind3(closeVar.func, closeVar.func, [closeVar.args])();
                        else 
                            closeVar.func();
                    }
                    else {
                        //用户已经通过confrim框选择了取消，则不再有系统提示框
                    }
                }
                return func.call(this, confirm(closeVar.tips2));
            }
        }
        
    };
    Core.Events.addEvent(window, beforeunloadfunc,'beforeunload');

};
