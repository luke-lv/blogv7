/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @author dg.liu | dongguang@staff.sina.com.cn
 */
$import('sina/utils/form/_form.js');
$import('sina/core/function/bind3.js');
$import('sina/core/events/addEvent.js');

/**
 * 通过正则进行表单元素的限制
 * @author dg.liu | dongguang@staff.sina.com.cn
 * @param {HTMLElement} oTextNode
 * @param {function} 用于过滤(限制字符)的函数
 */
Utils.Form.functionlimit = function (oNode, func,noKeyUP) {
	var keyup = function(){
		var ov = oNode.value;
		oNode.value=func(ov);
		//if (re.test(ov)) {oNode.value = ov.replace(re, '');}
	};
	if(!noKeyUP){
		Core.Events.addEvent(oNode, Core.Function.bind3(keyup,oNode), "keyup");
	}
	Core.Events.addEvent(oNode, Core.Function.bind3(keyup,oNode), "blur");
};