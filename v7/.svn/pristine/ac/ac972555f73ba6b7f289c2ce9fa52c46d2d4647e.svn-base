/**
 * @fileoverview 博文正文举报
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-01-19
 */

$import("sina/sina.js");
$import("sina/utils/io/jsload.js");
$import("lib/component/report/blogReport.js");
$import("lib/uic.js");

$registJob("report_bodyArticle", function(){
	var BR=new Lib.BlogReport(),
		nickName="";
	window.report=function(bodyID){
		var reportUID=scope.$uid,
			userNameInfo1,
			userNameInfo2="",
			titleInfo='<a target="_blank" href="http://blog.sina.com.cn/s/blog_'+bodyID+'.html">'+$E("t_"+bodyID).innerHTML+'</a>',
			contentInfo=$E("t_"+bodyID).innerHTML;
		
		//获取用户昵称
		if (nickName === "") {
			// var url = "http://uic.internal.sina.com.cn/uic/Query.php?" + "UID="+ reportUID +"&Check=null&UserInfoTypes=[1]&ProductType=2";
			// Utils.Io.JsLoad.request(url, {
			// 	onComplete: function(result){
			// 		var nick = result && result.UserInfo && result.UserInfo[0][1];
			// 		// var nick=reportInfo[reportUID] || reportUID;
			// 		BR.start("blog",nick,bodyID,reportUID,'<a target="_blank" href="http://blog.sina.com.cn/u/'+scope.$uid+'">'+nick+'</a>',userNameInfo2,titleInfo,contentInfo);
			// 	},
			// 	onException: function(){
			// 		BR.start("blog","新浪网友",bodyID,reportUID,"新浪网友",userNameInfo2,titleInfo,contentInfo);
			// 	}
			// });
			
			Lib.Uic.getNickName([reportUID],function(result){
				if(result && result[reportUID]){
					var nick =result[reportUID];
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
	
	window.article_report=function(bodyID){
		var reportUID=scope.$uid,
			userNameInfo1,
			userNameInfo2="",
			titleInfo='<a target="_blank" href="http://blog.sina.com.cn/s/blog_'+bodyID+'.html">'+$E("t_"+bodyID).innerHTML+'</a>',
			contentInfo=$E("t_"+bodyID).innerHTML;
		
		//获取用户昵称
		if (nickName === "") {
			// var url = "http://uic.internal.sina.com.cn/uic/Query.php?" + "UID="+ reportUID +"&Check=null&UserInfoTypes=[1]&ProductType=2";
			// Utils.Io.JsLoad.request(url, {
			// 	onComplete: function(result){
			// 		var nick = result && result.UserInfo && result.UserInfo[0][1];
			// 		// var nick=reportInfo[reportUID] || reportUID;
			// 		BR.start("blog",nick,bodyID,reportUID,'<a target="_blank" href="http://blog.sina.com.cn/u/'+scope.$uid+'">'+nick+'</a>',userNameInfo2,titleInfo,contentInfo);
			// 	},
			// 	onException: function(){
			// 		BR.start("blog","新浪网友",bodyID,reportUID,"新浪网友",userNameInfo2,titleInfo,contentInfo);
			// 	}
			// });

			Lib.Uic.getNickName([reportUID],function(result){
				if(result && result[reportUID]){
					var nick =result[reportUID];
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