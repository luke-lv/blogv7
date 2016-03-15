$import("comps/oop.js");
$import("comps/baihe/_baihe.js");
$import("lib/dialogConfig.js");


Baihe.activeBlog = function(){
	var s = "一键开通博客，开启抽奖之旅";
	var node = winDialog.alert(s, {
		textOk:		"是",
		textCancel:	"否",
		icon:		"03", 
		title:		"开通博客",
		funcOk:function(){
			trace("开通博客");
			new Interface("http://control.blog.sina.com.cn/baihe/interface.php?action=open_blog", "jsload").request({
				GET:{
					uid: $UID
				},
				onSuccess:function(res){
					window.location.href = "http://control.blog.sina.com.cn/baihe/daily.php?t="+new Date().getTime();
				},
				onError:function(res){
					winDialog.alert(res.data);
					if(res.code == "A20005"){		// 本页开通失败，去开通页
						setTimeout(function(){
							window.location.href = "http://blog.sina.com.cn/u/"+$UID;
						}, 3000);
					}
				},
				onFail:function(res){
					window.location.href = "http://blog.sina.com.cn/u/"+$UID;
				}
			});
		}
	});
	node.nodes.btnClose.style.display = "none";
};



