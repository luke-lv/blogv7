/**
 * @fileoverview tj=tech页 作者信息组件
 * @author Liu Xiaoyue | xiaoyue3@staff.sina.com.cn
 * @date 2013-03-29
 * @vertion 0.01
 */
$import("lib/component/class/registComp.js");
$import("lib/component/extend/comp_dynamic.js");
$registComp(3002, {
    /**
     * 加载作者信息组件
     *
     */
    load: function () {
        var moudleId = $E("module_3002");
        Utils.Io.JsLoad.request('http://control.blog.sina.com.cn/blog_rebuild/riaapi/blog/getUserInfo.php', {
            GET: {
                uid: scope.$uid
            },
            onComplete: function (result) {
                if (result.code === "A00006") {
                    var data = result.data && result.data.msg;
                    if (data) {

                        var wrap = moudleId.children[0];
                        wrap.children[0].href = "http://blog.sina.com.cn/u/" + scope.$uid;
                        wrap.children[0].innerHTML = '<img src="' + data.headpic + '" width="80" height="80">';
                        if (data.info === "") {
                            wrap.children[2].innerHTML = "新浪博客推荐博主";
                        } else {
                            wrap.children[2].innerHTML = data.info;
                        }
                        wrap.children[1].innerHTML = '作者：<a href="http://blog.sina.com.cn/u/' + scope.$uid + '" target="blank">' + data.nick + '</a>';
                        var shareWrapper = moudleId.children[1].children[0];
                        var blogWrapper = moudleId.children[1].children[1];
                        var shareWrap = shareWrapper.children[0];
                        var con = shareWrap.innerHTML;
                        if (!data.isWeibo) {
                            shareWrapper.innerHTML = con;
                            shareWrapper.className = "share_l notopened";
                        } else {
                            shareWrap.href = "http://weibo.com/" + data.uid;
                        }

                        blogWrapper.children[0].href = "http://blog.sina.com.cn/u/" + scope.$uid;
                    }

                }
            },
            onException: function () {
            }
        });
    }
}, 'dymanic');
