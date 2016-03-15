/** 
 * @fileoverview 搜索浮层
 * @author yifei2
 */
$import("sina/core/dom/setStyle.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/dom/getElementsByClass.js");
// $import("other/sendLogToQing.js");
$import("sina/utils/io/jsload.js");

$registJob('searchToQing',function(){
    var searchData = getSearchReferrer();

    if(!searchData){return}
    
    var docEle = document.documentElement, docBody = document.body;

    showQingDiv();

    // 搜索关键字
    function getSearchReferrer(){
        var o = {};
        var docURL = document.URL;
        //http://blog.sina.com.cn/s/blog_4980964e0100dlrc.html?k=food&t=GBK
        if(docURL.indexOf("blog.sina.com.cn") != -1 && docURL.indexOf("k=") != -1){
            var u = new Utils.Url(docURL);
            o.key = u.getParam("k");
            o.type = u.getParam("t");
            return o;
        }

        var refer = document.referrer;
        if (!refer || refer === "") {
            return false;
        }
        
        var searchParam = {
                "www.google.co.jp" : {
                    param : "q",
                    type : "utf-8"
                },
                "www.google.com.hk" : {
                    param : "q",
                    type : "utf-8"
                },
                "www.baidu.com": {
                    param : "wd",
                    type : "GBK",
                    needTrans : true
                },
                "www.soso.com" : {
                    param : "query",
                    type : "GBK",
                    needTrans : true
                },          
                "search.yahoo.com" :{
                    param: "p",
                    type:"utf-8"
                },
                "cn.bing.com": {
                    param : "q",
                    type : "utf-8"
                },
                "www.youdao.com": {
                    param : "q",
                    type : "utf-8"
                },
                "www.sogou.com": {
                    param : "query",
                    type : "GBK",
                    needTrans : true
                },
                "www.so.com": { //增加360搜索--by zhihang1@staff
                    param : "q",
                    type : "utf-8"
                }
                // , 运营的要求去掉uni搜索浮层--by wangqiang1@staff
                // "uni.sina.com.cn": {
                    // param : "k",
                    // type : "gbk",
                    // needTrans : true
                // }
        };
        for(var k in searchParam){
            var url = new Utils.Url(refer);
            
            // if(refer.indexOf("uni.sina.com.cn") != -1 && refer.indexOf("ie=") != -1){
                    // o.key = url.getParam("k");
                    // o.type = url.getParam("ie");
                    // break;
            // }
            
            if (refer.indexOf(k) != -1) {
                o.key = url.getParam(searchParam[k]["param"]);
                o.type = searchParam[k]["type"];
                o.needTrans = searchParam[k]["needTrans"];          //is new
                break;
            }
        }
        
        if (!o.key || o.key === "") {
            return false;
        } else {
            return o;
        }
    }
    
    // Qing浮层
    function showQingDiv(){
        var iframe,div;
        var divHeight = 130,
            clientHeight = docEle.clientHeight || docBody.clientHeight;

        // var iframeSRC = $_GLOBAL.qingURL+"blog/api/getsearchnatant.php?t="+(+new Date());
        var iframeSRC = "http://blog.sina.com.cn/lm/iframe/article/searchqing.html?t="+(+new Date());
        iframe = $C("iframe");
        iframe.src = iframeSRC;
        iframe.width = "100%";
        iframe.scrolling = "no";
        iframe.style.border = "0px";
        iframe.frameBorder = "no";
                
        closeBtn = $C("a");
        closeBtn.className = "nblog_searchBtmBtn";
        closeBtn.href = "javascript:void(0);"
        closeBtn.title = "关闭";
        closeBtn.innerHTML = "关闭";
        closeBtn.id = "serachToQingCloseBtn";
        closeBtn.onClick = "return false";
        
        div = $C("div");
        div.id = "searchToQing";
        div.style.width = "100%";
        div.style.height = "100px";
        div.style.left = "0px";
        div.style.top = (clientHeight - divHeight) + "px";
        div.style.position = "fixed";
        div.style.zIndex = 201;
        
        div.appendChild(closeBtn);
        div.appendChild(iframe);
        //<a href="#" class="blog_searchBtmBtn" title="关闭">关闭</a>
        
        Core.Events.addEvent(closeBtn, function(){
            trace("add events to closeBtn");
            $E("searchToQing").parentNode.removeChild($E("searchToQing"));
        }, "click");

        if ($IE6){
            div.style.position = "absolute";
            div.style.overflow = "hidden";
            //iframe的实际高度是150px,div的高度是100px,所以当滚动到页面尾部时，会一直显示滚动条。因而将超出的部分hidden，解决该问题
            Core.Events.addEvent(window,function(){
                var scrollTop = docEle.scrollTop || docBody.scrollTop,
                    clientHeight = docEle.clientHeight || docBody.clientHeight;
                var height = Math.abs(clientHeight - divHeight);
                if ($IE6){
                    height = Math.abs(clientHeight + scrollTop - divHeight);
                }
                $E("searchToQing").style.top = height + "px";
            }, "scroll");
            
            iframe.style.left=div.style.left;
            iframe.style.top=div.style.top;
        }
        
        //div.style.display = "none"
        docBody.appendChild(div);
        
        Core.Events.addEvent(window,function(e){
            setTimeout(function(){
                var scrollTop = docEle.scrollTop || docBody.scrollTop,
                    clientHeight = docEle.clientHeight || docBody.clientHeight;
                var height = Math.abs(clientHeight - divHeight);
                if ($IE6){
                    height = Math.abs(clientHeight + scrollTop - divHeight);
                }
                $E("searchToQing").style.top = height + "px";
            }, 20);
        }, "resize");
        Core.Events.addEvent($E("serachToQingCloseBtn"),function(e){
            sendLogToQing("79_01_12|blog7", $UID||"")
        }, "click");
        div = null;
        iframe = null;

        //qing搜索浮层曝光布码
        if($E('searchToQing') && SUDA) {
            SUDA.uaTrack("blog_sflow", "v_sflow");
        }
    }
});
