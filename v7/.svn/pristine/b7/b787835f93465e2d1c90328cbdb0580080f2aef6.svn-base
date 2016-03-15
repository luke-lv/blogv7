/**
 * @fileoverview tj=tech页 文章信息组件
 * @author Liu Xiaoyue | xiaoyue3@staff.sina.com.cn
 * @date 2013-03-29
 * @vertion 0.01
 */

$import("sina/core/dom/getChildrenByClass.js");
$import("lib/component/class/registComp.js");
$import("lib/component/extend/comp_static.js");

$registComp(3007, {
    /**
     * 加载文章信息组件
     *
     */
    load: function () {
        var struc = "";
        var moudleId = $E("module_3007");
        var blogArticle = $E("module_3006");
        Utils.Io.JsLoad.request('http://control.blog.sina.com.cn/blog_rebuild/riaapi/blog/getAssocData.php', {
            GET: {
                blog_id: scope.$articleid,
                blog_tag: scope.$tags,
                sort_id: scope.$sort_id
            },
            onComplete: function (result) {
                var _shorten = Core.String.shorten;
                var articleCon = result && result.data && result.data.msg && result.data.msg.assoc, tuijianInfo = result && result.data && result.data.msg && result.data.msg.tuijian.tuijiandata;
                //热文排行渲染
                var struc = "", shortCon, tuijianLen = tuijianInfo.length;
                if (tuijianLen && moudleId) {
                    for (var i = 0; i < tuijianLen; i++) {
                        var conLenTuijian = tuijianInfo[i].uname + "：" + tuijianInfo[i].blog_title;
                        shortCon = _shorten(conLenTuijian, 38);
                        struc += '<li><em>' + (i + 1) + '</em><a href="' + tuijianInfo[i].blog_url + '" target="blank" title="' + conLenTuijian + '">' + shortCon + '</a></li>';
                    }
                    var wrap = moudleId.children[0].children[1].children[0];
                    wrap.innerHTML = struc;
                    var lis = moudleId.getElementsByTagName("li");
                    var len = lis.length;
                    if (len) {
                        switch (len) {
                            case 1:
                                lis[0].children[0].className = "top";
                                break;
                            case 2:
                                lis[0].children[0].className = "top";
                                lis[1].children[0].className = "top";
                                break;
                            case 3:
                                lis[0].children[0].className = "top";
                                lis[1].children[0].className = "top";
                                lis[2].children[0].className = "top";
                                break;
                            default :
                                lis[0].children[0].className = "top";
                                lis[1].children[0].className = "top";
                                lis[2].children[0].className = "top";
                                lis[lis.length - 1].className = "last";
                                break;
                        }
                    }
                    moudleId.style.display = "";
                }
                // struc = '<ul class="conn_low_con article">' + struc + '</ul>';
                // var wrap = moudleId.children[0].children[1];
                //推荐文章渲染
                var struc1 = "";
                var conLen = articleCon.length;
                var _tji;
                if (conLen && blogArticle) {
                    for (var i = 0; i < conLen; i++) {
                        var conLens = articleCon[i].title;
                        _tji = _shorten(conLens, 38);
                        struc1 += '<li><span><a href="http://blog.sina.com.cn/s/blog_' + articleCon[i].blogid + '.html" target="blank" title="' + conLens + '">' + _tji + '</a></span></li>';
                    }
                    var arWrap = blogArticle.children[0].children[1].children[0];
                    arWrap.innerHTML = struc1;
                    var articlelis = blogArticle.getElementsByTagName("li");
                    var arLen = articlelis.length;
                    if (arLen >= 1) {
                        articlelis[arLen - 1].className = "last";
                    }
                    blogArticle.style.display = "";
                }

                // struc1 = '<ul class="conn_low_con article hotarticle">'+ struc1 +'</ul>'
                // var arWrap = blogArticle.children[0].children[1];

            },
            onException: function () {
            }
        });
    }
}, "static");
