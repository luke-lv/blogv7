/**
 * @author {FlashSoft}
 * arranged by xy xinyu@staff.sina.com.cn
 */
$import("sina/sina.js");
$registJob("editor_articlecate", function () {
	//$G2("ArticleCateFuncs", "FlashSoft", "文章发表: 用来给分类管理回调用");
	window.ArticleCateFuncs = {
		reloadCate: function (aCateList) {
			var selectElementNode = $E("componentSelect");
			selectElementNode.options.length = 0;
			selectElementNode.options.add(new Option("默认分类", 1));
			for(var i = 0; i < aCateList.length; i ++) {
				selectElementNode.options.add(new Option(aCateList[i].label, aCateList[i].value));
			}
			if($E('xRankRadio'))
				selectElementNode.options.add(new Option("私密博文", 0));
			if($E('xRankRadio') && !$E('xRankRadio').checked){
				selectElementNode.selectedIndex = selectElementNode.length - 2;
			}else {
				selectElementNode.selectedIndex = selectElementNode.length - 1;
			}
			CateDialog.setCloseEvent(true);
			CateDialog.hidden();
			
		}
	};
});