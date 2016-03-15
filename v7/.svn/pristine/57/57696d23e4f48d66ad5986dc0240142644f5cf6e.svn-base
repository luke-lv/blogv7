/**
 * @fileoverview 点击组件名或者那个checkbox的事件
 * @author xinyu@staff.sina.com.cn
 */
$import("sina/core/dom/opacity.js");
$import("sina/core/string/decodeHTML.js");
$import("sina/core/system/getScrollPos.js");
$import("lib/dialogConfig.js");
$import("pageSet/dragComp/dragBase.js");
$import("pageSet/singleFunc/funcRefreshCompList.js");
$import("pageSet/uidlist.js");

(function () {

    /**
     * 增加一个组件到页面的函数
     * @param {int} id            组件的id
     * @param {String} name        组件的名字
     * @param {int} col            组件需要增加到哪列
     */
    window.addComp = function (id, name, col) {
        var div = $E('module_' + id);
        if (!div) {
            div = $C('div');
            div.id = "module_" + id;
            div.className = 'SG_conn';
            div.innerHTML = '<div class="SG_connHead"><span class="title">' + Core.String.encodeHTML(name) + '</span><span class="edit"></span></div><div class="SG_connBody"></div><div class="SG_connFoot"></div>';
        }
        Core.Dom.opacity(div, 0.1);
        if ((scope.isAdshare == "true" || scope.isCompany == "true") && $E('module_901') != null && ($E('module_901').parentNode == $E('column_' + col))) {//说明是广告共享计划用户
            Core.Dom.insertAfter(div, $E('module_901'));
        } else {
            if ($E('column_' + col).childNodes.length > 0) {
//                trace("加在第一个元素前");
                $E('column_' + col).insertBefore(div, $E('column_' + col).childNodes[0]);
            } else {
//                trace("加在尾部");
                $E('column_' + col).appendChild(div);
            }
        }

        //百科组件始终在个人资料后面   meichun1@
        if (id === 119 && $E('module_901') && $E('module_901').parentNode.id != "hiddendiv") {

            Core.Dom.insertAfter(div, $E('module_901'));
        }

        dragBase.add(id);

        Ui.tween(div, ['opacity'], [1], 1, 'simple', {
            end: function () {
                var childs2 = Core.Dom.getChildrenByClass($E('column_' + col), 'SG_conn2');
                if (childs2.length > 0) {
                    childs2[0].parentNode.removeChild(childs2[0]);
                }
                Lib.Component.refresh(id, {
                    width: $E('column_' + col).offsetWidth,
                    addManage: true
                });
            }
        });
        __pageSetVar.component_list.push(id);
    };

    /**
     * 点击事件
     * @param {Object} obj 点击的对象
     * @param {Object} id 组件id
     * @param {Object} name 组件名
     */
    var func = function (obj, id, name, serialnum) {
        //解决自定义组件名称不能携带单双引号的字符编码问题。
        name = Core.String.decodeHTML(decodeURIComponent(name));

        var e = Core.Events.fixEvent(Core.Events.getEvent());
        Core.Events.stopBubble();

        if (obj.checked == false) {//点击后需要隐藏组件
            if (serialnum < 5) {
                obj.parentNode.className = "";
                for (var i = 1; i < 5; i++)
                    if ($E('components_' + i + '_' + id) && $E('components_' + i + '_' + id).checked) {
                        $E('components_' + i + '_' + id).checked = false;
                        $E('components_' + i + '_' + id).parentNode.className = "";
                    }
            }
            hiddenComponents(id);

        } else {							// 选中 checkbox
            // if(famous[scope.$uid] == 1){
            // winDialog.alert("<span style='font-size:12px; font-weight:normal;'>\
            // 	您对自定义组件的增改需要通过审核。审核结果会以系统消息的方式通知您。<br/><br/>\
            // 	如有疑问请咨询：<br/>电话:4008812813<br/>邮箱:ads@staff.sina.com.cn</span>", {
            // 	icon: "01"
            // }, "tips");
            // }
            if (__pageSetVar.component_list.length >= 25) {
                obj.checked = false;
                winDialog.alert("为了页面打开更快，模块总数不能超过25个。", {
                    funcOK: function () {
                    },
                    icon: "01"
                }, "提示");
                return;
            }

            if (serialnum < 5) {
                obj.parentNode.className = "checked";
                for (var i = 1; i < 5; i++)
                    if ($E('components_' + i + '_' + id) && $E('components_' + i + '_' + id).checked == false) {
                        $E('components_' + i + '_' + id).checked = true;
                        $E('components_' + i + '_' + id).parentNode.className = "checked";
                    }
                if ($E('components_9_' + id) && !$E('components_9_' + id).checked) {
                    $E('components_9_' + id).checked = true;
                }
            }

            var scrollPos = Core.System.getScrollPos(document);

            var beginPos = {//特效开始位置
                width: 10,
                top: e.clientY + scrollPos[0] + 10,
                left: e.clientX + scrollPos[1] + 10
            };

            var toPos = {//特效结束位置
                width: $E('column_1').offsetWidth,
                top: Core.Dom.getTop($E('column_1')),
                left: Core.Dom.getLeft($E('column_1'))
            };

            //百科组件始终在个人资料后面   meichun1@
            if (id === 119 && $E('module_901') && $E('module_901').parentNode.id != "hiddendiv") {
                var _901 = $E('module_901'), _901parent = _901.parentNode;
                toPos = {//特效结束位置
                    width: _901parent.offsetWidth,
                    top: Core.Dom.getTop(_901parent) + _901.offsetHeight + 10,
                    left: Core.Dom.getLeft(_901parent)
                };
            }

            //模拟组件加载时位置的div--------------------------------------------------
            //不能采用同一个div,因为有的用户手超级快，瞬间点击10个组件，模拟的div就不够用了，所以每次产生一个
            if (typeof tempdiv == 'undefined')
                tempdiv = {};
            tempdiv[id] = $C('div');
            tempdiv[id].id = "temp_module_" + id;
            tempdiv[id].style.cssText = "position:absolute;background-image:url(http://simg.sinajs.cn/blog7newtpl/image/" + __pageSetVar.selectedTpl.split('_')[0] + "/" + __pageSetVar.selectedTpl + "/images/modelhead.png);z-index:1000;left:" + beginPos.left + "px;top:" + beginPos.top + "px;width:" + toPos.width + "px;height:26px;";

            tempdiv[id].innerHTML = '<div class="SG_connHead" style="cursor: move;"><span class="title">' + Core.String.encodeHTML(name) + '</span></div>';

            document.body.appendChild(tempdiv[id]);

            Ui.tween(tempdiv[id], ['left', 'top'], [toPos.left, toPos.top], 0.3, 'simple', {
                end: function () {
                    document.body.removeChild(tempdiv[id]);
                    delete tempdiv[id];
                }
            });
            //-------------------------------------------------------------------

            //真实的组件div--------------------------------------------------
            addComp(id, name, 1);
        }
        //-----------------------------------------------------------
        if ($E('customModuleText')) {
            $E('customModuleText').innerHTML = '页面最多放置25个组件，您已放置<strong>' + __pageSetVar.component_list.length + '</strong>个组件';
        }
    };

    var func2 = function (id) {
        if ((scope.isAdshare == "true" || scope.isCompany == "true") && id == '901') {//说明是广告共享计划用户
            return;
        }
        if (id == '10001' || id == '901') {
            __pageSetVar.tmppid = id;
            var smsg = "确实要隐藏" + (id == '901' ? "个人资料组件" : "博文列表") + "吗？隐藏后该组件将不会在首页中显示。";
            winDialog.confirm(smsg, {
                funcOk: function () {
                    hiddenComponents2(__pageSetVar.tmppid);
                },
                funcCancel: function () {
                    if ($E('components_1_' + __pageSetVar.tmppid))
                        $E('components_1_' + __pageSetVar.tmppid).checked = true;
                },
                textOk: "是",
                textCancel: "否",
                icon: "01"
            }, "tips");
        } else {
            hiddenComponents2(id);
        }

    };
    var func3 = function (id) {
        __pageSetVar.component_list = Core.Array.ArrayWithout(__pageSetVar.component_list, [id]);
        if ($E('customModuleText')) {
            $E('customModuleText').innerHTML = '页面最多放置25个组件，您已放置<strong>' + __pageSetVar.component_list.length + '</strong>个组件';
        }
        //当隐藏了该列最后一个节点时，需要将占位div显示出来----------
        var column = $E('module_' + id).parentNode;

        var childs = Core.Dom.getChildrenByClass(column, 'SG_conn');
        var childs2 = Core.Dom.getChildrenByClass(column, 'SG_conn2');
        if (childs.length == 1 && childs2.length == 0) {
            var div = $C('div');
            div.className = 'SG_conn2';
            div.innerHTML = '<div class="noWidget_box"><div class="noWidget_txt">您可将模块放置在此！</div>';
            column.appendChild(div);
        }
        var hiddendiv = $E('hiddendiv');
        hiddendiv.appendChild($E('module_' + id));
        //----------------------------------------------------------------------
        for (var i = 1; i < 5; i++)
            if ($E('components_' + i + '_' + id) && $E('components_' + i + '_' + id).checked) {
                $E('components_' + i + '_' + id).checked = false;
                $E('components_' + i + '_' + id).parentNode.className = "";
            }

        if ($E('components_9_' + id) && $E('components_9_' + id).checked) {
            $E('components_9_' + id).checked = false;
        }
    };
    window.clickComponentsEvent = func;
    window.hiddenComponents = window.hideComp = func2;
    window.hiddenComponents2 = func3;
})();
