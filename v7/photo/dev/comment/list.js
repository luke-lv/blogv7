/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 */
/** 
 * @fileoverview 评论列表读取
 * @author stan | chaoliang@staff.sina.com.cn
 */
$import("sina/core/class/create.js");
$import("sina/core/function/bind2.js");

$import("lib/interface.js");

$import("comment/_comment.js");

Comment.List = Core.Class.create();

Comment.List.prototype = {
    /**
     * 文章号id
     */
    articleid: 0,
    /**
     * 页码id
     */
    page: 0,
    /**
     * 评论总量
     */
    totle: 0,
	defaultAnchor : "#comment",
    initialize: function(){
    	this.articleid = picInfo.pic_id;
    },
    /**
     * 加载评论
     * @param {Number} page 加载页码
     */
    load: function(page){
        this.page = page;
		var url = "http://blog.sina.com.cn/s/photocomment_" + this.articleid +"_" + this.page + ".html?uid="+ scope.$uid +"&varname=usecache&rd="+ (+new Date());
        var loader = new Interface(url, "jsload");
		var _this=this;
        loader.request({
            GET: {
            },
			//returnType:"json",
            onSuccess: _this.list.bind2(_this),
            onError: function(e){
                switch (e.code) {
                    case "B36020":
                    case "B36021":
					case "A00001":
                        this.error(e.code);
                        break;
                    default:
                        showError(e.code);
                        this.error("B36110");
                        break;
                }
            }.bind2(this),
            onFail: function(){
                this.error("B36110");
            }.bind2(this)
        });return;
    },
    /**
     * 显示列表
     * @param {Object} result
     */
    list: function(data){
		trace('显示列表');
//		trace('e='+data);
        if (data == "") {
            this.error($isAdmin ? "B36021" : "B36020");
        }
        else {
            $E("article_comment_list").innerHTML = '<span name="' + this.defaultAnchor + this.page + '" id="'+this.defaultAnchor + this.page+'"></span>' + data;
        }
        this.anchor();
        this.paging();
    },
    /**
     * 加标签
     */
    anchor: function(){
        var url = window.location.href;
        var anchor = "#comment";
        var reg = new RegExp("(" + anchor + ")\\d*");
        if (url.indexOf(anchor) != -1) {
            window.location.href = url.replace(reg, "$1" + this.page);
        }
        else {
            if (this.page > 1) {
                window.location.href = anchor + this.page;
            }
        }
    },
    /**
     * 渲染分页
     */
    paging: function(e){
    },
    /**
     * 错误输出
     */
    error: function(code){
        $E("article_comment_list").innerHTML = '<li class="CP_litem"><div class="CP_cmt_none">' + $SYSMSG[code] + '</div></li>';
    }
}
