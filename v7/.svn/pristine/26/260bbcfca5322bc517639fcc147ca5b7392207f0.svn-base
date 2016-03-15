


$import("lib/interface.js");
$import("sina/core/string/shorten.js");

// 获取勋章的好友。
(function(){
	
	var _box = $E("honor_friends");
	var _compInterface = "http://interface.blog.sina.com.cn/blog_5years/interface.php";
	var _TPL = {};
	var _str = "";
	
	if(!_box) return;
	
	
	// 模板
	_TPL.shell_fmt = [
	'<li>',
		'<a href="#{link}" target="_blank" title="#{name}"><img height="50" width="50" alt="" src="#{headImg}"></a>',
		'<a href="#{link}" target="_blank" title="#{name}">#{nick}</a>',
	'</li>'].join("");
	
	
	// 请求数据
	new Interface(_compInterface, "jsload").request({
		GET:{
			action:"get_medal_list"
		},
		onSuccess:function(res){
			var len = res.length;
			var nickname = "";
			if(len){
				for(var i=0; i<len; i++){
					nickname = Core.String.shorten(res[i].user_name || res[i].uid+"", 6);
					_str += Lib.formatTemplate(_TPL.shell_fmt, {
						nick:		nickname,
						name:		res[i].user_name || res[i].uid,
						link:		"http://blog.sina.com.cn/u/"+res[i].uid,
						headImg:	"http://portrait"+(res[i].uid%8+1)+".sinaimg.cn/"+res[i].uid+"/blog/50"
					});
					
					_box.innerHTML = _str;
				}
			}else{
				// 空状态
				_box.innerHTML = "还没有好友领取勋章，现在去邀请！"
				
			}
		},
		onError:function(res){
			
		},
		onFail:function(){
			winDialog.alert("系统繁忙，请稍候再试");
		}
	});
	
	
	
})();



