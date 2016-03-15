/**
 * @fileoverview
 *	新个人中心——渲染相册评论列表
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("lib/jobs.js");

$import("PhotoCommentList.js");

$registJob("commentPhotoList", function (){

	scope.photoComment = new PhotoCommentList();
	
	window.cmnt_notfound = Core.Function.bind2(scope.photoComment.showEmpty, scope.photoComment);
	window.cmnt_print = Core.Function.bind2(scope.photoComment.showCommentList, scope.photoComment);
	
	$SYSMSG['B36001']="操作失败，此图片不存在或被删除。";	
});
