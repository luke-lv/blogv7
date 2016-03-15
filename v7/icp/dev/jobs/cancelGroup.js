/**
 * @fileoverview 取消圈子
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-24
 */

$import("sina/sina.js");
$import("lib/dialogConfig.js");
$import("sina/utils/io/jsload.js");

$registJob("cancelGroup", function(){
	window.$cancelGroup = function(groupID){
		winDialog.confirm("确定退出该圈子?", {
			funcOk: function(){
				Utils.Io.JsLoad.request("http://q.sina.com.cn/ajax/user/exitgroup.php?groupid="+groupID, {
					onComplete  : function (data) {
						if(data["status"]=="1"){
							window.location=window.location.toString().replace(/#.*/,"");
						}else{
							winDialog.alert(
								data["errstr"],
								{ icon : "02" }
							);
						}
					},
					onException : function(){
						
					}
		        });	
			}
		});
	};
});