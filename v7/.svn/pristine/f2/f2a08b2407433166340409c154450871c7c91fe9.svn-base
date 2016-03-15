/**
 * @fileoverview
 *    博客首页视频播放器组件 id=10005
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/core/dom/removeNode.js");
$import("sina/core/function/bind2.js");
$import("sina/core/string/leftB.js");
$import("sina/ui/template.js");

$import("lib/component/class/registComp.js");
$import("lib/component/extend/comp_flash.js");
$import("lib/interface.js");
$import("lib/showError.js");

$import("component/comp_10005.js");
$registComp(10005, {
    /*
     * 增加管理链接
     */
    "setManage": function () {
        if ($isAdmin && this.getManage()) {
            this.getManage().innerHTML = '<span class="move"><a href="#" ' + 'onclick="funcMoveUpDown.up(10005);return false;">↑</a><a href="#" ' + 'onclick="funcMoveUpDown.down(10005);return false;">↓</a></span>' + '<a href="#" onclick="Lib.Component.set(\'' + this.compId + '\');return false;" class="CP_a_fuc">[<cite>设置</cite>]</a>' + '<a href="#" onclick="hiddenComponents(\'' + this.compId + '\');return false;" class="CP_a_fuc">[<cite>隐藏</cite>]</a>';
        }
    }
    /*
     *	读取图片播放器的默认配置
     */, "getUserSet": function () {
        if (this.isSetOn == null) {
            this.isSetOn = true;
            Core.Dom.insertHTML(this.getContent(), '<div id="comp_' + this.compId + '_set"></div>', "AfterBegin");
            var html = ['<div class="vp_login w' + (this.size == 210 ? 4 : (this.size == 510 ? 2 : 1)) + ' borderc">'
                , '<div>'
                , '用分类筛选：'
                , '<select id="comp_' + this.compId + '_ctgid">'
                , '<option value="0"' + (this.tid == 0 ? ' selected="true"' : '') + '>全部视频</option>#{option}'
                , '</select>'
                , '</div>'
                ,
                    '<a href="#" onclick="Core.Function.bind2(Lib.Component.instances[' + this.compId + '].saveUserSet, Lib.Component.instances[' + this.compId + '])();return false;" class="SG_aBtn SG_aBtnB "><cite>确定</cite></a>&nbsp;'
                ,
                    '<a href="#" onclick="Core.Dom.removeNode($E(\'comp_' + this.compId + '_set\'));Lib.Component.instances[' + this.compId + '].isSetOn=null;return false;" class="SG_aBtn SG_aBtnB "><cite>取消</cite></a>'
                , '</div>'].join("");
            var i_getLastestVideo = new Interface("http://you.video.sina.com.cn/api/cateList.php", "jsload");
            i_getLastestVideo.request({
                GET: {
                    "uid": scope.$uid, "pagesize": 50, "page": 1, "varname": "requestId_cl_" + scope.$uid
                }, onSuccess: Core.Function.bind2(function (oData) {
                    var option = [];
                    if (oData.cateList.length > 0) {
                        for (var i = 0, len = oData.cateList.length; i < len; i++) {
                            var cateTitle = oData.cateList[i].name;
                            if (this.size == 210 && Core.String.byteLength(cateTitle) > 16) {
                                cateTitle = Core.String.leftB(oData.cateList[i].name, 14) + "…";
                            }
                            option.push('<option value="' + oData.cateList[i].topicid + '" ' + (this.tid == oData.cateList[i].topicid ? ' selected="true"' : '') + '>' + cateTitle + '</option>');
                        }
                    }
                    var result = html.replace(/#{option}/gi, option.join(""));
                    $E('comp_' + this.compId + '_set').innerHTML = result;
                }, this), onError: function () {
                }, onFail: function () {
                }
            });
        }
    }
    /*
     * 保存图片播放器的配置，并根据情况刷新
     */, "saveUserSet": function () {
        Debug.info("save..." + this.compId);
        var userCtgid = $E('comp_' + this.compId + '_ctgid').value;
        // 如果显示模式和分类都未变化，就直接删除设置 DIV，不做接口提交
        if (userCtgid == this.tid) {
            Debug.log("组件 " + this.compId + " 没有任何修改，直接关掉设置浮层");
            Core.Dom.removeNode($E('comp_' + this.compId + '_set'));
            this.isSetOn = null;
        } else {
            var i_setUserSet = new Interface("http://control.blog.sina.com.cn/riaapi/component_config/write_component.php", "ijax");
            i_setUserSet.request({
                POST: {
                    "title_code": this.compId, "cat": userCtgid
                },
                onSuccess: Core.Function.bind2(function () {
                    this.isSetOn = null;
                    Core.Dom.removeNode($E('comp_' + this.compId + '_set'));
                    if (userCtgid != this.tid) {
                        Debug.info("如果改变了，就刷新组件");
                        this.tid = userCtgid * 1;
                        this.playlist = null;
                        this.load();
                    }
                }, this), onError: function (oData) {
                    showError(oData.code);
                }, onFail: function () {
                    showError("A00001");
                }
            });
        }
    }
}, "10005");