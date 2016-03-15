/**
 * @fileoverview 取消博文收藏
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-18
 */

$import("sina/sina.js");

$import("lib/dialogConfig.js");

$import("collection/collectionBlogs.js");

$registJob("removeCollectionBlog", function(){
	window.$removeCollectionBlog = function(uid,blogID,blog_id){
		winDialog.confirm("确定取消博文收藏吗？",{
			funcOk:function(){
				scope.CollectionBlogs.removeBlog(uid,blogID,blog_id);
			}
		});
	};
});