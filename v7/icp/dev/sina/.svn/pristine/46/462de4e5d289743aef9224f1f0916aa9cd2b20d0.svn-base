
/**
 * @id Core.Array.without
 * Copyright (c) 2008, Sina Inc. All rights reserved.
 * @fileoverview Array类的扩展
 */
$import("sina/core/array/_array.js");
$import("sina/core/array/foreach.js");
/**
 * 删除指定数组中指定位置的元素
 * @for Core.Array.without
 * @author dongguang | dongguang@staff.sina.com.cn
 * @param {Array} 指定的数组
 * @param {Number} 指定数组中要删除的元素
 * @return {Array}	返回删除了指定元素的数组
 * @example
	 Core.Array.without(without([1,2,3,4,5,6,7],0));
	 返回:[2,3,4,5,6,7]
 */
Core.Array.without = function(array,at){
    var arr1 = array.slice(0, at);
    var arr2 = array.slice(at + 1);
    return arr1.concat(arr2)
};