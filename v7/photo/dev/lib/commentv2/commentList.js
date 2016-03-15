/** 
 * @fileoverview 评论列表渲染及操作相关内容
 * @author gaolei | gaolei2@staff.sina.com.cn
 */
$import("sina/core/class/oop.js");
$import("sina/core/function/bind2.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/ui/pagination.js");
$import("lib/listener.js");
$import("lib/uic.js");

$import("lib/commentv2/_comment.js");
$import("lib/commentv2/list.js");
$import("lib/commentv2/replyList.js");
$import("lib/commentv2/add.js");
$import("lib/commentv2/delete.js");
$import("lib/commentv2/report.js");
$import("lib/commentv2/share.js");

// window.onerror = null;
CommentV2.CommentList = function(opt){
	this.ownerNickName = "";
	this.type = 'comment';
	this.defaultAnchor = '#comment';		
	this.replyList = {};											// 评论回复列表对象集合
	this.addEvent = Core.Events.addEvent;
	this.removeEvent = Core.Events.removeEvent;

	this.cmtAdd = new CommentV2.Add({
		type: this.type,
		tpl: opt.commentTpl || ''
	});				// 增加评论操作
	this.cmtDel = new CommentV2.Delete();				// 删除评论操作
	this.cmtReport = new CommentV2.Report();		// 举报评论操作
	this.cmtShare = new CommentV2.Share();
	this.bindEvent();//列表没渲染时也绑定事件，兼容由发布框发布第一条评论时的事件
}.$extends(CommentV2.List).$define({
	/** 
	 *	加载列表接口
	 * @param page 评论当前页
	 */
	load: function(page){
		var __this = this;
		this.page = page;
		
		this.url = this.purl + '_' +this.page+'.html?comment_v=articlenew';
		this.loader = new Interface(this.url, 'ajax');
		this.loader.request({
			GET: {
                url_random: 0
            },
			returnType:"json",
            onSuccess: __this.render.bind2(__this), // 请求成功，返回值为A00006
            onError: function(e){// 请求成功，但返回错误，返回值非A00006，这里用的旧代码，没测试过
                switch (e.code) {
                    case "B36020":
                    case "B36021":
					case "A00001":
                        this.error(e.code);
                        break;
                    default:
                        this.showError(e.code);
                        this.error("B36110");
                        break;
                }
            }.bind2(this),
            onFail: function(){// 请求失败
                this.error("B36110");
            }.bind2(this)
		});
	},
	/** 
	 *	渲染评论列表
	 * @param result 评论接口返回data中的内容
	 */
	render: function(result){
		// trace(result)
		Lib.checkAuthor();
		this.containerNode.innerHTML = "";
        if (result == "") {
            this.error($isAdmin ? "B36021" : "B36020");
            return;
        }else {
			var oFragment = document.createDocumentFragment();
			var li, item;
			this.total = result.comment_total_num;//评论总数
			if (this.total == 0){
				this.renderNoComment();
			}
			for (var i=0,len=result.comment_data.length; i<len; i++){
				item = result.comment_data[i];
				item.action_data = this.obj2str({
					commentid: item.id,
					articleid: scope.$articleid,
					// cms_body: item.cms_body,
					fromProduct: item.fromProduct,
					comm_uid: item.comm_uid,
					uname: item.uname,
					ulink: item.ulink,
					src_uid: item.src_uid,	// 博主的UID
					cms_reply_num:item.cms_reply_num//二级评论数
				});
				// 直接使用新增评论方法渲染评论
				li = this.cmtAdd.render(item, i);
				oFragment.appendChild(li);	
			}
			this.containerNode.appendChild(oFragment);
        }
        this.anchor();
        this.paging();
        this.sendEvents(result);
		//this.bindEvent();
	},
	/** 
	 *	对外发广播，评论列表渲染完成了
	 */
	sendEvents:function(data){
		Lib.Listener.notify("commentlist-isready", data);
		scope.$commentlistIsReady = 1;//添加标识
	},

	/** 
	 *	没有评论时的评论列表
	 */
	renderNoComment: function(){
		this.containerNode.innerHTML = '<li><div class="noCommdate"><span class="SG_txtb">做第一个评论者吧！ '+
													'<img class="SG_icon SG_icon134" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="18" height="18" title="" align="absmiddle">'+
													'<a href="#post">抢沙发&gt;&gt;</a></span></div></li>';
	},
	
	/** 
	 *	新增评论
	 */
	add: function(data){
		var 	item = data.item,
				fun = data.fun;		
		var li = this.cmtAdd.render(data.item);
		fun(li);
	},
	
	/** 
	 *	评论删除
	 * @param opt 通过事件代理传递过来的参数
	 * TODO  登录判断
	 */
	
	del: function(opt){
		trace("CommentV2.CommentList.del");
		// opt.delSucc = this.delSucc;
		this.cmtDel.deleteComment(opt, this.delSucc.bind2(this));
	},
	
	/** 
	 *	评论删除成功回调
	 * @param res 评论成功后的返回值
	 * var requestId_65431312={"code":"A00006","data":{"staircms_total_num":"29","cms_total_num":"114"}}
	 */
	
	delSucc: function(res){
		// staircms_total_num  一级评论总数
		// cms_total_num		一级评论+二级评论总数
		this.total = res && res.staircms_total_num;
		// 评论数量的变化全部已文章底部显示为准，返回值可能和当前页面显示不同，加减评论时全部加减页面上的数字
		// TODO 评论数字问题还是需要以后在确认下
		// 暂时不给scope赋值
		// scope.$totle_comment = res.cms_total_num;
		var str = $E('c_' + scope.$articleid).innerHTML;
		var num = parseInt(/(\d+)/.exec(str)[0], 10);
		num = num-- ? num : 0;
		$E('c_' + scope.$articleid).innerHTML = "(" + num + ")";
		if (this.total == 0){
			this.renderNoComment();
		}else{
			if (this.containerNode.getElementsByTagName("li").length == 0){
				this.page--;
				this.load(this.page);
			}
		}
	},
	
	/** 
	 *	评论回复
	 * @param opt 通过事件代理传递过来的参数
	 */
	
	reply: function(opt){
		trace("CommentV2.CommentList.reply");
		var that = this;
		
		Lib.Uic.getNickName([scope.$uid], function(data){
			that.ownerNickName = data[scope.$uid] || '';
			// 根据当前评论id，存储回复列表的引用，若已经初始化过列表，将不再重新请求接口渲染数据
			opt.replyTpl = that.replyTpl || '';
			opt.data.ownerNickName = that.ownerNickName;
			var id = opt.data.commentid;
			if (that.replyList[id]){
				that.replyList[id].toggle();
			}else{
				that.replyList[id] = new CommentV2.ReplyList(opt);
			}
		});

	},
	
	/** 
	 *	评论举报 
	 * TODO 还没有进行联调测试
	 * @param opt 通过事件代理传递过来的参数
	 */
	
	report: function(opt){
		trace("CommentV2.CommentList.report");
		this.cmtReport.commentReport(opt.data);
	},
	
	/** 
	 *	评论分享
	 * TODO 分享带有表情的评论时，表情显示有问题，看看怎么过滤
	 * @param opt 通过事件代理传递过来的参数
	 */
	share: function(opt){
		trace("CommentV2.CommentList.share");
		this.cmtShare.commentShare(opt.data);
	},
	
	/** 
	 *	评论查看更多
	 * TODO 暂时不做了
	 * @param opt 通过事件代理传递过来的参数
	 */
	more: function(opt){
		trace("CommentV2.CommentList.more");
		var id = opt.data.commentid;
		var partCmsNode = $E("body_cmt_"+id);
		var fullCmsNode = $E("body_cmt_full_"+id);
		
		if (opt.node.className == "btn_artzk"){// 收起状态，点击展开
			v7sendLog('32_01_03');
			partCmsNode && (partCmsNode.style.display = "none");
			fullCmsNode && (fullCmsNode.style.display = "");
		}else if (opt.node.className == "btn_artsq"){// 展开状态，点击收起
			v7sendLog('32_01_04');
			partCmsNode && (partCmsNode.style.display = "");
			fullCmsNode && (fullCmsNode.style.display = "none");
		}
	},
	
	/** 
	 *	评论列表分页
	 * TODO-dong 测试还有些问题
	 */
	
	paging: function(){
		var __this = this;
		var paging = $E("commentPaging");
		if (paging){
			var perpage = 50, pages = 0;
			if (this.total % perpage == 0){
				pages = Math.ceil(this.total / perpage);
			}else{
				pages = Math.floor(this.total / perpage) + 1;
			}
			// scope.$totle_comment = this.total;
			// scope.$comment_page = this.page;
			if (this.total > perpage) {
				paging.parentNode.style.display = "block";
				$E('commentPaging').style.display='block';
				Ui.Pagination.init({
					"pageNode": "commentPaging",
					"nodeClassNamePrefix": "SG",
					"curPage": this.page, // 当前所在页码
					"maxPage": pages, //最大页数
					"pageTpl": function(page){
						// scope.$comment_page = page;
						__this.load(page);
					}
				}).show();
				paging.onclick = this.sudaClick;
			}else{
				paging.parentNode.style.display = "none";
			}
		}
	},
	
	/** 
	 *	评论列表分页布码
	 * TODO 没有测试过，直接copy的旧代码
	 */
	
	sudaClick: function(event){
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
	},
	
	/** 
	 *	评论锚点
	 * TODO 没有测试过，直接copy的旧代码
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
	
	showError: function(result){
		winDialog.alert(($SYSMSG[code]),{
			"icon": "02"
		});
	}
});