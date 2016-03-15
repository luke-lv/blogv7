/**
 * @fileoverview 个人档案基本资料编辑
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-14
 */

$import("sina/sina.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");

$import("lib/interface.js");
$import("lib/dialogConfig.js");

$import("msg/personal.js");
$import("product/personal/templates/basicInfoTemplate.js");
$import("product/personal/common.js");


/**
 * 基本资料静态类
 */
scope.BasicInfo={
	
	/**
	 * 初始化
	 */
	initialize:function(){
		var _this=this;
		var isSubmit=true;
		var haveData=false;
		var basicInfoEditor=$E("basicInfoEditor");
		var addItemState=$E("basicAddItem")?$E("basicAddItem").style.display:"none";
		
		//搜索链接信息
		var searchSex,searchAstro,searchMarriage,searchJob,searchPlace1,searchPlace2,searchHometown1,searchHometown2;
		var hashSearchAstro={
			"不限":"0",
			"白羊座":"1",
			"金牛座":"2",
			"双子座":"3",
			"巨蟹座":"4",
			"狮子座":"5",
			"处女座":"6",
			"天秤座":"7",
			"天蝎座":"8",
			"射手座":"9",
			"摩羯座":"10",
			"水瓶座":"11",
			"双鱼座":"12"
		};
		var hashSearchSex={
			"0":"0",
			"1":"1"
		};
		
		//初始化错误消息提示管理器
		var failedMsgMgr=new scope.personal.FailedMsgManager(["msgBirthday",
															  "msgSameBirthday",
															  "msgPlace",
															  "msgSamePlace",
															  "msgHometown",
															  "msgSameHometown"]);
		
		//绑定没有任何数据的添加按钮的事件
		if ($E("linkAddBasicInfo")) {
			Core.Events.addEvent($E("linkAddBasicInfo"), showBasicInfoEditor, "click");
		}
		
		
		Core.Events.addEvent($E("btnEditBasicInfo"),showBasicInfoEditor,"click");
		
		
		var provinceAndCity1,provinceAndCity2;
	
		/*显示基本资料的编辑区域*/
		function showBasicInfoEditor(){

			//隐藏"编辑"按钮
			$E("btnEditBasicInfo").parentNode.style.display="none";
			
			//显示Loading
			$E("basicInfoLoading").style.display="";
			
			basicInfoEditor.innerHTML=scope.basicInfoEditorHTML;
			
			if ($E("basicInfoRes")) {
				$E("basicInfoRes").style.display = "";
			}
			
			//隐藏没有数据时的添加行
			if($E("basicAddItem")){
				$E("basicAddItem").style.display="none";
			}
			
			basicInfoEditor.style.display="none";
			
			initializeList();
			
			/*获取接口数据，初始化表单*/
			getData();
			
			return false;
		}
		
		/*初始化下拉列表框的数据*/
		function initializeList(){
			var selectAppenderDesc = new scope.personal.SelectAppender(-1);
			var selectAppender = new scope.personal.SelectAppender();
			selectAppenderDesc.initialize($E("selBirthdayYear"), new Date().getFullYear(), 1908);
			selectAppender.initialize($E("selBirthdayMonth"), 1, 12);
			selectAppender.initialize($E("selBirthdayDay"), 1, 31);
			
			provinceAndCity1 = new scope.personal.ProvinceAndCity($E("selProvince"), $E("selCity"), 0, 0);
			provinceAndCity2 = new scope.personal.ProvinceAndCity($E("selHometownProvince"), $E("selHometownCity"), 0, 0);
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
					if ($E("basicAddItem")) {
						$E("basicAddItem").style.display = addItemState;
					}
					$E("basicInfoEditor").style.display="none";
					$E("basicInfoRes").style.display="";
					$E("btnEditBasicInfo").parentNode.style.display="";
				}
			},"click");
			
			
			/*初始化生日年月日的数据*/
			
			
			Core.Events.addEvent(selBirthdayYear, function(){
				failedMsgMgr.hiddenFailed("msgBirthday");
				failedMsgMgr.hiddenFailed("msgSameBirthday");
				//updateSameBirthday();
			}, "change");
			Core.Events.addEvent(selBirthdayMonth, function(){
				failedMsgMgr.hiddenFailed("msgBirthday");
				failedMsgMgr.hiddenFailed("msgSameBirthday");
				//updateSameBirthday();
			}, "change");
			Core.Events.addEvent(selBirthdayDay, function(){
				failedMsgMgr.hiddenFailed("msgBirthday");
				failedMsgMgr.hiddenFailed("msgSameBirthday");
				//updateSameBirthday();
			}, "change");
			
			/*现居地省市的二级联动*/
			var selProvince = $E("selProvince");
			var selCity = $E("selCity");
			
			Core.Events.addEvent(selProvince, function(){
				failedMsgMgr.hiddenFailed("msgPlace");
				failedMsgMgr.hiddenFailed("msgSamePlace");
				selCity.selectedIndex = 0;
				// updateSamePlace();
			}, "change");
			Core.Events.addEvent(selCity, function(){
				failedMsgMgr.hiddenFailed("msgPlace");
				failedMsgMgr.hiddenFailed("msgSamePlace");
				// updateSamePlace();
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

			
			//显示编辑区域，隐藏显示区域
			basicInfoEditor.style.display="";
			
			if ($E("basicInfoRes")) {
				$E("basicInfoRes").style.display = "none";
			}
			
			//隐藏Loading
			$E("basicInfoLoading").style.display="none";
			
			//如果有历史数据，则显示提示信息
			//$E("basicInfoTip").style.display=isHistory?"":"none";
			
		}
		/*隐藏基本资料的编辑区域*/
		function hiddenBasicInfoEditor(){
			basicInfoEditor.innerHTML="";
			
			if ($E("basicInfoRes")) {
				$E("basicInfoRes").style.display = "";
			}
			$E("basicInfoEditor").style.display="none";
			
			//显示"编辑"按钮
			$E("btnEditBasicInfo").parentNode.style.display="";
			
			//隐藏有历史数据的提示信息
			//$E("basicInfoTip").style.display="none";
	
			if (!haveData) {
				//显示没有数据时的添加行
				if ($E("basicAddItem")) {
					$E("basicAddItem").style.display="";
				} else {
					$E("basicInfoRes").innerHTML='<table class="personTable">'+
													'<tbody>'+
														'<tr id="basicAddItem">'+
															'<td><p class="personIntro CP_txta">'+
															'暂无基本信息，<strong><a href="javascript:;"><cite id="linkAddBasicInfo">请添加</cite></a>。</strong></p></td>'+
														'</tr>'+
													'</tbody>'+
												'</table>';
					Core.Events.addEvent($E("linkAddBasicInfo"),showBasicInfoEditor,"click");
				}
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
			scope.personal.setSelectValue($E("selBirthdayDay"),iData["day"]);
			if($IE) {
				setTimeout(function(){
					scope.personal.setSelectValue($E("selBirthdayDay"),iData["day"]);
				},250);
			}
			
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
			
			//是否在搜索中隐藏信息
			//$E("basicInfoSearchMask").checked=iData["nosearch"]=="1"; 
			
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
			
			if(!verifyProvinceAndCity($E("selHometownProvince"),$E("selHometownCity"))){
				failedMsgMgr.showFailed("msgHometown");
				verified=false;
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
					//,nosearch: $E("basicInfoSearchMask").checked?"1":"0"
				};
				submitData(scope.personal.jsonToString(data));
			}
		}
		
		//验证生日的选择情况
		function verifyBirthday(){
			return $E("selBirthdayYear").selectedIndex!=0
			&& $E("selBirthdayMonth").selectedIndex!=0
			&& $E("selBirthdayDay").selectedIndex!=0;
		}
		
		//验证省市二级联动下拉列表
		function verifyProvinceAndCity(p,c){
			return !(p.value!="0" && p.value!="1001" && c.selectedIndex==0);
		}
		
		//初始化搜索所需要的数据
		function initSearchData(){
			searchSex=hashSearchSex[scope.personal.getRBValueByName("basicInfoSex")];
			searchMarriage=$E("selMarriage").value;
			searchJob=$E("selJob").value;
			searchPlace1=$E("selProvince").value;
			searchPlace2=$E("selCity").value;
			searchHometown1=$E("selHometownProvince").value;
			searchHometown2=$E("selHometownCity").value;
		}
		
		//无刷新更新基本信息的显示区域
		function updateShowData(percent){
			// Modified by L.Ming 接口地址变更 2009.11.26
//			(new Interface("http://icp.cws.api.sina.com.cn/profile/show_baseDetail.php", "jsload")).request({
			(new Interface("http://control.blog.sina.com.cn/riaapi/profile/show_baseDetail.php", "jsload")).request({
				GET : {
					uid:scope.$uid
					,version:7
				},
				onSuccess : function (iData) {
					initSearchData();
					_updateShowData(iData);
					isSubmit=true;
				},
				onError : function (iData) {
					winDialog.alert(
						$PERSONAL_MSG[iData.code],
						{ icon : "02" }
					);
					isSubmit=true;
				},
				onFail : function (iData){
					isSubmit=true;
				}
			});
			
			function _updateShowData(iData){
				var valueRows=[];
				haveData=false;
				valueRows.push('<table class="personTable"><tbody>');
	
				//性别
				if(iData["sex"]){
					haveData=true;
					valueRows.push('<tr>'+
										'<td class="rolTd1 CP_txta">性   别：</td>'+
										'<td class="rolTd2"><span class="tdP20"><a target="_blank" href="http://control.blog.sina.com.cn/search/people_search.php?sex='+searchSex+'">'+iData["sex"]+'</a></span></td>'+
										//'<td class="rolTd2"><span class="tdP20"><a target="_blank" href="http://uni.sina.com.cn/c.php?t=ren&st=1&gend=0&prov=0&city=0&age_min=0&age_max=0&gend='+searchSex+'">'+iData["sex"]+'</a></span></td>'+
					  				'</tr>');
				}
				
				function getZeroStr(str) {
					str += '';
					return str.length == 1 ? '0'+str : str;
				}
				
				//生日
				if (iData["fullDate"]!="2" && iData["year"] && iData["month"] && iData["day"]) {
					haveData=true;
					var hashDate={
						"0":'<a target="_blank" href="http://control.blog.sina.com.cn/search/people_search.php?age_min='+iData['age']+'&age_max='+iData['age']+'">'+iData["year"]+'年&nbsp;'+getZeroStr(iData["month"])+'月'+getZeroStr(iData["day"])+'日</a> '+
							//'<a target="_blank" href="http://uni.sina.com.cn/c.php?t=ren&st=1&gend=0&prov=0&city=0&age_min=0&age_max=0&name='+hashSearchAstro[unescape(iData["astro"])]+'">'+iData["astro"]+'</a>',
							'<a target="_blank" href="http://control.blog.sina.com.cn/search/people_search.php?astro='+hashSearchAstro[unescape(iData["astro"])]+'">'+iData["astro"]+'</a>',
						"1": getZeroStr(iData["month"])+'月'+getZeroStr(iData["day"])+'日&nbsp;'+'<a target="_blank" href="http://control.blog.sina.com.cn/search/people_search.php?astro='+hashSearchAstro[unescape(iData["astro"])]+'">'+iData["astro"]+'</a>'
					};
					valueRows.push('<tr>'+
										'<td class="rolTd1 CP_txta">生   日：</td>'+
										'<td class="rolTd2"><span class="tdP20">'+hashDate[iData["fullDate"]]+'</span></td>'+
									'</tr>');
				}
				
				//婚姻
				if (iData["marriage"]) {
					haveData=true;
					valueRows.push('<tr>'+
										'<td class="rolTd1 CP_txta">婚   姻：</td>'+
										'<td class="rolTd2"><span class="tdP20"><a target="_blank" href="http://control.blog.sina.com.cn/search/people_search.php?marr='+searchMarriage+'">'+iData["marriage"]+'</a></span></td>'+
										//'<td class="rolTd2"><span class="tdP20"><a target="_blank" href="http://uni.sina.com.cn/c.php?t=ren&st=1&gend=0&prov=0&city=0&age_min=0&age_max=0&im='+searchMarriage+'">'+iData["marriage"]+'</a></span></td>'+
									'</tr>');
				}
				
				//职业
				if(iData["job"]){
					haveData=true;
					valueRows.push('<tr>'+
										'<td class="rolTd1 CP_txta">职   业：</td>'+
										'<td class="rolTd2"><span class="tdP20"><a target="_blank" href="http://control.blog.sina.com.cn/search/people_search.php?job='+searchJob+'">'+iData["job"]+'</a></span></td>'+
										//'<td class="rolTd2"><span class="tdP20"><a target="_blank" href="http://uni.sina.com.cn/c.php?t=ren&st=1&gend=0&prov=0&city=0&age_min=0&age_max=0&r3='+searchJob+'">'+iData["job"]+'</a></span></td>'+
									'</tr>');
				}
				
				function change2(str) {
					str += '';
					if(str.length < 2) {
						str = '0' + str;
					}
					return str;
				}
				
				//现居地
				if(iData["place1"]){
					haveData=true;
					
					var full = searchPlace1;
					if(searchPlace1 != '1001') {
						full = searchPlace1 + change2(searchPlace2);
					}
					
					valueRows.push('<tr>'+
										'<td class="rolTd1 CP_txta">现居地：</td>'+
										'<td class="rolTd2"><span class="tdP20"><a target="_blank" href="http://control.blog.sina.com.cn/search/people_search.php?city='+searchPlace1+'">'+iData["place1"]+'</a></span>');
					if(iData["place2"]){
						valueRows.push('<span class="tdP20"><a target="_blank" href="http://control.blog.sina.com.cn/search/people_search.php?city='+full + '">'+iData["place2"]+'</a></span>');
					}
					valueRows.push('</td></tr>');					
				}
				
				//家乡									
				if(iData["hometown1"]){
				//http://control.blog.sina.com.cn/search/people_search.php?bcit=
					var full = searchHometown1;
					if(searchHometown1 != '1001') {
						full = searchHometown1 + change2(searchHometown2);
					}
					
					haveData=true;
					valueRows.push('<tr>'+
										'<td class="rolTd1 CP_txta">家   乡：</td>'+
										'<td class="rolTd2"><span class="tdP20"><a target="_blank" href="http://control.blog.sina.com.cn/search/people_search.php?bcit='+searchHometown1+'">'+iData["hometown1"]+'</a></span>');
					if(iData["hometown2"]){
						valueRows.push('<span class="tdP20"><a target="_blank" href="http://control.blog.sina.com.cn/search/people_search.php?bcit='+full+'">'+iData["hometown2"]+'</a></span>');
					}
					valueRows.push('</td></tr>');
				}
				
				valueRows.push('</tbody></table>');
				
				$E("basicInfoRes").innerHTML=valueRows.join("");
				
				hiddenBasicInfoEditor();
	
				//更新"完成度"
				$E("basicInfoPercent").innerHTML="已完成"+percent;
				
				//获取无数据时的编辑按钮的显示状态
				addItemState=$E("basicAddItem")?$E("basicAddItem").style.display:"none";
			}
			
		}
		
		//提交数据
		function submitData(json){
			// Modified by L.Ming 接口地址变更 2009.11.26
//			(new Interface("http://icp.cws.api.sina.com.cn/profile/edit_base.php", "jsload")).request({
			(new Interface("http://control.blog.sina.com.cn/riaapi/profile/edit_base.php", "ajax")).request({
					POST : {
						uid:scope.$uid,
						data:json
						,version:7
					},
					onSuccess : function (iData) {
						updateShowData(iData["percent"]);
						if ($E("selMarriage")) {
							var finlval = $E("selMarriage").value;
							if((finlval == '3' || finlval == '4')
									&& !scope.$is_userext.family) {
								if($E('BBStates_show_out')) {
									$E('BBStates_show_out').style.display = '';
								}
							} else {
								if(!scope.$is_userext.family && $E('BBStates_show_out')) {
									$E('BBStates_show_out').style.display = 'none';
									$E('BBStates_modify').style.display = 'none';
									$E('BBStates_modify').innerHTML = '';
									$E('BYStates_modify').style.display = 'none';
									$E('BYStates_modify').innerHTML = '';
									$E('ZMStates_modify').style.display = 'none';
									$E('ZMStates_modify').innerHTML = '';
									$E('modifyme').style.cssText = '';
									$E('modifyme').style.display = 'none';
									$E('newBabyAdderOut').style.display = '';
								}
							}
						}
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
		
		//获取数据
		function getData(){
			// Modified by L.Ming 接口地址变更 2009.11.26
//			(new Interface("http://icp.cws.api.sina.com.cn/profile/show_base.php", "jsload")).request({
			(new Interface("http://control.blog.sina.com.cn/riaapi/profile/show_base.php", "jsload")).request({
					GET : {
						uid:scope.$uid
						,version:7
					},
					onSuccess : function (iData) {
						updateBasicInfoData(iData);
						initializeBasicInfo(iData["isHistory"]);
					},
					onError : function (iData) {
						winDialog.alert(
							$PERSONAL_MSG[iData.code],
							{ icon : "02" }
						);
					},
					onFail : function (iData){
					}
				});
		}
	},
	
	/**
	 * 格式化数字，不足两位数则在十位补0
	 * @param {String} numberStr
	 */
	formatNumber:function(numberStr){
		if(numberStr.length<2){
			numberStr="0"+numberStr;
		}
		return numberStr;
	}
};
