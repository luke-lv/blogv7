$import("sina/core/events/addEvent.js");
$import("lib/sendLog.js");
scope.logSystem = function (attr) {
    var thisAttr = attr || 'logmsg';
    Core.Events.addEvent(document, function(e) {
        var ele =e ? e : window.event;
        var target = e.target ? e.target : e.srcElement;
        while(target != document) {
            if(target.getAttribute(thisAttr)) {
                v7sendLog(target.getAttribute(thisAttr));

                break;
            } else {
                target = target.parentNode;
            };
        };
    });
};