/**
 * @fileoverview
 *	静态组件类
 *		博客首页任何非动态组件均可以继承此组件
 *		组件会调用动态接口来获取任意动态组件的组件内容
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("lib/component/class/registComp.js");
$import("lib/component/class/comp_baseClass.js");
$import("lib/interface.js");
$import("lib/checkAuthor.js");
$import("lib/lazyload.js");
$registComp("static", {
	load : function () {
		var i_getArticleList = new Interface("http://control.blog.sina.com.cn/riaapi/appMake_Show.php", "jsload");
		var param = {
			"uid"	: scope.$uid
			,"vid"	: this.compId
			,"width": this.size
//			,"varname"	: "newStaticComp"
		};
		
		i_getArticleList.request({
			GET : param
			,onSuccess : Core.Function.bind2(function (sData) {
				if(/lazyload="true"/.test(sData)){
					sData = sData.replace(/<textarea[^>]+>(<iframe[^>]+><\/iframe>)<\/textarea><div[^>]+><img[^>]+>[^<]+<\/div>/gi, "$1");
				}
				// 将列表写入到组件中
				this.setContent(sData);
				if(this.other != null){
					this.other();
				}
			}, this)
			,onError : Core.Function.bind2(function () {
				this.setContent('<div class="loadFailed">加载失败！</div>');
			}, this)
			,onFail	: Core.Function.bind2(function () {
				this.setContent('<div class="loadFailed">加载失败！</div>');
			}, this)
		});
		Lib.checkAuthor();
		if($isAdmin){
			this.setTitle();
		}
	}
	,"setTitle"		: function () {
		var title = this.getTitle().getAttribute("comp_title") || this.getTitle().innerHTML ;
		this.getTitle().setAttribute("comp_title", title);
		if(this.size == 210 && Core.String.byteLength(title) > 12){
			this.getTitle().innerHTML = Core.String.leftB(title, 10) + "…";
		}else{
			this.getTitle().innerHTML = title;
		}
	}
	/*
	 * 设置组件的管理链接，仅在页面设置新增组件的时候会用到
	 */
	,"setManage"	: function (){
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
		try{
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
			this.load();
		}
		if (bAddManage) {
			this.setManage();
		}
		}catch(e){
			//alert(e.message);
		}
	}
});
