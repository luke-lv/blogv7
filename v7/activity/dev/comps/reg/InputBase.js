/**
 * @desc	注册流程 input 基类
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("comps/oop.js");
$import("comps/reg/_reg.js");
$import("comps/reg/SolidTips.js");
$import("comps/reg/RegEx.js");
$import("lib/classUtils.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/getEvent.js");


Reg.InputBase = function(opt){
	var __this = this;
	this.box = opt.box;
	this.colorNode = opt.colorNode;
	this.noteTip = opt.noteTip;
	this.errTip = opt.errTip;
	this.entity = opt.entity;
	this.submitBtn = opt.submitBtn;
	this.afterReport = opt.onError || function(){};
	
	this.curColor;
	this.proccessStop = false;
	this.timer = 0;
	
	this.validator = new Reg.RegEx({
		reportCall:	function(tip){				// proccessStop 置 true 的地方。
			__this.showErrTips(tip);
			__this.proccessStop = true;
			__this.changeColor("inputRed");
			__this.afterReport();
		}
	});
	this.rightTips = new Reg.SolidTips({
		box:		__this.box,
		template:	'<span class="yes" id="#{entity}" style="margin-left: 15px;"></span>'
	});
	this.noteTips = new Reg.SolidTips({
		box:		__this.box,
		template:	'<span class="errtip" id="#{entity}"></span>'
	});
	this.errTips = new Reg.SolidTips({
		box:		__this.box,
		template:	'<span id="#{entity}" style="margin-left: 15px;"><span class="error"></span><span class="red" style="color:#cc0000" id="#{txtNode}"></span></span>'
	});
	this.allTips = [this.rightTips, this.errTips, this.noteTips];
	
	this.watchingInput();
	if(this.submitBtn){
		this.handleEnterKey();
	}
	
}.$defineProto({
	handleEnterKey: function(){
		var __this = this;
		Core.Events.addEvent(this.entity, function(){
			var __evt = Core.Events.getEvent();
			var __btnCode = __evt.keyCode || __evt.which;
			if(__btnCode == 13){
				__this.submitBtn.onclick();
			}
		}, "keydown");
	},
	
	changeColor:function(){
		if(!arguments[0]) return;
		this.removeColor();
		this.addClass(this.colorNode, arguments[0]);
		this.curColor = arguments[0];
	},
	removeColor:function(){
		if(!this.curColor) return;
		this.delClass(this.colorNode, this.curColor);
		this.curColor = "";
	},
	
	hideAllTips:function(){
		for(var i=0; i<this.allTips.length; i++){
			this.allTips[i].hide();
		}
	},
	showNoteTips:function(txt){
		this.hideAllTips();
		var __content = txt || this.noteTip;
		if(!__content) return;
		this.noteTips.showAt(this.entity, __content);
	},
	hideNoteTips:function(){
		this.noteTips.hide();
	},
	showErrTips:function(txt){
		this.hideAllTips();
		this.errTips.showAt(this.entity, txt || this.errTip || "");
		this.tipsTxt = txt;
	},
	hideErrTips:function(){
		this.errTips.hide();
	},
	showRightTips:function(){
		this.hideAllTips();
		this.rightTips.showAt(this.entity);
		this.tipsTxt = "";
	},
	showGreen : function(){
		this.rightTips.showAt(this.entity);
	},
	hideGreen : function(){
		this.rightTips.hide();
	},
	hideRightTips:function(){
		this.rightTips.hide();
	},
	
	watchingInput:function(){
		var __this = this;
		var flagGreen = 0;
		var id = this.entity.id;
		var regFlag = scope && scope.$submit;

		Core.Events.addEvent(this.entity, function(){
			if(!flagGreen && regFlag){
				__this.hideGreen();
				regFlag = 1;
			}
			__this.changeColor("inputGreen");
			__this.showNoteTips();
		}, "focus");
		
		Core.Events.addEvent(this.entity, function(){
			__this.validTxt();
		}, "blur");

		if(regFlag && id === 'inputName'){
			this.showGreen();
		}
		if(regFlag && id === 'inputEmail'){
			this.showGreen();
		}
		if(regFlag && id === 'inputNick'){
			this.showGreen();
		}
		if(regFlag && id === 'inputPwdAnswer'){
			this.showGreen();
		}
	},
	
	finishValid: function(){				// validator.stop 和 proccessStop 置 false 的地方。
		if(!this.validator.stop){
			this.removeColor();
			this.showRightTips();
			this.proccessStop = false;
		}
		this.validator.stop = false;
	},
	
	validTxt:function(force){				// force 强制验证，默认不强制，validator.stop 置 true 的地方。
		// console.log("base: "+this.entity.id+"   "+force);
		var str = this.entity.value;
		if(!force && (this.valBefore==str)){
			this.validator.stop = true;		// 值相同，不检验。不需要改变状态标记。
			this.restoreState();
		}
		this.valBefore = str;
		this.validator.setStr(str);
	},
	
	restoreState:function(){				// 供恢复状态使用（input 内容未变化时）
		if(this.proccessStop){
			this.showErrTips(this.tipsTxt);
			this.changeColor("inputRed");
		}else{
			this.showRightTips();
			this.removeColor();
		}
	},
	
	clearState:function(){
		this.hideAllTips();
		this.removeColor();
	}
	
}).$mixProto(Lib.classUtils);



