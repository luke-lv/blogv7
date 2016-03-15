/**
 * @desc	注册流程 inputSelect
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("comps/oop.js");
$import("comps/reg/_reg.js");
$import("comps/reg/InputQuestion.js");
$import("lib/templateUtils.js");
$import("sina/core/events/fireEvent.js");


Reg.InputSelect = function(opt){
	var __this = this;
	this.optionsBox = opt.optionsBox || document.body;
	this.box = opt.box;
	this.customInput = opt.customInput;
	this.targetForm = opt.targetForm;
	this.template = opt.template || [
	'<div id="#{entity}" class="showDate" style="display:none; z-index:100;">',
		'<ul id="#{itemBox}">',
			'<li>我手机号码的后6位？</li>',
			'<li>我母亲的生日？</li>',
			'<li>我父亲的生日？</li>',
			'<li>我最好朋友的生日？</li>',
			'<li>我儿时居住地的地址？</li>',
			'<li>我小学校名全称？</li>',
			'<li>我中学校名全称？</li>',
			'<li>离我家最近的医院全称？</li>',
			'<li>离我家最近的公园全称？</li>',
			'<li>我的座右铭是？</li>',
			'<li>我最喜爱的电影？</li>',
			'<li>我最喜爱的歌曲？</li>',
			'<li>我最喜爱的食物？</li>',
			'<li>我最大的爱好？</li>',
			'<li>我最喜欢的小说？</li>',
			'<li>我最喜欢的运动队？</li>',
			'<li>其他</li>',
		'</ul>',
		'<div class="selebottom"></div>',
	'</div>'].join("");
	

	this.nodes = this.getTemplateNodes(this.template);
	this.entity = this.nodes.entity;
	this.itemBox = this.nodes.itemBox;
	this.fireBtn = this.nodes.fireBtn || opt.fireBtn;
	this.showStrip = this.nodes.showStrip || opt.showStrip;
	
	this.isShow = false;
	this.hasGenSelectInput = false;
	this.hasSelected = false;
	this.fireBtnClick = function(){
		if(__this.isShow){
			__this.entity.style.display = "none";
			__this.isShow = false;
		}else{
			__this.entity.style.display = "block";
			__this.isShow = true;
		}
	};
	var regG = scope && scope.$submit, regFla = 0;
	Core.Events.addEvent(this.fireBtn, this.fireBtnClick, "click");
	
	this.handleHover();
	this.handleSelect();
	if(regG){
		this.showGreen();
		if(this.entity){
			this.entity.style.top = '203px';
		}
	}
	this.optionsBox.appendChild(this.entity);			// 上屏。
	this.updateInputHidden(this.showStrip.innerHTML);	// 题目必须生成 hidden
	
	new Reg.InputQuestion({
		colorNode:		Core.Dom.up(__this.customInput, "input"),
		entity:			__this.customInput,
		noteTip:		"4-20 位字母、数字或汉字（汉字算两位）组成"
	});
	
}.$extend(Reg.InputBase).$defineProto({
	
	createNodeByString: function(str){
		var __chd;
		var __box = $C("div");
		__box.innerHTML = str;
		__chd = __box.childNodes;
		if(__chd.length > 1){
			return __box;
		}else{
			return __chd[0];
		}
	},
	
	handleHover: function(){
		var __nodes = this.itemBox.getElementsByTagName("*");
		for(var i=0; i<__nodes.length; i++){
			__nodes[i].onmouseover = function(){
				this.className = "current";
			};
			__nodes[i].onmouseout = function(){
				this.className = "";
			};
		}
	},


	
	handleSelect: function(){
		var __this = this;
		var __nodes = this.itemBox.getElementsByTagName("*");

		for(var i=0; i<__nodes.length; i++){
			if(i == __nodes.length-1){				// 其它，项
				__nodes[i].onclick = function(){
					__this.hasSelected = true;

					__this.showRightTips();
					Core.Dom.up(__this.customInput, "inputbox").parentNode.style.display = "block";
					__this.updateInputHidden(this.innerHTML);
					__this.showWhatSelected(this.innerHTML);
					__this.fireBtnClick();
					return false;
				}
			}else{
				__nodes[i].onclick = function(){
					__this.hasSelected = true;
					__this.showRightTips();
					Core.Dom.up(__this.customInput, "inputbox").parentNode.style.display = "none";
					__this.updateInputHidden(this.innerHTML);
					__this.showWhatSelected(this.innerHTML);
					__this.fireBtnClick();
					return false;
				}
			}
		}
	},
	
	updateInputHidden: function(val){
		if(!this.hasGenSelectInput){
			var __html = "<input type='hidden' value='"+val+"' name='selectQid' />";
			var __inputHidden = this.createNodeByString(__html);
			this.selectParam = __inputHidden;
			this.targetForm.appendChild(__inputHidden);
			this.hasGenSelectInput = true;
		}else{
			this.selectParam.setAttribute("value", val);
		}
	},
	
	showWhatSelected: function(txt){
		this.showStrip.innerHTML = txt;
	},
	
	watchingInput:function(){				// 不需要监控

	},
	
	validTxt:function(){					// 不需要继承
		if(this.hasSelected){				// 如果选择了，肯定有值
			this.showRightTips();
		}else{								// 没选择，不一定没有值
			if(this.showStrip.innerHTML.indexOf("请选择")>-1){
				this.showErrTips("需要选择一个你熟悉的问题");
				this.validator.stop = true;
				this.proccessStop = true;
			}else{
				this.showRightTips();
			}
		}
		this.finishValid();
	}
	
}).$mixProto(Lib.templateUtils);





