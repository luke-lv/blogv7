/**
 * @fileoverview
 *	删除访客
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/core/function/bind3.js");

$import("lib/lib.js");
$import("lib/msg/componentMSG.js");
$import("lib/checkAuthor.js");
$import("lib/interface.js");
$import("lib/dialogConfig.js");
$import("lib/login/ui.js");
/**
 * 删除访客并回调
 * @param {String} 		sUid		被删除访客UID
 * @param {String} 		sProductId	产品ID，"blog": 1, "vblog": 2, "photo": 8, "music": 1024, "tiezi": 64
 * @param {Function} 	fCallBack	回调函数
 * @param {Function} 	sSubId		产品子ID，例如文章ID，相册专辑ID
 */
Lib.deleteVisitByUid = function (sUid, sProductId, fCallBack, sSubId){
	Lib.checkAuthor();
	if(!$isLogin){
		var Login = new Lib.Login.Ui();
		Login.login(Core.Function.bind3(Lib.deleteWallByMsgid, null, arguments));
		return;
	}
	Debug.log("删除访客：" + sUid);
	var confirmMsg = '';
	if($isAdmin){
		confirmMsg = $SYSMSG.A80203;
	}else if($isLogin){
		confirmMsg = $SYSMSG.A80201;
	}else{
		return true;
	}
	winDialog.confirm(confirmMsg, {
		funcOk : function () {
			var i_deleteVisit = new Interface("http://footprint.cws.api.sina.com.cn/del.php", "jsload");
			var param = {
				"pid": sProductId,
				"uid": scope.$uid,
				"deleteuid": sUid
			};
			if (sSubId != null) {
				param.subid = sSubId;
			}
			if($E("comp_12_deleteToBlack") && $E("comp_12_deleteToBlack").checked == true){
				param.inblack = 1;
			}
			i_deleteVisit.request({
				GET: param,
				onSuccess: function(){
				
					// 如果存在组件对象 Lib.Component 证明是在有好有组件的页面，刷新组件;
					// 否则应该是好友列表页面，应该刷新页面
					if (fCallBack) {
						fCallBack(null, null, true);
					}
					else {
						Debug.log("Reload page");
						window.location.reload();
					}
					
				}
			});
		}
		,"subText"		: $isAdmin ? $SYSMSG.A80204 : $SYSMSG.A80202
		,"textOk"		: "是"
		,"textCancel"	: "否"
		,"icon"			: "04"
	});
};
