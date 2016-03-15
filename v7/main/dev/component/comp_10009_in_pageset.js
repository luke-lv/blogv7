/**
 * @fileoverview
 *    博客秀组件
 * @author Luo Rui | luorui1@staff.sina.com.cn
 *
 */

$import("sina/sina.js");
$import("sina/utils/io/jsload.js");

$import("lib/dialogConfig.js");
$import("lib/component/class/registComp.js");
$import("lib/component/extend/comp_dynamic.js");
$import("lib/msg/componentMSG.js");
$import("lib/checkAuthor.js");

$registComp("10009", {
    "pagesize": 5, "interfaceSaveSet": new Interface('http://control.blog.sina.com.cn/riaapi/tshow/write_component.php', 'jsload'), "interfaceReadSet": new Interface('http://control.blog.sina.com.cn/riaapi/tshow/read_component.php', 'jsload'), "interfaceShow": new Interface('http://control.blog.sina.com.cn/riaapi/appMake_Show.php', 'jsload'), "conf": {skin: 1, isTitle: 1, isWeibo: 1, isFans: 1, fansRow: 1} //用于保存的配置
    , "currentConf": null //用户当前配置备份
    , "load": function () {
        this.trueLoad();
    }, "trueLoad": function () {
        var me = this;
        this.interfaceShow.request({
            GET: {
                uid: scope.$uid,
                vid: this.compId,
                width: this.size
            }, onSuccess: function (data) {
                me["render"](data);
                return;
            }, onError: function (data) {
                showError(data.code);
            }, onFail: function () {
                showError(data.code);
            }
        });
        return;
    }, "render": function (data) {
        this.getContent().innerHTML = data;

    }, "getUserSet": function () {
        if (this.isSetOn) return;
        this.isSetOn = true;
        var me = this;
        if (!this.win) {
            this.win = winDialog.createCustomsDialog({
                tpl: this.tpl
            }, "comp10009set");
            this.win.setFixed(false);
            var nodes = this.win.nodes;
            nodes.comp_10009_btnClose.onclick = nodes.comp_10009_btnCancel.onclick = function () {
                me.hide(true);
                return false;
            };
            nodes.comp_10009_btnSave.onclick = function () {
                me.saveUserSet();
                return false;
            };
            nodes.comp_10009_skin1.onclick = function () {
                me.conf.skin = 1;
                nodes.comp_10009_skin1.parentNode.className = 'current';
                nodes.comp_10009_skin2.parentNode.className = '';
                me.render(me.encode(me.conf));
                return false;
            };
            nodes.comp_10009_skin2.onclick = function () {
                me.conf.skin = 2;
                nodes.comp_10009_skin1.parentNode.className = '';
                nodes.comp_10009_skin2.parentNode.className = 'current';
                me.render(me.encode(me.conf));
                return false;
            };
            nodes.comp_10009_cb1.onclick = nodes.comp_10009_l1.onclick = function () {
                me.conf.isTitle = nodes.comp_10009_cb1.checked ? 1 : 0;
                me.render(me.encode(me.conf));
            };
            nodes.comp_10009_cb2.onclick = nodes.comp_10009_l2.onclick = function () {
                me.conf.isWeibo = nodes.comp_10009_cb2.checked ? 1 : 0;
                me.render(me.encode(me.conf));
            };
            nodes.comp_10009_cb3.onclick = nodes.comp_10009_l3.onclick = function () {
                me.conf.isFans = nodes.comp_10009_cb3.checked ? 1 : 0;
                me.render(me.encode(me.conf));
            };
            nodes.comp_10009_fansrow.onchange = function () {
                me.conf.fansRow = this.value;
                me.render(me.encode(me.conf));
            };
        }
        var nodes = this.win.nodes;
        nodes.trueContent.style.display = 'none';
        nodes.loadingContent.style.display = 'block';
        this.win.setMiddle();
        this.win.show();

        this.interfaceReadSet.request({
            GET: {
                uid: scope.$uid
            }, onSuccess: function (data) {
                me.conf = data.conf;
                me.currentConf = {};
                for (key in me.conf) {
                    me.currentConf[key] = me.conf[key];
                }
                me.nickname = data.nickname;
                var nodes = me.win.nodes;
                nodes.comp_10009_skin1.parentNode.className = me.conf.skin == 1 ? 'current' : '';
                nodes.comp_10009_skin2.parentNode.className = me.conf.skin == 2 ? 'current' : '';
                nodes.comp_10009_cb1.checked = me.conf.isTitle == 1 ? true : false;
                nodes.comp_10009_cb2.checked = me.conf.isWeibo == 1 ? true : false;
                nodes.comp_10009_cb3.checked = me.conf.isFans == 1 ? true : false;
                nodes.comp_10009_fansrow.selectedIndex = me.conf.fansRow - 1;
                nodes.loadingContent.style.display = 'none';
                nodes.trueContent.style.display = 'block';
                nodes.comp_10009_tid.innerHTML = data.t_sina;
            }, onError: function (data) {
                showError(data.code);
                this.currentConf = null;
            }
        });
    }
    /*
     * 保存用户设置并刷新当前列表
     */, "saveUserSet": function () {
        var me = this;
        this.interfaceSaveSet.request({
            GET: {
                uid: scope.$uid,
                width: me.size,
                skin: me.conf.skin,
                isTitle: me.conf.isTitle,
                isWeibo: me.conf.isWeibo,
                isFans: me.conf.isFans,
                fansRow: me.conf.fansRow
            }, onSuccess: function () {
                me.hide();
                me.trueLoad();
            }, onError: function (data) {
                showError(data.code);
            }, onFail: function (data) {
            }
        });
    }, "hide": function (restore) {
        this.win.hidden();
        this.isSetOn = null;
        //恢复用户最近有效的配置
        if (restore && this.currentConf) {
            this.render(this.encode(this.currentConf));
        }
    }, encode: function (conf) {
        var t = conf.isTitle;
        var w = conf.isWeibo;
        var f = conf.isFans;
        var r = conf.fansRow;
        var s = conf.skin;
        var n = encodeURIComponent(this.nickname);
        var ret = '<iframe width="' + this.size + '" height="550" class="share_self"  frameborder="0" scrolling="no" src="http://service.t.sina.com.cn/widget/WeiboShow.php?uname=' + n + '&width=' + this.size + '&height=550&skin=' + s + '&isTitle=' + t + '&isWeibo=' + w + '&isFans=' + f + '&fansRow=' + r + '"></iframe>';
        return ret;
    }, "tpl": ['<table id="#{entity}" class="CP_w">', '<thead id="#{titleBar}">', '<tr>',
        '<th class="tLeft"><span></span></th>',
        '<th class="tMid"><div class="bLyTop"><strong>设置</strong><cite><a id="#{comp_10009_btnClose}" title="关闭" class="CP_w_shut" href="#" onclick="return false">关闭</a></cite></div></th>',
        '<th class="tRight"><span></span></th>', '</tr>', '</thead>', '<tfoot>', '<tr>',
        '<td class="tLeft"><span></span></td>', '<td class="tMid"><span></span></td>',
        '<td class="tRight"><span></span></td>', '</tr>', '</tfoot>', '<tbody>', '<tr>',
        '<td class="tLeft"><span></span></td>', '<td class="tMid" id="#{content}">',
        '<div class="CP_layercon2" id="#{loadingContent}" style="text-align:center;min-height:0;padding:50px 0 60px;line-height:16px"><img src="http://simg.sinajs.cn/blog7style/images/common/loading.gif" style="padding-right:8px;vertical-align:middle"/>请稍候…</div>',
        '<div class="CP_layercon2" id="#{trueContent}" style="display:none">', '<div class="miniblogshow">',
        '<div class="url SG_j_linedot1">',
        '已绑定微博：weibo.com/<span id="#{comp_10009_tid}"></span> <span class="SG_more"><a id="#{comp_10009_modify}" href="http://control.blog.sina.com.cn/blogprofile/bind_t_sina_blog.php" target="_blank">修改</a>&gt;&gt;</span>',
        '</div>', '<div class="tab">', '<table cellspacing="0" cellpadding="0" border="0">', '<tbody><tr>',
        '<th scope="row">外观方案：</th>', '<td>', '<div class="skinlist">', '<ul>',
        '<li class="current"><a href="#" id="#{comp_10009_skin1}"><img alt="" src="http://simg.sinajs.cn/blog7style/images/common/layer/mib_skin1.gif"></a><img align="absmiddle" width="15" height="15" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon49"></li>',
        '<li><a href="#" id="#{comp_10009_skin2}"><img alt="" src="http://simg.sinajs.cn/blog7style/images/common/layer/mib_skin2.gif"></a><img align="absmiddle" width="15" height="15" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon49"></li>',
        '</ul>', '</div>', '</td>', '</tr>', '<tr>', '<th scope="row">模块设定：</th>', '<td>',
        '<p><input type="checkbox" checked="checked" id="#{comp_10009_cb1}"><label id="#{comp_10009_l1}" for="#{comp_10009_cb1}">显示标题栏</label></p>',
        '<p><input type="checkbox" checked="checked" id="#{comp_10009_cb2}"><label id="#{comp_10009_l2}" for="#{comp_10009_cb2}">展示微博</label></p>',
        '<p><input type="checkbox" checked="checked" id="#{comp_10009_cb3}"><label id="#{comp_10009_l3}" for="#{comp_10009_cb3}">展示粉丝</label></p>',
        '</td>', '</tr>', '<tr>', '<th scope="row">粉丝数：</th>',
        '<td><select name="" id="#{comp_10009_fansrow}"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option></select> 行</td>',
        '</tr>', '<tr>', '<th scope="row"></th>',
        '<td class="btn"><a id="#{comp_10009_btnSave}" href="#" class="SG_aBtn SG_aBtnB"><cite>确定</cite></a>&nbsp;&nbsp;<a id="#{comp_10009_btnCancel}" href="#" class="SG_aBtn SG_aBtnB"><cite>取消</cite></a></td>',
        '</tr>', '</tbody></table>', '</div>', '</div>', '</div>', '</td>', '<td class="tRight"><span></span></td>',
        '</tr>', '</tbody>', '</table>'].join('')
}, "dynamic");
