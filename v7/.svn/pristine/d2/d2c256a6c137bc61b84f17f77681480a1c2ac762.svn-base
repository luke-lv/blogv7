/**
 * @fileoverview 个人中心评论举报
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-01-19
 * @modified by Luo Rui 2010-3-2
 */

$import("sina/sina.js");
$import("lib/component/report/blogReport.js");

$registJob("report_icpComment", function(){
	var BR=new Lib.BlogReport();
	window.report=function(bodyID){
		var bID=bodyID.split("|")[0],
			cID=bodyID.split("|")[1],
			nickDom=$E("nick_"+cID).getElementsByTagName("a"),
			link=nickDom?nickDom[0]:null,
			title=$E("body_"+cID).getElementsByTagName("a")[0],
			nickName=link?link.innerHTML:"新浪网友",
			reportUID=link?link.href.split("/").pop():'0',
			userNameInfo1=link?'<a target="_blank" href="'+link.href+'">'+nickName+'</a>':"<strong>新浪网友</strong>",
			userNameInfo2="",
			titleInfo='<a target="_blank" href="'+title.href+'">'+title.innerHTML+'</a>',
			contentInfo=$E("body_"+cID).innerHTML.replace(/<div[\d\D]*<\/div>|\s/gi,"");
		    bodyID = bodyID.replace("|","_");
		BR.start("comment",nickName,bodyID,reportUID,userNameInfo1,userNameInfo2,titleInfo,contentInfo);
	};
});