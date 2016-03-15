/** 
 * @fileoverview 顶踩功能
 * @author zhihan | zhihan@sina.staff.com.cn
 */
$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/dom/insertAfter.js");
$import("lib/lib.js");
$import("lib/listener.js");

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
	
	var aid = scope.$articleid;
	
	function newGetNum() {
		var num = 0;
		var timmer = setInterval(function() {
			//trace('探测可以通过别的接口进行:'+num);
			if(scope.useNewInterfaceToGetNum) {
				trace('通过别的借口进行装载');

				scope.useNewInterfaceToGetNum.onSuccess = function(data) {
					scope.useNewInterfaceToGetNum = null;
					diggerCallBack(data);
				}
				scope.useNewInterfaceToGetNum.onError = function(data) {
					scope.useNewInterfaceToGetNum = null;
					diggerCallBack(null);
				}
				scope.useNewInterfaceToGetNum.onFail = function(data) {
					scope.useNewInterfaceToGetNum = null;
					diggerCallBack(null);
				}
				trace('装载完毕');
				clearInterval(timmer);
			}
			
		},50);
	}
	
	newGetNum();

	function setLikedStatusTjTech(_opt){
		_opt.ele.parentNode.className = "SG_aBtn SG_aBtn_ico SG_turn SG_click";
        _opt.ele.children[1].innerHTML = "已喜欢";
	}
    function setLikedStatus(_opt){
        var states;
        if ("articletj" !== scope.$pageid){
            _opt.ele.className = 'upBox upBox_dis';
            _opt.ele.style.cursor = 'default';
            states = _opt.ele.getElementsByTagName('p')[1];
            
            var cons = states.innerHTML;
            var div = SinaEx.createNode("<div>"+cons+"</div>");
            var firstP = SinaEx.findNode(div,"nextSibling","firstChild");
            div.removeChild(firstP);
            var con = div.innerHTML;
            
            if(con === '顶'){
                states.innerHTML = '<img width="15" height="15" align="absmiddle" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon34">已顶';
            }else{
                states.innerHTML = '已喜欢';
            }
        }else {
            var spanEls = _opt.ele.getElementsByTagName('span');
            states = spanEls[0];
            var likeBtn = states.parentNode;
            var likeDiv = likeBtn.parentNode.parentNode;
            likeDiv.className = 'upBox upBox_dis';
            states.style.cursor = 'default';
            likeBtn.style.cursor = 'default';
            spanEls[1].style.cursor = 'default';
            spanEls[2].style.cursor = 'default';
            states.innerHTML = '已喜欢';

        }
    }


    function setHoverLikeStatus(_opt){
        if ("articletj" !== scope.$pageid){
            _opt.ele.className = 'upBox upBox_click';
            _opt.ele.getElementsByTagName('p')[0].innerHTML = '+1';
        } else {
            var spanEls = _opt.ele.getElementsByTagName('span');
            states = spanEls[0];
            var likeBtn = states.parentNode;
            var likeDiv = likeBtn.parentNode.parentNode;
            likeDiv.className = 'upBox upBox_click';
            states.innerHTML = '<span class="up1">+1</span>喜欢';
        }
    }

    function setLikeStatus(_opt){
        if ("articletj" !== scope.$pageid){
            _opt.ele.className = 'upBox';
            var ele = _opt.ele.getElementsByTagName('p')[0];
            ele.innerHTML = ele.getAttribute('mnum');
        } else {
            var spanEls = _opt.ele.getElementsByTagName('span');
            states = spanEls[0];
            var likeBtn = states.parentNode;
            var likeDiv = likeBtn.parentNode.parentNode;
            likeDiv.className = 'upBox';
            states.innerHTML = '<img class="SG_icon SG_icon34" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" title="推荐" align="absmiddle">喜欢';
        }
    }
	
	function diggerCallBack(data) {
			
		var tjTechFlag = scope.$pageid === "articletjTech"
		var mNum = data ? data['digg_m_'+aid] : 0;
		var countEle = $E('dbox2_'+aid);
		
		if(!countEle) {
			trace('没有找到计数模块，认为这是不需要顶踩功能的');
			return;
		}
		if(mNum) {
			countEle.innerHTML = mNum;
		} else {
			countEle.innerHTML = '0';
		}
		var res_id = aid;
		countEle.setAttribute('mnum',mNum);
		//$E('d1_digg_count_'+res_id).innerHTML = '(' + mNum + ')';
		var parent = countEle.parentNode;
		parent.style.cursor = 'pointer';

		scope.digger.bindEvent({
			//要改变class的ele
			'ele' : parent
			//要绑定事件的ele
			//,'targetEle' : parent.getElementsByTagName('p')[1]
			,'targetEle' : parent
			,'ti_title' : encodeURIComponent(countEle.getAttribute('ti_title') || '')
			,'disClass' : 'upBox upBox_dis'
			,'res_id' : res_id
			,'uid' : scope.$uid
			,'res_type' : '1'
			,'whenFind' : function(_opt) {
				if(tjTechFlag){
					setLikedStatusTjTech(_opt);
				}else{
					setLikedStatus(_opt);
				}
                
			}
			,'events' : {
				'mouseover' : function(_opt) {
					return function() {
						if(!tjTechFlag){
							setHoverLikeStatus(_opt);
						}
                        
					}
				}
				,'mouseout' : function(_opt) {
					return function() {
						if(!tjTechFlag){
                        	setLikeStatus(_opt);
                    	}
					}
				}
				,'click' : function(_opt) {
					return function() {
						scope.digger.diggerPost({
							'params' : {
								'res_id' : _opt.res_id
								,'res_uid' : _opt.res_uid || scope.$uid
								,'action' : '0'
								,'res_type' : '1'
								,'ti_title' : _opt.ti_title
							}
							,'res_id' : _opt.res_id
							,'res_uid' : _opt.res_uid || scope.$uid
							,'action' : '0'
							,'res_type' : '1'
							,'onSuccess' : function(data) {
								_opt.targetEle.onmouseover = function(){}
								_opt.targetEle.onmouseout = function(){}
								_opt.targetEle.onclick = function(){}
                                if(tjTechFlag){
									setLikedStatusTjTech(_opt);
								}else{
									setLikedStatus(_opt);
								}
                            	var ele = $E('dbox2_'+_opt.res_id);
								var curr = parseInt(ele.getAttribute('mnum'))+1;
								ele.innerHTML = curr;
								//喜欢操作成功后，通知消息article_like_success
                                Lib.Listener.notify("article_like_success");
							}
							,'onError' : function(data) {
								if(data.code == 'B00801') {
									winDialog.alert("这篇博文您已经喜欢过啦!", {
										icon: "01"
									});
									_opt.targetEle.onmouseover = function(){};
									_opt.targetEle.onmouseout = function(){};
									_opt.targetEle.onclick = function(){};
									if(tjTechFlag){
										setLikedStatusTjTech(_opt);
									}else{
										setLikedStatus(_opt);
									}
									scope.digger.setData(_opt.res_id, scope.$uid, 1);
									var ele = $E('dbox2_'+_opt.res_id);
									var curr = ele.getAttribute('mnum');
									ele.innerHTML = curr;		
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
		
		var ele = $E('d1_digg_'+aid);
		if(!ele) {
			return;
		}
		$E('d1_digg_'+aid).onclick = (function(tar){
			return function(e) {
				scope.digger.showLast10(tar);
				return false;
			}
		})({
			'ele':$E('d1_digg_down_'+aid)
			,'res_id' : aid
			,'res_uid' : scope.$uid
		});
		$E('d1_digg_down_'+aid).onclick = (function(tar){
			return function(e) {
				scope.digger.showLast10(tar);
				return false;
			}
		})({
			'ele':$E('d1_digg_down_'+aid)
			,'res_id' : aid
			,'res_uid' : scope.$uid
		});
	}
});
