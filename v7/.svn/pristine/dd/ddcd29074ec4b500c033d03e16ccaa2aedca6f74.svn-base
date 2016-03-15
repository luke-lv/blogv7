/**
 * @fileoverview
 *    博客首页好友组件
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/ui/template.js");
$import("sina/core/array/foreach.js");
$import("sina/core/function/bind2.js");
$import("sina/core/string/a2u.js");
$import("sina/core/string/leftB.js");

$import("lib/component/class/registComp.js");
$import("lib/component/extend/comp_dynamic.js");
$import("lib/interface.js");
$import("lib/uic.js");
$import("lib/checkAuthor.js");
$import("lib/msg/componentMSG.js");
$import("lib/blogv/getVHTML.js");
$import("lib/util/cutNickName.js");

$import("msg/componentMSG.js");
$registComp(17, {
        /*
         * 好友接口
         */
        "Interface": new Interface("http://blogtj.sinajs.cn/api/GetFriendListFromModule.php", "jsload")
        /*
         * 好友接口参数
         */, "requestParam": {
            "uid": scope.$uid
//			,"limit"	: "18"
            , "varname": "requestId_blog_index_friend_list"
        }
        /*
         * 好友 HTML 模板
         */, "html": ['<div class="ptCell">'
            ,
            '<p class="pt_img"><a href="http://blog.sina.com.cn/u/#{uid}" target="_blank"><img src="#{icon}" width="50" height="50" '
            , 'alt="#{nick}" title="#{nick}" /></a>#{update}</p>'
            ,
            '<p class="pt_nm"><a href="http://blog.sina.com.cn/u/#{uid}" target="_blank" title="#{nick}">#{shortNick}</a>#{userV}</p>'
            , '</div>'].join("")
        /*
         * 载入好友数据
         */, "load": function () {
            var getVHTML = Lib.blogv.getVHTML;
            this.Interface.request({
                GET: this.requestParam, onSuccess: Core.Function.bind2(function (oData) {
                    // 缓存当前的数据
                    this.cacheData = oData.record;
                    this.more = oData.ismore;
                    var uidList = [];
                    Core.Array.foreach(this.cacheData, function (oItem) {
                        uidList.push(oItem.uid);
                        var wtype = oItem.wtype;
                        wtype = isNaN(wtype) ? -1 : parseInt(wtype);
                        oItem.wtype = wtype;
                        oItem.userV = getVHTML(wtype);
                    });
                    Lib.Uic.getNickName(uidList, Core.Function.bind2(this.parse, this), 18);
                }, this), onError: Core.Function.bind2(function (oData) {
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
         * 根据组件宽度决定调用哪个宽度渲染
         */, "parse": function (oUicData) {
            this.nickList = oUicData;
            this["render_" + this.size](this.cacheData);
        }
        /*
         * 按 210 像素宽度渲染好友组件
         */, "render_210": function (oData) {
            oData = oData || this.cacheData;
            this.ismore = this.more || (this.cacheData.length > 12);
            oData = oData.slice(0, 12);
            this.parseToHTML(oData);
        }
        /*
         * 按 510 像素宽度渲染好友组件
         */, "render_510": function (oData) {
            oData = oData || this.cacheData;
            this.ismore = this.more || (this.cacheData.length > 12);
            oData = oData.slice(0, 12);
            this.parseToHTML(oData);
        }
        /*
         * 按 730 像素宽度渲染好友组件
         */, "render_730": function (oData) {
            oData = oData || this.cacheData;
            this.ismore = this.more || (this.cacheData.length > 18);
            this.parseToHTML(oData);
        },
        /*
         * 好友组件由 Json 转为 HTML
         */
        "parseToHTML": function (oData) {
            // 如果好友数为 0，直接显示空文案
            if (oData.length == 0) {
                this.showEmpty();
            } else {
                Lib.checkAuthor();
                var _cutNickName = Lib.util.cutNickName;
                Core.Array.foreach(oData, Core.Function.bind2(function (oItem) {
                    // 好友删除按钮
                    oItem.update = oItem.isblogupdate || oItem.isphotoupdate || oItem.isvblogupdate || oItem.isbbsupdate || oItem.ismusicupdate ? '<span class="new"><img class="SG_icon SG_icon7" ' + 'src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" ' + 'height="15" title="有内容更新，赶快去看一下" align="absmiddle" /></span>' : '';
                    oItem.nick = this.nickList[oItem.uid] || "新浪网友";
                    oItem.shortNick = _cutNickName(oItem.nick, oItem.wtype);
                    oItem.icon = "http://portrait" + ((1 * oItem.uid) % 8 + 1) + ".sinaimg.cn/" + oItem.uid + "/blog/50";
                }, this));
                var template = new Ui.Template(this.html);
                var result = '<div class="ptList friendList">' + template.evaluateMulti(oData) + '</div>';
                // 更多链接，只有在博主登录才可以看到，且满足
                if ($isAdmin == true && this.ismore == 1) {
                    result += '<div class="moreLink SG_j_linedot1">' + '<span class="SG_more"><a href="http://control.blog.sina.com.cn/blogprofile/profilefriendlist.php" target="_blank">更多</a>&gt;&gt;</span>' + '</div>';
                } else {
                    result += '<div class="moreLink" style="padding-top:0;"></div>';
                }
                this.setContent(result);
            }

        }
        /*
         * 好友为 0 的文案
         */, "showEmpty": function () {
            this.setContent('<div class="SG_nodata">' + $SYSMSG.B80004 + '</div>');
        }, reload: function (sSize, bAddManage, bForceRequest) {
            var sizeCorrect = sSize == null || (sSize && (sSize == 210 || sSize == 510 || sSize == 730));
            if (!sizeCorrect) {
                Debug.error("请检查传入的组件尺寸是否正确。" + sSize);
                return;
            }
            this.size = sSize || this.size;
            this.getContent().innerHTML = '<div class="wdtLoading"><img src="http://simg.sinajs.cn/blog7style/' + 'images/common/loading.gif" />加载中…</div>';
            if (bForceRequest == true || this.cacheData == null) {
                this.load();
            } else {
                this["render_" + this.size]();
            }
            if (bAddManage) {
                this.setManage();
            }
        }
        /*
         * 设置评论组件的管理链接，仅在页面设置新增组件的时候会用到
         */, "setManage": function () {
            if ($isAdmin && this.getManage()) {
                this.getManage().innerHTML = '<span class="move"><a href="#" ' + 'onclick="funcMoveUpDown.up(' + this.compId + ');return false;">↑</a><a href="#" ' + 'onclick="funcMoveUpDown.down(' + this.compId + ');return false;">↓</a></span>' + '<a href="#" onclick="hiddenComponents(\'' + this.compId + '\');return false;" class="CP_a_fuc">[<cite>隐藏</cite>]</a>';
            }
        }
    }, 'dynamic');