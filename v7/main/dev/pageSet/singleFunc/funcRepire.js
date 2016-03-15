/**
 * @fileoverview 页面设置的修复功能，修复个人资料以及博文列表1
 * @author xy xinyu@staff.sina.com.cn
 */
$import("pageSet/componentsClickEvent.js");
(function () {
    window.funcRepire = function () {
        winDialog.confirm('修复博文和个人资料组件？', {
            funcOk: function () {
                var str = '|' + __pageSetVar.component_list.join("|") + '|';
                var f9 = false, f1 = false;
                for (var i = 1; i < 4; i++) {
                    var o = $E('column_' + i);
                    if (o.offsetWidth == 210 && f9 == false) {
                        if (str.indexOf('|901|') > -1) {//说明目前页面上有901组件，只需要改动位置就可
                            if (scope.isAdshare == "true" || scope.isCompany == "true")//说明是广告共享计划的用户
                                continue;
                            if ($E('column_' + i).childNodes.length > 0) {
                                $E('column_' + i).insertBefore($E('module_901'), $E('column_' + i).childNodes[0]);
                            } else {
                                $E('column_' + i).appendChild($E('module_901'));
                            }

                            Lib.Component.refresh('901', {
                                width: o.offsetWidth,
                                addManage: true
                            });

                        } else {//没有901组件，需要新增
                            if ($E('components_1_901')) {
                                $E('components_1_901').checked = true;
                                $E('components_1_901').parentNode.className = "checked";
                            }
                            addComp(901, '个人资料', i);
                        }

                        f9 = true;
                    }
                    if (o.offsetWidth > 509 && f1 == false) {
                        if (str.indexOf('|10001|') > -1) {//说明页面上目前有博文列表1组件，只需要改动位置就可
                            if ($E('column_' + i).childNodes.length > 0) {
                                $E('column_' + i).insertBefore($E('module_10001'), $E('column_' + i).childNodes[0]);
                            } else {
                                $E('column_' + i).appendChild($E('module_10001'));
                            }

                            Lib.Component.refresh('10001', {
                                width: o.offsetWidth,
                                addManage: true
                            });
                        } else {//没有10001组件，需要新增
                            if ($E('components_1_10001')) {
                                $E('components_1_10001').checked = true;
                                $E('components_1_10001').parentNode.className = "checked";
                            }
                            addComp(10001, '博文', i);
                        }

                        f1 = true;
                    }

                }
                funcChangeFormat.addNoneDiv();
            },
            icon: "04"
        });
    };

})();

