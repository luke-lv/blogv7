/*
 * Copyright (c) 2007, Sina Inc. All rights reserved. 
 * @fileoverview 处理博文预览
 */
$import("sina/utils/io/_io.js");
$import("sina/core/function/bind2.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/string/encodeDoubleByte.js");
$import("sina/utils/url.js");

Utils.Io.Ijax_blank = {
	/**
	 * 处理预览操作弹出窗口，浏览器不阻止弹出窗口的实现
	 * 
	 * @param url 必选参数。请求数据的URL，是一个 URL 字符串，不支持数组
	 * @param option 可选参数 {
	 *  GET : {}, 通过 GET 提交的数据
	 *  POST : {} 通过 POST 提交的数据
	 * }
	 */
	request:function(url, option){
		var oTask = {};
		oTask.url = url;
		oTask.option = option || {};
        
        var _url = new Utils.Url(url);
		if(option.GET){
			for(var key in option.GET){
				_url.setParam(key, Core.String.encodeDoubleByte(option.GET[key]));
			}
		}
		// 接口设置 Domain
		_url.setParam("domain", "1");
        //兼容webkit系列浏览器同一个URL不能提交两次的问题---重复提交的问题
        _url.setParam("time" + Math.ceil(Math.random() * 10000), new Date().getTime());
		_url = _url.toString();
		// 如果需要 post 数据
        var oIjaxForm = $C("form");
        oIjaxForm.id = "IjaxForm"+Math.ceil(Math.random() * 10000);
        oIjaxForm.action = _url;
        oIjaxForm.method = "post";
        oIjaxForm.target = "_blank";
        
        for(var oItem in option.POST) {
            var value;
            if(option.noEncode){
                value=Core.String.encodeDoubleByte(option.POST[oItem])
            }else{
                value=option.POST[oItem]
            }
            var oInput = $C("input");
            oInput.type = "hidden";
            oInput.name = oItem;
            oInput.value = value;
            oIjaxForm.appendChild(oInput);
        };
        document.body.appendChild(oIjaxForm);
        oIjaxForm.submit();
        setTimeout(function(){ //10秒后删除form
            oIjaxForm.parentNode.removeChild(oIjaxForm);
            oIjaxForm = null;
        },10000);
	}
};




