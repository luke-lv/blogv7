/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 */
/**
 * @fileoverview 组件 文章页 被推荐博文列表
 * @author stan | chaoliang@staff.sina.com.cn
 */
$import("sina/core/function/bind2.js");
$import("sina/utils/io/jsload.js");
$import("sina/ui/template.js");

$import("lib/component/class/registComp.js");
$import("lib/component/extend/comp_dynamic.js");

$registComp(909, {
    load: function () {
        if (this.getContent().firstChild.className == "wdtLoading") {
            this.other();
        }
        this.load = this.other;
    },
    other: function () {
        var i_getArticleList = new Interface("http://control.blog.sina.com.cn/riaapi/appMake_Show.php", "jsload");
        var param = {
            "uid": scope.$uid, "vid": this.compId, "width": this.size
//			,"varname"	: "newStaticComp"
        };

        i_getArticleList.request({
            GET: param, onSuccess: Core.Function.bind2(function (sData) {
                // 将列表写入到组件中
                this.setContent(sData);
            }, this), onError: Core.Function.bind2(function () {
                this.setContent('<div class="loadFailed">加载失败！</div>');
            }, this), onFail: Core.Function.bind2(function () {
                this.setContent('<div class="loadFailed">加载失败！</div>');
            }, this)
        });
    }
    /*
     * 设置评论组件的管理链接，仅在页面设置新增组件的时候会用到
     */, "setManage": function () {
        if ($isAdmin && this.getManage()) {
            this.getManage().innerHTML = '<span class="move"><a href="#" ' + 'onclick="funcMoveUpDown.up(' + this.compId + ');return false;">↑</a><a href="#" ' + 'onclick="funcMoveUpDown.down(' + this.compId + ');return false;">↓</a></span>' + '<a href="#" onclick="hiddenComponents(\'' + this.compId + '\');return false;" class="CP_a_fuc">[<cite>隐藏</cite>]</a>';
        }
    }, reload: function (sSize, bAddManage, bForceRequest) {
        var sizeCorrect = sSize == null || (sSize && (sSize == 210 || sSize == 510 || sSize == 730));
        if (!sizeCorrect) {
            Debug.error("请检查传入的组件尺寸是否正确。" + sSize);
            return;
        }
        this.size = sSize || this.size;
        this.getContent().innerHTML = '<div class="wdtLoading"><img src="http://simg.sinajs.cn/blog7style/' + 'images/common/loading.gif" />加载中…</div>';
        this.load();
        if (bAddManage) {
            this.setManage();
        }
    }
}, 'dymanic');
