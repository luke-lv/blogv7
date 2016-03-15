/**
 * @fileoverview
 *    博客首页财经要闻组件 id=10006
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/core/dom/insertHTML.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/function/bind2.js");
$import("sina/ui/template.js");
$import("sina/utils/io/jsload.js");

$import("lib/component/class/registComp.js");
$import("lib/component/extend/comp_dynamic.js");
$import("lib/showError.js");
$import("lib/checkAuthor.js");

$registComp(10006, {
    /*
     *	读取用户当前的 Flash 组件配置信息接口
     */
    "Interface": new Interface("http://control.blog.sina.com.cn/riaapi/component_config/read_component.php", "ijax")
    /*
     * 按读取财经要闻分类配置信息
     */, "dataUrl": {
        "0": "http://rss.sina.com.cn/finance/hotnews/all.js", "1": "http://rss.sina.com.cn/finance/hotnews/stock.js", "2": "http://rss.sina.com.cn/finance/hotnews/usstock.js", "3": "http://rss.sina.com.cn/finance/hotnews/hkstock.js", "4": "http://rss.sina.com.cn/finance/hotnews/research.js", "5": "http://rss.sina.com.cn/finance/hotnews/guonei.js", "6": "http://rss.sina.com.cn/finance/hotnews/guoji.js", "7": "http://rss.sina.com.cn/finance/hotnews/chanjing.js"
    }, "load": function () {
        // 先获取组件设置的新闻分类 ID 号
        if (this.currentNewsSort == null && scope.$playids[this.compId] != null) {
            this.currentNewsSort = scope.$playids[this.compId];
            this.loadNewsInfo();
        } else {
            this.Interface.request({
                POST: {
                    title_code: this.compId
                }, onSuccess: Core.Function.bind2(function (oData) {
                    this.currentNewsSort = oData[this.compId]._default == 1 ? 0 : oData[this.compId].my_body.cat;
                    this.loadNewsInfo();
                }, this)
            });
        }
    }
    /*
     * 载入财经要闻的数据
     */, "loadNewsInfo": function () {
        Utils.Io.JsLoad.request([
            {
                url: this.dataUrl[this.currentNewsSort], charset: "GB2312", isRemove: false
            }
        ], {
            GET: {
                "varname": "finance_news", "rnd": new Date().getTime()
            }, onComplete: Core.Function.bind2(function (oData) {
                if (oData.code == "A00006") {
                    this.cacheData = oData.data.record;
                    this.more_url = oData.data.more_url;
                    this["render_" + this.size]();
                } else {
                    this.setContent('<div class="loadFailed">加载失败！</div>');
                }
            }, this), onException: Core.Function.bind2(function () {
                this.setContent('<div class="loadFailed">加载失败！</div>');
            }, this)
        });
    }
    /*
     * 按 210 px 渲染财经组件
     */, "render_210": function () {
        this.template = '<li><div class="bb SG_dot"><a href="#{url}" target="_blank">#{wap_title}</a></div></li>';
        this.parseToHTML();
    }
    /*
     * 按 510 px 渲染财经组件
     */, "render_510": function () {
        this.template = '<li class="SG_j_linedot1"><div class="bb SG_dot"><a href="#{url}" target="_blank"' + '>#{title}</a><span class="date SG_txtc">#{time}</span></div></li>';
        this.parseToHTML();
    }
    /*
     * 按 730 px 渲染财经组件
     */, "render_730": function () {
        this.template = '<li class="SG_j_linedot1"><div class="bb SG_dot"><a href="#{url}" target="_blank"' + '>#{title}</a><span class="date SG_txtc">#{time}</span></div></li>';
        this.parseToHTML();
    }
    /*
     * 数据解析为 HTML
     */, "parseToHTML": function () {
        Lib.checkAuthor();
        var template = new Ui.Template(this.template);
        var result = template.evaluateMulti(this.cacheData);
        result = '<div class="financeNews' + (!$isAdmin ? ' cloneWidget' : '') + '"' + (!$isAdmin ? '' : 'style="padding:10px 0;"') + '><div class="newsList"><ul>' + result + '</ul>' + '<p class="more"><span class="SG_more"><a href="' + this.more_url + '" target="_blank">更多新闻</a>&gt;&gt;</span></p>' + ($isAdmin ? '' : '<div class="cloneLink"><a title="添加到我的博客" href="#" onclick="' + 'Lib.Component.clone(' + this.compId + ', ' + this.size + ');return false;"><img alt="" src="http://' + 'simg.sinajs.cn/blog7style/images/widget/add1.gif" />添加到我的博客</a></div>') + '</div></div>';
        this.setContent(result);
    }
}, "dynamic");