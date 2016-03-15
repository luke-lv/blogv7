/**
 * @fileoverview 博客微博评论互通
 * @author Book | liming9@staff.sina.com.cn
 * @create 2011-03-03
 */
$import("sina/core/class/create.js");
$import("sina/core/events/getEventTarget.js");
$import("sina/core/events/addEvent.js");
//$import("sina/core/dom/getElementsByClass.js");
//$import("sina/core/dom/getXY.js");
$import("sina/core/dom/getStyle.js");
$import("sina/utils/io/ijax.js");

$import("lib/dialogConfig.js");
//$import("lib/uic.js");

Comment2TSina = Core.Class.create();

Comment2TSina.prototype = {
	//article_id
	aid: 0,
	//评论id
	data: null,
	initialize: function(aid, data){
		this.aid = aid || 0;
		this.data=data||{};
		scope.$temp_commCtt = this.data.weibo_content;
		scope.$temp_commId = this.data.blog_id;
		//trace(data);
	},
	/**
	 * 输出分享结果提示
	 */
	writeCommTips: function(){
		if( !$E("bb_share_"+this.aid ) ){ return; } //没有这个说明PHP还没有上线，上线后去掉本行代码即可

		var html='';
		var tips=$E("writeComm_tips_"+this.aid);
		
		if( !tips ){
			var tips_box = $C("div");
			tips_box.className = "writeComm_tips_box";
			tips_box.style.display = "none";
			tips_box.innerHTML='<span class="writeComm_tips" id="writeComm_tips_'+this.aid+'"><strong></strong><cite><a href="javascript:;">关闭</a></cite></span>';
			//var writeComm=Core.Dom.byClz(document, "div", "writeComm");
			var cmt_write=$E("cms_input_"+this.aid);
			if( cmt_write ){
				cmt_write.parentNode.insertBefore(tips_box, cmt_write);
			}else{
				return; //如果writeComm不存在
			}
			tips = tips_box.firstChild;
			Core.Events.addEvent(tips.lastChild, function(){ //关闭按钮事件
				tips_box.style.display="none";
			}, "click");
			this.bindTipsEvents(tips);
		}
		var tbox=tips.parentNode,
			content=tips.firstChild;
		tbox.style.display = "none";
		
		if(this.data.re_weibo==="success"){ //tip1
			content.innerHTML = '评论成功同步到微博，<a href="http://weibo.com/'+ this.data.t_sina +'/profile" target="_blank">点此查看</a>';
			tbox.style.display="block";
		}else if(this.data.re_weibo==="no_bind"){ //tip3
			content.innerHTML = '评论分享失败，您需要先<a href="javascript:void(0);">绑定微博</a>';
			tbox.style.display="block";
		}
		
	},
	//事件绑定到writeComm_tips上，这样反复替换内部的innerHTML，不用删除事件，不会造成内存泄露
	bindTipsEvents: function(tips){
		//trace(tips.firstChild.tagName);
		Core.Events.addEvent(tips.firstChild, function(event){
			Core.Events.stopBubble(event);
			if( Core.Events.getEventTarget(event).tagName.toLowerCase() !="a" ){ //点击分享链接
				return;
			}
			var txt=tips.firstChild.lastChild.innerHTML;
			if( txt==="点此查看"){
				tips.parentNode.style.display="none";
				//return false;
			}else if( txt==="绑定微博" ){
				tips.parentNode.style.display="none";
				this.bindToTSina();
			}
		}.bind2(this), "click");
	},
	
	//已登录或刚绑定完，不是的不是的
	//是点击分享都交给这里处理
	openStep: function(){
		var me = this;
		//trace("me.data=");
		//trace(me.data);
		Utils.Io.Ijax.request("http://control.blog.sina.com.cn/riaapi/tshow/send_cms_weibo.php", {
			POST: {
				uid: $UID,
				blog_id: scope.$temp_commId,
				content: scope.$temp_commCtt,
				isphoto: 0 //是否为相册图片的内容 默认为 0
			},
			//returnType: "json",
			onComplete: function(data){
				//trace(data); //妈的，这个data是字符串。。。
				data = eval("(" + data + ")") || {};
				//trace("dc="+data["code"]);
				if (data.code === "A00006") { //成功
					var tips=$E("writeComm_tips_"+me.aid);
					tips.parentNode.style.display="block";
					tips.firstChild.innerHTML='评论成功同步到微博，<a href="http://weibo.com/'+ data.data +'/profile" target="_blank">点此查看</a>';
				}else if( data.code==="B00001" ){ //未绑定
					winDialog.alert('您的博客还未绑定新浪微博，现在绑定？', {
						icon: "04",
						funcOk: function(){
							me.bindToTSina();
						}
					});
				}else if( data.code==="A00004" || data.code==="A11007" ){ //未登录即匿名，未开通
					me.shareToT();
				}else{
					trace("data.code="+data.code);
					winDialog.alert('网络繁忙，请稍后再试。', {icon: "01"});
				}
			},
			onException: function(msg, url){
				trace("msg="+msg+", url="+url);
				winDialog.alert('网络繁忙，请稍后再试。', {icon: "01"});
			}
		});
	},
	/**
	 * 绑定新浪微博
	 * 绑定接口：
http://api.t.sina.com.cn/oauth/authorize?display=popup&from=blog&oauth_token=1e39d3c6fd8fcacf59f395b58790e1db
&oauth_callback=http%3A%2F%2Fcontrol.blog.sina.com.cn%2Ft_sina_blog%2Fcallback.php
	 */
	bindToTSina: function(){
		var me=this;
		
		//从php的页面 中转到微博 然后 php 最后 回调js 
		var url='http://control.blog.sina.com.cn/t_sina_blog/bind_weibo_form.php?from=js&domain='+document.domain;
		//console.log("url="+url);
		window.open(url,'mb', 'toolbar=0,status=0,resizable=1,width=440,height=430,left=' + (screen.width - 440) / 2 + ',top=' + (screen.height - 430) / 2);
		
		//回调 ok
		window.tOkBack=function(){
			trace("微博绑定回调ok函数！");
			//绑定完了将评论分享到微博
			winDialog.alert('绑定微博成功', {
				icon: "03",
				funcOk: function(){
					me.openStep();
				},
				funcClose: function(){
					me.openStep();
				}
			});
		};
		
		//回调 fail
		window.tFailBack=function(){
			trace("微博绑定 fail");
			winDialog.alert('网络繁忙，请稍后再试。', {icon: "01"});
		};
	},
	//分享到微博，参照jobs/selectionShare.js
	shareToT: function(){
		var shareWord=scope.$temp_commCtt;
		if(shareWord){
			var title = encodeURIComponent(shareWord);
			var f = 'http://v.t.sina.com.cn/share/share.php?',
				r = "新浪-博客",
				l = 'http://blog.sina.com.cn',
				u = 'http://v.t.sina.com.cn/share/share.php?searchPic=false&title=' + title 
					+ "&url=" + encodeURIComponent(document.location)
					+ '&source=' + r 
					+ '&sourceUrl=' + encodeURIComponent(l) 
					+ '&content=utf-8&appkey=1617465124';
			window.open(u, 'selectionshare', 'toolbar=0,status=0,resizable=1,width=440,height=430,left=' + (screen.width - 440) / 2 + ',top=' + (screen.height - 430) / 2);
		}else{
			winDialog.alert('分享的内容不能为空', {icon: "01"});
		}

		$E("writeComm_tips_"+this.aid).parentNode.style.display="none";
	}
};
