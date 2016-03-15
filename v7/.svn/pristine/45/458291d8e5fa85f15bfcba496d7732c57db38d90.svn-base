/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 */
/** 
 * @fileoverview 评论管理
 * @author stan | chaoliang@staff.sina.com.cn
 */
$import("sina/core/function/bind2.js");
$import("sina/core/string/byteLength.js");
$import("sina/utils/limitLength.js");
$import("lib/jobs.js");

$import("comment/delete.js");
$import("comment/reply.js");


$registJob('articleCommentManager', function(){
    //- 删除评论
    var CommentDel = new Comment.Delete(),
		styleState;
		
    CommentDel.articleid = picInfo.pic_id;
    //定义全局函数
    window.del_comment = function(el,id,friendUID){
		styleState="";
		if(scope.$uid==friendUID||friendUID==0){
			styleState=' style="display:none" ';
		}
		winDialog.confirm("确认需要删除此条评论？<br/>删除后不可恢复。",{
			subText:'<div '+styleState+'><input id="cbAddToBlock_'+id+'" type="checkbox"/><label for="cbAddToBlock_'+id+'">将此人加入黑名单</label></div>',
			textOk:'删除',
			funcOk:function(){
				CommentDel.del.bind2(CommentDel)(id,$E("cbAddToBlock_"+id).checked,friendUID);
			}
		});
    };
    
    //- 回复评论
    var CommentReply = new Comment.Reply();
    CommentReply.articleid = picInfo.pic_id;
	
	//reply_txt
	
    //定义全局函数
    window.reply_comment = CommentReply.reply.bind2(CommentReply);
    //定义全局函数
    window.del_reply = function(id){
		CommentReply.del.bind2(CommentReply)(id);
    };
});
