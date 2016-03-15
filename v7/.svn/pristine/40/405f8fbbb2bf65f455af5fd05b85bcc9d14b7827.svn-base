if(!scope.yemodify) {
	scope.yemodify = {};
}
scope.yemodify.initBeiYunInf = function() {
    //备孕中的资料修改
    var bm = $E('BYStatesM');
    if (bm) {
        var byCon = '<p class="cbabystate cbabystate0">\
						<span class="cbabystate0"></span>\
							<a href="#" onclick="return false;" id="beiyunrenew">更改</a>\
						</p>\
						<p class="babyInfo_para">我的备孕时间是：\
							<select id="pregmonth">\
								<option value="1">1</option>\
								<option value="2">2</option>\
								<option value="3">3</option>\
								<option value="4">4</option>\
								<option value="5">5</option>\
								<option value="6">6</option>\
								<option value="12">12</option>\
							</select>\
						&nbsp;个月</p>\
						<p class="babyInfo_btn"><a class="SG_aBtn SG_aBtnB SG_aBtn14" onclick="return false" href="#"><cite id="baby_save">保存</cite></a>&nbsp;&nbsp;<a class="SG_aBtn SG_aBtnB SG_aBtn14" href="#" onclick="return false"><cite id="baby_cancel">取消</cite></a></p>';
        scope.yemodify.onmodify(bm, function(opt){
            new Interface(scope.yemodify.getDataURL, "jsload").request({
                GET: {
                    'uid': scope.$uid
					,'babystates' : 1
                    ,'version': 7
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
                    fillBYState(_data);
                },
                onFail: function(){
                    winDialog.alert("请求发送失败！请重试。", {
                        "icon": "02"
                    });
                }
            });
        });
		
		
		function fillBYState(data) {
			$E('BYStates_show').style.display = 'none';
			$E('BYStates_modify').innerHTML = byCon;
			if(data) {
				$E('pregmonth').value = data[0].pregmonth
			}
			scope.yemodify.initChnageIcon($E('beiyunrenew'));
			$E('BYStates_modify').style.display = '';

			$E('baby_cancel').onclick = function(){
				makeBYClear();
				scope.yemodify.rollBack();
                return false;
            };
            
            $E('baby_save').onclick = function(){
                var param = {
	                'uid': scope.$uid,
	                'data': Utils.Json.flatten({'pregmonth':$E('pregmonth').value}),
					'babystates' : 1,
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
						makeBYClear();
						scope.yemodify.commit();
	                    $E('BYStates_show').innerHTML = '<p class="cbabystate cbabystate0">\
						<span class="cbabystate0"></span></p>\
						<p class="babyInfo_para">我的备孕时间是：'+_data[0].pregmonth+'个月';
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
		
		function makeBYClear() {
			$E('BYStates_modify').style.display = 'none';
			$E('BYStates_modify').innerHTML = '';
			$E('BYStates_show').style.display = '';
			if (scope.babyEditorNode) {
                scope.babyEditorNode.style.display = '';
            }
        	$E('BYStates_show').style.display = '';
		}
    }
}