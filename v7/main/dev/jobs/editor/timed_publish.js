/** 
 * @fileoverview 定时发布文章，设置时间
 * @author Book | liming9@staff.sina.com.cn
 * @version 1 | 2012-07-24
 */
$import("lib/jobs.js");
$import("lib/dialogConfig.js");
$import("lib/sendLog.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/function/bind3.js");
$import("sina/core/string/trim.js");
$import("mojie/setTimeDialog.js");
$import("sina/core/date/getTimeObj.js");
$import("sina/core/date/UTC.js");

$registJob("timed_publish", function(){
    var TIPS_TITLE = "标题",
        TIPS_NETERR = "网络繁忙，请稍后再试";
        
    var __addEvent = Core.Events.addEvent,
        __trim = Core.String.trim;
        
    var YYMMDD = $E('date_pub').value, HHMMSS = $E('articleTime').value; //后台输出的的时间，一直不变，用于取消定时时显示
    var db_time;

    //设置定时
    __addEvent($E("setPubTime"), function(){
        if(!db_time){ //进行初始化
            var yyMMdd = YYMMDD.split('-'), hhmmss = HHMMSS.split(':');
            //trace(yyMMdd);trace(hhmmss);
            db_time = Core.Date.UTC({
                y: yyMMdd[0],
                M: parseInt(yyMMdd[1], 10) - 1,
                d: parseInt(yyMMdd[2], 10),
                h: parseInt(hhmmss[0], 10) + 3, //后延三个小时
                m: parseInt(hhmmss[1], 10),
                s: parseInt(hhmmss[2], 10)
            });
            scope.$pub_time = db_time;
        }
        Mojie.setTimeDialog({
            time: db_time,
            funcOk: setTimeOk
        });
    });
    __addEvent($E("timeTips"), function(event){
        event = event || window.event;
        var t = event.srcElement || event.target;
        if(t.nodeName.toUpperCase()==='A'){
            if (articleEditorCFG.articleStatus == "7") {
                $E('timeTips').innerHTML = '博文将于 ' + YYMMDD + ' ' + HHMMSS + ' 发布';
                return;
            }
            winDialog.confirm('删除后，博文将于当前时间发布', {
                funcOk: function(){
                    $E('date_pub').value = YYMMDD;
                    $E('articleTime').value = HHMMSS;
                    //$E('timeTips').innerHTML = '　　时间：'+YYMMDD+' '+HHMMSS+'　';
                    $E('timeTips').innerHTML = '时间：'+YYMMDD+' '+HHMMSS;
                    $E('isTimed').value = 0;
                },
                icon: '04'
            });
        }
    });
    
    var servertime = parseInt(articleEditorCFG.servertime,10)||0;
    servertime *= 1000; //转换成毫秒
    
    function setTimeOk(time){
        db_time = time;
        scope.$pub_time = time;
        var tobj = Core.Date.getTimeObj(time),
            yMd = tobj.yy+'-'+tobj.MM+'-'+tobj.dd,
            hms = tobj.hh+':'+tobj.mm+':'+tobj.ss;
        $E('date_pub').value = yMd;
        $E('articleTime').value = hms;
        $E('timeTips').innerHTML = '博文将于 '+yMd+' '+hms+' 发布<a href="javascript:;">×</a>';
        $E('isTimed').value = 7;
        if(time<servertime){
            v7sendLog('50_01_20'); //设置的时间是历史时间
        }
    }
    
    //编辑定时列表时，加初始化db_time
    if(articleEditorCFG.articleStatus == "7"){
        var yyMMdd = YYMMDD.split('-'), hhmmss = HHMMSS.split(':');
        db_time = Core.Date.UTC({
            y: yyMMdd[0],
            M: parseInt(yyMMdd[1], 10) - 1,
            d: parseInt(yyMMdd[2], 10),
            h: parseInt(hhmmss[0], 10),
            m: parseInt(hhmmss[1], 10),
            s: parseInt(hhmmss[2], 10)
        });
        scope.$pub_time = db_time;
        
        //2012-09-04 liming9 下面两行提至前面，为了那些烦死人的布码
        //var servertime = parseInt(articleEditorCFG.servertime,10)||0;
        //servertime *= 1000; //转换成毫秒
        scope.$server_time = servertime;
        var timeoff = db_time-servertime;
        if(timeoff>600000){
            setTimeout(function(){
                winDialog.alert('博文将于10分钟后发表，请尽快保存修改',{icon:'01'});
                setTimeout(function(){
                    $E('setPubTime').parentNode.style.display = 'none';
                }, 580000);
            }, timeoff-600000);
        }else if(timeoff>60000){
            winDialog.alert('博文将于'+Math.floor( timeoff/60000 )+'分钟后发表',{icon:'01'});
            setTimeout(function(){
                $E('setPubTime').parentNode.style.display = 'none';
            }, timeoff);
        }else{
            $E('setPubTime').parentNode.style.display = 'none';
        }
    }
    
});
