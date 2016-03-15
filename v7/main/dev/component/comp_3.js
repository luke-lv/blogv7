/**
 * @fileoverview
 *    博客列表页分类组件
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/core/array/hashBy.js");
$import("sina/core/dom/addHTML.js");
$import("sina/core/function/bind2.js");
$import("sina/ui/template.js");

$import("lib/component/class/registComp.js");
$import("lib/component/extend/comp_dynamic.js");
$import("lib/interface.js");
$import("lib/checkAuthor.js");

$import("component/include/getArticlesSort.js");
$registComp(3, {
        "load": function () {
            if (this.getContent().innerHTML == "" || this.getContent().firstChild.className == "wdtLoading") {
                var i_getArticleList = new Interface("http://control.blog.sina.com.cn/riaapi/appMake_Show.php", "jsload");
                var param = {
                    "uid": scope.$uid, "vid": this.compId, "width": this.size
                };

                i_getArticleList.request({
                    GET: param, onSuccess: Core.Function.bind2(function (sData) {
                        // 将列表写入到组件中
                        this.setContent(sData);
                        if (this.other != null) {
                            this.other();
                        }
                    }, this), onError: Core.Function.bind2(function () {
                        this.setContent('<div class="loadFailed">加载失败！</div>');
                    }, this), onFail: Core.Function.bind2(function () {
                        this.setContent('<div class="loadFailed">加载失败！</div>');
                    }, this)
                });
            }
            if (scope.$pageid == "pageSetM" && this.setManage) {
                this.setManage();
            }
        }
    }, 'dynamic');