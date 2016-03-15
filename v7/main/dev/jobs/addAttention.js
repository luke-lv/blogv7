/**
 * @fileoverview 添加关注
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-18
 */

$import("sina/sina.js");

$import("lib/dialogConfig.js");
$import("lib/checkAuthor.js");
$import("lib/login/ui.js");

$import("product/attention/attention.js");

$registJob("addAttention", function(){
	window.$addAttention = function(uid, aid, fCallBack){
		var attention=new scope.Attention();
		// modified by L.Ming 
		// 如果是在新个人中心首页右侧推荐加关注，不需要询问，直接请求接口，请求完弹出“关注成功！”
		if(fCallBack){
			attention.add(uid, aid, fCallBack);
		}else{
			winDialog.confirm("确定要将此人加为关注吗?",{
				funcOk:function(){
					Lib.checkAuthor();					
					if($isLogin){
						//已经登录状态下，直接添加关注
						attention.add(uid,aid);
					}else{
						//未登录状态下，先登录再添加关注
						attention.errorHandle=function(){
							window.location=window.location.toString().replace(/#.*/,"");
						};
						var attentionLogin = new Lib.Login.Ui();
						attentionLogin.login(function(){
							Lib.checkAuthor();
							attention.add($UID,aid);
						});
					}
				}
			});
		}
	};
});