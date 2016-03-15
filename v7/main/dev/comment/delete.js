/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 */
/** 
 * @fileoverview 删除评论
 * @author stan | chaoliang@staff.sina.com.cn
 */
$import("sina/core/class/create.js");
$import("sina/core/function/bind2.js");
$import("sina/core/dom/removeNode.js");

$import("comment/_comment.js");
$import("comment/paging.js");
$import("lib/dialogConfig.js");

Comment.Delete = Core.Class.create();

Comment.Delete.prototype = {
    /**
     * 文章ID
     */
    articleid: 0,
    commentid: 0,
    initialize: function(){
    },
    /**
     * 删除评论
     * @param {Number} id 评论ID
     * @param {Boolean} isBlock 是否加入黑名单
     * @param {String} friendUID 发评论人的UID
     */ 
    del: function(cmtid,isBlock,friendUID){
		
        this.commentid = cmtid;
        this.del_url = new Interface("http://control.blog.sina.com.cn/admin/comment/comment_del_post.php", $IE6 ? "ijax" : "jsload");
        
        this.del_url.request({
            GET: {
                "comment_id": this.articleid + "|" + this.commentid,
                "page_id": scope.$comment_page || 1,
                "uid": $UID,
				"inblack" : isBlock?"1":"0",
				"friend_uid":friendUID || ""
            },
            onSuccess: function(_data){
                scope.$totle_comment--;
                trace("删除评论成功");
				$E('c_' + scope.$articleid).innerHTML = "(" + scope.$totle_comment + ")";
                var node = $E("cmt_" + this.commentid);
                var slide = new Ui.Slide(node);
                
                slide.onSlideOut = function(){
                    Core.Dom.removeNode(node.parentNode);
                };
                slide.slideOut();
                if (scope.$totle_comment == 0) {
					var li=$C('li');
					//li.className='CP_litem';
					li.innerHTML='<div class="noCommdate"><span class="SG_txtb">当第一个评论者吧！ <img width="18" height="18" align="absmiddle" title="" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon134"> <a href="#post">抢沙发&gt;&gt;</a></span></div>';
                    $E("article_comment_list").appendChild(li);
                }else{
					trace('>>>>'+$T($E('article_comment_list'),'li').length);
					if($T($E('article_comment_list'),'li').length==1){//当前页需要刷新到上页
						scope.$comment_page--;//当前页页码减1
						new Comment.List().load(scope.$comment_page);
					}
					
				}
				trace('删除后的当前页：scope.$comment_page='+scope.$comment_page);
				trace('删除后的总数：scope.$totle_comment='+scope.$totle_comment);
				Comment.paging(scope.$totle_comment,scope.$comment_page);

            }
.bind2(this)            ,
            onError: function(result){
                trace("删除评论返回状态码：" + result.code);
				if(result.code == 'B00006') {
					//用户的重复点击
					return;
				}
                showError(result.code);
            }
.bind2(this)            ,
            onFail: function(){
                trace("删除失败！请重试。");
                winDialog.alert("删除失败！请重试。", {
                    "icon": "02"
                });
            }
.bind2(this)
        });
    }
};
