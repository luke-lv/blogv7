$import("sina/sina.js");
$import("sina/core/dom/_dom.js");
$import("sina/core/dom/nameValue.js");
/**
 * @fileoverview 将form表单元素转换为JSON对象
 * @author Qiangyee | wangqiang1@staff
 * @param {HTMLFormElement} form form元素
 * @param {Array} nodeTypes 需要获取的元素类型
 * @param {Boolean} isClear 空值元素是否需要返回
 * @return {Object} value form表单值的JSON对象，{}
 * @example
 // 取得 form表单里所有对象
 var formValue = htmlToJson("form1");
 */
Core.Dom.htmlToJson = function(form, nodeTypes, isClear) {
    var json = {};
    nodeTypes = nodeTypes || ["INPUT", "TEXTAREA", "BUTTON", "SELECT"];
    if(!form) {
        return false;
    }
    var nameValue = Core.Dom.nameValue;
    for(var i = 0, len = nodeTypes.length; i < len; i++) {
        var nodes = form.getElementsByTagName(nodeTypes[i]);
        for(var j = 0, m = nodes.length; j < m; j++) {
            var valueObj = nameValue(nodes[j]);
            if(!valueObj || (isClear && (valueObj.value === ""))) {
                continue;
            }
            if(json[valueObj.name]) {
                if(json[valueObj.name] instanceof Array) {
                    json[valueObj.name] = json[valueObj.name].concat(valueObj.value);
                } else {
                    json[valueObj.name] = [json[valueObj.name]].concat(valueObj.value);
                }
            } else {
                json[valueObj.name] = valueObj.value;
            }
        }
    }
    return json
};
