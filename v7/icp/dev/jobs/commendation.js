/**
 * @fileoverview 推荐面板
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-17
 */

$import("lib/component/commendation/commendation.js");
$import("lib/component/face/face.js");

$import("sina/core/events/addEvent.js");
$import("lib/dialogConfig.js");

//$import("product/guestBook/templates/faceTemplate.js");

$registJob("commendation", function(){
//	var commendation = new scope.Commendation();
//	commendation.display(1, "1111111111111",4000);
//	commendation.display(3, "33333333333aaaa",3000);
//	commendation.display(3, "33333333333bbbbbb",-1);
//	commendation.display(3, "33333333333ccccc",10000);
//	commendation.display(3, "33333333333dddddd",2000);
//	commendation.display(2, "2222222222222",1000);
//	commendation.display(2, "2222222222222",-1);
//	commendation.display(1, "1111",1000);
//	commendation.display(1, "111111111aa",1000);
//
//	
//	
//	var d=winDialog.createCustomsDialog({
//		content:'asdfasdfasdfasfsadfasdfasdf'
//	});
//	d.setFixed(true);
//	d.setMiddle();
//	Core.Events.addEvent($E("btn2"),function(){
//		winDialog.alert("123");
//	},"click");
alert("a");
	var face=new Lib.Face($E("btnShow"),$E("txtContentArea"));
//	face.onInsert=function(){
//		alert(this.insertImageFile);
//	};

});