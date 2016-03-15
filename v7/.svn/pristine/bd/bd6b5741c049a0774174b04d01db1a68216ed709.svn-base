/**
 * @fileoverview
 *    博客365活动组件
 * @author gaolei || gaolei2@
 * @version 2.0
 * @date 2012-11-5
 * @modify 2012-12-04
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
$import("lib/checkAuthor.js");
$import("component/include/cloneComponent.js");
$import("sina/core/dom/removeClassName.js");
$import("lib/sendLog.js");

$registComp(365, {

    "blog365List": [],

    "blog365Cache": {},

    "url": 'http://control.blog.sina.com.cn/riaapi/activity/get_blog365.php?data=1',
    /*
     * blog365组件模版 210px
     */
    "htmlTemplate": ['<li class="#{cls}">', '<div class="pic">', '#{html}', '</div>', '</li>'
    ].join(""),

    /*
     * 渲染日历
     */
    "preLoad": function (y, m) {
        // if (!$isAdmin){
        Lib.checkAuthor();
        // }
        this.blog365List = [];
        var now = new Date(), originYear = now.getFullYear(), originMonth = now.getMonth() + 1, originDate = now.getDate();

        var currentYear = y || originYear, currentMonth = m || originMonth;

        var firstDayPos = new Date(currentYear, currentMonth - 1, 1).getDay();
        // console.log(firstDayPos)
        var daysNum = this.daysNum(currentYear, currentMonth);
        // console.log(daysNum)
        // var isAdmin = ($UID == scope.$uid);

        if (currentMonth < 10) {
            currentMonth = "0" + currentMonth;
        }
        if (originMonth < 10) {
            originMonth = "0" + originMonth;
        }

        var origin = originYear + "" + originMonth;
        var current = currentYear + "" + currentMonth;

        for (var j = 1; j <= daysNum; j++) {
            var liCls = '', html = '';

            if (j == 1) {
                liCls += "wk" + firstDayPos;
            }

            if ((j + firstDayPos) % 7 == 0) {
                liCls += " nomgr";
            }

            if ($isAdmin) {//博主有特殊操作
                if (origin == current) {
                    if (j == originDate) {//博主显示记录当天，其他人显示默认
                        liCls += " today";
                        html = '<a onclick="v7sendLog(\'48_01_24\')" href="http://control.blog.sina.com.cn/admin/article/article_add.php?tag365" target="_blank"><span class="date">' + j + '</span></a>';
                        // link = '';
                    } else if (j > originDate) {//博主显示预置，其他人显示默认
                        liCls += " coming";
                        var preTime = currentYear + '-' + currentMonth + '-' + j;
                        html = '<a onclick="v7sendLog(\'48_01_25\')" href="http://control.blog.sina.com.cn/admin/article/article_add.php?tag365=' + preTime + '" target="_blank" ><span class="date">' + j + '</span></a>';
                    }
                } else if (origin < current) {//博主显示预置，其他人显示默认
                    liCls += " coming";
                    var preTime = currentYear + '-' + currentMonth + '-' + j;
                    html = '<a href="http://control.blog.sina.com.cn/admin/article/article_add.php?tag365=' + preTime + '" target="_blank" ><span class="date">' + j + '</span></a>';
                }
            }

            this.blog365List[j - 1] = {
                cls: liCls,
                html: html
            }
        }

        // this.blog365Cache[current] = this.blog365List;

        var template = new Ui.Template(this.htmlTemplate);
        var result = template.evaluateMulti(this.blog365List);

        if (!$isAdmin) {//非博主 增加添加到我的博客功能
            result = ['<div class="cloneWidget">', '<div class="cal365zj">', '<div class="calBtn">',
                '<a class="btn_preview" id="blog365Prev" href="javascript:void(0);">◀</a>',
                    '<span class="current" id="blog365curTime">' + currentYear + '年' + currentMonth + '月</span>',
                '<a class="btn_next" id="blog365Next" href="javascript:void(0);">▶</a>', '</div>',
                '<div class="calCon">', '<div class="weekDate">',
                '<span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span class="nomgr">六</span>',
                '</div>', '<ul id="blog365Conn">'].join("") + result + ['</ul>', '</div>', '</div>',
                    '<div class="cloneLink"><a href="javascript:;" onclick="' + 'Lib.Component.clone(' + this.compId + ', ' + this.size + ');return false;" class="SG_comClone"><img alt="添加到我的博客" src="http://simg.sinajs.cn/blog7style/images/widget/add1.gif">添加到我的博客</a></div></div>'].join("");
        } else {
            result = ['<div class="cal365zj">', '<div class="calBtn">',
                '<a class="btn_preview" id="blog365Prev" href="javascript:void(0);">◀</a>',
                    '<span class="current" id="blog365curTime">' + currentYear + '年' + currentMonth + '月</span>',
                '<a class="btn_next" id="blog365Next" href="javascript:void(0);">▶</a>', '</div>',
                '<div class="calCon">', '<div class="weekDate">',
                '<span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span class="nomgr">六</span>',
                '</div>', '<ul id="blog365Conn">'].join("") + result + ['</ul>', '</div>', '</div>'].join("");
        }
        this.setContent(result);
        this.bindEvent();
    },

    /*
     * 载入日历数据
     */
    "load": function () {
        var __this = this;
        this.loadData();
    },

    /*
     *	请求接口，渲染日历
     * @param uid 当前博客博主$UID
     */
    "loadData": function (y, m) {
        var __this = this;
        this.preLoad(y, m);
        if (m < 10) {//2013-1-5 bug 月份需要传递2位数
            m = "0" + m;
        }
        // var index = y + "" + m;
        // if (this.blog365Cache[index]){
        // this.renderCalendar(this.blog365Cache[index]);
        // }else{
        Utils.Io.JsLoad.request(this.url, {
            GET: {
                uid: scope.$uid,
                y: y,
                m: m
            },
            onComplete: function (result) {
                if (result.code && result.code === "A00006") {
                    // console.log(result.data)
                    if (result.data.length >= 0) {
                        return;
                    }
                    __this.renderCalendar(result.data);
                }
            }
        });
        // }
    },

    /*
     *	根据数据渲染当前日历
     * @param data 接口返回数
     */
    "renderCalendar": function (data) {
        var children = $E("blog365Conn") && $E("blog365Conn").children;
        var now = new Date(), day = now.getDate();

        for (var item in data) {
            var i = item.split("-")[2] - 1;//因为日期从1开始，而DOM数组从0开始
            var child = children[i], div = child.getElementsByTagName("div")[0];
            var html = '', src = '', href = '', target = '';
            // '<a href="href="http://control.blog.sina.com.cn/admin/article/article_add.php?tag365='+preTime+'" target="_blank" ><span class="date">'+j+'</span></a>';

            if (data[item].pre && data[item].href) {//如果预置
                child.className += " tqd";
                if ($isAdmin) {
                    html = '<a href="' + data[item].href + '" target="_blank" ><span class="date">' + (i + 1) + '</span></a>';
                }
                div.innerHTML = html;
            } else {
                if (i === (day - 1)) {
                    Core.Dom.removeClassName(child, 'today');
                }
                if (data[item].src && data[item].src.indexOf("sinaimg.cn") >= 0) {
                    src = data[item].src;
                }
                if (data[item].href) {
                    href = data[item].href;
                    target = "_blank";
                }
                if (!src) {
                    html = '<a href="' + href + '" target="' + target + '"><span class="date">' + (i + 1) + '</span></a>';
                } else {
                    html = '<a href="' + href + '" target="' + target + '"><img src="' + src + '" /><span class="date">' + (i + 1) + '</span></a>';
                }
                div.innerHTML = html;
            }
        }
    },

    /*
     *	绑定事件，日历翻页控制
     */
    "bindEvent": function () {
        var __this = this;
        var blog365Prev = $E("blog365Prev");
        var blog365Next = $E("blog365Next");
        var blog365curTime = $E("blog365curTime");

        var time = blog365curTime.innerHTML.split("\u5e74");
        var year = parseInt(time[0], 10);
        var month = parseInt(time[1], 10);

        blog365Prev.onclick = function () {

            if (month == 1) {
                year -= 1;
                month = 12;
            } else {
                month -= 1;
            }

            blog365curTime.innerHTML = year + "年" + month + "月";
            __this.loadData(year, month);
        };

        blog365Next.onclick = function () {

            if (month == 12) {
                year = year + 1;
                month = 1;
            } else {
                month += 1;
            }

            blog365curTime.innerHTML = year + "年" + month + "月";
            __this.loadData(year, month);
        };
    },

    /*
     *	返回这个月共有多少天
     * @param y 年份
     * @param m 月份
     */
    "daysNum": function (y, m) {
        var isLeap = function (y) {
            return y % 400 ? (y % 100 ? (y % 4 ? 0 : 1) : 0) : 1;
        };
        if (!y * m) {
            return 0;
        }
        var d = 31;
        switch (m) {
            case 4:
            case 6:
            case 9:
            case 11:
                d = 30;
                break;
            case 2:
                d = isLeap(y) ? 29 : 28;
                break;
        }
        return d;
    }
}, 'dynamic');