/**
 * @fileoverview 模态对话框
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-10-26
 */

$import("sina/sina.js");
$import("sina/core/class/oop.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/ui/ui.js");
$import("sina/ui/dialog.js");
$import("sina/ui/panel.js");
$import("sina/core/dom/setStyle.js");

Ui.ModuleDialog=function(tplConfig,iconSet,cfg){
	this.__bgShadow=null;
	this.__dialog=null;
	this.__isInitBgShadow=false;
	this.__tplConfig=tplConfig;
	this.__iconSet=iconSet;
	this.__dialogQueue=[];
	this.__zIndex = (cfg && cfg.zIndex) || 5000;
	this.__cfg=cfg || {};
	
	this.__initDialogEvent();
}.$define({
	
	/**
	 * @param {String}  text 对话框显示的文本
	 * @param {Object}  cfg 对话框的配置参数
	 * 						funcOk {Function} "确定"按钮执行的方法
	 * 						textOk {String} "确定"按钮的文本
	 * 						funcClose {Function} "关闭"按钮执行的方法
	 * 						funcBeforeClose {Function} 点"关闭"按钮后,对话框在关闭前执行的方法
	 * 						title {String} 标题
	 * 						icon {String} 显示图标 ["01","01","03","04"]
	 * 						width {Number} 宽度
	 * 						height {Number} 高度
	 * 						subText {String} 次级文本
	 * 						bgShadowOpacity {Number} 背景阴影层的透明度 0-1,小于0为不显示
	 * 						renderer {IRenderer} 实现呈现方式接口的类
	 * 						dragger {IDragger} 实现拖拽方式接口的类
	 * 						isAdamant {Boolean} 是否显示背景iframe以挡住select/flash之类的讨厌的东东
	 */
	alert:function(text,cfg){
		cfg=cfg || {};
		var dlg=this.__createMessageDialog(cfg.tplConfig || this.__tplConfig.alert, cfg);
		dlg.nodes.text && (dlg.nodes.text.innerHTML=text || "");
		
		dlg.show(cfg.renderer || this.__cfg.renderer)
			.addEventListener("hidden",function(){
				this.destroy();
			});
		dlg.nodes.linkOk && dlg.nodes.linkOk.style.display!=="none" && dlg.nodes.linkOk.focus();
		return dlg;
	},

	/**
	 * @param {String}  text 对话框显示的文本
	 * @param {Object}  cfg 对话框的配置参数
	 * 						funcOk {Function} "确定"按钮执行的方法
	 * 						textOk {String} "确定"按钮的文本
	 * 						funcClose {Function} "关闭"按钮执行的方法
	 * 						funcBeforeClose {Function} 点"关闭"按钮后,对话框在关闭前执行的方法
	 * 						title {String} 标题
	 * 						icon {String} 显示图标 ["01","01","03","04"]
	 * 						width {Number} 宽度
	 * 						height {Number} 高度
	 * 						subText {String} 次级文本
	 * 						bgShadowOpacity {Number} 背景阴影层的透明度 0-1,小于0为不显示
	 * 						renderer {IRenderer} 实现呈现方式接口的类
	 * 						dragger {IDragger} 实现拖拽方式接口的类
	 * 						isAdamant {Boolean} 是否显示背景iframe以挡住select/flash之类的讨厌的东东
	 */
	newAlert : function(text,cfg,name){
        cfg.tplConfig = this.__tplConfig.newAlert;
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
	 * 						funcBeforeClose {Function} 点"关闭"按钮后,对话框在关闭前执行的方法 
	 * 						defaultButton {Number} 要聚焦的按钮，1 表示"确定"按钮默认聚焦，0 表示"取消"按钮默认聚焦，默认是"确定"按钮聚焦
	 * 						title {String} 标题
	 * 						icon {String} 显示图标 ["01","01","03","04"]
	 * 						width {Number} 宽度
	 * 						height {Number} 高度
	 * 						subText {String} 次级文本
	 * 						bgShadowOpacity {Number} 背景阴影层的透明度 0-1,小于0为不显示
	 * 						renderer {IRenderer} 实现呈现方式接口的类
	 * 						dragger {IDragger} 实现拖拽方式接口的类
	 * 						isAdamant {Boolean} 是否显示背景iframe以挡住select/flash之类的讨厌的东东
	 */
	confirm:function(text,cfg){
		cfg=cfg || {};
		
		var dlg=this.__createMessageDialog(cfg.tplConfig || this.__tplConfig.confirm, cfg),
			me=this;
			
		dlg.nodes.text && (dlg.nodes.text.innerHTML=text || "");
		
		if(dlg.nodes.btnCancel){
			dlg.nodes.btnCancel.innerHTML=cfg.textCancel || "取消";
			Core.Events.addEvent(dlg.nodes.btnCancel,function(){
				cfg.funcCancel && cfg.funcCancel.call(dlg);
				dlg.hidden(cfg.renderer || me.__cfg.renderer);
				Core.Events.stopEvent();
			},"click");
			dlg.nodes.linkCancel && Core.Events.addEvent(dlg.nodes.linkCancel,function(){
				var e = Core.Events.getEvent();
				if (e.keyCode == "13") {
					cfg.funcCancel && cfg.funcCancel.call(dlg);
					dlg.hidden(cfg.renderer || me.__cfg.renderer);
				}
			},"keydown");
		}

		dlg.show(cfg.renderer || me.__cfg.renderer)
			.addEventListener("hidden",function(){
				this.destroy();
			});
			
		if(cfg.defaultButton==0){
			dlg.nodes.linkCancel && dlg.nodes.linkCancel.style.display!=="none" && dlg.nodes.linkCancel.focus();
		}else{
			dlg.nodes.linkOk && dlg.nodes.linkOk.style.display!=="none" && dlg.nodes.linkOk.focus();
		}
		return dlg;
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
	newConfirm : function(text,cfg,name){
        cfg.tplConfig = this.__tplConfig.newConfirm;
        this.confirm(text, cfg, name);
    },
	/**
	 * 创建自定义对话框
	 * @param {Object} cfg
	 * 					content 对话框的内容(支持模板方式)
	 * 					funcBeforeClose {Function} 点"关闭"按钮后,对话框在关闭前执行的方法
	 * 					funcClose {Function} "关闭"按钮执行的方法
	 * 					title 标题
	 * 					width 宽度
	 * 					height 高度
	 * 					bgShadowOpacity {Number} 背景阴影层的透明度 0-1,小于0为不显示
	 * 					tpl 对话框的模板
	 * 					isAdamant {Boolean} 是否显示背景iframe以挡住select/flash之类的讨厌的东东
	 * @param {String} name 对话框的名称
	 */
	create:function(cfg){
		var me=this;
		
		cfg=cfg || {};
		var dlg=new Ui.Dialog();
		dlg.setTemplate(cfg.tpl || this.__tplConfig.customs);
		cfg.content && dlg.setContent(cfg.content);
		cfg.width && !isNaN(cfg.width) && dlg.setSize({width:cfg.width});
		cfg.height && !isNaN(cfg.height) && dlg.setSize({height:cfg.height});
		return this.__initDialog(dlg,cfg);
	},
	
	__initDialogEvent:function(){
		var queue=this.__dialogQueue;
		Core.Events.addEvent(document,function(){
			var e = Core.Events.getEvent();
			if (queue.length && e.keyCode == "27") {
				queue[queue.length-1].hidden();
			}
		},"keydown");
	},
	
	__createMessageDialog:function(tpl,cfg){
		var dlg=new Ui.Dialog(),
			me=this,
			i;

		dlg.setTemplate(tpl);

		cfg.width && !isNaN(cfg.width) && dlg.setSize({width:cfg.width});
		cfg.height && !isNaN(cfg.height) && dlg.setSize({height:cfg.height});
		
		dlg.nodes.subText && (dlg.nodes.subText.innerHTML=cfg.subText || ""); 
		if(dlg.nodes.icon){
			dlg.nodes.icon.className=this.__iconSet[cfg.icon || "01"]["class"];
			dlg.nodes.icon.alt=this.__iconSet[cfg.icon || "01"]["alt"];
		}
		if(dlg.nodes.btnOk){
			dlg.nodes.btnOk.innerHTML=cfg.textOk || "确定";
			Core.Events.addEvent(dlg.nodes.btnOk,function(){
				dlg.hidden(cfg.renderer || me.__cfg.renderer);
				cfg.funcOk && cfg.funcOk.call(dlg);
				Core.Events.stopEvent();
			},"click");
		}

		dlg.nodes.linkOk && Core.Events.addEvent(dlg.nodes.linkOk,function(){
			var e = Core.Events.getEvent();
			if (e.keyCode == "13") {
				dlg.hidden(cfg.renderer || me.__cfg.renderer);
				cfg.funcOk && cfg.funcOk.call(dlg);
			}
		},"keydown");
		
		dlg.setDragger(cfg.dragger || me.__cfg.dragger)
			.setFixed(true)
			.setAreaLocked(true);
		
		return this.__initDialog(dlg,cfg);
	},
	
	/**
	 * 初始化对话框，初始化标题栏、关闭按钮、显示的位置和模式及拖拽的模式
	 */
	__initDialog:function(dlg,cfg){
		var me=this;
		cfg.zIndex && (me.__zIndex = cfg.zIndex);
		dlg.nodes.titleName && (dlg.nodes.titleName.innerHTML=cfg.title || "提示");
		
		if(dlg.nodes.btnClose){
			Core.Events.addEvent(dlg.nodes.btnClose,function(){
				var isCanHidden=true;
				cfg.funcBeforeClose && (isCanHidden=cfg.funcBeforeClose.call(dlg) !== false);		
				cfg.funcClose && cfg.funcClose.call(dlg);
				isCanHidden && dlg.hidden();
			},"click");
			Core.Events.addEvent(dlg.nodes.btnClose,function(){
				Core.Events.stopEvent();
			},"mousedown");
		}
		dlg.setPosition({z:cfg.zIndex || me.__zIndex});
		dlg.setRenderer(cfg.renderer || this.__cfg.renderer);
		dlg.setDragger(cfg.dragger || this.__cfg.dragger);
		dlg.setMiddle();
		dlg.addEventListener("beforeHidden",function(){
				me.__updateDialogQueue(this,"remove");
			});
		dlg.addEventListener("beforeShow",function(){
				this.nodes.panel.parentNode.appendChild(this.nodes.panel);
				var that=this;
				if(!me.__isInitBgShadow){
					me.__initBGShadow(this,cfg.isAdamant || me.__cfg.isAdamant);
				}
				me.__setBGShadowOpacity(cfg.bgShadowOpacity!==0?cfg.bgShadowOpacity || 0.4:cfg.bgShadowOpacity);
				window.setTimeout(function(){
					me.__bgShadow.show();
					me.__updateDialogQueue(that,"add");
				},1);
			});
			
			
		//动态绑定一些方法，兼容之前的版本，以后可去掉
		dlg.setTitle=function(title){
			this.nodes.titleName && (this.nodes.titleName.innerHTML=title);
		};
		dlg.setHelp=function(url){
			this.nodes.btnHelp && (this.nodes.btnHelp.href=url);
		};
		dlg.close=function(){
			this.hidden();
		};
		dlg.getNodes=function(){
			return this.nodes;
		};
		dlg.getX=function(){
			return this.x;
		};
		dlg.getY=function(){
			return this.y;
		};
		dlg.getWidth=function(){
			return this.width;
		};
		dlg.getHeight=function(){
			return this.height;
		};
		
		return dlg;
	},
	
	/**
	 * 初始化背景阴影层
	 */
	__initBGShadow:function(dlg,isAdamant){
		var w=this.__getDocumentSize().width,
			h=this.__getDocumentSize().height,
			me=this;
			
		this.__bgShadow=new Ui.Panel();
		this.__bgShadow.setTemplate('<div id="#{panel}" style="background-color:black"></div>')
			.setSize({
				width:w,
				height:h
			})
			.setAdamant(isAdamant)
			.setFixed(true)
			.setPosition({x:0,y:0,z:me.__zIndex});

		Core.Events.addEvent(window,function(){
			me.__bgShadow.setPosition({
				x:0, y:0
			})
			.setSize({
				width:me.__getDocumentSize().width,
				height:me.__getDocumentSize().height
			});
		},"resize");
		
		this.__isInitBgShadow=true;
	},
	
	/**
	 * 更新对话框的显示队列,并且会更新阴影层到当前的对话框后面
	 */
	__updateDialogQueue:function(dialog,op){
		var i,
			dlg;
		
		if(op==="add"){
			this.__dialogQueue.push(dialog);
		}else if(op==="remove"){
			i=this.__dialogQueue.length;
			while(i--){
				this.__dialogQueue[i]===dialog && this.__dialogQueue.splice(i,1); 
			}
		}
		
		if(this.__dialogQueue.length===0){
			this.__bgShadow.hidden();
		}else{
			dlg=this.__dialogQueue[this.__dialogQueue.length-1];
			
			this.__bgShadow.nodes.panel.parentNode.insertBefore(this.__bgShadow.nodes.panel,dlg.nodes.panel);
			this.__bgShadow.__iframe && this.__bgShadow.__iframe.parentNode.insertBefore(this.__bgShadow.__iframe,this.__bgShadow.nodes.panel);

			dlg.nodes.linkOk && dlg.nodes.linkOk.style.display!=="none" && dlg.nodes.linkOk.focus();
		}
	},
	
	/**
	 * 设置背景阴影层的透明度
	 * @param {Number} v
	 */
	__setBGShadowOpacity:function(v){
		v=isNaN(v)?0:Math.max(Math.min(v,1),0);
		Core.Dom.setStyle(this.__bgShadow.nodes.panel,"opacity",v);
	},
	
	/**
	 * 获取可见区域的尺寸
	 */
	__getDocumentSize:function(){
		var w=document.documentElement.clientWidth || document.body.clientWidth,
			h=document.documentElement.clientHeight || document.body.clientHeight;
			
		return {width:w,height:h};
	}
	
});
