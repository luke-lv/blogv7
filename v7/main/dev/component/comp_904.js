/**
 * @fileoverview 组件 文章页 推荐博文
 * @author stan | chaoliang@staff.sina.com.cn
 * @modified dcw1123 | chengwei1@staff.sina.com.cn
 */
$import("lib/component/class/registComp.js");
$import("lib/component/extend/comp_dynamic.js");
$import("sina/core/function/bind2.js");
$import("sina/utils/io/ajax.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/utils/io/jsload.js");

$registComp(904, {
    load: function () {
        //下线推荐博文布玛 @modified xiaoyue3
        // v7sendLog('45_01_21_' + scope.$uid);
        // if((scope.$pageid === "articleM" || scope.$pageid === "article") && $E("module_904")){
        //  Core.Events.addEvent($E("module_904"),function(event){
        //    var target= (event && event.target) || (window.event && window.event.srcElement);
        //         if(target && target.tagName && target.tagName.toLowerCase() == 'a'){
        //          v7sendLog('45_01_02');
        //         }
        //  });
        // }
        if (Core.Dom.byClz(this.getContent(), "div", "wdtLoading").length > 0) {
            var _url = "http://blog.sina.com.cn/main/top_new/article_sort/" + scope.$sort_id + "_day.v7.html";
            Utils.Io.Ajax.request(_url, {
                onComplete: function (data) {
                    data = '<div class="atcTitList relaList">' + data + '</div>';
                    this.setContent(data);
                }.bind2(this), onException: function () {
                    this.showError();
                }.bind2(this)
            });
        } else {
            //trace("then don't render html");
        }
    }
}, 'dymanic');


