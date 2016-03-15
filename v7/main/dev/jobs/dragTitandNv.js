/**
 * @fileoverview 拖拽博客标题和博客导航
 * @author xy xinyu@staff.sina.com.cn
 * @modified Luo Rui luorui1@staff.sina.com.cn
 */

$import("lib/jobs.js");
$import("pageSet/dragThings/dragSome.js");
$registJob("dragTitandNv", function (){

	setTitleDragable();
	dragSome.add('blogTitle',$E('sinablogHead'),[108,0]);
	if($E('blogTitle')){
		var o=$E('blogTitle');
		o.style.wordBreak='keep-all';
		o.style.whiteSpace='nowrap';
	}
	dragSome.add('blognav',$E('sinablogHead'));

	/**
	 * 标记title是否能拖动
	 */
	function setTitleDragable(){
		var disableDrag = {			//设置限制拖动的模板, 1为限制,0为不限制,其他模板默认不限制
			'10_71'		:1,
			
			'11_11'		:1,			//世界杯模板统统不能拖动。
			'11_12'		:1,
			'11_13'		:1,
			'11_14'		:1,
			'11_15'		:1,
			'11_16'		:1,
			'11_17'		:1,
			'11_18'		:1,
			'11_19'		:1,
			
			'11_20'		:1,
			'11_21'		:1,
			'11_22'		:1,
			'11_23'		:1,
			'11_24'		:1,
			'11_25'		:1,
			'11_26'		:1,
			'11_27'		:1,
			'11_28'		:1,
			'11_29'		:1,
			
			'11_30'		:1,
			'11_31'		:1,
			'11_32'		:1,
			'11_33'		:1,
			'11_34'		:1,
			'11_35'		:1,
			'11_36'		:1,
			'11_37'		:1,
			'11_38'		:1,
			'11_39'		:1,
			
			'11_40'		:1,
			'11_41'		:1,
			'11_42'		:1,
			'11_43'		:1,
			'11_44'		:1
		};
		var flag = disableDrag[__pageSetVar.selectedTpl]?'false':'true';
		$E('blogTitle').setAttribute('dragable', flag);
		$E('blognav').setAttribute('dragable', flag);
	}
	scope.$setTitleDragable = setTitleDragable;

});