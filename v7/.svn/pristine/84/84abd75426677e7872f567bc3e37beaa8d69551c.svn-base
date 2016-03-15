/**
 * @fileoverview
 *	每四分钟检查一次，是否有新Feed
 
 * @author L.Ming | liming1@staff.sina.com.cn
 * @modified dcw1123 | chengwei1@staff.sina.com.cn
 *
 */
$import("sina/sina.js");

$import("lib/interface.js");
$import("lib/app.js");
$import("lib/showError.js");
$import("lib/msg/systemMSG.js");

App.checkFeedUpdate = function (){
	var _container = $E("feed_center_span");
	if(!_container) return;
	
	var _args = arguments;
	var _timer = 240*1000;		// 每4分钟查询一次接口
	var _isTipsShow = _container.getAttribute("tipsshow");
	
	//每4分轮询一次，如果已经显示小黄条，则不请求。
	if(_isTipsShow == null){
		new Interface("http://control.blog.sina.com.cn/riaapi/feed/feed_notice.php?version=7", "jsload").request({
			GET		: {
				uid		: scope.$uid
			},
			onSuccess	: function(oData){
				// 如果 nfn = 1 表示有新 Feed，= 0 表示没有新 Feed
				// oData.nfn = 1;
				if(oData.nfn == 1){
					var _tipsTop = $C("div");
					var _tipsBottom;
					var _first;
					var _centerHead;
					_tipsTop.className = "center_refresh";
					_tipsTop.innerHTML = "<strong>有新动态，</strong>点此刷新查看";
					_tipsTop.title = "有新动态，点此刷新查看";
					_tipsTop.onclick = function(){
						var ahref = window.location.href;
						scope.feedView('0','0',1,1);
						_container.removeAttribute("tipsshow");
						ahref = ahref.replace(/#attentionfeed/ig, "");
						window.location.href = ahref+"#attentionfeed";
					};
					_tipsBottom = _tipsTop.cloneNode(true);
					_tipsBottom.onclick = _tipsTop.onclick;
					_first = Core.Dom.getElementsByClass(_container, "div", "clearit");
					// if($E("popFeedRecomm_feedsBox_parent")){
					// 	Core.Dom.insertAfter(_tipsTop, $E("popFeedRecomm_feedsBox_parent"));
					// }
					var _centerHead = Core.Dom.byClz($E("feed_center_span"), "div", "center_head");
					if(_centerHead && _centerHead.length){
						_centerHead = _centerHead[0];
						_centerHead.parentNode.insertBefore(_tipsTop, _centerHead);
					}
					_container.appendChild(_tipsBottom);
					_container.setAttribute("tipsshow", true);
				}
				var _remindContainer = $E('remind_container');
				if(oData.remind && oData.remind.n == 1 && oData.remind.d != '' && _remindContainer){
					_remindContainer.innerHTML = oData.remind.d;
					_remindContainer.style.display='';
				}
				setTimeout(_args.callee, _timer);
			},
			onError		: function (oData) {
	//			showError(oData.code);
				setTimeout(_args.callee, _timer);
			},
			onFail		: function(){
	//			showError($SYSMSG.A00001);
				setTimeout(_args.callee, _timer);
			}
		});
	}else{
		setTimeout(_args.callee, _timer);
	}

};