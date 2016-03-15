/**
 * @fileoverview
 *    许愿瓶组件
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/core/dom/insertHTML.js");

$import("lib/component/class/registComp.js");
$import("lib/component/extend/comp_dynamic.js");
$import("lib/checkAuthor.js");

$import("component/include/bottle_dialog.js");

$registComp(38, {
    "load": function () {
        Lib.checkAuthor();
        // 只有博主登录，才能拖动重新渲染组件
        if ($isAdmin && this.getContent().firstChild.className != "cloneWidget") {
            var i_getArticleList = new Interface("http://control.blog.sina.com.cn/riaapi/appMake_Show.php", "jsload");
            var param = {
                "uid": scope.$uid, "vid": this.compId, "width": this.size
            };

            i_getArticleList.request({
                GET: param, onSuccess: Core.Function.bind2(function (sData) {
                    if (/lazyload="true"/.test(sData)) {
                        sData = sData.replace(/<textarea[^>]+>(<iframe[^>]+><\/iframe>)<\/textarea><div[^>]+><img[^>]+>[^<]+<\/div>/gi, "$1");
                    }
                    // 将列表写入到组件中
                    this.setContent(sData);
                }, this), onError: Core.Function.bind2(function () {
                    this.setContent('<div class="loadFailed">加载失败！</div>');
                }, this), onFail: Core.Function.bind2(function () {
                    this.setContent('<div class="loadFailed">加载失败！</div>');
                }, this)
            });
        }
        if (this.bottleInit == null) {
            trace(" |-左侧漂流瓶组件");
            Core.Dom.insertHTML(document.body, window.BlogBottleMsg.createContent(), "BeforeEnd");
            BlogBottleMsg.init();
            // L.Ming | liming1@staff. 修复 blog.2008.sina.com.cn 域名下许愿瓶点不开的 BUG
            var oTarget = (scope.$pageid == "olympic_bottle") ? parent : window;
            BlogBottleMsg.setViewTarget(oTarget);
            this.bottleInit = true;
        }
    }
}, "dynamic");