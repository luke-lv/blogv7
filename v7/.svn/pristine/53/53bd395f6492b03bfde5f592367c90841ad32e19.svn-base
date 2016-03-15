/**
 * @fileoverview tj=tech页 作者文章列表信息组件
 * @author Liu Xiaoyue | xiaoyue3@staff.sina.com.cn
 * @date 2013-03-29
 * @vertion 0.01
 */

$import("sina/core/dom/getChildrenByClass.js");
$import("lib/component/class/registComp.js");
$registComp(3004, {
    /**
     * 加载作者文章列表信息组件
     *
     */

    load: function () {
        var struc = "";
        var moudleId = $E("module_3004");
        Utils.Io.JsLoad.request('http://control.blog.sina.com.cn/blog_rebuild/riaapi/blog/getUserArticle.php', {
            GET: {
                uid: scope.$uid
            },
            onComplete: function (result) {
                var loading = moudleId.children[0].children[1].children[1];
                var struc = "", imgs, detail;
                var data = result.data && result.data.msg;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].pic) {
                        imgs = '<a href="http://blog.sina.com.cn/s/blog_' + data[i].blog_id + '.html" target="blank" class="imga"><img src="' + data[i].pic + '" width="110" alt=""></a>'
                        detail = '<p class="more">' + '<a href="http://blog.sina.com.cn/s/blog_' + data[i].blog_id + '.html" target="blank">详细&gt;&gt;</a>' + '</p>' + '<div class="clearit"></div>' + '</div>' + '</li>';
                    } else {
                        imgs = '';
                        detail = '<div class="clearit"></div>' + '</div>' + '<p class="more">' + '<a href="http://blog.sina.com.cn/s/blog_' + data[i].blog_id + '.html" target="blank">详细&gt;&gt;</a>' + '</p>' + '</li>';
                    }
                    struc += '<li class="last">' + '<div class="article_tit"><a href="http://blog.sina.com.cn/s/blog_' + data[i].blog_id + '.html" target="blank">' + data[i].blog_title + '</a></div>' + '<div class="articlelist">' + imgs + '<p>' + data[i].body_body + '</p>' + detail;

                }

                struc = '<ul class="conn_low_con">' + struc + '</ul>';
                var wrap = moudleId.children[0].children[1];
                wrap.innerHTML = struc;
                Core.Dom.removeNode(loading);
                var lis = wrap.getElementsByTagName("li");
                var len = lis.length;
                if (len >= 1) {
                    lis[len - 1].className = "last";
                }

            },
            onException: function () {
            }
        });
    }
});
