if(!scope.yemodify) {
	scope.yemodify = {};
}
scope.yemodify.initBabyInf = function() {
	//宝宝的资料修改
    var bb = $E('BBStatesM');
    var bba = $E('linkAddBasicInfoExt');
    if (bb || bba) {
		var baobaoHeadImg = '<p class="cbabystate cbabystate2"><span class="cbabystate2"></span><a href="#"  onclick="return false;" id="baobaorenew">更改</a></p>';
        var conHead = '<table class="personTable">\
                  <tbody>';
        var conBtn = '<tr>\
                      <td class="rolTd1 CP_txta"></td>\
                      <td class="rolTd2"><p class="personBtn"><span><a class="SG_aBtn SG_aBtnB SG_aBtn14" href="#" onclick="return false"><cite id="baby_save">保存</cite></a></span><span><a class="SG_aBtn SG_aBtnB SG_aBtn14" href="#" onclick="return false"><cite id="baby_cancel">取消</cite></a></span></p></td>\
                    </tr>';
        var conTail = '</tbody>\
                </table>';
        var conBlank = '<tr><td height="40">&nbsp;</td><td>&nbsp;</td></tr>';
        var conDelCon = '<a href="#" onclick="return false;" class="deleteBaby">[<cite id="deleteBaby#{babyConut}">删除</cite>]</a>';
        var addMoreBaby = '<tr>\
                      <td class="rolTd1 CP_txta"></td>\
                      <td class="rolTd2"><span class="SG_more babylink"><a href="#" onclick="return false;" id="addOneMoreBaby">再填写一个宝宝信息</a>>></span></td>\
                    </tr>';
        var showCon = '<tr>\
						  <td class="rolTd1 CP_txta rolSele">宝宝姓名：</td>\
						  <td class="rolTd2 rolSele">#{nickname}</td>\
						</tr>\
						<tr>\
						  <td class="rolTd1 CP_txta rolSele">性&nbsp;&nbsp;&nbsp;别：</td>\
						  <td class="rolTd2 rolSele">#{babysex}</tr>\
						<tr>\
						  <td class="rolTd1 CP_txta rolSele">生&nbsp;&nbsp;&nbsp;日：</td>\
						  <td class="rolTd2 rolSele">#{birthyear}年#{birthmonth}月#{birthday}日&nbsp;&nbsp;#{star}&nbsp;&nbsp;#{animal}</td>\
						</tr>\
						<tr>\
						  <td class="rolTd1 CP_txta rolSele">身&nbsp;&nbsp;&nbsp;高：</td>\
						  <td class="rolTd2 rolSele"> #{bodyheight}cm</td>\
						</tr>\
						<tr>\
						  <td class="rolTd1 CP_txta rolSele">体&nbsp;&nbsp;&nbsp;重：</td>\
						  <td class="rolTd2 rolSele"> #{bodyweight}kg</td>\
						</tr>';
		var newACon = '<div class="babyTable" id="border#{babyConut}">\
						<table class="personTable">\
						  <tbody>\
							<tr>\
							  <td class="rolTd1 CP_txta rolSele">宝宝昵称：<input type="hidden" id="id#{babyConut}" value="0"></td>\
							  <td class="rolTd2 rolSele"><input type="text" class="personText" maxlength="20" id="babynick#{babyConut}" style="width: 140px;">\
							  <em class="sameBirth">长度为2-10个汉字（4-20个字符）；请使用中文/英文/数字/下划线。</em>\
							  <p class="errorAction addForm" style="display:none" id="babynickErr#{babyConut}"></p>\
							  </td>\
							</tr>\
							<tr>\
							  <td class="rolTd1 CP_txta rolSele">性&nbsp;&nbsp;&nbsp;别：</td>\
							  <td class="rolTd2 rolSele"><span class="tdP20"> <em class="personRadio">\
								<input type="radio" id="babyboy#{babyConut}" name="babysex#{babyConut}">\
								</em>\
								<label for="babyboy#{babyConut}">男</label>\
								<em class="personRadio">\
								<input type="radio" id="babygirl#{babyConut}" name="babysex#{babyConut}">\
								</em>\
								<label for="babygirl#{babyConut}">女</label>\
								</span>\
								<p class="errorAction addForm" style="display:none" id="babyGenderErr#{babyConut}">请选择性别</p>\
							  </td>\
							</tr>\
							<tr>\
							  <td class="rolTd1 CP_txta rolSele">生&nbsp;&nbsp;&nbsp;日：</td>\
							  <td class="rolTd2 rolSele"><em>\
								<select id="birthyear#{babyConut}" style="width:75px;">\
									<option value="0">请选择</option>\
								</select>\
								</em>&nbsp;&nbsp;年&nbsp;&nbsp;<em>\
								<select id="birthmonth#{babyConut}" style="width:75px;">\
									<option value="0">请选择</option>\
								</select>\
								</em>&nbsp;&nbsp;月&nbsp;&nbsp;<em>\
								<select id="birthday#{babyConut}" style="width:75px;">\
									<option value="0">请选择</option>\
								</select>\
								</em>&nbsp;&nbsp;日&nbsp;&nbsp;<em>\
								<select id="babyBirthShow#{babyConut}" style="width:128px;">\
								  <option value="0">显示完整年月日</option>\
								  <option value="1" selected>显示星座和生肖</option>\
								</select>\
								</em>\
									<p class="errorAction addForm" style="display:none" id="babyBirthErr#{babyConut}">请填写完整的宝宝生日</p>\
								</td>\
							</tr>\
							<tr>\
							  <td class="rolTd1 CP_txta rolSele">身&nbsp;&nbsp;&nbsp;高：</td>\
							  <td class="rolTd2 rolSele"><input type="text" id="bodyheight#{babyConut}" maxlength="5" class="personText" value="" style="width: 60px;"> cm\
							  <p class="errorAction addForm" style="display:none" id="babyHeightErr#{babyConut}">请填写合法的宝宝身高，必须是数字。</p>\
							  </td>\
							</tr>\
							<tr>\
							  <td class="rolTd1 CP_txta rolSele">体&nbsp;&nbsp;&nbsp;重：</td>\
							  <td class="rolTd2 rolSele"><input type="text" id="bodyweight#{babyConut}" maxlength="5" class="personText" value="" style="width: 60px;"> kg\
							  <p class="errorAction addForm" style="display:none" id="babyWeightErr#{babyConut}">请填写合法的宝宝体重，必须是数字。</p>\
							  </td>\
							</tr>\
							#{oneMoreBaby}\
						  </tbody>\
						</table>\
						#{delButton}\
					</div>';
		var newSaveBtn = '<table class="personTable">\
						  <tbody>\
							<tr>\
							  <td class="rolTd1 CP_txta"></td>\
							  <td class="rolTd2"><p class="personBtn"><span><a class="SG_aBtn SG_aBtnB SG_aBtn14" href="#" onclick="return false"><cite id="baby_save">保存</cite></a></span><span><a class="SG_aBtn SG_aBtnB SG_aBtn14" href="#" onclick="return false"><cite id="baby_cancel">取消</cite></a></span></p></td>\
							</tr>\
						  </tbody>\
						</table>';
        
        var currentAddNum = 2;
        
        var swapDatas = [];
        function bbTmpSaveData(){
            function getData(o, ns){
                for (var id in ns) {
                    var el = $E(id);
                    if (el && el.value) {
                        o[ns[id]] = el.value;
                    }
                }
            }
            
            for (var i = 0; i <= currentAddNum; i++) {
                var obj = {};
                var p = {};
                p['babynick' + i] = 'babynick';
                p['birthyear' + i] = 'birthyear';
                p['birthmonth' + i] = 'birthmonth';
                p['birthday' + i] = 'birthday';
                p['babyBirthShow' + i] = 'babyBirthShow';
                p['bodyheight' + i] = 'bodyheight';
                p['bodyweight' + i] = 'bodyweight';
				p['id' + i] = 'id';
                getData(obj, p);
                if ($E('babyboy' + i) && $E('babygirl' + i)) {
                    if ($E('babyboy' + i).checked) {
                        obj.sex = 'babyboy';
                    }
                    else 
                        if ($E('babygirl' + i).checked) {
                            obj.sex = 'babygirl';
                        }
                }
                swapDatas[i] = obj;
            }
        }
        
        
        function bbTmpFillData(){
            function putData(val, id){
                if (val) {
                    var el = $E(id);
                    if (el) {
                        el.value = val;
                    }
                }
            }
            for (var i = 0; swapDatas[i]; i++) {
                var obj = swapDatas[i];
                putData(obj.babynick, 'babynick' + i);
                putData(obj.birthyear, 'birthyear' + i);
                putData(obj.birthmonth, 'birthmonth' + i);
                //putData(obj.birthday, 'birthday' + i);
                putData(obj.babyBirthShow, 'babyBirthShow' + i);
                putData(obj.bodyheight, 'bodyheight' + i);
                putData(obj.bodyweight, 'bodyweight' + i);
				putData(obj.id, 'id' + i);
                if (obj.sex) {
                    var el = $E(obj.sex + i);
                    if (el) {
                        el.checked = true;
                    }
                }
				if($E('birthyear' + i)) {
					scope.yemodify.selecter($E('birthyear' + i), $E('birthmonth' + i), $E('birthday' + i),obj.birthday);
				}
            }
        }
        
        /* 数据格式定义
         * var xbv = [{
         nickname: 'abc',
         babysex: 'male',
         birthday: '15',
         birthmonth: '6',
         birthyear: '2005',
         bodyheight: '1.5',
         bodyweight: '2.5',
         display: 1,
		 id : '对应的ID'
         }];
         */
        if (bb) {
            scope.yemodify.onmodify(bb, function(opt){
                //去请求数据，情况有3种:1.新增。2.有一个宝宝，里面有数据。3.有两个宝宝
                new Interface(scope.yemodify.getDataURL, "jsload").request({
                    GET: {
                        'uid': scope.$uid
						,'babystates' : 3
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
                        if (_data) {
                            scope.babyCurrentNum = _data.length;
                            fillBBState({
                                data: _data
                            });
                        }
                        else {
                            scope.babyCurrentNum = 1;
                            fillBBState();
                        }
                    },
                    onFail: function(){
                        winDialog.alert("请求发送失败！请重试。", {
                            "icon": "02"
                        });
                    }
                });
            });
        }
        
        if (bba) {
            scope.yemodify.addEvent(bba, function(){
                scope.babyEditorNode = bb.parentNode;
                scope.babyEditorNode.style.display = 'none';
                $E('BBStates_show').style.display = 'none';
                scope.babyCurrentNum = 1;
                fillBBState();
            }, 'click');
        }
        
        function fillBBState(opt){
            $E('BBStates_show').style.display = 'none';
            //这里改成动态的输出
            $E('BBStates_modify').innerHTML = getBBCon(scope.babyCurrentNum);
            scope.yemodify.initChnageIcon($E('baobaorenew'));
            for (var i = 0; i < scope.babyCurrentNum; i++) {
                init(i);
            }
            
            if (opt && opt.data) {
                //需要初始化数据
                fillBBData(opt.data);
            } else {
				scope.yemodify.selecter($E('birthyear0'), $E('birthmonth0'), $E('birthday0'));
			}
            
            $E('BBStates_modify').style.display = '';
            
            if ($E('addOneMoreBaby')) {
                $E('addOneMoreBaby').onclick = function(){
                    bbTmpSaveData();
                    scope.babyCurrentNum = parseInt(scope.babyCurrentNum) + 1;
                    fillBBState();
                    bbTmpFillData();
                    return false;
                }
            }
            
            //这里绑定多个事件
            var i = 0;
            while ($E('deleteBaby' + i)) {
                var ele = $E('deleteBaby' + i);
                ele.onclick = (function(num){
                    return function(){
						var val = $E('id'+num);
						if(val && (parseInt(val.value) != 0)) {
							if(!scope.babyDeleteIds) {
								scope.babyDeleteIds = [];
							}
							scope.babyDeleteIds.push(val.value);
						}
                        bbTmpSaveData();
                        swapDatas.splice(num, 1);
                        scope.babyCurrentNum = parseInt(scope.babyCurrentNum) - 1;
                        fillBBState();
                        bbTmpFillData();
                        return false;
                    }
                })(i);
				ele.onmouseover = (function(num){
                    return function(){
						$E('border'+num).className = 'babyTable borderc';
                    }
                })(i);
				ele.onmouseout = (function(num){
                    return function(){
						$E('border'+num).className = 'babyTable';
                    }
                })(i);
                i += 1;
            }
            
            $E('baby_cancel').onclick = function(){
                makeItClean();
				scope.yemodify.rollBack();
                return false;
            };
            
            $E('baby_save').onclick = function(){
                for (var i = 0; i < scope.babyCurrentNum; i++) {
                    if (!validate(i)) {
                        return false;
                    }
                }
				if(scope.bbIsSubmiting) {
					return false;
				}
				scope.bbIsSubmiting = true;
                whenSubmit(scope.babyCurrentNum);
                return false;
            };
        }
        
        /**
         * 生成编辑模式下宝宝的资料信息填写
         * @param {Numner} num 要生成有几个宝宝
         * @return {String} 生成的HTML代码
         */
        function getBBCon(num){
            var strs = [];
			strs.push(baobaoHeadImg);
            var del = num == 1 ? '' : conDelCon;
            var tmpACont = (new Ui.Template(newACon)).evaluate({
                'delButton': del,
                'babyConut': '#{babyConut}',
				'oneMoreBaby' : '#{oneMoreBaby}'
            });
            for (var i = 0; i < num; i++) {
                var template = (new Ui.Template(tmpACont).evaluate({
                    'babyConut': (i + ''),
					'oneMoreBaby' : ((i == (num-1)) && (i < (currentAddNum - 1))) ? addMoreBaby : ''
                }));
                strs.push(template);
            }
            strs = strs.join('');
			return (strs + newSaveBtn);
        }
        
        /**
         * 生成显示模式下宝宝的资料信息填写
         * @param {Array} data 宝宝数据
         * @return {String} 生成的HTML代码
         */
        function getBBConInShow(data){
            var strs = [];
            for (var i = 0; data[i]; i++) {
                if (!data[i].star) {
                    data[i].star = '';
                }
                if (!data[i].animal) {
                    data[i].animal = '';
                }
				data[i].babysex = data[i].babysex == 'female' ? '女' : '男';
                strs.push(new Ui.Template(showCon).evaluate(data[i]));
            }
            return '<p class="cbabystate cbabystate2"><span class="cbabystate2"></span></p>' + (conHead + strs.join(conBlank) + conTail);
        }
        
        function fillBBData(data){
            for (var i = 0; data[i]; i++) {
                var baby = data[i];
                $E('babynick' + i).value = baby.nickname;
                if (baby.babysex == 'male') {
                    $E('babyboy' + i).checked = true;
                }
                else 
                    if (baby.babysex == 'female') {
                        $E('babygirl' + i).checked = true;
                    }
                $E('birthyear' + i).value = baby.birthyear;
                $E('birthmonth' + i).value = baby.birthmonth;
				scope.yemodify.selecter($E('birthyear' + i), $E('birthmonth' + i), $E('birthday' + i),baby.birthday);
                $E('babyBirthShow' + i).value = baby.display;
                $E('bodyheight' + i).value = baby.bodyheight;
                $E('bodyweight' + i).value = baby.bodyweight;
				$E('id' + i).value = baby.id;
            }
        }
        
        function whenSubmit(num){
            bbTmpSaveData();
            swapDatas = swapDatas.splice(0, scope.babyCurrentNum);
			for(var i=0; swapDatas[i]; i++) {
				swapDatas[i]['babysex'] = swapDatas[i].sex == 'babygirl' ? 'female' : 'male';
			}
			var param = {
                'uid': scope.$uid,
                'data': Utils.Json.flatten(swapDatas),
				'babystates' : 3,
                'version': 7
            };
			if(scope.babyDeleteIds) {
				param['deleteid'] = encodeURIComponent(scope.babyDeleteIds.join(','));
			}
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
					scope.bbIsSubmiting = false;
                },
                onSuccess: function(_data){
                    $E('BBStates_show').innerHTML = getBBConInShow(_data);
                    makeItClean();
					scope.yemodify.commit();
					scope.bbIsSubmiting = false;
                },
                onFail: function(){
                    winDialog.alert("请求发送失败！请重试。", {
                        "icon": "02"
                    });
					scope.bbIsSubmiting = false;
                }
            });
        }
        
        function makeItClean(){
            if (scope.babyEditorNode) {
                scope.babyEditorNode.style.display = '';
            }
            $E('BBStates_modify').style.display = 'none';
            $E('BBStates_modify').innerHTML = '';
            //发请求完成以后
            $E('BBStates_show').style.display = '';
			if(scope.babyDeleteIds) {
				delete scope.babyDeleteIds;
			}
            scope.baby = {};
            swapDatas = [];
        }
        
        scope.baby = {};
        
        init = function(n){
            var birthYear = $E('birthyear' + n);
            var birthMonth = $E('birthmonth' + n);
            var birthDay = $E('birthday' + n);
            var babyNick = $E('babynick' + n);
            var babyBoy = $E('babyboy' + n);
            var babyGirl = $E('babygirl' + n);
            var babyHeight = $E('bodyheight' + n);
            var babyWeight = $E('bodyweight' + n);
            
            var babyNickErr = $E('babynickErr' + n);
            var babyGenderErr = $E('babyGenderErr' + n);
            var babyBirthErr = $E('babyBirthErr' + n);
            var babyHeightErr = $E('babyHeightErr' + n);
            var babyWeightErr = $E('babyWeightErr' + n);
            
            scope.yemodify.selectAppender.initialize(birthYear, scope.yemodify.nowYear, scope.yemodify.nowYear - 16);
            scope.yemodify.selectAppender.initialize(birthMonth, 1, 12);
			scope.yemodify.selectAppender.initialize(birthDay, 1, 31);
            
            /* 宝宝昵称验证*/
            babyNick.onblur = function(){
                if (babyNick.value == "") {
                    scope.baby.incomplete = true;
                    babyNickErr.style.display = "";
                    babyNickErr.innerHTML = "请填写宝宝昵称";
                }
                else 
                    if ((Core.String.byteLength(babyNick.value) < 4 || Core.String.byteLength(babyNick.value) >20) && babyNick.value != "") {
                        babyNickErr.style.display = "";
                        babyNickErr.innerHTML = "宝宝昵称长度为2-10个汉字（4-20个字符）";
                        scope.baby.incomplete = true;
                    }
                    else 
                        if (babyNick.value.match(/[^\w\u4E00-\u9FA5]/)) {
                            babyNickErr.style.display = "";
                            babyNickErr.innerHTML = "宝宝昵称只允许使用中文、英文、数字、下划线。 ";
                            scope.baby.incomplete = true;
                        }
            };
            
            babyNick.onfocus = function(){
                babyNickErr.innerHTML = "";
				babyNickErr.style.display = "none";
            };
            
            /*身高体重限制输入 */
            function number(evt) {
				evt=evt||event;
				var elem = evt.srcElement || evt.target,
				value = elem.value;
				elem.value = value.replace(/^0/, '');
				
				//小数点 前只能有3位数
				//小数点 后只能有1位数
				if (parseFloat(value) != value || /\.\d{2,}/.test(value) || parseFloat(value)>=1000) {
						elem.value = value.slice(0, -1);
						elem.value = elem.value.replace(/[^\d.]/g,'');
				}
			}
			
			function addItEvent(elem,num,errorEle) {
				/*针对通过ctrl+v 等操作数据验证*/
				elem.maxLength=5;
				elem.onblur = function() {
					var _this=this;
					if(/^\s+|\s+$/.test(this.value)){
						this.value=this.value.replace( /^\s+|\s+$/g, "" );
					}
					var elemv=this.value;
					if (elemv == "") {
						scope.baby.incomplete = true;
						errorEle.style.display = "";
					}else if(elemv.match(/[^\d.]/) || elemv.match(/\..*\./) || elemv.match(/^\.|\.$/) || elemv.match(/^0\d/)){
						errorEle.style.display = "";
						scope.baby.incomplete = true;
						Core.Events.addEvent(this,function(){
							Core.Events.removeEvent(_this,arguments.callee,'focus');
							_this.value="";
							scope.baby.incomplete = null;
						},'focus');
					}else if( this.id.indexOf('bodyweight') != -1 && (elemv < 2||elemv >= 1000) || this.id.indexOf('bodyheight') != -1 && (elemv < 40|| elemv>= 1000 )){
						errorEle.style.display = "";
						scope.baby.incomplete = true;
						Core.Events.addEvent(this,function(){
							Core.Events.removeEvent(_this,arguments.callee,'focus');
							_this.value="";
							scope.baby.incomplete = null;
						},'focus');
					
				    }
					if(errorEle.style.display) {
						elem.value = elem.value.replace(/(\.\d)\d+/,"$1");
					}
				};
				
				elem.onfocus = function() {
					errorEle.style.display = "none";
					scope.baby.incomplete = null;
				};
			}
			
			addItEvent($E('bodyweight' + n),n,$E('babyWeightErr'+n));
			addItEvent($E('bodyheight' + n),n,$E('babyHeightErr'+n));
        }
        
        /*显示 隐藏提示信息函数*/
        function tip(err){
            scope.baby.incomplete = true;
            err.style.display = "";
            Core.Array.foreach([].slice.call(arguments, 1), function(elem){
                elem.onfocus = function(){
                    err.style.display = "none";
                }
            })
        }
        
        var validate = function(n){
            var birthYear = $E('birthyear' + n);
            var birthMonth = $E('birthmonth' + n);
            var birthDay = $E('birthday' + n);
            var babyNick = $E('babynick' + n);
            var babyBoy = $E('babyboy' + n);
            var babyGirl = $E('babygirl' + n);
            var babyHeight = $E('bodyheight' + n);
            var babyWeight = $E('bodyweight' + n);
            
            var babyNickErr = $E('babynickErr' + n);
            var babyGenderErr = $E('babyGenderErr' + n);
            var babyBirthErr = $E('babyBirthErr' + n);
            var babyHeightErr = $E('babyHeightErr' + n);
            var babyWeightErr = $E('babyWeightErr' + n);
            
			babyNick.focus();
			babyNick.blur();
			babyHeight.focus();
			babyHeight.blur();
			babyWeight.focus();
			babyWeight.blur();

            if (babyNick.value == "") {
                scope.baby.incomplete = true;
                babyNickErr.style.display = "";
                babyNickErr.innerHTML = "请填写宝宝昵称";
                return false;
            }
			if(babyNickErr.style.display == "") {
				return false;
			}
			if(babyGenderErr.style.display == "") {
				return false;
			}
			if(babyBirthErr.style.display == "") {
				return false;
			}
			if(babyHeightErr.style.display == "") {
				return false;
			}
			if(babyWeightErr.style.display == "") {
				return false;
			}
            if (!babyBoy.checked && !babyGirl.checked) {
                tip(babyGenderErr, babyGirl, babyBoy);
                return false;
            }
            if (birthYear.value == 0 || birthMonth.value == 0 || birthDay.value == 0) {
                tip(babyBirthErr, birthYear, birthMonth, birthDay);
                return false;
            }
            if (babyHeight.value == "") {
                tip(babyHeightErr, babyHeight);
                return false;
            }
            if (babyWeight.value == "") {
                tip(babyWeightErr, babyWeight);
                return false;
            }
            return true;
        }
    }
}