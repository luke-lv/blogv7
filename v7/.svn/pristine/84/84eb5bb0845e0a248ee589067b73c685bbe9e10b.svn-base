/**
 * @author darkty2009
 */
$import("sina/core/string/trim.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/leftB.js");
$import("sina/core/events/stopEvent.js");
$import("sina/ui/dialog/windowDialog.js");
$import("lib/dialogConfig.js");
$import("lib/showError.js");
$import("lib/interface.js");
$import("jobs/resource.js");
$import("msg/messagecode.js");


$registJob("paperread", function() {
	
	$E("content").value = "";
	$E("content").onkeyup = function(){
		if(Core.String.byteLength(this.value) > 300){
			this.value = Core.String.leftB(this.value, 300);
		}
		$E('textlong').innerHTML='还可以输入'+ parseInt((300 - Core.String.byteLength(this.value))/2) +'个汉字';
		return false;
	};
	
	window.addToBlackPersion = function(uid) {
		/**
		winDialog.confirm("<p class='sTit'><strong>是否确定将此用户列入黑名单？</strong></p>", {
			funcOk : function(){
				try {
					Core.Events.stopEvent();
				}catch(e) {
				
				}
				var request_obj = new Interface("http://control.blog.sina.com.cn/riaapi/profile/messagetalkdel.php?version=7", "jsload");
                var params = {
                    GET: {
                        uid: scope.$uid,
                        type: 2,
						tuid: uid,
						inblack: 1
                    },
                    onSuccess: function(res){
                        document.location.reload();
                    },
                    onError: function(res){
                        showError($SYSMSG[res.code]);
                    }
                };
                request_obj.request(params);
			}
		});
		**/
		winDialog.confirm("确实将此人加入黑名单？<br/>加入黑名单的用户将不能和你沟通",{
					funcOk:function(){
						new Interface("http://control.blog.sina.com.cn/blog_rebuild/riaapi/profile/note/deleblackuid.php", "jsload").request(
							  {
							  		GET:{				
										uid:$UID,
										friend_uid:uid,
										inblack:1
									},
									onSuccess : function(){
													winDialog.alert("操作完成", {
														funcOk : function(){  },
														 icon: "03"
													});
												},
									onError : function(res){
													if(typeof res)
													{
														if(res.code =='blacklist_full')
														{
															winDialog.alert("抱歉！您的黑名单已经满了");
														}else
														{
															showError(res.code);	
														}
															
													}else
													{
														
													}						
												}
								});	
					}
				});  
	};
	
	window.sendReceiveMessage = function(fuid, tuid){
		
		var value = $E("content").value;
		value = Core.String.trim(value+"");
		
        new Interface("http://control.blog.sina.com.cn/riaapi/profile/messagesend.php?version=7", "ijax").request({
            POST: {
                tuid: tuid,
                fuid: scope.$uid,
                content: value,
				reply: 1
            },
            onSuccess: function(data){
				trace(data);
                document.location.reload();
            },
            onError: function(res){
                showError($SYSMSG[res.code])
            }
            
        });
	};
	
	window.deleteNote = function(id, type, other) {
		winDialog.confirm("<p class='sTit'><strong>"+$RESOURCE['paper_panel_confirm']+"</strong></p>", {
			funcOk : function(){
				try {
					Core.Events.stopEvent();
				}catch(e) {
				
				}
				new Interface("http://control.blog.sina.com.cn/riaapi/profile/messagetalkdel.php?version=7", "jsload").request({
					GET : {
						uid : scope.$uid,
						type : type,
						mid : id
					},
					onSuccess : function(data){
						trace(data);
						window.location.reload();
					},
					onError : function(res){
						if($SYSMSG[res.code] == 'A20105')
						{
							winDialog.alert("删除成功，黑名单已达上限。",{funcOk:
							function()
							{
								window.location.reload();
							}});
							return;
						}
						windowDialog.alert(
							$SYSMSG[res.code],
							{ icon : "02" }
						);
					}
				});
			}
		});
	};
	
	window.deleteMessage = function(fuid, tuid, type){
		winDialog.confirm(
			"<p class='sTit'><strong>"+$RESOURCE['paper_delete']+"</strong></p>",
			{
				funcOk : function(){
					try {
						Core.Events.stopEvent();
					}catch(e) {
					
					}
					new Interface("http://control.blog.sina.com.cn/riaapi/profile/messagedel.php", "jsload").request({
						GET : {
							fuid : fuid,
							tuid : tuid
						},
						onSuccess : function(res){
							document.location.reload();
						},
						onError : function(res){
							showError($SYSMSG[res.code]);
						}
					});
				}
			}
		);
	};
});
