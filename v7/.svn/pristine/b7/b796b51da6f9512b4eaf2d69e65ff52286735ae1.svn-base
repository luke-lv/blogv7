/**
 * @fileoverview 获取表单元素的值
 * @author Qiangyee | wangqiang1@staff
 * @param {HTMLFormElement} node form表单里的表单元素
 * @return {Array/Boolean} values 表单元素的值
 */
Core.Dom.nameValue = function(node) {
    var name     = node.getAttribute("name")
        ,type    = node.getAttribute("type")
        ,tagName = node.tagName
        ,valueObj   = {
            name  : name,
            value : ""
        }
        ,setValue = function(v){
            if (v === !1) {
                valueObj = !1;
            } else if (valueObj.value) {
                valueObj.value = [v || ""].concat(valueObj.value);
            } else {
                valueObj.value = [v || ""]
            }
        }
        ;
    if (!!node.disabled || !name) {
        return !1;
    }
    
    switch (tagName) {
        case "INPUT":
            if (type == "radio" || type == "checkbox") {
                node.checked ? setValue(node.value) : setValue(!1);
                
            } else if (type == "reset" || type == "submit"
                         || type == "image") {
                setValue(!1);
                
            } else {
                setValue(node.value);
            }
            break;
        case "SELECT":
            if(node.multiple) {
                var options = node.options;
                for(var i = 0, j = options.length; i < j; i++)
                    options[i].selected && setValue(options[i].value)
            } else {
                setValue(b.value);
            }
            break;
        case "TEXTAREA":
            setValue(node.value || node.getAttribute("value") || !1);
            break;
        case "BUTTON":
        default:
            setValue(node.value || node.getAttribute("value") || node.innerHTML || !1)
    }
    return valueObj;
}