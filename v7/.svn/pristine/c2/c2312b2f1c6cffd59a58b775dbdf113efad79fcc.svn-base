/**
 * @fileInfo	评论审核模块
 * @author		yongsheng4@staff.sina.com.cn
 * @update		2013-10-15
 */
$import("lib/jobs.js");
$import("lib/commentv2/commentForCheck.js");
$registJob("commentForCheck",function(){
	if(/cmtforcheck_/.test(location.hash)){//#cmtforcheck_952_3608798624
		var hashs = location.hash.split("_");
		var param = {cms_id:hashs[1],uid:hashs[2]}
		new CommentV2.CommentForCheck(param);
	}
});

