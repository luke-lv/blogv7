/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 临时保存剪贴版内容到iframe
 * @author dg.liu | dongguang@staff.sina.com.cn
 */
$import("lib/editor/utils/utils.js");
$import("sina/core/class/create.js");
$import("sina/ui/template.js");
$import("sina/core/math/getUniqueId.js");
$import("sina/core/dom/addHTML.js");

Editor.Utils.CacheIframe = Core.Class.create();
Editor.Utils.CacheIframe.prototype = {
	/**
	 * 构造函数
	 * @param {String} iframeUrl iframe的src;
	 */
    initialize: function(iframeUrl){
		this.id=Core.Math.getUniqueId();
		this.initHtml();
		if(iframeUrl && iframeUrl!=""){
			this.setUrl(iframeUrl);
		}
    },
	/**
	 * 初始化html，向页面最后追加需要html
	 */
	initHtml:function(){
	   var html='<iframe id="cache_iframe_#{id}" style="visibility: hidden; position: absolute; top: -1000px; left: -1000px;"></iframe>';
	   var temp = new Ui.Template(html);
	   Core.Dom.addHTML(document.body,temp.evaluate({id:this.id}));
	},
	/**
	 * 设置iframe 的src 
	 * @param {String} iframeUrl iframe的src;
	 */
	setUrl:function(iframeUrl){
		$E("cache_iframe_"+this.id).src=iframeUrl;
	}
	/**
	 *获取iframe的元素对象
	 */
	,get:function(){
		return $E("cache_iframe_"+this.id);
	}
};

