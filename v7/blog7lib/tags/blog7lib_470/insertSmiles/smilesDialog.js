/**
 * @fileoverview
 *	博客正文页发表评论表单中的插入表情
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/sina.js");
$import("sina/core/dom/addHTML.js");
$import("sina/core/dom/setStyle.js");
$import("sina/core/dom/contains.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/string/trim.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/leftB.js");
$import("sina/utils/form/sinput.js");
$import("sina/utils/io/jsload.js");
$import("sina/ui/tab/tabs.js");

$import("lib/app.js");
$import("lib/dialogConfig.js");
$import("lib/sendLog.js");
$import("lib/insertSmiles/smilesTemplate.js");

App.smilesDialog = Core.Class.create();
App.smilesDialog.prototype = {
	pageSize		: 24,	// 每页最多显示多少个表情
	defaultConfig	: {	// 默认初始化配置
		sortId		: "0",
		htmlTpl		: App.smilesTemplate,
		callback	: function (){}
	},
	
	//	初始化
	initialize	: function(oOption){
		this.option = oOption || {};
		for(var key in this.defaultConfig){
			if(this.option[key] == null){
				this.option[key] = this.defaultConfig[key];
			}
		}
		this.dialog = new Dialog(this.option.htmlTpl);
		this.dialogNodes = this.dialog.getNodes();
		// 取得关键字数据，并渲染
		this.getKeyWord();

		// 如果存在数据，就用数据渲染，否则去读取接口获得
		if(scope.smilesData != null){
			this.data = scope.smilesData;
			this.dataSettle();
			this.eventListen();
		}else{
			var __this = this;
			var smileData = Utils.Io.JsLoad.request(
			[{	"url" : "http://www.sinaimg.cn/uc/myshow/blog/misc/gif/smileConfig.js?varname=smileConfig"
				, "charset"	: "GBK"}],
			{
				onComplete	: function(oData){
					scope.smilesData = oData;
					__this.data = oData;
					__this.dataSettle();
					__this.eventListen();
				},
				onException	: function () {}
			});
		}
		return this;
	},
	// 整理数据
	dataSettle	: function (oData, nCount) {
		oData = oData || this.data;
		nCount = nCount || 9;

		this.tabsData = [];	// 分类信息
		this.allData = [];	// 所有分类的表情
		
		for(var key in oData){	// 整理当前的全部表情数据，用于渲染全部分类
			var _item = oData[key];
			_item.sortId = key;
			this.tabsData.push(_item);
			for(var i = 0, len = _item.data.length; i < len; i ++){
				_item.data[i].sid = key;
				_item.data[i].sname = _item.name;
			}
			this.allData = this.allData.concat(_item.data);
		}
		if(this.allDataBack == null){	// 全部表情的备份，用于表情搜索
			this.allDataBack = this.allData.slice(0);	
		}
		this.showTab(1, nCount);
		// 如果右侧没有表情，就用全部表情渲染
		if(this.dialogNodes.smileList.childNodes.length == 0){ this.showAll(); }
	},
	
	children : function(chs) {
		var cArr = [];
		for(var i=0; chs[i]; i++) {
			if(chs[i].nodeType == 1) {
				cArr.push(chs[i]);
			}
		}
		return cArr;
	},
	
	//	显示 左侧 Tab
	showTab		: function (nPage, nCount){
		nPage = nPage || 1;
		nCount = nCount || 9;
		this.dialogNodes.sortList.innerHTML = "";
		this.dialogNodes.smileList.innerHTML = "";
		Core.Dom.setStyle(this.dialogNodes.sortList, "height", nCount == 9 ? "279px" : "217px");
		this.tabs = new Tabs(this.dialogNodes.sortList);
		this.tabsObject = {};	// 保存当前的 Tab 对象，用于切换
		var _this = this;
		for(var i = 0; i < nCount; i ++){	// 逐个创建左侧 Tab
			var _indexBase = (nPage - 1) * nCount;
			if(this.tabsData[_indexBase + i] == null){
				break;
			}
			var _sortId = this.tabsData[_indexBase + i].sortId;
			var _name = this.tabsData[_indexBase + i].name;
			var _data = this.tabsData[_indexBase + i].data;
			var tab = new Tab('<img src="http://www.sinaimg.cn/uc/myshow/blog/misc/gif/' + _sortId
						+ '.gif" height="20" width="20" align="absmiddle"><span><a href="#" onclick="return false;">'
						+ _name + '</a></span><em>(' + _data.length + ')</em>'
				, {
	            	isFocus		: false,
	            	className	: "cur"
				});
			tab.addOnAbort(Core.Function.bind3(function(tab){}, null, [tab]));
			tab.addOnFocus(Core.Function.bind3(function(tab, key, data,sid){
				_this.showSmile(data, 1, _this.pageSize);
				_this.currentTab = tab;
				_this.dialogNodes.allSort.style.fontWeight = 400;
				
				if(!_this.isFromUp) {
					var pId = scope.$pageid;
					if(pId) {
						var isComm = scope.isFromtheCommonhzh;
						if(isComm) {
							v7sendLog($_GLOBAL.faceChooseTable[pId][isComm]+'_16_020_'+sid, pId, '');
						}
					}
				}
				
				_this.isFromUp = null;
				
			}, null, [tab, _indexBase + i, _data,_sortId]));
			this.tabsObject[_sortId] = tab;
			this.tabs.add(tab);
		}
		// 计算 Tab 的页码
		var _tabPageCount = Math.ceil(this.tabsData.length/nCount);
		if(_tabPageCount > 0){
			this.showTabPage(nPage || 1, _tabPageCount, nCount);
		}else{
			this.dialogNodes.sortCtrl.innerHTML = "";
		}
	},
	//	控制右侧显示指定数据中第几页的表情，且含有每页的个数
	showSmile		: function (oData, nPage, nCount){
		var me = this;
		nCount = nCount || this.pageSize;
//		trace(">>显示表情 第" + nPage + "页，每页" + nCount + "个");
		var __this = this;
		var _smiles = oData;
		var _count = _smiles.length;
		var _totalPages = Math.ceil(_count/nCount);
		var _smilesDom = document.createDocumentFragment();
		var _pageLink;	// 翻页链接

		this.dialogNodes.smileList.innerHTML = "";
		for(var i = 0; i < nCount; i ++){	//	逐个写入表情
			var _smile = _smiles[(nPage - 1) * nCount + i];
			if(_smile == null){break;}
			var _li = $C("li");
			var _a = $C("a");
			_a.href = "#";
			_a.onclick = function(){return false;};
			_a.onmousedown = Core.Function.bind3(function (nCode, sName){
				__this.option.callback(nCode, sName); __this.hide();
			}, null, [_smile.code, _smile.name]);
			_a.innerHTML = '<img style="width:50px;height:50px;" src="http://www.sinaimg.cn/uc/myshow/blog/misc/gif/'
							+ _smile.code + 'T.gif" alt="' + _smile.name + '" title="' + _smile.name
							+ '" />';
			_li.appendChild(_a);
			_a.setAttribute('key',_smile.code);
			var _span = $C("span");
			_span.title = _smile.name;
			_span.innerHTML = Core.String.byteLength(_smile.name) > 8 ? Core.String.leftB(_smile.name, 6) + "…" : _smile.name;
			_li.appendChild(_span);
			_smilesDom.appendChild(_li);
			Core.Events.addEvent(_a, (function(ele){
				return function(){
					var pId = scope.$pageid;
					if(pId) {
						var isComm = scope.isFromtheCommonhzh;
						if(isComm) {
							v7sendLog($_GLOBAL.faceChooseTable[pId][isComm]+'_16_010_'+ele.getAttribute('key'), pId, '');
						}
					}
				};
			})(_a), "mousedown");
		}
		this.dialogNodes.smileList.appendChild(_smilesDom);
		
		// 控制表情的分页，如果有分页，控制翻页状态
		if(_count > nCount){
			if(nPage == 1){
				this.dialogNodes.smilePagePrev.innerHTML = "上一页";
			}else{
				this.dialogNodes.smilePagePrev.innerHTML = "";
				_pageLink = $C("a");
				_pageLink.href = "#";
				_pageLink.onclick = function (){ return false; };
				_pageLink.onmousedown = function () {
					__this.showSmile(_smiles, nPage - 1, nCount);
				};
				_pageLink.innerHTML = "上一页";
				this.dialogNodes.smilePagePrev.appendChild(_pageLink);
			}			
			this.dialogNodes.smilePageShow.innerHTML = nPage + "/" + _totalPages;
			if(nPage >= _totalPages){
				this.dialogNodes.smilePageNext.innerHTML = "下一页";
			}else{
				this.dialogNodes.smilePageNext.innerHTML = "";
				_pageLink = $C("a");
				_pageLink.href = "#";
				_pageLink.onclick = function (){ return false; };
				_pageLink.onmouseup = function () {
					__this.showSmile(_smiles, nPage + 1, nCount);
				};
				_pageLink.innerHTML = "下一页";
				this.dialogNodes.smilePageNext.appendChild(_pageLink);
			}			
		}else{	// 如果表情没分页，就将分页信息清空
			this.dialogNodes.smilePagePrev.innerHTML = "";
			this.dialogNodes.smilePageShow.innerHTML = "";
			this.dialogNodes.smilePageNext.innerHTML = "";
		}
	},
	//	左侧 Tab 的翻页箭头
	showTabPage	: function (nPageNum, nPageCount, nTabsPerPage){
//		trace("Tab 翻页：第" + nPageNum + " / " + nPageCount + "页");
		this.dialogNodes.sortCtrl.innerHTML = "";
		this.dialogNodes.smilePagePrev.innerHTML = "";
		this.dialogNodes.smilePageShow.innerHTML = "";
		this.dialogNodes.smilePageNext.innerHTML = "";
		var __this = this;
		var _arrow; // 箭头
		// 根据当前 Tab 的页码，控制箭头状态
		if(nPageNum == 1){
			if(nPageNum != nPageCount){	// 如果当前是第一页，且页码总数大于 1
				this.dialogNodes.sortCtrl.innerHTML = '<a href="#" onclick="return false;" title="向上" class="up_off"></a>';
				_arrow = $C("a");
				_arrow.href = "#";
				_arrow.onclick = function(){return false;};
				_arrow.title = "向下";
				_arrow.className = "down";
				_arrow.onmousedown = function (){
					__this.showTab(nPageNum + 1, nTabsPerPage);
					__this.showAll();
				};
				this.dialogNodes.sortCtrl.appendChild(_arrow);
			}else{	// 如果当前是第一页，且页码总数等于 1
//				this.dialogNodes.sortCtrl.innerHTML = '<a href="#" onclick="return false;" title="向上" class="up_off"></a>'
//                    + '<a href="#" onclick="return false;" title="向下" class="down_off"></a>';
			}
		}else if(nPageNum < nPageCount){	// 如果当前不是第一页，且当前页不是最后一页
			_arrow = $C("a");
			_arrow.href = "#";
			_arrow.onclick = function(){return false;};
			_arrow.title = "向上";
			_arrow.className = "up";
			_arrow.onmousedown = function (){
				__this.showTab(nPageNum - 1, nTabsPerPage);
				__this.showAll();
			};
			this.dialogNodes.sortCtrl.appendChild(_arrow);
			_arrow = $C("a");
			_arrow.href = "#";
			_arrow.onclick = function(){return false;};
			_arrow.title = "向下";
			_arrow.className = "down";
			_arrow.onmousedown = function (){
				__this.showTab(nPageNum + 1, nTabsPerPage);
				__this.showAll();
			};
			this.dialogNodes.sortCtrl.appendChild(_arrow);
		}else{	// 如果当前是最后一页
			_arrow = $C("a");
			_arrow.href = "#";
			_arrow.onclick = function(){return false;};
			_arrow.title = "向上";
			_arrow.className = "up";
			_arrow.onmousedown = function (){
				__this.showTab(nPageNum - 1, nTabsPerPage);
				__this.showAll();
			};
			this.dialogNodes.sortCtrl.appendChild(_arrow);
			Core.Dom.addHTML(this.dialogNodes.sortCtrl, '<a href="#" onclick="return false;" title="向下" class="down_off"></a>');
		}
	},
	//	增加事件监听
	eventListen	: function (){
		var __this = this;
		var _searchText = __this.dialogNodes.searchText;
		var _searchBtn = __this.dialogNodes.searchBtn;
		var _keywordBack = __this.dialogNodes.keyCtrlBack;
		var _allSort = __this.dialogNodes.allSort;
		var _smileEmptyBack = __this.dialogNodes.smileEmptyBack;

		// 浮层外的单击事件
		Core.Events.addEvent(document.body, function (cls){
			var _event = Core.Events.getEvent(), _eventTarget = ($IE) ? _event.srcElement : _event.target;
			if (__this.dialogNodes.entity != null 
					&& (Core.Dom.contains(__this.dialogNodes.entity, _eventTarget) == false || cls == true)) {
				__this.hide();
			}	
		});
		// 浮层关闭事件
		Core.Events.addEvent(this.dialogNodes.btnClose, function (){
			__this.hide();
		});		
		// 监听搜索框的聚焦、离焦及回车事件
		Core.Events.addEvent(_searchText, function (){
			if(Core.String.trim(_searchText.value) == "输入关键字、动漫形象"){
				_searchText.value = "";
				_searchText.style.color = "#000";
			}
			_searchText.select();
		}, "focus");
		Core.Events.addEvent(_searchText, function (){
			if(Core.String.trim(_searchText.value) == ""){
				_searchText.value = "输入关键字、动漫形象";
				_searchText.style.color = "#9b9b9a";
			}	 
		}, "blur");
		Core.Events.addEvent(_searchText, function (e){
			var _evt = Core.Events.getEvent();
			var _key = _evt.which || _evt.keyCode;
			var _keyword = Core.String.trim(_searchText.value);
			if(_key == 13 && _keyword != ""){
				__this.searchKey(_keyword);
			}	 
		}, "keydown");
		Utils.Form.limitMaxLen(_searchText, 20);
		// 搜索按钮
		Core.Events.addEvent(_searchBtn, function (){
			if(_searchText.value == "输入关键字、动漫形象" || _searchText.value == ""){
//				alert("请输入关键字");
			}else{
				__this.searchKey(_searchText.value);
				_searchText.focus();
			}

		});
		// 返回全部关键字链接
		var _backHome = function (){
			__this.dataSettle(__this.data, 9);
			__this.dialogNodes.keyCtrl.style.display = "none";
			__this.dialogNodes.smileEmpty.style.display = "none";
			__this.dialogNodes.smileList.style.display = "";
			__this.dialogNodes.searchText.value = "输入关键字、动漫形象";
			__this.dialogNodes.searchText.style.color = "#9b9b9a";
		};
		Core.Events.addEvent(_keywordBack, _backHome);
		// 搜索为空返回首页链接
		Core.Events.addEvent(_smileEmptyBack, _backHome);
		// “全部”链接
		Core.Events.addEvent(_allSort, function (){
			__this.showAll();
		});	
	},
	// 显示“全部”分类
	showAll		: function (){
		this.showSmile(this.allData, 1, this.pageSize);
		this.dialogNodes.allSort.style.fontWeight = 600;
		if(this.currentTab != null){
			this.currentTab.setAbort();
		}
	},
	//	设置默认展开的分类，并切换到该分类
	setSort		: function(sId, fCallback){
		this.isFromUp = sId;
		this.option.sortId = sId;
		this.option.callback = fCallback;
		// 展开指定的分类，如果没指定，就是全部分类
		if(sId == 0){
			this.dialogNodes.allSort.style.fontWeight = 600;
			this.dataSettle();
		}else{
			this.dataSettle();
			this.tabs.swapTags(this.tabsObject[sId]);
		}
	},
	//	获取表情关键字
	getKeyWord	: function () {
		if(this.keywordData != null){return;}
		var __this = this;
		var smileData = Utils.Io.JsLoad.request(
			"http://www.sinaimg.cn/uc/myshow/blog/misc/gif/smileKeywordConfig.js?varname=smileKeywordConfig&rnd="
					+ Math.random(),
		{
			onComplete	: function(oData){
				__this.keywordData = oData;
				// 渲染热门关键字列表
				var _hotkey = oData.E___00000000000 || "顶|路过|哭|啦啦|美女";
				var _hotDom = document.createDocumentFragment();
				_hotkey = _hotkey.split("|");
				for(var i = 0, len = _hotkey.length; i < len; i ++){// 创建推荐的热门关键字链接
					var _link = $C("a");
					_link.href = "#";
					_link.onclick = function(){return false;};
					_link.onmousedown = Core.Function.bind3(function(sHotkey){
						__this.searchKey(sHotkey);
					}, null, [_hotkey[i]]);
					_link.innerHTML = _hotkey[i];
					_hotDom.appendChild(_link);
				}
				if(__this.dialogNodes.hotKeyword.innerHTML == ""){
					__this.dialogNodes.hotKeyword.appendChild(_hotDom);
				}
				// 整理所有关键字
				var _hotKeyAll = "";
				for(var key in oData){
					if(key != "E___00000000000"){
						_hotKeyAll += "∑" + key + "§" + oData[key];
					}
				}
				__this.keywordStr = _hotKeyAll;
			},
			onException	: function () {}
		});
	},
	// 从关键字列表数据 this.keywordStr 里，查找出所有包含指定关键字的商品编号
	searchKey	: function (sHotkey){
		// 将用户输入关键字中的正则语法，替换为转义字符
		var _regSearchKey = sHotkey.replace(/([\\^$*+?{}.|])/gi, "\\$1");
		var searchReg = new RegExp("∑([^§]+)§[^∑]*" + _regSearchKey + "[^∑]*", "gi");
		var _resultArray = [];
		this.keywordStr.replace(searchReg, function(a, b){
			_resultArray.push(b);
		});
		_resultArray = _resultArray.join(",");
		// 根据搜索后的结果，重新生成表情渲染数据
		var _result = {};
		var _allData = this.allDataBack;
		var _len = _allData.length;
		var _count = 0;
		for(var i = 0; i < _len; i ++){
			if(_resultArray.indexOf(_allData[i].code) != -1 || _allData[i].sname.indexOf(sHotkey) != -1
						 || _allData[i].name.indexOf(sHotkey) != -1){
				if(_result[_allData[i].sid] == null){
					_result[_allData[i].sid] = {
						name	: _allData[i].sname,
						data	: []
					};
				}
				_result[_allData[i].sid].data.push(_allData[i]);
				_count ++;
			}
		}
		var pid = scope.$pageid;
		if(_count == 0){
			this.dialogNodes.smileEmpty.style.display = "";
			this.dialogNodes.smileList.style.display = "none";
			if(pid) {
				var isComm = scope.isFromtheCommonhzh;
				if(isComm) {
					v7sendLog($_GLOBAL.faceChooseTable[pid][isComm]+'_16_030_'+encodeURIComponent(sHotkey), pid, '');
				}
			}
		}else{
			this.dialogNodes.smileList.style.display = "";
			this.dialogNodes.smileEmpty.style.display = "none";
			if(pid) {
				var isComm = scope.isFromtheCommonhzh;
				if(isComm) {
					v7sendLog($_GLOBAL.faceChooseTable[pid][isComm]+'_16_031_'+encodeURIComponent(sHotkey), pid, '');
				}
			}
		}
		this.dataSettle(_result, 7);
		this.dialogNodes.keyCtrl.style.display = "";
		this.dialogNodes.keyWord.innerHTML = sHotkey.split("").join("<wbr/>");
		Core.Dom.setStyle(this.dialogNodes.sortList, "height", "217px");
	},
	// 设置浮层位置
	setPosition	: function(x, y){
		this.x = x;
		this.y = y;
		this.dialog.setPosition({x : x, y : y});
	},
	// 显示浮层
	show		: function (){
		this.dialogNodes.searchText.value = "输入关键字、动漫形象";
		this.dialogNodes.searchText.style.color = "#9b9b9a";
		this.dialog.show();
	},
	// 隐藏浮层
	hide		: function (){
		this.dialog.hidden();
		this.dialogNodes.keyCtrl.style.display = "none";
	}
};