/**
 * @fileoverview
 *    博客列表页归档组件 id=931
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/sina.js");
$import("sina/core/array/foreach.js");
$import("sina/core/dom/getStyle.js");
$import("sina/core/dom/setStyle.js");
$import("sina/core/function/bind2.js");
$import("sina/ui/template.js");

$import("lib/component/class/registComp.js");
$import("lib/component/extend/comp_dynamic.js");
$import("lib/interface.js");

$import("msg/componentMSG.js");
$registComp(931, {
        /*
         * 归档模板 210px
         */
        "htmlTemplate": ['<div id="archive_#{year}" class="fileCell #{currentYear}">'
            ,
            '<p onclick="Lib.Component.instances[931].toggle(#{year});" class="fileList_year SG_dot"><span>#{year}年</span><em></em></p>'
            , '<div id="archive_detail_#{year}" class="fileList_month" #{isshow}>'
            , '<ul>#{html}</ul>'
            , '</div>'
            , '</div>'
            , '<div class="SG_j_line"></div>'].join("")

        /*
         * 载入归档数据
         */, "load": function () {
            var i_getPigeonholeInfo = new Interface("http://blogtj.sinajs.cn/api/get_archive.php", "jsload");
            i_getPigeonholeInfo.request({
                GET: {
                    "uid": scope.$uid
                }, onSuccess: Core.Function.bind2(function (oData) {
                    this.parse(oData);
                }, this), onError: function () {
                }, onFail: function () {
                }
            });
        }
        /*
         * 解析归档数据
         */, "parse": function (oData) {
            oData = oData.reverse();
            var data = [];
            Core.Array.foreach(oData, function (oItem) {
                var year = oItem.d.substr(0, 4);
                var month = oItem.d.substr(4);

                // 如果没指定被展开的月份，就默认设置为最近一年
                if (scope.$blogArticleArchiveSelected == "") {
                    var currentDate = new Date();
                    scope.$blogArticleArchiveSelected = currentDate.getFullYear() + (currentDate.getMonth() == 0 ? -1 : 0);
                }
                var isCurrentYear = (year == scope.$blogArticleArchiveSelected.toString().substr(0, 4));
                var isCurrentMonth = (oItem.d == scope.$blogArticleArchiveSelected);
                if (data[year] == null) {
                    data[year] = {
                        "currentYear": isCurrentYear ? ' fileCell_open' : '', "year": year, "isshow": isCurrentYear ? '' : ' style="display: none;"', "html_data": []
                    };
                }
                if (isCurrentMonth) {
                    data[year].html_data.push('<li class="current"><div class="menuCell_main">' + '<span><strong>' + month + '月(' + oItem.c + ')</strong></span></div><div class="menuCell_bot"></div></li>');
                } else {
                    data[year].html_data.push('<li><div class="menuCell_main">' + '<span><a href="http://blog.sina.com.cn/s/article_archive_' + scope.$uid + '_' + oItem.d + '_1.html">' + month + '月(' + oItem.c + ')</a></span></div><div class="menuCell_bot"></div></li>');
                }

            });
            var resultArray = [];
            for (var key in data) {
                data[key].html = data[key].html_data.join("");
                resultArray.push(data[key]);
            }
            this.parseToHTML(resultArray);
        }
        /*
         * 评论组件由 Json 转为 HTML
         */, "parseToHTML": function (oData) {
            // 如果评论数为 0，直接显示空文案
            if (oData.length == 0) {
                this.showEmpty();
            } else {
                var template = new Ui.Template(this.htmlTemplate);
                var result = template.evaluateMulti(oData).replace(/<div class="SG_j_line"><\/div>$/i, "");
                result = '<div class="menuList fileList">' + result + '</div>';
//			alert(result);
                this.setContent(result);
            }
        }
        /*
         * 展开收缩当前年份
         */, "toggle": function (nYear) {
            var currentStatus = Core.Dom.getStyle($E("archive_detail_" + nYear), "display") == "none";
            if (currentStatus) {
                Core.Dom.setStyle($E("archive_detail_" + nYear), "display", "");
                $E("archive_" + nYear).className = "fileCell fileCell_open";
            } else {
                Core.Dom.setStyle($E("archive_detail_" + nYear), "display", "none");
                $E("archive_" + nYear).className = "fileCell";
            }
        }
        /*
         * 归档为空的提示文案
         */, showEmpty: function () {
            this.setContent('<div class="SG_nodata">' + $SYSMSG.B80007 + '</div>');
        }
    }, 'dynamic');