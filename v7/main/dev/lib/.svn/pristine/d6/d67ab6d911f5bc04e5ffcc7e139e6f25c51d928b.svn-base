$import("lib/lib.js");
$import("lib/register.js");
$import("lib/sendLog.js");
/**
 * @fileoverview 用户昵称下拉面板模板
 * @author Qiangyee | wangqiang1@staff
 * @created 2013-04-12
 */
 Lib.register("tray.tpl.cateSearch", function(){
    var tpl = [
    '<div id="#{panel}" class="mCatSearch">',
      '<ul>',
        '<li action-type="tray-search" onclick="v7sendLog(\'40_01_43\')" action-data="article" class="current">含“<span id="#{article}"></span>”的博文</li>',
        '<li action-type="tray-search" onclick="v7sendLog(\'40_01_43\')" action-data="bloger">含“<span id="#{bloger}"></span>”的博主</li>',
        '<li action-type="tray-search" onclick="v7sendLog(\'40_01_43\')" action-data="music">含“<span id="#{music}"></span>”的音乐</li>',
        '<li action-type="tray-search" onclick="v7sendLog(\'40_01_43\')" action-data="video">含“<span id="#{video}"></span>”的视频</li>',
      '</ul>',
    '</div>'].join('');
    return tpl;
});