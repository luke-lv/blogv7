/**
 * @fileoverview
 *    博客首页（非页面设置）、博文列表搜博主文章组件 id=63
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/sina.js");
$import("sina/core/function/bind2.js");
$import("sina/utils/form/inputListen.js");

$import("lib/component/class/registComp.js");
$import("lib/component/extend/comp_static.js");
$registComp(63, {
        "load": function () {
            // 如果页面上有搜博主文章的输入框，就只限制输入长度；否则先加载组件
            if ($E("keyword")) {
                if (this.other != null) {
                    this.other();
                }
            } else if ($isAdmin) {
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
        }, other: function () {
            Utils.Form.inputListen($E("keyword"), 50);
        }
    }, 'static');