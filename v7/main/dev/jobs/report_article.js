/**
 * @fileoverview 博文举报
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-01-19
 */

$import("sina/sina.js");
$import("sina/utils/io/jsload.js");
$import("lib/component/report/blogReport.js");
$import("sina/core/events/getEventTarget.js");
$import("sina/core/events/getEvent.js");
$import("lib/uic.js");

$registJob("report_article", function(){
	var BR=new Lib.BlogReport(),
		nickName="";
	window.report=function(bodyID,componentID){
		if(!componentID) {
			var e = Core.Events.getEvent();
			e = e.target || e.srcElement;
			componentID = (e.id).split('_')[1];
		}
		var reportUID=scope.$uid,
			userNameInfo1,
			userNameInfo2="",
			//titleInfo=$E("t_"+componentID+"_"+bodyID).innerHTML,
			titleInfo=$E("t_"+componentID+"_"+bodyID).innerHTML,
			contentInfo=$E("t_"+componentID+"_"+bodyID).getElementsByTagName("a")[0].innerHTML;
		
		//获取用户昵称
		if (nickName === "") {
			// var url = "http://uic.internal.sina.com.cn/uic/Query.php?" + "UID="+ reportUID +"&Check=null&UserInfoTypes=[1]&ProductType=2";
			// Utils.Io.JsLoad.request(url, {
			// 	onComplete: function(result){
			// 		var nick = result && result.UserInfo[0][1];
			// 		// var nick=reportInfo[reportUID] || reportUID;
			// 		BR.start("blog",nick,bodyID,reportUID,'<a target="_blank" href="http://blog.sina.com.cn/u/'+scope.$uid+'">'+nick+'</a>',userNameInfo2,titleInfo,contentInfo);
			// 	},
			// 	onException: function(){
			// 		BR.start("blog","新浪网友",bodyID,reportUID,"新浪网友",userNameInfo2,titleInfo,contentInfo);
			// 	}
			// });
			Lib.Uic.getNickName([reportUID],function(result){
				if(result && result[reportUID]){
					var nick = result[reportUID];
					BR.start("blog",nick,bodyID,reportUID,'<a target="_blank" href="http://blog.sina.com.cn/u/'+scope.$uid+'">'+nick+'</a>',userNameInfo2,titleInfo,contentInfo);
				}else{
					BR.start("blog","新浪网友",bodyID,reportUID,"新浪网友",userNameInfo2,titleInfo,contentInfo);
				}
			});

		}else{
			userNameInfo1='<a target="_blank" href="http://blog.sina.com.cn/u/'+scope.$uid+'">'+nickName+'</a>';
			BR.start("blog",nickName,bodyID,reportUID,userNameInfo1,userNameInfo2,titleInfo,contentInfo);
		}
		
	};
});