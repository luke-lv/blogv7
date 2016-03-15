/**
 * @desc	百合应用对话框预初始化实现
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("comps/baihe/_baihe.js");
$import("comps/baihe/dialog/IDialog.js");

$import("comps/oop.js");
$import("sina/core/events/addEvent.js");
$import("sina/ui/dialog/windowDialog.js");
$import("sina/ui/dialog/backShadow.js");


Baihe.Dialog = function(opt){
	opt = opt || {};
	this.onShow		= opt.onShow || function(){};
	this.onClose	= opt.onClose || function(){};
	
	this.nodes;
	this.dialogMgr;
	
}.$implements(Baihe.IDialog).$defineProto({
	
	initDialogTemplate:function(dialogName, template){
		var shadow = new BackShadow(0.4);
		var cfg = {};
		
		// 对话框组件接受的自定义必须参数，三个
		cfg.tpl = this.template || template;	// 自定义模板
		cfg.content = cfg.content || "";		// 支持 #{id} 模板，进入 #{content} 节点（如果有的话），觉得意义不大。
		cfg.title = cfg.title || "";			// 进入 #{titleName} 节点（如果有的话），拖动条的文字标题。
		
		if(!cfg.tpl) throw new Error("对话框模板参数 template 缺失");
		if(!dialogName) dialogName = "defaultName";
		
		// 节点获取、对话框设置。恩，是 alert
		this.dialogMgr = new Sina.Ui.WindowDialog(shadow, {"alert": cfg.tpl}).createCustomsDialog(cfg, dialogName);
		this.dialogMgr.setMiddle();
		this.nodes = this.dialogMgr.nodes;
	},
	
	initDialogEvents:function(){
		var _this = this;
		if(this.nodes.btnCls)
		Core.Events.addEvent(this.nodes.btnCls, function(){		// 关闭窗口
			_this.hide();
		}, "click");
	},
	
	show:function(){
		this.dialogMgr.show();
		this.onShow();
	},
	
	hide:function(){
		this.dialogMgr.hidden();
		this.onClose();
	},
	
	setTitle:function(newTitle){
		if(this.nodes.titleName)
		this.nodes.titleName.innerHTML = newTitle || "提示";
	}
	
});



