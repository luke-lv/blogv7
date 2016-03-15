/**
 * @fileoverview
 *    博客首页财经要闻组件页面设置功能 id=10006
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/core/array/foreach.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/core/function/bind2.js");
$import("sina/ui/template.js");

$import("lib/component/class/registComp.js");
$import("lib/interface.js");
$import("lib/showError.js");

$import("component/comp_10006.js");
$registComp(10006, {
    /*
     * 增加管理链接
     */
    "setManage": function () {
        if ($isAdmin && this.getManage()) {
            this.getManage().innerHTML = '<span class="move"><a href="#" ' + 'onclick="funcMoveUpDown.up(10006);return false;">↑</a><a href="#" ' + 'onclick="funcMoveUpDown.down(10006);return false;">↓</a></span>' + '<a href="#" onclick="Lib.Component.set(\'' + this.compId + '\');return false;" class="CP_a_fuc">[<cite>设置</cite>]</a>' + '<a href="#" onclick="hiddenComponents(\'' + this.compId + '\');return false;" class="CP_a_fuc">[<cite>隐藏</cite>]</a>';
        }
    }
    /*
     *	读取图片播放器的默认配置
     */, "getUserSet": function () {
        if (this.isSetOn == null) {
            this.isSetOn = true;
            // 所有新闻分类全部写死
            var newsSortList = [
                {key: "全部要闻", value: "0"}
                ,
                {key: "股市", value: "1"}
                ,
                {key: "美股", value: "2"}
                ,
                {key: "港股", value: "3"}
                ,
                {key: "研究报告", value: "4"}
                ,
                {key: "国内", value: "5"}
                ,
                {key: "国际", value: "6"}
                ,
                {key: "产经", value: "7"}
            ];
            // 遍历那个分类是当前分类
            Core.Array.foreach(newsSortList, Core.Function.bind2(function (oItem) {
                if (oItem.value == this.currentNewsSort.toString()) {
                    oItem.sel = ' selected="true"';
                }
            }, this));
            var template = new Ui.Template('<option value="#{value}"#{sel}>#{key}</option>');

            // 生成选项 HTML
            var optionHTML = template.evaluateMulti(newsSortList);

            Core.Dom.insertHTML(this.getContent(), '<div id="comp_' + this.compId + '_set"></div>', "AfterBegin");
            var result = ['<div class="vp_login w' + (this.size == 210 ? 4 : (this.size == 510 ? 2 : 1)) + ' borderc">'
                , '<div>'
                , '用分类筛选：'
                , '<select id="comp_' + this.compId + '_ctgid">' + optionHTML
                , '</select>'
                , '</div>'
                ,
                    '<a href="#" onclick="Core.Function.bind2(Lib.Component.instances[' + this.compId + '].saveUserSet, Lib.Component.instances[' + this.compId + '])();return false;" class="SG_aBtn SG_aBtnB "><cite>确定</cite></a>&nbsp;'
                ,
                    '<a href="#" onclick="Core.Dom.removeNode($E(\'comp_' + this.compId + '_set\'));Lib.Component.instances[' + this.compId + '].isSetOn=null;return false;" class="SG_aBtn SG_aBtnB "><cite>取消</cite></a>'
                , '</div>'].join("");
            $E('comp_' + this.compId + '_set').innerHTML = result;
        }
    }
    /*
     * 保存图片播放器的配置，并根据情况刷新
     */, "saveUserSet": function () {
        Debug.info("save..." + this.compId);
        var userCtgid = $E('comp_' + this.compId + '_ctgid').value;
        // 如果显示模式和分类都未变化，就直接删除设置 DIV，不做接口提交
        if (userCtgid == this.currentNewsSort) {
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
                    if (userCtgid != this.currentNewsSort) {
                        Debug.info("如果改变了，就刷新组件");
                        this.currentNewsSort = userCtgid;
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
}, "10006");