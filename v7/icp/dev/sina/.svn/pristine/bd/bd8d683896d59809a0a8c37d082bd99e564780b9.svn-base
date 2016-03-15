/**
 * @id Core.Class.extend 
 * Copyright (c) 2007, Sina Inc. All rights reserved. 
 * @fileoverview js中类的定义，继承的方法集合
 */
$import("sina/core/class/_class.js");
/**
 * 继承
 * @param {Object}	destination 子类
 * @param {Object}	supClass	父类
 * @param {Boolean}	bForce		强制，只要是 null 就覆盖
 */
Core.Class.extend = function(destination, supClass, bForce) {
	for (var property in supClass) {
		if (bForce != null) {
			if (!destination[property]) {
				destination[property] = supClass[property];
			}
		} else {
			destination[property] = supClass[property];
		}
	}
	return destination;
};