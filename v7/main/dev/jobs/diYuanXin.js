/**
 * @fileoverview 
 * 博客新布码,第三方的,缔元信的,博客部分页面引用了
 * @create 2013-07-01
 * @author Liu Xiaoyue | xiaoyue3@staff
 */

$import("lib/jobs.js");
$import("lib/diYuanXinLog.js");

$registJob("diYuanXin", function (){ 
    Lib.diYuanXinLog(function () {
        try{
            vjEventTrack(""); 
        }catch(e){
        }        
    });
});
