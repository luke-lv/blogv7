$import("lib/lib.js");
$import("lib/register.js");
$import("lib/sendLog.js");
/**
 * @fileoverview 托盘搜索输入form
 * @author Qiangyee | wangqiang1@staff
 * @created 2013-04-12
 */
Lib.register("tray.tpl.searchForm", function(){
    // 【请注意！！！！】
    //  坑爹的博客搜索，queryTxt的name会有q与k之间的差别
    //  搜索接口也会不一样，各接口的参数不一致，查询是情况不需要的查询参数
    // 
    // 
    // 默认为文章 queryUrl = "http://search.sina.com.cn"
    // article = {"queryTxt":"q", "ie":"utf-8", "range":"article", "s":"sup", "by":"all","stype":"1" , "e":"utf-8" , "c":"blog"}
    // 搜博主选项 queryUrl = "http://search.sina.com.cn"
    // bloger = {"queryTxt":"q", "ie":"utf-8", "range":"author", "s":"sup", "by":"all","stype":"1" , "e":"utf-8" , "c":"blog"}
    // 
    // http://music.sina.com.cn/yueku/search/s.php
    // 搜音乐 queryUrl = "http://search.sina.com.cn"
    // music = {"queryTxt":"k", "ie":"utf-8", "t":"song", "e":"utf-8"}
    //
    // 
    // 搜视频 queryUrl = "http://video.sina.com.cn/search/index.php"
    // video = {"queryTxt":"k", "ie":"utf-8", "s":"sup", "type":"boke", "stype":"1", "e":"utf-8"} 

      var tpl = [
      '<div class="ntopbar_input" id="#{panel}">',
            '<form id="#{searchForm}" method="get" target="_blank" action="http://search.sina.com.cn">',
            '<input id="#{queryTxt}" class="ntopbar_txt" type="text" name="q" autocomplete="off"/>',
            '<input id="#{submit}" type="submit" onclick="v7sendLog(\'40_01_44\')" class="ntopbar_searchBtn" value=""/>',
            '<input type="hidden" name="ie" value="utf-8"/>',
            '<input type="hidden" name="e" value="utf-8"/>',
            '<input id="#{range}" type="hidden" name="range" value="article"/>',
            '<input id="#{t}" type="hidden" name="t" value=""/>',
            '<input id="#{s}" type="hidden" name="s" value="sup"/>',
            '<input id="#{by}" type="hidden" name="by" value="all"/>',
            '<input id="#{type}" type="hidden" name="type" value=""/>',
            '<input id="#{stype}" type="hidden" name="stype" value="1"/>',
            '<input id="#{c}" type="hidden" name="c" value="blog"/>',
          '</form>',
    '</div>'].join("");
    return tpl;
});