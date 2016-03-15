/**
 * @fileoverview 个人中心纸条举报
 * @author liujiaqi
 * @created 2010-09-07
 */

$import("sina/sina.js");
$import("lib/component/report/blogReport.js");

$registJob("report_icpPaperlist", function(){
	var BR=new Lib.BlogReport();
	window.report=function(bodyID){
		//var cID=bodyID.replace(/(\u3000|\s|\t)*$/gi, ""),
		  var cID = bodyID,
			nickDom=$E("nick_"+cID).getElementsByTagName("a"),
			bodyDom=$E("body_"+cID).getElementsByTagName("a"),
			link=nickDom?nickDom[0]:null,
			link2=bodyDom?bodyDom[0]:null,
			nickName=link?link.innerHTML:"新浪网友",
			reportUID=link?link.href.split("/").pop():'0',
			tUID=(link2&&/fuid=([0-9]+)/i.test(link2))?link2.href.match(/fuid=([0-9]+)/i)[1]:'0',
			userNameInfo1=link?'<a target="_blank" href="'+link.href+'">'+nickName+'</a>':"<strong>新浪网友</strong>",
			userNameInfo2="",
			titleInfo="",
			contentInfo=$E("body_"+cID).innerHTML;

		BR.start("paperlist",nickName,bodyID,reportUID,userNameInfo1,userNameInfo2,titleInfo,contentInfo,tUID);
	};
});