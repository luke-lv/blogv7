/**
 * @fileoverview    [博客首页，页面配置页]——关注博主组件
 * @author        gaolei2 | gaolei2@
 * @jobImport        blog7\jobs\Comp_render_index.js
 *                        blog7\jobs\Comp_render_pageset.js
 */

$import("sina/ui/template.js");
$import("lib/component/class/registComp.js");
$import("lib/checkAuthor.js");
$import("sina/core/string/shorten.js");
$import("lib/component/include/attention.js");
$import("sina/core/dom/getElementsByClass.js");

$registComp("10010", {
    "url": "http://control.blog.sina.com.cn/blog_rebuild/riaapi/profile/feed/getAttenFeedList.php", "getElemByCls": Core.Dom.getElementsByClass
    /*
     * 730 像素宽度的模版
     */, "html730": ['<li class="commentsCell SG_j_linedot1">'
        , '<div class="commentsH">'
        ,
        '<strong class="commentsName SG_txtc SG_dot"><a href="#{nickUrl}" onclick="v7sendLog(\'46_01_02\')" target="_blank">#{nickName}</a></strong>'
        , '#{isV}#{attenStr}</div>'
        , '<div class="commentsContants">'
        , '<div class="commentsContantsTxt">'
        ,
        '<div class="commentsContantsTxt"><a href="#{blogUrl}" target="_blank" onclick="v7sendLog(\'46_01_03\')">#{title}</a></div>'
        , '</div>'
        , '</div>'
        , '<div class="commentsContants">'
        ,
        '<span class="SG_floatR"><a href="#{blogUrl}" target="_blank" class="CP_a_fuc" onclick="v7sendLog(\'46_01_05\')">查看全文&gt;&gt;</a></span>'
        , '<div class="commentsContantsTxt">#{content}</div></div>'
        , '</li>'].join("")
    /*
     * 510 像素宽度的模版
     */, "html510": ['<li class="commentsCell SG_j_linedot1">'
        , '<div class="commentsH">'
        ,
        '<strong class="commentsName SG_txtc SG_dot"><a href="#{nickUrl}" target="_blank" onclick="v7sendLog(\'46_01_02\')">#{nickName}</a></strong>'
        , '#{isV}#{attenStr}</div>'
        , '<div class="commentsContants">'
        , '<div class="commentsContantsTxt">'
        ,
        '<div class="commentsContantsTxt"><a href="#{blogUrl}" target="_blank" onclick="v7sendLog(\'46_01_03\')">#{title}</a></div>'
        , '</div>'
        , '</div>'
        , '</li>'].join("")
    /*
     * 210 像素宽度的模版
     */, "html210": ['<li class="commentsCell SG_j_linedot1">'
        , '<div class="commentsH">'
        ,
        '<strong class="commentsName SG_txtc SG_dot"><a href="#{nickUrl}" target="_blank" onclick="v7sendLog(\'46_01_02\')">#{nickName}</a></strong>'
        , '#{isV}#{attenStr}</div>'
        , '<div class="commentsContants">'
        ,
        '<div class="commentsContantsTxt"><a href="#{blogUrl}" target="_blank" onclick="v7sendLog(\'46_01_03\')">#{title}</a></div>'
        , '</div>'
        , '</li>'].join("")

    /*
     * 按 210 像素宽度渲染关注博主组件
     */, "render_210": function () {
        var tempData = [];

        for (var index = 0; index < this.cacheData.length; index++) {
            tempData[index] = {};
            for (var item in this.cacheData[index]) {
                tempData[index][item] = this.cacheData[index][item];
            }
        }
        for (var i = 0; i < tempData.length; i++) {
            delete tempData[i].content;
            tempData[i].title = Core.String.shorten(tempData[i].title, 26);	//标题限制13个汉字
            tempData[i].nickName = Core.String.shorten(tempData[i].nickName, 10);	//昵称限制5个汉字
        }
        var template = new Ui.Template(this.html210);
        var result = template.evaluateMulti(tempData);

        if ($isAdmin) {
            result = '<div class="zComments"><ul class="zCommentsUl">' + result + '</ul><div class="toDoBar"><span class="SG_more SG_floatR"><a href="http://control.blog.sina.com.cn/blogprofile/index.php" target="_blank" onclick="v7sendLog(\'46_01_04\')">更多</a>&gt;&gt;</span></div></div>';
        } else {//这里暂时留着 以防突然增加 “添加到我的博客” 需求
            result = '<div class="cloneWidget"><div class="zComments"><ul class="zCommentsUl">' + result + '</ul><div class="toDoBar"><span class="SG_more SG_floatR"><a href="http://control.blog.sina.com.cn/blogprofile/index.php" target="_blank" onclick="v7sendLog(\'46_01_04\')">更多</a>&gt;&gt;</span></div></div><div class="cloneLink"><a href="javascript:;" onclick="' + 'Lib.Component.clone(' + this.compId + ', ' + this.size + ');v7sendLog(\'46_01_07\'); return false;" class="SG_comClone"><img alt="添加到我的博客" src="http://simg.sinajs.cn/blog7style/images/widget/add1.gif">添加到我的博客</a></div></div>';
        }

        this.setContent(result);
    }
    /*
     * 按 510 像素宽度渲染关注博主组件
     */, "render_510": function () {
        var tempData = [];
        for (var index = 0; index < this.cacheData.length; index++) {
            tempData[index] = {};
            for (var item in this.cacheData[index]) {
                tempData[index][item] = this.cacheData[index][item];
            }
        }
        for (var i = 0; i < tempData.length; i++) {
            delete tempData[i].content;
            tempData[i].title = Core.String.shorten(tempData[i].title, 76);	//标题限制38个汉字
        }
        var template = new Ui.Template(this.html510);
        var result = template.evaluateMulti(tempData);

        if ($isAdmin) {
            result = '<div class="zComments"><ul class="zCommentsUl">' + result + '</ul><div class="toDoBar"><span class="SG_more SG_floatR"><a href="http://control.blog.sina.com.cn/blogprofile/index.php" target="_blank" onclick="v7sendLog(\'46_01_04\')">更多</a>&gt;&gt;</span></div></div>';
        } else {//这里暂时留着 以防突然增加 “添加到我的博客” 需求
            result = '<div class="cloneWidget"><div class="zComments"><ul class="zCommentsUl">' + result + '</ul><div class="toDoBar"><span class="SG_more SG_floatR"><a href="http://control.blog.sina.com.cn/blogprofile/index.php" target="_blank" onclick="v7sendLog(\'46_01_04\')">更多</a>&gt;&gt;</span></div></div><div class="cloneLink"><a href="javascript:;" onclick="' + 'Lib.Component.clone(' + this.compId + ', ' + this.size + '); v7sendLog(\'46_01_07\');return false;" class="SG_comClone"><img alt="添加到我的博客" src="http://simg.sinajs.cn/blog7style/images/widget/add1.gif">添加到我的博客</a></div></div>';
        }
        ;

        this.setContent(result);
    }
    /*
     * 按 730 像素宽度渲染关注博主组件
     */, "render_730": function () {
        var tempData = [];
        for (var index = 0; index < this.cacheData.length; index++) {
            tempData[index] = {};
            for (var item in this.cacheData[index]) {
                tempData[index][item] = this.cacheData[index][item];
            }
        }
        for (var i = 0; i < tempData.length; i++) {
            tempData[i].content = Core.String.shorten(tempData[i].content, 80); //摘要限制40个汉字
        }
        var template = new Ui.Template(this.html730);
        var result = template.evaluateMulti(tempData);

        if ($isAdmin) {
            result = '<div class="zComments"><ul class="zCommentsUl">' + result + '</ul><div class="toDoBar"><span class="SG_more SG_floatR"><a href="http://control.blog.sina.com.cn/blogprofile/index.php" target="_blank" onclick="v7sendLog(\'46_01_04\')">更多</a>&gt;&gt;</span></div></div>';
        } else {//这里暂时留着 以防突然增加 “添加到我的博客” 需求
            result = '<div class="cloneWidget"><div class="zComments"><ul class="zCommentsUl">' + result + '</ul><div class="toDoBar"><span class="SG_more SG_floatR"><a href="http://control.blog.sina.com.cn/blogprofile/index.php" target="_blank" onclick="v7sendLog(\'46_01_04\')">更多</a>&gt;&gt;</span></div></div><div class="cloneLink"><a href="javascript:;" onclick="' + 'Lib.Component.clone(' + this.compId + ', ' + this.size + '); v7sendLog(\'46_01_07\');return false;" class="SG_comClone"><img alt="添加到我的博客" src="http://simg.sinajs.cn/blog7style/images/widget/add1.gif">添加到我的博客</a></div></div>';
        }

        this.setContent(result);
    }
    /*
     * 请求组件内容接口
     * @param {Array}	items		博主信息及最新博文信息
     */, "load": function () {
        v7sendLog("46_01_01");
        var __this = this;
        Lib.checkAuthor();
        Utils.Io.JsLoad.request(this.url, {
            GET: {
                uid: scope.$uid
            },
            onComplete: function (result) {
                if (result.code && result.code === "A00006") {
                    if (result.data && result.data.items && result.data.items.length != 0) {//有数据显示
                        __this.count = result.data.count;			//返回的总数（目前改值没有用处）
                        __this.limitCount = Math.min(result.data.items.length,result.data.c_count);	//需要渲染的个数
                        __this.parseData(result.data.items);
                    } else {//没有数据，当作没有更新
                        __this.showEmpty();
                        return;
                    }
                } else {//返回失败，也当作没有更新
                    __this.showEmpty();
                }
            }
        });
    }
    /*
     * 提取接口中有效的数据
     * @param {Array}	items		博主信息及最新博文信息
     */, "parseData": function (items) {
        Lib.checkAuthor();
        var tempData = [];
        if (!items) {
            this.showEmpty();
        } else {
            for (var i = 0; i < this.limitCount; i++) {
                tempData[i] = {
                    nickName: items[i].nickName,
                    nickUrl: items[i].blog_url,
                    blogUrl: items[i].blog_articleurl,
                    title: items[i].blog_articletitle,
                    content: items[i].blog_articlecontent,
                    attenStr: $isAdmin ? '' : '<span class="SG_floatR"><a href="javascript:void(0)" isatt="' + items[i].is_att + '" userid="' + items[i].userId + '" class="CP_a_fuc">' + (items[i].is_att ? '已关注' : '+关注') + '</a></span>',
                    isV: items[i].isv ? items[i].isv : ""
                };
            }
        }
        this.cacheData = tempData;//将数据保存起来，以便再次渲染时使用
        this.parseToHTML(this.cacheData)
    }
    /*
     * 访客组件由 Json 转为 HTML
     * @param {Array}	oData		博主信息及最新博文信息
     */, "parseToHTML": function (oData) {
        this['render_' + this.size](oData);
        this.bindAttenEvent();
    }

    /*
     * 绑定关注博主事件
     */, "bindAttenEvent": function () {
        var module = $E("module_10010");
        if (!module) {
            return;
        }
        var attenBtns = this.getElemByCls(module, "a", "CP_a_fuc");
        for (var i = 0; i < attenBtns.length; i++) {
            attenBtns[i].onclick = function () {
                if (this.innerHTML.indexOf("\u5173\u6CE8") < 0) {//"关注"
                    return;
                }
                //只有关注按钮才可以执行加关注操作
                var isAtt = this.getAttribute("isatt");
                var uid = this.getAttribute("userid")
                var that = this;
                if (isAtt != 0) {//弹出提示  已关注此人
                    Lib.Component.isAttentioned();
                } else {//加关注，关注成功后，设置属性
                    Lib.Component.Attention($UID, uid, function () {
                        v7sendLog('46_01_06');
                        that.setAttribute("isatt", 1);
                        that.innerHTML = "已关注";
                    });
                }
            }
        }
    }
    /*
     * 重载访客组件
     * @param {Number}	sSize			重载后，被渲染的尺寸
     * @param {Boolean}	bAddManage		重载后，是否添加管理链接
     * @param {Boolean}	bForceRequest	重载后，是否强制请求新数据
     */, "reload": function (sSize, bAddManage, bForceRequest) {
        var sizeCorrect = sSize == null || (sSize && (sSize == 210 || sSize == 510 || sSize == 730));
        if (!sizeCorrect) {
            Debug.error("请检查传入的组件尺寸是否正确。" + sSize);
            return;
        }
        this.size = sSize || this.size;
        this.getContent().innerHTML = '<div class="wdtLoading"><img src="http://simg.sinajs.cn/blog7style/' + 'images/common/loading.gif" />加载中…</div>';
        if (bForceRequest == true || this.cacheData == null) {
            this.load();
        } else {
            this["render_" + this.size]();
        }
    }
    /*
     * 博文为空的文案
     */, "showEmpty": function () {
        this.setContent('<div class="SG_nodata">暂无更新</div>');
    }
}, 'dynamic');
