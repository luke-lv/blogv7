/**
爱拍社区接口管理器
**/
define('mods/trans/rankList', function(require,exports,module){

	var $getTransmission = require('mods/common/getTransmission');

	var transRankList = $getTransmission();

	/**
	获取微博影响力排行信息
	**/
	transRankList.register('getBlogInfluence', {
		url : 'http://interface.blog.sina.com.cn/riaapi/mediaInfluence/getMediaInfluence.php',
		type : 'GET',
		dataType:'jsonp'
	});

	/**
	取得相册信息
	**/
	transRankList.register('getAlbumsInfo', {
		url : '/api/album/user',
		type : 'GET'
	});

	module.exports = transRankList;

});
