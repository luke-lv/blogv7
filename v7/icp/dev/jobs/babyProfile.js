/**
 * @fileoverview 育儿博客资料修改
 * @author zhihan | zhihan@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/core/array/foreach.js");
$import("sina/core/system/br.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/ui/tween.js");
$import("sina/core/string/byteLength.js");
$import("lib/interface.js");
$import("sina/ui/template.js");
$import("sina/utils/json.js");
$import("sina/core/events/fireEvent.js");
$import("sina/core/events/addEvent.js");
$import("msg/baby_msg.js");
$import("sina/core/array/foreach.js");
$import("sina/core/dom/opacity.js");
$import("sina/core/system/getParam.js");
$import("baby/yemodify/baseInit.js");
$import("baby/yemodify/beiyunmodify.js");
$import("baby/yemodify/zhunmamodify.js");
$import("baby/yemodify/babymodify.js");
$import("sina/core/dom/getXY.js");

$registJob("babyProfile", function(){
	
	if(scope.$pageid != 'profile_profileM') {
		trace('killed baby');
		return;
	}
	
	var newBabyAdder = $E('newBabyAdder');
	var newBabyAdderOut = $E('newBabyAdderOut');
	var modifyme = $E('modifyme');
	
	//当个人信息选择了这两项，才会做呈现
	if(newBabyAdder) {
		//这是一个三口之家或者小两口的用户，还没有家庭信息。
		newBabyAdder.onclick = function(){
			scope.yemodify.exchangeShow(modifyme,newBabyAdderOut,{
				beforeChange : function(){
					//newBabyAdderOut.style.position = '';
					//newBabyAdderOut.style.height = '119px';
					//newBabyAdderOut.style.width = '690px';
				}
				,firstHidden : function(){
					//var lis = modifyme.getElementsByTagName('li');
					//for(var i=0; lis[i]; i++) {
					//	lis[i].style.position = 'static';
					//}
					//newBabyAdderOut.style.position = 'relative';
				}
				,finalCallBack : function(){
					//var lis = modifyme.getElementsByTagName('li');
					//for(var i=0; lis[i]; i++) {
					//	lis[i].style.position = 'relative';
					//}
				}
			});
		};
	}
	
	scope.returnToEdit = function(callBack){
		scope.yemodify.exchangeShow(newBabyAdderOut,modifyme,{
			beforeChange : function(){
				//var lis = modifyme.getElementsByTagName('li');
				//for(var i=0; lis[i]; i++) {
				//	lis[i].style.position = 'static';
				//}
			}
			,firstHidden : function(){
				//var lis = modifyme.getElementsByTagName('li');
				//for(var i=0; lis[i]; i++) {
				//	lis[i].style.position = 'relative';
				//}
				//newBabyAdderOut.style.position = 'static';
				//newBabyAdderOut.style.height = '119px';
				//newBabyAdderOut.style.width = '690px';
			}
			,finalCallBack : function(){
				//newBabyAdderOut.style.position = 'relative';
				if(callBack) {
					callBack();
				}
			}
		});
	}
	
	var bbstatTip = document.createElement('div');
	bbstatTip.style.cssText = 'position:absolute;display:none;';
	bbstatTip.className = 'state_layer';
	bbstatTip.innerHTML = '<em></em><p id="inBbstatTip"></p>';
	document.body.appendChild(bbstatTip);
	
	var showBbstatTipMsg = ['备孕，顾名思义就是准备怀孕咯。'
							,'已经怀孕准备分娩的“妈妈”，我<br>们称之为准妈妈。'
							,'宝宝的一声啼哭开始，我们就升<br>格为爸爸妈妈了，我们的小家因为<br>宝宝的到来开心又温暖。'];
	
	//鼠标移上去的事件
	var allBBStates = $E('allBBStates');
	if (allBBStates) {
		var lis = $E('allBBStates').getElementsByTagName('li');
		for (var i = 0; lis[i]; i++) {
			lis[i].onmouseover = (function(li,num){
				return function(){
					//li.style.position = "relative";
					li.className += " hover";
					$E('inBbstatTip').innerHTML = showBbstatTipMsg[num];
					var arr = Core.Dom.getXY(li);
					bbstatTip.style.left = arr[0]+'px';
					bbstatTip.style.top = (arr[1]+li.offsetHeight+7)+'px';
					bbstatTip.style.display = '';
				}
			})(lis[i],i);
			
			lis[i].onmouseout = (function(li){
				return function(){
					//li.style.position = "static";
					li.className = li.className.replace(' hover', "");
					bbstatTip.style.display = 'none';
					$E('inBbstatTip').innerHTML = '';
				}
			})(lis[i]);
			
			lis[i].onclick = (function(li, num){
				return function(){
					if (scope.babyShowIsBusy) {
						return;
					}
					scope.currentBabyType = num;
					openBabyStatusModify(num);
				}
			})(lis[i], i + 1);
		}
	}
	
	/**
	 * 打开详细信息编辑
	 * @param {Number} type 类别有：1,备孕。2,准妈妈。3,家有儿女
	 */
	function openBabyStatusModify(type) {
		//隐藏关闭所有的显示
		$E('BYStates_show').style.display = 'none';
		$E('ZMStates_show').style.display = 'none';
		$E('BBStates_show').style.display = 'none';
		//隐藏所有的编辑
		$E('BYStatesM').parentNode.style.display = 'none';
		$E('ZMStatesM').parentNode.style.display = 'none';
		$E('BBStatesM').parentNode.style.display = 'none';
		switch(type) {
			//显示对应的编辑按钮，并执行点击。
			case 1 : {
				$E('BYStatesM').parentNode.style.display = '';
				Core.Events.fireEvent('BYStatesM', 'click');
				break;
			}
			case 2 : {
				$E('ZMStatesM').parentNode.style.display = '';
				Core.Events.fireEvent('ZMStatesM', 'click');
				break;
			}
			case 3 : {
				$E('BBStatesM').parentNode.style.display = '';
				Core.Events.fireEvent('BBStatesM', 'click');
				break;
			}
		}
		$E('modifyme').style.display = 'none';
	}
	
	/**
	 * 根据value设置select
	 * @param {Object} selObj
	 * @param {String} v
	 */
	/*
	var setSelectValue=function(selObj,v){
		var i,len=selObj.length;
		for(i=0;i<len;i++){
			if(selObj.options[i].value==v){
				selObj.selectedIndex=i;
				break;
			}
		}
	};
	*/
	
	//备孕中的资料修改
	scope.yemodify.initBeiYunInf();
	//准妈妈的资料修改
	scope.yemodify.initZhunMaInf();
	//宝宝的资料修改
	scope.yemodify.initBabyInf();
	
	
	// 宝宝组件管理
	var familyEditBtn = {
		readyfor:		"BYStatesM",
		pregnancy:		"ZMStatesM",
		mom:			"BBStatesM"
	};
	var familyField = {
		readyforShow:	"BYStates_show",
		pregnancyShow:	"ZMStates_show",
		momShow:		"BBStates_show"
	};
	var edit = Core.System.getParam('edit');
	var fmLv = Core.System.getParam('level');
	if(edit && edit=='family' && (+fmLv)){
		for(var n in familyField){
			familyField[n] && ($E(familyField[n]).style.display = "none");
		}
		switch(+fmLv){
			case 1:
				Core.Events.fireEvent($E(familyEditBtn.readyfor), "click");
				break;
			case 2:
				Core.Events.fireEvent($E(familyEditBtn.pregnancy), "click");
				break;
			case 3:
				Core.Events.fireEvent($E(familyEditBtn.mom), "click");
				break;
		};
	}
});



