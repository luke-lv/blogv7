/**
 * @fileoverview 博文页面 最新影评组件
 * @author wujian|wujian@staff.sina.com.cn
 *
 */
$import("lib/component/class/registComp.js");
$import("lib/component/extend/comp_dynamic.js");
$import("lib/checkAuthor.js");
$import("sina/ui/dialog/windowDialog.js");
$import("sina/utils/io/jsload.js");
$import("sina/core/string/expand.js");
$import("sina/core/string/collapse.js");
$import("sina/core/string/formatNumber.js");
$import("component/filmBlog/searchFilm.js");
$registComp(122, {
    "getLatestComm": new Interface("http://control.blog.sina.com.cn/riaapi/film/get_latest_filmcomment.php", "jsload"),
    load: function () {
        this.getLatestComm.request({
            onSuccess: Core.Function.bind2(function (oData) {
                trace("---------ok----------")
                // 缓存当前的数据
                this.cacheData = oData;
                this.toHTML(this.cacheData);
            }, this),
            onError: Core.Function.bind2(function (oData) {
                trace("---------error----------");

                this.showError(oData.code);

            }, this),
            onFail: Core.Function.bind2(function (oData) {
                this.showError($SYSMSG.A80101);
            }, this)
        });
    },
    /**
     * 数据装换为 html
     * @param {Object} data
     */
    "toHTML": function (data) {
        var d = data;
        // data = data.data;
        if (data.length == 0) {
            this.handleEmpty();
            return;
        }
        //遍历节点 控制字数
        var titleLen = 11, commentLen = 12;
        for (var i = 0, len = data.length; i < len; i++) {
            //先修改电影title
            var filmname = data[i]["filmname"];
            //alert(filmname)
            //  filmname = checkStrLen(filmname, titleLen);

            data[i]["filmname_limit"] = filmname;
            //修改影评标题 长度
            for (var j = 0, length = data[i]["comment"].length; j < length; j++) {
                data[i]["comment"][j].title_limit = checkStrLen(data[i]["comment"][j].title, commentLen);
            }
            ;
            data[i]["num"] = Core.String.formatNumber(data[i]["num"]);
            //修改影评标题 长度
            /* var count = 0;
             for (var j = 0, length = data[i]["comment"].length; j < length; j++) {
             var commentTitle = data[i]["comment"][j].title;

             commentTitle = Core.String.expand(commentTitle);
             if (commentTitle.length > commentLen) {
             //data[i]["comment"][j].title=data[i]["comment"][j].title.substr(0,commentLen)+" "+data[i]["comment"][j].title.substr(commentLen,data[i]["comment"][j].title.length)
             count++;
             }
             };
             j--;
             //alert(count)
             if (count == 3) {
             trace("要截断字数了");
             data[i]["comment"][j].title_limit = checkStrLen(data[i]["comment"][j].title, commentLen);
             j--;
             }
             while(j>=0){
             data[i]["comment"][j].title_limit = checkStrLen(data[i]["comment"][j].title, commentLen*2-1);
             data[i]["comment"][j].title_limit=addSpace(data[i]["comment"][j].title_limit,commentLen);
             j--;
             }*/
        }
        ;
        /**
         * 添加 空格 强制 a标签内的文字换行 汗 浏览器 太难伺候了
         * @param {Object} str
         * @param {Object} pos
         */
        function addSpace(str, pos) {
            str = Core.String.expand(str);
            if (str.length <= pos) {
                pos = str.length - 1;
            }
            str = str.substr(0, pos) + " " + str.substr(pos);
            str = Core.String.collapse(str);
            return str;
        }

        /**
         * 检查字符串长度
         * @param {Object} str
         * @param {Object} max
         */
        function checkStrLen(str, max) {
            //str="test";
            //alert(str)
            var temp = Core.String.expand(str);
            if (temp.length > max) {
                temp = temp.substr(0, max);
            }
            temp = Core.String.collapse(temp);
            return temp;
        }

        var html = "";
        for (var m = 0, mlen = data.length; m < mlen; m++) {
            var type = data[m].type == 2 ? "movie" : "tv";
            // var url = 'http://control.blog.sina.com.cn/admin/article/article_add.php?film_id=' + data[m]["filmid"] + '&type=' + type;
            //电影详情页面地址				
            var url = "http://data.ent.sina.com.cn/" + type + "/" + data[m]["filmid"] + ".html";
            var filmname = data[m]["filmname"], filmname_limit = data[m]["filmname_limit"];
            var imgurl = data[m]["imgurl"], num = data[m]["num"];

            html += ['<li class="cur">',
                    '<a href="' + url + '" target="_blank" title="' + filmname + '"><img alt="' + filmname + '" src="' + imgurl + '"></a>',
                //'<div class="vltxt"><a href="' + url + '" title="'+filmname+'" target="_blank">' + filmname_limit + '</a></div>',
                    '<p>共' + '<strong><a href="javascript:void(0);" onclick="scope.searchFilm(\'' + filmname + '\')">' + num + '</a></strong>篇</p>',
                '<ul>'].join("");

            for (var n = 0, nlen = data[m]["comment"].length; n < nlen; n++) {
                html += '<li><a title="' + data[m]["comment"][n].title + '" href="' + data[m]["comment"][n].url + '" target="_blank">' + data[m]["comment"][n].title_limit + '</a></li>'

            }
            ;
            var dot = m == mlen - 1 ? "" : '<div class="SG_j_linedot"></div>';
            //var dot='<div class="SG_j_linedot"></div>';
            html += ['</ul>', dot, '<div class="clearit"></div>', '</li>'].join("");
        }
        ;

        var innerHTML = ['<div class="hotmovies">', '<ul>', html, '</ul>',
            '</div><div class="clearit"></div>'].join("");
        //this.getContent().innerHTML = innerHTML;
        this.setContent(innerHTML);
    },
    "handleEmpty": function () {
        trace("没有最新影评数据");
        var innerHTML = ['<div class="SG_nodata">', '<p>还没有影评。</p>', '</div>'].join("");
        this.setContent(innerHTML);
    }
}, "dynamic");

