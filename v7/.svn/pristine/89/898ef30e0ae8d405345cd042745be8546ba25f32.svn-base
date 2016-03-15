/** 
 * @fileoverview feed分类
 * @author Book | xiaoyue3@staff.sina.com.cn
 * @date 2012-11-13
 * @vertion 0.01
 */
$import("lib/jobs.js");
$import("lib/interface.js");
$import("lib/historyM.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/utils/io/jsload.js");
$import("sina/Evter.js");
$import("sina/core/array/foreach.js");
$import('mojie/renderFeedTypeModule.js');
$import("sina/core/system/jsonToQuery.js");

$registJob('feedType', function(){
    var allfeed = $E("allfeed");
    var $historyM = Lib.historyM;
    var lasthash, hashIdx;

    //使用事件代理去操作下拉列表点击事件
    var subtype = $E("subtype");
    subtype.onclick = tabClick;
    
    //IE下不支持显示分类内容，每次刷新页面，显示全部内容，同时更换地址栏地址，显示全部
    if($IE){
        window.location.hash = "";
    }
    

    function tabClick(event,dataType){
        var target= (event && event.target) || (window.event && window.event.srcElement);
        if(target && target.tagName && target.tagName.toLowerCase() == 'a'){
            var mT=target.getAttribute("tabItemType");
        }else{
            return;
        }

        if(!mT){
            return;
        }
        noRequest();
        if(hashIdx != mT){
            switch(mT) {
                case "all":
                    $historyM.setQuery({"type":"all"});
                    break;
                case "article":
                    $historyM.setQuery({"type":"article"});
                    break;
                case "photo":
                    $historyM.setQuery({"type":"photo"});
                    break;
                case "like":
                    $historyM.setQuery({"type":"like"});
                    break;
                case "other":
                    $historyM.setQuery({"type":"other"});
                    break;
            }
        }else{
            return;
        }    
    }
    $historyM.onpopstate(function(){
        var q = $historyM.parseURL();
        var type = Core.System.queryToJson(q.query).type;
        stateChange(type);     
    });
    function stateChange(hash){
        switch(hash){
            case "all":
                Mojie.renderFeedTypeModule('all', 1);
                break;
            case 'article':
                Mojie.renderFeedTypeModule('article', 1);
                break;
            case 'photo':
                Mojie.renderFeedTypeModule('photo', 1);
                break;
            case "like":
                Mojie.renderFeedTypeModule('like', 1);
                break;
            case "other":
                Mojie.renderFeedTypeModule('other', 1);
                break;
        }
    }
    //判断如果在当前分类下，禁止重复请求。
    function noRequest(){
        lasthash = window.location.href;
        if (lasthash) {
            lasthash = lasthash.match(/(type=).*/g);
            if(lasthash){
               var idx = lasthash.toString().indexOf("="); 
               hashIdx = lasthash.toString().substr(idx + 1);
            }
        } 
    }
});
