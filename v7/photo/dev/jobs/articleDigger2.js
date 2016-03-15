/** 
 * @fileoverview 专辑顶踩功能
 * @author zhihan | zhihan@sina.staff.com.cn
 */
$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/dom/insertAfter.js");
$import("lib/lib.js");

$import("lib/showError.js");
$import("sina/utils/flash/swfObject.js");
$import("sina/core/math/getUniqueId.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/dom/opacity.js");
$import("other/SinaEx.js");

$registJob('articleDigger',function(){
	if(!$E('diggerFla')) {
		//确定是老页面
		return;
	}
	
	if(!$_GLOBAL.diggerOpenFlag) {
		//不启用
		return;
	}
	
	if(!$E('digger_num')) {
		trace('应该是私密专辑');
		return;
	}
	
	function getTitle() {
		return $E('ding_title').innerHTML;
	}
	
	var currType = 2;
	var aid = ctg_id;
	scope.digger.diggerNums({
		'params' : {
			'res_id' : 'photospec_' + aid
			,'res_uid' : scope.$uid
		}
		,'res_id' : aid
		,'res_uid' : scope.$uid
		,'onSuccess' : function(data) {
			diggerCallBack(data);
		}
		,'onError' : function(data) {
			diggerCallBack(null);
		}
		,'onFail' : function(data) {
			diggerCallBack(null);
		}
	});
	
	function diggerCallBack(data) {
		var mNum = data ? data['digg_m_photospec_'+aid] : 0;
		var countEle = $E('digger_num');
		if(mNum) {
			countEle.innerHTML = '('+mNum+')';
		} else {
			countEle.innerHTML = '(0)';
		}
		countEle.setAttribute('mnum',mNum);
		var diggerBtn = $E('digger_btn');
		var wrapper = SinaEx.firstChild(diggerBtn);
		var spanNum = wrapper.getElementsByTagName('span')[1];
		spanNum.innerHTML = mNum;
		spanNum.setAttribute("num",mNum);


		scope.digger.bindEvent({
			//要改变class的ele
			'ele' : wrapper
			//要绑定事件的ele
			,'targetEle' : wrapper
			,'disClass' : 'SG_aBtn SG_aBtn_ico SG_aBtn_dis'
			,'res_id' : aid
			,'uid' : scope.$uid
			,'res_type' : currType
			,'whenFind' : function(_opt) {
				_opt.ele.className = 'user_love loveadd';
				_opt.ele.style.cursor = 'pointer'; 
				var spanLike = _opt.ele.getElementsByTagName('span')[0];
				spanLike.className = "lovebg lovegary";
				spanLike.innerHTML = "已喜欢";
			}
			,'events' : {
				'mouseover' : function(_opt) {
					return function() {
						_opt.ele.style.cursor = 'pointer'; 
						_opt.ele.className = 'user_love';
						var likeState = _opt.ele.getElementsByTagName('span')[0];
						likeState.innerHTML = '喜欢';
						likeState.className = "lovebg loveadd";
						
						var likeNum = _opt.ele.getElementsByTagName('span')[1];
						likeNum.innerHTML = "+1";
					}
				}
				,'mouseout' : function(_opt) {
					return function() {
						_opt.ele.className = 'user_love';
						_opt.ele.getElementsByTagName('span')[0].innerHTML = "喜欢";
						
						var ele = _opt.ele.getElementsByTagName('span')[1];
						ele.innerHTML = parseInt(ele.getAttribute('num'));
					}
				}
				,'click' : function(_opt) {
					return function() {
						scope.digger.diggerPost({
							params : {
								'photospec_url' : $pic_url
								,'res_id' : 'photospec_' + _opt.res_id
								,'res_uid' : _opt.res_uid || scope.$uid
								,'action' : '0'
								,'res_type' : currType
								,'ti_title' : encodeURIComponent(getTitle()||'')
							}
							,'res_id' : _opt.res_id
							,'res_uid' : _opt.res_uid || scope.$uid
							,'action' : '0'
							,'res_type' : currType
							,'onSuccess' : function(data) {
								_opt.targetEle.onmouseover = function(){}
								_opt.targetEle.onmouseout = function(){}
								_opt.targetEle.onclick = function(){}
								_opt.ele.className = 'user_love loveadd';

								
								var states = _opt.ele.getElementsByTagName('span')[0];
								states.innerHTML = "已喜欢";
								states.className = "lovebg lovegary";
								var num = _opt.ele.getElementsByTagName('span')[1];
								var ele = $E('digger_num');
								var curr = parseInt(ele.getAttribute('mnum'))+1;
								ele.innerHTML = '('+curr+')';
								num.innerHTML = curr;
							}
							,'onError' : function(data) {
								if(data.code == 'B00801') {
									winDialog.alert("这张专辑您已经喜欢过啦!", {
										icon: "01"
									});
									_opt.targetEle.onmouseover = function(){}
									_opt.targetEle.onmouseout = function(){}
									_opt.targetEle.onclick = function(){}
									_opt.ele.className = 'user_love';
									
									var num = _opt.ele.getElementsByTagName('span')[1];
									var ele = $E('digger_num');
									var curr = parseInt(ele.getAttribute('mnum'));
									ele.innerHTML = '('+curr+')';
									num.innerHTML = curr;
								} else {
									showError(data.code);
								}
							}
						});
						return false;
					}
				}
			}
		});
		$E('digger_up').style.cursor = 'pointer';
		$E('digger_pic').onclick = (function(tar){
			return function(e) {
				scope.digger.showLast10(tar);
				return false;
			}
		})({
			'ele':$E('digger_up')
			,'res_id' : 'photospec_'+aid
			,'res_uid' : scope.$uid
		});
		$E('digger_up').onclick = (function(tar){
			return function(e) {
				scope.digger.showLast10(tar);
				return false;
			}
		})({
			'ele':$E('digger_up')
			,'res_id' : 'photospec_'+aid
			,'res_uid' : scope.$uid
		});
	}
});
