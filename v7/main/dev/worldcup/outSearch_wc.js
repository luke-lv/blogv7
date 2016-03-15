/**
 * @author dcw1123 | chengwei1@staff.sina.com.cn
 */
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/ui/template.js");
$import("sina/utils/io/jsload.js");
$import("sina/core/string/byteLength.js");
$import("article/getSearchReferrer.js");
$import("lib/dialogConfig.js");
$import("lib/checkAuthor.js");
$import("sina/utils/cookie/getCookie.js");
$import("sina/utils/cookie/setCookie.js");

Article.outSearch_wc = function () {

    //如果12小时内出现过一次。
    if (parseInt(Utils.Cookie.getCookie("wc_bot_ads")) > 0) {
        //trace("has cookie，unexpired, so return");
        return;
    }
    //trace("wc_bot_ads goes on");

    //主模板
    var cTemplate = [
        '<div class="wdc_srhflt_Bg1" id="wdc_srhflt">',				//wdc_srhflt_Bg2		12
        '<div class="wdcSrh_Flt1">',								//wdcSrh_Flt2			12
        '<div class="wdcSrh_Flt950">', '<div class="wdcSrh_FLeft">', '<div class="wdcSrh_FConn">',
        '<ul id="wdcSrh_text">#{wdcSrh_text}</ul>',		//
        '</div>', '</div>',

        '<div class="wdcSrh_FRight wdcSrh_FRight1" id="wdc_recordMyGame">',			//123，顶
        '<a class="btn" href="http://blog.2010.sina.com.cn/yunying/2010worldcup/" title="" onclick="return false;" target="_blank"></a>',
        '<a href="http://sina.allyes.com/main/adfclick?db=sina&bid=204720,254686,259751&cid=0,0,0&sid=250882&advid=358&camid=37389&show=ignore&url=http://www.ct10000.com/esurfing/3gsjb/main.html" target="_blank" class="ty_link"></a>',
        '</div>', '<div class="wdcSrh_Fmiddle">',					//链接按钮
        '<a href="http://blog.2010.sina.com.cn/yunying/2010worldcup/" title="2010，我的世界杯Blog日志" target="_blank"></a>',
        '</div>',

        '<div class="clear"></div>',
        '<div class="wdcSrh_fopen2" id="wdcSrh_fopen"><a href="#" onclick="return false;">更多</a></div>',		//wdcSrh_fopen2，收起
        '</div>', '<div class="wdcSrh_fclo" id="wdcSrh_fclo"><a href="#" title="" onclick="return false;"></a></div>',		//
        '</div>', '</div>'].join("");
    //新闻模板
    var liTemplate = '<li><a href="#{aLink}" title="#{aTitleProp}" target="_blank">#{aTitle}</a><a href="#{aAuthorBlog}" title="#{aAuthorProp}" target="_blank">#{aAuthor}</a></li>';
    //搜索条容器
    var container = null;
    //新闻接口
    var dataURL = 'http://blog.sina.com.cn/main/top_new/article_sort_worldcup/worldcup_33_new_day.js?f=wcInfoLayer';

    function animate(target, prop, from, to, step) {
        step = step ? step : 2;
        target.style[prop] = from + "px";
        var loop = function () {
            var tt = parseInt(target.style[prop]);
            if (tt <= to + Math.abs(step) && tt >= to - Math.abs(step)) {
                target.style[prop] = to + "px";
            } else {
                target.style[prop] = (tt + step) + "px";
                setTimeout(loop, 30);
            }
        };
        loop();
    }

    //关闭容器
    function quit() {
        Core.Events.stopEvent();
        $E("sinabloga").removeChild(container);

        //用户点了叉
        Utils.Cookie.setCookie("wc_bot_ads", new Date().getTime(), 12, "/", ".sina.com.cn");

        return false;
    }

    //初始化容器
    function initContainer() {
        container.style.left = "0px";
        container.style.zIndex = 1712;
        container.style.width = "100%";
        Core.Events.addEvent($E("wdcSrh_fclo"), quit, "click", false);

        //显示
        if (!$IE6) {
            container.style.position = "fixed";
            container.style.top = document.documentElement.clientHeight - 86 + "px";
            window.onresize = function () {
                container.style.top = document.documentElement.clientHeight - container.offsetHeight + "px";
            };
        } else {
            container.style.position = "absolute";
            container.style.top = document.documentElement.clientHeight + document.documentElement.scrollTop - 86 + "px";
            Core.Events.addEvent(window, function () {
                container.style.top = document.documentElement.clientHeight + document.documentElement.scrollTop - container.offsetHeight + "px";
            }, "scroll");
            window.onresize = function () {
                container.style.top = document.documentElement.clientHeight + document.documentElement.scrollTop - container.offsetHeight + "px";
            };
        }
    }

    function initInteract() {
        //展开收起。构建太复杂，不好动画。
        $E("wdcSrh_fopen").style.display = "none";				//为了能打广告。。。牺牲。
        $E("wdcSrh_fopen").onclick = function () {
            if (this.getAttribute("ex") != "y") {
                container.className = "wdc_srhflt_Bg2";
                $E("wdcSrh_fopen").className = "wdcSrh_fopen1";
                $T(container, "div")[0].className = "wdcSrh_Flt2";
                $T($E("wdcSrh_fopen"), "a")[0].innerHTML = "收起";
                container.style.height = "131px";
                container.style.top = document.documentElement.clientHeight - 131 + "px";
                if ($IE6) container.style.top = parseInt(container.style.top) + document.documentElement.scrollTop + "px";
                this.setAttribute("ex", "y");
            } else {
                container.className = "wdc_srhflt_Bg1";
                $E("wdcSrh_fopen").className = "wdcSrh_fopen2";
                $T(container, "div")[0].className = "wdcSrh_Flt1";
                $T($E("wdcSrh_fopen"), "a")[0].innerHTML = "更多";
                container.style.height = "86px";
                container.style.top = document.documentElement.clientHeight - 86 + "px";
                if ($IE6) container.style.top = parseInt(container.style.top) + document.documentElement.scrollTop + "px";
                this.setAttribute("ex", "n");
            }
        };

        var rec_btn = $E("wdc_recordMyGame");

        //提交世界杯记录
        $T(rec_btn, "a")[0].onclick = function () {
            Lib.checkAuthor();
            if ($isLogin) {
                (new Interface("http://control.blog.sina.com.cn/2010worldcup/api/insert_my_record.php", "jsload")).request({
                    GET: {
                        blog_id: scope.$articleid
                    },
                    onSuccess: function (res) {
                        rec_btn.className = "wdcSrh_FRight wdcSrh_FRight3";
                        $T(rec_btn, "a")[0].onclick = function () {
                            return false;
                        };
                        $T(rec_btn, "a")[0].style.cursor = "default";
                    },
                    onError: function (res) {
                        if (res.code == "A00004") {		//未开通，未参加，则直接过来。
                            window.location.href = "http://blog.2010.sina.com.cn/yunying/2010worldcup/";
                        } else {
                            winDialog.alert("系统繁忙，请稍候重试");
                        }
                    }
                });
                return false;
            } else {
                return true;
            }
        };

        //初始化提交按钮。
        (new Interface("http://control.blog.sina.com.cn/2010worldcup/api/get_if_my_record.php", "jsload")).request({
            GET: {
                blog_id: scope.$articleid
            },
            onSuccess: function (res) {
                if (res.if_record) {
                    rec_btn.className = "wdcSrh_FRight wdcSrh_FRight3";
                    $T(rec_btn, "a")[0].onclick = function () {
                        return false;
                    };
                    $T(rec_btn, "a")[0].style.cursor = "default";
                }
            },
            onError: function (res) {

            }
        });
    }

    //请求新闻数据，并初始化容器。
    Utils.Io.JsLoad.request(dataURL, {
        onComplete: function () {
            if (typeof json33_new_day == "undefined") return;
            var res = json33_new_day;
            var oArt;
            var cutTitle;
            var titleLen = 26;		//题目长度
            var cutAuthor;
            var authorLen = 8;		//作者长度
            var temp_li = "";
            var temp_a = "";

            var luckyNum = luckySelect(res.length, 4);
            //trace(luckyNum);

            //for(var i=0; i<Math.min(res.length, 4); i++){
            for (var i = 0; i < luckyNum.length; i++) {
                oArt = res[luckyNum[i]];
                cutTitle = Core.String.shorten(oArt.blog_title, titleLen);
                if (cutTitle.indexOf("...") > -1) {		//标题被 cut 过，则人名一定要cut。否则人名可以不cut。
                    cutAuthor = Core.String.shorten(oArt.uname, authorLen);
                } else {
                    cutAuthor = oArt.uname;
                }
                temp_li += new Ui.Template(liTemplate).evaluate({
                    aLink: oArt.blog_url,
                    aTitle: cutTitle,
                    aTitleProp: oArt.blog_title,
                    aAuthor: cutAuthor,
                    aAuthorProp: oArt.uname,
                    aAuthorBlog: "http://blog.sina.com.cn/u/" + oArt.uid
                });
            }
            temp_a = new Ui.Template(cTemplate).evaluate({
                wdcSrh_text: temp_li
            });

            //上屏。
            var c = $C("div");
            c.innerHTML = temp_a;
            container = c.childNodes[0];
            $E("sinabloga").appendChild(container);

            initContainer();		//初始化容器。
            initInteract();
        }
    });

    //根据长度，从中选择几个。排重。
    function luckySelect(length, qua) {
        var result = [];
        var serv = [];
        for (var i = 0; i < length; i++) {	//产生同原数组，相同长度的顺序序列。
            serv.push(i);
        }
        if (length < qua) {				//则顺序
            return serv;
        }
        for (var i = 0; i < qua; i++) {
            var curIdx = Math.ceil(Math.random() * (length - i - 1));
            result.push(serv[curIdx]);
            serv.splice(curIdx, 1);
        }
        return result;
    }

};

