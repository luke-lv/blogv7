/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 */
/** 
 * @fileoverview 评论系统V2
 * @author stan | chaoliang@staff.sina.com.cn
 * @histroy
 *	评论执行延迟加载功能	L.Ming | liming1@staff.sina.com.cn @2010.03.05
 */
$import("lib/jobs.js");
$import("lib/lazyload.js");

$import("lib/commentv2/commentList.js");
$import("tempLib/magicFace/magicFace.js");

$registJob("articleCommentV2", function(){								
	Lib.LazyLoad([$E("article_comment_list")], {
		callback	: function () {
			if (!scope.$comment_is_load_page_1 && scope.$private.cms != 1 && scope.$isCommentAllow != 1) {
				// window.onerror = null;
				var myComment = new CommentV2.CommentList({
					purl: 'http://blog.sina.com.cn/s/comment_'+scope.$articleid,
					containerNode: $E('article_comment_list')
					// commentTpl: commentTpl,
					// replyTpl: replyTpl
				});
				// myComment.load(1);
		    }
		}
	});
});