/**
 * @desc	百合发布预览的九宫博文
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */
 
$import("lib/checkAuthor.js");
$import("lib/dialogConfig.js");
$import("lib/interface.js");
$import("sina/core/events/addEvent.js");
$import("comps/baihe/luckyTimes.js");

$registJob("pubPreview", function(){
	var postBtn = $E("post_blog");
	if(!postBtn) return;
	
	var temp = {};
	var __inProgress = false;
	var params = document.getElementsByTagName("input");
	for(var i=0; i<params.length; i++){
		temp[params[i].getAttribute("name")] = params[i].value;
	}
	
	Core.Events.addEvent(postBtn, function(){
		if(Baihe.userChangeDetected()) return;			// 登录组件已引本类
		if(__inProgress) return;
		__inProgress = true;
		
		new Interface("http://control.blog.sina.com.cn/baihe/process.php", "ijax").request({
			POST: temp,
			onSuccess:function(res){
				// updateLuckyTimes();
				winDialog.alert("发布成功！", {
					textOk:		"去博客看看",
					icon:		"03",
					funcOk:		function(){
						window.location.href = res;
					},
					funcClose:	function(){
						window.location.href = res;
					}
				});
				__inProgress = false;
			},
			onError:function(res){
				if (res.code == "A20005"){
					winDialog.alert(res.data, {
						funcOk:		function(){
							window.location.href = "http://control.blog.sina.com.cn/baihe/lottery.php";
						},
						funcClose: function(){
							window.location.href = "http://control.blog.sina.com.cn/baihe/lottery.php";
						}	
					});
				}else if(res.code == "A80005"){
					winDialog.alert(res.data);
				}
				__inProgress = false;
			},
			onFail:function(){
				__inProgress = false;
			}
		});
	}, "click");
	
	function updateLuckyTimes(){
		new Interface("http://control.blog.sina.com.cn/baihe/interface.php?action=get_lot_num1", "ijax").request({
			GET:{
				t:	new Date().getTime()
			},
			onSuccess:function(res){
				Baihe.luckyTimes.init().update(res);
			}
		});
	}
});

