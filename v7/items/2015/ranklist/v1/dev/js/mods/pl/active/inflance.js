/**
微博影响力活动页数据模块展示
**/
define('mods/pl/active/inflance',function(require,exports,module){
	var $ = require('lib');
	var $toTop = require('mods/view/toTop');
	require('mods/view/blogInflance');
	var $shareToWeibo = require('mods/view/shareToWeibo');
	$shareToWeibo();
	//var $rankLise = require('mods/trans/rankList');
	
	//获取影响力接口数据 
	
	/*$rankLise.request('getBlogInfluence',{
		data:{
			type:1,
			week:1,
			moth:1,
			media_type:1,
			year:'2015',
			domain:2
		},
		onSuccess : function(rs){
			console.log(1);
		}
	})*/
	


});