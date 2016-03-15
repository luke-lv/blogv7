
$import("sina/sina.js");
$import("sina/utils/json.js");
$import("lib/interface.js");
$import("lib/dialogConfig.js");
$import("product/blogmsg/centertip.js");

$registJob("noteManage", function(){
	
	if(!$E("quote_notice"))return false;
	
	scope.noteManage_submit= function()
	{
		var obj ={					
							"quote_notice" : $E("quote_notice").checked?1:0,
							"fav_notice":$E("fav_notice").checked?1:0,
							"atten_notice":$E("atten_notice").checked?1:0,
							"invite_notice":$E("invite_notice").checked?1:0,
							"uid":$UID						
					
				};	
		var s = Utils.Json.flatten(obj);
		var url = 'http://i.blog.sina.com.cn/blog_rebuild/riaapi/profile/note/notemanage.php';
		var inter = new Interface(url,"jsload");
		inter.request({
			GET:{
					"quote_notice" : ($E("quote_notice").checked?"1":"0"),
					"fav_notice":($E("fav_notice").checked?"1":"0"),
					"atten_notice":($E("atten_notice").checked?"1":"0"),
					"invite_notice":($E("invite_notice").checked?"1":"0"),
					"uid":$UID	
				},			
			onFail:function(){winDialog.alert("修改失败请刷新页面重试")},
			onSuccess:function(){
				centerTips.show("保存成功");	
				setTimeout(function(){
					window.location.href="http://i.blog.sina.com.cn/blogprofile/profilelatestnote.php";
				},2000);  
			},
			onError:function(data){
					if(data.code == 'A00003')
					{
						winDialog.alert("没有权限",{funcOk:function(){
							window.location.reload();
						}})
					}else
					{
						winDialog.alert("修改出现错误请刷新页面重试")	
					}				
				}
		});
	}
	
	scope.noteManage_canncel= function()
	{
		$E("quote_notice").checked="";
		$E("fav_notice").checked="";
		$E("atten_notice").checked="";
		$E("invite_notice").checked="";
	}
});


