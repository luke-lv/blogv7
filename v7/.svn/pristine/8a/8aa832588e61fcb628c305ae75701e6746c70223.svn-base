/**
 * @fileoverview 独立函数，转换版式函数
 * @author xinyu@staff.sina.com.cn
 */
$import("pageSet/singleFunc/funcRefreshCompList.js");
$import("sina/core/dom/getChildrenByClass.js");
$import("sina/core/dom/insertAfter.js");
(function () {
    var func = {
        changeFormat: function (type) {

            var toformat = type.split('-')[1];
            trace("toformat=" + toformat);
            // 针对 BLOGBUG-5000-----------------------------------------------------------------------------------------------
            if (parseInt(__pageSetOrginal.formatInfo) > 2 && parseInt(__pageSetVar.formatInfo) < 3 && parseInt(toformat) > 2) {
                trace('说明初始时的是三栏，上次选择的是两栏，而本次选择的又是三栏---》需要执行3栏后的事件');
                //说明初始时的是三栏，上次选择的是两栏，而本次选择的又是三栏---》需要执行3栏后的事件
                if (__pageSetOrginal.component_lists['3'] && __pageSetOrginal.component_lists['3'].list) {
                    trace('说明初始时的三栏的第三栏是有东西的');
                    //说明初始时的三栏的第三栏是有东西的
                    for (var i = 0; i < __pageSetOrginal.component_lists['3'].list.length; i++) {
                        var obj = $E('module_' + __pageSetOrginal.component_lists['3'].list[i]);
                        if (obj && obj.parentNode != $E('hiddendiv')) {

                            if (parseInt(__pageSetOrginal.formatInfo) == 5) {//原来最开始时112这种版式
                                if (parseInt(__pageSetVar.formatInfo) == 1) {
                                    $E('column_2').appendChild(obj);
                                } else {
                                    $E('column_1').appendChild(obj);
                                }
                            } else if (parseInt(__pageSetOrginal.formatInfo) == 4) {//原来开始是211这种
                                if (parseInt(__pageSetVar.formatInfo) == 1) {
                                    $E('column_1').appendChild(obj);
                                } else {
                                    $E('column_2').appendChild(obj);
                                }
                            } else {
                                $E('column_3').appendChild(obj);
                            }

                        }
                    }
                }

                if (__pageSetOrginal.component_lists['2'] && __pageSetOrginal.component_lists['2'].list) {

                    for (var i = 0; i < __pageSetOrginal.component_lists['2'].list.length; i++) {
                        var obj = $E('module_' + __pageSetOrginal.component_lists['2'].list[i]);
                        if (obj && obj.parentNode != $E('hiddendiv')) {
                            if (parseInt(__pageSetOrginal.formatInfo) == 5) {//原来最开始时112这种版式
                                $E('column_3').appendChild(obj);
                            } else if (parseInt(__pageSetOrginal.formatInfo) == 4) {//原来开始是211这种
                                $E('column_3').appendChild(obj);
                            }
                        }
                    }
                }
            }
            //--------------------------------------------------------------------------------------------------------

            if (__pageSetVar.formatInfo != toformat) {
                if ($E('formsetting_' + __pageSetVar.formatInfo)) {
                    $E('formsetting_' + __pageSetVar.formatInfo).className = "";
                }
                __pageSetVar.formatInfo = toformat;
                if ($E('formsetting_' + __pageSetVar.formatInfo)) {
                    $E('formsetting_' + __pageSetVar.formatInfo).className = "selected";
                }
            }
//			trace("type="+type);
            switch (type) {
                case "1-2"://两栏模式互相换的情况
                case "2-1":
                    this.twoColumnSwap();
                    break;
                case "1-3"://两栏到三栏第一种情况的变化
                    this.twoColumnToThree();
                    break;
                case "2-3":
//				this.twoColumnSwap();
                    this.twoColumnToThree();
                    break;
                case "1-4"://两栏到三栏第二种情况的变化
                case "2-4":
                    this.twoColumnToThree();
                    this.threeColumnSwap("3-4");
                    break;
                case "1-5"://两栏到三栏第三种情况的变化
                case "2-5":
                    this.twoColumnToThree();
                    this.threeColumnSwap("3-5");
                    break;
                case "3-1"://三栏到两栏1的变化
                case "4-1":
                case "5-1":
                    this.threeColumnToTwo();
                    break;
                case "3-2"://三栏到两栏2的变化
                case "4-2":
                case "5-2":
                    this.threeColumnToTwo();
                    this.twoColumnSwap();
                    break;
                case "3-4":
                    this.threeColumnSwap("3-4");
                    break;
                case "4-3":
                    this.threeColumnSwap("4-3");
                    break;
                case "5-4":
                    this.threeColumnSwap("5-4");
                    break;
                case "4-5":
                    this.threeColumnSwap("4-5");
                    break;
                case "3-5"://三栏第一种到第三种转换
                case "5-3":
                    this.threeColumnSwap("3-5");
                    break;

                default:
                    break;
            }
            var x = Core.Events.getEvent();
            if (x && typeof x == "object") {
                Core.Events.stopEvent();
            }

            this.addNoneDiv();
            funcRefreshCompList();

        },
        twoColumnSwap: function () {//两栏互换的方法
            var sinablogbody = $E('sinablogbody');
            var column1 = $E('column_1');
            column1.className = (column1.className).replace(" SG_colFirst", "");
            var column2 = $E('column_2');
            column2.className = column2.className + " SG_colFirst";
            column1.id = "column_2";
            column2.id = "column_1";
            Core.Dom.insertAfter(column1, column2);
        },
        twoColumnToThree: function () {//两栏转三栏的3
            var sinablogbody = $E('sinablogbody');
            var column1 = $E('column_1');
            var column2 = $E('column_2');
            var column3 = $E('column_3');

            if (column1.offsetWidth == 210) {
                column2.className = "SG_colW51";

            } else {
                column1.className = "SG_colW51";
                column2.className = column2.className + " SG_colFirst";

                column1.id = "column_2";
                column2.id = "column_1";
                Core.Dom.insertAfter(column1, column2);
            }
            column3.className = "SG_colW21";

        },
        threeColumnToTwo: function () {//三栏转两栏的1
            var sinablogbody = $E('sinablogbody');
            var child = [];
            var column1 = null;
            var column2 = null;
            var column3 = null;

            for (var i = 1; i < 4; i++)
                child[i] = $E('column_' + i);

            for (i = 1; i < 4; i++) {
                trace(child[i].className);
                if ((child[i].offsetWidth == 210) && column1 == null) {
                    column1 = child[i];
                } else if ((child[i].offsetWidth == 210) && column1 != null) {
                    column3 = child[i];
                    var childs = Core.Dom.getChildrenByClass(column3, "SG_conn");
//					trace("childs.length="+childs.length);
//					trace("column.id="+column1.className);
                    for (var j = 0; j < childs.length; j++)
                        column1.appendChild(childs[j]);
                } else if (child[i].offsetWidth == 510) {
                    column2 = child[i];
                }
            }

            column1.id = "column_1";
            column2.id = "column_2";
            column3.id = "column_3";
            column1.className = "SG_colW21 SG_colFirst";
            column2.className = "SG_colW73";
            column3.className = "SG_colWnone";
            sinablogbody.insertBefore(column1, column2);
            sinablogbody.insertBefore(column3, $E('blogads'));
            if (scope.isAdshare == "true" || scope.isCompany == "true") {//说明是广告共享计划用户
                var childs1 = Core.Dom.getChildrenByClass(column1, 'SG_conn');
                if (childs1.length > 0) {
                    column1.insertBefore($E('module_901'), childs1[0]);
                } else {
                    column1.appendChild($E('module_901'));
                }
            }

        },
        threeColumnSwap: function (type) {//三栏互换
            switch (type) {
                case "3-4"://从3到4
                    var sinablogbody = $E('sinablogbody');
                    var column1 = $E('column_1');
                    var column2 = $E('column_2');
                    var column3 = $E('column_3');

                    column1.className = (column1.className).replace(" SG_colFirst", "");
                    column2.className = column2.className + " SG_colFirst";
                    column1.id = "column_2";
                    column2.id = "column_1";
                    sinablogbody.insertBefore(column2, column1);
                    if (scope.isAdshare == "true" || scope.isCompany == "true") {//说明是广告共享计划用户
                        trace("是广告共享用户");
                        var childs3 = Core.Dom.getChildrenByClass(column3, 'SG_conn');
                        if (childs3.length > 0) {
                            column3.insertBefore($E('module_901'), childs3[0]);
                        } else {
                            column3.appendChild($E('module_901'));
                        }
                    }
                    break;
                case "4-3"://从4到3
                    var sinablogbody = $E('sinablogbody');
                    var column1 = $E('column_1');
                    var column2 = $E('column_2');
                    var column3 = $E('column_3');

                    column1.className = (column1.className).replace(" SG_colFirst", "");
                    column2.className = column2.className + " SG_colFirst";
                    column1.id = "column_2";
                    column3.id = "column_3";
                    column2.id = "column_1";
                    sinablogbody.insertBefore(column1, column3);

                    if (scope.isAdshare == "true" || scope.isCompany == "true") {//说明是广告共享计划用户
                        var childs2 = Core.Dom.getChildrenByClass(column2, 'SG_conn');
                        if (childs2.length > 0) {
                            column2.insertBefore($E('module_901'), childs2[0]);
                        } else {
                            column2.appendChild($E('module_901'));
                        }
                    }
                    break;
                case "4-5"://从4到5
                    var sinablogbody = $E('sinablogbody');

                    var column1 = $E('column_1');
                    var column2 = $E('column_2');
                    var column3 = $E('column_3');

                    column1.className = (column1.className).replace(" SG_colFirst", "");
                    column2.className = column2.className + " SG_colFirst";
                    column1.id = "column_3";
                    column3.id = "column_2";
                    column2.id = "column_1";
//               	sinablogbody.appendChild(column1);
                    sinablogbody.insertBefore(column1, $E('blogads'));

                    if (scope.isAdshare == "true" || scope.isCompany == "true") {//说明是广告共享计划用户
                        var childs2 = Core.Dom.getChildrenByClass(column2, 'SG_conn');
                        if (childs2.length > 0) {
                            column2.insertBefore($E('module_901'), childs2[0]);
                        } else {
                            column2.appendChild($E('module_901'));
                        }
                    }
                    break;
                case　"5-4"
                :
                    var sinablogbody = $E('sinablogbody');

                    var column1 = $E('column_1');
                    var column2 = $E('column_2');
                    var column3 = $E('column_3');

                    column1.className = (column1.className).replace(" SG_colFirst", "");
                    column3.className = column3.className + " SG_colFirst";
                    column1.id = "column_2";
                    column3.id = "column_1";
                    column2.id = "column_3";
                    sinablogbody.insertBefore(column3, column1);
                    if (scope.isAdshare == "true" || scope.isCompany == "true") {//说明是广告共享计划用户
                        var childs2 = Core.Dom.getChildrenByClass(column2, 'SG_conn');
                        if (childs2.length > 0) {
                            column2.insertBefore($E('module_901'), childs2[0]);
                        } else {
                            column2.appendChild($E('module_901'));
                        }
                    }
                    break;
                case "3-5"://从5到3或者从3到5
                    var sinablogbody = $E('sinablogbody');
                    var column2 = $E('column_2');
                    var column3 = $E('column_3');
                    column2.id = "column_3";
                    column3.id = "column_2";
                    Core.Dom.insertAfter(column2, column3);
                    break;
                default:
                    break;
            }
        },
        /**
         * 如果开始的时候是三栏的话，在变化了版式后的事件
         */
        threeColumnFunc: function () {

        },
        addNoneDiv: function () {
//		trace('add none div');
            for (var i = 1; i < 4; i++) {

                var childs = Core.Dom.getChildrenByClass($E("column_" + i), "SG_conn");
                var childs2 = Core.Dom.getChildrenByClass($E("column_" + i), "SG_conn2");
                if (childs.length == 0 && childs2.length == 0) {
                    var div = $C('div');
                    div.className = 'SG_conn2';
                    div.innerHTML = '<div class="noWidget_box"><div class="noWidget_txt">您可将模块放置在此！</div>';
                    $E("column_" + i).appendChild(div);
                } else if (childs.length > 0 && childs2.length) {
                    childs2[0].parentNode.removeChild(childs2[0]);
                } else if (childs.length == 0 && childs2.length > 1) {
                    childs2[1].parentNode.removeChild(childs2[1]);
                }
            }

            //<div style="margin: 0px; width: 210px; height: 0.1px;">  </div>原来用来控制占位的一个div
        }
    };
    window.funcChangeFormat = func;
})();
