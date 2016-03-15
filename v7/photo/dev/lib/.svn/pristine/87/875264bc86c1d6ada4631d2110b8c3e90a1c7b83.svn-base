$import("lib/lib.js");
/**
 * @fileoverview 将s中的属性添加到o中，o中已有的属性不会被覆盖
 *
 * @param  {Object} o  源对象
 * @param  {Object} s  需要的添加属性对象
 * @param  {Object} defaults  默认对象值
 *
 * @return {Object} o  属性增加后的对象
 */
Lib.applyIf = function(o, s, defaults){
    if (defaults) {
        Lib.applyIf(o, defaults);
    };

    if (o && s && Lib.isObject(s)) {
        for (var p in s) {
            if (s.hasOwnProperty(p) && !o[p]) {
                o[p] = s[p];
            };
            
        };
    };
    return o;
};
/**
 * 判断传入对象是否为object
 * @param o
 * @returns {boolean}
 */
Lib.isObject = function(o){
	return Object.prototype.toString.call(o) === "[object Object]";
}
