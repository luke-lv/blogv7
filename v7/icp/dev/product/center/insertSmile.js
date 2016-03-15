/** 
 * @fileoverview 插入表情，应用random的插入表情函数
 * @author xy xinyu@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/dom/getXY.js");

$import("lib/app.js");
$import("lib/component/face/face.js");

App.insertSmile = Core.Class.create();

App.insertSmile.prototype={
	initialize : function(sTextarea, sInsertButton, callback){
		//初始化插入表情
		this.btnShowFaceEditor = $E(sInsertButton);
		this.txtComment = $E(sTextarea);
		this.callback = callback;
		this.faceEditor = new Lib.Face(this.txtComment);
	},
	set	: function (sTextarea, sInsertButton){
		this.btnShowFaceEditor = $E(sInsertButton);
		this.txtComment = $E(sTextarea);
		var _this = this;
		_this.faceEditor.txtContentArea = this.txtComment;
		if (_this.faceEditor.isShowed) {
				_this.faceEditor.hidden();
		}else {
			if(!_this.faceEditor.isLoad){
				_this.faceEditor.load();
				_this.initFace();
				_this.faceEditor.isLoad = true;
			}
			var contid = "cmscnt_" + _this.txtComment.id.split("_")[2];
			var x=Core.Dom.getLeft($E(contid));
			var y=Core.Dom.getTop(_this.btnShowFaceEditor) + _this.btnShowFaceEditor.offsetHeight + 10;
			_this.faceEditor.setPosition(x,y);
			_this.faceEditor.show();
		}
		if(_this.faceEditor.txtContentArea.isWatched == null){
			_this.faceEditor.textWatchOn();
			_this.faceEditor.txtContentArea.isWatched = true;
		}
	},
	initFace : function(){
		var _this = this;
		Core.Events.addEvent(this.faceEditor.dialogNodes.btnClose, function(){
			_this.faceEditor.hidden();
		},"mousedown");
		Core.Events.addEvent(document.body, function(){
			_this.faceEditor.hidden();
		},"mousedown");
		Core.Events.addEvent(this.faceEditor.dialog.entity, function(){
			Core.Events.stopEvent();
		},"mousedown");
	}
};