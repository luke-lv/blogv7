/**
 * @fileoverview 表情类
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-31
 */

$import("sina/sina.js");
$import("sina/core/system/br.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/leftB.js");
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/dom/getTop.js");
$import("sina/core/dom/getLeft.js");
$import("sina/ui/tab/tabs.js");
$import("sina/ui/dialog/dialog.js");
$import("sina/utils/io/jsload.js");

$import("lib/lib.js");
$import("lib/dialogConfig.js");
$import("lib/checkAuthor.js");
$import("lib/component/face/faceTemplate.js");

/**
 * 表情类
 */
Lib.Face=Core.Class.create();
Lib.Face.prototype = {
	
	/**
	 * 表情对话框对象
	 */
	dialog:null,
	
	/**
	 * 对话框节点
	 */
	dialogNodes:null,
	
	/**
	 * 标签集合对象
	 */
	tabs:null,
	
	/**
	 * 表情配置
	 */
	faceConfig:null,
	
	/**
	 * 对话框模板
	 */
	template:null,
	
	/**
	 * 可插入表情的文本框容器
	 */
	txtContentArea:null,
	
	/**
	 * 横坐标
	 */
	x:0,
	
	/**
	 * 纵坐标
	 */
	y:0,
	
	/**
	 * 是否已经显示
	 */
	isShowed:false,
	
	/**
	 * 是否已经初始化对话框
	 */
	_isInitDialog:false,
	
	/**
	 * 当前插入的图片文件
	 */
	insertImageFile:"",
	
	/**
	 * 初始化
	 * @param {Object} txtContentArea 插入表情文本区域
	 * @param {String} tpl 表情对话框模板
	 */
	initialize:function(txtContentArea, tpl){
		var _this = this;
		this.txtContentArea = txtContentArea;
		this.template=tpl;

		window.$insertFace = function(code,name){
			_this.insertFace(code,name);
		};
	},
	
	/**
	 * 装载表情对话框
	 */
	load:function(){
		var _this=this;
		this.dialog=new Dialog(this.template || scope.faceTemplate);
		this.dialogNodes=this.dialog.getNodes();
		this.tabs=new Tabs(this.dialogNodes["faceTab"]);
		
		Core.Events.addEvent(this.dialog.entity,function(){
			Core.Events.stopEvent();
		},"mousedown");
		
		Core.Events.addEvent(document.body,function(){
			_this.hidden();
		},"mousedown");
		
		this.initFaceConfig(function(){
			if (_this.tabs.tabsArr[0]) {
				_this.tabs.tabsArr[0].setFocus();
			}
			Core.Events.addEvent(_this.dialogNodes["btnClose"],function(){
				_this.hidden();
			},"mousedown");
			_this.onInitialized();
		});
		
		this._isInitDialog=true;
	},
	
	/**
	 * 初始化表情配置
	 * @param {Function} callBack 回调方法
	 */
	initFaceConfig:function(callBack){
		var _this=this;
		Utils.Io.JsLoad.request("http://www.sinaimg.cn/uc/myshow/blog/misc/gif/smileConfig.js?varname=smileConfig&"+(new Date()).getTime(), {
			onComplete: function(data){
				_this.faceConfig=data;
				_this.initFaceData();
				if(callBack){
					callBack();
				}
			},
			charset: "gb2312"
		});
	},
	
	/**
	 * 初始化表情数据
	 */
	initFaceData:function(){
		var k,_this=this;
		for(k in this.faceConfig){
			this.addTab(k,this.faceConfig[k]["name"],this.faceConfig[k]["data"]);
		}
	},
	
	/**
	 * 初始化完成后
	 */
	onInitialized:function(){
		
	},

	textWatchOn	: function (){
//		trace("Listen " + this.txtContentArea.id + " ...");
		var _oTextNode = this.txtContentArea;
		var getPos = function(){
			
			if (_oTextNode.createTextRange){
				_oTextNode.caretPos = document.selection.createRange().duplicate();
			}
//			trace("_oTextNode.caretPos : " + _oTextNode.caretPos);
		};
		Core.Events.addEvent(_oTextNode, getPos, "keyup");
		Core.Events.addEvent(_oTextNode, getPos, "focus");
		Core.Events.addEvent(_oTextNode, getPos, "select");
		Core.Events.addEvent(_oTextNode, getPos, "click");

	},
	/**
	 * 添加标签
	 * @param {String} key 标签Key
	 * @param {String} tabName 标签名称
	 * @param {Array} contentData 内容数据
	 */
	addTab:function(key,tabName,contentData){
		var _this=this;
		var tab=new Tab('<img src="http://www.sinaimg.cn/uc/myshow/blog/misc/gif/'+key+'.gif" height="20" width="20" align="absmiddle"><span><a href="#" onclick="return false;">'+tabName+'</a></span><em>('+contentData.length+')</em>', {
            isFocus: false,
            className: "cur"
		});
		
		tab.addOnAbort(function(){
			tab.content.style.display="none";
		});
		
		tab.addOnFocus(function(){
			//如果没有显示过该表情面板，则初始化表情面板的内容
			if (!tab.isShowed) {
				tab.isShowed = true;
				tab.content=$C("ul");
				tab.content.innerHTML=_this._getTabContent(key,contentData);
				_this.dialogNodes["faceContent"].appendChild(tab.content);
			}
			tab.content.style.display="";
		});
		this.tabs.add(tab);
	},
	
	/**
	 * 获取每个标签对应的数据内容
	 * @param {Object} key
	 * @param {Object} contentData
	 */
	_getTabContent:function(key,contentData){
		var str=[],faceName;
		var i,len=contentData.length;
		for(i=0;i<len;i++){
			faceName=contentData[i]["name"];
			faceName=Core.String.byteLength(faceName)>8?Core.String.leftB(faceName,6)+"...":faceName;
			str.push('<li><a onclick="$insertFace(\''+contentData[i]["code"]+'\',\''+contentData[i]["name"]+'\');return false;" href="#"><img style="width:50px;height:50px;" title="'+contentData[i]["name"]+'" src="http://www.sinaimg.cn/uc/myshow/blog/misc/gif/' + contentData[i]["code"] + 'T.gif"/></a><span>'+faceName+'</span></li>')
		}
		return str.join("");
	},
	
	/**
	 * 插入表情
	 * @param {String} code 表情代码
	 * @param {String} name 表情文字
	 */
	insertFace:function(code,name){
		//[emoticons=E___7101ZH05SIB]顶~[/emoticons]
		this.insertImageFile=code+"T.gif";
		this.onInsert();
		
		if(!this.txtContentArea){
			return;
		}
		
		var faceValue = "[emoticons=" + code + "]" + name + "[/emoticons]";
		if ($IE) {
			if (this.txtContentArea.createTextRange && this.txtContentArea.caretPos) {
				var caretPos = this.txtContentArea.caretPos;
				caretPos.text = caretPos.text.charAt(caretPos.text.length - 1) == ' ' ? faceValue + ' ' : faceValue;
				this.txtContentArea.focus();
	        } else {
				this.txtContentArea.value += faceValue;
				this.txtContentArea.focus();
	        }
		}
		else {
            if (this.txtContentArea.setSelectionRange) {
                var rangeStart = this.txtContentArea.selectionStart;
                var rangeEnd = this.txtContentArea.selectionEnd;
                var tempStr1 = this.txtContentArea.value.substring(0, rangeStart);
                var tempStr2 = this.txtContentArea.value.substring(rangeEnd);
                this.txtContentArea.value = tempStr1 + faceValue + tempStr2;
            }
            else {
				this.txtContentArea.value += faceValue;
            }
		}
		this.hidden();
		return false;
	},
	
	/**
	 * 插入表情时触发
	 */
	onInsert:function(){
		
	},
	
	
	/**
	 * 设置位置
	 * @param {Number} x
	 * @param {Number} y
	 */
	setPosition:function(x,y){
		this.x=x;
		this.y=y;
		this.dialog.setPosition({x:x,y:y});
	},
	
	/**
	 * 显示
	 */
	show:function(){
		!this._isInitDialog && this.load();
		this.dialog.show();
		this.isShowed=true;
	},
	
	/**
	 * 隐藏
	 */
	hidden:function(){
		this.isShowed=false;
		this.dialog.hidden();
	}
};