/**
 * 在搜人项目下的显示
 * @author zhihan | zhihan@staff.sina.com.cn
 * @version 1.0
 * @history
 */
$import("lib/jobs.js");
$import("lib/component/class/_class.js");
$import("sina/core/system/getParam.js");
$import('sina/core/events/fireEvent.js');
$import('lib/checkAuthor.js');

$registJob("spSearch", function () {
	//缓存上次的搜索结果,如果分页了，即使那些select更改了，也不改变其参数
	var cashData = {};
	
	//所有的参数，除了分页
	var searchArr = ['sex','age_min','age_max','astro','marr','sort','job','bcit','city'];
	var baseArr = ['sex','age_min','age_max','astro','marr'];
	
	for(var i=0; searchArr[i]; i++) {
		if($E(searchArr[i])) {
			var val = Core.System.getParam(searchArr[i]);
			if(val != null) {
				//缓存第一次过来的结果
				cashData[searchArr[i]] = val;
				//调整选择的内容
				$E(searchArr[i]).value = val;
			}
		}
	}
	
	//获得select的值
	function getVal(val) {
		if(val != 'none') {
			return val;
		} else {
			return null;
		}
	}
	
	//绑定按钮的事件，目前是排序替换和点击'搜索'会产生查询
	var bindBtn = function(btns) {
		btns = btns || [{'id':'sort','e':'onchange'},{'id':'searchSubmit','e':'onclick'}];
		for(var i=0; btns[i]; i++) {
			if($E(btns[i].id)) {
				$E(btns[i].id)[btns[i].e] = function() {
					searchPeople();
				}
			}
		}
	}

	//搜人,当不传递pageSet时，认为是点击的事件产生的，如果传递，认为是分页发的请求
	var searchPeople = function(pageSet) {
		Lib.checkAuthor();
		if(!$isLogin) {
			var loc = window.location.toString().split('?');
			window.location=loc[0];
			return;
		}
		if(!$isAdmin) {
			var loc = window.location.toString().split('?');
			window.location=loc[0];
			return;
		}
		var params = {};
		if(pageSet) {
			params = cashData;
			params.page = pageSet;
		} else  {
			//获得参数
			for(var i=0; searchArr[i]; i++) {
				if($E(searchArr[i])) {
					var val = getVal($E(searchArr[i]).value);
					if(val != null) {
						params[searchArr[i]] = val;
					}
				}
			}
			params = scope.spSearchFromWhere(params);
			//判断是否满足发起请求的条件
			var age_min = parseInt(getVal($E('age_min').value));
			var age_max = parseInt(getVal($E('age_max').value));
			if(age_min != null && age_max != null && age_min>age_max) {
				winDialog.alert("最小年龄不能大于最大年龄", {
					icon:"01"
				});
				return;
			}
		}
		//回调期间的显示
		$E('peoplesearch_l').innerHTML = '请稍后...';
		Utils.Io.Ajax.request('http://control.blog.sina.com.cn/riaapi/profile/show_peopleSearch.php',{
			method : 'POST',
			POST : params,
			onComplete : function(data) {
				data = eval('('+data+')');
				if(data.code == 'A00006') {
					//缓存数据，为分页做准备
					cashData = params;

					if(data.data.flag == 0) {
						$E('peoplesearch_l').innerHTML = data.data.data;
					} else {
						var initDate = data.data.data;
						scope.createNeedToDoFull(initDate);
					}
					scope.spChangeValue(data.data.select || params);
					bindBtn([{'id':'sort','e':'onchange'}]);
					//加入发生了更改，还原回原来的选项
					for(var j=0; baseArr[j]; j++) {
						var ele = $E(baseArr[j]);
						if(ele) {
							if(params[baseArr[j]]) {
								if(ele.value != params[baseArr[j]]) {
									ele.value = params[baseArr[j]];
								}
							} else {
								if(getVal(ele.value)) {
									ele.value = 'none';
								}
							}
						}
					}
				} else {
					$E('peoplesearch_l').innerHTML = '请求失败,点击<a href="javascript:void(0)" id="realFresh">这里</a>重试';
					$E('realFresh').onclick = Core.Events.fireEvent("searchSubmit", 'click');
				}
				//去除分页这个参数
				if(cashData.page) {
					delete cashData.page;
				}
			}
		});
	}
	//绑定事件
	bindBtn();
	//提供分页的接口
	Lib.spPageChange = function(pageSet) {
		searchPeople(pageSet);
	}
});