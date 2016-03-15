/**
 * @fileoverview 托盘类
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-07-31
 */
$import("sina/sina.js");
$import("sina/core/class/define.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/addEvent.js");

$import("lib/component/platformTray/templates/trayTemplate.js");
$import("lib/panel.js");

/**
 * 托盘类,继承于Panel类
 */
scope.Tray=Core.Class.define(Lib.Panel.prototype.initialize,Lib.Panel,{
	/**
	 * 包含的子面板
	 */
	subPanels:[],
	
	/**
	 * 更新模板
	 * @param {String} mode 模板的呈现方式
	 * 					"login"：已经登录状态
	 * 					"logout": 未登录状态
	 */
	updateTemplate:function(mode){
		mode=mode || "logout";
		var hashTemplate={
			"login":scope.trayTemplayLogin,
			"logout":scope.trayTemplayLogout
		};
		this.setTemplate(hashTemplate[mode]);
	},
	
	/**
	 * 添加子面板
	 * @param {Object} panel 面板对象
	 * @param {Object} dom 面板显示时所依赖的dom节点
	 * @param {Number} offsetLeft x的偏移量
	 * @param {Number} offsetTop y的偏移量
	 * @param {String} name 面板名称
	 */
	addSubPanel:function(panel,dom,offsetLeft,offsetTop,name){
		var _this=this;
		panel.name=name;
		this.subPanels.push(panel);
		
		//面板的显示
		function _showPanel(){
			Core.Events.stopEvent();
			
			//隐藏其它子面板
			var i,len=_this.subPanels.length;
			for(i=0;i<len;i++){
				_this.subPanels[i].hidden();
			}
			
			//根据所依赖的dom显示当前面板
			panel.showWithDom(dom,offsetLeft,offsetTop);
		}
		
		Core.Events.addEvent(dom,function(){
			_showPanel();
		},"click");
		
		
		Core.Events.addEvent(document.body,function(){
			panel.hidden();
		},"click");
		Core.Events.addEvent(panel.entity,function(){
			Core.Events.stopEvent();
		},"mousedown");
	},
	
	/**
	 * 移除子面板
	 * @param {String} name 面板名称
	 */
	removePanel:function(name){
		var i, len = this.subPanels.length;
		for (i = 0; i < len; i++) {
			if (subPanels[i].name == name) {
				subPanels.splice(i,1);
			}
		}
	}
});