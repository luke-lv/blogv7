/**
 * arranged by xy xinyu@staff.sina.com.cn
 */

$import("lib/dialogConfig.js");
$import('component/cateDialog.js');
//$G2("CateDialog", "FlashSoft", "文章发表中,分类管理!");
$registJob("editor_catedialog", function () {
	window.CateDialog=new cateDialog("editor");
});