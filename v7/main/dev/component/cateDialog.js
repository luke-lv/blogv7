/**
 * @fileoverview 分类管理的对话框
 * @author xy & dongguang
 * modify by zh | darkty2009@gmail.com 2009-12-7 17:50
 */

/** 初始化分类管理对话框程序 */
$import("lib/dialogConfig.js");
$import("lib/showError.js");
$import("lib/checkAuthor.js");
$import('sina/core/class/create.js');
$import("sina/core/string/trim.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/leftB.js");
$import("sina/core/math/getUniqueId.js");
$import("sina/core/dom/addHTML.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/utils/io/ijax.js");
$import("component/include/getArticlesSort.js");

var cateDialog = Core.Class.create();

cateDialog.prototype = {
    uid: "",

    initialize: function (action) {
        this.action = action || false;
    },
    show: function (uid) {
        //if(typeof editor!='undefined'){
        //	editor.blur();
        //}
        this.uid = uid || scope.$uid;
        this.initDialog();
        this.dialog.show();
        this.dialog.setFixed(true);
        this.dialog.setAreaLocked(true);
        this.dialog.setMiddle();
    },
    initDialog: function () {
        var me = this;
        var data = {
            width: 492,
            height: 0,
            url: "http://control.blog.sina.com.cn/admin/article/article_class_list.php?" + (this.action ? 'action=editor' : '')
        };
        Lib.checkAuthor();
        this.url = "http://control.blog.sina.com.cn/admin/article/article_class_save2.php?uid=" + $UID + (this.action ? '&action=editor' : '');

        this.id = Core.Math.getUniqueId();

        this.manage = null;
        this.manage = new cateMng(this.id, this.itemTpl, this.uid);
        this.manage.onSuccess = function (list) {
            me.onSuccess(list);
        };

        var temp = new Ui.Template("<div style='width: #{width}px; height: #{height}px;' id='category_" + this.id + "'></div>");
        var obj = {
            ad: false,
            drag: true,
            title: "分类管理",
            content: temp.evaluate(data),
            shadow: 1,
            width: data.width,
            height: data.height
        };

        var func = {};
        var dialog = winDialog.createCustomsDialog(obj, func);
        this.dialog = dialog;
        $E("category_" + this.id).innerHTML = this.tpl.join("");

        var _this = this;
        // 关闭对话框的操作
        this.dialog.nodes['btnClose'].href = "javascript:;";
        this.dialog.nodes['btnClose'].onclick = function () {
            if (_this.manage.getEdit()) {
                winDialog.confirm("是否保存此更改？", {
                    funcOk: function () {
                        _this.manage.saveHandler(_this.url);
                    },
                    funcCancel: function () {
                        _this.close();
                    },
                    funcClose: function () {
                        _this.dialog.show();
                    },
                    textOk: "是",
                    textCancel: "否"
                });
            } else {
                _this.close();
            }
        };

        this.initEvent();
    },
    initEvent: function () {
        this.manage.nameEvent();
        this.manage.createEvent();
        this.manage.dataProvider();
        this.manage.saveEvent(this.url);
    },
    hidden: function () {
        this.dialog.hidden();
    },
    close: function () {
        this.dialog.hidden();
        this.dialog.destroy();
    },
    showOld: function () {
        this.dialog.show();
    },
    reset: function () {
        //var dialogParentNode = window.CateDialog.dialog.getDialogNodes().parent;
        //dialogParentNode.parentNode.removeChild(dialogParentNode);
        window.CateDialog.dialog.setCloseEvent(true);
        window.CateDialog.dialog.hidden();
        window.CateDialog.dialog = null;
        window.CateDialog.init = false;
    },
    setSize: function (nWidth, nHeight) {
        var ele = this.dialog.nodes.content.firstChild;
        this.dialog.setSize(nWidth, nHeight);
        ele.style.width = nWidth + "px";
        ele.style.height = nHeight + "px";
    },
    setCloseEvent: function (bClose) {
        //window.CateDialog.dialog.setCloseEvent(bClose);
    },
    getDialog: function () {
        return this.dialog;
    },
    getId: function () {
        return this.id;
    },
    getDataList: function () {
        return this.manage.list;
    },
    onSuccess: function (res) {
    },
    init: false,
    dialog: null,
    tpl: [
        '<div id="categoryBody">', '<div id="categoryTitle">', '</div>', '<div id="categoryHead">', '<table>', '<tr>',
        '<td><input type="text" maxlength="28" value="最多可输入14个中文字符" id="categoryName"/></td>',
        '<td width="80"><a id="categoryCreate" href="javascript:void(0);" class="SG_aBtn SG_aBtnB SG_aBtn_sub"><cite>创建分类</cite></a></td>',
        '<td><span class="SG_txtc">请用中文、英文或数字。</span></td>', '</tr>', '</table>', '<div id="errTips"></div>', '</div>',
        '<form method="post" id="categoryForm" name="form">', '<div id="categoryList">',
        '<ul class="clearfix" id="datalist">&nbsp;</ul>', '<div class="SG_j_linedot"></div>', '</div>',
        '<div id="categoryBottom" style="text-align:center">',
        '<a id="categorySave" href="javascript:void(0);" class="SG_aBtn SG_aBtnB SG_aBtn_sub"><cite>保存设置<input type="button" value="保存设置"/></cite></a>',
        '</div>', '</form>', '</div>'
    ],
    itemTpl: [
        '<li class="{class}">', '<span class="htit" style="color:#000000" id="cate_{index}">{cate}</span>',
        '<input type="hidden" value="{cate}" name="typename[]" class="catName"/>',
        '<input type="hidden" value="{id}" name="number[]"/>', '<span id="ctrl_{index}" class="control">',
        '<div class="manage">',
        '<a class="CP_a_fuc" id="edit_{index}" href="javascript:;" onclick="javascript:window.CateDialog.manage.editCate(this);">[<cite>编辑</cite>]</a>',
        '<a class="CP_a_fuc" id="del_{index}" index="{index}" href="javascript:;" onclick="javascript:window.CateDialog.manage.delCate(this);">[<cite>删除</cite>]</a>',
        '</div>', '<div class="arrow">',
        '<a id="up_{index}" class="{up_class}" href="javascript:;" onclick="javascript:window.CateDialog.manage.upHandler(this);"/>',
        '<a id="down_{index}" class="{down_class}" href="javascript:;" onclick="javascript:window.CateDialog.manage.downHandler(this);"/>',
        '</div>', '</span>', '<div id="editctrl_{index}" class="writeinfo" style="display:none">',
        '<input id="new_{index}" type="text" value="" /><a class="SG_aBtn SG_aBtnB SG_aBtn_sub" href="javascript:;"><cite>确定</cite></a><a class="SG_aBtn SG_aBtnB SG_aBtn_sub" href="javascript:;"><cite>取消</cite></a></div>',
        '<div/>', '</li>'
    ]
};

/**
 * @fileoverview 分类内容管理
 * @author zh | darkty2009@gmail.com
 */

var cateMng = Core.Class.create();

cateMng.prototype = {
    // 分类列表
    list: null,
    orilen: 0, //未做任何修改之前的分类个数
    edit: false,
    uid: null,
    /**
     * 管理类初始化
     * @param {Object} id 放弃使用的属性，随便给一个
     * @param {Object} itemTpl 编辑分类的模板
     */
    initialize: function (id, itemTpl, uid) {
        this.uid = uid || scope.$uid;
        this.id = id;
        this.itemTpl = itemTpl;
        Array.prototype.remove = function (dx) {
            if (isNaN(dx) || dx > this.length) {
                return false;
            }
            this.splice(dx, 1);
        };
    },
    /**
     * 分类名称输入框事件
     */
    nameEvent: function () {
        var _this = this;

        $E("categoryName").onfocus = function () {
            if (this.value == "最多可输入14个中文字符") {
                this.value = "";
            }
        };
        $E("categoryName").onblur = function () {
            var re = /[ ><\\\'\;\"`\|\t\r\n|\u3000]/ig;
            this.value = this.value.replace(re, "");

            if (Core.String.trim($E("categoryName").value) == "") {
                this.value = "最多可输入14个中文字符";
                this.edit = false;
            } else {
                this.edit = true;
            }

            _this.showTips("");
        };
        $E("categoryName").onkeyup = function () {
            var value = Core.String.trim(this.value);
            if (Core.String.byteLength(value) > 28) {
                this.value = Core.String.leftB(value, 28);
            } else if (value != this.value) {
                this.value = value;
            }
        }

        _this.showTips("");
    },
    /**
     * 创建分类事件
     */
    createEvent: function () {
        var _this = this;
        var code = "";
        $E("categoryCreate").onclick = function () {
            if (checkCate() && $E("categoryName").edit) {
                var obj = {"id": -1, "name": $E("categoryName").value};

                $E("categoryName").value = "最多可输入14个中文字符";
                $E("categoryName").edit = false;

                _this.list.push(obj);
                _this.update();
            }

            _this.showTips(code);
        }

        function checkCate() {
            var value = Core.String.trim($E("categoryName").value);
            code = "";
            if (value == "" || value == "最多可输入14个中文字符") {
                code = "分类名称不能为空";
            } else if (value.indexOf("&") != -1 || value.indexOf("＆") != -1) {
                code = "分类名称不能包含&符号";
            } else if (_this.list.length >= 15) {
                code = "抱歉！最多可创建15条分类";
            } else if (Core.String.byteLength(value) > 28) {
                code = "最多可输入14个中文字符";
            }

            for (var i = 0; i < _this.list.length; i++) {
                if (_this.list[i].name == value) {
                    code = "您已经添加过此分类";
                    break;
                }
            }

            if (code != "") {
                return false;
            } else {
                return true;
            }
        }
    },
    /**
     * 保存分类事件
     * @param {Object} url 提交接口
     */
    saveEvent: function (url) {
        Core.Events.stopEvent();
        var _this = this;
        $E("categorySave").onclick = function () {
            _this.saveHandler(url);
        };
    },
    saveHandler: function (url) {
        var _this = this;
        var length = _this.list.length;
        //分类减少超过2个，则提示是否确认修改 liming9-2012年6月27日
        if (_this.orilen - length > 2) {
            winDialog.confirm('您本次删除的博文分类太多，确定删除？', {
                funcOk: function () {
                    _this.orilen = length;
                    $E("categorySave").onclick();
                }
            });
            return;
        }
        var cateName = [];
        var cateId = [];
        for (var i = 0; i < length; i++) {
            var item = _this.list[i];
            cateName.push(item.name);
            cateId.push(item.id);
        }

        Utils.Io.Ijax.request(url + "&r=" + Math.random(), {
            POST: {
                typename: cateName.join("|"),
                number: cateId.join("|")
            },
            onComplete: function (res) {
                eval("var result = " + res);
//				winDialog.alert("保存分类成功！", {
//					icon:"03",
//					funcOk: function(){
                try {
                    try {
                        if ($E("module_3")) {
                            Lib.Component.refresh(3, {
                                width: scope.catedialogwidth || 210
                            });
                        }
                        if ($E("module_7")) {
                            location.reload();
                        }
                    } catch (error) {
                        trace(error);
                    }

                    try {
                        window.ArticleCateFuncs.reloadCate(result.msg);
                    } catch (error) {

                    }

                    window.CateDialog.close();
                } catch (e) {

                }
                var r;
                eval("r=" + res);
                _this.onSuccess(r.msg);
//					}
//				});
            },
            onException: function (res) {

            }
        });
    },
    /**
     * 编辑按钮
     * @param {Object} dom 编辑按钮节点
     */
    editCate: function (dom) {
        var _this = this;
        var index = dom.id.split("_")[1];
        var old = $E("cate_" + index).innerHTML;
        var li = $E("cate_" + index).parentNode;
        $E("ctrl_" + index).className = "control hide";
        li.className = index % 2 == 0 ? "editName" : "cline editName";

        var tpl = '<div id="editctrl_' + index + '" class="writeinfo"><input id="new_' + index + '" type="text" value="' + old + '"><a class="SG_aBtn SG_aBtnB SG_aBtn_sub" href="javascript:;"><cite>确定</cite></a><a class="SG_aBtn SG_aBtnB SG_aBtn_sub" href="javascript:;"><cite>取消</cite></a></div>';
        li.innerHTML = tpl;

        $E("new_" + index).onkeyup = function () {
            var re = /[ >&<\\\'\,\;\"`\|\t\r\n|\u3000]/ig;
            var value = Core.String.trim(this.value.replace(re, ""));
            if (value != this.value) {
                this.value = value;
            }

            if (value == "") {
                $E("editctrl_" + index).childNodes[1].disabled = true;
            } else {
                $E("editctrl_" + index).childNodes[1].disabled = false;
            }
        }
        $E("new_" + index).onblur = function () {
            if (Core.String.byteLength(this.value) >= 28) {
                this.value = Core.String.leftB(this.value, 28);
            }
        }

        $E("editctrl_" + index).childNodes[1].onclick = function () {
            if ($E("new_" + index).value == old) {
                setName(old, 2);
            } else {
                setName($E("new_" + index).value, 1);
            }
        };
        $E("editctrl_" + index).childNodes[2].onclick = function () {
            setName(old, 2);
        };

        function setName(nvl, type) {
            var value = nvl;
            var code = "";
            if (Core.String.byteLength(value) > 28) {
                value = Core.String.leftB(value, 28);
            }

            if (type == 1) {
                for (var i = 0; i < _this.list.length; i++) {
                    if (_this.list[i].name == value) {
                        code = "您已经添加过此分类";
                        break;
                    }
                }
            }

            if (code != "") {
                if (!$E("err_" + index)) {
                    Core.Dom.addHTML($E("editctrl_" + index), '<div id="err_' + index + '" class="errTips">' + code + '</div>');
                    li.style.height = "60px";
                } else {
                    $E("err_" + index).value = code;
                }
            } else {
                _this.list[index].name = value;
                var tpl = _this.itemTpl.join("");
                tpl = tpl.replace('<li class="{class}">', '');
                tpl = tpl.replace('</li>');
                var item = _this.list[index];
                tpl = tpl.replace(/\{cate\}/ig, item.name);
                tpl = tpl.replace(/\{id\}/ig, item.id);
                tpl = tpl.replace(/\{index\}/ig, index);
                tpl = tpl.replace(/\{up_class\}/, index == 0 ? "up_disabled" : "up");
                tpl = tpl.replace(/\{down_class\}/, index == _this.list.length - 1 ? "down_disabled" : "down");

                li.innerHTML = tpl;
                li.className = index % 2 == 0 ? "" : "cline";
                li.style.height = "30px";

                if (type == 1) {
                    _this.edit = true;
                }
            }

            code = "";
        }
    },
    /**
     * 删除按钮
     * @param {Object} dom 删除按钮节点
     */
    delCate: function (dom) {
        var _this = this;
        var index = dom.id.split("_")[1];

        winDialog.confirm("确实要删除此分类吗？删除后不可恢复。", {
            funcOk: function () {
                _this.list.remove(index);
                _this.update();
            }
        });
    },
    /**
     * 提高
     * @param {Object} dom 按钮节点
     */
    upHandler: function (dom) {
        var index = dom.id.split("_")[1];

        if (index > 0) {
            var temp = this.list[index];
            this.list[index] = this.list[index - 1];
            this.list[index - 1] = temp;

            this.update();
        }
    },
    /**
     * 下降
     * @param {Object} dom 按钮节点
     */
    downHandler: function (dom) {
        var index = dom.id.split("_")[1];

        if (index < this.list.length - 1) {
            var next = index * 1 + 1;
            var temp = this.list[next];
            this.list[next] = this.list[index];
            this.list[index] = temp;

            this.update();
        }
    },
    /**
     * 显示错误信息
     * @param {Object} code 错误信息字符
     */
    showTips: function (code) {
        $E("errTips").innerHTML = code;
    },
    /**
     * 初始化数据提供
     */
    dataProvider: function () {
        var _this = this;
        App.getArticlesSort(function (data) {
            //var cates = data;
            _this.list = data.data; //cates.c.cates; //flm
            _this.orilen = _this.list.length;
            $E("datalist").innerHTML = "";
            for (var i = 0; i < _this.list.length; i++) {
                var tpl = _this.itemTpl.join("");
                var item = _this.list[i];
                tpl = tpl.replace(/\{cate\}/ig, item.name);
                tpl = tpl.replace(/\{class\}/ig, i % 2 == 0 ? "" : "cline");
                tpl = tpl.replace(/\{id\}/ig, item.id);
                tpl = tpl.replace(/\{index\}/ig, i);
                tpl = tpl.replace(/\{up_class\}/, i == 0 ? "up_disabled" : "up");
                tpl = tpl.replace(/\{down_class\}/, i == _this.list.length - 1 ? "down_disabled" : "down");

                Core.Dom.addHTML($E("datalist"), tpl);
            }
        }, this.uid);
    },
    /**
     * 更新列表
     */
    update: function () {
        $E("datalist").innerHTML = "";

        for (var i = 0; i < this.list.length; i++) {
            var tpl = this.itemTpl.join("");
            var item = this.list[i];
            tpl = tpl.replace(/\{cate\}/ig, item.name);
            tpl = tpl.replace(/\{class\}/ig, i % 2 == 0 ? "" : "cline");
            tpl = tpl.replace(/\{id\}/ig, item.id);
            tpl = tpl.replace(/\{index\}/ig, i);
            tpl = tpl.replace(/\{up_class\}/, i == 0 ? "up_disabled" : "up");
            tpl = tpl.replace(/\{down_class\}/, i == this.list.length - 1 ? "down_disabled" : "down");

            Core.Dom.addHTML($E("datalist"), tpl);
        }

        if (!this.edit) {
            this.edit = true;
        }
    },
    /**
     * 返回是否编辑状态
     */
    getEdit: function () {
        return this.edit;
    },

    onSuccess: function (res) {
    }
};