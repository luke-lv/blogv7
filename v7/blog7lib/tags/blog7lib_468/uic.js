/**
 * @fileoverview
 *	根据指定的列表获取 UIC
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2008
 */

$import("sina/utils/io/jsload.js");
$import("sina/core/array/uniq.js");
$import("sina/core/string/trim.js");
$import("lib/lib.js");
/**
 * @fileoverview
 * @modified  xiaoyue3@staff.sina.com.cn 
 * @version 2.0
 * @date 2013-05-17  
*/
Lib.Uic = {
	_interfaceMultiquery:"http://uic.sso.sina.com.cn/uic/Mutiquery.php",
	/**
	 * 缓存已经请求过的 UID 昵称
	 */
	cacheNickName : {},
	/**
	 * 根据指定的 UID 列表数组，从 UIC 接口获取昵称，成功后执行回调函数
	 * 
	 * @param {Array} arrUidLists	需要查询的 UID 列表，UID 中重复的会被过滤为一个
	 * @param {Function} fCallBack	回调函数
	 * @return {Object}		返回以 UID 为 KEY，昵称为 Value 的 JSON 对象
	 * @example
		Lib.Uic.getNickName(["1406758883", "1312273654"], function(oResult){
			for(var key in oResult){
				trace(key + " 的昵称是：" + oResult[key]);
			}
		});
	 */ 
	getNickName : function (arrUidLists, fCallBack, requestNo){
		arrUidLists = Core.Array.uniq(arrUidLists) || [];
		requestNo = requestNo || 10;
        var _trim = Core.String.trim;
		// 先检查缓存，如果有缓存的数据不再重复请求
		var _cache = this.cacheNickName, _uidWithNoCache = [], nickType = [];
		var _data = {};
		for(var i = 0, len = arrUidLists.length; i < len; i ++ ){
			// 如果缓存里没有指定 UID 或者缓存里的昵称是 null，就存入待请求列表；
			// 如果缓存有该 UID，就存入临时连连 _data 中
			if(typeof _cache[arrUidLists[i]] == "undefined" && _cache[arrUidLists[i]] == null){
                var nickEl = $E("ownernick");
                var pageid = _trim(scope.$pageid);
                //此处增加pageid变量的判断条件，并且排除了文章页，首页，关于我 六个页面
                //其余页面由于nickEl不存在，所以不会走这个判断条件，而如果要看自己的话，就会走下面的缓存
                // 所有昵称全部走接口的话，不应该取页面上的内容，肯定是不对的 modified by  gaolei2
				// if(arrUidLists[i] == scope.$uid && nickEl != null && (pageid != "articleM" && pageid != "article" && pageid != "personal" && pageid != "personalM" && pageid != "index" && pageid != "indexM")){
				// 	_data[arrUidLists[i]] = _trim(nickEl.textContent || nickEl.innerText);
    			//  continue;
				// }

				if(arrUidLists[i] == $UID && scope.nickname != null){
					_data[arrUidLists[i]] = _trim(scope.nickname);
                    continue;
				}
				_uidWithNoCache.push(arrUidLists[i]);
			}else{
				_data[arrUidLists[i]] = _cache[arrUidLists[i]] || arrUidLists[i];
			}
		}
		// 如果缓存中就拿到所有数据，则直接回调；否则读请求无缓存的UID再回调。
		if(_uidWithNoCache.length == 0){
			fCallBack(_data);
			_data = null;
		}else{
//			trace("有数据需要新读取，总数是 " + _uidWithNoCache.length);
			/*
				接口地址变更 传过去的参数也变更
				http://uic.internal.sina.com.cn/uic/Mutiquery.php?
				UID=0&
				Check=null&
				UIDS=["2790201494","2413966804"]&
				UserInfoTypes=[1,1]&
				ProductType=2

				返回的数据格式变成
				requestId_7841443={"UID":0,"RetCode":0,"UserInfoTypes":[1],"UserInfos":[[1569548481,0,[1,"\u4e54\u78ca"]],[1642591402,0,[1,"\u65b0\u5a31"]]]}
			*/
			var urls = [];
			for(var i = 0;i<_uidWithNoCache.length;i++){
				nickType[i] = 1;
			}
			if(_uidWithNoCache.length > 0){
				if(nickType.length > 0){
					nickType = '[' + nickType.toString().replace(/,$/g,'') +']';
				}
				_uidWithNoCache = '[' + _uidWithNoCache.toString().replace(/,$/g,'') +']';
				urls.push({"url" :this._interfaceMultiquery + "?UID=0&Check=null&UIDS=" + _uidWithNoCache + "&UserInfoTypes=" + nickType + "&ProductType=2" });
			}
			var jsRequest = function(aUrl){
				Utils.Io.JsLoad.request(aUrl[0].url, {
					onComplete : function (data) {
						if(data){
							var uids = data.UserInfos;
							for(var i = 0;i<uids.length; i++){
								_data[uids[i][0]]= uids[i][2][1];
								Lib.Uic.cacheNickName[uids[i][0]] = uids[i][2][1];
							}
							fCallBack(_data);
						}	
					}
				});
				if (urls.length > 0) {
					setTimeout(function(){
						jsRequest(urls.splice(0, 1));
					}, 10);
				}
			}
			if (urls.length > 0) {
				setTimeout(function(){
					jsRequest(urls.splice(0, 1));
				}, 10);
			}
		}
	}
};