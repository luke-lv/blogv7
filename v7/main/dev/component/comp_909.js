/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 */
/**
 * @fileoverview 组件 文章页 被推荐博文列表
 * @author stan | chaoliang@staff.sina.com.cn
 */
$import("sina/core/function/bind2.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/shorten.js");
$import("sina/core/string/encodeHTML.js");
$import("sina/utils/io/jsload.js");
$import("sina/ui/template.js");

$import("lib/component/class/registComp.js");
$import("lib/component/extend/comp_dynamic.js");

$registComp(909, {
    load: function () {
        //下线博主被推荐的博文布玛 @modified xiaoyue3
        // v7sendLog('45_01_23_' + scope.$uid);
        if ($E("tj_id")) {
            this.showTJList($E("tj_id"));
        }
        // if(scope.$pageid === "article" && $E("module_909")){
        //     Core.Events.addEvent($E("module_909"),function(event){
        //         var target= (event && event.target) || (window.event && window.event.srcElement);
        //         if(target && target.tagName && target.tagName.toLowerCase() == 'a'){
        //             v7sendLog('45_01_04');
        //         }
        //     });
        // }
    },
    // 读取推荐文章接口
    showTJList: function (_container) {
        Utils.Io.JsLoad.request("http://blogtj.sinajs.cn/api/tj/get_tj_article_info.php", {
            GET: {
                "uid": scope.$uid
//			,"varname": "tjData"
            },
            //接口传输正常
            onComplete: (function (result) {
                var tp = '<li><p><span class="SG_dot"></span><a href="#{href}" target="_blank">#{content}</a></p>' + '<div class="w_list SG_txtc"><a href="#{srcHref}" target="_blank">#{src}</a></div></li>';
                var content = "";
                var data = result.data;
                var len = result.data.length > 5 ? 5 : result.data.length;
                if (len === 0) {
                    _container.innerHTML = '<li class="no_text">暂无被推荐博文</li>';
                    return;
                }
                for (var i = 0; i < len; i++) {
                    var info = {};
                    info.href = "http://blog.sina.com.cn/s/blog_" + data[i].blog_id + ".html?tj=1";
                    info.content = Core.String.byteLength(data[i].blog_title) > 26 ? Core.String.shorten(data[i].blog_title, 26, "…") : data[i].blog_title;
                    info.content = Core.String.encodeHTML(info.content);
                    info.srcHref = data[i].tj_chanel_id_url;
                    info.src = data[i].tj_chanel_id_str;
                    var temp = new Ui.Template(tp).evaluate(info);
                    content += temp;
                }
                _container.innerHTML = content;
            }).bind2(this),
            //接口传输异常,(可选)
            onException: (function () {
                //alert("onEx");
                this.showError();
            }).bind2(this)
        });
    }
}, 'dymanic');