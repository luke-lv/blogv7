/**
 * @id Core.Dom.clickObj
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview 
 * 删除指定的元素的指定样式
 */
$import("sina/core/dom/_dom.js");
$import("sina/core/system/br.js");
/**
 * @for Core.Dom.clickObj
 * <pre>
 * 执行对象的Click事件和移动设备的touch事件
 * </pre>
 * @module clickObj
 * @param {HTMLElement | Document} o 节点对象
 * @return {Void}
 * @author FlashSoft | fangchao@staff.sina.com.cn
 * @author Qiangyee | wangqiang1@staff
 * @update 2012.04.05
 */
Core.Dom.clickObj = function (o) {
	o.fireEvent("onclick");
};
if(!$IE) {
    // 兼容手机和pad
	Core.Dom.clickObj = function (o) {
		var e = document.createEvent( $MOBILE ? "HTMLEvents" : "MouseEvent");
		e.initEvent("click", false, false);
		o.dispatchEvent(e);
	};
}