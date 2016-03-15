/**
 * @fileoverview 博客评论举报
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-01-18
 */

$import("sina/sina.js");
$import("lib/component/report/blogReport.js");

$registJob("report_blogComment", function(){
	var BR=new Lib.BlogReport();
	window.comment_report=function(bodyID){
		var bID=bodyID.split("_")[0],
			cID=bodyID.split("_")[1],
			nickName,
			reportUID="0",
			userNameInfo1,
			userNameInfo2="",
			titleInfo='<a target="_blank" href="http://blog.sina.com.cn/s/blog_'+bID+'.html">'+$E("t_"+bID).innerHTML+'</a>',
			contentInfo=$E("body_cmt_"+cID).innerHTML;
		
		var links=$E("nick_cmt_"+cID).getElementsByTagName("a");
		if(links.length>0){
			nickName=links[0].innerHTML;
			reportUID=links[0].href.split("/").pop();
			userNameInfo1='<a href="'+links[0].href+'" target="_blank">'+nickName+'</a>';
		}else{
			nickName=$E("nick_cmt_"+cID).innerHTML;
			userNameInfo1='<strong>'+nickName+'</strong>';
		}
		
		BR.start("comment",nickName,bodyID,reportUID,userNameInfo1,userNameInfo2,titleInfo,contentInfo);
	};
});
