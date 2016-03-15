/**
 * @fileoverview
 *    博客首页留言组件
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
$import("sina/core/string/byteLength.js");
$import("sina/ui/template.js");

$import("lib/component/class/registComp.js");
$import("lib/component/extend/comp_dynamic.js");
$import("lib/interface.js");
$import("lib/checkAuthor.js");
$import("lib/msg/componentMSG.js");
$import("lib/blogv/getVHTML.js");
$import("lib/util/cutNickName.js");

$import("component/include/deleteWallByMsgid.js");
$import("msg/componentMSG.js");
$registComp(2, {
//	http://wall.cws.api.sina.com.cn/widget_list.php?uid=1406758883&limit=10&varname=requestId_4978243
        /*
         * 留言接口
         */
        "Interface": new Interface("http://wall.cws.api.sina.com.cn/widget_list.php", "jsload")
        /*
         * 留言接口参数
         */, "requestParam": {
            "uid": scope.$uid, "limit": "10"
//			,"varname"	: "requestId_blog_index_wall_list"
        }
        /*
         * 留言 HTML 模板
         */, "html": ['<li class="commentsCell SG_j_linedot1">'
            , '<div class="commentsH"><span class="commentsName SG_txtc SG_dot">'
            ,
            '<a href="http://blog.sina.com.cn/u/#{uid}" target="_blank" title="#{nick}">#{shortName}</a>#{userV}</span>'
            , '<span class="commentsDate SG_txtc">#{time}</span></div>'
            , '<div class="commentsContants">#{manage}<div class="commentsContantsTxt">'
            ,
                '<a href="http://blog.sina.com.cn/s/profile_' + scope.$uid + '.html#module_942" target="_blank">#{shortMsg}</a></div></div>'
            , '</li>'].join("")
        /*
         * 载入留言数据
         */, "load": function () {
            this.Interface.request({
                GET: this.requestParam, onSuccess: Core.Function.bind2(function (oData) {
                    // 缓存当前的数据
                    this.cacheData = oData.list;
//				this.total = oData.total;
                    this["render_" + this.size](this.cacheData);
                }, this), onError: Core.Function.bind2(function (oData) {
                    if (oData.code == "A00101") {
                        this.setContent($SYSMSG[oData.code]);
                    } else {
                        this.showError(oData.code);
                    }
                }, this), onFail: Core.Function.bind2(function (oData) {
                    this.showError($SYSMSG.A80101);
                }, this)
            });
            if (scope.$pageid == "pageSetM" && this.setManage) {
                this.setManage();
            }
        }
        /*
         * 按 210 像素宽度渲染留言组件
         */, "render_210": function (oData) {
            oData = oData || this.cacheData;
            this.parseToHTML(oData);
        }
        /*
         * 按 510 像素宽度渲染留言组件
         */, "render_510": function (oData) {
            oData = oData || this.cacheData;
            this.parseToHTML(oData);
        }
        /*
         * 按 730 像素宽度渲染留言组件
         */, "render_730": function (oData) {
            oData = oData || this.cacheData;
            this.parseToHTML(oData);
        },
        /*
         * 留言组件由 Json 转为 HTML
         */
        "parseToHTML": function (oData) {
            // 如果留言数为 0，直接显示空文案
            if (oData.length == 0) {
                this.showEmpty();
            } else {
                Lib.checkAuthor();
                var getVHTML = Lib.blogv.getVHTML;
                var cutNickName = Lib.util.cutNickName;
                Core.Array.foreach(oData, Core.Function.bind2(function (oItem) {
                    if (!oItem.msg) {
                        return
                    }

                    var tempDiv = $C("div");
                    // 留言删除按钮
                    oItem.manage = $isAdmin ? '<span class="option"><a href="#" onclick="Lib.deleteWallByMsgid(\'' + oItem.msgid + '\', ' + oItem.uid + ', Core.Function.bind2(Lib.Component.instances[' + this.compId + '].reload, Lib.Component.instances[' + this.compId + ']));return false;" class="CP_a_fuc">[<cite>删除</cite>]</a></span>' : '';
                    if (oItem.msg.indexOf("href") > -1) {
                        //trace("含有 a 标签");
                        tempDiv.innerHTML = oItem.msg;
                        oItem.msg = tempDiv.childNodes[0].innerHTML;		//退掉 a 标签。
                    }
                    if (this.size == 210 && !$isAdmin && Core.String.byteLength(oItem.msg) > 30) {
                        oItem.shortMsg = (Core.String.leftB(Core.String.a2u(oItem.msg), 28) + "…");
                    } else if (this.size == 210 && $isAdmin && Core.String.byteLength(Core.String.a2u(oItem.msg)) > 22) {
                        oItem.shortMsg = (Core.String.leftB(Core.String.a2u(oItem.msg), 20) + "…");
                    } else {
                        oItem.shortMsg = oItem.msg;
                    }
                    var wtype = isNaN(oItem.wtype) ? -1 : oItem.wtype;
                    oItem.wtype = wtype = parseInt(wtype, 10);
                    oItem.userV = getVHTML(wtype);
                    oItem.shortName = cutNickName(oItem.nick, wtype, 18);

                }, this));

                var template = new Ui.Template(this.html);
                var result = '<div class="zComments"><ul class="zCommentsUl">' + template.evaluateMulti(oData) + '</ul>';
                // 更多链接，只有在博主登录才可以看到，且满足
//			if($isAdmin == true && ((this.size < 730 && this.total > 12) || (this.size == 730 && this.total > 18))){
//				result += '<div class="moreLink SG_j_linedot1"><span class="SG_more">'
//					+ '<a href="http://icp.api.sina.com.cn/visitor/visitor.php?showtype=1">更多</a>&gt;&gt;</span></div>';
//			}
                result += '<div class="toDoBar"><span class="SG_more SG_floatR"><a href="http://blog.sina.com.cn/s/profile_' + scope.$uid + '.html#module_942" target="_blank">更多</a>&gt;&gt;</span>' + '<a href="http://blog.sina.com.cn/s/profile_' + scope.$uid + '.html#write" class="SG_aBtn"' + ' target="_blank"><cite>写留言</cite></a></div>';
                this.setContent(result);
            }

        }
        /*
         * 留言为 0 的文案
         */, "showEmpty": function () {
            this.setContent('<div class="SG_nodata">' + $SYSMSG.B80002 + '</div>');
        }
    }, 'dynamic');