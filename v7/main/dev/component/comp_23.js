/**
 * @fileoverview
 *    博客首页扬帆计划组件
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/sina.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/function/bind2.js");
$import("sina/utils/io/jsload.js");

$import("lib/component/class/registComp.js");
$import("lib/component/extend/comp_dynamic.js");

$registComp(23, {
        load: function () {
            var url = "http://blogtj.sinajs.cn/api/get_quakebook.php?uid=" + scope.$uid;
            Utils.Io.JsLoad.request(url, {
                onComplete: Core.Function.bind2(function (data) {
                    if (data.code && data.code == "A00006") {
                        this.parse(data.data.data);
                    } else {
                        this.parse(0);
                    }
                }, this),
                onException: Core.Function.bind2(function () {
                    this.parse(0);
                }, this),
                notrun: true
            });
        },
        parse: function (txt) {
            var htmlContainer = this.getContent();
            var showPicClass = "";
            if (txt == 0) {
                showPicClass = "http://simg.sinajs.cn/blog/v5images/comp/book_no.gif";
            } else {
                showPicClass = "http://simg.sinajs.cn/blog/v5images/comp/book_yes.jpg";
            }
            if (scope.$uid == "1214772890") {
                //当访问http://blog.sina.com.cn/yuanyuan315的时候，使用特殊的爱心大使图片，但是这个姐姐居然没有捐书。- -$
                showPicClass = "http://simg.sinajs.cn/blog/v5images/comp/book_over.jpg";
            }
            var startStr = '<div class="widgetcen"><div class="widgetconn cloneWidget">  ';
            startStr += '<div class="book ' + showPicClass + '" style="background:url(\'' + showPicClass + '\') no-repeat; width: 190px; height: 40px; text-align: center; padding: 160px 0 0 0;">';
            result = startStr + '<a target="_blank" href="http://yangfanbook.sina.com.cn/bookindex.htm"><img src="http://simg.sinajs.cn/blog/v5images/comp/book_bt.gif"/></a></div>';
            if (!$isAdmin) {
                result += '<div class="cloneLink"><a title="添加到我的博客" href="#" onclick="Lib.Component.clone(23, ' + this.size + ');return false;"><img alt="" src="http://simg.sinajs.cn/blog7style/images/widget/add1.gif" />' + ' 添加到我的博客</a></div>';
            }
            startStr += "</div></div>";
            this.show(result);
        }
    }, 'dynamic');