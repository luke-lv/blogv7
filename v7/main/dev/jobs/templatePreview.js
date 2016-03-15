/**
 * @fileoverview
 *	运营推荐模板预览
 	地址栏形如：http://control.blog.sina.com.cn/benctest1?tpl=13_5 可以看到效果
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/sina.js");

$import("lib/jobs.js");
$import("lib/interface.js");
//$import("lib/component/templateClone/templateClone.js");
$import("lib/dialogConfig.js");
$import("lib/msg/systemMSG.js");
$import("lib/component/templateClone/msg/templateClone.js");

$registJob("templatePreview", function(){
	var locateHomePage = function () {
		window.location.href = "http://blog.sina.com.cn/u/" + scope.$uid;
	};
	
	if(scope.new_tpl){
		var tpl_type = scope.new_tpl.split("_")[0];
		var thumb = "http://simg.sinajs.cn/blog7newtpl/css/" + tpl_type + "/" + scope.new_tpl + "/thumb.jpg";
	    winDialog.confirm("是否要应用此模板？", {
			funcOk		: function () {
				winDialog.getDialog("templatePreview").getNodes().btnClose.onclick = null;
				var changeTemplate = new Interface("http://control.blog.sina.com.cn/riaapi/conf/template_clone.php", "jsload");
				changeTemplate.request({
					GET			: {
						uid_cloned	: scope.$uid,	
						type		: 2,
						tpl			: scope.new_tpl,
						version		: 7
					},
					onSuccess	: locateHomePage,
					onError		: function (data) {
						if (data.code == "A11007") {
							//未开通新浪博客
							Lib.checkAuthor();
							winDialog.alert($TEMPLATECLONE_MSG[data.code].replace(/#\{linkNewBlog\}/g,
									"http://blog.sina.com.cn/u/" + $UID), {
								icon: "01"
							});
						}
						else {
							winDialog.alert($TEMPLATECLONE_MSG[data.code], {icon: "02"});
						}
					},
					onFail		: function () {
						winDialog.alert($SYSMSG.A00001, {icon: "02"});
					}
				});
			},
			textOk		: "是",
			textCancel	: "否",
			funcCancel	: function () {
				winDialog.getDialog("templatePreview").getNodes().btnClose.onclick = null;
				locateHomePage();
			},
			subText		: '<img src="' + thumb + '" />'
		}, "templatePreview");
		winDialog.getDialog("templatePreview").getNodes().btnClose.onclick = locateHomePage;
	}
});