/**
 * @fileoverview 收藏的图片
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-18
 */

$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/events/stopEvent.js");

$import("lib/interface.js");

$import("msg/collection.js");

/**
 * 收藏的图片静态类
 */
scope.CollectionPhotos={
	
	/**
	 * 删除收藏的图片
	 * @param {String} uid 被访问者UID
	 * @param {String} photoID 收藏图片ID
	 */
	removePhoto:function(uid,photoID,blog_id){
		(new Interface("http://photo.blog.sina.com.cn/services/ajax_collection_del.php", "jsload")).request({
			GET : {
				id:photoID,
				blog_id:blog_id,
				uid:uid
			},
			onSuccess : function (data) {
				window.location=window.location.toString().replace(/#.*/,"");
			},
			onError : function (data) {
				winDialog.alert(
					$COLLECTION_MSG[data["code"]],{
						icon : "02",
						funcDisplayFinished:function(){
							//用户未登录，直接重新装载页面
							if(data["code"]=="P00003"){
								window.location=window.location.toString().replace(/#.*/,"");
							}
							Core.Events.stopEvent();
						}
					}
				);
			},
			onFail : function (){
			}
		});
		return false;
	}
};
