/**
 * @author {FlashSoft}
 */
$import("sina/sina.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/trim.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/dom/setStyle.js");
$import("sina/core/dom/getStyle.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/function/bind2.js");
$registJob("editor_tag", function () {

	var getSplitStr = function(sStr, nLen){
		var strArr = sStr.split("");
		var tempStr = new Array();
		var strLen = -1;
		var Len = 0;
		for (var i = 0; i < strArr.length; i++) {
			strLen = Core.String.byteLength(strArr[i]);
			if ((Len + strLen) <= nLen) {
				tempStr[tempStr.length] = strArr[i];
				Len += strLen;
			}
		}
		return tempStr.join("");
	};
	
	var tagMaxLen = 60;
	
	var isKeydown = false;
	scope.noDisplayPageId = {'editor_film' : 1,'nineGrid' : 1};
	
	window.currentTag = '例如：高考 互联网 影评 李宇春 情感 口述实录 越狱 老照片';
	//育儿
	if(scope.$user_channel == 2) {
		articleEditorCFG.dftTagValue = '例如：宝宝 满月 照片 4岁 生日 妈妈 全家福';
		currentTag = '例如：宝宝 满月 照片 4岁 生日 妈妈 全家福';
	}
	
	//影视博客
	if(scope.$pageid=="editor_film"){
		articleEditorCFG.dftTagValue = '影评 ';
		currentTag = '影评 ';
		if($E("articleTagInput").value){
			articleEditorCFG.dftTagValue = $E("articleTagInput").value;
			currentTag = $E("articleTagInput").value;
			$E("articleTagInput").style.color="#333";
		}
	}
	
	//九宫格博客
	if(scope.$pageid=="nineGrid"){
		articleEditorCFG.dftTagValue = '九宫格日记 ';
		currentTag = '九宫格日记 ';
		$E("articleTagInput").style.color="#333";
	}
	
	var TagFuncs = {
		filter: function(){
			var inputArr = TagFuncs.format(inputNode.value);
			var strLen = -1;
			var strArr = new Array();
			var Len = 0;
			var maxLen = tagMaxLen;
			var tempStr = "";
			for (var i = 0; i < inputArr.length; i++) {
				strLen = Core.String.byteLength(inputArr[i]);
				if ((Len + strLen) <= maxLen) {
					if (inputArr[i] != "") {
						strArr[strArr.length] = inputArr[i];
					}
					Len += strLen;
				}
				else {
					tempStr = getSplitStr(inputArr[i], maxLen - Len);
					if (tempStr != "") {
						strArr[strArr.length] = tempStr;
					}
					Len = maxLen;
				}
			}
			inputNode.value = strArr.join(" ");
		},
		format: function(sValue){
			var inputStr = Core.String.trim(sValue);
			var inputArr = inputStr.replace(/ |;|；|　/g, ",").split(",");
			return inputArr;
		},
		addTag: function(sTagName){
			var inputArr = TagFuncs.format(inputNode.value);
			var tempArr = new Array();
			var isTag = false;
			for (var i = 0; i < inputArr.length; i++) {
				if (inputArr[i] != "") {
					if (sTagName == inputArr[i]) {
						isTag = true;
					}
					tempArr[tempArr.length] = inputArr[i];
				}
			}
			if (isTag == false) {
				inputNode.value = tempArr.join(" ") + " " + sTagName;
			}
			TagFuncs.filter();
		},
		focus: function(el){
			inputPos = Core.Dom.getXY(inputNode);
			$E('articleTagInput').style.color = "#000";
			if(itmesBox.style.display!="block"&&scope.noDisplayPageId[scope.$pageid]){
				$E('articleTagInput').select();
			}
			
//			if ($IE) {
//				Core.Dom.setStyle(itmesBox, "left", (inputPos[0] - 2) + "px");
//				Core.Dom.setStyle(itmesBox, "top", (inputPos[1] + inputHeight - 2) + "px");
//			}
//			else {
//			
//				Core.Dom.setStyle(itmesBox, "left", inputPos[0] + "px");
//				Core.Dom.setStyle(itmesBox, "top", (inputPos[1] + inputHeight) + "px");
//			}
			Core.Dom.setStyle(itmesBox, "display", "block");
//			Core.Dom.setStyle(cmpNode, "visibility", "hidden");
			
			if (!isKeydown) {
				if (Core.String.trim($E('articleTagInput').value) == Core.String.trim(currentTag)&&!scope.noDisplayPageId[scope.$pageid]) {
					$E('articleTagInput').value = '';
				}
			}
			
		},
		blur: function(el){
			if($E('articleTagInput').value == '')
			{
				//trace("########Trace HERE##########")
				if(!scope.noDisplayPageId[scope.$pageid]){
					$E('articleTagInput').style.color = '#ccc';
					$E('articleTagInput').value = currentTag;
				}				
				
				isKeydown = false;
			}
			
			
			if (TagFuncs.isClick == true) 
				return;
			Core.Dom.setStyle(itmesBox, "display", "none");
//			Core.Dom.setStyle(cmpNode, "visibility", "visible");
			inputNode.value = TagFuncs.format(inputNode.value).join(" ");
			TagFuncs.filter();
			return false;
		},
		keyup: function(){
			var strLen = Core.String.byteLength(TagFuncs.format(inputNode.value).join(""));
			if (strLen > tagMaxLen) {
				TagFuncs.filter();
			}
			isKeydown = true;
		},
		submit: function(){
		
		},
		isClick: false
	};
	window.TagFuncs = TagFuncs;
	/** 用户Tag */
	var userTagHTML = new Array();
	var userTagList = $E("userTagList");
	var userTags = articleEditorCFG.articleAllTagList.user;
	for (var i = 0; i < userTags.length; i++) {
		userTagHTML[userTagHTML.length] = "<a href='javascript:void(0);' onclick='return false'  onmousedown='window.TagFuncs.addTag(\"" + userTags[i] + "\");'>" + userTags[i] + "</a>&nbsp;";
	}
	userTagList.innerHTML = userTagHTML.join("");
	
	/** 热门Tag */
	var hotTagHTML = new Array();
	var hotTagList = $E("hotTagList");
	var hotTags = articleEditorCFG.articleAllTagList.hot;
	for (var i = 0; i < hotTags.length; i++) {
		hotTagHTML[hotTagHTML.length] = "<a style='color: #ff6600;  margin-right: 4px;' onclick='return false' href='javascript:void(0);' onmousedown='window.TagFuncs.addTag(\"" + hotTags[i].label + "\");'>" + hotTags[i].label + "</a><a target='_blank' style='color: #7E7E7E; margin-right: 10px;' href='" + hotTags[i].link + " '>(话题排行榜)</a>&nbsp;";
	}
	if (hotTags.length > 0) {
		hotTagHTML[hotTagHTML.length] = "<br/>";
	}
	var hotTags = articleEditorCFG.articleAllTagList.tag_Recommend;
	for (var i = 0; i < hotTags.length; i++) {
		if (hotTags[i] == "绿丝带") {
			hotTagHTML[hotTagHTML.length] = "<a style='color: green;' title='绿丝带在行动：每个人都是抗灾最前线！' href='javascript:void(0);' onclick='return false' onmousedown='window.TagFuncs.addTag(\"" + hotTags[i] + "\");'>" + hotTags[i] + "</a>&nbsp;";
		}
		else {
			hotTagHTML[hotTagHTML.length] = "<a href='javascript:void(0);' onclick='return false' onmousedown='window.TagFuncs.addTag(\"" + hotTags[i] + "\");'>" + hotTags[i] + "</a>&nbsp;";
		}
		
		
	}
	hotTagList.innerHTML = hotTagHTML.join("");
	
	/**初始化默认Tag**/
	articleEditorCFG.dftTagValue = currentTag;
	var inputNode = $E("articleTagInput");
	inputNode.value = articleEditorCFG.articleTagList || articleEditorCFG.dftTagValue;
	if (articleEditorCFG.articleStatus == "1"&&!scope.noDisplayPageId[scope.$pageid]) {
		inputNode.style.color = "#ccc";
	}
	function initTag(){
		if(inputNode.value == articleEditorCFG.dftTagValue) inputNode.value = "";
		inputNode.style.color="#000";
		Core.Events.removeEvent(inputNode,initTag, "click");
	}
	if(!scope.noDisplayPageId[scope.$pageid]){
		Core.Events.addEvent(inputNode,initTag, "click");
	}
	
	
	var itmesBox = $E("articleTagList");
	var closeBtn = $E("tagListClose");
	var inputNode = $E("articleTagInput");
	var cmpNode = $E("componentSelect");
	var tagAutoSub = $E("articleTagAutoSub");
	var inputPos = [];
	var inputHeight = inputNode.offsetHeight;
	Core.Events.addEvent(inputNode, TagFuncs.focus.bind2(inputNode), "focus");
	Core.Events.addEvent(inputNode, TagFuncs.focus.bind2(inputNode), "click");	
	Core.Events.addEvent(inputNode, TagFuncs.blur.bind2(inputNode), "blur");

	Core.Events.addEvent(closeBtn, function(){
			Core.Events.stopEvent();
			Core.Dom.setStyle(itmesBox, "display", "none");
//			Core.Dom.setStyle(cmpNode, "visibility", "visible");
			inputNode.value = TagFuncs.format(inputNode.value).join(" ");
			TagFuncs.filter();
			
	}, "click");
	
	Core.Events.addEvent(inputNode, TagFuncs.keyup.bind2(inputNode), "keyup");
	Core.Events.addEvent(itmesBox, function(){
		TagFuncs.isClick = true;
		setTimeout(function(){
			TagFuncs.isClick = false;
		//	inputNode.focus();
		}, 100);
	}.bind2(inputNode), "mousedown");
	
	Core.Events.addEvent(inputNode, TagFuncs.submit.bind2(tagAutoSub), "click");
});