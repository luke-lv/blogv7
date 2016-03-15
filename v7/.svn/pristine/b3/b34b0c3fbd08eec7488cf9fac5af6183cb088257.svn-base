/** 
 * @fileoverview 检查是否有新的feed
 * @author Book | liming9@staff.sina.com.cn
 * @date 2012-08-11
 */
$import("lib/jobs.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/utils/io/jsload.js");
$import('mojie/feedTypeList.js');
$import("sina/Evter.js");

$registJob('checkNewFeed', function(){
//    var checkTime = $E('lastTime').value;
//
//    function changeCheckTime(){
//        //checkTime = Math.floor(+new Date()/1000);
//        Evter.add($E('newFeedTips'), '{time:'+checkTime+'}');
//    }

    //changeCheckTime();

    //Evter.add('changeCheckTime', changeCheckTime);

    var guanboWrap = $E('guanbofeedout'), feedTips = $E('newFeedTips');
    // setTimeout(function(){
    //     $E('newFeedTips').style.display = "";
    //     Mojie.feedTypeList(24, 23, 21);
    // },30000);
    setInterval(function(){
        Utils.Io.JsLoad.request('http://i.blog.sina.com.cn/blog_rebuild/riaapi/profile/feed/getNewFeedNum.php', {
            GET: {
                time: $E('lastTime').value //checkTime-36000 //-36000 just for test
            },
            onComplete: function(res){
                if (res && res.code==="A00006") {
                    if(res.data && res.data.count){
                        var el = $E('newFeedTips');
                        el.innerHTML = '有'+res.data.count+'条新内容，请点击查看';
                        el.style.display = '';
                        guanboWrap.style.marginBottom = '6px';
                    }
                }
            }
        });
    }, 180000); //3分钟请求一次


    var timer = setInterval(pos,5000);
    function pos(){
        if(feedTips.style.display != 'none'){
            Mojie.feedTypeList(24, 23, 21); 
        }else{
            return;
        }
    }



    var select = $E("select"), allfeed = $E("allfeed");
    var text = select.children[1], textstyle = select.children[0];
    
    Evter.add('-getNewFeed', function(elem){
        scope.feedView(0, 0, 1);
        elem.innerHTML = '正在加载数据...';
        setTimeout(function(){
            Mojie.feedTypeList(24, 23, 21); 
        },1000);
        text.innerHTML = '全部';
        textstyle.className = 'ct_icon ct_icon17';
        allfeed.innerHTML = '全部';

        //elem.style.display = 'none';
//        Utils.Io.JsLoad.request('http://i.blog.sina.com.cn/blog_rebuild/riaapi/profile/feed/getNewFeed.php', {
//            GET:{
//                time: checkTime-36000 //-36000 just for test
//            },
//            onComplete:function(res){
//                //trace(res);
//                if(res && res.code==='A00006'){
//                    var html = res.data.html;
//                    html && Core.Dom.insertHTML($E('feedWrap'), html, "AfterBegin");
//                    checkTime = res.data.lastTime;
//                }
//                elem.style.display = 'none';
//                //changeCheckTime();
//                //Evter.fire('changeCheckTime');
//            }
//            //,onException: function(){
//            //    //$E("theLatestFeed") = '<li style="margin-left:83px;">内容卡住了，</li>');
//            //}
//        });
    });
    
});
