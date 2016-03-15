$import("sina/core/events/addEvent.js");
$import("sina/utils/io/ajax.js");

$import("lib/login/ui.js");
$import("lib/checkAuthor.js");

/**
 * @fileoverview 下载卖家认证图片
 *
 * @create 2010-12-07
 * @author Qiangyee
 */
$registJob("downloadImg", function(){

    var btn = $E("download-pic");
    if (!btn) {
        return;
    }
    $E("download-pic").href = "http://control.blog.sina.com.cn/blog_rebuild/riaapi/profile/tbh/getpic.php?u="+$UID;
});
