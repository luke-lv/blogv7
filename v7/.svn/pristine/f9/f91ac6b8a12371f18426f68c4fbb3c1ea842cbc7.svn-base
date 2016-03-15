/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 */
/** 
 * @fileoverview 评论读取
 * @author stan | chaoliang@staff.sina.com.cn
 * @histroy
 *	评论执行延迟加载功能	L.Ming | liming1@staff.sina.com.cn @2010.03.05
 */
$import("lib/jobs.js");
$import("lib/lazyload.js");

$import("comment/list.js");
$import("tempLib/magicFace/magicFace.js");

$registJob("articleComment", function(){
    if (scope.$pageid === 'articletj'){// 推荐页 评论默认隐藏了
        Lib.LazyLoad([$E("commonComment")], {
            callback    : function () {
                if (!scope.$comment_is_load_page_1 && scope.$private.cms != 1 && scope.$isCommentAllow != 1) {
                    var myComment = new Comment.List();
                    myComment.load(1);
               }
            }
        });
    }else{
        Lib.LazyLoad([$E("article_comment_list")], {
            callback    : function () {
                if (!scope.$comment_is_load_page_1 && scope.$private.cms != 1 && scope.$isCommentAllow != 1) {
                    var myComment = new Comment.List();
                    myComment.load(1);
               }
            }
        });
    }

    if ($E('show_blog_comments')){
        // <span class="com_btn_a" id="show_blog_comments">展开<i class="com_btn_ico1"></i></span>
        var pageLindNode = Core.Dom.getElementsByClass($E("article_comment_list").parentNode, 'div', 'pages_line');
        if (pageLindNode && pageLindNode[0]){
            pageLindNode[0].style.display = 'none';
        }
        Core.Events.addEvent($E('show_blog_comments'), function(){
            var iNode = $E('show_blog_comments').getElementsByTagName('i')[0];
            var pageLindNode = Core.Dom.getElementsByClass($E("article_comment_list").parentNode, 'div', 'pages_line');
            if (iNode && iNode.className.indexOf('icon_down')>=0){
                $E('hide_blog_comments').style.display = '';
                // $E('article_comment_list').style.height = '0px';
                $E('article_comment_list').style.display = '';

                if ($E('commentPaging').innerHTML.indexOf('showPage') >= 0){
                    $E('commentPaging').style.display = 'block';
                    $E('commentPaging').parentNode.style.display = 'block';
                }
                $E('show_blog_comments').innerHTML = '收起<i class="icon icon_up"></i>';
                $E('writeComm_text').style.display = '';

                if (pageLindNode && pageLindNode[0]){
                    pageLindNode[0].style.display = '';
                }
            }else{
                $E('article_comment_list').style.display = 'none';
                $E('hide_blog_comments').style.display = 'none';
                if ($E('commentPaging').innerHTML.indexOf('showPage') >= 0){
                    $E('commentPaging').style.display = 'none';
                    $E('commentPaging').parentNode.style.display = 'none';
                }
                $E('show_blog_comments').innerHTML = '展开<i class="icon icon_down"></i>';
                $E('writeComm_text').style.display = 'none';
                if (pageLindNode && pageLindNode[0]){
                    pageLindNode[0].style.display = 'none';
                }
            }
        });
    }

    if ($E('hide_blog_comments')){
        Core.Events.addEvent($E('hide_blog_comments'), function(){
            var iNode = $E('show_blog_comments').getElementsByTagName('i')[0];
            var pageLindNode = Core.Dom.getElementsByClass($E("article_comment_list").parentNode, 'div', 'pages_line')
            if (iNode){
                $E('hide_blog_comments').style.display = 'none';
                $E('article_comment_list').style.display = 'none';
                $E('show_blog_comments').innerHTML = '展开<i class="icon icon_down"></i>';
            // 分页情况下  隐藏页码
                if ($E('commentPaging').innerHTML.indexOf('showPage') >= 0){
                    $E('commentPaging').style.display = 'none';
                    $E('commentPaging').parentNode.style.display = 'none';
                }
                $E('writeComm_text').style.display = 'none';
                if (pageLindNode && pageLindNode[0]){
                    pageLindNode[0].style.display = 'none';
                }
                // 重新定位相关阅读列表位置
                var pNode = $E('blog_relatefeed').parentNode;
                if (pNode){
                    var top = Core.Dom.getTop(pNode);
                    top -= 200;
                    if (document.documentElement.scrollTop){
                        document.documentElement.scrollTop = top;
                    }else{
                        document.body.scrollTop = top;
                    }
                }
            }
        });
    }

});
