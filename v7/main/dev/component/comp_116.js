/*
 *	育儿要闻 id=116
 * @author  meichun1@staff.sina.com.cn
 准备怀孕： http://blog.sina.com.cn/lm/iframe/js/babyblog/focusblog_1.js
 准妈妈： http://blog.sina.com.cn/lm/iframe/js/babyblog/focusblog_2.js
 新生儿： http://blog.sina.com.cn/lm/iframe/js/babyblog/focusblog_3.js
 婴幼儿： http://blog.sina.com.cn/lm/iframe/js/babyblog/focusblog_4.js
 学龄前： http://blog.sina.com.cn/lm/iframe/js/babyblog/focusblog_5.js
 少儿：    http://blog.sina.com.cn/lm/iframe/js/babyblog/focusblog_6.js
 大于12岁以后，scope.$babylevel为99
 */
$import("sina/core/dom/insertHTML.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/function/bind2.js");
$import("sina/ui/template.js");
$import("sina/utils/io/jsload.js");

$import("sina/core/string/shorten.js");

$import("lib/component/class/registComp.js");
$import("lib/component/extend/comp_dynamic.js");
$import("lib/showError.js");
$import("lib/checkAuthor.js");

$import("pageSet/moduleHidden.js");

/*隐藏组件*/

$registComp(116, {
        //测试机 前 加了 control.
        "dataUrl": ["http://blog.sina.com.cn/lm/iframe/js/babyblog/focusblog_", ".js"],
        "level": scope.$babylevel,

        "load": function () {
            var level = this.level;
            if (!level || level == 99) {
                Lib.checkAuthor();
                this.setContent($isAdmin ? level ?

                                           '<div class="baby_info"><div class="null">祝贺您，宝宝已经超过十二岁了，是不是已经顺利上中学了呢？关注我们的<a href="http://edu.sina.com.cn/" target="_blank">教育频道</a>吧~<br/>或者<a class="CP_a_fuc" onclick="moduleHidden(116);return false;" href="#"><cite>点这里</cite></a>隐藏此模块。</div></div>'

                    : '<div class="baby_info"><div class="null">请先<a href="http://control.blog.sina.com.cn/reg/reg_blog_userinfo.php?src=baby&version=7">点这里</a>填写宝宝资料，如果您没有宝宝请<a class="CP_a_fuc" onclick="moduleHidden(116);return false;" href="#"><cite>点这里</cite></a>隐藏该模块</div></div>'

                    : '<div class="cloneWidget"><div class="baby_info"><div class="null">博主尚未设置此模块内容</div></div><div class="cloneLink"><a title="添加到我的博客" href="#" onclick="Lib.Component.clone(' + this.compId + ', ' + this.size + ');return false;"><img alt="" src="http://simg.sinajs.cn/blog7style/images/widget/add1.gif" />添加到我的博客</a></div></div>');

                return;
            }

            var some = (level + '').split(',');

            if (some[1]) {

                this.mergeLoadNewsInfo(some);

            } else {

                this.loadNewsInfo(level);
            }
        },

        'mergeData': function (dataStr) {
            //	暂时按照只有 只有 2组数据 来处理
            //前3条新闻固定，其他的随机抽取
            var rd1 = ~~(Math.random() * 7) + 2, rd2;
            rd1 = rd1 == 2 ? 3 : rd1;
            rd2 = rd1 + 1;
            var ar1 = dataStr[0], ar2 = dataStr[1];

            return ar1.slice(0, 3).concat(ar2.slice(0, 3), ar1[rd1], ar1[rd2], ar2[rd1], ar2[rd2]);

        },

        'mergeLoadNewsInfo': function (some) {

            var fnlen = 0, len = some.length || 0, dataStr = [], _this = this;
            var setFn = window.setInterval(function () {

                    var level = some[fnlen];
                    Utils.Io.JsLoad.request([
                        {
                            url: _this.dataUrl.join(level),
                            charset: "GB2312"
                        }
                    ], {
                        GET: {
                            "varname": "focusblog_" + level,
                            "rnd": new Date().getTime()
                        },
                        onComplete: function (oData) {
                            if (oData) {
                                dataStr.push(oData);
                                if (dataStr.length == len) {
                                    _this.cacheData = _this.mergeData(dataStr);

                                    _this["render_" + _this.size]();
                                }

                            } else {
                                _this.setContent('<div class="loadFailed">加载失败！</div>');
                                clearInterval(setFn);
                                setFn = null;
                            }
                        },
                        onException: function () {
                            _this.setContent('<div class="loadFailed">加载失败！</div>');
                            clearInterval(setFn);
                            setFn = null;
                        }
                    });

                    if (++fnlen >= len) {
                        clearInterval(setFn);
                        setFn = null;
                    }

                }, 1);

        },

        "loadNewsInfo": function (level) {

            Utils.Io.JsLoad.request([
                {
                    url: this.dataUrl.join(level),
                    charset: "GB2312"
                }
            ], {
                GET: {
                    "varname": "focusblog_" + this.level,
                    "rnd": new Date().getTime()
                },
                onComplete: Core.Function.bind2(function (oData) {
                        if (oData) {
                            this.cacheData = oData;

                            this["render_" + this.size]();

                        } else {
                            this.setContent('<div class="loadFailed">加载失败！</div>');
                        }
                    }, this),
                onException: Core.Function.bind2(function () {
                        this.setContent('<div class="loadFailed">加载失败！</div>');
                    }, this)
            });
        },
        /*
         * 按 210 px 渲染财经组件
         */

        "render_210": function () {

            /*截取字符，能保证最终不大于30字符，但无法保证不换行显示*/
            Core.Array.foreach(this.cacheData, function (data) {

                    data.allt = data.title;

                    if (Core.String.byteLength(data.title) <= 30) {
                        return;
                    } else {

                        var n = 28 - Math.round((Core.String.leftB(data.title, 28).match(/[a-z0-9]/g) || []).length / 4);

                        data.title = Core.String.shorten(data.title, n);
                    }

                });

            this.template = '<li><div class="bb SG_dot"><a href="#{url}" title="#{allt}" target="_blank">#{title}</a></div></li>';
            this.parseToHTML();
        },
        /*
         * 按 510 px 渲染财经组件
         */

        "render_510": function () {
            this.template = '<li class="SG_j_linedot1"><div class="bb SG_dot"><a href="#{url}" target="_blank"' + '>#{title}</a></div></li>';
            this.parseToHTML();
        },
        /*
         * 按 730 px 渲染财经组件
         */

        "render_730": function () {

            this.template = '<li class="SG_j_linedot1"><div class="bb SG_dot"><a href="#{url}" target="_blank"' + '>#{title}</a></div></li>';
            this.parseToHTML();
        },
        /*
         * 数据解析为 HTML
         */

        "parseToHTML": function () {
            Lib.checkAuthor();

            var template = new Ui.Template(this.template);

            var result = template.evaluateMulti(this.cacheData);

            result = '<div class="financeNews' + (!$isAdmin ? ' cloneWidget' : '') + '"' + (!$isAdmin ? '' : 'style="padding:10px 0;"') + '><div class="newsList"><ul>' + result + '</ul>' + ($isAdmin ? '' : '<div class="cloneLink"><a title="添加到我的博客" href="#" onclick="' + 'Lib.Component.clone(' + this.compId + ', ' + this.size + ');return false;"><img alt="" src="http://' + 'simg.sinajs.cn/blog7style/images/widget/add1.gif" />添加到我的博客</a></div>') + '</div></div>';

            this.setContent(result);
        }
    }, "dynamic");