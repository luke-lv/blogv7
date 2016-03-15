/**
 * @fileoverview 组件 文章页 图片博客VIP热榜
 * @author Luo Rui | luorui1@staff.sina.com.cn
 */
$import("lib/component/class/registComp.js");
$import("lib/component/extend/comp_dynamic.js");
$import("sina/utils/io/jsload.js");

$registComp(102, {
    load: function () {
        trace("comp_1023");
        this.loadArticle();
    }, loadArticle: function () {
        Utils.Io.JsLoad.request("http://control.blog.sina.com.cn/riaapi/photoblog/get_hotblog_list.php", {
            GET: {
                uid: scope.$uid,
                version: 7
            },
            onComplete: function (data) {
                trace('---------------code:' + data.code);
                var htmlStr = ['<div class="photoBlog">'];
                var json = data;
                var list = json.data;
                for (var n = 0, m = list.length; n < m; n++) {
                    var tj = list[n].tj ? list[n].tj : '';
                    htmlStr.push('<div class="photoBlog_cell"><div class="photoBlog_view"><table><tr><td><a href="');
                    htmlStr.push(list[n].blogurl);
                    htmlStr.push('" target="_blank"><img class="borderc" src="');
                    htmlStr.push(list[n].picurl);
                    htmlStr.push('" alt="');
                    htmlStr.push(list[n].title);
                    htmlStr.push('" title="');
                    htmlStr.push(list[n].title);
                    htmlStr.push('"/></a></td></tr></table></div><p class="photoBlog_nm">');
                    htmlStr.push(tj);
                    htmlStr.push('<a href="');
                    htmlStr.push(list[n].blogurl);
                    htmlStr.push('" target="_blank">');
                    htmlStr.push(list[n].title);
                    htmlStr.push('</a></p><p>阅读(');
                    htmlStr.push(list[n].hitsnum);
                    htmlStr.push(') 评论(');
                    htmlStr.push(list[n].commentnum);
                    htmlStr.push(')</p></div>');
                    //htmlStr += this.tpl.format(list[n].blogurl, list[n].title, list[n].picnum, list[n].hitsnum, list[n].commentnum, list[n].picurl, tj, list[n].title);
                }
                htmlStr.push('</div>');
                this.getContent().innerHTML = htmlStr.join('');
            }.bind2(this), onException: function () {
                trace("connect error");
            }
        });
    }, tpl: '' + '<div class="photoBlog_cell">' + '<div class="photoBlog_view">' + '<table>' + '<tr>' + '<td>' + '<a href="{0}" target="_blank"><img class="borderc" src="{5}" alt="{7}" title="{7}"/></a>' + '</td>' + '</tr>' + '</table>' + '</div>' + '<p class="photoBlog_nm">{6}<a href="{0}" target="_blank">{1}</a> <span class="count">({2}张)</span></p>' + '<p>阅读({3}) 评论({4})</p>' + '</div>'
}, 'dymanic');
