$import("lib/interface.js");
$import("lib/dialogConfig.js");
$import("lib/checkAuthor.js");
$import("lib/login/ui.js");

$import("comps/_comps.js");
$import("comps/5years/stylishDialog.js");



Comps.attActivity = function(oParam){
	
	var ATTENDED = 1;
	var UN_ATTEND = 0;
	
	
	var _box = oParam.box || document.body;					// 容器
	var _attBtn = _box.getElementsByTagName("*")[0];		// 第一个子节点必须是按钮
	
	
	var _btnClass = oParam.btnClass || "";					// 未关注的 class
	var _btnTogClass = oParam.btnTogClass || "";			// 关注的 class
	var _btnStatus = +oParam.btnStatus || UN_ATTEND;
	
	
	var _textId = oParam.textId;							// 按钮文本节点 id，没有就默认是按钮本身
	var _textNode = _textId ? $E(_textId) : _attBtn;
	
	
	var _btnText = oParam.btnText;							// 未关注时文案
	var _btnTogText = oParam.btnTogText;					// 关注时文案
	
	
	// 回调
	var _onSucc = oParam.onSucc || function(res){
		Comps.stylishDialog.alert(res);
	};
	var _onErr = oParam.onErr || function(res){
		Comps.stylishDialog.alert(res.data.msg);
	}
	
	// 
	var _responsing = false;
	
	var _compInterface = "http://interface.blog.sina.com.cn/blog_5years/interface.php";
	_attBtn.className = _btnStatus ? _btnTogClass : _btnClass;
	_textNode.innerHTML = _btnStatus ? _btnTogText : _btnText;
	
	
	// 取消关注呢？
	Core.Events.addEvent(_attBtn, function(){
		
		if(_responsing) return;
		_responsing = true;
		
		Lib.checkAuthor();
		
		// 登录者操作
		if($isLogin){
			
			// 取消关注有一个确认过程！即已关注状态时（status = 1）点击按钮
			if(_btnStatus){
				Comps.stylishDialog.confirm("真的要确定不参加这个活动了？", {
					icon:"ask",
					funcOk:function(){
						attentAction();
					},
					funcCls:function(){
						_responsing = false;
					},
					funcCancel:function(){
						_responsing = false;
					}
				}, "noAtt");
			}else{
				attentAction();
			}
			
		}else{
			var userLogin = new Lib.Login.Ui();
			userLogin.login(function(){
				attentAction();
			});
			
			// ifm 广告隐藏
			$E("login_ad").style.display = "none";
			_responsing = false;
		}
		
	}, "click");
	
	
	// 关注动作，取消添加一并。
	function attentAction(){
		new Interface(_compInterface, "jsload").request({
			GET:{
				action: "set_attention",
				activityName: "festival",
				data: _btnStatus ? "0" : "1"	// _btnStatus 是 1，表示已关注，所以按钮显示取消关注（data 应该 = 0（取消））
			},
			onSuccess:function(res){
				res.status = _btnStatus;		// 传给请求时的 btn 状态。
				_btnStatus = _btnStatus ? UN_ATTEND : ATTENDED;
				
				_onSucc(res);
				
				_attBtn.className = _btnStatus ? _btnTogClass : _btnClass;
				_textNode.innerHTML = _btnStatus ? _btnTogText : _btnText;
				_responsing = false;
			},
			
			onError:function(res){
				
				_onErr(res);
				_responsing = false;
			},
			
			onFail:function(){
				Comps.stylishDialog.alert("系统繁忙，请稍候再试");
				_responsing = false;
				
			}
		});
	}

	
	return {
		attentAction : attentAction
		
		
		
		
	}
};




