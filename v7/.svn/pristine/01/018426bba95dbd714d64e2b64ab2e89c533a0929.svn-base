

$import("sina/core/string/trim.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/fireEvent.js");
$import("sina/core/array/foreach.js");
$import("lib/interface.js");
$import("lib/login/ui.js");

$import("comps/5years/stylishDialog.js");
$import("comps/msgTips.js");
$import("jobs/5years/gameLogic.js");


(function(){
	var _mySummarize = $E("summarize");
	var _myMotion = $E("motion");
	var _myWishes = $E("wishes");
	var _sendBtn = $E("saveMyBlog");
	var _compInterface = "http://interface.blog.sina.com.cn/blog_5years/interface.php";
	var _isRequested = false;
	var _res;
	
	if(!_mySummarize) return;
	
	
	_mySummarize.value = "";
	_myMotion.value = "";
	_myWishes.value = "";
	
	Core.Events.addEvent(_sendBtn, function(){
		
		if(_isRequested) return;
		_isRequested = true;
		
		var d1 = Core.String.trim(_mySummarize.value);
		var d2 = Core.String.trim(_myMotion.value);
		var d3 = Core.String.trim(_myWishes.value);
		
		// 校验输入
		var validArr = [_mySummarize, _myMotion, _myWishes];
		var foreachStop = false;
		Core.Array.foreach(validArr, function(elem, i){
			if(foreachStop) return;
			
			var txt = Core.String.trim(elem.value);
			if(!txt){
				Comps.msgTips("<span style='color:red; font-weight:bold;'>此项必填哦</span>", elem);
				foreachStop = true;
			}
		});
		
		// 有误则不能继续执行
		if(foreachStop){
			_isRequested = false;
			return;
		}
		
		new Interface(_compInterface, "ijax").request({
			POST:{
				action:	"post_article",
				data1:	d1,
				data2:	d2,
				data3:	d3
			},
			onSuccess:function(res){
				Comps.gameLogic("saveBlog", res);
				_isRequested = false;
			},
			onError:function(res){
				_res = res;
				Comps.stylishDialog.alert(res.data.msg, {
					funcOk:		dialogConfirm,
					funcCls:	dialogConfirm
				});
				
				_isRequested = false;
			},
			onFail:function(){
				
				Comps.stylishDialog.alert("服务器忙，请稍候再试！");
				_isRequested = false;
			}
		});
		
	}, "click");
	
	function dialogConfirm(){
		if(_res.code == "A00005"){
			var userLogin = new Lib.Login.Ui();
			userLogin.login(function(){
				
				// 登录后自动点击发博文。刷新。
				Core.Events.fireEvent(_sendBtn, "click");
			});
			
			// ifm 广告隐藏
			$E("login_ad").style.display = "none";
			
		}else{
			window.location.reload();
		}
	}
	
	
})();

