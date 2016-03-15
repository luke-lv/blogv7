/*
 * Copyright (c) 2009, Sina Inc. All rights reserved. 
 * @ClassName WindowDialog
 * @FileOverview 用户接口的对话框类(每个产品可以自己去实现)
 * @Author Random | YangHao@sina.staff.com.cn
 * @Created 2009-05-15
 * @Updated 2009-06-01
 * @Updated 2009-08-30
 */

$import("sina/core/system/parseParam.js");
$import("sina/core/system/winSize.js");
$import("sina/core/system/br.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/ui/dialog/dialog.js");
$import("sina/ui/dialog/dialogManager.js");
$import("sina/ui/dialog/backShadow.js");
$import("sina/ui/dialog/customsDialog.js");
$import("sina/ui/dialog/layerTemplate.js");

(function() {
	/**
	 * @param {Object} objTemplate 对话框模板的对象
	 * @param {Object} backShadow 对话框的阴影实例
	 */
	var WindowDialog=function(backShadow,objTemplate){
		this.template=objTemplate || {};
		
		//初始化对话框管理类的影阴对象
		DialogManager.backShadow=backShadow;
	};
	
	WindowDialog.prototype={
		/**
		 * 显示图标配置
		 *	"01":[!]
		 *  "02":[×]
		 *  "03":[√]
		 *  "04":[?]
		 */
		iconSet:{
			"01":{"class":"SG_icon SG_icon201","alt":"警告"},
			"02":{"class":"SG_icon SG_icon202","alt":"失败"},
			"03":{"class":"SG_icon SG_icon203","alt":"成功"},
			"04":{"class":"SG_icon SG_icon204","alt":"询问"},
            // 新版提示框
            "06":{"class":"SG_icon SG_icon148","alt":"警告"}
		},
		
		/**
		 * @param {String}  text 对话框显示的文本
		 * @param {Object}  cfg 对话框的配置参数
		 * 						funcOk {Function} "确定"按钮执行的方法
		 * 						textOk {String} "确定"按钮的文本
		 * 						funcClose {Function} "关闭"按钮执行的方法
		 * 						title {String} 标题
		 * 						icon {String} 显示图标 ["01","01","03","04"]
		 * 						width {Number} 宽度
		 * 						height {Number} 高度
		 * 						subText {String} 次级文本
		 * 						funcDisplaied {Function} 特效显示完成
		 * 						funcDisplayFinished {Function} 特效消失完成
		 * 
		 * @param {String}  name 对话框的名称
		 */
		alert:function(text,cfg,name){
			cfg=cfg||{};
			var dialog=DialogManager.create(cfg.template || this.template.alert || LayerTemplate.alert,name);
			var win = Core.System.winSize();
			var nodes=dialog.getNodes();
			
			dialog.onDisplaied=cfg["funcDisplaied"];
			dialog.onDisplayFinished=cfg["funcDisplayFinished"];
			
			dialog.setSize({
				width: cfg["width"],
				height: cfg["height"]
			});
			
//			if (!$IE6) {
//				dialog.getProperty().displayMode = "alpha";
//			}
			dialog.setFixed(true);
			this._setDialogMiddle(dialog);
			
			dialog.show();
			dialog.setAreaLocked(true);
			
			//按钮默认聚焦
			nodes.linkOk.focus();
			
			nodes.text.innerHTML=text;
			if (nodes.titleName) {
				nodes.titleName.innerHTML = cfg["title"] || "提示";
			}
			if (nodes.icon) {
				nodes.icon.className = cfg["icon"] ? this.iconSet[cfg["icon"]]["class"] : this.iconSet["01"]["class"];
				nodes.icon.alt = cfg["icon"] ? this.iconSet[cfg["icon"]]["alt"] : this.iconSet["01"]["alt"];
			}
			nodes.ok.innerHTML=cfg["textOk"] || "确定";
			if (nodes.subText) {
				nodes.subText.innerHTML = cfg["subText"] || "";
			}
			dialog.getProperty().focusNode=nodes.linkOk;
			
			//节点事件绑定
			Core.Events.addEvent(nodes.btnOk,function(){
				if (cfg["funcOk"] && dialog.getProperty().enabled) {
					cfg["funcOk"]();
					Core.Events.stopEvent();
				}
				dialog.close();
				return false;
			},"click");
			Core.Events.addEvent(nodes.linkOk,function(){
				var e = Core.Events.getEvent();
				if (e.keyCode == "13") {
					if (cfg["funcOk"] && dialog.getProperty().enabled) {
						cfg["funcOk"]();
					}
					dialog.close();
				}
			},"keydown");
			
			Core.Events.addEvent(nodes.btnClose,function(){
				if (cfg["funcClose"] && dialog.getProperty().enabled) {
					cfg["funcClose"]();
				}
				dialog.close();
			},"click");
			
			//取消关闭按钮的事件冒泡
			Core.Events.addEvent(nodes.btnClose,function(){
				var e = Core.Events.getEvent();
				e.cancelBubble=true;
			},"mousedown");
			
		},
				
		/**
		 * @param {String}  text 对话框显示的文本
		 * @param {Object}  cfg 对话框的配置参数
		 * 						funcOk {Function} "确定"按钮执行的方法
		 * 						textOk {String} "确定"按钮的文本
		 * 						funcClose {Function} "关闭"按钮执行的方法
		 * 						title {String} 标题
		 * 						icon {String} 显示图标 ["01","01","03","04"]
		 * 						width {Number} 宽度
		 * 						height {Number} 高度
		 * 						subText {String} 次级文本
		 * 						funcDisplaied {Function} 特效显示完成
		 * 						funcDisplayFinished {Function} 特效消失完成
		 * 
		 * @param {String}  name 对话框的名称
		 */
		newAlert : function(text,cfg,name){
            cfg.template = this.template.newAlert;
            this.alert(text, cfg, name);
        },
		/**
		 * @param {String}  text 对话框显示的文本
		 * @param {Object}  cfg 对话框的配置参数
		 * 						funcOk {Function} 点击"确定"按钮执行的方法
		 * 						textOk {String} "确定"按钮的文本
		 * 						funcCancel {Function} 点击"取消"按钮执行的方法
		 * 						textCancel {String} "取消"按钮的文本
		 * 						funcClose {Function} "关闭"按钮执行的方法 
		 * 						defaultButton {Number} 要聚焦的按钮，1 表示"确定"按钮默认聚焦，0 表示"取消"按钮默认聚焦，默认是"确定"按钮聚焦
		 * 						title {String} 标题
		 * 						icon {String} 显示图标 ["01","01","03","04"]
		 * 						width {Number} 宽度
		 * 						height {Number} 高度
		 * 						subText {String} 次级文本
		 * 						funcDisplaied {Function} 特效显示完成
		 * 						funcDisplayFinished {Function} 特效消失完成
		 * 
		 * @param {String}  name 对话框的名称
		 */
		confirm:function(text,cfg,name){
			cfg=cfg||{};
			var dialog=DialogManager.create(cfg.template || this.template.confirm || LayerTemplate.confirm, name);
			var win = Core.System.winSize();
			var nodes=dialog.getNodes();
			
			dialog.onDisplaied=cfg["funcDisplaied"];
			dialog.onDisplayFinished=cfg["funcDisplayFinished"];
			
			dialog.setSize({
				width: cfg["width"],
				height: cfg["height"]
			});

//			if (!$IE6) {
//				dialog.getProperty().displayMode = "alpha";
//			}
			dialog.setFixed(true);
			this._setDialogMiddle(dialog);
	
			dialog.show();
			dialog.setAreaLocked(true);
			
			//按钮默认聚焦
			if (cfg["defaultButton"] == 0) {
				nodes.linkCancel.focus();
				dialog.getProperty().focusNode=nodes.linkCancel;
			}else{
				nodes.linkOk.focus();
				dialog.getProperty().focusNode=nodes.linkOk;
			}
			
			nodes.text.innerHTML=text;
			if (nodes.titleName) {
				nodes.titleName.innerHTML = cfg["title"] || "提示";
			}
			if (nodes.icon) {
				nodes.icon.className = cfg["icon"] ? this.iconSet[cfg["icon"]]["class"] : this.iconSet["04"]["class"];
				nodes.icon.alt = cfg["icon"] ? this.iconSet[cfg["icon"]]["alt"] : this.iconSet["04"]["alt"];
			}

			nodes.ok.innerHTML=cfg["textOk"] || "确定";
			nodes.cancel.innerHTML=cfg["textCancel"] || "取消";
			if (nodes.subText) {
				nodes.subText.innerHTML = cfg["subText"] || "";
			}
			
			
			//节点事件绑定
			Core.Events.addEvent(nodes.btnOk,function(){
				if (cfg["funcOk"] && dialog.getProperty().enabled) {
					cfg["funcOk"]();
					Core.Events.stopEvent();
				}
				dialog.close();
				return false;
			},"click");
			Core.Events.addEvent(nodes.linkOk,function(){
				var e = Core.Events.getEvent();
				if (e.keyCode == "13") {
					if (cfg["funcOk"] && dialog.getProperty().enabled) {
						cfg["funcOk"]();
					}
					dialog.close();
				}
			},"keydown");
			
			Core.Events.addEvent(nodes.btnCancel,function(){
				if (cfg["funcCancel"] && dialog.getProperty().enabled) {
					cfg["funcCancel"]();
					Core.Events.stopEvent();
				}
				dialog.close();
				return false;
			},"click");
			Core.Events.addEvent(nodes.linkCancel,function(){
				var e = Core.Events.getEvent();
				if (e.keyCode == "13") {
					if (cfg["funcCancel"] && dialog.getProperty().enabled) {
						cfg["funcCancel"]();
					}
					dialog.close();
				}
			},"keydown");
			
			Core.Events.addEvent(nodes.btnClose,function(){
				if (cfg["funcClose"] && dialog.getProperty().enabled) {
					cfg["funcClose"]();
					Core.Events.stopEvent();
				}
				dialog.close();
				return false;
			},"click");
			
			//取消关闭按钮的事件冒泡
			Core.Events.addEvent(nodes.btnClose,function(){
				var e = Core.Events.getEvent();
				e.cancelBubble=true;
			},"mousedown");
		},
        
		/**
		 * @param {String}  text 对话框显示的文本
		 * @param {Object}  cfg 对话框的配置参数
		 * 						funcOk {Function} 点击"确定"按钮执行的方法
		 * 						textOk {String} "确定"按钮的文本
		 * 						funcCancel {Function} 点击"取消"按钮执行的方法
		 * 						textCancel {String} "取消"按钮的文本
		 * 						funcClose {Function} "关闭"按钮执行的方法 
		 * 						defaultButton {Number} 要聚焦的按钮，1 表示"确定"按钮默认聚焦，0 表示"取消"按钮默认聚焦，默认是"确定"按钮聚焦
		 * 						title {String} 标题
		 * 						icon {String} 显示图标 ["01","01","03","04"]
		 * 						width {Number} 宽度
		 * 						height {Number} 高度
		 * 						funcDisplaied {Function} 特效显示完成
		 * 						funcDisplayFinished {Function} 特效消失完成
		 * 
		 * @param {String}  name 对话框的名称
		 */
		newConform : function(text,cfg,name){
            cfg.template = this.template.newConfirm;
            this.confirm(text, cfg, name);
        },
		
		/**
		 * @param {Object}  cfg 对话框的配置参数
		 * 						title {String} 标题
		 * 						url {String} iframe的地址
		 * 						width {Number} 宽度
		 * 						height {Number} 高度
		 * 						fixed {Boolean}	是否使用Fixed方式显示,默认为false
		 * 
		 * @param {String}  name 对话框的名称
		 */
		showIframe:function(cfg,name){
			cfg=cfg||{};
			var dialog=DialogManager.create(this.template.iframe || LayerTemplate.iframe,name);
			var win = Core.System.winSize();
			var nodes=dialog.getNodes();
			
			dialog.setSize({
				width: cfg["width"] || 320,
				height: cfg["height"] || 150
			});
			
			//如果当前的横坐标或纵坐标为负(超出了窗口的上边距或左边距),则将其设为0
			var _x=win.width / 2 - dialog.getProperty().width / 2 < 0 ? 0 : win.width / 2 - dialog.getProperty().width / 2;
			var _y=win.height / 2 - dialog.getProperty().height / 2 < 0 ? 0 :win.height / 2 - dialog.getProperty().height / 2;
			
			if (cfg["fixed"]) {
				//fixed状态下相对于窗口可见区域居中
				dialog.setPosition({
					x: _x,
					y: _y
				});
			}else{
				//非fixed状态下要加上滚动条的滚动距离
				dialog.setPosition({
					x: _x + document.documentElement.scrollLeft,
					y: _y + document.documentElement.scrollTop
				});
			}
			
			if (!$IE6) {
				dialog.getProperty().displayMode = "alpha";
			}
			
			dialog.setFixed(!!cfg.fixed);
			dialog.show();
			dialog.setAreaLocked(true);
			
			nodes.titleName.innerHTML=cfg["title"] || "";
			nodes.iframe.src=cfg["url"] || "about:blank";
			//节点事件绑定
			Core.Events.addEvent(nodes.iframe,function(){
				nodes.iframe.style.display="";
				nodes.loadState.style.display="none";
			},"load");
			
			Core.Events.addEvent(nodes.btnClose,function(){
				dialog.close();
			},"click");
			
			//取消关闭按钮的事件冒泡
			Core.Events.addEvent(nodes.btnClose,function(){
				var e = Core.Events.getEvent();
				e.cancelBubble=true;
			},"mousedown");
		},
		/**
		 * 创建自定义对话框
		 * @param {Object} cfg
		 * 					content 对话框的内容(支持模板方式)
		 * 					title 标题
		 * 					width 宽度
		 * 					height 高度
		 * 					help 帮助链接
		 * 					tpl 对话框的模板
		 * 					funcDisplaied {Function} 特效显示完成
		 * 					funcDisplayFinished {Function} 特效消失完成 				
		 * @param {String} name 对话框的名称
		 */
		createCustomsDialog:function(cfg,name){
			
			cfg=cfg||{};
			var customsDialog=new CustomsDialog(cfg.tpl || this.template.customs || LayerTemplate.customs,name);
			cfg.content && customsDialog.setContent(cfg.content);
			customsDialog.setTitle(cfg.title || "提示");
			customsDialog.setHelp(cfg.help || "");
			//customsDialog.setSize(cfg.width || 320,cfg.height || 150);
			customsDialog.setClose("hidden");
			customsDialog.setOnDisplaied(cfg["funcDisplaied"]);
			customsDialog.setOnDisplayFinished(cfg["funcDisplayFinished"]);
			
			return customsDialog;
		},
		
		/**
		 * 获取指定名称的对话框实例
		 * @param {Object} name 对话框的名称
		 */
		getDialog:function(name){
			return DialogManager.getDialog(name);
		},
		
		/**
		 * 关闭指定名称的对话框实例
		 * @param {Object} name 对话框的名称
		 */
		close:function(name){
			DialogManager.close(name);
		},
		
		/**
		 * 设置居中
		 * @param {Object} dialog
		 */
		_setDialogMiddle:function(dialog){
			var win = Core.System.winSize();
			var nodes=dialog.getNodes();
			var _x,_y;
			
			//获取对话框显示的初始状态
			var displayState=dialog.entity.style.display;
			
			//先将对话框放到不可见区域显示，以取到其offsetWidth和offsetHeight
			dialog.setPosition({
				x: -10000
			});
			dialog.entity.style.display="";
			
			//将Y坐标置于黄金分割比的位置上
			var titleBarOffsetHeight=nodes.titleBar ? nodes.titleBar.offsetHeight : 0;
			var areaHeight=win.height - nodes.content.offsetHeight - titleBarOffsetHeight;
			var goldenSection=(Math.sqrt(5)-1)/2;
			var totalSection=1;
			var goldenSectionY=areaHeight * goldenSection / (goldenSection + totalSection);
			
			
			//fixed状态下相对于窗口可见区域居中
			_x=win.width / 2 - nodes.content.offsetWidth / 2;
			_x=_x < 0 ? 0 : _x;	
			_y=goldenSectionY < 0 ? 0 : goldenSectionY;
			
			//非fixed状态下要加上滚动条的滚动距离
			if (!dialog.getProperty().isFixed) {
				_x=_x + document.documentElement.scrollLeft;
				_y=_y + document.documentElement.scrollTop;
			}
			
			//取到对话框offsetWidth和offsetHeight并通过计算出其居中的位置后再将其设为初始状态
			dialog.entity.style.display=displayState;
			
			dialog.setPosition({
				x:_x,
				y:_y
			});
		}
	};
	
	Sina.Ui.WindowDialog=WindowDialog;
})();
