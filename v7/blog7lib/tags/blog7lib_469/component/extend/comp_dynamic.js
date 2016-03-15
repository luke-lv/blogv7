/**
 * @fileoverview
 *	动态组件类，包括动态加载组件的基础方法
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2009.08.11
 * @history
 *
 */
$import("lib/component/class/registComp.js");
$import("lib/component/class/comp_baseClass.js");
$import("lib/msg/componentMSG.js");
$registComp("dynamic", {
	"render_210" : function () {
		
	}
	,"render_510" : function () {
		
	}
	,"render_730" : function () {
		
	}
	,"show"	: function (str) {
		this.setContent(str);
	}
	// 组件内容为空的显示
	,"showEmpty"	: function (sEmptyTips) {
		this.setContent('<div class="SG_nodata2">' + (sEmptyTips || $SYSMSG.A80001) + '</div>');
	}
	// 组件加载出错的提示
	,"showError"	: function (sStatusCode) {
		this.setContent(sStatusCode);
	}
	/*
	 * 增加管理链接，只有在页面设置才有此功能，除了可配置组件，其他的全部是[隐藏]
	 */
	,"setManage"	: function () {
		if($isAdmin && this.getManage()){
			this.getManage().innerHTML  = '<span class="move"><a href="#" '
								+ 'onclick="funcMoveUpDown.up(' + this.compId + ');return false;">↑</a><a href="#" '
								+ 'onclick="funcMoveUpDown.down(' + this.compId + ');return false;">↓</a></span>'
								+ '<a href="#" onclick="hiddenComponents(\'' + this.compId
								+ '\');return false;" class="CP_a_fuc">[<cite>隐藏</cite>]</a>';
		}
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
		this.isSetOn = null;
		Debug.log("this.isSetOn : " + this.isSetOn);
		if(bForceRequest == true || this.cacheData == null){
			Debug.log("强制刷新：" + this.compId);
			this.load();
		}else{
			Debug.log("缓存刷新：" + this.compId);
			this["render_" + this.size]();	
		}
		if(bAddManage){
//			alert("组件" + this.compId + "增加管理链接");
			this.setManage();
		}
	}
});