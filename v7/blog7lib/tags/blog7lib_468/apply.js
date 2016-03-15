$import("lib/lib.js");
$import("lib/applyIf.js");
/**
 * @fileoverview 将ref对象中的属性添加到o中，或者覆盖o中的属性
 *
 * @param  {Object} o  源对象
 * @param  {Object} ref  需要的覆盖和添加的属性对象
 * @param  {Object} defaults  默认值
 * @param  {boolean} deep  是否深度克隆，默认为false
 * @param  {boolean} original  是否保留ref中原来的属性值
 *
 * @return {Object} o  属性增加和覆盖后的对象
 */
Lib.apply = function(o, ref, defaults, deep, original){
    if (defaults) {
        Lib.applyIf(o, defaults);
    };
	for (var p in ref) {
		if (original && o[p] && !Lib.isObject(o[p])) {
			continue;
		}
		if (ref.hasOwnProperty(p)) {
			if (deep && Lib.isObject(ref[p])) {
				o[p] = Lib.apply(o[p] || {}, ref[p], deep, original);
			} else {
				o[p] = ref[p];
			}
		}
	}
	return o;
};

