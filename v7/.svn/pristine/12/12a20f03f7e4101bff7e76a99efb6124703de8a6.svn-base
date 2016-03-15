/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 */
/** 
 * @fileoverview 语音验证码
 * @author stan | chaoliang@staff.sina.com.cn
 */
$import("lib/jobs.js");
$import("lib/audioCheck.js");

$import("sina/core/dom/wrap.js");

$registJob('audioCheck', function(){
	if(!$E('article_comment_list')){//没有评论节点 还要语音检测做什么
		return;
	}
	if (scope.$private.cms != 1&&scope.$isCommentAllow!=1) {//1代表不能评论，因此不执行，0代表可以评论，所以才执行以下代码
		var dom = $E("comment_get_vcode");
		var cont = Core.Dom.wrap(dom, "span");
		if (cont) {
			Lib.AudioCheck.render(cont, Lib.AudioCheck.soundUrl+"?"+new Date().getTime());
		}
	}
});

