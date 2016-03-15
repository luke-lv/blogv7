/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 */
/** 
 * @fileoverview 评论读取
 * @author stan | chaoliang@staff.sina.com.cn
 */
$import("lib/jobs.js");
$import("comment/list.js");
$import("tempLib/magicFace/magicFace.js");

$registJob('articleComment',function(){
   if (scope['private'].cms != 1) {
	   	var myComment = new Comment.List();
	   	myComment.load(1);
   }
});
