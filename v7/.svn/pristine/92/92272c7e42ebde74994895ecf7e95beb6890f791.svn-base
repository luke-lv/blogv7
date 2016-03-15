/**
 * @fileoverview
 *	FEED 中的评论功能，点击的评论(X)时候展开
 
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/core/dom/getStyle.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/encodeHTML.js");
$import("sina/core/string/trim.js");

$import("lib/app.js");
$import("lib/showError.js");

$import("lib/checkAuthor.js");
$import("lib/login/ui.js");
$import("lib/interface.js");
$import("product/center/insertSmile.js");
$import("product/center/textareaAutoHeight.js");
$import("msg/blogComment.js");
$import("product/center/comment2TSina.js");
$import("tempLib/insertSmiles/insertSmileFormInit.js");
$import("lib/sendLog.js");

App.CommentInFeed = Core.Class.create();

App.CommentInFeed.prototype = {
	"contentLength"	: 2000,
	"Interface"		: new Interface("http://control.blog.sina.com.cn/riaapi/profile/comment_new.php", "jsload"),
	"initialize" 	: function(sArticleID, sCount){
		
		/*判断登陆状态*/
		Lib.checkAuthor();
		if(!$isAdmin){
				new Lib.Login.Ui().login(function() {
						location.reload();
				});
				return;
		}
		
		this.aid = sArticleID;
		this.count = sCount * 1;

		// 如果浮层没被展开，就展开，否则控制显示隐藏
		var ctrl_area = $E("ctrl_" + this.aid);
		if($FF) {
			var cmsL = $E("cmscnt_" + sArticleID);
			if(cmsL) {
				if(cmsL.style.display == '') {
					cmsL.style.display == 'none';
					cmsL.parentNode.removeChild(cmsL);
				} else {
					cmsL.parentNode.removeChild(cmsL);
					this.getLastComment();
				}
			} else {
				this.getLastComment();
			}
			return;
		}
		trace("FF是看不见的");
		if(ctrl_area.getAttribute("cmsOpen") == null){
			ctrl_area.setAttribute("cmsOpen", true);
			this.getLastComment();
		}else{
			var cms_cnt = $E("cmscnt_" + this.aid);
			if(cms_cnt && cms_cnt.style.display != "none"){
				cms_cnt.style.display = "none";
				this.resetForm();
			}else if(cms_cnt){
				cms_cnt.style.display = "";
				this.getLastComment();
			}else{
				this.getLastComment();
			}
		}
	},
	// 取最后一条评论
	"getLastComment"	: function (callback){
		var __this = this;
		this.Interface.request({
			GET : {	cms_id : this.aid },
			onSuccess : function (oData) {
				if($E("cmslist_" + __this.aid) == null){
					__this.initDom(oData);
				}else{
					if(oData.length > 0 && $E("cmslist_" + __this.aid)){
						var _item = oData[0];
						$E("cmslist_" + __this.aid).innerHTML = ['<div class="cmt_cell"><a href="http://blog.sina.com.cn/u/'
							 , _item.uid + '" onclick="v7sendLog(\'94_01_04_'+scope.$uid+'\',\'profile_index\',\'\');" target="_blank">' + _item.uname + '</a>：' + _item.cms_body
								, '<span class="cmt_txta">(' + _item.cms_pubdate +')</span>'
							, '</div>'].join("");
					}
				}
			},
			onError : function (oData) {
				showError(oData.code);
			},
			onFail	: function () {}
		});
	},
	// 初始化 DOM 节点
	"initDom"		: function(oData){
		var msg = "";
		var lastComment = ""; // 最后一条评论
		if(oData.length == 0){
			this.count = 0;
			msg = "还没有评论，快抢沙发吧！";
		}else{
			msg = ['共<span id="cmscount_' + this.aid + '">' + this.count + '</span>条评论，'
						, '<a href="http://blog.sina.com.cn/s/blog_' + this.aid + '.html#comment" onclick="v7sendLog(\'94_01_02_'+scope.$uid+'\',\'profile_index\',\'\');" target="_blank">'
							, '点击查看&gt;&gt;</a>'].join("");
			if(this.count > 1){ msg += '<br/>……'; }
			var _item = oData[0];
			
			lastComment = ['<div class="cmt_cell">',
					(_item.uid == 0) ? _item.uname :
						 '<a href="http://blog.sina.com.cn/u/' + _item.uid + '" onclick="v7sendLog(\'94_01_04_'+scope.$uid+'\',\'profile_index\',\'\');" target="_blank">' + _item.uname + '</a>'
					, '：' + _item.cms_body
					, '<span class="cmt_txta">(' + _item.cms_pubdate +')</span>'
				, '</div>'].join("");
		}
		
		var cnt = [
			'<div id="cmscnt_#{aid}" class="center_cmt">'
				, '<div class="arrow"></div>'
				, '<div class="top"></div>'
				, '<div class="mid">'
					, '<a id="cmsclose_#{aid}" href="#" onclick="return false;" class="cmt_close" title="关闭"></a>'
					, '<div id="cms_detail_#{aid}" class="cmt_top cmt_txta">'
						, '<span class="cmt_top_l">' + msg + '</span>'
					, '</div>'
					, '<div id="cmslist_#{aid}" class="cmt_list">' + lastComment + '</div>'
					, '<div id="cms_input_#{aid}" class="cmt_write">'
						, '<span class="cmt_top_r"><a href="#" onclick="return false;"><img id="cms_smile_#{aid}" class="SG_icon SG_icon45" '
							, 'src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" '
							, 'title="插入表情" align="absmiddle" /></a>'
						, '</span>'
						, '<textarea style="display:none;" id="cms_content_#{aid}" fakeClass="fake_textarea"></textarea>'
						, '<iframe id="cms_frame_#{aid}" frameBorder="0" style="height: 60px; background-color: #FFFFFF; border: 1px solid #C7C7C7; width:560px;*width:562px;" src="http://blog.sina.com.cn/main_v5/ria/blank.html" id="replayIframe"></iframe>'
						, '<div class="cmt_write_btm">'
							, '<div class="cmt_write_btm_l">分享<a href="#" onclick="return false;">'
								, '<img id="cms_share_#{aid}" height="15" align="absmiddle" width="15" title="点击将取消评论分享至微博" '
								, 'alt="点击将取消评论分享至微博" class="SG_icon SG_icon51" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif"></a>'
								, '<input type="hidden" id="bb_share_#{aid}" value="1" />'
							, '</div>'
							, '<div class="cmt_write_btm_r">'
								, '<span class="cmt_writel">验证码：<input id="cms_check_#{aid}" type="text" size="5" /></span>'
								, '<span class="cmt_writer"><a id="cms_pub_#{aid}" href="#" onclick="return false;" class="post_btn">发评论</a></span>'
							, '</div>'
							, '<div class="clearit"></div>'
						, '</div>'
					, '</div>'
				, '</div>'
				, '<div class="bot"></div>'
			, '</div>'
		].join("").replace(/#\{aid\}/gi, this.aid);
		Core.Dom.insertHTML($E("ctrl_" + this.aid), cnt, "AfterEnd");
		this.initUserEvent();
	},
	"initUserEvent" : function (){
		var __this = this;
		//$E("cms_content_" + this.aid).focus();
		// 插入验证码图片
		Core.Dom.insertHTML($E("cms_check_" + this.aid), '&nbsp;<img id="cms_checkimg_' + this.aid 
				+ '" src="http://interface.blog.sina.com.cn/riaapi/checkwd_image.php?' + Math.random()
				+ '" align="absmiddle" />', "AfterEnd");
		
		// 关闭浮层
		Core.Events.addEvent($E("cmsclose_" + this.aid), function (){
			__this.hidden();
			v7sendLog('94_01_05_'+scope.$uid,scope.$pageid,'');
		});

		// 分享到微博按钮
		// 初始化按钮状态
		var bb_share = $E("bb_share_"+this.aid),
			cms_share = $E("cms_share_"+this.aid);;
		if( Utils.Cookie.getCookie("acp_bb") == "1" ){
			bb_share.value = 0;
			cms_share.className= "SG_icon SG_icon86";
			cms_share.title = "点击将评论分享至微博";
		}
		//else{
		//	bb_share.value = 1;
		//	cms_share.className = "SG_icon SG_icon51";
		//	cms_share.title = "点击将取消评论分享至微博";
		//}
		Core.Events.addEvent($E("cms_share_" + this.aid), function (){
			Core.Events.stopEvent();
			if( bb_share.value=="1" ){
				bb_share.value = 0;
				cms_share.className= "SG_icon SG_icon86";
				cms_share.title = "点击将评论分享至微博";
			}else{
				bb_share.value =1;
				cms_share.className= "SG_icon SG_icon51";
				cms_share.title = "点击将取消评论分享至微博";
			}
		});
		
		//$E("cms_share_"+this.aid).parentNode.className= Utils.Cookie.getCookie("acp_bb") == "1" ? "cur" : "";

		// 发评论按钮
		Core.Events.addEvent($E("cms_pub_" + this.aid), function (){
			__this.postComment();
			v7sendLog('94_01_03_'+scope.$uid,scope.$pageid,'');
		});
		// Textarea 自动适应高度		
		//App.textareaAutoHeight("cms_content_" + this.aid, "fake_textarea");
		
		// 验证码输入框获得焦点刷新验证码图片
		Core.Events.addEvent("cms_check_" + this.aid, function () {
			Core.Events.stopEvent();
			__this.refreshCheck();
		}, "focus");

		// 验证码输入框回车提交评论
		Core.Events.addEvent("cms_check_" + this.aid, function () {
			var evt = Core.Events.getEvent();
			var key = evt.which || evt.keyCode;
			if(key == 13){
				__this.postComment();
			}
		}, "keyup");

		// 点击验证码图片刷新
		Core.Events.addEvent("cms_checkimg_" + this.aid, function () {
			Core.Events.stopEvent();
			__this.refreshCheck();
		});
		
		// 插入表情按钮
		if(scope.smile == null){
			scope.smile = new App.insertSmile("cms_content_" + this.aid, "cms_smile_" + this.aid, function(){});
		}
		var me = this;
		var events = {
						'interval' : {
							'after' : function(frameId, area) {
								scope.commEditor.handleChange(frameId);
								var doc = $E(frameId).contentWindow.document;
								if (doc.body.scrollHeight > doc.body.offsetHeight) {
									if(doc.body.scrollHeight > 410) {
										return;
									}
									$E(frameId).style.height = doc.body.scrollHeight+'px';
								}
							}
						}
						,'cssStr' : 'padding:0px;overflow-y:auto;font-size: 12px;'
					}
		if(!scope.commEditor) {
			scope.commEditor = new commEditor();
		}
		scope.commEditor.append("cms_frame_"+me.aid,"cms_content_" + me.aid,events);
		Core.Events.addEvent("cms_smile_" + this.aid, function () {
			Core.Events.stopEvent();
			//$E("cms_content_" + __this.aid).focus();
			//scope.smile.set("cms_content_" + __this.aid, "cms_smile_" + __this.aid);
			var arrPix = [-325, 14 + ($IE ? -2 : 0)];
			App.insertSmilesDialog3("cms_content_" + me.aid, null, null, null, "cms_smile_" + me.aid, arrPix,"cms_frame_"+me.aid,events);
		});
	},
	// 检查用户输入
	"refreshCheck"	: function(){
		$E("cms_checkimg_" + this.aid).src = "http://interface.blog.sina.com.cn/riaapi/checkwd_image.php?" + Math.random();
	},
	// 发表评论
	"postComment"	: function(){
		Core.Events.stopEvent();
		var __this = this;
		var _cms_content = Core.String.trim($E("cms_content_" + __this.aid).value);
		if(_cms_content == ""){
			showError($SYSMSG.B36105);return;
		}
		var post = new Interface("http://control.blog.sina.com.cn/admin/comment/comment_post.php?version=7", "ijax");
		var data = {
			"article_id"	: this.aid,
			"comment"		: _cms_content,
			"uid"			: scope.$uid,
			"check"			: $E("cms_check_" + this.aid).value,
			"login_name"	: $nick,
			"is_photo"		: "0",
			"t"				: 1,
			"is_t": 0,
			"fromicp"		: 1
		};

		if($E("bb_share_"+this.aid)){
			if( $E("bb_share_"+this.aid).value=="1" ){
				data.is_t = 1; //分享到微博
				
				//为减少cookie大小，不分享到微博时不记录cookie，因为读不到cookie时则不选中选框
				if( Utils.Cookie.getCookie("acp_bb") == "1" ){
					Utils.Cookie.setCookie("acp_bb","",-1,"/",".blog.sina.com.cn");
				}
			}
			else {
				if( Utils.Cookie.getCookie("acp_bb") != "1" ){
					Utils.Cookie.setCookie("acp_bb","1",2400,"/",".blog.sina.com.cn");
				}
			}
		}
		//参数好多啊。
		if($E(this.aid+"_v2")){ data.v2 = $E(this.aid+"_v2").value; }
		if($E(this.aid+"_v1")){ data.v1 = $E(this.aid+"_v1").value; }
		data.v3 = 2;
		
		post.request({
			POST : data,
			onSuccess : function (result) {
				__this.refreshCheck();
				__this.fakeRender($E("cms_content_" + __this.aid).value);
				//$E("cms_content_" + __this.aid).value = "";
				//$E("cms_content_" + __this.aid).focus();
				$E("cms_check_" + __this.aid).value = "";
				scope.commEditor.clearHTML('cms_frame_' + __this.aid);
				$E("cms_content_" + __this.aid).value = "";
				$E('cms_frame_' + __this.aid).style.height = '60px';
				if($E("cmscount_" + __this.aid) != null){
					var newcount = $E("cmscount_" + __this.aid).innerHTML * 1 + 1;
					$E("cmscount_" + __this.aid).innerHTML = newcount;
					$E("cms_" + __this.aid).innerHTML = "评论(" + newcount + ")";
					if(newcount <= 1){
						$E("cms_detail_" + __this.aid).innerHTML += '<br />……';
					}
					
				}else{
					$E("cms_detail_" + __this.aid).innerHTML = ['共<span id="cmscount_' + __this.aid + '">1</span>条评论，'
						, '<a href="http://blog.sina.com.cn/s/blog_' + __this.aid + '.html#comment" onclick="v7sendLog(\'94_01_02_'+scope.$uid+'\',\'profile_index\',\'\');" target="_blank">'
						, '点击查看&gt;&gt;</a>'].join("");
					$E("cms_" + __this.aid).innerHTML = "评论(1)";
				}

				//评论同步到微博
				var c2s = new Comment2TSina(__this.aid, result);
				c2s.writeCommTips();
			},
			onError		: function (oData){
				__this.refreshCheck();
				$E("cms_check_" + __this.aid).value = "";
				showError($SYSMSG[oData.code]);
			},
			onFail		: function () {
				showError($SYSMSG.A00001);
			}
		});
	},
	// 渲染假数据
	"fakeRender"	: function (sData) {
		if(sData == null || sData == ""){return;}
		// UBB 2 smiles		
		var re = /\[emoticons=(E___\w*)\]([^\[]*)\[\/emoticons\]/gi;
		sData = Core.String.encodeHTML(sData);
		sData = sData.replace(re, function(a, b, c){
			return '<img src="http://www.sinaimg.cn/uc/myshow/blog/misc/gif/' + b + 'T.gif" style="margin:1px;cursor:pointer;"'
				+ ' onclick="window.open(\'http://control.blog.sina.com.cn/admin/myshow/myshow.php?code=' + b +'\')" '
					+ 'border="0" title="' + c +'" />';
		});
		//处理魔法表情		
		var _magicReg=/\[magicemoticons=([E|W]___\w*)\&nbsp\;swfname=(\w+\.swf)\]([^[]*)\[\/magicemoticons\]/gi;
		//var _magicReg=/\[magicemoticons=(E___\w*)\&nbsp;swfname=(\w*)\]([^[]*)\[\/magicemoticons\]/gi;
		var _magichtml =['<img src="http://www.sinaimg.cn/uc/myshow/blog/misc/gif/$1T.gif" style="margin:1px;',
				'cursor:pointer;" onclick="window.$magicFacePlay(\'$2\');return false;"',
				' border="0" title="$3" width="50" height="50"/>'].join("");
		sData = sData.replace(_magicReg, _magichtml);
		
		
		if(sData.length > 0){
			$E("cmslist_" + this.aid).innerHTML += ['<div class="cmt_cell">'
				 , '<a href="http://blog.sina.com.cn/u/' + scope.$uid + '" onclick="v7sendLog(\'94_01_04_'+scope.$uid+'\',\'profile_index\',\'\');" target="_blank">' + $nick + '</a>：' + sData
					, '<span class="cmt_txta">(1分钟前)</span>'
				, '</div>'].join("");
		}		
	},
	// 隐藏评论层
	"hidden"	: function (){
		$E("cmscnt_" + this.aid).style.display = "none";
		$E("cmslist_" + this.aid).innerHTML = "";
		this.resetForm();
		if($FF) {
			var cnt = $E("cmscnt_" + this.aid);
			cnt.parentNode.removeChild(cnt);
		}
	},
	"resetForm"	: function () {
		$E("cms_content_" + this.aid).value = "";
		scope.commEditor.clearHTML('cms_frame_' + this.aid);
		$E('cms_frame_' + this.aid).style.height = '60px';
		//$E("cms_content_" + this.aid).style.height = "39px";
		$E("cms_check_" + this.aid).value = "";
	}
};
