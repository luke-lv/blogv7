/**
 * @fileoverview 得到页面设置或者用户向导页保存时需要的参数信息
 * @author xy xinyu@staff.sina.com.cn
 * @date 2009-10-19
 */
$import("pageSet/singleFunc/funcRefreshCompList.js");
(function () {
    window.getVars = function () {
        funcRefreshCompList();
        window.postdata = {
            version: 7,
            uid: scope.$uid,
            style: __pageSetVar.formatInfo,
            "style_css": __pageSetVar.selectedTpl,
            "background-color": $IE ? encodeURIComponent(Core.Dom.getStyle(document.body, "backgroundColor")) : Core.Dom.getStyle(document.body, "backgroundColor"),
            blogtoparea: "left:" + Core.Dom.getStyle($E('blogTitle'), "left") + ";top:" + Core.Dom.getStyle($E('blogTitle'), "top") + ";",
            blognavarea: "left:" + Core.Dom.getStyle($E('blognav'), "left") + ";top:" + Core.Dom.getStyle($E('blognav'), "top") + ";",
            "head-height": $E('sinablogHead').offsetHeight,
            "usercolor": 1,
            "background-attachment": __pageSetVar.isBgFixed,
            refer: __pageSetVar.pageSetSrc
        };
        //将每列组件信息放入postdata出来----------------
        for (var i = 1; i < 4; i++) {
            if (scope.component_lists[i]) {
                window.postdata["c" + i] = scope.component_lists[i].list.join(',');
            } else {
                window.postdata["c" + i] = '';
            }
//			trace(window.postdata["c" + i]);
        }
        //------------------------------------------
        //各个图片的属性--------------------------------------
        window.postdata["background-image"] = __pageSetVar["customPic_2" ]["pid"] == 'no' ? '' : __pageSetVar["customPic_2" ]["pid"];
        window.postdata["background-repeat"] = __pageSetVar["customPic_2" ]["repeat"];
        window.postdata["background-align-h"] = __pageSetVar["customPic_2" ]["align-h"];
        window.postdata["background-align-v"] = __pageSetVar["customPic_2" ]["align-v"];
        window.postdata["is-background-image"] = __pageSetVar["customPic_2" ]["apply"];

        window.postdata["navigation-background-image"] = __pageSetVar["customPic_3" ]["pid"] == 'no' ? '' : __pageSetVar["customPic_3" ]["pid"];
        window.postdata["navigation-background-repeat"] = __pageSetVar["customPic_3" ]["repeat"];
        window.postdata["navigation-background-align-h"] = __pageSetVar["customPic_3" ]["align-h"];
        window.postdata["navigation-background-align-v"] = __pageSetVar["customPic_3" ]["align-v"];
        window.postdata["is-navigation-background-image"] = __pageSetVar["customPic_3" ]["apply"];

        window.postdata["head-background-image"] = __pageSetVar["customPic_4" ]["pid"] == 'no' ? '' : __pageSetVar["customPic_4" ]["pid"];
        window.postdata["head-background-repeat"] = __pageSetVar["customPic_4" ]["repeat"];
        window.postdata["head-background-align-h"] = __pageSetVar["customPic_4" ]["align-h"];
        window.postdata["head-background-align-v"] = __pageSetVar["customPic_4" ]["align-v"];
        window.postdata["is-head-background-image"] = __pageSetVar["customPic_4" ]["apply"];

        //-------------------------
    };
})();
