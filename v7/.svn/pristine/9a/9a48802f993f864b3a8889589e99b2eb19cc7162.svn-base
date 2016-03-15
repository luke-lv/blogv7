/** 
 * @fileoverview 点击外链布码统计
 * @author Book liming9@staff.sina.com.cn
 */
$import('lib/lib.js');
$import('lib/commonLog.js');
$import("sina/core/events/addEvent.js");

//linkInfo 包含外链信息json数组对象，例如[{blogid:'999888sd', container:$E('articleWrap')},{blogid:'', container:null}]
//blogid 博文id；container 可能包含外链的那个容器元素。不传container则取document.links
Lib.countOSLink = function(linkInfo){
    var __addEvent = Core.Events.addEvent;
    var rBlogLink = /^http:\/\/[\w\.]*?blog.sina.com.cn/i,
        i = linkInfo.length,
        j,
        blogid,
        uid,
        clinks,
        href;
    //trace(linkInfo);
    while( i-- ){
        blogid = linkInfo[i].blogid;
        uid = linkInfo[i].uid;
        clinks = linkInfo[i].container ? $T(linkInfo[i].container, 'a') : document.links;
        j = clinks.length;
        while( j-- ){
            href = clinks[j].href;
            if( !href || href.match(rBlogLink) || href.indexOf('javascript:')>-1 ){
                continue;
            }
            !function(bid, a, url, uid){
                if(bid){
                    __addEvent(a, function(){
                        commonLog("http://interface.blog.sina.com.cn/riaapi/article/click_url.php?blogid="+bid
                            +"&url="+encodeURIComponent(url));
                    });
                }else{
                    __addEvent(a, function(){
                        commonLog("http://interface.blog.sina.com.cn/riaapi/article/click_url.php?uid="+uid
                            +"&url="+encodeURIComponent(url));
                    });
                }
                
                a = null;
            }(blogid, clinks[j], href, uid);
            //trace(href);
            //clinks[j].onclick = "commonLog('http://interface.blog.sina.com.cn/riaapi/article/click_url.php?blogid="+blogid
            //    +"&url="+encodeURIComponent(href)+"');";
        }
    }
    clinks = null;
    __addEvent = null;
};
