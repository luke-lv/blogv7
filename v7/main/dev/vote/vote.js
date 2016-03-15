/*
 Vote object renders its dom and implement its function
 _init initializates vote dom,add event to the dom
 */
$import("sina/core/events/addEvent.js");
$import("sina/core/events/fireEvent.js")
$import("sina/core/function/bind2.js");
$import("sina/utils/form/sinput.js");
$import("sina/core/string/format.js");
$import("sina/core/string/trim.js");
$import("sina/core/string/stringBuffer.js");
$import("sina/core/string/leftB.js");
$import("lib/dialogConfig.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/function/bind2.js");
$import("vote/voteDom.js");
$import("vote/DateUtil.js");
$import("vote/domEvent.js");
$import("sina/utils/form/_form.js");
$import("sina/sina.js");
$import("sina/core/events/getEvent.js");

/**
 * Vote object
 * itemNum : 当前投票有多少选项;
 * vData 是可选项,如果undefined，表示新建投票,调用_build()方法；
 * 否则表示当前博文有投票，默认显示投票为保存状态,即_save(vData)方法;
 */

/**
 * @fileoverview
 *	限制单行文本框的输入和内容
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2008.12.03
 */

/**
 * 限制指定文本框(INPUT type="text")的长度
 * @param {HtmlElement} el		[必选参数]需要监听的单行文本框对象
 * @param {Number} nLength		[必选参数]限制输入的长度，这里默认指的是字节，中文算两个字节
										  如果希望中文算一个字符，请把可选参数doubleByte 设置为 false
 * @param {Object}				[可选参数] 以下参数均为可选
 *		{
 *			limitRe : /a|b/,	//禁止输入的字符，用正则表达式表示，比如/a|b/表示限制输入字母a和b
 			doubleByte : true	//字符计算规则，默认为true表示中文算两字符长度，false表示中文算一个字符长度
 *		}
 * @example
	// 限制myinput文本框只能输入10字符，中文算2字符
	Utils.Form.inputListen($E("myinput"), 10);
	
	// 限制myinput文本框只能输入10字符，中文算1字符
	Utils.Form.inputListen($E("myinput"), 10, {
			doubleByte : false
		});

	// 限制myinput文本框只能输入10字符，中文算2字符且不允许输入字符a
	Utils.Form.inputListen($E("myinput"), 10, {
			limitRe : /a/,
			doubleByte : false
		});
	
	//错误的实例：
	Utils.Form.inputListen($E("myinput"), "abc");		//请不要把长度设置成非数字类型
	Utils.Form.inputListen($E("myinput"));			//请不要遗漏输入长度限制参数
 */

var voteNums = 15,
    _CFG_ASTATUS = articleEditorCFG.articleStatus;
if(_CFG_ASTATUS=='7'){_CFG_ASTATUS='3';} //对7来说，与3的规则一样

inputListen = function(el, nLen, oOption){

		el = $E(el);
		if (typeof nLen != "undefined") {
			nLen = isNaN(nLen) ? null : nLen * 1;
		}
		// 如果必选参数不足或者参数el不是HTML节点，则返回
		if (el == null || nLen == null || el.nodeType != 1) {
			return false;
		}

		oOption = oOption || {};
		var limitRe = oOption.limitRe;
		var doubleByte = oOption.doubleByte;
		doubleByte = doubleByte == null ? true : doubleByte;
		
		var userinput = function(){
			// 如果按键是左右方向键，不做处理
			try{
				var evt = Core.Events.getEvent();
				if(evt){
					var keyCode = evt.which || evt.keyCode;
					if(keyCode == 37 || keyCode == 39){
						return false;
					}
				}
			}catch(e){}
			var nLength = el.max;
			// 如果有受限字符，就替换掉
			while (limitRe != null && limitRe.test(el.value)) {
				
				el.value = el.value.replace(limitRe, "");
			}
			// 如果中文算双字节，就每次计算 maxLength
			if (doubleByte == true) {
				if (Core.String.byteLength(el.value) > nLength) {
					var str = el.value.substr(0, nLength);
					while (Core.String.byteLength(str) > nLength) {
						str = str.replace(/.$/, "");
					}
					el.value = str;
					el.maxLength = str.length;
				}
				else {
					el.maxLength = nLength - el.value.replace(/[\x00-\xff]/g, "").length;
				}
			}
			else {
				el.maxLength = nLength;
			}
			if(nLength < el.value){
					el.value = el.value.substr(0, nLength);
			}
		};
		// 文本框失去焦点的时候过滤受限字符
		var Blur = function(){
			if (limitRe != null && limitRe.test(el.value)) {
				el.value = el.value.replace(limitRe, "");
			}
		};
		
		// 用自定义属性来记录当前文本框允许输入的长度
		el.max = nLen;
		el.maxLength = nLen;
		userinput();
		// 如果被绑定过监听事件，就不再绑定
		if (el.beWatched == null) {
			el.beWatched = true;
			// 给对象绑定监听事件
			if (!$IE) {
				Core.Events.addEvent(el, userinput, "input");
			}
			else {
				Core.Events.addEvent(el, userinput, "keyup");
			}
			Core.Events.addEvent(el, Blur, "blur");
		}		
};


var Vote = function(vData){
	if(typeof window.vote_modify == 'undefined')
		window.vote_modify = false;
	
    window.itemNum;
    this.state = "edit";
    if (typeof vData != 'undefined') {
        window.itemNum = vData.items.length;
    }
    else 
        window.itemNum = 5;
		
	//window.current = window.itemNum;
    
	//trace("----INIT"+window.itemNum);
	
    $E("addVote").innerHTML = voteDom['build'];
    
    if (typeof vData == 'undefined') {
        this._build();
    }
    else {
        this._save(vData);
    }
    return this;
};

/**
 * build 方法用于创建和修改当前投票；如果vData不是undefined，即为编辑，否则为新建；
 * 编辑状态也有两个状态，即编辑博文状态和草稿箱页面不同；
 * 所以用_CFG_ASTATUS来区别3种页面的不同；
 */
Vote.prototype._build = function(vData){
	this.setBlogVote('yes');
	
	window.vote_modify = true;
	
	var items = $N('voteData[]');
	var itemLen = items.length;
	this._panel = $E("voteItems");
	
	var _this = this;
	
	inputListen($E('voteTitle'), 50);
	
	//过滤字符
	Core.Events.addEvent($E('voteTitle'), 
	function()
	{
		$E('voteTitle').value = Core.String.trim($E('voteTitle').value.replace(/(<|>|\\|\/|&|'|")/g, ''));	
	}, 'blur');
	
	//删除之前所有的东西
	$E('voteItems').innerHTML = '';
	
	//重新添加所需要的东西
	//需判断VDATA是否为空
	if(typeof vData == 'undefined')
	{
		window.itemNum = 5;
		for (var i = 0; i < 5; i++) {
			this._addItem();
		};
		
		$E('newOne').onclick = function()
		{
			for (var i = 0; i < 5; i++) {
				if (window.itemNum > (voteNums-1)) 
					return false;
				
				window.itemNum++;
				_this._addItem();
				
				if (window.itemNum >= voteNums) 
					$E("newOne").style.display = 'none';
				
				_this.updateIndex();
			}
			return false;
		}
		
		window.built = true;
		_this.initDate();
	}
	else {
		_this.setValue(vData);
		_this.setItems(vData);
		
		if((_CFG_ASTATUS == '2' || _CFG_ASTATUS == '3') && !window.built)
		{
			if(window.itemNum >= voteNums)
				$E('newOne').style.display = "none";
				
			$E('newOne').onclick = function(){
				for (var i = 0; i < 5; i++) {
					if (window.itemNum > (voteNums-1)) 
						return false;
					
					window.itemNum++;
					
					_this._addItem();
					
					if (window.itemNum >= voteNums) 
						$E("newOne").style.display = 'none';
					
					_this.updateIndex();
				}
				return false;
			}
			
			window.built = true;
		}
	}
	
	_this.updateIndex();
    
    //保存按钮的事件绑定
    $E('saveBtn').onclick = function(){
		if (Core.String.byteLength($E("voteTitle").value) == 0) {
            winDialog.alert($SYSMSG["B00909"], {
                icon: "01"
            });
            return false;
        }
		
        if (Core.String.byteLength($E("voteTitle").value) < 10) {
            winDialog.alert($SYSMSG["B00905"], {
                icon: "01"
            });
            return false;
        }
		
		var selectedDate = new Date($E('year').value, $E('month').value-1, $E('day').value, $E('hh').value, 0, 0);
		if(_this.expired(selectedDate, new Date()))
		{
			winDialog.alert($SYSMSG["B00907"], {
                icon: "01"
            });
            return false;
		}
        
        var _counter = 0, _itemlist = [];
        
        for (var k = 0; k < document.getElementsByName("voteData[]").length; k++) {
            var item = document.getElementsByName("voteData[]")[k];
            
            if (item.value != "") {
                _itemlist.push(item.value);
                _counter++;
            }
        }
		window.itemNum = _counter;
        if (_counter < 2) {
            winDialog.alert($SYSMSG["B00906"], {
				funcOk:function(){
					var inputs=$T($E('voteItems'),'input');
					for(var i=0;i<inputs.length;i++)
						if(inputs[i].value=='')
							inputs[i].focus();
				},
                icon: "01"
            });
            return false;
        }
		
		var tempTitle = $E('voteTitle').value;
		
		trace(tempTitle+"----REPLACE TITLE TEMP");
		
        var et = $E('year').value + "-" + $E('month').value + "-" + $E('day').value + '-' + $E('hh').value;
        var vData = {
			// voteId: $E('voteId').value,
            title: tempTitle,
            items: _itemlist,
            expireTime: et,
            type: $E("rad1").checked ? 1 : ($E("mutiple").value)
        };
		
		//articleEditorCFG.articlevData = vData;
		
		_this.setBlogVote('yes');
		
        _this._save(vData);
        
		return false;
    }
    
};

/**
 * 更新旁边的选择INDEX
 */
Vote.prototype.updateIndex = function() {
	if($E('chooseIndex')) {
		var length = window.itemNum;
		var list = "";
		for(var i=1;i<=length;i++) {
			list += "<li>选项"+i+"</li>";
		}
		$E('chooseIndex').innerHTML = list;
	}
};

/**
 * 初始化日期数据
 */
Vote.prototype.initDate = function()
{
	window.date = new DateSelector({
		dict: ['year', 'month', 'day', 'hh'],
		to: 'm-2',
		from: $E("timestamp").value
		//from:'2008-02-29 10'
	});
};

/**
 * 设置VDATA不为空时的数据,除li item
 */
Vote.prototype.setValue = function(vData)
{
	if(!window.vote_modify)
	{
		//trace("----SET VOTEID----");
		//$E('voteId').value = articleEditorCFG.articlevData.voteId;
		//trace("----VOTEID----"+$E('voteId').value);
		window.vote_modify = true;
	}
    $E("voteTitle").value = vData.title;
	if(_CFG_ASTATUS == 2) {
		$E("voteTitle").style.color = "#999999";
	}
    var _t = vData['type'];
    if (_t >= 2) {
		$E('rad2').checked = true;	
	}
	else {
		$E('rad1').checked = true;
		$E("mutiple").style.display = 'none';
		
		$E('voteType').value = 1;
	}
    if (_CFG_ASTATUS == '2' && articleEditorCFG.articlevData != null) {
		$E("voteTitle").readOnly = "true";
		$E("voteTitle").readOnly = "true";
		$E("voteTitle").style.backgroundAttachment = "scroll";
		$E("voteTitle").style.backgroundColor = "#E7E7E7";
		$E("voteTitle").style.backgroundImage = "none";
		$E("voteTitle").style.backgroundPosition = "0";
		$E("voteTitle").style.backgroundRepeat = "repeat";
		$E("voteTitle").onkeydown = function() {
			if(event.keyCode == 8)
				return false;
		};
		$E('rad2').disabled = true;
		$E('rad1').disabled = true;
	}
    if (_t > 1) {
		$E("mutiple").style.display = '';
		$E("mutiple").options[_t - 2].selected = true;
		if (_CFG_ASTATUS == '2') 
			$E("mutiple").disabled = true;
		else if(_CFG_ASTATUS == '3')
			$E('mutiple').disabled = false;
			
		$E('voteType').value = $E('mutiple').value;
	}
	if(_CFG_ASTATUS == '2' && articleEditorCFG.articlevData != null) {
		var value = vData.votePos;
		if(value == 1) {
			$E('votePos1').checked = true;
			$E('votePos2').checked = false;
		}else {
			$E('votePos1').checked = false;
			$E('votePos2').checked = true;
		}
	}
    
	//日期选择器
    if (typeof date == 'undefined') {
		window.date = new DateSelector({
			dict: ['year', 'month', 'day', 'hh'],
			from: vData.startTime,
			to: 'm-2'
		});
	}
};

/**
 * VDATE不为空时的li item数据
 */
Vote.prototype.setItems = function(vData)
{
	//trace("SET ITEMS----"+vData.items.length);
	window.itemNum = vData.items.length;
	window.current = window.itemNum - 1;
	if(window.itemNum <= 5 && _CFG_ASTATUS == 3)
	{
		window.itemNum = 5;
	}
	for(var j=0;j<window.itemNum;j++)
	{
		this._addItem(vData.items[j], "edit");
	}
};

/**
 * 把ele元素转换为js对象
 * @author dg.Liu | dongguang@staff.sina.com.cn
 */
Vote.prototype.toData = function(){
    var data = {};
    
    var title = $E("voteTitle").value;
    if (!title || title == "") {
        return null;
    }
	
	//title = title;
	//trace(title+"----REPLACE TITLE");
	
    //标题
    data.title = title;
    
    //过期时间
    var dateArray = [];
    dateArray.push($E("year").value);
    dateArray.push($E("month").value);
    dateArray.push($E("day").value);
    data.expireTime = dateArray.join("-") + " " + $E("hh").value;
    
    //投票选项
    data.items = [];
    var itemsEle = $E("voteItems");
    var items = itemsEle.getElementsByTagName("input");
    var len = items.length;
    for (var i = 0; i < len; i++) {
        if (items[i].type == "text") {
            data.items.push(items[i].value);
        }
    }
    return data;
    
};
/**
 * 比较数据，看是否有修改
 * @author dg.Liu | dongguang@staff.sina.com.cn
 */
Vote.prototype.compare = function(odata,eData){
	var eleData=eData||this.toData();
	if (window.vote_status != 'new') {
		if (odata.expireTime == eleData.expireTime) {
			if (odata.items.length == eleData.items.length) {
				//trace("----COMPARE TRUE");
				return true;
			}
		}
	}
	//trace("----COMPARE FALSE");
	return false;
};

/**
 * 设置 blogVote 属性值 
 * yes 保存
 * no 删除投票
 * noedit 编辑时未做任何修改	
 * @author dg.Liu | dongguang@staff.sina.com.cn
 */
Vote.prototype.setBlogVote = function(value){
	var value=value||"yes";
	if($E("editorForm").blogVote){
	    $E("editorForm").blogVote.value = value;
		//trace("----BLOG VOTE "+value);
	}
};

/**
 * 获取 blogVote 属性值 
 * @author dg.Liu | dongguang@staff.sina.com.cn
 */
Vote.prototype.getBlogVote = function(){
	if($E("editorForm").blogVote){
	    return $E("editorForm").blogVote.value;
	}
	return false;
};

/**
 * 添加按钮功能函数
 * @param {Object} itemValue
 */
Vote.prototype._addItem = function(itemValue, type){
    var lis = this._panel.getElementsByTagName("li");
	var _this = this;
	
    var oneItem = $C("li");
    this._panel.appendChild(oneItem);
    
	oneItem.innerHTML = voteDom["newItem"].format("delItem-" + (parseInt(Math.random()*899999+100000)));
    var oneInput = oneItem.getElementsByTagName("input")[0];
	var oneDel = oneItem.getElementsByTagName("a")[0];
    
    inputListen(oneInput, 40);
	//赋值
    if (typeof itemValue != 'undefined') {
		oneInput.value = itemValue;
	}
	if(type == 'edit') {
		oneInput.style.color = "#999999";
	}
	
	oneInput.onblur = function() {
		//Utils.Form.functionlimit(this,Core.String.trim,true);
		this.value = this.value.replace(/(<|>|\\|\/|&|'|")/ig, '');
	};
	
	if (_CFG_ASTATUS == '2' && articleEditorCFG.articlevData != null) {
		var oldNum = articleEditorCFG.articlevData ? articleEditorCFG.articlevData.items.length : 2;
		trace("window.current "+window.current);
		
		if(typeof window.current == 'undefined')
		{
			window.current = 0;
		}
		
		if (window.itemNum - window.current> oldNum) {
			Core.Events.addEvent(oneDel, function(){
				if (window.itemNum <= 2) {
					return false;
				}
				
				window.itemNum--;
				
				if (window.itemNum < voteNums) {
					trace(window.itemNum);
					$E('newOne').style.display = "";
				}
				Core.Dom.removeNode(this.parentNode);
				
				_this.updateIndex();
			}.bind2(oneDel), 'click');
		}
		else {
			if (articleEditorCFG.articlevData != null) {
				oneInput.readOnly = "true";
				oneInput.style.backgroundAttachment = "scroll";
				oneInput.style.backgroundColor = "#E7E7E7";
				oneInput.style.backgroundImage = "none";
				oneInput.style.backgroundPosition = "0";
				oneInput.style.backgroundRepeat = "repeat";
				oneInput.onkeydown = function() {
					if(event.keyCode == 8)
						return false;
				};
				oneDel.style.display = "none";
			}
		}
		window.current--;
	}
	else {
		Core.Events.addEvent(oneDel, function(){
			if (window.itemNum <= 2) {
				try {
					this.parentNode.childNodes[0].value = "";
				}catch(error) {}
				return false;
			}
			
			window.itemNum--;
			
			if (window.itemNum < voteNums) {
				//trace(window.itemNum);
				$E('newOne').style.display = "";
			}
			Core.Dom.removeNode(this.parentNode);
			
			_this.updateIndex();
		}.bind2(oneDel), 'click');
	}
	return false;
};

//保存功能 
Vote.prototype._save = function(vData){
	
	if(!window.vote_modify)
	{
		trace("----ACCESS IN NOEDIT----");
		this.setBlogVote('noedit');
	}
	
	trace("393 rows:"+this.getBlogVote());
	
    $E("newStatus").style.display = 'none';
    $E("saveStatus").style.display = "block";
    $E("saveStatus").innerHTML = voteDom['saveItem'].format("投票：" + vData.title);
    var str = new Core.String.StringBuffer();
	
	trace(vData.items.length+"----ITEM SAVE");
	
	// 对VDATA进行处理
	var tempData = [];
	for(var index=0;index<vData.items.length;index++)
	{
		if(vData.items[index] != "")
		{
			tempData.push(vData.items[index]);
		}
	}
	
	vData.items = [];
	vData.items = tempData;
	trace(vData.items.length+"----OPER LENGTH");
	
	
    if ($E("newStatus").style.display != 'none' && $E("rad1").checked || vData.type < 2) {
        for (var j = 0; j < vData.items.length; j++) {
            if (j < 2) {
				str.append("<span><input type='radio' id='rdx_" + j + "' name='rdxs' disabled/>");
				str.append("<label for='rdx_" + j + "'>" + Core.String.leftB(vData.items[j], 20) + (Core.String.byteLength(vData.items[j]) > 20 ? "..." : "") + "</label>");
				str.append("</span>");
			}
			else {
				str.append("<span>");
				str.append("&nbsp;...");
				str.append("</span>");
				break;
			}
        }
    }
    else {
        var mutipleNum = vData.type;
        for (var j = 0; j < vData.items.length; j++) {
            if (j < 2) {
				str.append("<span><input type='checkbox' id='rdx_" + j + "' name='rdxs' disabled/>");
				str.append("<label for='rdx_" + j + "'>" + Core.String.leftB(vData.items[j], 20) + (vData.items[j].length > 20 ? "..." : "") + "</label>");
				str.append("</span>");
			}
			else {
				str.append("<span>");
				str.append("&nbsp;...");
				str.append("</span>");
				break;
			}
        }
    }

    $E("voteArea").innerHTML = str.toString();
    this.state = "saved";
	
    Core.Events.addEvent("editBtn", function(){
        this._edit(vData);
		if(window.itemNum < voteNums) {
			$E('saveBtn').style.display = '';
		}
    }.bind2(this), 'click', false)
	
	var isBefore = false;
	if (articleEditorCFG.articlevData != null) {
		var tArr = articleEditorCFG.articlevData.expireTime.split(" ");
		var dateArr = tArr[0].split("-");
		var expireFlag = new Date(dateArr[0], parseInt(trimHeadZero(dateArr[1])) - 1, dateArr[2], tArr[1], 0, 0);
		
		isBefore = this.expired(expireFlag, new Date());
	}
	if (_CFG_ASTATUS == '3' && !window.built) {
		trace("----FIRE EVENT----");
		Core.Events.fireEvent("editBtn", "click");
	}
	else if (isBefore && _CFG_ASTATUS != '3') {
        $E("editBtn").style.display = 'none';
		$E("vote_expired").innerHTML += "(已过期)";
    }
	
	return false;
};

//保存状态下的编辑操作

Vote.prototype._edit = function(vData){
	this.setBlogVote('yes');
	
    this.state = "edit";
    $E("newStatus").style.display = '';
    $E("saveStatus").style.display = 'none';
    
	if (articleEditorCFG.articlevData != null) {
        //虽然voteId没有用了，但是后台根据该参数判断是否是编辑投票
		$E("voteId").value = 1; 
	}
	
    if (typeof vData != 'undefined') 
        this._build(vData);
};

Vote.prototype.show = function(){
    if ($E("addVote").style.display == 'none') 
        $E("addVote").style.display = '';
};

Vote.prototype.expired = function(date1, date2)
{
	trace((date1+" "+date2));
	return (date1.getTime()-date2.getTime()<0);
};

window.changeType = function(flag){
	if (flag) {
		$E('voteType').value = 2;
		$E('mutiple').style.display = "inline";
	}
	else
	{
		$E('voteType').value = 1;
		$E('mutiple').style.display = "none";
	}
};

