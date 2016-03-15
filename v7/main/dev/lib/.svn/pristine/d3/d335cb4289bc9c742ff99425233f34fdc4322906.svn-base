$import("sina/sina.js");
$import("sina/core/class/define.js");
$import("sina/core/events/addEvent.js");
$import("sina/utils/io/jsload.js");
$import("sina/utils/cookie/getCookie.js");

$import("lib/lib.js");
$import("lib/register.js");
$import("lib/panel.js");
$import("lib/tray/tpl/blogMenu.js");

/**
 * @fileoverview 右侧托盘(加强版)登录后的发博文下拉面板
 * @author Qiangyee | wangqiang1@staff
 * @created 2013-04-12
 */
Lib.register('tray.BlogMenuPanel', function(lib){
    var blogMenu = Core.Class.define(function() {
        lib.Panel.prototype.initialize.apply(this, arguments);
        this.setTemplate(lib.tray.tpl.blogMenu);
    }, lib.Panel, {
    });
    return blogMenu;
});