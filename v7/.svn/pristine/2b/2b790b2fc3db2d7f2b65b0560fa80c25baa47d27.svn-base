/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 */
/** 
 * @fileoverview 计算分页
 * @author stan | chaoliang@staff.sina.com.cn
 */
$import("lib/commentv2/_comment.js");

CommentV2.count = function(num){
    var perpage = 50;
    var pages = 0;
    if (num % perpage == 0) 
        pages = Math.ceil(num / perpage);
    else 
        pages = Math.floor(num / perpage) + 1;
    return pages;
};

