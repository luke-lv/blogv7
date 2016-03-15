/**
 * @date 2012-04-16
 * @author Qiangyee | wangqiang1@staff
 */
$import("sina/core/dom/_dom.js");
$import("sina/sina.js");
$import("sina/core/string/trim.js");
/**
 * @for Core.Dom.addClass
 * 给指定的元素添加指定的样式
 * @param {Object} obj
 * @param {Object} className
 */ 
Core.Dom.addClass = function (obj, className){
    var _trim = Core.String.trim;
    className = _trim(className);
    if (!className) {
        return obj;
    }
    obj = $E(obj);
    var oldClz = _trim(obj.className || '');
    var tmpOldClz = ' ' + oldClz + ' ';
    if (!oldClz) {
        obj.className = _trim(className);
        return obj;
    }
    var uClzs = className.split(' ');
    var uClz, newClzs = [];
    for (var i = 0; i < uClzs.length; i++) {
        uClz = uClzs[i];
        if (uClz && -1 === tmpOldClz.indexOf(' ' + uClz + ' ')) {
            newClzs.push(uClz);
        }
    }

    obj.className = oldClz + ' ' + newClzs.join(' ');
    return obj;
};