 /*
 * @fileoverview 分享到微博 
 * @author gaolei | gaolei2@
 * @date   2013-3-28
 */
$import("lib/jobs.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/string/decodeHTML.js");

$registJob('shareWeibo', function(){

    function share(){
        var src = '新浪-博客';
        var srcurl = 'http://blog.sina.com.cn';
        var _db_localurl = encodeURIComponent(scope.$weiboUrl || "");
		var relateUid = scope.$relateUid || "";   // 推荐需要关注的博客，文案中会自动加@
        //searchPic=true&ralateUid=1951657750&
        var pic = scope.$sharePic || "";     // 默认没有图片
        var appkey = scope.$appkey || '1617465124'; //默认是博客appkey
        // var shareurl = 'http://v.t.sina.com.cn/share/share.php?searchPic=true&ralateUid='+relateUid+'&title=' + encodeURIComponent(scope.$weiboMsg || "")
        //     //+ (window.$UID ? '&ralateUid='+$UID : '')
        //     + '&url=' + _db_localurl
        //     + '&source=' + src
        //     + '&sourceUrl=' + encodeURIComponent(srcurl)
        //     + '&pic=' + encodeURIComponent(pic|| '')
        //     + '&content=utf-8&appkey=1617465124';
        var shareurl = 'http://service.weibo.com/share/share.php?url='+ _db_localurl
                        + '&type=button&language=zh_cn'
                        + '&title=' + encodeURIComponent(scope.$weiboMsg || '')
                        + '&pic=' + encodeURIComponent(pic || '')
                        + '&ralateUid=' + relateUid
                        + '&appkey=' + appkey
                        + '&searchPic=true';

        window.open(shareurl, 'selectionshare', 'toolbar=0,status=0,resizable=1,width=595,height=500,left='
        + (screen.width - 440) / 2 + ',top=' + (screen.height - 500) / 2);
    }

    if ($E('share_weibo')) {
        Core.Events.addEvent('share_weibo', function () {
            share();
            return false;
        });
    }
});