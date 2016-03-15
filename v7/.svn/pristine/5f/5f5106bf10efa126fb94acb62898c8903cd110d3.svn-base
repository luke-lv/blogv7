/**
 * @fileoverview 修改博文分类
 * @author dcw1123@staff.sina.com.cn
 * @version 1.0
 */
$import("sina/core/class/define.js");
$import("sina/core/string/format.js");

$import("lib/interface.js");
$import("lib/checkAuthor.js");

$import("articleManage/ArticleMange.js");
$import("msg/articleManageMSG.js");
$import("msg/blogSystemMSG.js");

$import("lib/dialogConfig.js");
$import("component/include/getArticlesSort.js");

App.modifyCategory = Core.Class.define(null, App.ArticleMange, {

    // 接口地址
    "Interface": new Interface("http://control.blog.sina.com.cn/riaapi/article/edit_cat.php", "jsload"),

    // 请求接口的参数
    "param": {
    },

    // 请求成功的回调函数
    requestOk: function () {
        window.location.reload();
    },

    // 请求完成，但出错的回调函数
    requestError: function (sCode) {

    },

    // 是否需要登录
    needLogin: function () {
        trace('检查用户');
        Lib.checkAuthor();
        return !$isAdmin;
    },

// 弹出的确认信息，如果没有就不设置此项
    confirmMSG: [
        '<div id="#{content}" class="CP_layercon1">', '<div class="CP_prompt" style="padding:0;">',
        '<table class="CP_w_ttl"><tr><td id="#{text}">',
        '<p style="font-size:13px; font-weight:normal; padding-left:30px;">文章分类：',
        '<select id="#{cateSel}" style="width:130px;">{0}</select>', '</p>', '</td></tr></table>',
        '<div id="#{subText}" class="CP_w_cnt SG_txtb"></div>', '<p class="CP_w_btns" style="padding-left:60px;">',
        '<a id="#{linkOk}" class="SG_aBtn SG_aBtnB" href="#" onclick="return false;"><cite id="#{btnOk}"><span id="#{ok}">确认</span></cite></a>',
        '<a style="margin-left:5px;" id="#{linkCancel}" class="SG_aBtn SG_aBtnB" href="#" onclick="return false;"><cite id="#{btnCancel}"><span id="#{cancel}">取消</span></cite></a>',
        '</p>', '</div>', '</div>'
    ].join(""),

    // 重写方法，换用 customDialog
    confirm: function () {
        if (!$isLogin) {
            Lib.checkAuthor();
            $tray.renderLogin();
        }
        this.needLogin = false;
        if (this.confirmMSG) {
            var _this = this;
            if (!App.cacheSort) {							//缓存分类数据。
                App.getArticlesSort(function (data) {
                    App.cacheSort = data.data;
                    _this.showLayer();
                });
            } else {
                this.showLayer();						//此后收集 param。唉…
            }
        } else {
            this.doAction();
        }
    },

    //弹出窗口。
    showLayer: function () {
        var _this = this;
        var modiDial, cateSel, datai, curid = +this.cateId, curIndex = 0;
        var opt = "<option value='{1}'>{0}</option>";
        var opts = "<option value='00'>选择分类</option>";
        for (var i = 0; i < App.cacheSort.length; i++) {
            datai = App.cacheSort[i];
            opts += opt.format(datai.name, datai.id);
            if (datai.id === curid) {
                curIndex = i + 1
            }
        }
        opts += "<option value='0'>私密博文</option>";
        this.confirmMSG = this.confirmMSG.format(opts);

        //show moreLayer。
        modiDial = winDialog.createCustomsDialog({
            title: "修改博文分类",
            //height : "",
            //shadow : 1,
            content: this.confirmMSG
        });
        modiDial.setFixed(true);		//Chrome scrollTop。
        modiDial.setMiddle();
        modiDial.show();
        cateSel = modiDial.nodes.cateSel; //$E("cateSel");
        cateSel.selectedIndex = curIndex; //this.cateId*1;
        modiDial.nodes.linkCancel.onclick = function () {
            modiDial.close();			//hidden() 不清除实例。
            return false;
        };
        modiDial.nodes.btnClose.onclick = function () {
            modiDial.close();
            return false;
        }
        modiDial.nodes.linkOk.onclick = function () {
            _this.param = {
                "old_cat": _this.cateId,
                "new_cat": cateSel.options[cateSel.selectedIndex].value,
                "blog_id": _this.articleId
            };
            // debugger;
            if (_this.param.new_cat === "0") {
                _this.privacyArticleCheck(Core.Function.bind2(_this.doAction, _this));
                modiDial.close();
                return;
            }
            Core.Function.bind2(_this.doAction, _this)();
            modiDial.close();
            return false;
        };
    },
    //积分项目 针对私密博文的处理
    privacyArticleCheck: function (cb) {
        //验证是否有私密博文权限
        var itf = new Interface("http://control.blog.sina.com.cn/blog_rebuild/riaapi/points/check_vip.php", "ijax");
        var privacyArticleTips = function (cb) {
            var interfacePrivacy = new Interface("http://control.blog.sina.com.cn/blog_rebuild/riaapi/points/points_redeem.php", "ijax");
            var sucdlg = winDialog.alert("你尚未开通私密博文功能!", {
                funcOk: function () {
                    interfacePrivacy.request({
                        POST: {
                            user: scope.$uid || $UID,
                            type: 4,
                            auto: 1
                        },
                        onSuccess: function (data) {
                            cb();
                        },
                        onError: function (result) {
                            if (result && result.code == "A00003") {
                                winDialog.alert(result.data, {subText: '<a href="http://blog.sina.com.cn/huodong/lottery.html?f=1">马上获得1888积分! </a>'});
                            } else {
                                winDialog.alert(result && result.data);
                            }
                        },
                        onFail: function () {
                        }
                    });
                },
                textOk: "兑换并修改",
                subText: "私密博文一个月(30天)功能仅需30积分"
            }, "privacyArticleDialog");
        }
        itf.request({
            POST: {
                type: 4
            },
            onSuccess: function (data) {
                cb();
            },
            onError: function (result) {
                //未开通没有权限时
                if (result && result.code == "A00001") {
                    privacyArticleTips(cb);
                }
            },
            onFail: function () {
            }
        });
    },
    requestOk: function () {
        winDialog.alert("修改分类成功", {
            "icon": "03",
            funcOk: function () {
                window.location.reload();
            }
        });
    }

});


