if(!scope.yemodify) {
	scope.yemodify = {};
}
scope.yemodify.initZhunMaInf = function(){
	//准妈妈的资料修改
	var zm = $E('ZMStatesM');
	if(zm) {
		var zmCon = '<p class="cbabystate cbabystate1"><span class="cbabystate1"></span><a onclick="return false;" id="zhunmarenew" href="#">更改</a></p>\
					<p class="babyInfo_para">我的预产期是：\
						<select id="stateYear">\
							<option value="0">请选择</option>\
						</select>&nbsp;年&nbsp;&nbsp;\
						<select id="stateMonth">\
							<option value="0">请选择</option>\
						</select>&nbsp;月&nbsp;&nbsp;\
						<select id="stateDay">\
							<option value="0">请选择</option>\
						</select>&nbsp;日\
					</p>\
					<p id="ZMError" style="display:none;padding-left:85px;" class="errorAction baby_err">请填写完整的预产期</p>\
					<p class="babyInfo_btn"><a class="SG_aBtn SG_aBtnB SG_aBtn14" onclick="return false" href="#"><cite id="baby_save">保存</cite></a>&nbsp;&nbsp;<a class="SG_aBtn SG_aBtnB SG_aBtn14" href="#" onclick="return false"><cite id="baby_cancel">取消</cite></a></p>';
//					<table class="personTable">\
//						  <tbody>\
//							<tr>\
//							  <td class="rolTd1 CP_txta"></td>\
//							  <td class="rolTd2"><p class="personBtn"><span><a class="SG_aBtn SG_aBtnB SG_aBtn14" href="#" onclick="return false"><cite id="baby_save">保存</cite></a></span><span><a class="SG_aBtn SG_aBtnB SG_aBtn14" href="#" onclick="return false"><cite id="baby_cancel">取消</cite></a></span></p></td>\
//							</tr>\
//						  </tbody>\
//						</table>';
					
		scope.yemodify.onmodify(zm, function(opt){
            new Interface(scope.yemodify.getDataURL, "jsload").request({
                GET: {
                    'uid': scope.$uid,
					'babystates' : 2,
                    'version': 7
                },
                onError: function(_data){
					if(_data.code == 'A00003') {
						winDialog.alert( "非法操作", {
							icon:"02",
							funcOk : function(){
								window.location.reload();
							}
						});
						return;
					}
                    showError(_data.code);
                },
                onSuccess: function(_data){
                    opt.img.parentNode.removeChild(opt.img);
                    scope.babyEditorNode = opt.ele.parentNode;
                    fillZMState(_data);
                },
                onFail: function(){
                    winDialog.alert("请求发送失败！请重试。", {
                        "icon": "02"
                    });
                }
            });
        });
		
		function fillZMState(data) {
			$E('ZMStates_show').style.display = 'none';
			$E('ZMStates_modify').innerHTML = zmCon;
			scope.yemodify.initChnageIcon($E('zhunmarenew'));
			//初始化数据
			scope.yemodify.selectAppender.initialize($E('stateYear'), scope.yemodify.nowYear, scope.yemodify.nowMonth > 1 ? (parseInt(scope.yemodify.nowYear) + 1) : scope.yemodify.nowYear);
            scope.yemodify.selectAppender.initialize($E('stateMonth'), 1, 12);
            scope.yemodify.selectAppender.initialize($E('stateDay'), 1, 31);
			function seeNone() {
				$E('ZMError').style.display = 'none';
			}
			$E('stateYear').onclick = seeNone;
			$E('stateMonth').onclick = seeNone;
			$E('stateDay').onclick = seeNone;
			if(data) {
				$E('stateYear').value = data[0].stateyear;
				$E('stateMonth').value = data[0].statemonth;
				scope.yemodify.selecter($E('stateYear'), $E('stateMonth'), $E('stateDay'),data[0].stateday);
			} else {
				scope.yemodify.selecter($E('stateYear'), $E('stateMonth'), $E('stateDay'));
			}
			$E('ZMStates_modify').style.display = '';
			
			$E('baby_cancel').onclick = function(){
				makeZMClear();
				scope.yemodify.rollBack();
                return false;
            };
            
            $E('baby_save').onclick = function(){
				var y = $E('stateYear').value;
				var m = $E('stateMonth').value;
				var d = $E('stateDay').value;
				if(!y || !m || (d == '0')) {
					$E('ZMError').style.display = '';
					return false;
				}
                var param = {
	                'uid': scope.$uid,
	                'data': Utils.Json.flatten({'stateyear':y,'statemonth':m,'stateday':d}),
					'babystates' : 2,
	                'version': 7
	            };
	            new Interface(scope.yemodify.modifyDataURL, "jsload").request({
	                GET: param,
	                onError: function(_data){
						if(_data.code == 'A00003') {
							winDialog.alert( "非法操作", {
								icon:"02",
								funcOk : function(){
									window.location.reload();
								}
							});
							return;
						}
	                    showError(_data.code);
	                },
	                onSuccess: function(_data){
						makeZMClear();
						scope.yemodify.commit();
	                    $E('ZMStates_show').innerHTML = '<p class="cbabystate cbabystate1"><span class="cbabystate1"></span></p><p class="babyInfo_para">我的预产期是：'+_data[0].stateyear+'&nbsp;年&nbsp;&nbsp;'+_data[0].statemonth+'&nbsp;月&nbsp;&nbsp;'+_data[0].stateday+'&nbsp;日';
	                },
	                onFail: function(){
	                    winDialog.alert("请求发送失败！请重试。", {
	                        "icon": "02"
	                    });
	                }
	            });
                return false;
            };
		}
		
		function makeZMClear() {
			$E('ZMStates_modify').style.display = 'none';
			$E('ZMStates_modify').innerHTML = '';
			$E('ZMStates_show').style.display = '';
			if (scope.babyEditorNode) {
                scope.babyEditorNode.style.display = '';
            }
        	$E('ZMStates_show').style.display = '';
		}
	}
}