/**
 * @author darkty2009
 * 邀请好友升级在首页的widget
 */
$import("sina/sina.js");
$import('lib/interface.js');
$import('lib/showError.js');

$registJob("inviteWidget", function(){
	
	function reloadWidget()
	{
		var htmlFace = new Interface("http://control.blog.sina.com.cn/riaapi/profile/invite_upgrade.php?uid="+scope.$uid+"&version=7", "ajax");
		htmlFace.request({
			GET:{
				
			},
			onSuccess:function(result) {
				if($E('invite_upgrade')) {
					$E('invite_upgrade').innerHTML = result;
					
					addClickEvent();
				}
			},
			onError:function(result) {
				trace("加载HTML失败");
			}
		})
	}
	
	function addClickEvent(){
		var list = $N("fcb");
		
		if (list.length > 0) {
			$E('doInvite').onclick = function(){
				var face = new Interface("http://control.blog.sina.com.cn/riaapi/upgrade/invite.php?version=7", "ajax");
				var values = [];
				for (var i = 0; i < list.length; i++) {
					if (list[i].checked) {
						values[values.length] = 'http://blog.sina.com.cn/u/' + list[i].value;
					}
				}
				
				face.request({
					POST: {
						url: values.join(",")
					},
					onSuccess: function(result){
						winDialog.alert("邀请已成功", {
							funcOk: function(){
								window.location.reload();
							}.bind2(this),
							textOk: "确定",
							defaultButton: 1, // 默认是1，表示确定按钮默认聚焦，0 表示取消按钮默认聚焦
							title: "提示",
							icon: "03" // 可选值："01"、"02"、"03"、"04"、"05"
						}, "levepUpPost");
					}.bind2(this),
					onError: function(result){
						switch (result.code) {
							case "A00010":
								showError("邀请名额已满");
								break;
							case "A00011":
								showError("本次邀请超过剩余邀请名额");
								break;
							case "A00012":
								showError("请正确填写内容");
								break;
							case "A00015":
								showError("抱歉，新版博客测试名额暂时发放完毕，稍后会再次开放。请耐心等待");
								break;
							default:
								showError($SYSMSG[result.code]);
						}
					}.bind2(this)
				});
			}
		}
		
		if ($E('checkAll')) {
			$E('checkAll').onclick = function(){
				var length = list.length;
				for(var i=0;i<length;i++) {
					list[i].checked = this.checked;
				}
			}
		}
	}
	
	reloadWidget();
});