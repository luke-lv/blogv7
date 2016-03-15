/**
 * @fileoverview
 *	Widget 组件延迟加载的 Job
 	针对 iframe 类型的 widget 组件，要求所有需要延迟加载的 iframe 类型 widget 组件，
 	都不直接输出 iframe，而是输出为：
 	<textarea lazyload="true" style="display:none;"><!--原组件iframe HTML//--></textarea>
	<div class="wdtLoading"><img src="http://simg.sinajs.cn/blog7style/images/common/loading.gif" />加载中…</div>
 	
 	例如：
 	<textarea lazyload="true" style="display:none;"><iframe scrolling="no" frameborder="0"
 	 style="overflow: hidden; width: 190px; height: 366px;"
	 allowtransparency="" src="http://blog.sina.com.cn/lm/iframe/xhtml/2008/0909/81.html"></iframe></textarea>
	<div class="wdtLoading"><img src="http://simg.sinajs.cn/blog7style/images/common/loading.gif" />加载中…</div>
 	
	当延迟加载监听器监听用户页面滚动到指定位置时，自动将 textarea 的 value 用来替换掉上面这段代码
 
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */

$import("lib/jobs.js");
$import("lib/lazyload.js");
$registJob("widgetLazyLoad", function () {
	// 扫描页面内所有textarea，找出带有 lazyload="true" 的
	var widgets = document.getElementsByTagName("TEXTAREA");
	var list = [];
	for(var i = 0, len = widgets.length; i < len; i ++){
		var lazy = widgets[i].getAttribute("lazyload");
		if(lazy != null){
			list.push({
				dom			: widgets[i].parentNode,
				callback	: function (o){
					var node = o.getElementsByTagName("TEXTAREA");
					if(node && node.length > 0){
						o.innerHTML = node[0].value;
					}
				}
			});
		}
	}
	// 如果被延迟加载的  iframe 类型 widget 超过一个，就放入延迟加载列表
	if(list.length > 0){
		Lib.LazyLoad(list, {});
	}
});
