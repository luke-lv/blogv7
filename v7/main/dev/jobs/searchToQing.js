/** 
 * @fileoverview 
 * @author gaolei | gaolei2@staff
 * @author Qingyee | wangqiang1@staff
 * @author Book | liming9@staff 增加根据搜索引擎的关键词投放广告
 */
$import("article/getSearchReferrer.js")
$import("sina/core/dom/setStyle.js");
$import("jobs/tjAd.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/dom/getElementsByClass.js");
$import("other/sendLogToQing.js");
$import("sina/utils/io/jsload.js");

$registJob('searchToQing',function(){
    var searchData = scope.isFromSearchEngine || Article.getSearchReferrer();
    //trace("searchData=");trace(searchData);
    if(!searchData){return}
    
    var docEle = document.documentElement, docBody = document.body;
    //根据关键词推广告
    // Utils.Io.JsLoad.request("http://control.blog.sina.com.cn/blog_rebuild/riaapi/blog/keyword_ad.php", {
    //     //charset: "gbk",
    //     //returnType: "json",
    //     GET: {
    //         kw: searchData.key
    //         //encode: searchData.type
    //     },
    //     onComplete: function(result){
    //         //trace(result);
    //         if(result && result.code==='A00006'){
    //             showKwAd(result.data);//暂时下掉微三国显示小浮层
    //         }else{showQingDiv()}
    //     },
    //     onException: function(e){
    //         //trace(e);
    //         showQingDiv();
    //     }
    // });

    showQingDiv();
    
    function showKwAd(data){
        var decode = decodeURIComponent,
            html = '',
            wrap = $C("div"),
            wrapHeight;
        
        //wrap.id = 'keywordAdWrap';
        wrap.className = 'blog_skeywords';
        wrap.style.overflow = "hidden";
        wrap.style.position = $IE6 ? 'absolute' : 'fixed';
        wrap.style.right = '0px';
        wrap.style.zIndex = 10;

        html = '' +
            '<dl class="clearfix">' +
                '<dt><a href="'+decode(data.ad_pic_url)+'" target="_blank" title="'+decode(data.ad_title)+'">' +
                    '<img width="208" height="48" src="'+decode(data.ad_pic_address)+'" alt="'+decode(data.ad_title)+'" />' +
                '</a></dt>' +
                '<dd>' +
                    (data.ad_word1?'<p><a href="'+decode(data.ad_word1_url)+'" target="_blank">'+decode(data.ad_word1)+'</a></p>':'') +
                    (data.ad_word2?'<p><a href="'+decode(data.ad_word2_url)+'" target="_blank">'+decode(data.ad_word2)+'</a></p>':'') +
                '</dd>' +
            '</dl>' +
            '<a onclick="this.parentNode.style.display=\'none\';return false;" href="javascript:;" class="close"></a>';
        wrap.innerHTML = html;
        docBody.appendChild(wrap);
        wrapHeight = wrap.offsetHeight;

        wrap.style.top = ( (docEle.clientHeight||docBody.clientHeight)-wrapHeight )+'px';
        $IE6 && Core.Events.addEvent(window, function(e){
            var scrollTop = docEle.scrollTop || docBody.scrollTop,
                clientHeight = docEle.clientHeight || docBody.clientHeight;
            wrap.style.top = Math.abs(clientHeight + scrollTop - wrapHeight) + "px";
        }, "scroll");
        Core.Events.addEvent(window, function(){
            setTimeout(function(){
                var scrollTop = docEle.scrollTop || docBody.scrollTop,
                    clientHeight = docEle.clientHeight || docBody.clientHeight;
                var height = Math.abs(clientHeight - wrapHeight);
                if ($IE6){
                    height = Math.abs(clientHeight + scrollTop - wrapHeight);
                }
                wrap.style.top = height + "px"; //$E('keywordAdWrap')
            }, 30);
        }, "resize");
    }

    //以下为最初的Qing浮层，在后台有对应关键词的广告时，不会执行以下代码
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
