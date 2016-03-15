/**
 * 基本信息没有填写完整时调用
 * @author zhihan | zhihan@staff.sina.com.cn
 * @version 1.0
 * @history
 */
$import("sina/sina.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import('sina/core/events/fireEvent.js');

$import("lib/interface.js");
$import("lib/dialogConfig.js");

$import("msg/personal.js");
$import("product/personal/templates/basicInfoTemplate.js");
$import("product/personal/common.js");

$registJob("spIfNoBasicProfile", function () {
	var head = '<div class="peoplesearch_table">\
					<p class="SG_j_line1 txterr">请100%完成基础资料，填写后显示查询结果。 </p>\
					<div class="title"><strong>基本信息：</strong>&nbsp;&nbsp;&nbsp;&nbsp;<span class="txtb">已完成<span id="persent"></span></span></div>';
	var bit=[
				'<table class="personTable">',
					'<tbody>',
						'<tr>',
							'<td class="rolTd1 CP_txta rolSele">性&nbsp;&nbsp;&nbsp;别：</td>',
							'<td class="rolTd2rolSele">',
								'<span class="tdP20">',
									'<em class="personRadio"><input checked id="bis_man" name="basicInfoSex" value="1" type="radio" /></em><label for="bis_man">男</label>',
									'<em class="personRadio"><input id="bis_female" name="basicInfoSex" value="0" type="radio" /></em><label for="bis_female">女</label>',
								'</span>',
							'</td>',
						'</tr>',
						'<tr>',
							'<td class="rolTd1 CP_txta rolSele">生&nbsp;&nbsp;&nbsp;日：</td>',
							'<td class="rolTd2 rolSele">',
								'<span class="tdP20">',
									'<em>',
										'<select id="selBirthdayYear" style="width:66px;margin-right:6px;">',
											'<option value="0">年</option>',
										'</select>',
									'</em>',
									'<em>',
										'<select id="selBirthdayMonth" style="width:46px;margin-right:6px;">',
											'<option value="0">月</option>',
										'</select>',
									'</em>',
									'<em>',
										'<select id="selBirthdayDay" style="width:46px;margin-right:6px;">',
											'<option value="0">日</option>',
										'</select>',
									'</em>',
									'<em>',
										'<select id="selBirthdayDisplay" style="width:138px;margin-right:6px;">',
											'<option value="0">显示完整年月日</option>',
											'<option value="1">仅显示月份和日期</option>',
											'<option value="2">不显示我的生日</option>',
										'</select>',
									'</em>',
									'<em class="sameBirth"><a id="sameBirthday" href="javascript:;"></a></em>',
								'</span>',
								'<p id="msgBirthday" style="display:none;color:#CC0000;font-size:12px;" class="bLyTop"> 请选择完整年月日</p>',
								'<p id="msgSameBirthday" style="display:none;color:#CC0000;font-size:12px;" class="bLyTop"> 请选择完整出生日期，才能找到你的同生缘</p>',
							'</td>',
						'</tr>',
						'<tr>',
							'<td class="rolTd1 CP_txta rolSele">婚&nbsp;&nbsp;&nbsp;姻：</td>',
							'<td class="rolTd2 rolSele"><span class="tdP20">',
							'<em>',
								'<select id="selMarriage" style="width:82px;margin-right:6px;">',
									'<option value="0">请选择</option>',
									'<option value="1">单身中</option>',
									'<option value="2">恋爱中</option>',
									'<option value="3">小两口</option>',
									'<option value="4">家有儿女</option>',
								'</select>',
							'</em></span>',
							'<p id="yourMearr" style="display:none;color:#CC0000;font-size:12px;" class="bLyTop"> 请选择您的婚姻</p></td>',
							'</td>',
						'</tr>',
						'<tr>',
							'<td class="rolTd1 CP_txta rolSele">职&nbsp;&nbsp;&nbsp;业：</td>',
							'<td class="rolTd2 rolSele"><span class="tdP20">',
							'<em>',
								'<select id="selJob" style="width:207px;margin-right:6px;">',
									'<option value="0">请选择</option>',
									'<option value="1">学生</option>',
									'<option value="2">政府机关/干部</option>',
									'<option value="3">邮电通信</option>',
									'<option value="4">计算机</option>',
									'<option value="5">网络</option>',
									'<option value="6">商业/贸易</option>',
									'<option value="7">银行/金融/证券/保险/投资</option>',
									'<option value="8">税务</option>',
									'<option value="9">咨询</option>',
									'<option value="10">社会服务</option>',
									'<option value="11">旅游/饭店</option>',
									'<option value="12">健康/医疗服务</option>',
									'<option value="13">房地产</option>',
									'<option value="14">交通运输</option>',
									'<option value="15">法律/司法</option>',
									'<option value="16">文化/娱乐/体育</option>',
									'<option value="17">媒介/广告</option>',
									'<option value="18">科研/教育</option>',
									'<option value="19">农业/渔业/林业/畜牧业</option>',
									'<option value="20">矿业/制作业</option>',
									'<option value="21">自由职业</option>',
									'<option value="22">其他</option>',
								'</select>',
							'</em></span>',
							'<p id="msgNeedJob" style="display:none;color:#CC0000;font-size:12px;" class="bLyTop"> 请选择您的职业，才能启用同行搜索</p></td>',
							'</td>',
						'</tr>',
						'<tr>',
							'<td class="rolTd1 CP_txta rolSele">现居地：</td>',
							'<td class="rolTd2 rolSele"><span class="tdP20">',
							'<em>',
								'<select id="selProvince" style="width:105px;margin-right:6px;">',
									'<option></option>',
								'</select>',
							'</em>',
							'<em>',
								'<select id="selCity" style="width:105px;margin-right:6px;">',
									'<option></option>',
								'</select>',
							'</em>',
							'<em class="sameBirth"><a id="samePlace" href="javascript:;"></a></em>',
							'</span>',
							'<p id="msgPlace" style="display:none;color:#CC0000;font-size:12px;" class="bLyTop"> 请选择省内城市或直辖市区域</p>',
							'<p id="msgSamePlace" style="display:none;color:#CC0000;font-size:12px;" class="bLyTop"> 请选择完整现居地位置，才能启用邻居搜索</p></td>',
						'</tr>',
						'<tr>',
							'<td class="rolTd1 CP_txta rolSele">家&nbsp;&nbsp;&nbsp;乡：</td>',
							'<td class="rolTd2 rolSele"><span class="tdP20">',
							'<em>',
								'<select id="selHometownProvince" style="width:105px;margin-right:6px;">',
									'<option></option>',
								'</select>',
							'</em>',
							'<em>',
								'<select id="selHometownCity" style="width:105px;margin-right:6px;">',
									'<option></option>',
								'</select>',
							'</em>',
							'<em class="sameBirth"><a id="sameHometown" href="javascript:;"></a></em>',
							'</span>',
							'<p id="msgHometown" style="display:none;color:#CC0000;font-size:12px;" class="bLyTop"> 请选择省内城市或直辖市区域</p>',
							'<p id="msgSameHometown" style="display:none;color:#CC0000;font-size:12px;" class="bLyTop"> 请选择完整家乡位置，才能启用老乡搜索</p></td>',
						'</tr>',
						//'<tr>',
						//	'<td class="CP_txta" colspan="2"><br/><input id="basicInfoSearchMask" type="checkbox" checked="" value="" name=""/><label for="basicInfoSearchMask"> 在搜索中隐藏以上信息 </label></td>',
						//'</tr>',
						'<tr>',
							'<td class="rolTd1 CP_txta rolSele"></td>',
							'<td class="rolTd2 rolSele"><p class="personBtn"><span><a href="javascript:;" class="SG_aBtn SG_aBtnB SG_aBtn14"><cite id="btnBasicInfoSave">&nbsp;保存&nbsp;</cite></a></span><span><a href="javascript:;" class="SG_aBtn SG_aBtnB SG_aBtn14"><cite id="btnBasicInfoCancel">&nbsp;取消&nbsp;</cite></a></span></p></td>',
						'</tr>',
					'</tbody>',
				'</table>'
			];
	var templet = head+ bit.join('');
	
	scope.createNeedToDoFull = function(iData) {
		$E('peoplesearch_l').innerHTML = templet;
		
		$E('persent').innerHTML = iData.completeness_base + '%';
		initializeList();
		updateBasicInfoData(iData);
		initializeBasicInfo(iData["isHistory"]);
	}
	
	var provinceAndCity1,provinceAndCity2;
	var isSubmit=true;
	//初始化错误消息提示管理器
	var failedMsgMgr=new scope.personal.FailedMsgManager(["msgBirthday",
														  "msgSameBirthday",
														  "msgPlace",
														  "msgSamePlace",
														  "msgHometown",
														  "msgSameHometown",
														  "yourMearr",
														  "msgNeedJob"]);
	
	/*初始化下拉列表框的数据*/
	function initializeList(){
		var selectAppenderDesc = new scope.personal.SelectAppender(-1);
		var selectAppender = new scope.personal.SelectAppender();
		selectAppenderDesc.initialize($E("selBirthdayYear"), 2011, 1908);
		selectAppender.initialize($E("selBirthdayMonth"), 1, 12);
		selectAppender.initialize($E("selBirthdayDay"), 1, 31);
		
		provinceAndCity1 = new scope.personal.ProvinceAndCity($E("selProvince"), $E("selCity"), 0, 0);
		provinceAndCity2 = new scope.personal.ProvinceAndCity($E("selHometownProvince"), $E("selHometownCity"), 0, 0);
	}
	
	//验证生日的选择情况
	function verifyBirthday(){
		return $E("selBirthdayYear").selectedIndex!=0
		&& $E("selBirthdayMonth").selectedIndex!=0
		&& $E("selBirthdayDay").selectedIndex!=0;
	}
	
	/*初始化基本资料的编辑区域的操作*/
	function initializeBasicInfo(isHistory){
		var selBirthdayYear = $E("selBirthdayYear");
		var selBirthdayMonth = $E("selBirthdayMonth");
		var selBirthdayDay = $E("selBirthdayDay");
		var selBirthdayDisplay = $E("selBirthdayDisplay");
		
		//保存编辑
		Core.Events.addEvent($E("btnBasicInfoSave"), function(){
			if (isSubmit) {
				saveBasicInfoData();
				return false;
			}
		});
		//取消编辑
		Core.Events.addEvent($E("btnBasicInfoCancel"), function(){
			if (isSubmit) {
				Core.Events.fireEvent("base", 'click');
			}
		},"click");
		
		
		/*初始化生日年月日的数据*/
		Core.Events.addEvent(selBirthdayYear, function(){
			failedMsgMgr.hiddenFailed("msgBirthday");
			failedMsgMgr.hiddenFailed("msgSameBirthday");
		}, "change");
		Core.Events.addEvent(selBirthdayMonth, function(){
			failedMsgMgr.hiddenFailed("msgBirthday");
			failedMsgMgr.hiddenFailed("msgSameBirthday");
			
		}, "change");
		Core.Events.addEvent(selBirthdayDay, function(){
			failedMsgMgr.hiddenFailed("msgBirthday");
			failedMsgMgr.hiddenFailed("msgSameBirthday");
			
		}, "change");
		
		function showSameBirthdayFailedMsg(){
			if (!verifyBirthday()) {
				failedMsgMgr.hiddenFailed("msgBirthday");
				failedMsgMgr.showFailed("msgSameBirthday");
			}
			
		}
		
		/*现居地省市的二级联动*/
		var selProvince = $E("selProvince");
		var selCity = $E("selCity");
		
		Core.Events.addEvent(selProvince, function(){
			failedMsgMgr.hiddenFailed("msgPlace");
			failedMsgMgr.hiddenFailed("msgSamePlace");
			selCity.selectedIndex = 0;
			
		}, "change");
		Core.Events.addEvent(selCity, function(){
			failedMsgMgr.hiddenFailed("msgPlace");
			failedMsgMgr.hiddenFailed("msgSamePlace");
			
		}, "change");
		
		/*家乡省市的二级联动*/
		var selHometownProvince = $E("selHometownProvince");
		var selHometownCity = $E("selHometownCity");
		
		Core.Events.addEvent(selHometownProvince, function(){
			failedMsgMgr.hiddenFailed("msgHometown");
			failedMsgMgr.hiddenFailed("msgSameHometown");
			selHometownCity.selectedIndex = 0;
			
		}, "change");
		Core.Events.addEvent(selHometownCity, function(){
			failedMsgMgr.hiddenFailed("msgHometown");
			failedMsgMgr.hiddenFailed("msgSameHometown");
		}, "change");
		
		function showSameHometownFailedMsg(){
			if (!verifyProvinceAndCity(selHometownProvince, selHometownCity) || selHometownProvince.value == "0") {
				failedMsgMgr.hiddenFailed("msgHometown");
				failedMsgMgr.showFailed("msgSameHometown");
			}
		}
		
		if ($E("basicInfoRes")) {
			$E("basicInfoRes").style.display = "none";
		}
	}
	
	/*更新基本资料编辑区域内的数据*/
	function updateBasicInfoData(iData){
		//性别
		if(iData["sex"] && iData["sex"]!=""){
			if(parseInt(iData["sex"])==0){
				$N("basicInfoSex")[1].checked=true;
			}else{
				$N("basicInfoSex")[0].checked=true;
			}
		}
		
		//生日
		scope.personal.setSelectValue($E("selBirthdayYear"),iData["year"]);
		scope.personal.setSelectValue($E("selBirthdayMonth"),iData["month"]);
		scope.personal.selecter($E("selBirthdayYear"), $E("selBirthdayMonth"), $E("selBirthdayDay"));
		setTimeout(function(){
			scope.personal.setSelectValue($E("selBirthdayDay"),iData["day"]);
		},300);
		
		//显示完整年月日列表
		scope.personal.setSelectValue($E("selBirthdayDisplay"),iData["fullDate"]);
		
		//婚姻
		scope.personal.setSelectValue($E("selMarriage"),iData["marriage"]);
		
		//职业
		scope.personal.setSelectValue($E("selJob"),iData["job"]);
		
		//现居地
		scope.personal.setSelectValue($E("selProvince"),iData["place1"]);
		provinceAndCity1.provCode = provinceAndCity1.provDom.value;
		provinceAndCity1.loadCity();
		scope.personal.setSelectValue($E("selCity"),iData["place2"]);
		
		//家乡
		scope.personal.setSelectValue($E("selHometownProvince"),iData["hometown1"]);
		provinceAndCity2.provCode = provinceAndCity2.provDom.value;
		provinceAndCity2.loadCity();
		scope.personal.setSelectValue($E("selHometownCity"),iData["hometown2"]);
	}
	
	//验证省市二级联动下拉列表
	function verifyProvinceAndCity(p,c){
		return !(p.value!="0" && p.value!="1001" && c.selectedIndex==0);
	}
	
	/*保存基本资料的数据*/
	function saveBasicInfoData(){
		var verified=true;
		failedMsgMgr.clearAll();
		
		if (!verifyBirthday()) {
			failedMsgMgr.showFailed("msgBirthday");
			verified=false;	
		}
		
		if(!verifyProvinceAndCity($E("selProvince"),$E("selCity"))){
			failedMsgMgr.showFailed("msgPlace");
			verified=false;
		}
		
		if($E('selJob').value == '0') {
			failedMsgMgr.showFailed("msgNeedJob");
			verified=false;
		}
		
		if($E('selMarriage').value == '0') {
			failedMsgMgr.showFailed("yourMearr");
			verified=false;
		}
		
		if($E('selProvince').value == '0') {
			failedMsgMgr.showFailed("msgPlace");
			verified=false;
		} else {
			if($E('selProvince').value != '1001' && $E('msgSamePlace').value == '0') {
				failedMsgMgr.showFailed("msgSamePlace");
				verified=false;
			}
		}
		
		if($E('selHometownProvince').value == '0') {
			failedMsgMgr.showFailed("msgHometown");
			verified=false;
		} else {
			if($E('selHometownProvince').value != '1001' && $E('selHometownCity').value == '0') {
				failedMsgMgr.showFailed("msgSameHometown");
				verified=false;
			}
		}
		
		if (verified) {
			isSubmit=false;
			var data = {
				sex: scope.personal.getRBValueByName("basicInfoSex") || '',
				year: $E("selBirthdayYear").value,
				month: $E("selBirthdayMonth").value,
				day: $E("selBirthdayDay").value,
				fullDate: $E("selBirthdayDisplay").value,
				marriage: $E("selMarriage").value,
				job: $E("selJob").value,
				place1: $E("selProvince").value,
				place2: $E("selCity").value,
				hometown1: $E("selHometownProvince").value,
				hometown2: $E("selHometownCity").value
			};
			if(data.job != 0) {
				scope.$job = data.job;
			}
			if(data.place1 != 0) {
				if(data.place1 == '1001') {
					scope.$city = '1001'
				} else {
					if(data.place2 != 0) {
						scope.$city = data.place1 + come2(data.place2);
					}
				}
			}
			if(data.hometown1 != 0) {
				if(data.hometown1 == '1001') {
					scope.$bict = '1001'
				} else {
					if(data.hometown2 != 0) {
						scope.$bict = data.hometown1 + come2(data.hometown2);
					}
				}
			}
			submitData(scope.personal.jsonToString(data));
		}
	}
	
	function come2(val) {
		val += '';
		return val.length == 1 ? '0'+val : val;
	}
	
	function come1(i) {
		i += '';
		if(i.length == 2) {
			return i.charAt(0) == '0' ? i.charAt(1) : i;
		}
		return i;
	}
	
	function submitData(json){
		// Modified by L.Ming 接口地址变更 2009.11.26
//			(new Interface("http://icp.cws.api.sina.com.cn/profile/edit_base.php", "jsload")).request({
		(new Interface("http://control.blog.sina.com.cn/riaapi/profile/edit_base.php", "jsload")).request({
				GET : {
					uid:scope.$uid,
					data:json
					,version:7
				},
				onSuccess : function (iData) {
					$E('baseCompleteness').innerHTML = '已完成'+iData.percent;
					switch(scope.searchCurrentKey) {
						case 'bcit' : {
							var val = scope.$bict;
							if(val) {
								if(val == '1001') {
									$E('prov').value = '1001';
									$E('spcity').style.display = 'none';
									$E('spcity').disabled = true;
								} else {
									var id1 = val.substring(0,2);
									var id2 = come1(val.substring(2,4));
									$E('prov').value = id1;
									scope.loadCity($E('spcity'),id2);
								}
							}
							break;
						}
						case 'city' : {
							var val = scope.$city;
							if(val) {
								if(val == '1001') {
									$E('prov').value = '1001';
									$E('spcity').style.display = 'none';
									$E('spcity').disabled = true;
								} else {
									var id1 = val.substring(0,2);
									var id2 = come1(val.substring(2,4));
									$E('prov').value = id1;
									scope.loadCity($E('spcity'),id2);
								}
							}
							break;
						}
						case 'job' : {
							var val = scope.$job;
							if(val) {
								$E('spJob').value = val;
							}
							break;
						}
					}
					Core.Events.fireEvent("searchSubmit", 'click');
					isSubmit = true;
				},
				onError : function (iData) {
					isSubmit=true;
					winDialog.alert(
						$PERSONAL_MSG[iData.code],
						{ icon : "02" }
					);
				},
				onFail : function (iData){
					isSubmit=true;
				}
			});
	}
	
	if(scope.$is_open == '1' && scope.searchCurrentKey != 'base') {
		var initData = {"sex":"1","year":"0","month":"0","day":"0","fullDate":"0","marriage":null,"job":"0","place1":"0","place2":"0","hometown1":"0","hometown2":"0","isHistory":null,"nosearch":"0","completeness_base":0};
		scope.createNeedToDoFull(initData);
		scope.$is_open = '0';
	}
	
	if(scope.$full) {
		var initData = eval('('+scope.$full+')');
		scope.createNeedToDoFull(initData);
	}
});