/**
 * @fileoverview 推荐面板
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-10
 */

$import("sina/sina.js");
$import("sina/core/class/create.js");

$import("lib/panel.js");

$import("lib/dialogConfig.js");
$import("lib/component/commendation/commendationPanel.js");
$import("lib/component/commendation/commendationTemplate.js");

/**
 * 推荐面板类
 */
scope.Commendation=Core.Class.create();
scope.Commendation.prototype={
	/**
	 * 包含的所有子面板
	 */
	subPanels:[],
	
	/**
	 * 初始化
	 */
	initialize:function(){

	},
	
	/**
	 * 显示指定类型的面板
	 * @param {Number} type 面板类型
	 * 					1:聊天对话
	 * 					2:即时快报
	 * 					3:今日焦点
	 * 
	 * @param {String} content 要显示的内容
	 * @param {Number} time 显示的时间(毫秒)
	 */
	display:function(type,content,displayTime){
		var _this=this;
		switch(type){
			case 1 :
				var chat = new scope.CommendationPanel();
				chat.minTemplate=scope.chatMinTemplate;
				chat.title="消息提示 - 聊天对话";
				chat.content=content;
				
				chat.setTitle(chat.title);
				chat.setContent(chat.content);
				chat.showingTime=displayTime;
				chat.priority=1;
				this.subPanels.push(chat);
				break;
				
			case 2 :
				var urgency = new scope.CommendationPanel();
				urgency.minTemplate=scope.urgencyMinTemplate;
				urgency.title="消息提示 - 即时快报";
				urgency.content=content;
				
				urgency.setTitle(urgency.title);
				urgency.setContent(urgency.content);
				urgency.showingTime=displayTime;
				urgency.priority=2;
				this.subPanels.push(urgency);
				break;
				
			case 3:
				var todayFocus = new scope.CommendationPanel();
				todayFocus.minTemplate = scope.todayFocusMinTemplate;
				todayFocus.title = "消息提示 - 今日焦点";
				todayFocus.content = content;
				
				todayFocus.setTitle(todayFocus.title);
				todayFocus.setContent(todayFocus.content);
				todayFocus.showingTime = displayTime;
				todayFocus.priority = 3;
				this.subPanels.push(todayFocus);
				break;
		}
		
		//如果当前没有其它其它面板显示则显示新的面板
		var i, len = this.subPanels.length;
		var isShowing = false;
		for (i = 0; i < len; i++) {
			if (this.subPanels[i].state == "showing" || this.subPanels[i].state == "show") {
				isShowing = true;
				break;
			}
		}
		if (!isShowing) {
			this._showPanelWithRule();
		}
		
		
	},
	
	/**
	 * 按优先级显示各个面板
	 */
	 _showPanelWithRule:function(){
	 	var _this=this;
		
		//如果当前有dialog及其背景处于显示状态，则需要等待dialog及其背景关闭时才能继续显示面板
		if (dialogBackShadow && dialogBackShadow.isShow) {
			dialogBackShadow.onHidden = function(){
				_this._showPanelWithRule();
			};
		} else {
			var i, len = _this.subPanels.length;
			if (len > 0) {
				var cp = _this.subPanels[0].priority;
				var ci = 0;
				for (i = 1; i < len; i++) {
					if (cp > _this.subPanels[i].priority) {
						cp = _this.subPanels[i].priority;
						ci = i;
					}
				}
				_this.subPanels[ci].show();
				_this.subPanels[ci].onHidden = function(){
					_this.subPanels.splice(ci, 1);
					_this._showPanelWithRule();
				};
			}
		}
	}
	
};
