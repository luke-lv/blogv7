/**
 * @fileoverview
 *	组件克隆功能
 *	处理流程：
 * 	1、如果用户未登录，则提示用户登录——登录后，调用克隆接口
 * 	2、如果用户有该组件，提示无需克隆；如果该组件无法克隆，提示无法克隆；如果成功，跳到访客首页
		"A11102": "已添加过此模块，不能重复添加。",
		"A11103" : "抱歉，您的组件已经太多。",
		"A00006" : "模块已成功添加到你的博客。",
		"A00004" : "没有登录。",
		"A00001" : "系统繁忙。",
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/core/function/bind3.js");

$import("lib/component/_component.js");
$import("lib/checkAuthor.js");
$import("lib/interface.js");
$import("lib/dialogConfig.js");
$import("lib/msg/systemMSG.js");
$import("lib/msg/componentMSG.js");
$import("lib/showError.js");
$import("lib/login/ui.js");

$import("msg/cloneComponentMSG.js");
/**
 * 克隆组件
 * @param {String} sCompId	组件ID
 * @param {Number} sSize	组件当前尺寸
 */
Lib.Component.clone = function  (sCompId, nSize){
	if(sCompId == null || isNaN(sCompId)){
		Debug.log("请提供被克隆组件的有效ID，当前是：" + sCompId);
		return;
	}
	nSize = nSize.toString().replace(/0$/, "");
	var cloneStart = function () {
		Debug.log("start to clone " + sCompId);
		if(!$isLogin){
			Lib.checkAuthor();
			// 刷新托盘
			$tray.renderLogin();
		}
		// 组件克隆接口
		var i_cloneComp = new Interface("http://control.blog.sina.com.cn/riaapi/conf/module_clone.php", "jsload");
		var param = {
			"productid"	: "0x00000001"	// 产品ID，目前只有博客能克隆，写死
			,"suid"		: $UID			// 访客 UID
			,"uid"		: scope.$uid	// 博主 UID
			,"moduleid"	: sCompId		// 被克隆组件 ID
			,"cwidth"	: nSize			// 当前组件宽度，71表示710px，51表示510px，21表示210px
			,"version"	: 7
			,"feed"		: 1
		};
		i_cloneComp.request({
			GET : param,
			onSuccess: function(_data){
				winDialog.alert($SYSMSG.A02006, {icon: "03", funcOk: function(){
						window.open("http://blog.sina.com.cn/u/" + $UID, "_blank", "");
				}});
			},
			onError : function (_data) {
				switch (_data.code) {
					case "A00003":
						winDialog.confirm($SYSMSG.A02005.replace("#UID", $UID), {
							funcOk: function(){
								window.open('http://blog.sina.com.cn/u/' + $UID, "_blank", "");
							},
							textOk: "升级",
							textCancel: "关闭",
							icon: "03"
						});
						break;
					case "A11007":
						winDialog.confirm($SYSMSG.A11007.replace("#{linkNewBlog}", 'http://blog.sina.com.cn/u/' + $UID), {
							funcOk: function(){
								window.open("http://login.sina.com.cn/hd/reg_sec.php?entry=blog", "_blank", "");
							},
							textOk: "开通",
							textCancel: "关闭",
							icon: "01"
						});
						break;
					default:
						showError(_data.code);
						break;
				}
			},
			onFail : function () {
				showError($SYSMSG.A00001);
			}
		});
	};
	
	Lib.checkAuthor();
	if(!$isLogin){
		new Lib.Login.Ui().login(Core.Function.bind3(cloneStart, null, [sCompId]));
	}else{
		cloneStart(sCompId);
	}
};
// 提供旧的克隆方法，不过宽度固定传 210 px
$CloneComp = function (sCompId) {
	Lib.Component.clone(sCompId, 210);
};
