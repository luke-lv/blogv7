/**
 * @desc	MSN Space 搬家，第四步
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("lib/interface.js");
$import("sina/core/string/trim.js");

$registJob("msnTransInfo", function(){
	
	var msnNick_node = $E("msn_nick");
	var blogUid_node = $E("blog_uid");
	var msnNick = null;
	var blogUid = null;
	
	if(msnNick_node && blogUid_node){
		msnNick = Core.String.trim(msnNick_node.value);
		blogUid = Core.String.trim(blogUid_node.value);
	}
	
	// 双双为空，则放弃
	if(!msnNick && !blogUid){
		return;
	}
	
	new Interface("http://control.blog.sina.com.cn/riaapi/profile/modify_uname_post.php?change=yes", "jsload").request({
		GET:{
			uname:	msnNick,
			deff:	blogUid,
			uid:	blogUid
		},
		onSuccess:function(){},
		onError:function(){},
		onFail:function(){}
	});
	
});


