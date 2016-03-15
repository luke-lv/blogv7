

$import("comps/5years/magicTextarea.js");
$import("comps/msgTips.js");

(function(){
	
	var _mySummarize = $E("summarize");
	var _myMotion = $E("motion");
	var _myWishes = $E("wishes");
	
	if(!_mySummarize) return;
	
	
	Comps.magicTextarea(_mySummarize, 280, 52, cut_cb);			// 52px 刚好是 3 行的 textarea 高度。
	Comps.magicTextarea(_myMotion, 280, 52, cut_cb);
	Comps.magicTextarea(_myWishes, 280, 52, cut_cb);
	
	function cut_cb(elem){
		Comps.msgTips("<span style='color:red; font-weight:bold;'>字数不能超过 140 哦</span>", elem);
	}
	
})();


