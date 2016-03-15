/** 
 * @fileoverview 评论及回复的分享
 * @author gaolei | gaolei2@staff.sina.com.cn
 */
$import("sina/core/class/oop.js");
$import("sina/core/string/shorten.js");
// $import("sina/core/string/decodeHTML.js");
$import("lib/interface.js");
$import("lib/commentv2/_comment.js");

CommentV2.Share = function(){
	trace("CommentV2.Share");
	this.shorten = Core.String.shorten;
	// this.decode = Core.String.decodeHTML;
	this.getInterface = new Interface("http://control.blog.sina.com.cn/blog_rebuild/riaapi/profile/note/getCms.php", "jsload");
	this.getWeiboNameInterface = new Interface("http://i2.api.weibo.com/2/users/show.json", "jsload");
}.$define({

	commentShare: function(data){
		var __this = this;
		this.data = data || {};
		// this.type = "comment";
		// var cms_id = this.data.commentid;
		// var uid = this.data.src_uid;
		// this.__getCmsBody(cms_id, uid);
		this.__commentShare();
	},
	
	replyShare: function(data){
		var __this = this;
		this.data = data || {};
		this.type = "reply";
		var cms_id = this.data.replyid;
		var uid = this.data.src_uid;
		this.__getCmsBody(cms_id, uid);
	},
	
	__getCmsBody: function(cms_id, uid){
		var __this = this;
		var param = {
			cms_id:cms_id,
			uid:uid,
			origin:1
		};
		
		this.getInterface.request({
			GET: param,
			onSuccess: __this.__getWeiboName.bind2(__this),
			onError: function(_data){
				
			},
			onFail: function(){
			}
		});
	},

	__getWeiboName: function(result){
		var __this = this;
		
		this.body = result.cms_body;
		this.uid = result.uid;
		this.src_title = result.src_title;
		
		window.jsonpweiboname = function(res){
			if (res.code == 1 && res.data){
				__this.name = encodeURIComponent("@"+res.data.name);
			}else{
				__this.name = encodeURIComponent(" "+__this.data.uname) || "";
			}
			__this.__share();
		};
		
		var param = {
			uid: this.uid,
			source: "1617465124",
			callback: "jsonpweiboname"
		};
		this.getWeiboNameInterface.request({
			GET: param,
			onSuccess: function(){},
			onError: function(){},
			onFail:	 function(){}
		})
	},

	__share: function(){
		var body = this.body;
		
		if (this.type === "comment"){
			// [emoticons=E___0317EN00SIG]裁员[/emoticons]
			// <img src=\"http:\/\/img.t.sinajs.cn\/t4\/appstyle\/expression\/ext\/normal\/f4\/xklzhuanquan_org.gif\" alt=\"-xkl\u05ea\u0226\" \/>"
			// trace(body);
			if (this.data.fromProduct === "blog"){
				var _re = /\[emoticons=(E___\w*)\]([^[]*)\[\/emoticons\]/gi;
				var _magicReg=/\[magicemoticons=([E|W]___\w*)\&nbsp\;swfname=(\w+\.swf)\]([^[]*)\[\/magicemoticons\]/gi;
				body = body.replace(_re, "[$2]");
				body = body.replace(_magicReg, "[$3]");
			}else{
				var _weiboReg =  /<img\s[\S]*\salt=[\]["][^-]*[-]?([\S]*)[\]["]\s?[\][/]>/ig;
				body = body.replace(_weiboReg, "[$1]");
			}
		}
		
		body = encodeURIComponent(this.shorten(body, 100));

		var url = encodeURIComponent(location.href);
		var blogTitle = encodeURIComponent(this.src_title) || encodeURIComponent($E("t_"+scope.$articleid).innerHTML);
		// “$评论正文”  -@$原评论作者昵称 阅读博文 $短链 有感而发
		// 分享@$评论作者昵称 对博文【$博文标题】的评论：” $评论内容正文100字超长打3个点…“ 查看原文：
		var content = '分享' + this.name + ' 对博文【' + blogTitle + '】的评论：' + body +' 查看原文：';
		var title = encodeURIComponent(content);
		var f = 'http://v.t.sina.com.cn/share/share.php?',
			r = "新浪-博客",
			l = 'http://blog.sina.com.cn',
			u = 'http://v.t.sina.com.cn/share/share.php?searchPic=false&title=' + title 
				+ "&url=" + encodeURIComponent(document.location)
				+ '&source=' + r 
				+ '&sourceUrl=' + encodeURIComponent(l)
				+ '&content=utf-8&appkey=1617465124';
		window.open(u, 'selectionshare', 'toolbar=0,status=0,resizable=1,width=440,height=430,left=' + (screen.width - 440) / 2 + ',top=' + (screen.height - 430) / 2);
	},

	__commentShare : function(){
		var title = $E("t_" + scope.$articleid).innerHTML;
		title = title.replace(/\&nbsp\;/g,' ');
		var cms_id = this.data.commentid;
		var bodyNode = $E('body_cmt_'+cms_id);
		var body, name;
		if(typeof bodyNode.innerText === 'string'){
			body = bodyNode.innerText
		}else{
			body = bodyNode.textContent
		}
		if (this.data.fromProduct === "blog"){
			var _re = /\[emoticons=(E___\w*)\]([^[]*)\[\/emoticons\]/gi;
			var _magicReg=/\[magicemoticons=([E|W]___\w*)\&nbsp\;swfname=(\w+\.swf)\]([^[]*)\[\/magicemoticons\]/gi;
			body = body.replace(_re, "[$2]");
			body = body.replace(_magicReg, "[$3]");
			name = ' '+this.data.uname;
		}else{
			var _weiboReg =  /<img\s[\S]*\salt=[\]["][^-]*[-]?([\S]*)[\]["]\s?[\][/]>/ig;
			body = body.replace(_weiboReg, "[$1]");
			name = '@'+this.data.uname;
		}
		body = this.shorten(body, 100);
		title = this.shorten(title,60);
		var content = '分享' + name + ' 对博文【' + title + '】的评论：' + body +' 查看原文：';
		var t = encodeURIComponent(content),
			r = "新浪-博客",
			l = 'http://blog.sina.com.cn',
			u = 'http://v.t.sina.com.cn/share/share.php?searchPic=false&title=' + t
				+ "&url=" + encodeURIComponent(document.location)
				+ '&source=' + r 
				+ '&sourceUrl=' + encodeURIComponent(l)
				+ '&content=utf-8&appkey=1617465124';
		window.open(u, 'selectionshare', 'toolbar=0,status=0,resizable=1,width=440,height=430,left=' + (screen.width - 440) / 2 + ',top=' + (screen.height - 430) / 2);
	}
});