/**
    由于Date.UTC有8个小时的时差，所以这里重新写一个
    $import("sina/core/date/UTC.js");
*/
$import("sina/core/date/_date.js");

Core.Date.UTC = function(obj){
    var now = new Date();
    var t = new Date(obj.y||now.getFullYear(),
        typeof obj.M==='number'?obj.M:now.getMonth(), obj.d||now.getDate());
    //obj.y && t.setFullYear(obj.y);
    //obj.d && t.setDate(obj.d);
    //obj.M && t.setMonth(obj.M);
    typeof obj.h==='number' && t.setHours(obj.h);
    typeof obj.m==='number' && t.setMinutes(obj.m);
    typeof obj.s==='number' && t.setSeconds(obj.s);

    return +t;
};
