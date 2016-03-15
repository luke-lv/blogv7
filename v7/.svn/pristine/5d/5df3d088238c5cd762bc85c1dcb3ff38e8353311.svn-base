/**
 * @desc	注册流程 AttachValid
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("comps/oop.js");
$import("comps/reg/_reg.js");
$import("comps/reg/InputBase.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");


Reg.AttachValid = function(opt){
	
	var __this = this;
	this.allMember = [];
	// this.evtHandler = function(){
	// 	__this.notifyBlur();
	// };
	
}.$defineProto({
	
	notifyBlur:function(){
		for(var i=0; i<this.allMember.length; i++){
			this.allMember[i].callback();
		}
	},
	
	joinMember:function(inputObj, callback){
		var __this = this;
		var __allMember = this.allMember;
		__allMember[__allMember.length] = {
			inputObj:	inputObj,
			callback:	callback
		};
		// Core.Events.addEvent(inputObj.entity, this.evtHandler, "blur");
	},
	
	quitMember:function(inputObj){
		for(var i=0; i<this.allMember; i++){
			if(this.allMember[i].inputObj == inputObj){
				this.allMember.splice(i, 1);
				// Core.Events.removeEvent(inputObj.entity, this.evtHandler, "blur");
				return;
			}
		}
	}
	
});

Reg.attachValidObj = new Reg.AttachValid();

