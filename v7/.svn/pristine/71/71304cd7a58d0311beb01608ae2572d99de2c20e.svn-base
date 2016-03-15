/**
 * @fileoverview
 *    博客列表页分类组件
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/core/array/hashBy.js");
$import("sina/core/dom/addHTML.js");
$import("sina/core/function/bind2.js");
$import("sina/ui/template.js");

$import("lib/component/class/registComp.js");
$import("lib/component/extend/comp_dynamic.js");
$import("lib/interface.js");
$import("lib/checkAuthor.js");

$import("component/include/getArticlesSort.js");
$registComp(7, {
        /*
         * 分类模板 210px
         */
        "htmlTemplate": ['<li#{current}>'
            , '<div class="menuCell_main">'
            , '<span class="SG_dot">#{sortadd_start}#{name}#{sortadd_end}<em>(#{count})</em></span>'
            , '</div>'
            , '<div class="menuCell_bot"></div>'
            , '</li>'].join("")
        /*
         * 载入分类数据
         */, "load": function () {
            Lib.checkAuthor();
            // 只有是访客访问，且当前浏览的是小分类的时候才渲染
            if (!$isAdmin && scope.$blogArticleSortSelected && scope.$blogArticleSortSelected * 1 != 0) {
                // 从公共函数包 App.getArticlesSort 获得分类信息
                App.getArticlesSort(Core.Function.bind2(this.parse, this));
                // 获取推荐数
                //this.loadRecommendNumber();
            }
        }
        /*
         * 解析分类数据
         */, "parse": function (oData) {
            // 保存分类名
            //var nameHash = Core.Array.hashBy(oData.c.cates, "id");
            // 保存分类文章数
            //var countHash = Core.Array.hashBy(oData.n.cates, "id");
            var dataHash = Core.Array.hashBy(oData.data, "id"); //flm
            var data = [
                {
                    "current": '', "sortadd_start": '<a href="http://blog.sina.com.cn/s/articlelist_' + scope.$uid + '_0_1.html">', "name": "全部博文", "count": oData.total || "0", "sortadd_end": "</a>"
                }
            ];
            for (var key in dataHash) {
                var oItem = {
                    "current": (scope.$blogArticleSortSelected == key) ? ' class="current"' : '', "sortadd_start": (scope.$blogArticleSortSelected == key) ? '<strong>' : '<a href="http://blog.sina.com.cn/s/articlelist_' + scope.$uid + '_' + key + '_1.html">', "name": dataHash[key].name, "count": dataHash[key].count || "0", "sortadd_end": (scope.$blogArticleSortSelected == key) ? '</strong>' : '</a>'
                };
                data.push(oItem);
            }
            this.parseToHTML(data);
        }
        /*
         * 评论组件由 Json 转为 HTML
         */, "parseToHTML": function (oData) {
            // 如果评论数为 0，直接显示空文案
            if (oData.length == 0) {
                this.showEmpty();
            } else {
                var template = new Ui.Template(this.htmlTemplate);
                var result = template.evaluateMulti(oData);
                $E("menuList_blog_classList").innerHTML = result;
            }
        }
        /*
         * 获取推荐数，并回写
         */, "loadRecommendNumber": function () {
            var i_getRecommend = new Interface("http://control.blog.sina.com.cn/dyapi/article_recommend/get_tj_article_num.php", "jsload");
            i_getRecommend.request({
                GET: {
                    "uid": scope.$uid
                }, onSuccess: function (oData) {
                    if ($E("menuList_blog_classList")) {
                        Core.Dom.addHTML($E("menuList_blog_classList"), '<div class="SG_j_line"></div><ul><li>' + '<div class="menuCell_main">' + '<span class="SG_dot"><a href="http://blog.sina.com.cn/s/articlerecommended_' + scope.$uid + '_1.html">被推荐博文<em>(' + oData.num + ')</em></a></span>' + '</div><div class="menuCell_bot"></div></li></ul>');
                    }
                }, onError: function () {
                }, onFail: function () {
                }
            });
        }
    }, 'dynamic');