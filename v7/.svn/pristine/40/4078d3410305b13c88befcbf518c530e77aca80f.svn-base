/**
 * @author xs | zhenhau1@staff.sina.com.cn
 *            xy xinyu@staff.sina.com.cn 2008.09.26
 */

$import("sina/sina.js");

$import("prototype/prototype_src.js");
$import("prototype/dom.builder.js");

$import("sina/core/class/create.js");
$import("sina/core/class/extend.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/removeClassName.js");
$import("sina/core/dom/addHTML.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/dom/getWin.js");
$import("sina/core/dom/removeClassName.js");
$import("sina/core/function/bind2.js");
$import("sina/core/function/bind3.js");
$import("sina/core/array/ArrayWithout.js");
$import("sina/core/array/up.js");
$import("sina/core/array/down.js");
$import("sina/core/array/findit.js");
$import("sina/core/string/encodeHTML.js");
$import("sina/core/string/trim.js");
$import("sina/core/string/decodeHTML.js");
$import('sina/core/events/addEvent.js');
$import('sina/core/events/getEvent.js');
$import('sina/core/events/stopEvent.js');
$import("msg/blogSystemMSG.js");
$import("msg/blogCategoryMSG.js");

$import("sina/utils/form/sinput.js");
$import("sina/utils/form/reglimit.js");

var App = App || {};

App.$CM = Core.Class.create();

App.$CM.prototype = {
    initialize: function () {

    }
};
$registJob("initClass", function () {
    trace('initClass');
    /**
     * 创建一个$CM类，用于处理分类管理页面所需的功能
     * @author xs
     */
    Core.Class.extend(App.$CM.prototype, {
        re: /[ ><\\\'\,\;\"`\|\t\r\n|\u3000]/ig,
        initialize: function () {
            var catList = $('categoryList');
            if (!catList)
                return;
            this.listArea = catList.down('ul');
            this.categorys = [];
            trace($('errTips').innerHTML);
            this.errTip = $('errTips');

            Utils.Form.RegLimit($E("categoryName"), this.re);
        },
        reload: function () {
            this.listArea.innerHTML = '';
            this.categorys = [];
            if (scope.$className) {
                for (var i = 0; i < scope.$className.length; i++) {
                    this.addCategory(scope.$className[i].label, i, scope.$className[i].index);
                }
            }
        },
        /**
         * 添加分类
         * @author xs
         */
        addCategory: function (txt, num, index) {
            var me = this;
            if (me.categorys.length >= 15) {
                this.showError('抱歉！最多可创建15条分类。');
                return;
            }
            var txt = txt;
            var isAdd = Core.Array.findit(me.categorys, txt);
            //trace("isAdd=" + isAdd);
            if (isAdd != -1) {
                this.showError('您已经添加过此分类');
                return;
            }
            if (!$(this.listArea).down('li')) {
                this.listArea.innerHTML = '';
            }
            var control = Builder.node("span", {
                'class': "control"
            });

            var manage = Builder.node("div", {
                'class': "manage"
            });
            var arrow = Builder.node("div", {
                'class': "arrow"
            });

            var editBtn = Builder.node('a', {
                href: 'javascript:;',
                'class': 'CP_a_fuc'
            });
            editBtn.innerHTML = "[<cite>编辑</cite>]";

            var delBtn = Builder.node('a', {
                href: 'javascript:;',
                'class': 'CP_a_fuc'
            });
            delBtn.innerHTML = "[<cite>删除</cite>]";
            delBtn.setAttribute("__sort_index", num);

            var sortSpan = Builder.node('div', {
                "class": "arrow"
            });
            if (num == 0) {
                var sortArrowUp = Builder.node('a', {
                    href: 'javascript:;',
                    'class': "up_disabled"
                });
            } else {
                var sortArrowUp = Builder.node('a', {
                    href: 'javascript:;',
                    'class': "up",
                    __sort_index: num
                });
                var _self = this;
                sortArrowUp.onclick = function () {
                    //2009-03-02 by dongguang http://issue.internal.sina.com.cn/browse/ICPLTFMBUG-1921
                    setAllClassName();

                    scope.$className = Core.Array.up(scope.$className, parseInt(this.getAttribute("__sort_index")), 1);
                    _self.reload();

                };
            }
            if (num == scope.$className.length - 1) {
                var sortArrowDown = Builder.node('a', {
                    href: 'javascript:;',
                    'class': "down_disabled"
                });
            } else {
                var sortArrowDown = Builder.node('a', {
                    href: 'javascript:;',
                    'class': "down",
                    __sort_index: num
                });
                var _self = this;
                sortArrowDown.onclick = function () {
                    //2009-03-02 by dongguang http://issue.internal.sina.com.cn/browse/ICPLTFMBUG-1921
                    setAllClassName();

                    scope.$className = Core.Array.down(scope.$className, parseInt(this.getAttribute("__sort_index")), 1);
                    _self.reload();
                };
            }

            //2009-03-02 by dongguang  http://issue.internal.sina.com.cn/browse/ICPLTFMBUG-1921
            function setAllClassName() {
                var eleList = $("categoryList").getElementsByTagName("li");
                for (var i = 0; i < eleList.length; i++) {
                    scope.$className[i].label = eleList[i].getElementsByTagName("span")[0].innerHTML;
                }
            }

            //trace(">>>>>>>>>>>>>>>>..2");
            Builder._children(sortSpan, [sortArrowUp, sortArrowDown]);

            Builder._children(control, [manage, sortSpan]);
            Builder._children(manage, [editBtn, delBtn]);
            //Builder._children(arrow,[sortSpan]);

            var text = Builder.node('span', '', txt);
            var catName = Builder.node('input', {
                type: 'hidden',
                'class': 'catName',
                name: 'typename[]',
                value: txt
            });
            var catNum = Builder.node('input', {
                type: 'hidden',
                name: 'number[]',
                value: index
            });

            var li = Builder.node('li', [text, catName, catNum, control]);
            Builder._children(me.listArea, [li]);
            $(editBtn).observe('click', me.editCategory.bindAsEventListener(this, num));
            $(delBtn).observe('click', me.delCategory.bindAsEventListener(this, num));

            //trace(">>>>>>>>>>>>>>>>>>>>>>>..3");
            $(text).innerHTML = txt;
            $(catName).value = txt;

            this.categorys.push(txt);
            this.updateLineCol();
            me.setSize();
        },
        /**
         * 更新每行显示的间隔颜色
         * @author xs
         */
        updateLineCol: function () {
            var me = this;
            //trace(Core.String.decodeHTML(me.listArea.innerHTML));
            //var e = this.listArea.childElements();
            var rs = [];
            var cldr = this.listArea.childNodes || this.listArea.children;
            var len = cldr.length;
            for (var i = 0; i < len; ++i) {
                var o = cldr[i];
                rs[rs.length] = o;
            }
            var l = cldr.length;
            for (var i = 0; i < l; i++) {
                cldr[i].className = (i % 2 ? 'cline' : '');
            }
        },
        /**
         * 编辑分类
         * @author xs
         */
        editCategory: function (e, nNum) {
            //alert("enter editCategory");
            var me = this;
            var eCats = this.categorys;
            var li = $(Event.findElement(e, 'li'));
            var currTxt = li.down('span');
            var hasIpt = currTxt.down('input');
            var currCatName = Core.Dom.getElementsByClass(li, 'input', 'catName')[0];
            var txt = currCatName.value;
            var isAdd = Core.Array.findit(eCats, txt);
            trace("isAdd in editCategory=" + isAdd);
            var sCtrl = Core.Dom.getElementsByClass(li, 'span', 'control')[0];
            //容错
            if (isAdd == -1 || hasIpt || !currCatName) {
                Event.stop(e);
                return;
            }
            var edtIpt = Builder.node('input', {
                value: txt,
                maxLength: "28",
                type: 'text'
            });
            var edtBtn = Builder.node('input', {
                value: '确定',
                'class': 'but_all but_2',
                type: 'button'
            });
            var cleBtn = Builder.node('input', {
                value: '取消',
                'class': 'but_all but_2',
                type: 'button'
            });

            //隐藏控制链接
            sCtrl.addClassName('hide');

            //确定
            edtBtn.onclick = function () {
                var newTxt = edtIpt.value;
                trace("newTxt=" + newTxt);
                if (newTxt.indexOf("&") != -1 || txt.indexOf("＆") != -1) {
                    if (edtBtn.errShowed) {
                        var par = edtBtn.parentNode;
                        par.removeChild(edtBtn.errNode);
                    }
                    var err = Builder.node('div', {
                        'className': 'errTips'
                    }, ['分类名称不能包含&符号']);
                    var par = edtBtn.parentNode;
                    par.insertBefore(err, par.firstChild);
                    li.style.height = '65px';
                    edtBtn.errShowed = true;
                    edtBtn.errNode = err;
                    me.setSize();
                    return;
                }
                var edtCat = Core.Array.findit(me.categorys, newTxt);
                //显示隐藏错误提示
                if (edtCat != -1) {
                    if (newTxt == txt) {
                        currTxt.innerHTML = edtIpt.value.escapeHTML();
                        currCatName.value = newTxt;
                        //恢复控制链接
                        Core.Dom.removeClassName(sCtrl, 'hide');
                        return;
                    }
                    if (edtBtn.errShowed) {
                        var par = edtBtn.parentNode;
                        par.removeChild(edtBtn.errNode);

                    }
                    var err = Builder.node('div', {
                        'className': 'errTips'
                    }, ['您已经添加过此分类']);
                    var par = edtBtn.parentNode;
                    par.insertBefore(err, par.firstChild);
                    li.style.height = '65px';
                    edtBtn.errShowed = true;
                    edtBtn.errNode = err;
                    me.setSize();
                    return;
                }
                if (edtBtn.errShowed) {
                    var par = edtBtn.parentNode;
                    if (edtBtn.err)
                        par.removeChild(edtBtn.errNode);
                    li.style.height = '30px';
                    edtBtn.errShowed = false;
                }
                currTxt.innerHTML = edtIpt.value.escapeHTML();
                currCatName.value = edtIpt.value;
                //更新分类

                //修正bug 创建名为A 的分类后，编辑为B，再次输入A ，不能创建成功
                var len = scope.$className.length;
                for (var i = 0; i < len; i++) {
                    if (scope.$className[i].label == txt) {
                        scope.$className[i].label = edtIpt.value;
                    }
                }
                me.categorys = Core.Array.ArrayWithout(eCats, txt);
                me.categorys.push(edtIpt.value);

                //恢复控制链接
                Core.Dom.removeClassName(sCtrl, 'hide');
                //编辑后点关闭有提示
                if (edtIpt.value != txt) {
                    if ($IE) {
                        scope.$cat.checkClose(true);
                    }
                }
                me.setSize();
            };
            //取消
            cleBtn.onclick = function () {
                if (edtBtn.errShowed) {
                    var par = edtBtn.parentNode;
                    if (edtBtn.errNode)
                        par.removeChild(edtBtn.errNode);
                    li.style.height = '24px';
                    edtBtn.errShowed = false;
                }
                currTxt.innerHTML = txt.unescapeHTML();
                currCatName.value = txt;
                //恢复控制链接
                sCtrl.removeClassName('hide');
                me.setSize();
            };
            $(currTxt).innerHTML = '';

            Builder._children(currTxt, [edtIpt, ' ', edtBtn, ' ', cleBtn]);
            //限制输入24个字符
            Utils.Form.limitMaxLen(edtIpt, 28);
            //限制输入特殊字符
            Utils.Form.RegLimit(edtIpt, this.re);

            //禁止空分类
            Core.Events.addEvent(edtIpt, function () {
                if (!edtIpt.value)
                    edtBtn.disabled = true; else
                    edtBtn.disabled = false;
            }, "keyup");

            //BLOGBUG-5006 号bug
            Core.Events.addEvent(edtIpt, function () {
                var e = Core.Events.getEvent();
                trace(e.keyCode)
                if (e.type == 'keydown' && e.keyCode == 13) {
                    edtBtn.onclick();
                    Core.Events.stopEvent();
                }
            }, "keydown");
            Event.stop(e);
            me.setSize();
        },
        /**
         * 删除分类
         * @author xs
         */
        delCategory: function (e, nNum) {
            var me = this;
            var li = $(Event.findElement(e, 'li'));
            var currCatName = Core.Dom.getElementsByClass(li, 'input', 'catName')[0];
            var txt = currCatName.value;
            trace("delCategory txt=" + txt);
            var btns = [
                {
                    label: "是",
                    func: function () {
                        var isAdd = Core.Array.findit(me.categorys, txt);
                        trace("delCategory isAdd=" + isAdd);
                        if (isAdd == -1)
                            return;

                        me.listArea.removeChild(li);
                        me.categorys = Core.Array.ArrayWithout(me.categorys, txt);
                        //编辑后点关闭有提示
                        if ($IE) {
                            scope.$cat.checkClose(true);
                        }
                        //重新显示行颜色
                        //this.updateLineCol();
                        scope.$className.splice(nNum, 1);
                        me.reload();
                        me.setSize();
                    }
                },
                {
                    label: "否",
                    func: function () {
                    },
                    focus: true
                }
            ];

            var fromEditor = (location.search.indexOf('action=editor') != -1);
            if (!fromEditor) {
                document.domain = "sina.com.cn";
            }
            var ran = parseInt(Math.random() * 1000);
            parent.window.winDialog.confirm($SYSMSG['B18002'], {
                funcOk: function () {
                    //alert(ran);
                    var isAdd = Core.Array.findit(me.categorys, txt);
                    trace("delCategory isAdd=" + isAdd);
                    if (isAdd == -1)
                        return;
                    me.listArea.removeChild(li);
                    me.categorys = Core.Array.ArrayWithout(me.categorys, txt);
                    //编辑后点关闭有提示
                    if ($IE) {
                        scope.$cat.checkClose(true);
                    }
                    //重新显示行颜色
                    //this.updateLineCol();
                    scope.$className.splice(nNum, 1);
                    me.reload();
                    me.setSize();
                    //parent.CateDialog.close();
//					alert("func finish");
                },
                funcCancel: function () {
                    //parent.CateDialog.close();
                },
                textOk: "是",
                textCancel: "否",
                defaultButton: 1, // 默认是1，表示确定按钮默认聚焦，0 表示取消按钮默认聚焦
                title: "提示",
                icon: "03" // 可选值："01"、"02"、"03"、"04"、"05"
            });
            //			alert($SYSMSG.B18002);return;
            //showError('B18002', '03', btns, 'parent');
            Event.stop(e);
            me.setSize();
        },
        /**
         * 获取已添加分类列表
         * @author xs
         */
        getCategoryList: function () {
            return Object.keys(this.categorys);
        },
        /**
         * 显示错误提示
         * @author xs
         */
        showError: function (errTxt) {
            trace(errTxt + ";");
            if (errTxt) {
                this.errTip.innerHTML = errTxt;
                this.errTip.style.display = "";
            } else {
                this.errTip.innerHTML = '';
                this.errTip.style.display = "none";
            }
            $('categoryName').focus();
        },
        /**
         * 判断对话框是否关闭并绑定事件
         * @author xs
         */
        checkClose: function (showTips) {
            if (parent.CateDialog) {
                var dlg = parent.CateDialog.getDialog();
            } else {
                var dlg = parent.scope.cat_dialog;
            }
            var fromEditor = (location.search.indexOf('action=editor') != -1);

            var closeBtn = dlg.nodes.btnClose;

            // 要显示关闭确认
            if (showTips) {
                //dlg.setCloseEvent(false);
                closeBtn.onclick = function () {

                    var fromEditor = (location.search.indexOf('action=editor') != -1);
                    if (!fromEditor) {
                        document.domain = "sina.com.cn";
                    }
                    var ran = parseInt(Math.random() * 1000);
                    var windowDilaogtempObj = parent.winDialog.confirm($SYSMSG['B18008'], {
                        funcOk: function () {
                            scope.$cat.saveCat();

                        },
                        textOk: "是",
                        textCancel: "否",
                        funcCancel: function () {
                            //dlg.setCloseEvent(true);
                            dlg.hidden();
                        },
                        defaultButton: 1, // 默认是1，表示确定按钮默认聚焦，0 表示取消按钮默认聚焦
                        title: "提示",
                        icon: "04" // 可选值："01"、"02"、"03"、"04"、"05"
                    }, "cateConfirm");

                    var cateConfirm = parent.winDialog.getDialog("cateConfirm");
                    var btnClose = cateConfirm.getNodes().btnClose;
                    Core.Events.addEvent(btnClose, function () {
                        top.CateDialog.showOld();
                    }.bind2(this))
                    //showError('B18008', '01', btns, 'parent2');
                };
            } else {
                //dlg.setCloseEvent(true);
                closeBtn.onclick = '';
            }
            return;

        },
        setSize: function () {
            top.CateDialog.setSize(480, document.body.offsetHeight);
        }
    });
    scope.$cat = new App.$CM();
});

$registJob("initElements", function () {
    trace("traced by job[initElements]");
    //**** 初始化页面元素 *****	

    /**
     * 预加载分类数据
     * @author xs
     */
    if (scope.$className) {
        var arr = [];
        for (var key in scope.$className) {
            arr[arr.length] = {
                label: scope.$className[key],
                index: key
            };
        }
        scope.$className = arr;
        trace("scope.$className.length=" + scope.$className.length);
        for (var i = 0; i < scope.$className.length; i++) {
            scope.$cat.addCategory(scope.$className[i].label, i, scope.$className[i].index);
        }
    }

});

$registJob("initEvents", function () {
    trace("traced by job[initEvents]");

    /**
     * 输入框默认 提示内容及颜色
     * @author xs
     */
    var catName = $('categoryName');
    catName.dftVal = '最多可输入14个中文字符';
    catName.observe('focus', function (e) {
        if (catName.value == catName.dftVal)
            catName.value = '';
        setTimeout(function () {
            catName.select();
        }, 10);
        catName.style.color = '#444';
    });

    catName.observe('blur', function (e) {
        if (!catName.value) {
            catName.style.color = '#999';
            catName.value = catName.dftVal;
        }
    });

    /**
     * 创建分类按钮添加事件
     * @author xs
     */
    $('categoryCreate').observe('click', function () {
        var cn = $('categoryName');
        var txt = Core.String.trim(cn.value);
        if (!txt || txt == '最多可输入14个中文字符') {
            scope.$cat.showError('分类名称不能为空'); //请先输入分类名称
            scope.$cat.setSize();
            return;
        } else {
            scope.$cat.showError('');
        }
        if (txt.indexOf("&") != -1 || txt.indexOf("＆") != -1) {
            scope.$cat.showError('分类名称不能包含&符合');
            scope.$cat.setSize();
            return;
        }
        if (txt == "") {
            scope.$cat.showError('分类名称不能空');
            scope.$cat.setSize();
            return;
        }

        if (scope.$className.length >= 15) {
            scope.$cat.showError('抱歉！最多可创建15条分类。');
            scope.$cat.setSize();
            return;
        }
        var isAdd = false;
        for (var i = 0; i < scope.$className.length; i++) {
            if (scope.$className[i].label == txt) {
                scope.$cat.setSize();
                isAdd = true;
            }
        }
        if (isAdd == true) {
            scope.$cat.showError('您已经添加过此分类');
            scope.$cat.setSize();
            return;
        }
        scope.$className[scope.$className.length] = {
            label: txt,
            index: -1
        };
        scope.$cat.reload();
        //scope.$cat.addCategory(txt);
        if ($IE) {
            scope.$cat.checkClose(true);
        }

        cn.value = '';
    });
    //限制输入24个字符
    Utils.Form.limitMaxLen($("categoryName"), 28);

    //限制输入特殊字符
    var re = /[ ><\\\'\,\;\"`\|\t\r\n|\u3000]/ig;
    Utils.Form.RegLimit($("categoryName"), re);
    /**
     * 保存设置按钮添加事件
     * @author xs
     */
    //获取值
    var getFrameValue = function (FrameNode) {
        var d = Core.Dom.getWin(FrameNode).document;
        //如果返回结果中有textarea标签则返回其值 
        //add by xs @ 080219
        var tArea = Core.Dom.getElementsByClass(d, 'textarea', '')[0];
        //var tArea = d.getELementsByTagName('textarea')[0];
        if (tArea) {
            text = Core.String.trim(tArea.value);
        } else {
            var body = d.body;
            var text = Core.String.trim(body.innerHTML);
        }
        //alert(text);
        return text;

    };
    //创建iframe
    var cIFM = function (sFrameName) {
        if ($(sFrameName))
            Core.Dom.removeNode($(sFrameName));
        Core.Dom.addHTML(document.body, "<iframe name='" + sFrameName + "' id='" + sFrameName + "' class='hide' style='display:none'></iframe>");
    };
    //执行回调(并防止空回调)
    function tagFunc(FrameNode, oFunc) {
        try {
            var htmlStr = getFrameValue(FrameNode);
            if (htmlStr != null) {
//            	alert(htmlStr);
                if (oFunc) {
                    oFunc(htmlStr);
                }
            }
        } catch (e) {
        }
    };

    //保存分类按钮添加事件
    var saveCat = function () {
        trace("save");
        var fromEditor = (location.search.indexOf('action=editor') != -1);

        if ($('postFrame')) {
            Core.Dom.removeNode($('postFrame'));
        }

        if (!$('postFrame')) {

            cIFM("postFrame");
            // alert("fromEditor="+fromEditor);
            if (!fromEditor) {
                document.domain = "sina.com.cn";
            }
            //alert("fromEditor=" + fromEditor);
            Core.Events.addEvent("postFrame", Core.Function.bind3(tagFunc, this, ["postFrame", function (text) {
                try {
                    if (text == "")
                        return;
                    var req = eval('(' + text + ')');
                    //alert("CategoryM.js iframe response : " + text, "#900", "white");
                    //alert("req.msg=" + req.msg);
                    if (req.code == 'A00006') {

                        //点关闭按钮不提示
                        if ($IE) {
                            scope.$cat.checkClose(false);
                        }
                        //如果是在编辑器中被打开，则回调方的函数
                        if (fromEditor) {
                            //alert('action=editor ...');
//                            
//                            try {
//                            
                            parent.ArticleCateFuncs.reloadCate(req.msg);
//                            } 
//                            catch (e) {
//                                trace("don't have articlecatefuncs:" + e.message);
//                            }

                        } else {

                            try {
                                document.domain = "sina.com.cn";

                                if (parent.$E("module_3")) {
                                    parent.Lib.Component.refresh(3, {
                                        width: parent.scope.catedialogwidth || 210
                                    });
                                }

                                if (parent.$E("module_7")) {
                                    parent.location.reload();
                                }

                                parent.CateDialog.hidden();
                            } catch (e) {
                                traceError(e);
                            }
                        }
                    } else {

                        if (fromEditor) {
//                            document.domain = "";
                        }
                        //showError
                        var msg = $SYSMSG[req.code]
                        top.winDialog.alert(msg, {
                            icon: "01"
                        });
                    }
                } catch (e) {
                    traceError(e);
                }

            }
            ]), "load");
        }

        if (fromEditor) {

            var url = 'http://control.blog.sina.com.cn/admin/article/article_class_save.php?uid=' + scope.$uid + '&action=editor&r=' + Math.random();
        } else {

            var url = 'http://control.blog.sina.com.cn/admin/article/article_class_save.php?uid=' + scope.$uid + '&r=' + Math.random();
        }
        var s = $("categoryForm");

        s.action = url;
        s.target = "postFrame";

        s.submit();
    };
    scope.$cat.saveCat = saveCat;
    $('categorySave').observe('click', saveCat);

});

