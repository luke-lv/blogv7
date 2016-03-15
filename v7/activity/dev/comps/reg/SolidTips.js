/**
 * @desc	注册流程硬插入式 tips
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("comps/oop.js");
$import("comps/reg/_reg.js");
$import("lib/templateUtils.js");
$import("sina/core/dom/up.js");


Reg.SolidTips = function(opt){
	this.box = opt.box;
	this.template = opt.template;
	this.isHide = true;
	
	this.nodes = this.getTemplateNodes(this.template);
	this.entity = this.nodes.entity;
	this.txtNode = this.nodes.txtNode || this.nodes.entity;
	
}.$defineProto({
	showAt:function(inputNode, txt){
		this.isHide && (this.entity.style.display = "inline-block");
		this.isHide = false;
		
		this.setTxt(txt || "");
		if(this.box) this.box.appendChild(this.entity);
		else Core.Dom.up(inputNode, "inputbox").parentNode.appendChild(this.entity);
	},
	hide:function(){
		this.entity.style.display = "none";
		this.isHide = true;
	},
	setTxt:function(str){
		this.txtNode.innerHTML = str;
	}
}).$mixProto(Lib.templateUtils);



