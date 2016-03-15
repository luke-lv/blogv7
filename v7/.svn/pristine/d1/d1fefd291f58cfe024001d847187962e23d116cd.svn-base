/**
 * @fileoverview 个人中心添加群博客关注
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-18
 */

$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/utils/io/jsload.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/string/trim.js");

$import("lib/dialogConfig.js");
$import("lib/interface.js");
$import("lib/checkAuthor.js");

$import("exec/autoFadePanal.js");


/**
 * 发送请求关注群博客
 */
scope.AttentionCrowd=Core.Class.create();
scope.AttentionCrowd.prototype={
	
	/**
	 * 添加关注的接口地址
	 */
	interfaceAddURL:"http://control.blog.sina.com.cn/riaapi/profile/attention_add.php",
	
	/**
	 * 取消关注的接口
	 */
	interfaceCancel:null,
	
	/**
	 * 移除关注的接口
	 */
	interfaceRemove:null,
	
	/**
	 * 初始化
	 */
	initialize:function(){},
	
	/**
	 * 加关注
	 * @param {String} uid 被访问者UID
	 * @param {String} aid 要加的UID
	 * @param {Object} cfg {
	 * 						success : sCallback 加关注成功后的回调函数
	 * 						failure : fCallback 加关注失败后的回调函数
	 * 					}
	 */
	add:function(uid, aid, cfg){
		var _this=this;
		new Interface(this.interfaceAddURL, "ijax").request({
            POST : {
                uid: uid,
                aid: aid
            },
			onComplete:function(data){
				Lib.checkAuthor();
				//成功
				if(data.code=="A33004"){
					cfg.success(data);//fCallback();
				}
				//失败
				else{
					var errorMSG = $ATTENTION_MSG[data.code];
					
					//关注已达上限300,需要在提示信息中加入链接
					if (data["code" == "A33003"]) {
						errorMSG = $ATTENTION_MSG[data.code].replace(/#\{url\}/g, "http://profile.blog.sina.com.cn/attention.php?type=0&uid="+$UID);
					}
					
					winDialog.alert(errorMSG,{
						funcOk:		_this.errorHandle,
						funcClose:	_this.errorHandle,
						icon:		"02"
					});
					cfg.failure(data,errorMSG)
				}
			}
        });
	},
	
	/**
	 * 
	 * @param {String} uid 被访问者UID
	 * @param {String} aid 要取消的UID
	 */
//	cancel:function(uid,aid){
//		var _this=this;
//		this.interfaceCancel.request({
//			GET : {
//				uid:uid,
//				aid:aid
//			},
//			onSuccess : function (data) {
//				window.location=window.location.toString().replace(/#.*/,"");
//			},
//			onError : function (data) {
//				winDialog.alert($ATTENTION_MSG[data.code],{
//					funcOk:_this.errorHandle, 
//					funcClose:_this.errorHandle,
//					icon : "02" 
//				});
//			},
//			onFail : function (){
//			}
//		});
//	},
	
	/**
	 * 
	 * @param {String} uid 被访问者UID
	 * @param {String} aid 要移除的UID
	 * @param {Number} isBlack 是否加入黑名单
	 * 					0 : 不加入黑名单
	 * 					1 : 加入黑名单
	 */
//	remove:function(uid,aid,isBlack){
//		var _this=this;
//		this.interfaceRemove.request({
//			GET : {
//				uid:uid,
//				aid:aid,
//				isblack:isBlack
//			},
//			onSuccess : function (data) {
//				window.location=window.location.toString().replace(/#.*/,"");
//			},
//			onError : function (data) {
//				winDialog.alert($ATTENTION_MSG[data.code],{
//					funcOk:_this.errorHandle, 
//					funcClose:_this.errorHandle,
//					icon : "02" 
//				});
//			},
//			onFail : function (){
//			}
//		});
//	},
//	
	/**
	 * 有错误时，关闭提示框时触发
	 */
	errorHandle:function(){
		
	}
	
};