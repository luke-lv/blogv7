/**
 * @fileoverview
 *    博客首页评论组件
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/core/array/foreach.js");
$import("sina/core/function/bind2.js");
$import("sina/core/string/a2u.js");
$import("sina/core/string/leftB.js");
$import("sina/core/string/shorten.js");
$import("sina/core/string/decodeHTML.js");
$import("sina/core/string/encodeHTML.js");
$import("sina/ui/template.js");

$import("lib/component/class/registComp.js");
$import("lib/component/extend/comp_dynamic.js");
$import("lib/interface.js");
$import("lib/checkAuthor.js");
$import("lib/msg/componentMSG.js");
$import("lib/blogv/getVHTML.js");

$import("component/include/deleteCommentByAid.js");
$import("tempLib/magicFace/magicFace.js");
$import("msg/componentMSG.js");
$registComp(1, {
//	http://blognewcms.sinajs.cn/lcms6?uid=1406758883&varname=mylastcomment
        /*
         * 评论接口
         */
        "Interface": new Interface("http://blog.sina.com.cn/s/lcms_" + scope.$uid + ".js", "jsload")
        /*
         * 评论接口参数
         */, "requestParam": {
            "varname": "mylastcomment"	// varname 固定为  mylastcomment
        }
        /*
         * 评论 HTML 模板 510px/730px
         */, "html": ['<li class="commentsCell SG_j_linedot1">'
            , '<div class="avatars">#{user_link}<img src="#{icon}" alt="#{uname}" />#{user_linkend}</div>'
            , '<div class="hasAvatars">'
            , '<div class="commentsH"><span class="commentsName SG_txtb">#{user_link}'
            , '#{uname}#{user_linkend}#{userV} 评论了 <a href="http://blog.sina.com.cn/s/blog_#{aid}.html"'
            , ' target="_blank">#{shortTitle}</a>#{tsina}</span>'
            , '<span class="commentsDate SG_txtc">#{time}</span></div>'
            , '<div class="commentsContants">#{manage}'
            ,
            '<div class="commentsContantsTxt"><a href="http://blog.sina.com.cn/s/blog_#{aid}.html#comment" target="_blank">#{content}</a></div></div></div>'
            , '</li>'].join("")
        /*
         * 评论 HTML 模板 210px
         */, "html_210": ['<li class="commentsCell SG_j_linedot1">'
            ,
            '<div class="commentsH"><span class="commentsName SG_txtc SG_dot">#{user_link}#{uname}#{user_linkend}#{userV}#{tsina}</span>'
            , '<span class="commentsDate SG_txtc">#{time}</span></div>'
            , '<div class="commentsContants">#{manage}'
            ,
            '<div class="commentsContantsTxt"><a href="http://blog.sina.com.cn/s/blog_#{aid}.html#comment" target="_blank">#{shortMsg}</a></div></div>'
            , '</li>'].join("")
        /*
         * 载入评论数据
         */, "load": function () {
            this.Interface.request({
                GET: this.requestParam, onSuccess: Core.Function.bind2(function (oData) {
                    // 缓存当前的数据
                    this.cacheData = oData.recode || [];
                    this.more = oData.more || 0;
                    this["render_" + this.size](this.cacheData);
                }, this), onError: Core.Function.bind2(function (oData) {
                    Debug.error("Interface error");
                    this.showError(oData.code);
                }, this), onFail: Core.Function.bind2(function (oData) {
                    this.showError($SYSMSG.A80101);
                }, this)
            });
            if (scope.$pageid == "pageSetM" && this.setManage) {
                this.setManage();
            }
        }
        /*
         * 按 210 像素宽度渲染评论组件
         */, "render_210": function (oData) {
            oData = oData || this.cacheData;
            this.htmlTemplate = this.html_210;
            this.parseToHTML(oData);
        }
        /*
         * 按 510 像素宽度渲染评论组件
         */, "render_510": function (oData) {
            oData = oData || this.cacheData;
            this.htmlTemplate = this.html;
            this.parseToHTML(oData);
        }
        /*
         * 按 730 像素宽度渲染评论组件
         */, "render_730": function (oData) {
            oData = oData || this.cacheData;
            this.htmlTemplate = this.html;
            this.parseToHTML(oData);
        },
        /*
         * 评论组件由 Json 转为 HTML
         */
        "parseToHTML": function (oData) {
            // 如果评论数为 0，直接显示空文案
            if (oData.length == 0) {
                this.showEmpty();
            } else {
                var getVHTML = Lib.blogv.getVHTML;
                var decodeHTML = Core.String.decodeHTML;
                var leftB = Core.String.leftB;
                var encodeHTML = Core.String.encodeHTML;
                var byteLength = Core.String.byteLength;
                var a2u = Core.String.a2u;

                Lib.checkAuthor();

                Core.Array.foreach(oData, Core.Function.bind2(function (oItem) {

                    oItem.icon = "http://portrait" + ((1 * oItem.uid) % 8 + 1) + ".sinaimg.cn/" + oItem.uid + "/blog/50";
                    // 评论删除按钮
                    oItem.manage = $isAdmin ? '<span class="option"><a href="#" onclick="Lib.deleteCommentByAid(\'' + oItem.aid + '|' + oItem.comment_id + '\', Core.Function.bind2(Lib.Component.instances[' + this.compId + '].reload, Lib.Component.instances[' + this.compId + ']),' + oItem.uid + ');return false;" ' + 'class="CP_a_fuc">[<cite>删除</cite>]</a></span>' : '';
                    var content = oItem.content;
                    oItem.wtype = parseInt(oItem.wtype, 10);
                    oItem.userV = getVHTML(oItem.wtype);

                    if (this.size == 210) {
                        content = content.replace(/(<img[^>]+>)/g, function (a, b) {
                            var smileDesc = b.match(/title="([^"]+)"/);
                            return smileDesc == null ? "" : smileDesc[1] + " ";
                        });
                        // Modified by L.Ming @2009.10.27 如果是210px宽度，过滤掉<br/>
                        content = content.replace(/<br\/?>/gi, " ");
                    }

                    content = decodeHTML(oItem.content);		//正则先处理。
                    //content = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1";			// "     1"
                    //content = "&lt;script&gt;alert(1)&lt;/script&gt;";	// "<script>alert(1)</script>"
                    //content = Core.String.decodeHTML(content);
                    // 微博昵称截断
                    if (byteLength(oItem.uname) > 18 && this.size == 210 && oItem.userV) {
                        oItem.uname = leftB(a2u(oItem.uname), 14) + "...";
                    }

                    if (this.size == 210 && !$isAdmin && byteLength(content) > 30) {		//普通字符比较长度。
                        //oItem.shortMsg = Core.String.leftB(Core.String.a2u(content), 28) + "…";
                        oItem.shortMsg = encodeHTML(leftB(a2u(content), 28)) + "…";		//因为之前 decode 了，innerHTML 危险。

                    } else if (this.size == 210 && $isAdmin && byteLength(content) > 22) {
                        //oItem.shortMsg = Core.String.leftB(Core.String.a2u(content), 20) + "…";
                        oItem.shortMsg = encodeHTML(leftB(a2u(content), 20)) + "…";
                    } else {
                        oItem.shortMsg = encodeHTML(content);
                    }

                    if (this.size == 510 && byteLength(oItem.title) > 30) {
                        oItem.shortTitle = ( leftB(a2u(oItem.title), 28) + "…");
                    } else {
                        oItem.shortTitle = oItem.title;
                    }
                    if (oItem.from_tsina == 1) {
                        oItem.user_link = '<a href="' + oItem.ulink + '" target="_blank" title="' + oItem.uname + '">';
                        oItem.user_linkend = '</a>';
                        oItem.tsina = '<img height="15" align="absmiddle" width="15" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon51">';
                    } else {
                        oItem.user_link = oItem.uid == 0 ? '' : '<a href="http://blog.sina.com.cn/u/' + oItem.uid + '" target="_blank" title="' + oItem.uname + '">';
                        oItem.user_linkend = oItem.uid == 0 ? '' : '</a>';
                        oItem.tsina = '';
                    }
                }, this));
                var template = new Ui.Template(this.htmlTemplate);
                var result = (this.size == 210 ? '<div class="zComments"><ul class="zCommentsUl">' : '<div class="zComments zAvatars"><ul class="zCommentsUl">') + template.evaluateMulti(oData) + '</ul>';
                // 更多链接，只有在博主登录才可以看到，且满足评论大于 10 条
                if ($isAdmin && this.more == 1) {
                    result += '<div class="toDoBar"><span class="SG_more SG_floatR">' + '<a href="http://i.blog.sina.com.cn/blogprofile/profilecommlist.php?type=1" target="_blank">更多</a>&gt;&gt;</span></div>';
                }
                this.setContent(result);
            }

        }
        /*
         * 评论为 0 的文案
         */, "showEmpty": function () {
            this.setContent('<div class="SG_nodata">' + $SYSMSG.B80003 + '</div>');
        }
        /*
         * 设置评论组件的管理链接，仅在页面设置新增组件的时候会用到
         */, "setManage": function () {
            if ($isAdmin && this.getManage()) {
                this.getManage().innerHTML = '<span class="move"><a href="#" ' + 'onclick="funcMoveUpDown.up(1);return false;">↑</a><a href="#" ' + 'onclick="funcMoveUpDown.down(1);return false;">↓</a></span>' + '<a href="#" onclick="hiddenComponents(\'' + this.compId + '\');return false;" class="CP_a_fuc">[<cite>隐藏</cite>]</a>';
            }
        }
    }, 'dynamic');