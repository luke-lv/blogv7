/**
 * @fileoverview
 *	登录用户名输入自动匹配，从 Blog V5 移植
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2008
 */

/**
 * 登录用户名输入自动匹配，从blog6移植修改
 * @author Random | YangHao@staff.sina.com.cn
 * @version 1.1
 * @create 2009-09-18
 */

$import("sina/sina.js");
$import("sina/core/system/br.js");
$import("sina/core/system/getScrollPos.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/function/bind3.js");

$import("lib/lib.js");

(function () {

	/**
		初始化的一些变量
		@author FlashSoft | fangchao@staff.sina.com.cn
	*/
	var _inputNode;
	var _rndID = parseInt(Math.random() * 100);
	/** 当前显示的菜单集合 */
	var _showMenuItems = [];
	/** 当前显示的菜单索引 */
	var _selectMenuIndex = -1;
	/** 被选中行的文字 */
	var _selectMenuText = "";
	/** 相关CSS */
	var _css = '#userPosition {padding: 0;margin: 0;border: 0;position: absolute;z-index: 999;}\
				#sinaNote {position: absolute;z-index: 999999;width: auto;overflow: hidden;padding: 0;margin: 0;\
				border: 1px solid #CCCCCC;background: #ffffff;text-align:left;}\
				#sinaNote li {font-size: 12px;list-style: none;margin: 0 1px;height: 20px;padding: 0 5px;clear: both;\
				line-height: 20px;cursor: pointer;color: #999999;}\
				#sinaNote li.note {text-align: left;color: #999999;}';
				
	var _viewWindow = window;
	var passcardOBJ = {
		// 鼠标经过背景颜色
		overfcolor: "#999",
		// 鼠标经过背景颜色
		overbgcolor: "#e8f4fc",
		// 鼠标离开字体颜色
		outfcolor: "#000000",
		// 鼠标离开背景颜色
		outbgcolor: "",
		menuStatus: {
			// 是否显示Sina邮箱
			"sina.com": true,
			
			// 是否显示Sina.cn邮箱
			"sina.cn": true,
			
			// 是否显示VIP邮箱 
			"vip.sina.com": true,
			
			"qq.com": true,
			"163.com": true,
			"126.com": true,
			"hotmail.com": true,
			"yahoo.com.cn": true,
			"gmail.com": true		
		
		}
	};
	/**
	 * 动态生成提示框
	 * add by xs @ 2008-3-4
	 */
	passcardOBJ.createNode = function(){
		var d = _viewWindow.document;
		var div = d.createElement('div');
		div.innerHTML = '<ul id="sinaNote" style="display:none;"></ul>';
		var obj = d.createElement("style");
		obj.setAttribute("type", "text/css")
		try{
			if ($IE) {
				obj.styleSheet.cssText = _css;
			}
			else{
				obj.innerHTML = _css;
			}
		}
		catch(e){trace(e.message);}
		var total = d.createElement("div");
		total.appendChild(div);
		total.appendChild(obj);
		d.body.appendChild(total);
	};
	/**
		快捷键选择菜单
		@author FlashSoft | fangchao@staff.sina.com.cn
	*/
	passcardOBJ.arrowKey = function (keyCodeNum) {
		if(keyCodeNum == 38) {// --
			if (_selectMenuIndex <= 0) {_selectMenuIndex = _showMenuItems.length;}
			_selectMenuIndex --;
			passcardOBJ.selectLi(_selectMenuIndex);
		}
		if(keyCodeNum == 40) {// ++
			if (_selectMenuIndex >= _showMenuItems.length - 1) {_selectMenuIndex = -1;}
			_selectMenuIndex ++;

			passcardOBJ.selectLi(_selectMenuIndex);
		}
	};
	passcardOBJ.showList = function(e)//显示列表
	{
		_selectMenuText = "";
		var keyCodeNum = Core.Events.getEvent().keyCode;
		if(keyCodeNum == 38 || keyCodeNum == 40)  {
			passcardOBJ.arrowKey(keyCodeNum);
			return false;
		}
		if (!$E('sinaNote')) {passcardOBJ.createNode();}
		var username = $E(e).value;
		var menuList = {};
		var atIndex = username.indexOf("@");
		var InputCase = "";
		var InputStr = "";
		if(atIndex > -1) {
			InputCase = username.substr(atIndex + 1);
			InputStr = username.substr(0, atIndex);
		}
		_showMenuItems = [];
		_selectMenuIndex = 0;
		_showMenuItems[_showMenuItems.length] = "sinaNote_MenuItem_Title_" + _rndID;
		for(var key in this.menuStatus) {
			this.menuStatus[key] = true;
			if(InputCase != "" && InputCase != key.substr(0, InputCase.length)) {
				this.menuStatus[key] = false;
			}
			else {
				_showMenuItems[_showMenuItems.length] = "sinaNote_MenuItem_" + key + "_" + _rndID;
			}
		}
		var listcontent = '<li class="note">请选择登录类型</li>';
		listcontent += '<li id="sinaNote_MenuItem_Title_'+_rndID+'">' + username + '</li>';
		var itemLabel;
		for(var mykey in this.menuStatus) {
			if(this.menuStatus[mykey] == true) {
				if(InputStr == "") {
					itemLabel = username + "@" + mykey;
				}
				else {
					itemLabel = InputStr + "@" + mykey;
				}
				listcontent += '<li id="sinaNote_MenuItem_' + mykey + '_' + _rndID + '" title="' + itemLabel + '">' + itemLabel + '</li>';
			}
		}
		$E("sinaNote").innerHTML = listcontent;
		for (var i = 0; i < username.length; i ++) {
			if (username.charCodeAt(i) < 0xA0) {
				$E("sinaNote").style.display = "";
				this.selectList(e);
			}
			else {
				this.hideList();
			}
		}
		/**
		 * 自动适应文本框的位置，及宽度
		 * add by xs @ 2008-3-3
		 */
		var el = $E(e);
		var note = $E("sinaNote");
		/**
			Iframe在父窗体的位置
			@author FlashSoft | fangchao@staff.sina.com.cn
		*/
		var frameLeft = 0;
		var frameTop = 0;
		var framePos;
		if(_viewWindow != window) {
			framePos = Core.Dom.getXY(window.frameElement);
			frameLeft = framePos[0];
			frameTop = framePos[1];
		}
		var inputWidth = el.offsetWidth;
		if(inputWidth < 200) {
			inputWidth = 200;
		}
		note.style.width = inputWidth - 2 + 'px';
		var inputXY = Core.Dom.getXY(el);
		note.style.left = (inputXY[0] - ($IE ? 2 : -1) + frameLeft) + 'px';
		note.style.top = (inputXY[1] + el.offsetHeight - ($IE ? 2 : -1) + frameTop) + 'px';
	};
	passcardOBJ.selectList = function(e)//选择列表
	{
		var unames = $E("sinaNote").getElementsByTagName("li");
		for (var i = 1; i < unames.length; i++) {
				unames[1].style.backgroundColor = passcardOBJ.overbgcolor;
				unames[1].style.color = passcardOBJ.outfcolor;//鼠标经过字体颜色
				unames[i].onmousedown = function(){
					var temp = this.innerHTML;
					if(temp.indexOf("非新浪邮箱")>-1){
						var pos=temp.split("@");
						$E(e).value=pos[0];
					}else{
						$E(e).value = this.innerHTML;
					}
					if (Core.Events.getEvent() != null) {
						Core.Events.stopEvent();
					}
				};
				unames[i].onmouseover = function(){
					if (i != 1) {
							unames[1].style.backgroundColor = passcardOBJ.outbgcolor;
							unames[1].style.color = passcardOBJ.overfcolor;//鼠标经过字体颜色
					}
					this.style.backgroundColor = passcardOBJ.overbgcolor;//鼠标经过背景颜色
					this.style.color = passcardOBJ.outfcolor;//鼠标经过字体颜色
				};
				unames[i].onmouseout = function(){
					this.style.backgroundColor = passcardOBJ.outbgcolor;//鼠标离开背景颜色
					this.style.color = passcardOBJ.overfcolor;//鼠标离开字体颜色
					unames[1].style.backgroundColor = passcardOBJ.overbgcolor;//鼠标经过背景颜色
					unames[1].style.color = passcardOBJ.outfcolor;//鼠标经过字体颜色
				};
		}
	};
	/**
		选中指定ID的li
		@author | fangchao@staff.sina.com.cn
	*/
	passcardOBJ.selectLi = function (nIndex) {
		var menuNode;
		$E("sinaNote_MenuItem_Title_"+_rndID).style.backgroundColor = passcardOBJ.outbgcolor;//鼠标离开背景颜色
		$E("sinaNote_MenuItem_Title_"+_rndID).style.color = passcardOBJ.overfcolor;//鼠标离开字体颜色
		for(var i = 0; i < _showMenuItems.length; i ++ ) {
			menuNode = $E(_showMenuItems[i]);
			menuNode.style.backgroundColor = passcardOBJ.outbgcolor;//鼠标离开背景颜色
			menuNode.style.color = passcardOBJ.overfcolor;//鼠标离开字体颜色
		}
		$E(_showMenuItems[nIndex]).style.backgroundColor = passcardOBJ.overbgcolor;//鼠标经过背景颜色
		$E(_showMenuItems[nIndex]).style.color = passcardOBJ.outfcolor;//鼠标经过字体颜色
		_selectMenuText = $E(_showMenuItems[nIndex]).innerHTML;
	};
	passcardOBJ.hideList = function()//隐藏列表
	{
		/**
		 * 如果没有找到页面中相应的对象，则自动创建
		 * add by xs @ 2008-3-3
		 */
		if (!$E('sinaNote')) {passcardOBJ.createNode();}
		$E("sinaNote").style.display = "none";
	};
	passcardOBJ.init = function (oNode, oColors, oFocusNode, oWindowTarget) {
		oWindowTarget = oWindowTarget || window;
		if(oWindowTarget.document.body == null){
			setTimeout(Core.Function.bind3(function () {
				this.init(oNode, oColors, oFocusNode, oWindowTarget);
			},this), 100);
		}
		for(var key in oColors) {
			this[key] = oColors[key];
		}
		Core.Events.addEvent(document, passcardOBJ.hideList, "click");
		Core.Events.addEvent(oNode, passcardOBJ.hideList, "blur");
		Core.Events.addEvent(oNode, Core.Function.bind3(passcardOBJ.showList,this, [oNode]), "keyup");
		Core.Events.addEvent(oNode, function (e) {
			var keyCodeNum = Core.Events.getEvent().keyCode;
			var isSinaMail;
			if(keyCodeNum == 13 || keyCodeNum == 9) {
				if(_selectMenuText != "") {
						var temp = _selectMenuText;
							if(temp.indexOf("非新浪邮箱") > -1){
								var pos = temp.split("@");
								oNode.value=pos[0]+"@";
								isSinaMail=false;
							}else{
								oNode.value = _selectMenuText;
								isSinaMail=true;
							}
				}
				if (isSinaMail) {
					if (oFocusNode != null) {
						setTimeout(function(){
							oFocusNode.focus();
						}, 0);
					}
				}else{
					if(oNode){
						oNode.focus();
					}
				}
				//Core.Events.stopEvent();
			}
		}, "keydown");
		if (oWindowTarget) {_viewWindow = oWindowTarget;}
	};
	Lib.passcardOBJ = passcardOBJ;
})();