/**
 * @fileoverview
 *	新个人中心——相册评论列表类
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/string/trim.js");
$import("sina/utils/io/jsload.js");
$import("sina/ui/template.js");
$import("sina/ui/pagination.js");

$import("lib/interface.js");
$import("jobs/resource.js");

PhotoCommentList = Core.Class.create();
PhotoCommentList.prototype= {
	// 整个评论区域的 HTML
	"html"	: [
		'<div class="aBfTopRow">'
			,'<div class="chbox"><input id="selectAllTop" type="checkbox" '
				,'onclick="scope.photoComment.selectAllComments(this);" /></div>'
			,'<div class="uTxt">全选</div>'
			,'<div class="uBtn"><a href="#" onclick="return false;" class="SG_aBtn ">'
				,'<cite onclick="scope.photoComment.deleteSelectedComments();">删除</cite></a></div>'
			,'<div class="clearit"></div>'
		,'</div>'
		,'<div class="cBoxList ptCmt SG_j_linedot1">#{comment_data}#</div>'
		,'<div class="aBfTopRow">'
			,'<div class="chbox"><input id="selectAllBottom" type="checkbox" '
				,'onclick="scope.photoComment.selectAllComments(this);" /></div>'
			,'<div class="uTxt">全选</div>'
			,'<div class="uBtn"><a href="#" onclick="return false;" class="SG_aBtn ">'
				,'<cite onclick="scope.photoComment.deleteSelectedComments();">删除</cite></a></div>'
			,'<div class="clearit"></div>'
		,'</div>'
		,'<div class="SG_page" id="comment_page" style="display:none;"></div>'
	].join("")
	// 单条评论的 HTML
	,"itemHTML"		: [
		'<div class="cBox SG_j_linedot1" id="comment_#{news_id}_#{comment_id}">'
			,'<div class="chbox">'
				,'<input type="checkbox" id="check_#{news_id}_#{comment_id}"'
					,'onclick="scope.photoComment.selectComment(this, \'#{news_id}\', \'#{comment_id}\');" />'
			,'</div><div class="cBox_main">'
				,'<div class="cBox_pt">#{user_head}</div>'
				,'<dl class="msg">'
					,'<dt>'
					,'<div class="cBox_tit"><strong>#{user_nick}</strong></div>'
					,'<div class="time SG_txtb">#{datetime}'
						,'<a href="#" onclick="return false;" class="CP_a_fuc">[<cite '
							,'onclick="scope.photoComment.delectComment(\'#{news_id}\', \'#{comment_id}\');">删除</cite>]</a>'
					,'</div><div class="clearit"></div>'
					,'</dt>'
					,'<dd>#{comment_content}</dd>'
				,'</dl>'
				,'<div class="ptCmt_view">'
					,'<p><a href="#{image_source}" target="_blank"><img src="#{image_src}" /></a></p>'
					,'<p><a href="#{image_source}" target="_blank">#{image_title}</a></p>'
				,'</div>'
				,'<div class="clearit"></div>'
			,'</div>'
		,'</div>'
	].join("")
	// 评论列表类初始化
	,"initialize"	: function () {
		this.container = $E("photocomm");
		this.loadComment();
	}
	/*
	 * 加载评论，流程如下：
	 * (需要依赖页面内直接输出的 JS 变量)
	 *		<script type="text/javascript">
	 *		var cmnt_channel	= "xc";						
	 *		var cmnt_newsid		= "1406758883";  	
	 *		var cmnt_group		= 1; 						
	 *		var cmnt_page		= 1;						
	 *		var cmnt_pagesize	= 15;
	 *		var pic_domain		= "http://sX.sinaimg.cn"; //"http://static.photo.sina.com.cn";
	 *		var cmnt_host		= "http://comment.photo.sina.com.cn";
	 *		</script>
	 *	1、加载 http://comment.photo.sina.com.cn/comment/cmnt_xml.js
	 *	2、加载 http://comment.photo.sina.com.cn/comment/cmnt_embed.js
	 *	3、回调相应 window.cmnt_notfound（无评论）或者 window.cmnt_print（有评论）
	 * 		如果有评论，在形如：http://comment.photo.sina.com.cn/comment/xml/xc/3B/5B/1406758883_embed_1.js?random=1258441822 
	 * 		的 JS 中可以找到评论数据
	 * 		其中：	Count.c_pages 表示总的页码数，可用于分页
	 * 				评论数据存放在数组 CmsgList 中
	 */
	,"loadComment"	: function () {
		Utils.Io.JsLoad.request([{url : "http://comment.photo.sina.com.cn/comment/cmnt_xml.js", charset:"gbk"}], {
			onComplete : function (){
				Utils.Io.JsLoad.request([{url : "http://comment.photo.sina.com.cn/comment/cmnt_embed.js", charset:"gbk"}], {});
			}
		});
	}
	// 评论为空
	,"showEmpty"	: function(){
		this.container.innerHTML = ('<div class="aBfTop SG_txtc"><div class="SG_nodata"><p>暂无评论!</p></div></div>');
	}
	// 显示评论列表
	,"showCommentList"	: function(){
		// 评论不为空
		if(CmsgList.length > 0){
			// 整理数据到数组 _commentData
			var _commentData = [];
			for(var i = 0, len = CmsgList.length; i < len; i ++){
				// 评论者 id
				var _userId = Core.String.trim(CmsgList[i].m_user);
				// 是匿名评论
				var _isAnonymous = _userId * 1 == 0;
				//
				var _content = Core.String.trim(CmsgList[i].m_content).split("0xfe0816");
	
				// 用户头像
				var _userHead = _isAnonymous ? 'http://portrait1.sinaimg.cn/0/blog/50'
									: 'http://portrait' + (_userId % 8 + 1) + '.sinaimg.cn/' + _userId + '/blog/50';
				_userHead = '<img src="' + _userHead + '" width="50" height="50" alt="'
								+ _content[0] + '" title="' + _content[0] + '" />';
				var _serverNo = window.parseInt(CmsgList[i].n_url.replace(/.*(.{2})$/i, "$1"), 16) % 16 + 1;/*1 static server NO. */
				var _newsId = CmsgList[i].m_newsid.split("1-1-")[1].replace(/(^\s*|\s*$)/g, "");
				var _commentItem = {
					"news_id"			: Core.String.trim(CmsgList[i].m_newsid)	/* 被评论的资源 ID */
					,"comment_id"		: CmsgList[i].m_id	/* 评论的 ID */
					,"user_head"		: _isAnonymous ? _userHead 
											: '<a href="http://photo.blog.sina.com.cn/u/' + _userId + '" target="_blank">'
													+ _userHead + '</a>'	/* 头像 */
					,"user_nick"		: _isAnonymous ? _content[0]
											: '<a href="http://photo.blog.sina.com.cn/u/' + _userId + '" target="_blank">'
													+ _content[0] + '</a>'	/* 昵称 */
					,"datetime"			: Core.String.trim(CmsgList[i].m_datetime)	/* 评论的时间 */
					,"comment_content"	: _content[1]	/* 评论的内容 */
					,"image_source"		: Core.String.trim(CmsgList[i].n_url)	/* 资源来源 */
					//,"image_src"		: 'http://static' + _serverNo + '.photo.sina.com.cn/square/' + _newsId -- Modified by W.Qiang wangqiang1(7314)
					,"image_src"		: 'http://s' + _serverNo + '.sinaimg.cn/square/' + _newsId	/* 资源缩略图 */
					,"image_title"		: Core.String.trim(CmsgList[i].n_title)	/* 资源标题*/
				};
				_commentData.push(_commentItem);
			}
			// 拼出 HTML
			var template = new Ui.Template(this.itemHTML);
			var result = template.evaluateMulti(_commentData);
			result = this.html.replace("#{comment_data}#", result);
			// 渲染评论
			this.container.innerHTML = result;
			// 渲染分页
			this.currentPage = this.currentPage || 1;
			if(Count.c_pages > 1){
				$E("comment_page").style.display = '';
				Ui.Pagination.init({
					"pageNode" : "comment_page",
					"nodeClassNamePrefix" :	"SG",
					"curPage" : this.currentPage,
					"maxPage" : Count.c_pages,
					"pageTpl" : Core.Function.bind2(scope.photoComment.goToPage, scope.photoComment)
				}).show();
			}
		}else{
			this.showEmpty();
		}
	}
	,"goToPage"	: function (nPage) {
		this.container.scrollIntoView(true);
		this.currentPage = nPage;
		window.cmnt_page = nPage;
		cmnt_reload(cmnt_channel, cmnt_newsid, cmnt_group);
		return false;
	}
	// 选择所有评论
	,"selectAllComments"	: function(oNode){
		var isAllSelected = oNode.checked;
		for(var i = 0, len = CmsgList.length; i < len; i ++){
			var _newsId = Core.String.trim(CmsgList[i].m_newsid);
			var _cmtId = CmsgList[i].m_id;
			var _checkBox = $E("check_" + _newsId + "_" + _cmtId);
			if(_checkBox && _checkBox.checked != isAllSelected){
				_checkBox.checked = isAllSelected;
			}
		}
		$E("selectAllTop").checked = isAllSelected;
		$E("selectAllBottom").checked = isAllSelected;
	}
	// 选择单条评论
	,"selectComment"	: function(oNode, sNewsId, nCommentId){
		var isSelected = oNode.checked;
		// 如果当前评论被选择后，判断是否所有评论都被选择了，如果是就给全选打勾；
		if(isSelected){
			var isAllSelected = true;
			for(var i = 0, len = CmsgList.length; i < len; i ++){
				var _newsId = Core.String.trim(CmsgList[i].m_newsid);
				var _cmtId = CmsgList[i].m_id;
				var _checkBox = $E("check_" + _newsId + "_" + _cmtId);
				if(!_checkBox.checked){
					isAllSelected = false;
				}
			}
			if(isAllSelected){
				$E("selectAllTop").checked = isAllSelected;
				$E("selectAllBottom").checked = isAllSelected;
			}
		}
		// 否则，去掉全选的勾
		else{
			$E("selectAllTop").checked = false;
			$E("selectAllBottom").checked = false;
		}
	}
	// 删除选择的评论
	,"deleteSelectedComments"	: function(){
		Core.Events.stopEvent();
		// 遍历获得被选择的评论
		var selectedNewsId = [];
		var selectedCommentId = [];
		for(var i = 0, len = CmsgList.length; i < len; i ++){
			var _newsId = Core.String.trim(CmsgList[i].m_newsid);
			var _cmtId = CmsgList[i].m_id;
			var _checkBox = $E("check_" + _newsId + "_" + _cmtId);
			if(_checkBox.checked){
				selectedNewsId.push(_newsId);
				selectedCommentId.push(_cmtId);
			}			
		}
		if(selectedNewsId.length == 0){
			winDialog.alert($RESOURCE.choose_comment);
		}else{
			winDialog.confirm($RESOURCE.delete_allcomment, {
					icon:"04",
					textOk:'删除',
					funcOk : function(){
						new Interface("http://photo.blog.sina.com.cn/services/ajax_comment_delete.php", "jsload").request({
							GET : {
								newsid : selectedNewsId.join(","),
								mid : selectedCommentId.join(",")
							},
							onSuccess : function(res){
								winDialog.alert($RESOURCE.set_ok,{
									textOk :'确定',
									icon : '03',
									subText : $RESOURCE.set_delay,
									funcOk : function(){
									     window.location.reload();   
									}
								 });
							},
							onError : function(res){
								winDialog.alert($SYSMSG[res.code], { icon : "03" });
							},
							onFail : function(res){
								winDialog.alert($SYSMSG.A00001, {});
							}
						});
					}
				}
			);
		}
	}
	// 删除单条评论
	,"delectComment"	: function(sNewsId, nCommentId){
		Core.Events.stopEvent();
		winDialog.confirm($RESOURCE.delete_comment, {
				icon : "04",
				textOk :'删除',
				funcOk : function(){
					new Interface("http://photo.blog.sina.com.cn/services/ajax_comment_delete.php", "jsload").request({
						GET : {
							newsid : sNewsId,
							mid : nCommentId
						},
						onSuccess : function(res){
							$E("comment_" + sNewsId + "_" + nCommentId).style.display = "none";
							 winDialog.alert($RESOURCE.set_ok,{
								textOk :'确定',
								icon : '03',
								subText : $RESOURCE.set_delay
							 });
						},
						onError : function(res){
							winDialog.alert($SYSMSG[res.code], { icon : "03" });
						},
						onFail : function(res){
							winDialog.alert($SYSMSG.A00001, {});
						}
					});
				}
			}
		);
	}
};