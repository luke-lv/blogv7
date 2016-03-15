/**
 * @fileoverview 用户向导的页签
 * @author xinyu@staff.sina.com.cn
 *
 */
$import("sina/core/class/create.js");
$import("sina/core/array/findit.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/fixEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/function/bind2.js");
$import("sina/core/function/bind3.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/system/br.js");
$import("lib/insertMoban.js");
$import("pageSet/tabs.js");
$import("pageSet/guide/guideCss.js");
$import("pageSet/singleFunc/funcCustomStyle.js");
$import("pageSet/singleFunc/funcChangeFormat.js");
$import("pageSet/singleFunc/funcRefreshCompList.js");

var guideTabs = Core.Class.create();
guideTabs.prototype = {
    initialize: function (obj) {
        this.createTabs(obj);
    },
    hiddenContent: function (arr) {
        for (i = 0; i < arr.length; i++) {
            $E(arr[i]).style.display = "none";
        }

    },
    showContent: function (arr) {
        for (i = 0; i < arr.length; i++) {
            $E(arr[i]).style.display = "block";
        }
    },
    createTabs: function (obj) {
        var _this = this;

        var tabs = new Tabs2(obj, {});

        for (k in scope.guide_conf) {//加入各个tab
            var op = {
                className: "cur",//k==0?"fir cur":"cur",
                onabort: Core.Function.bind3(_this.hiddenTag, _this, [k]),
                onfocus: Core.Function.bind3(_this.showTag, _this, [k])
            };
            if ("2" == k) {
                op.isFocus = true;
                this.initItems(k);
            }

            var title = '<span>' + scope.guide_conf[k].name + '</span>';
            this[k + "_tab"] = new Tab2(title, op);
            tabs.add(this[k + "_tab"]);

        }

    },
    /**
     * 初始化某个模板分类
     * @param {Object} id
     */
    initItems: function (id) {
        var _this = this;
        var items = $E('oldUserWizd_' + id);
        if (!items) {
            Core.Dom.insertHTML($E('recomThemes'), '<ul id="oldUserWizd_' + id + '"></ul>', 'BeforeEnd');
            var ul = $E('oldUserWizd_' + id);
            for (var i = 0; i < scope.guide_conf[id].data.length; i++) {
                var li = $C('li');
                li.id = "theme|" + scope.guide_conf[id].data[i];
                li.innerHTML = '<div class="frame"><a title="' + scope.guide_conf[id].names[i] + '" href="#" onclick="return false;"><img class="thumb" alt="' + scope.guide_conf[id].names[i] + '" src="http://simg.sinajs.cn/blog7newtpl/css/' + scope.guide_conf[id].data[i].split('_')[0] + '/' + scope.guide_conf[id].data[i] + '/thumb.jpg"/></a><img alt="" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="selectedIco SG_icon SG_icon106" width="18" height="18"/></div><p>' + scope.guide_conf[id].names[i] + '</p>';
                if (scope.guide_conf[id].data[i] == __pageSetVar.selectedTpl) {
                    li.className = "selected";
                }
                Core.Events.addEvent(li, Core.Function.bind3(_this.bgEvent, _this, [li,
                    scope.guide_conf[id].data[i]]), 'click');

                Core.Events.addEvent(li, Core.Function.bind3(_this.previewEvent, _this, [id,
                    scope.guide_conf[id].data[i]]), 'mouseover');
                Core.Events.addEvent(li, function () {
                    if ($E('oldreview')) {
                        if (window.location.href.indexOf('isnew=1') > -1) {
                            $E('oldreview').src = scope.guide_conf[id].previewnew;
                        } else {
                            $E('oldreview').src = scope.guide_conf[id].preview;
                        }
                    }
                }, 'mouseout');
                ul.appendChild(li);
            }
        }
    },
    /**
     * 左侧预览效果
     * @param {Object} id
     * @param {Object} themeid
     */
    previewEvent: function (id, themeid) {
        if ($E('oldreview')) {
            $E('oldreview').src = "http://simg.sinajs.cn/blog7style/images/blog/" + id + "/" + themeid + ".jpg";
        }
    },
    /**
     * 模板分类之间切换，某个模板分类的隐藏。
     * @param {String} id 模板分类号
     */
    hiddenTag: function (id) {
        var items = $E('oldUserWizd_' + id);
        if (items) {
            items.style.display = "none";
        }
        //隐藏相应的组件--------------------------------------------------------------
        for (var i = 0; i < scope.guide_conf[id].comp.length; i++) {
            if (Core.Array.findit(__pageSetVar.component_list, scope.guide_conf[id].comp[i]) == -1) {
                if ($E('module_' + scope.guide_conf[id].comp[i])) {
                    $E('hiddendiv').appendChild($E('module_' + scope.guide_conf[id].comp[i]));
                }
            }
        }
        //-------------------------------------------------------------------------------
    },
    /**
     * 模板分类之间切换，某个模板分类的显示。
     * @param {String} id 模板分类号
     */
    showTag: function (id) {
        var items = $E('oldUserWizd_' + id);
        if (!items) {
            this.initItems(id);
            items = $E('oldUserWizd_' + id);
        }
        items.style.display = "block";
        if ($E('oldreview')) {
            if (window.location.href.indexOf('isnew=1') > -1) {
                $E('oldreview').src = scope.guide_conf[id].previewnew;
            } else {
                $E('oldreview').src = scope.guide_conf[id].preview;
            }
        }
        //换版式----------------------------------------------------------------------
        funcChangeFormat.changeFormat(__pageSetVar.formatInfo + "-" + scope.guide_conf[id].format);
        __pageSetVar.formatInfo = scope.guide_conf[id].format;
        //--------------------------------------------------------------------------

        //增加相应的组件--------------------------------------------------------------
        var tmparr = Core.Array.ArrayWithout(scope.guide_conf[id].comp, __pageSetVar.component_list);//BLOGBUG-5905  将本来存在的组件从需要加入的数组中去掉
        for (var i = 0; i < tmparr.length; i++) {
            if (__pageSetVar.component_list.length + i < 25) {
                if (tmparr[i] == 88 || tmparr[i] == 10004) {
                    this.addComponent(tmparr[i], scope.guide_conf[id].compnames[tmparr[i]], "column_1");
                } else {
                    this.addComponent(tmparr[i], scope.guide_conf[id].compnames[tmparr[i]], "column_2");
                }
            }
        }
        //对4号版式进行修正  2009-10-15-------------------------------------------------------
        if (id == "3" && parseInt(__pageSetOrginal.formatInfo) == 4 && __pageSetOrginal.component_lists['3']) {
            for (var i = 0; i < __pageSetOrginal.component_lists['3'].list.length; i++) {
                if (__pageSetOrginal.component_lists['3'].list[i] == 901 && (scope.isAdshare == "true" || scope.isCompany == "true"))
                    continue;
                if ($E('module_' + __pageSetOrginal.component_lists['3'].list[i]).parentNode != $E('hiddendiv'))
                    $E('column_3').appendChild($E('module_' + __pageSetOrginal.component_lists['3'].list[i]));
            }
        }
        if (id == "3" && parseInt(__pageSetOrginal.formatInfo) == 4 && __pageSetOrginal.component_lists['2']) {
            for (var i = 0; i < __pageSetOrginal.component_lists['2'].list.length; i++) {
                if ($E('module_' + __pageSetOrginal.component_lists['2'].list[i]).parentNode != $E('hiddendiv'))
                    $E('column_2').appendChild($E('module_' + __pageSetOrginal.component_lists['2'].list[i]));
            }
        }
        //---------------------------------------------------------------------------------------
        funcChangeFormat.addNoneDiv();
        //-------------------------------------------------------------------------------
        funcRefreshCompList();
        $callJob("Comp_render");//刷新页面组件

    },
    /**
     * 增加组件函数
     * @param {String} id 组件id
     * @param {String} name 组件name
     * @param {String} column 需要增加到哪列的id
     */
    addComponent: function (id, name, column) {
        var div = $E('module_' + id);
        if (!div) {
            div = $C('div');
            div.id = "module_" + id;
            div.className = 'SG_conn';
            div.innerHTML = '<div class="SG_connHead"><span class="title">' + Core.String.encodeHTML(name) + '</span><span class="edit"></span></div><div class="SG_connBody"></div><div class="SG_connFoot"></div>';
        }

        if ($E('module_901') && $E('module_901').parentNode == $E(column)) {
            Core.Dom.insertAfter(div, $E('module_901'));
        } else {
            if ($E(column).childNodes.length > 0) {
                $E(column).insertBefore(div, $E(column).childNodes[0]);
            } else {
                $E(column).appendChild(div);
            }
        }
//        Lib.Component.refresh(id, {
//            width: $E(column).offsetWidth
//        });
        dragBase.add(id);
    },
    /**
     * 点击某个图片后产生的背景变化事件
     * @param {Object} li 点击的li
     * @param {Object} id 被点击的li所代表的背景图
     */
    bgEvent: function (li, id) {

        //用户当前选择的是进入该页面时的模板
        if (id == __pageSetVar.selectedTpl && __pageSetVar.selectedTpl == scope.tpl || (Core.Array.findit(scope.overdue_theme_cnf, __pageSetVar.selectedTpl) > -1 && __pageSetVar.selectedTpl != scope.tpl)) {
            return;
        }
        //用户选择了某个模板后再把它取消
        __pageSetVar.tempid = id;
        if (id == __pageSetVar.selectedTpl) {
            this.removeBg();
        } else if (Core.Array.findit(scope.overdue_theme_cnf, __pageSetVar.selectedTpl) > -1) {
            winDialog.confirm("你目前使用的商业模板已经过期，如果更换将无法恢复。是否更换？", {
                funcOk: function () {
                    this.changeBg();
                }.bind2(this)
            });
        } else {
            this.changeBg();
        }

    },
    /**
     * 恢复原来背景
     */
    removeBg: function () {
        trace('removeBg');
        guideCss(scope.tpl);
        if (__pageSetVar.selectedTpl != "") {
            this.setSelect(__pageSetVar.selectedTpl, '');
        }
        this.setSelect(scope.tpl, 'selected');
        __pageSetVar.selectedTpl = scope.tpl;
        if (scope.tpl.split('_')[0] == '13' || $_GLOBAL.flashtemplate[scope.tpl]) {//动感模板特殊处理
            var headflash = $E('headflash');
            //插入动感模板
            Lib.insertMobanFunc(scope.tpl);
        } else {//其它模板，如果有自定义的图等，则恢复这些图
            var divarr = ['', '', 'sinablogb', 'blognavBg', 'sinablogHead'];
            for (i = 2; i < 5; i++) {
                if (__pageSetOrginal["customPic_" + i].pid != "no" && __pageSetOrginal["customPic_" + i].apply == "1") {
                    trace('i=' + i + ";" + $E(divarr[i]).style.cssText + ";");
                    if ($IE6 || $E(divarr[i]).style.cssText == '') {
                        __pageSetVar["customPic_" + i].apply = "1";
                        __pageSetVar.funcSetUsePic(i + '');
                    }
                    if (i == 2 && scope.$headheight) {//说明用户使用了大背景图，则应用头图高度 
                        $E('sinablogHead').style.height = scope.$headheight + 'px';
                        $E('headarea').style.height = scope.$headheight + 'px';
                        if ((parseInt(Core.Dom.getStyle($E('blogTitle'), "top")) + $E('blogTitle').offsetHeight) > scope.$headheight) {
                            $E('blogTitle').style.top = (scope.$headheight - $E('blogTitle').offsetHeight) + 'px';
                        }
                        if ((parseInt(Core.Dom.getStyle($E('blognav'), "top")) + $E('blognav').offsetHeight) > scope.$headheight) {
                            $E('blognav').style.top = (scope.$headheight - $E('blognav').offsetHeight) + 'px';
                        }
                    }
                } else {
                    __pageSetVar.funcNoUsePic(i + '');
                }
            }
        }

    },
    /**
     * 背景变化
     */
    changeBg: function () {
        if (__pageSetVar.selectedTpl != "") {
            this.setSelect(__pageSetVar.selectedTpl, '');
        }
        __pageSetVar.selectedTpl = __pageSetVar.tempid;
        trace("__pageSetVar.selectedTpl=" + __pageSetVar.selectedTpl);
        this.setSelect(__pageSetVar.selectedTpl, 'selected');
        for (var i = 2; i < 5; i++) {
            __pageSetVar["customPic_" + i].apply = '0';
            __pageSetVar.funcNoUsePic(i + '');
        }

        guideCss(__pageSetVar.selectedTpl);

        //博客标题位置使用默认
        $E('blogTitle').style.cssText = '';

        var headflash = $E('headflash');
        if (headflash) {
            headflash.innerHTML = '';
            headflash.style.display = "none";
        }

        if ($IE6) {
            if (__pageSetVar["customPic_3"].apply == "1" || scope.ie6filter.indexOf(__pageSetVar.selectedTpl) < 0) {
                $E('blognavBg').style.filter = "none";
            } else {
                $E('blognavBg').style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=crop, src='http://simg.sinajs.cn/blog7newtpl/image/" + __pageSetVar.selectedTpl.split('_')[0] + "/" + __pageSetVar.selectedTpl + "/images/blognavbg.png')";
            }
        }
        __pageSetVar.tempid = null;
    },
    /**
     * 根据传入的id以及样式名，修改对应的模板、色系的选择样式
     * @param {Object} id
     * @param {Object} classname
     */
    setSelect: function (id, classname) {
        if ($E('theme|' + id)) {
            $E('theme|' + id).className = classname;
        }
    }
};


