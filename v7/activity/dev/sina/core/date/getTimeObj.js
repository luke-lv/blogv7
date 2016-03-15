$import("sina/core/date/_date.js");
Core.Date.getTimeObj = function(timestamp){
    var t = timestamp && new Date(timestamp) || new Date();
    var M = t.getMonth()+1,
        d = t.getDate(),
        h = t.getHours(),
        m = t.getMinutes(),
        s = t.getSeconds();

    return {
        yy: t.getFullYear(),
        MM: M>9 ? M : '0'+M,
        dd: d>9 ? d : '0'+d,
        hh: h>9 ? h : '0'+h,
        mm: m>9 ? m : '0'+m,
        ss: s>9 ? s : '0'+s
    };
};
