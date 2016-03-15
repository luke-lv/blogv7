/** 
 * @fileoverview 回复列表渲染及操作相关内容
 * @author gaolei | gaolei2@staff.sina.com.cn
 */
$import("sina/core/class/oop.js");
$import("sina/core/function/bind2.js");
$import("sina/core/string/trim.js");
$import("sina/ui/pagination.js");
$import("lib/interface.js");

$import("lib/commentv2/_comment.js");
$import("lib/commentv2/commentArea.js");
$import("lib/commentv2/add.js");
$import("lib/commentv2/delete.js");
$import("lib/commentv2/report.js");
$import("lib/commentv2/share.js");

CommentV2.ReplyList = function(opt){
    // this.initTextArea = false;
	this.type = 'reply';	
    this.cmtAdd = new CommentV2.Add({// 增加回复操作
        type: this.type,
        url: 'http://control.blog.sina.com.cn/admin/comment_new/cms_usereply_post.php?domain=2',
		tpl: opt.replyTpl || ''
    });
	this.ownerNickName = opt.data.ownerNickName || '';
    this.cmtDel = new CommentV2.Delete();       // 删除回复操作
    this.cmtReport = new CommentV2.Report();    // 举报回复操作
    this.cmtShare = new CommentV2.Share();
    this._openAreas = {};//已经初始化过的评论框
	
}.$extends(CommentV2.List).$define({
    /** 
     *    加载列表接口
     * @param page 回复当前页
     */
    load: function(page){
        var __this = this;
        this.initContainerAndTextArea();//渲染外容器和发布框，只渲染一次
        this.show();
        if(this.data.cms_reply_num == 0){
            return;
        }
        this.showLoading();
        this.page = page;
		
        var data = {
            article_id: this.articleid,                // 文章ID
            comment_id: this.data.commentid, // 评论ID
            page: this.page                			// 当前页
        }
		this.url = 'http://control.blog.sina.com.cn/admin/comment_new/cms_usereply_list.php?domain=2';
		this.loader = new Interface(this.url, 'ijax');
        // trace(data)
        // TODO 接口请求失败或返回错误的情况没有判断
        this.loader.request({
            POST: data,
            returnType: 'json',
            onSuccess: __this.render.bind2(__this),
            onError: function(e){
                trace("reply list onerror");
				this.error(e.code);
            }.bind2(__this),
            onFail: function(e){
                trace("reply list onfail");
				this.error(e.code);
            }.bind2(__this)
        });
    },
    
    /** 
     *    渲染回复列表
     * @param result 评论接口返回data中的内容
     */
     
    render: function(result){
        //this.renderTextArea();
        //cms_reply_num
		// debugger
        this.renderList(result);
        this.paging();
        // this.show();
    },
    /**
     * 渲染二级列表和发布框的外容器
     **/
     initContainerAndTextArea:function (argument) {
        if(this.containerIsReady){
            return;
        }
         var str = '<div class="SG_reply_con borderc">'+
                        '<div class="bd">'+
                            '<div id="comment_'+this.data.commentid+'_textarea">'+
                            '</div>'+
                            '<div class="reply_list">'+
                            '<ul id="comment_'+this.data.commentid+'_replylist" style="display:none;">'+
                            '</ul>'+
                            '</div>'+
							'<div class="rp2" id="loading_'+this.data.commentid+'" style="display:none"><div class="SG_reply_con"><div class="bd"><div class="loading"><span class="ico_loading"></span><p>正在加载，请稍后...</p></div></div></div></div>'+
                            '<div class="SG_page" style="display:none;">'+
                              '<ul class="SG_pages" id="comment_'+this.data.commentid+'_pages">'+
                              '</ul>'+
                            '</div>'+
                          '</div>'+

                    '</div>';
        this.containerNode.innerHTML = str;
        this.renderTextArea();
        this.containerIsReady = 1;
     },
    /** 
     *    初始化回复框
     */
    
    renderTextArea: function(){
        var commentArea = new CommentV2.CommentArea({
            container: $E("comment_"+this.data.commentid+"_textarea")
        });
        var item = this.data;
        var ownernickEl = $E("ownernick");
        var ownernickname = ownernickEl ? this.trim(ownernickEl.innerHTML) : "";//博主昵称
        commentArea.setReplyData(this, {
            article_id: this.articleid,                                // 博文ID
            reply_cmsid: item.commentid,                            // 二级评论ID
            stair_cmsid: item.commentid,                            // 一级评论ID
            src_uname: this.data.ownerNickName || ownernickname,                            // 博主昵称
            blog_title: $E("t_"+this.articleid) ? this.trim($E("t_"+this.articleid).innerHTML) : "",        // 博文标题
            uid: $UID,                                                    // 发二级评论人的UID/当前登录用户的UID
            //uname: scope.$loginNick,                                // 发二级评论人的昵称/当前登录用户的昵称
            source_uid: item.comm_uid,                            // 被回复的一级评论人的UID/被回复的二级评论的UID
            source_uname: item.uname,                            // 被回复的一级评论人的昵称/被回复的二级评论的昵称
            // reply_content: item.cms_body,                        // 一级评论或二级评论的内容
            login_name: scope.$loginNick,                        // 发二级评论人的昵称/当前登录用户的昵称,同uname
            is_t: 0,                                             // 是否分享到微博
            source_ulink: item.ulink                        // 评论人的链接
        });
    },
    
    /** 
     *    渲染回复列表
     * @param result 评论接口返回data中的内容
     */
    
    renderList: function(result){
        // trace("render reply list");
		Lib.checkAuthor();
        if (result == "") {
            this.error($isAdmin ? "B36021" : "B36020");
        }else {
            var oFragment = document.createDocumentFragment();
            var li;
            
            this.total = result && result.cms_usereply_totalnum;
			this.total = parseInt(this.total, 10);
			this.hideLoading();
            if (this.total== 0){
                this.show();
                return;
            }
            var resultData = result.comment_reply_data;
			var len = resultData.length;
			var blog_id = result.blog_id;
            
			// debugger
            for (var i=0; i<len; i++){
                var item = resultData[i];
                item.action_data = this.obj2str({
                    articleid: blog_id,
                    commentid: item.stair_cms_id,
                    replyid: item.id,
                    comm_uid: item.comm_uid,
                    uname: item.uname,
                    source_uid: item.source_uid,
                    // cms_body: item.cms_body,
					ulink: item.ria_index_url,
                    source_ulink: item.ulink,
					src_uid: item.src_uid		// 博主的UID
                });
                li = this.cmtAdd.render(item, i, len);
                oFragment.appendChild(li);
            }
            
            $E("comment_"+this.data.commentid+"_replylist").appendChild(oFragment);
            $E("comment_"+this.data.commentid+"_replylist").style.display = "";
            location.hash = "cmt_" + this.data.commentid;
        }
    },
    
    /** 
     *    显示回复列表
     */
    
    show: function(){
        CommentV2.ReplyList.$super.show.call(this);
		v7sendLog('32_01_01');
        var strHtml = this.node.innerHTML;
        strHtml = strHtml.replace(/回复|取消回复/,"取消回复");
        this.node.innerHTML = strHtml;
    },
    
    /** 
     *    隐藏回复列表
     */
    
    hide: function(){
        CommentV2.ReplyList.$super.hide.call(this);
		v7sendLog('32_01_02');
        var strHtml = this.node.innerHTML;
        strHtml = strHtml.replace("取消","");
        this.node.innerHTML = strHtml;
    },
    
    /** 
     *    显示loading
     */
     
    showLoading: function(){
		$E("comment_"+this.data.commentid+"_replylist").innerHTML = "";
        $E('loading_'+this.data.commentid).style.display = "";
        
    },
    /** 
     *    隐藏loading
     */
     
    hideLoading: function(){
        $E('loading_'+this.data.commentid).style.display = "none";
        
    },
    /** 
     *    回复列表分页
     * TODO 测试还有些问题
     */
    
    paging: function(){
        var __this = this;
        var paging = $E('comment_'+this.data.commentid+'_pages');
        if (paging){
            var perpage = 20, pages = 0;
            if (this.total % perpage == 0){
                pages = Math.ceil(this.total / perpage);
            }else{
                pages = Math.floor(this.total / perpage) + 1;
            }
            if (this.total > perpage) {
                paging.parentNode.style.display = "block";
                paging.style.display='block';
                Ui.Pagination.init({
                    "pageNode": "comment_"+__this.data.commentid+"_pages",
                    "nodeClassNamePrefix": "SG",
                    "curPage": this.page, // 当前所在页码
                    "maxPage": pages, //最大页数
                    "pageTpl": function(page){
                        // scope.$reply_page = page;
                        __this.load(page);
						location.hash = "";
                    }
                }).show();
            }else{
                paging.parentNode.style.display = "none";
            }
        }
    },
    //获取评论源数据
    setSrcComment:function(id,uid,commentArea){
        var param = {cms_id:id,uid:uid,origin:1};
        var _this = this;
        //接口wiki http://wiki.intra.sina.com.cn/pages/viewpage.action?pageId=10846386
        var getInterface = new Interface("http://control.blog.sina.com.cn/blog_rebuild/riaapi/profile/note/getCms.php", "jsload");
        getInterface.request({
            GET: param,
            onSuccess: function(_data){
                var cms_body = _data.cms_body;
                var nick_name = _data.nick_name;
                var source_uname = _data.source_uname;
                if(cms_body){
                    var comment = "//@"+ nick_name + " 回复 @" + source_uname +" :" + cms_body;
                    commentArea.setValues({comment:comment});
                }
            }.bind2(this),
            onError: function(res){
                if(res&&res.code){
                    winDialog.alert($SYSMSG[res.code],{
                        funcOk: function(){
                        }
                    });
                }
            },
            onFail: function(res){
                if(res&&res.code){
                    winDialog.alert($SYSMSG[res.code],{
                        funcOk: function(){
                        }
                    });
                }
            }
        });
    },
    /** 
     *    回复的回复
     * @param opt 通过事件代理传递过来的参数
     * TODO  登录判断
     */
    reply: function(opt){
        
        var __this = this;
        // trace("CommentV2.ReplyList.reply");
        // trace(opt.node);
        if (!opt.containerNode.isInited){
			v7sendLog('32_01_05');
            opt.node.innerHTML = "<cite>取消回复</cite>";
            var str ='<div class="SG_reply_con">'+
                '<div class="bd" id="reply_'+opt.data.replyid+'_textarea">'+
                '</div>'+
            '</div>';
            var div = document.createElement("div");
            div.className = "SG_reply borderc rp2";
            div.innerHTML = str;
            div.id = "reply_"+opt.data.replyid+"_textcon";
            opt.containerNode.appendChild(div);
            opt.containerNode.isInited = true;
            var replyArea = $E("reply_"+opt.data.replyid+"_textarea");
            var item = opt.data;
            this._openAreas[opt.data.replyid] = new CommentV2.CommentArea({
                container: replyArea, 
                autolineheight:"yes",
                sid:new Date().getTime(),
                shownum: 'no',
                okhandler:function() {
                    var replyCon = $E("reply_"+opt.data.replyid+"_textcon");
                    if(replyCon){
                        replyCon.style.display = "none";
                        opt.node.innerHTML = "<cite>回复</cite>";
                    }
                }
            });
            
            this._openAreas[opt.data.replyid].setReplyData(__this, {
                article_id: opt.articleid,                                // 博文ID
                reply_cmsid: item.replyid,                                // 二级评论ID
                stair_cmsid: item.commentid,                            // 一级评论ID
                src_uname: this.ownerNickName,                            // 博主昵称
                blog_title: $E("t_"+opt.articleid).innerHTML,        // 博文标题
                uid: $UID,                                                    // 发二级评论人的UID/当前登录用户的UID
                // uname: scope.$loginNick,                            // 发二级评论人的昵称/当前登录用户的昵称
                source_uid: item.comm_uid,                            // 被回复的一级评论人的UID/被回复的二级评论的UID
                source_uname: item.uname,                            // 被回复的一级评论人的昵称/被回复的二级评论的昵称
                // reply_content: item.cms_body,                        // 一级评论或二级评论的内容
                login_name: scope.$loginNick,                        // 同uname
                is_t: 0,                                                        // 是否分享到微博
                source_ulink: item.source_ulink                       // 评论人的链接
            });
            this.setSrcComment(item.replyid,item.src_uid,this._openAreas[opt.data.replyid]);
        }else{
            var replyCon = $E("reply_"+opt.data.replyid+"_textcon");
            if (replyCon.style.display == "none"){
				v7sendLog('32_01_05');
                replyCon.style.display = "";
                if(this._openAreas[opt.data.replyid].getValue() == ""){
                    this.setSrcComment(opt.data.replyid,opt.data.src_uid,this._openAreas[opt.data.replyid]);
                }
                opt.node.innerHTML = "<cite>取消回复</cite>";
            }else{
                replyCon.style.display = "none";
                opt.node.innerHTML = "<cite>回复</cite>";
            }
        }
    },
    
    /** 
     *    新增回复
     * @param data   回复框需要的数据
     * @param sucFn 回复成功后的回调
     * @param errFn  回复失败后的回调
     */
    
    add: function(data, sucFn, errFn){
        trace("CommentV2.ReplyList.add");
        trace(data);
		data.cms_reply_num = this.total;
        this.cmtAdd.post(data, function(){
            this.total++;
            var str = this.node.innerHTML;
            // 回复数量的变化全部已回复按钮的显示为准，返回值可能和当前页面显示不同，加减回复时全部加减页面上的数字
            // TODO 评论数字问题还是需要以后在确认下
            this.node.innerHTML = str.replace(/(\d+)/, this.total);
            var str = $E('c_' + this.articleid).innerHTML;
            var num = parseInt(/(\d+)/.exec(str)[0], 10);
            num++;
            $E('c_' + this.articleid).innerHTML = "(" + num + ")";
            sucFn();
        }.bind2(this), errFn);
    },
    
    /** 
     *    回复分享
     * TODO 分享带有表情的评论时，表情显示有问题，看看怎么过滤
     * @param opt 通过事件代理传递过来的参数
     */
    
    share: function(opt){
        trace("CommentV2.ReplyList.share");
		v7sendLog('32_01_06');
		this.cmtShare.replyShare(opt.data);
    },
    
    /** 
     *    回复删除
     * @param opt 通过事件代理传递过来的参数
     */
    
    del: function(opt){
        trace("CommentV2.ReplyList.del");
		v7sendLog('32_01_08');
        this.cmtDel.deleteReply(opt, this.delSucc.bind2(this));
    },
    
    /** 
     *    评论删除成功回调
     * @param res 评论成功后的返回值
     */
    
    delSucc: function(res){
        
        this.total = this.total-- ? this.total : 0;
        var str = this.node.innerHTML;
        // 回复数量的变化全部已回复按钮的显示为准，返回值可能和当前页面显示不同，加减回复时全部加减页面上的数字
        // TODO 评论数字问题还是需要以后在确认下
        this.node.innerHTML = str.replace(/(\d+)/, this.total);
        var str = $E('c_' + this.articleid).innerHTML;
        var num = parseInt(/(\d+)/.exec(str)[0], 10);
        num = num-- ? num : 0;
        $E('c_' + this.articleid).innerHTML = "(" + num + ")";
		if (this.total == 0){
			$E("comment_"+this.data.commentid+"_replylist").style.display = "none";
		}
    },
    
    /** 
     *    回复举报 
     * TODO 还没有进行联调测试
     * @param opt 通过事件代理传递过来的参数
     */
    
    report: function(opt){
        trace("CommentV2.ReplyList.report");
		v7sendLog('32_01_07');
        this.cmtReport.replyReport(opt.data);
    }
});