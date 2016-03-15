/**
 * @fileoverview 取消相册收藏
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-18
 */

$import("sina/sina.js");

$import("lib/dialogConfig.js");

$import("product/collection/collectionPhotos.js");

$registJob("removeCollectionPhoto", function(){
	window.$removeCollectionPhoto = function(uid,photoID){
		winDialog.confirm("确定取消图片收藏吗？",{
			funcOk:function(){
				scope.CollectionPhotos.removePhoto(uid,photoID);
			}
		});
	};
});