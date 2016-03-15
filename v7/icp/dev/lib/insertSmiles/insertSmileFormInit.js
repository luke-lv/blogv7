/**
 * @fileoverview
 *	博客正文页发表评论表单中的插入表情
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/sina.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/function/bind3.js");
$import("sina/core/system/br.js");
$import("sina/utils/io/jsload.js");
$import("sina/core/system/br.js");

$import("lib/app.js");
$import("lib/sendLog.js");
$import("lib/insertSmiles/smilesDialog.js");
App.insertSmilesForm = Core.Class.create();
App.insertSmilesForm.prototype = {
	// 默认参数
	defalutConfig	: {
			sortCount		: 6,
			clickCallback	: function () {},
			recommCount		: 8
	},
	/**
	 * 
	 * @param {JSONObject} oOption	初始化插入表情的选项
	 * {
	 * 	sortNode		[必选]推荐分类节点
	 * 	sortCount		[必选]推荐分类个数
	 * 	clickCallback	[可选]点击表情的回调函数
	 * 	recommNode		[可选]推荐表情节点
	 * 	recommCount		[可选]推荐表情个数
	 * }
	 */
	// 初始化
	initialize		: function (oOption) {
		this.option = oOption || {};
		if(this.option.sortNode == null){
			return;		// 缺少必要的参数
		}
		for(var key in this.defalutConfig){
			if(this.option[key] == null){
				this.option[key] = this.defalutConfig[key];
			}
		}
		if(scope.smilesData == null){
			this.getSmilesData();
		}else{
			this.data = scope.smilesData;
			this.renderUI();
		}
	},
	// 取得表情数据
	getSmilesData	: function () {
		var __this = this;
		var smileData = Utils.Io.JsLoad.request(
			[{	"url" : "http://www.sinaimg.cn/uc/myshow/blog/misc/gif/smileConfig.js?varname=smileConfig"
				, "charset"	: "GBK"}],
			{
				onComplete	: function(oData){
					scope.smilesData = oData;
					__this.data = oData;
					__this.renderUI();
				},
				onException	: function () {}
			});
	},
	// 渲染推荐表情
	renderUI			: function () {
		var __this = this;
		var count = 1;	// 取数据计数
		var first6sort = [];	// 最热门6个分类
		var first6hot = [];		// 最热门8个表情
		var firstSort;			// 第一个分类
		
		var _fragement = document.createDocumentFragment();
		var _sorts = $C("div");	// 推荐分类
		var _more = $C("span");	// 更多
		var _clearit = $C("div");	// 清除浮动 DIV

		// 采用创建  DOM 节点的方法来渲染，是为了传递回调函数
		_sorts.className = "facestyle";
		for(var key in this.data){
			if(count == 1){		// 取出第一个分类
				firstSort = this.data[key] || {data:{}};
				firstSort = firstSort.data;
			}
			if(count <= this.option.sortCount){
				var _title = this.data[key].name;
				var node = $C("a");
				node.href = "#";
				node.setAttribute('key',key);
				node.onclick = function () {Core.Events.stopEvent();return false;};
				node.onmousedown = Core.Function.bind3(function (key) {
							App.insertSmilesDialog(key, __this.option.clickCallback, __this.option.positionNode,
								__this.option.arrPosPix);
						}, null, [key]);
				node.hideFocus = true;
				node.innerHTML = '<img src="http://www.sinaimg.cn/uc/myshow/blog/misc/gif/' + key + '-25.gif" alt="'
						+ _title + '" title="' + _title + '" />';
				_sorts.appendChild(node);
				count ++;
			}else{ break; }
		}
		
		var timpStamp = new Date().getTime();
		_sorts.id = 'recomm_' + timpStamp;
		
		_fragement.appendChild(_sorts);
		
		_more.className = "SG_more";	// 更多链接
		var _morelink = $C("a");
		_morelink.href = "#";
		_morelink.onclick = function () {Core.Events.stopEvent();return false;};
		_morelink.onmousedown = (function (ele) {
									return function() {
										App.insertSmilesDialog(0, __this.option.clickCallback, __this.option.positionNode,
											__this.option.arrPosPix);
										var pid = scope.$pageid;
										if(pid) {
											var ppId = ele.parentNode.parentNode.id.split('_')[0];
											if(ppId) {
												scope.isFromtheCommonhzh = $_GLOBAL.faceCountMoreLinkTable[pid][ppId][1];
												v7sendLog($_GLOBAL.faceCountMoreLinkTable[pid][ppId][0]+'_07_000_000',pid,'');
											}
										}
									};
								})(_morelink);
		_morelink.innerHTML = "更多>>";
		_more.appendChild(_morelink);
		_fragement.appendChild(_more);
		_clearit.className = "clearit";	// 清除浮动 DIV
		_fragement.appendChild(_clearit);				
		$E(this.option.sortNode).appendChild(_fragement);
		
		// 渲染推荐表情
		if($E(this.option.recommNode) != null){
			_fragement = document.createDocumentFragment();
			for(var i = 0; i < this.option.recommCount; i ++){
				_title = firstSort[i].name;
				var _code = firstSort[i].code;
				node = $C("a");
				node.href = "#";
				(function(val){
					node.onclick = Core.Function.bind3(function (key, title) {
							__this.option.clickCallback(key, title);
							var pid = scope.$pageid;
							if(pid) {
								val += '';
								val = val.length == 1 ? '0' + val : val;
								v7sendLog($_GLOBAL.faceCountRecommLinkTable[pid]+'_'+val+'_010_'+key,pid,'');
							}
							Core.Events.stopEvent();
							return false;
						}, null, [_code, _title]);
				})(i+8);
				node.hideFocus = true;
				node.innerHTML = '<img src="http://www.sinaimg.cn/uc/myshow/blog/misc/gif/' + _code + 'T.gif" alt="'
						+ _title + '" title="' + _title + '" />';
				_fragement.appendChild(node);
			}
			$E(this.option.recommNode).appendChild(_fragement);
		}
		
		var _sChildren = Lib.children($E('recomm_' + timpStamp).childNodes);
		
		for(i=0; _sChildren[i]; i++) {
			Core.Events.addEvent(_sChildren[i], (function(ele,val){
				return function() {
					var pid = scope.$pageid;
					if(pid) {
						var ppId = ele.parentNode.parentNode.id.split('_')[0];
						if(ppId) {
							scope.isFromtheCommonhzh = $_GLOBAL.faceCountMoreLinkTable[pid][ppId][1];
							v7sendLog($_GLOBAL.faceCountMoreLinkTable[pid][ppId][0]+'_0'+val+'_020_'+ele.getAttribute('key'),pid,'');
						}
					}
				};
			})(_sChildren[i],(i+1)), "mousedown");
		}
		
		count = first6sort = first6hot = firstSort = _fragement
			= _sorts = _more = _morelink = _clearit = _code = key = _title = node = null;
		
	}
};

/**
 * 从子节点中去掉空节点
 * @param {Array} 所有的子节点
 * @return 返回没有空节点的子节点数组
 */
Lib.children = function(chs) {
	var cArr = [];
	for(var i=0; chs[i]; i++) {
		if(chs[i].nodeType == 1) {
			cArr.push(chs[i]);
		}
	}
	return cArr;
};

App.insertSmilesDialog = function (sSortId, fCallback, sPositionNode, arrPosiPix) {
	App.insertSmilesDialog.callback = fCallback;
	if(scope.smileDialog == null){
		scope.smileDialog = new App.smilesDialog();
	}
	scope.smileDialog.setSort(sSortId, fCallback);
	var xy = Core.Dom.getXY($E(sPositionNode));
	var x = xy[0] + arrPosiPix[0];
	var y = xy[1] + arrPosiPix[1];
	scope.smileDialog.setPosition(x, y);
	scope.smileDialog.show();
};


// 包装的页面唯一表情浮层
/**
 * 
 * @param {Object} sTextarea	需要绑定的文本框节点
 * @param {Object} sSortNode	推荐分类节点
 * @param {Object} sRecommNode	推荐表情节点
 * @param {Object} fCallBack	点击某表情的回调函数
 * @param {Object} sPositionNode定位浮层的节点
 * @param {Object} arrPix		定位浮层的偏移量
 */
App.formInsertSmile = function (sTextarea, sSortNode, sRecommNode, fCallBack, sPositionNode, arrPix) {
	var _oTextNode = $E(sTextarea);
	var getPos = function(){
		if (_oTextNode.createTextRange){
			_oTextNode.caretPos = document.selection.createRange().duplicate();
		}
	};
	Core.Events.addEvent(_oTextNode, getPos, "keyup");
	Core.Events.addEvent(_oTextNode, getPos, "focus");
	Core.Events.addEvent(_oTextNode, getPos, "select");
	Core.Events.addEvent(_oTextNode, getPos, "click");
	new App.insertSmilesForm({
		sortNode		: sSortNode,
		clickCallback	: function (nCode, sName) {
			var faceValue = "[emoticons=" + nCode + "]" + sName + "[/emoticons]";
			if ($IE) {
				if (_oTextNode.createTextRange && _oTextNode.caretPos) {
					var caretPos = _oTextNode.caretPos;
					caretPos.text = caretPos.text.charAt(caretPos.text.length - 1) == ' ' ? faceValue + ' ' : faceValue;
					_oTextNode.focus();
		        } else {
					_oTextNode.value += faceValue;
					_oTextNode.focus();
		        }
			}else {
	            if (_oTextNode.setSelectionRange) {
	                var rangeStart = _oTextNode.selectionStart;
	                var rangeEnd = _oTextNode.selectionEnd;
	                var tempStr1 = _oTextNode.value.substring(0, rangeStart);
	                var tempStr2 = _oTextNode.value.substring(rangeEnd);
	                _oTextNode.value = tempStr1 + faceValue + tempStr2;
	            } else {
					_oTextNode.value += faceValue;
	            }
			}
			if(fCallBack){
				fCallBack();
			}
		},
		recommNode		: sRecommNode,
		positionNode	: sPositionNode || sSortNode,
		arrPosPix		: arrPix || [0, 0]
	});
};