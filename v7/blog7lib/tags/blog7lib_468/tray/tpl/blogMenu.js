$import("lib/lib.js");
$import("lib/register.js");
$import("lib/sendLog.js");
/**
 * @fileoverview 发博文下拉面板模板
 * @author Qiangyee | wangqiang1@staff
 * @created 2013-04-12 
 * @modified xiaoyue3@staff 20140115 淘博会下线
 */
 Lib.register("tray.tpl.blogMenu", function(){
    var tpl = [
            '<div id="#{panel}" class="wrtBlog_sub">',
                '<div class="wrtBlog_sub3">',
                    '<p><a target="_blank" onclick="v7sendLog(\'40_01_26\')" href="http://control.blog.sina.com.cn/admin/article/article_add.php?tag365">写365</a></p>',
                    '<p><a target="_blank" onclick="v7sendLog(\'40_01_26\')" href="http://control.blog.sina.com.cn/admin/article/changWeiBo.php">长微博</a></p>',
                    // '<p><a target="_blank" onclick="v7sendLog(\'40_01_26\')" href="http://control.blog.sina.com.cn/weiyulu/weiyulu.php">微语录</a></p>',
                    //'<p><a target="_blank" onclick="v7sendLog(\'40_01_26\')" href="http://control.blog.sina.com.cn/admin/article/daily.php">九宫格</a></p>',
                    '<p><a target="_blank" onclick="v7sendLog(\'40_01_26\')" href="http://photo.blog.sina.com.cn/upload/upload.php">发照片</a></p>',
                    // '<p><a target="_blank" onclick="v7sendLog(\'40_01_26\')" href="http://vupload.you.video.sina.com.cn/u.php?m=1">发视频</a></p>',
                    // '<p id="#{tbh_status}" style="display:none;"><a target="_blank" onclick="v7sendLog(\'40_01_26\')" href="http://control.blog.sina.com.cn/admin/article/article_add.php?tbh=1">发商品</a></p>',
                '</div>',
            '</div>'].join('');
    return tpl;
});
