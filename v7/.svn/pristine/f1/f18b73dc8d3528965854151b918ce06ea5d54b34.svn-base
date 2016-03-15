/**
 * 选择是以哪种方式进行搜索
 * @author zhihan | zhihan@staff.sina.com.cn
 * @version 1.0
 * @history
 */
$import("lib/jobs.js");
$import("lib/component/class/_class.js");
$import('sina/core/events/addEvent.js');
$import('sina/core/events/fireEvent.js');
$import("sina/core/system/getParam.js");
$import("sina/core/array/findit.js");

$import("lib/component/_component.js");
$import("lib/checkAuthor.js");
$import("lib/interface.js");
$import("lib/dialogConfig.js");
$import("lib/showError.js");
// 引入 $login 所在的 JS
$import("lib/msg/systemMSG.js");
$import("lib/msg/attentionMSG.js");
$import("lib/login/ui.js");

$import("lib/config/cityConfig.js");

$registJob("spSearchOpt", function () {
	var types = [{'id':'base','param':''},{'id':'bcit','param':'bcit'},{'id':'city','param':'city'},{'id':'job','param':'job'}];
	//var currentKey = 'base';
	scope.searchCurrentKey = 'base';
	
	var Group = scope.Group;
	
	
	scope.loadProv = function(ele,val) {
		val = val || 0;
		var provOps = ele.options;
		var provcodes = Group.provcodes.split(",");
		var provinces = Group.provinces.split(",");
		provOps[0] = new Option("请选择",0);
		for(var i = 0, len = provcodes.length; i < len; i ++){
			provOps[provOps.length] = new Option(provinces[i],provcodes[i]);
		}
		if(val) {
			ele.value = val;
		} else {
			ele.value = 0;
		}
	}
	
	scope.loadCity = function(ele,val) {
		var provCode = $E('prov').value;
		//判断是选择海外还是'请选择'
		if(provCode == "1001" || provCode == "0"){
			ele.style.display = "none";
			ele.disabled = true;
			return false;
		}else{
			ele.disabled = false;
			ele.style.display = "";
		}
		var cityOps = ele.options;
		while(cityOps.length){
			ele.remove(0);
		}
		var cityCodes = Group["code" + provCode].split(",");
		var cityTexts = Group["prov" + provCode].split(",");
		cityOps[0] = new Option("请选择",0);
		for(var i = 0, len = cityCodes.length; i < len; i ++){
			cityOps[cityOps.length] = new Option(cityTexts[i], cityCodes[i]);
		}
		if(val) {
			ele.value = val;
		} else {
			ele.value = 0;
		}
	}
	
	//选中tab,并返回是否有变更,true为没有变更,false为有变更
	function selectSearch(id) {
		var parent = $E('base').parentNode;
		var children = parent.childNodes;
		for(var i=0; children[i]; i++) {
			if(children[i].nodeType == 1) {
				if(children[i].id == id) {
					scope.searchCurrentKey = id;
					if(testHasClass(children[i],'current')) {
						return true;
					}
					addClass(children[i],'current');
				} else {
					removeClass(children[i],'current');
				}
			}
		}
		return false;
	}
      var testHasClass = function(ele, cls) {
        return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
      }
	  
	  
      var addClass = function(ele, cls) {
        var res = testHasClass(ele, cls);
        if (!res) {
          ele.className += " " + cls;
        }
      }
	  
	  
      var removeClass = function(ele, cls) {
        if (testHasClass(ele, cls)) {
          var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
          ele.className = ele.className.replace(reg, ' ');
        }
      }
	
	Core.Events.addEvent('base', function () {
		select['base'](false);
	},'click');
	
	Core.Events.addEvent('bcit', function () {
		select['bcit'](false,scope.$bict);
	},'click');
	
	Core.Events.addEvent('city', function () {
		select['city'](false,scope.$city);
	},'click');
	
	Core.Events.addEvent('job', function () {
		select['job'](false,scope.$job);
	},'click');
	
	var select = {};
	select.base = function(fromURL) {
		selectSearch('base');
		$E('search_more').innerHTML = '';
		if(!fromURL) {
			Core.Events.fireEvent("searchSubmit", 'click');
		}
	}
	
	scope.spSearchFromWhere = function(params) {
		delete params.bcit;
		delete params.city;
		delete params.job;
		switch(scope.searchCurrentKey) {
			case 'base' : {
				params.type = 'base';
				return params;
			}
			case 'bcit' : {
				var prov = $E('prov').value;
				var city = $E('spcity').value;
				if(prov != '0') {
					if(prov != '1001') {
						if(city != '0') {
							params.bcit = prov+come2(city);
						} else {
							params.bcit = prov;
						}
					} else {
						params.bcit = '1001';
					}
				}
				params.type = 'bcit';
				return params;
			}
			case 'city' : {
				var prov = $E('prov').value;
				var city = $E('spcity').value;
				if(prov != '0') {
					if(prov != '1001') {
						if(city != '0') {
							params.city = prov+come2(city);
						} else {
							params.city = prov;
						}
					} else {
						params.city = '1001';
					}
				}
				params.type = 'city';
				return params;
			}
			case 'job' : {
				var val = $E('spJob').value;
				val += '';
				if(val != '0') {
					params.job = val;
				}
				params.type = 'job';
				return params;
			}
		}
	}
	
	scope.spChangeValue = function(data) {
		switch(scope.searchCurrentKey) {
			case 'bcit' : {
				var select = data.bcit;
				if(select) {
					if(select == '0') {
						if($E('prov') && $E('prov').value != '0') {
							$E('prov').value = '0';
						}
						if($E('spcity')) {
							$E('spcity').value = '0';
							$E('spcity').style.display = 'none';
							$E('spcity').disabled = true;
						}
					} else if(select == '1001') {
						if($E('prov')  && $E('prov').value != '1001') {
							$E('prov').value = '1001';
							if($E('spcity')) {
								$E('spcity').value = '0';
								$E('spcity').style.display = 'none';
								$E('spcity').disabled = true;
							}
						}
					} else {
						var id1 = select.substring(0,2);
						if($E('prov') && $E('prov').value != id1) {
							$E('prov').value = id1;
						}
						if(select.length == 4) {
							var id2 = come1(select.substring(2,4));
							if($E('spcity')) {
								scope.loadCity($E('spcity'))
								$E('spcity').value = id2;
								$E('spcity').style.display = '';
								$E('spcity').disabled = false;
							}
						}
					}
				} else {
					if($E('prov') && $E('prov').value != '0') {
							$E('prov').value = '0';
					}
					if($E('spcity')) {
						$E('spcity').value = '0';
						$E('spcity').style.display = 'none';
						$E('spcity').disabled = true;
					}
				}
				return;
			}
			case 'city' : {
				var select = data.city;
				if(select) {
					if(select == '0') {
						if($E('prov') && $E('prov').value != '0') {
							$E('prov').value = '0';
						}
						if($E('spcity')) {
							$E('spcity').value = '0';
							$E('spcity').style.display = 'none';
							$E('spcity').disabled = true;
						}
					} else if(select == '1001') {
						if($E('prov')  && $E('prov').value != '1001') {
							$E('prov').value = '1001';
							if($E('spcity')) {
								$E('spcity').value = '0';
								$E('spcity').style.display = 'none';
								$E('spcity').disabled = true;
							}
						}
					} else {
						var id1 = select.substring(0,2);
						if($E('prov') && $E('prov').value != id1) {
							$E('prov').value = id1;
						}
						if(select.length == 4) {
							var id2 = come1(select.substring(2,4));
							if($E('spcity')) {
								scope.loadCity($E('spcity'))
								$E('spcity').value = id2;
								$E('spcity').style.display = '';
								$E('spcity').disabled = false;
							}
						}
					}
				} else {
					if($E('prov') && $E('prov').value != '0') {
							$E('prov').value = '0';
					}
					if($E('spcity')) {
						$E('spcity').value = '0';
						$E('spcity').style.display = 'none';
						$E('spcity').disabled = true;
					}
				}
				return;
			}
			case 'job' : {
				var select = data.job;
				if(select) {
					if($E('spJob') && $E('spJob').value != select) {
						$E('spJob').value = select;
					}
				} else {
					if($E('spJob')) {
						$E('spJob').value = '0';
					}
				}
			}
		}
	}
	
	function come2(i) {
		i += '';
		if(i.length == 1) {
			return '0'+i;
		}
		return i;
	}
	
	function come1(i) {
		i += '';
		if(i.length == 2) {
			return i.charAt(0) == '0' ? i.charAt(1) : i;
		}
		return i;
	}
	
	select.bcit = function(fromURL,id) {
		if(selectSearch('bcit') && !fromURL) {
			return;
		}
		var id1 = null;
		var id2 = null;
		if(id) {
			id = '' + id;
			if(id == '1001') {
				id1 = '1001';
			} else {
				id1 = id.substring(0,2);
				id2 = come1(id.substring(2,4));
			}
		}
		$E('search_more').innerHTML = '家乡:<select id="prov" style="width:60px;"><option></option></select>&nbsp;&nbsp;&nbsp;<select id="spcity" style="width:145px;"><option></option></select>&nbsp;&nbsp;&nbsp;';
		scope.loadProv($E('prov'),id1);
		$E('prov').onchange = function() {
			var val = $E('prov').value;
			scope.loadCity($E('spcity'));
		}
		scope.loadCity($E('spcity'),id2);
		if(!fromURL) {
			Core.Events.fireEvent("searchSubmit", 'click');
		}
	}
	
	select.city = function(fromURL,id) {
		if(selectSearch('city') && !fromURL) {
			return;
		}
		var id1 = null;
		var id2 = null;
		if(id) {
			id = '' + id;
			if(id == '1001') {
				id1 = '1001';
			} else {
				id1 = id.substring(0,2);
				id2 = come1(id.substring(2,4));
			}
		}
		$E('search_more').innerHTML = '现居:<select id="prov" style="width:60px;"><option></option></select>&nbsp;&nbsp;&nbsp;<select id="spcity" style="width:145px;"><option></option></select>&nbsp;&nbsp;&nbsp;';
		scope.loadProv($E('prov'),id1);
		$E('prov').onchange = function() {
			var val = $E('prov').value;
			scope.loadCity($E('spcity'));
		}
		scope.loadCity($E('spcity'),id2);
		if(!fromURL) {
			Core.Events.fireEvent("searchSubmit", 'click');
		}
	}
	
	select.job = function(fromURL,jobId) {
		if(selectSearch('job') && !fromURL) {
			return;
		}
		$E('search_more').innerHTML = ['职业：','<select id="spJob" style="width:180px;">',
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
					'</select>&nbsp;&nbsp;&nbsp;'].join('');
		if(jobId) {
			$E('spJob').value = jobId;
		}
		if(!fromURL) {
			Core.Events.fireEvent("searchSubmit", 'click');
		}
	}
	
	for(var i=0; types[i]; i++) {
		var type = types[i];
		var id = Core.System.getParam(type.id);
		if(id != null && id != '') {
			select[type.id](true,id);
		}
	}
	
	Lib.Component.Attention2 = function(uid,aid,ele) {
		sPaddAttention(uid,aid,ele);
	}
	
	/**
	 * 添加关注
	 * @param {Number|String} nVisitId	发出关注的人
	 * @param {Number|String} nUserId	被关注的人
	 */
	var sPaddAttention = function (nVisitId, nUserId,ele){
		Lib.checkAuthor();
		var i_attention = new Interface("http://control.blog.sina.com.cn/riaapi/profile/attention_add.php", "ijax");
		i_attention.request({
			POST : {
				"uid"	: nVisitId || $UID
				,"aid"	: nUserId || scope.$uid
			}
			,onSuccess	: function () {}
			,onError	: function(oData){
				var msg = "";
				switch(oData.code) {
					case "A33003": // 超过最大关注数 
						msg = $SYSMSG.A33003.replace("#{UID}", $UID);
						winDialog.alert(msg);	
						break;
					case "A33004": // 关注成功
						var alertConf = {
							subText : ['<div class="CP_w_cnt SG_txtb">以后对方的动态（发博文，图片，投票等），都可以在<span style="color:red">个人中心</span>查看啦！</div>'
								, '<ul class="CP_w_part CP_w_aLine">'
									, '<li><a href="http://control.blog.sina.com.cn/blogprofile/index.php?type=3&from=attention" onclick="winDialog.getDialog(\'attention\').close();" target="_blank">到个人中心查看关注动态&gt;&gt;</a></li>'
								, '</ul>'].join(""),
							icon:	"03",
							width:	300
						};
						ele.className = "SG_aBtn SG_aBtn_dis";
						ele.innerHTML = '<cite>已关注</cite>';
					
						//msg = $SYSMSG.A33004.replace("#{UID}", $UID);
						msg = $SYSMSG["A33004"];
						alertConf["subText"] = alertConf["subText"].replace(/#{UID}/g, $UID);
						winDialog.alert(msg, alertConf, "attention");
						break;
					default:
					 	showError(oData.code);
				}
			}
			,onFail		: function () {
				showError($SYSMSG.A00001);
			}
		});
	};
});