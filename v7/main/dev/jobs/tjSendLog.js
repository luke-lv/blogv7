/**
 * @fileoverview 描述这个文件是干什么的
 *
 * @author  作者
 * @create  日期
 */
$import("sina/core/events/addEvent.js");
$import("sina/core/events/getEventTarget.js");
$import("lib/sendLog.js");

$registJob('tjSendLog', function (){
    var __addEvent  = Core.Events.addEvent,
        __getTarget = Core.Events.getEventTarget;
    
    var getTarget = function(e){
        var el = __getTarget(e);
        if ('A' === el.nodeName.toUpperCase() || 'A' === el.parentNode.nodeName.toUpperCase()){
            return el;
        }
        return null;
    };

    __addEvent($E('module_909'), function(e){
        if (getTarget(e)){
            v7sendLog('49_01_01');
        }
    });
    __addEvent($E('module_903'), function(e){
        if (getTarget(e)){
            v7sendLog('49_01_02');
        }
    });
    __addEvent($E('atcPicList'), function(e){
        if (getTarget(e)){
            v7sendLog('49_01_04');
        }
    });

    __addEvent($E('module_940'), function(e){
        if (getTarget(e)){
            v7sendLog('49_01_50');
        }
    });
    
    (function(){
        var tjArticleEl = $E('atcPicList').parentNode;
        var linksEl = $T(tjArticleEl, 'ul')[0];
        __addEvent(linksEl, function(e){
            if (getTarget(e)){
                v7sendLog('49_01_03');
            }
        });
        tjArticleEl = null;
        linksEl = null;
    })();
    __addEvent($E('module_950'), function(e){
        if (getTarget(e)){
            v7sendLog('49_01_05');
        }
    });
});