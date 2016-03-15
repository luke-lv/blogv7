/** 
 * @fileoverview 插入表情，应用random的插入表情函数
 * @author xy xinyu@staff.sina.com.cn
 */
$import('comment/_comment.js');

$import("lib/component/face/face.js");

$import("sina/core/events/addEvent.js");

CommentV2.insertSmile=Core.Class.create();


CommentV2.insertSmile.prototype={
	initialize:function(){
		
	},
	show:function(){
		//初始化插入表情
	    this.btnShowFaceEditor = $E("article_comment_insertSmile");
	    this.txtComment = $E("commentArea");

		this.faceEditor=new Lib.Face(this.txtComment);
		var _this=this;
//		this.faceEditor.onInitialized = function(){
		_this.bindFace();
//	    };

	},
	bindFace:function(){
        var _this=this;
        Core.Events.addEvent(this.btnShowFaceEditor,function(){
            if (_this.faceEditor.isShowed) {
                    _this.faceEditor.hidden();
                }
                else {
					if(!_this.faceEditor.isLoad){
						_this.faceEditor.load();
						_this.initFace();
						_this.faceEditor.isLoad=true;
					}
					
                    var x=Core.Dom.getLeft(_this.btnShowFaceEditor)-450;
                    var y=Core.Dom.getTop(_this.btnShowFaceEditor) + _this.btnShowFaceEditor.offsetHeight;
                    _this.faceEditor.setPosition(x,y);
                    _this.faceEditor.show();
                }
                Core.Events.stopEvent();
        },"mousedown");

    }
	,initFace:function(){
		 var _this=this;
        Core.Events.addEvent(this.faceEditor.dialogNodes["btnClose"],function(){
            _this.faceEditor.hidden();
        },"mousedown");
        Core.Events.addEvent(document.body,function(){
            _this.faceEditor.hidden();
        },"mousedown");
        Core.Events.addEvent(this.faceEditor.dialog.entity,function(){
            Core.Events.stopEvent();
        },"mousedown");
	}
};
