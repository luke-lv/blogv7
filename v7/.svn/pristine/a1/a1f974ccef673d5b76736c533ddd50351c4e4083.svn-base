/**
 * @fileoverview 光棍节添加博客好友
 * @author zhangkai2@staff.sina.com.cn
 * @created 2010-11-10
 */

$import("sina/sina.js");
$import("sina/core/events/addEvent.js");
$import("lib/interface.js");
$import("lib/checkAuthor.js");

$registJob("SinglesDay", function(){
		scope.addFriendForSinglesDay=function(){
			//判断当前用户是否登录
			Lib.checkAuthor();
			if($UID){
				//如果用户登录  发送加好友请求
				new Interface("http://control.blog.sina.com.cn/riaapi/profile/attention_add.php", "ijax").request({
					POST:{uid:$UID,aid:1259295385}
				});
			}
		};
});