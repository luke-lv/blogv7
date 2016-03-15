/**
 * @fileoverview 关注
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-18
 */

$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/utils/io/jsload.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/string/trim.js");

$import("lib/dialogConfig.js");
$import("lib/interface.js");
$import("lib/checkAuthor.js");

$import("msg/attention.js");

/**
 * 关注
 */
scope.Attention=Core.Class.create();
scope.Attention.prototype={
	
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
	initialize:function(){
		this.interfaceCancel = new Interface("http://control.blog.sina.com.cn/riaapi/profile/attention_del.php","jsload");
		this.interfaceRemove = new Interface("http://control.blog.sina.com.cn/riaapi/profile/attention_move.php","jsload");
	},
	
	/**
	 * 加关注
	 * @param {String} uid 被访问者UID
	 * @param {String} aid 要加的UID
	 * @param {Boolean} simpleMode 是否使用简版的成功对话框
	 * @param {Function} fCallback 加关注成功后的回调函数
	 */
	add:function(uid, aid, simpleMode, fCallback){
		var _this=this;
		//Utils.Io.JsLoad.request(this.interfaceAddURL+"?uid="+uid+"&aid="+aid, {
		new Interface(this.interfaceAddURL, "ijax").request({
            POST : {
                uid: uid,
                aid: aid
            },
			onComplete:function(data){
				Lib.checkAuthor();
				
				//成功
				if(data.code=="A33004"){
					if(simpleMode){
						winDialog.alert("关注成功！",{
							width:300,
							icon:"03"
						});
						Core.Dom.removeNode($E("attention_" + aid));
						if(Core.String.trim($E("attention_list").innerHTML).replace(/"/g, "").toLowerCase()
									== '<div class=clearit></div>'){
							$E("attention_list").parentNode.innerHTML = '<div class="SG_nodata">暂无推荐!</div>';
						}
					}else{
						winDialog.alert($ATTENTION_MSG[data.code],{
							width : 300,
							icon : "03",
							subText : ['<div class="CP_w_cnt SG_txtb">你将在关注动态页面接收到对方的新消息</div>'
								, '<ul class="CP_w_part CP_w_aLine">'
									, '<li><a href="javascript:void(0);" onclick="scope.pa_add.add(\'' + aid + '\');winDialog.getDialog(\'attention\').close();">手机订阅此用户&gt;&gt;</a><img height="15" align="absmiddle" width="15" class="SG_icon SG_icon11" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" title="新"/></li>'
									, '<li><a href="http://profile.blog.sina.com.cn/attention_feed.php?uid=' + $UID
										+ '" onclick="winDialog.getDialog(\'attention\').close();">查看关注动态&gt;&gt;</a></li>'
									, '<li><a href="http://profile.blog.sina.com.cn/attention.php?uid=' + $UID
										+ '&type=0" onclick="winDialog.getDialog(\'attention\').close();">查看我关注的人&gt;&gt;</a></li>'
									, '<li><a href="http://profile.blog.sina.com.cn/attention.php?uid=' + $UID
										+ '&type=1" onclick="winDialog.getDialog(\'attention\').close();">查看谁在关注我&gt;&gt;</a></li>'
								, '</ul>'].join(""),
							funcOk : function(){
								if(fCallback){
									fCallback();
								}else{
									window.location = window.location.toString().replace(/#.*/,"");
								}
							}
						}, "attention");
					}
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
				}
			}
        });
	},
	
	/**
	 * 
	 * @param {String} uid 被访问者UID
	 * @param {String} aid 要取消的UID
	 */
	cancel:function(uid,aid){
		var _this=this;
		this.interfaceCancel.request({
			GET : {
				uid:uid,
				aid:aid
			},
			onSuccess : function (data) {
				window.location=window.location.toString().replace(/#.*/,"");
			},
			onError : function (data) {
				winDialog.alert($ATTENTION_MSG[data.code],{
					funcOk:_this.errorHandle, 
					funcClose:_this.errorHandle,
					icon : "02" 
				});
			},
			onFail : function (){
			}
		});
	},
	
	/**
	 * 
	 * @param {String} uid 被访问者UID
	 * @param {String} aid 要移除的UID
	 * @param {Number} isBlack 是否加入黑名单
	 * 					0 : 不加入黑名单
	 * 					1 : 加入黑名单
	 */
	remove:function(uid,aid,isBlack){
		var _this=this;
		this.interfaceRemove.request({
			GET : {
				uid:uid,
				aid:aid,
				isblack:isBlack
			},
			onSuccess : function (data) {
				window.location=window.location.toString().replace(/#.*/,"");
			},
			onError : function (data) {
				winDialog.alert($ATTENTION_MSG[data.code],{
					funcOk:_this.errorHandle, 
					funcClose:_this.errorHandle,
					icon : "02" 
				});
			},
			onFail : function (){
			}
		});
	},
	
	/**
	 * 有错误时，关闭提示框时触发
	 */
	errorHandle:function(){
		
	}
	
};
