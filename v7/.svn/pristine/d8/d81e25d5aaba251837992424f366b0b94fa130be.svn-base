/**
 * @fileoverview 用户自定义组件页签
 * @author xinyu@staff.sina.com.cn
 * @date 2009-08-11
 */
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/stopBubble.js");
$import("sina/core/events/fixEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/function/bind2.js");
$import("sina/core/function/bind3.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/core/system/br.js");
$import("sina/core/string/a2u.js");
$import("sina/core/string/j2o.js");
$import("sina/core/array/findit.js");
$import("sina/core/array/ArrayWithout.js");
$import("sina/ui/template.js");
$import("sina/ui/dialog/windowDialog.js");

$import("lib/interface.js");
$import("lib/dialogConfig.js");

$import("pageSet/tabs.js");
$import("pageSet/componentsClickEvent.js");
$import("pageSet/singleFunc/funcEditCustomComp.js");

$import('msg/diycomponentsMSG.js');

/**
 * 删除自定义组件
 * @param {Object} id
 */
(function () {
    window.deleteCustomComp = function (id) {
        url = "http://control.blog.sina.com.cn/riaapi/sys_module/del_custmod_post.php?version=7&cid=" + id + "&uid=" + scope.$uid;
        winDialog.confirm($SYSMSG.B27000, {
            funcOk: function () {
                __pageSetVar.tempdelcompid = /cid=(\w+)&/.exec(url)[1];
                var _delModule = new Interface(url, $IE6 ? "ijax" : "jsload");
                _delModule.request({
                    onSuccess: function () {
                        try {
                            var obj = $E('cuscompli_' + __pageSetVar.tempdelcompid);
                            obj.parentNode.removeChild(obj);
                            var isHave = Core.Array.findit(__pageSetVar.component_list, __pageSetVar.tempdelcompid);
                            if (isHave > -1) {
                                __pageSetVar.component_list = Core.Array.ArrayWithout(__pageSetVar.component_list, [__pageSetVar.tempdelcompid]);
                                var o = $E('module_' + __pageSetVar.tempdelcompid);
                                var col = o.parentNode;
                                o.parentNode.removeChild(o);
                                if (Core.Dom.getChildrenByClass(col, 'SG_conn').length == 0) {
                                    funcChangeFormat.addNoneDiv();
                                }
                            }
                            //BLOGBUG-5348 号提案
                            if ($E('customModuleText')) {
                                $E('customModuleText').innerHTML = '页面最多放置25个组件，您已放置<strong>' + __pageSetVar.component_list.length + '</strong>个组件';
                            }
                            if ($T($E('customModuleUl'), 'li').length == 0) {
                                $E('customModuleUl').innerHTML = '您尚未创建任何自定义组件';
                            }
                        } catch (e) {
                            //trace(e.message);
                        }
                    },
                    onError: function (_data) {

                        if (_data.code != 'B26105') {
                            winDialog.alert($SYSMSG[_data.code], {
                                icon: "02"
                            }, "tips");
                            var tips = winDialog.getDialog('tips');
                            var anchor = tips.getNodes()["btnClose"];
                            var anchor2 = tips.getNodes()["linkOk"];
                            anchor2.href = anchor.href = 'http://blog.sina.com.cn/u/' + scope.$uid;
                        }
                    },
                    onFail: function () {
                        //trace('删除自定义组件出错...');
                    }
                });
            }
        });
    };
})();
/**
 * 自定义组件类
 */
var customComponents = Core.Class.create();
customComponents.prototype = {
    /**
     * 初始化自定义组件的入口
     * @param {Object} obj
     */
    initialize: function (obj) {
        this.loadData();
    },
    loadData: function () {
        var _default = new Interface("http://control.blog.sina.com.cn/riaapi/sys_module/get_custom_info.php?version=7", "jsload");
        _default.request({
            GET: {
                "uid": scope.$uid
            },
            onSuccess: function (data) {
                if (data != "") {
                    var _template = '<li id="cuscompli_#{id}"><span class="moduleli"><input type="checkbox" id="components_9_#{id}" #{chk} onclick="clickComponentsEvent(this,#{index},\'#{nameUri}\',9)"/><label for="components_9_#{id}">#{nameOrg}</label></span><span class="option"><a href="javascript:;" class="CP_a_fuc" onclick="return false;">[<cite onclick="editCustomComp(#{index},\'#{type}\');">编辑</cite>]</a><a href="javascript:;" class="CP_a_fuc" onclick="return false;">[<cite onclick="deleteCustomComp(#{index});">删除</cite>]</a></span></li>';
                    var _result = [];

                    for (var i = 0, len = data.length; i < len; i++) {
                        try {
                            var _item = {};
                            _item.index = data[i].cid;
                            _item.id = data[i].cid;

                            if (Core.Array.findit(__pageSetVar.component_list, data[i].cid) > -1) {
                                _item.chk = "checked";
                            } else {
                                _item.chk = "";
                            }

                            //解决自定义组件名称不能携带单双引号的字符编码问题。
                            _item.nameUri = encodeURIComponent(data[i].name);
                            _item.nameOrg = data[i].name;
                            _item.type = data[i].type;
                            _result.push(_item);
                        } catch (e) {
                        }
                    }
                    var tmp = new Ui.Template(_template);
                    sResult = tmp.evaluateMulti(_result, false);
                    $E('customModuleUl').innerHTML = sResult;
                } else {
                    $E('customModuleUl').innerHTML = '您尚未创建任何自定义组件';
                }
            }
        });
    }
};

