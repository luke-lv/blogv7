/**
 * @fileInfo	
 * @author		chengwei1@staff.sina.com.cn
 * @update		2010 - 01 - 25
 */
$import("lib/jobs.js");
$import("jobs/blogLogin.js");
$import("lib/interface.js");

$registJob("adBlog",function(){
	
	//suggest		
	//userData		渲染：用户头像 id="userHead"、通知数 id="notice"、评论数 id="comments"、纸条数 id="scrips"。
	//loading		有 loading 层，id="loginLoad"。
	//dialogErr		没有这个则必须含有，id="loginError"块。
	//tabkey		tabindex 6 - 10，form id="notLogin" or "loginFormTab"。
	//highlight		
	
//必须含有的 id：
	//id="loginDone"
	//id="userNickName"
	//id="blogEntrance"
	//id="logout"
	//id="notLogin"
	//id="loginName"
	//id="loginPass"
	//id="loginSave"
	//id="loginButton"
	
	$BlogLogin.init({
		nickLen : 16,								//昵称截断长度。
		customFunc : "suggest userData tabkey highlight loading",		//登录功能选择。
		suggestColor : {
			border : "#FFA13B",						//suggest 边框色。
			msover : "#ECC996"						//suggest 背景色。
		},
		//uid=1565079834	version=7
		sucCallback : function(uid){					//手动自动登录成功回调。
			(new Interface("http://control.blog.sina.com.cn/admin/check_user/user_version.php", "jsload")).request({
				GET : {
					uid : uid,
					version : 7
				},
				onSuccess : function(res){
					if(res.version == 7){
						$E("updateBtn").style.display = "none";
					}else{
						$E("updateBtn").style.display = "";
					}
				}
			});
		}
	});
	
});

