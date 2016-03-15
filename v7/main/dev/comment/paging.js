/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 */
/** 
 * @fileoverview 评论页码
 * @author stan | chaoliang@staff.sina.com.cn
 */
$import("sina/ui/pagination.js");
$import("comment/_comment.js");
$import("comment/list.js");
$import("comment/count.js");
$import("sina/utils/io/jsload.js");

/**
 * 渲染分页
 * @param {Object} num 评论总数
 * @param {int} curpage 当前页码 
 */
Comment.paging = function(num,curpage){
    var paging = $E("commentPaging");
	if (paging) {
		var myCommnet = new Comment.List();
		//每页个数
		var perPage = 50;
		var pages =Comment.count(num);
		scope.$comment_page = curpage;
		if (num > perPage) {
            if ($E('article_comment_list') && $E('article_comment_list').style.display != 'none') {
			paging.parentNode.style.display = "block";
			$E('commentPaging').style.display='block';
            }else{
                paging.parentNode.style.display = "none";
                $E('commentPaging').style.display='none';
            }
			Ui.Pagination.init({
				"pageNode": "commentPaging",
				"nodeClassNamePrefix": "SG",
				"curPage": curpage, // 当前所在页码
				"maxPage": pages, //最大页数
				"pageTpl": function(page){
					scope.$comment_page = page;
					myCommnet.load(page);
				}
			}).show();
			paging.onclick = sudaClick;
		}else{
			paging.parentNode.style.display = "none";
		}
	}

	function sudaClick(event){
		var target= (event && event.target) || (window.event && window.event.srcElement);
        if(target && target.tagName && target.tagName.toLowerCase() == 'a'){
            Lib.sendSuda(function () {
                try{
                    //2013.4.12 suda代码修改
                    //S_pSt()函数不再使用, 如果需要统计动态加载等调用SUDA.log()
                    SUDA.log("","blog_blogcomment_page"); 
                }catch(e){
                }
            }); 
        }else{
            return;
        }
	}
};
