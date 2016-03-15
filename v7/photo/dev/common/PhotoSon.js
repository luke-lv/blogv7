

$import("sina/sina.js");

$import("lib/dialogConfig.js");

$import("common/Photo.js");
$import("common/BF.js");

$import("action/dialogDefine.js");
//$import("common/BF.js");

 Photo.prototype.rotateImg = function(){
     var thisId = this.id;
     setTimeout(function(){buildRotateDialog(thisId)},5);

 };

	
function buildRotateDialog(thisId){
    if(typeof rDialog == 'undefined'){
	
	window.rDialog = winDialog.createCustomsDialog({
	    content : PhotoDom["rotate"].format(picInfo.pic_id,picInfo.small),
	    title : '图片旋转'
	});

    }else{
	rDialog.setContent(PhotoDom["rotate"].format(picInfo.pic_id,picInfo.small));
    }

    rDialog.setMiddle();
    rDialog.setFixed(true);
    rDialog.show();
    
    var btnDom = rDialog.nodes;
    Core.Events.addEvent(btnDom["btn1"],function(){
	phpENTRY["rotate1"].request({
	    GET : {
		// uid : scope.$uid,
		s   : 'json',
		pid : thisId,
		r : isNaN($E("image_" + thisId).angle)? 4 : ($E("image_" + thisId).angle / 90)
	    },
	    onSuccess : function(res){
		
		phpENTRY["rotate2"].request({
		    GET : {
			uid : scope.$uid,
			pic_id : thisId
		    },
		    onSuccess : function(res){
			document.location.reload();
		    },
		    onError : function(res){
			callErr(res.code);
		    }
		});
	    },
	    onError : function(res){
		rDialog.hidden();
		callErr(res.code);
	    }
	});
    }.bind2(this),"click");
	    
}
