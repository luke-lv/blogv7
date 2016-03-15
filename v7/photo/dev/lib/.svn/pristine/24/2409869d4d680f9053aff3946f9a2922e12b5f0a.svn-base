/**
 * @fileoverview
 *	Flash 组件类
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/core/dom/addHTML.js");
$import("sina/utils/flash/swf.js");

$import("lib/component/class/registComp.js");
$import("lib/component/class/comp_baseClass.js");


$registComp("flash", {
	"render_210" : function () {
		
	}
	,"render_510" : function () {
		
	}
	,"render_730" : function () {
		
	}
	,"load"	: function () {}
	/**
	 * 在组件内插入一个 Flash
	 * @param {Object} option {
	 		url			[必选] SWF文件的URL
	 		id			[可选] 为SWF文件分配的id值
			width		[可选] SWF文件的宽度
			height		[必选] SWF文件的高度，默认会设置为300
			vars		[可选] 采用"Flashvars"传入的参数
			para		[可选] 传入的Flash内联参数
		}
	 * @example
		this.addFlash({
			url : "http://sjs.sinajs.cn/test.swf",
			width  : "190",
			height : "200"
		});
	 */
	,"addFlash" : function (option) {
		// 如果没带 Flash 信息或者信息内不包含 Flash 地址，则不做处理
		if(option == null || typeof option.url == "undefined"){return;}
		var _url = option.url;
		var _id = option.id || ("compflash_" + this.compId);
		var _width = option.width || 190;
		var _height = option.height || 300;
		var _ver = "8";
		var _bg = "#FFF";
		var _vars = option.vars || {};
		var _para = option.para || {};
		var _cnt = option.cnt || "comp_" + this.compId + "_content";
		// Debug.log("传给  Flash 组件的参数");
		// Debug.dir(_vars);
		Utils.Flash.swfView.Add(_url, _cnt, _id, _width, _height, _ver, _bg, _vars, _para);		
	}
	/*
	 * 重新加载组件
	 * @param {Number}	sSize			按什么尺寸重载
	 * @param {Boolean}	bAddManage		是否需要加管理链接
	 * @param {Boolean}	bForceRequest	是否强制刷新
	 */
	,reload		: function (sSize, bAddManage, bForceRequest) {
		var sizeCorrect = sSize == null || (sSize && (sSize == 210 || sSize == 510 || sSize == 730));
		if(!sizeCorrect){
			Debug.error("请检查传入的组件尺寸是否正确。" + sSize);
			return;
		}
		this.size = sSize || this.size;
		this.getContent().innerHTML = '<div class="wdtLoading"><img src="http://simg.sinajs.cn/blog7style/'
					+ 'images/common/loading.gif" />加载中…</div>';
		if(bForceRequest == true){
			Debug.log("强制刷新：" + this.compId);
			this.load();
		}else{
			Debug.log("缓存刷新：" + this.compId);
			this["render_" + this.size]();	
		}
		if(bAddManage){
			this.setManage();
		}
	}
});
