
$import("comps/5years/attActivity.js");
$import("comps/5years/stylishDialog.js");
$import("jobs/5years/gameLogic.js");
$import("lib/openBlog.js");

(function(){
	
	var _box = $E("comps_attActivity");
	if(!_box) return;
	
	var _res;
	var a = Comps.attActivity({
		box:		_box,
		
		btnClass:	_box.getAttribute("btnClass"),
		btnTogClass:_box.getAttribute("btnTogClass"),
		btnStatus:	_box.getAttribute("btnStatus"),
		
		btnText:	_box.getAttribute("btnText"),
		btnTogText:	_box.getAttribute("btnTogText"),
		textId:		_box.getAttribute("textId"),
		
		onSucc:		function(res){
			Comps.gameLogic("attActivity", res);
		},
		onErr:		function(res){
			
			// 未登录已处理
			_res = res;
			
			// 未开通
			if(_res.code == "A40005"){
				scope.hasOpenBlog = "no";				// 必须登录，必须 no！
				scope.blogOpener.showDialog(function(){
					window.location.reload();
					// a.attentAction();
				});
			}else{
				Comps.stylishDialog.alert(res.data.msg, {
					funcOk: dialogConfirm,
					funcCls: dialogConfirm
				});
			}
		}
	});
	
	function dialogConfirm(){
		window.location.reload();
	}
	
})();


