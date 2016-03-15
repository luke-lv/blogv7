/**
 * @fileoverview | 世界杯组件
 * @author dcw1123 | chengwei1@staff.sina.com.cn
 * @2010.04.16
 */
$import("sina/sina.js");
$import("sina/ui/template.js");

$import("sina/utils/io/jsload.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/array/foreach.js");

$import("lib/interface.js");
$import("lib/component/class/registComp.js");
$import("lib/component/extend/comp_dynamic.js");
$import("lib/msg/componentMSG.js");
$import("lib/checkAuthor.js");
$import("sina/core/string/shorten.js");

$registComp("105", {

    //世界杯组件框架模板
    cupTemp: [
        '<div class="worldcup_widget">', '<div class="article_head">', '<h2>我的世界杯，盛夏激情记录</h2>#{activityLinks}',
        '<a href="http://sina.allyes.com/main/adfclick?db=sina&bid=204720,254686,259751&cid=0,0,0&sid=250882&advid=358&camid=37389&show=ignore&url=http://www.ct10000.com/esurfing/3gsjb/main.html" target="_blank" class="ty_link"></a>',
        '</div>', '<div class="article_main">', '<h3 class="widget_title01" style="display:#{titleDisplay}">',
        //'<span class="SG_more"><a href="#">更多</a>&gt;&gt;</span>',
        '</h3>', '<div class="scoreList" style="display:#{scoreDisplay}">#{gameScore}<div class="clearit"></div></div>',	//赛事结果
        '<div class="myWorldcup_bottom" style="display:#{articleDisplay}">', '<h3 class="widget_title02"></h3>',
        '<div class="blogRecordList">', '<ul>#{gameArticle}</ul>',		//赛事博文。
        '</div>',
        '<div class="widget_btn" style="display:#{btnDisplay}"><a href="#" onclick="#{addToMyBlog}">添加到我的博客</a></div>',
        '</div>', '</div>', '</div>'].join(""),

    //世界杯组件模板 210
    cupTemp_210: [
        '<div class="worldcup_widget">', '<div class="article_head">', '<h2>我的世界杯，盛夏激情记录</h2>#{activityLinks}',
        '</div>', '<div class="article_main">', '<h3 style="display:#{titleDisplay}" class="widget_title01">',
        //'<span class="SG_more"><a href="#">更多</a>&gt;&gt;</span>',
        '</h3>', '<div class="scoreList" style="display:#{scoreDisplay}">', '<ul>#{gameScore}</ul>',			//
        '<div class="clearit"></div>', '</div>', '<div class="myWorldcup_bottom" style="display:#{articleDisplay}">',
        '<h3 class="widget_title02"></h3>', '<div class="blogRecordList">', '<ul>#{gameArticle}</ul>',		//
        '</div>',
        '<div class="widget_btn" style="display:#{btnDisplay}"><a href="#" onclick="#{addToMyBlog}">添加到我的博客</a></div>',
        '</div>', '</div>',
        '<a href="http://sina.allyes.com/main/adfclick?db=sina&bid=204720,254686,259751&cid=0,0,0&sid=250882&advid=358&camid=37389&show=ignore&url=http://www.ct10000.com/esurfing/3gsjb/main.html" target="_blank" class="ty_link"></a>',
        '</div>'].join(""),

    //世界杯赛事模板
    cupCompeteTemp: [
        '<div class="scoreBox">', '<div class="scoreBoxc">', '<div class="scoreL">',
        '<p><img height="40" align="absmiddle" width="58" class="wdc_flag wdc_#{army1_img}" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" alt=""/></p>',	//队旗1
        '<p>#{army1}</p>',							//队1
        '</div>', '<div class="scoreC">#{score}</div>',			//比分
        '<div class="scoreR">',
        '<p><img height="40" align="absmiddle" width="58" class="wdc_flag wdc_#{army2_img}" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" alt=""/></p>',	//队旗2
        '<p>#{army2}</p>',							//队2
        '</div>', '<div class="clearit"></div>', '</div>', '</div>'].join(""),

    //世界杯赛事模板 210
    cupCompeteTemp_210: '<li>#{army1} #{score} #{army2}</li>',

    //世界杯博文列表模板
    cupArticleTemp: [
        '<li>', '<span class="title">', '<a href="#{link}" target="_blank">#{title}</a>',		//文章名字、文章链接。
        '</span>', '<span class="author"><a href="#{authorBlog}" target="_blank">#{author}</a></span>',	//作者
        '<span class="time">#{time}</span>',		//时间
        '</li>'].join(""),

    //世界杯博文列表模板 510
    cupArticleTemp_510: [
        '<li>', '<span class="title">', '<a href="#{link}" target="_blank">#{title}</a>',		//文章名字、文章链接。
        '</span>', '<span class="author"><a href="#{authorBlog}" target="_blank">#{author}</a></span>',	//作者
        '</li>'].join(""),

    //世界杯博文列表模板 210
    cupArticleTemp_210: '<li><span class="title"><a href="#{link}" target="_blank">#{title}</a></span></li>',

    //博主看自己的链接们 510，730
    masterLinks: [
        '<div class="article_head_nav">',
        '<a href="http://control.blog.sina.com.cn/2010worldcup/my_worldcup.php" target="_blank">我关注的球队</a><em>|</em>',
        '<a href="http://control.blog.sina.com.cn/2010worldcup/my_worldcup.php" target="_blank">我关注的比赛</a><em>|</em>',
        '<a href="#{cupUserLinks}" target="_blank">我的世界杯记录</a>', '</div>'].join(""),

    //别人看博主的链接们 510，730，210
    guestLinks: [
        '<div class="article_head_nav">',
        '<a href="http://blog.2010.sina.com.cn/yunying/2010worldcup/" target="_blank">世界杯活动站</a><em>|</em>',
        '<a href="#{cupUserLinks}" target="_blank">我的世界杯记录</a>', '</div>'].join(""),

    //信息接口
    gameInfoInterface: "http://blog.sina.com.cn/2010worldcup/worldcup.js",

    //文章推荐接口
    wcArticleInterface: "http://blog.sina.com.cn/main/top_new/article_sort_worldcup/worldcup_33_new_day.js?f=wcComp105",

    //缓存的组件数据。
    gameInfo: "",

    //缓存队
    wcTeams: {},

    //缓存比赛场次
    wcMatch: {},

    //缓存世界杯推送博文
    wcArticle: {},

    isArticleOk: false,

    isGameInfoOk: false,

    //测试专用的方法。
    addToPageSet: function () {
        var btn = '<input type="checkbox" onclick="clickComponentsEvent(this, 105, \'世界杯\', 1)" id="components_1_105" value="105" checked="">';
        var div = $C("div");
        div.innerHTML = btn;
        btn = div.childNodes[0];
        document.body.insertBefore(btn, document.body.firstChild);
    },

    load: function () {
        var _this = this;
        //页面设置的样式呢？由 PHP 输出。
        //pageSet 拖动，每次都会 load。所以要缓存。
        //分样式渲染。
        //截断，210 的 13 个字。

        //trace("loading")
        this.getArticle();
        this.getGameInfo();

        //
        (function () {
            if (_this.isGameInfoOk && _this.isArticleOk) {
                //trace("is sniking");
                switch (_this.size) {
                    case 210:
                        _this.render("210");
                        break;
                    case 510:
                        _this.render("510");
                        break;
                    case 730:
                        _this.render("730");
                        break;
                }
            } else {
                //trace("waiting");
                setTimeout(arguments.callee, 200);
            }
        })();

    },

    getArticle: function () {
        var _this = this;
        if (!this.isArticleOk) {
            Utils.Io.JsLoad.request(this.wcArticleInterface, {
                onComplete: function () {
                    if (typeof json33_new_day == "undefined") {
                        trace("json33_new_day: undefined");
                        return;
                    }
                    _this.wcArticle = json33_new_day;
                    _this.isArticleOk = true;
                },
                onError: function () {

                }
            });
        }
    },

    getGameInfo: function () {
        var _this = this;
        if (!this.isGameInfoOk) {
            Utils.Io.JsLoad.request(this.gameInfoInterface, {
                onComplete: function () {
                    if (typeof wc_team_info == "undefined") {
                        trace("wc_team_info: undefined");
                        return;
                    }
                    _this.wcTeams = wc_team_info;
                    _this.wcMatch = wc_match_info;
                    _this.isGameInfoOk = true;

                    scope.wc_match_info = wc_match_info;
                    scope.wc_teams_info = wc_team_info;
                }
            });
        }
    },

    //渲染组件并显示。
    render: function (mode) {

//队名、比分
//文章标题、地址、作者、发表时间。（少普）
// wcTeams
// "1":{"name":"\u5357\u975e","group":"A","URL":"http:\/\/2010.sina.com.cn\/teams\/southafrica.shtml","chatid":3490001},
// wcMatch
// "1":{"teams":["1","2"],"time":"2010-04-20 13:00:00","score":"1:2","group":"A","chatid":3490001},

        var _this = this;

        var compTemp;
        var tempBox;			//widget 容器
        var tempScore;			//widget 赛果
        var tempArticle;		//widget 博文
        var tempLinks;			//widget 标题链接。
        var chooseQua = 10;		//选择十篇。

        var temp_a = "";
        var temp_s = "";
        var temp_l = "";
        var temp_z = '<div class="article_head_nav"><a href="http://blog.2010.sina.com.cn/yunying/2010worldcup/" target="_blank">世界杯活动站</a></div>';

        var cutLen = 100;

        //选择模板
        Lib.checkAuthor();
        var cupUserId = scope.$worldcupblogid;
        switch (mode) {
            case "210":
                tempBox = this.cupTemp_210;
                tempScore = this.cupCompeteTemp_210;
                tempArticle = this.cupArticleTemp_210;
                tempLinks = this.guestLinks;			//210 不分状态
                cutLen = 26;		//13 个汉字。其他两个不截断。
                break;
            case "510":
                tempBox = this.cupTemp;
                tempScore = this.cupCompeteTemp;
                tempArticle = this.cupArticleTemp_510;
                if ($isAdmin) tempLinks = this.masterLinks; else tempLinks = this.guestLinks;
                break;
            case "730":
            {
                tempBox = this.cupTemp;
                tempScore = this.cupCompeteTemp;
                tempArticle = this.cupArticleTemp;
                if ($isAdmin) tempLinks = this.masterLinks; else tempLinks = this.guestLinks;
                break;
            }
        }

        //渲染组合模板

        //链接模板，只关心博主，是世界杯用户才渲染。
        if (cupUserId)
            temp_l = new Ui.Template(tempLinks).evaluate({
                cupUserLinks: 'http://blog.sina.com.cn/s/blog_' + cupUserId + '.html'
            });

        //区别：模板不同（动态处不同）、随机长度不同、截断不同。
// {link:"http://blog.sina.com.cn/u/51bc4daf0100il8b",
// 	    blog_title:"1我的世界杯，盛夏激情记录",
// 	    uname:"cuichaoad2",
// 	    uid:"1371295151",
// 	    blog_pubdate:"2010-04-15 21:15:51",
// 	    blog_id:"51bc4daf0100il8b",
// 	    article_hits:"98",
// 	    blog_hits:"98"}		

        //拼文章
        var i;
        var oArt = "";
        //如果大于chooseQua个。
        if (this.wcArticle.length > chooseQua) {
            var idxs = this.seqSelect(this.wcArticle.length, chooseQua);
            var cutTitle = "";
            for (i = 0; i < idxs.length; i++) {
                oArt = this.wcArticle[idxs[i]];
                if (Core.String.byteLength(oArt.blog_title) > cutLen) {
                    cutTitle = Core.String.shorten(oArt.blog_title, cutLen);
                } else {
                    cutTitle = oArt.blog_title;
                }
                temp_a += new Ui.Template(tempArticle).evaluate({
                    link: oArt.blog_url,
                    title: cutTitle,
                    author: oArt.uname,
                    authorBlog: "http://blog.sina.com.cn/u/" + oArt.uid,
                    //time:	oArt.blog_pubdate.split(" ")[0]
                    time: oArt.blog_pubdate
                });
            }
        } else {
            for (i = 0; i < this.wcArticle.length; i++) {
                oArt = this.wcArticle[i];
                if (Core.String.byteLength(oArt.blog_title) > cutLen) {
                    cutTitle = Core.String.shorten(oArt.blog_title, cutLen);
                } else {
                    cutTitle = oArt.blog_title;
                }
                temp_a += new Ui.Template(tempArticle).evaluate({
                    link: oArt.blog_url,
                    title: cutTitle,
                    author: oArt.uname,
                    authorBlog: "http://blog.sina.com.cn/u/" + oArt.uid,
                    time: oArt.blog_pubdate
                });
            }
        }

        //查出有比分的，最大的 idx
        var maxIdx = 0;
        var i = 0;

        // var xx = {};					//测试
        // for(var j=1; j<=3; j++){
        // 	xx[j] = this.wcMatch[j];
        // }
        // xx[1].score = "";
        //  xx[2].score = "";
        //  xx[3].score = "";

        for (var key in this.wcMatch) {
            var tempStr = this.wcMatch[key].score;
            //trace(key +"  "+ tempStr)
            if (tempStr && tempStr.length > 1) {
                //trace(i);
                maxIdx = i;
                //trace("tempStr length>1"+maxIdx)
            }
            i++;
        }
        //trace(this.wcMatch);
        var match = {};
        var len;
        if (this.size == "510") len = 2;				//510 的只显示两个。
        else len = 3;

        //trace("len is "+len)
        for (i = 0; i < len; i++) {		//中间可能有镂空的元素，所以长度在自加，要保证能取到 3 个。但不能超过 maxIdx。
            //trace("curIdx:"+(maxIdx-i))
            if (maxIdx - i < 0) break;
            match = this.wcMatch[maxIdx - i + 1];		//崩……key 是从字符 "1"开始的
            if (!match.score) {
                len++;
                continue;				//没有比分，不渲染。
            }
            // trace(match)
            // trace("score:" + match.score)
            // trace("army1:" + this.wcTeams[match.teams[0]].name)
            // trace("army2_img:" + match.teams[0])
            temp_s += new Ui.Template(tempScore).evaluate({
                score: match.score,
                army1: this.wcTeams[match.teams[0]].name,
                army1_img: match.teams[0],
                army2: this.wcTeams[match.teams[1]].name,
                army2_img: match.teams[1]
            });
            //trace(temp_s);
        }

        //添加到我的博客
        compTemp = new Ui.Template(tempBox).evaluate({
            activityLinks: temp_l ? temp_l : temp_z,				//博主不是世界杯用户，链接条只显示活动站链接。
            gameArticle: temp_a,
            articleDisplay: temp_a ? "block" : "none",
            gameScore: temp_s,
            scoreDisplay: temp_s ? "block" : "none",
            titleDisplay: temp_s ? "block" : "none",
            addToMyBlog: "Lib.Component.clone(105, 210); return false;",
            btnDisplay: $isAdmin ? "none" : "block"
        });

        this.setContent(compTemp);
    },

    //根据长度，从中选择 10 个。排重。
    luckySelect: function (length, qua) {
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
    },

    //顺序选择 10 个。
    seqSelect: function (length, qua) {
        var result = [];
        for (var i = 0; i < qua; i++) {
            result.push(i);
        }
        return result;
    }

}, "dynamic");


