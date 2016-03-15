/**
 * @desc	百合分享对话框
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopDefaultEvent.js");
$import("comps/oop.js");

$import("lib/dialogConfig.js");
$import("lib/checkAuthor.js");

$import("comps/baihe/_baihe.js");

$import("comps/baihe/dialog/Dialog.js");
$import("comps/baihe/shareTemplate.js");
$import("comps/baihe/luckyTimes.js");
$import("comps/baihe/login.js");
$import("comps/baihe/pageLogin.js");


Baihe.shareDialog = function(opt){
	// share2tblog;
	// share2blog;
	opt = opt || {};
	this.onSuccess = opt.onSuccess || function(){};
	this.onError = opt.onError || function(){};
	this.onFail = opt.onFail || function(){};
	this.tblogHref = opt.tblogHref;
	this.testTitle = opt.testTitle || "";
	this.testType = opt.testType || "";
	
	this.template = Baihe.shareTemplate;
	this.initDialogTemplate("baihe_share");
	this.initDialogEvents();
	
	this.happyTimesCtrl = Baihe.luckyTimes.init();
	
}.$extend(Baihe.Dialog).$defineProto({
	
	addLuckyTime:function(){
		var ht = $E("happyTimes");
		var spans = ht.getElementsByTagName("span");
		var luckyNum;
		if(spans.length){
			luckyNum = +spans[0].innerHTML;
		}else{
			luckyNum = +ht.innerHTML;
		}
		this.happyTimesCtrl.update(luckyNum + 2);
	},
	
	initDialogEvents:function(){
		this.$super.initDialogEvents();
		var __this = this;
		
		
		// 分享博客
		Core.Events.addEvent(this.nodes.share2blog, function(){
			__this.hide();
			if(Baihe.userChangeDetected()) return;				// 登录组件已引本类
			__this.sendFeed();
		}, "click");
		
		
		// 分享微博
		Core.Events.addEvent(this.nodes.share2tblog, function(){
			__this.hide();
			if(Baihe.userChangeDetected()){
				Core.Events.stopDefaultEvent();					// 不响应 href！
				return;											// 登录组件已引本类
			}
			new Interface("http://control.blog.sina.com.cn/baihe/interface.php?action=add_two_lot_num&data=tblog", "ijax").request({
				GET:{
					t: new Date().getTime()
				},
				onSuccess:function(){
					__this.addLuckyTime();
				},
				onError:function(){}
			});
		}, "click");
		
		
		// 分享微博链接
		this.nodes.share2tblog.href = "javascript:void((function(s,d,e,r,l,p,t,z,c){var%20f='http://v.t.sina.com.cn/share/share.php?appkey=dcwappkey',u=z||d.location,p=['&url=',e(u),'&title=',e(t||d.title),'&source=',e(r),'&sourceUrl=',e(l),'&content=',c||'gb2312','&pic=',e(p||'')].join('');function%20a(){if(!window.open([f,p].join(''),'mb',['toolbar=0,status=0,resizable=1,width=440,height=430,left=',(s.width-440)/2,',top=',(s.height-430)/2].join('')))u.href=[f,p].join('');};if(/Firefox/.test(navigator.userAgent))setTimeout(a,0);else%20a();})(screen,document,encodeURIComponent,'','','http://simg.sinajs.cn/blog7actstyle/images/baiheAward.jpg','我刚刚参加了“百合网-写日志赢大奖”活动，每天写日志并邀请好友都可以获得 5次 抽奖机会！大奖有 MacBook Air、Ipad、Itouch，还有很多其他的奖品，赶快来试试吧！','http://control.blog.sina.com.cn/baihe/index.php','utf-8'));";
		if(this.tblogHref)
		this.nodes.share2tblog.href = this.tblogHref || "#";
	},
	
	sendFeed:function(){
		var __this = this;
		Lib.checkAuthor();
		new Interface("http://control.blog.sina.com.cn/baihe/feed_baihe.php", "ijax").request({
			POST:{
				uid:		$UID,
				title:		__this.testTitle,
				result:		__this.testType
			},
			onSuccess:function(res){
				new Interface("http://control.blog.sina.com.cn/baihe/interface.php?action=add_two_lot_num&data=blog", "jsload").request({
					onSuccess:function(res){
						winDialog.alert("分享成功^_^<br/>恭喜你获得 +2 抽奖机会", {
							icon:"03"
						});
						__this.addLuckyTime();
					},
					onError:function(res){
						if(res.code == "A90005") winDialog.alert("今天你已经分享过了哦～");
						else winDialog.alert("系统错误");
					}
				});
			},
			onError:function(res){
				if(res.code == "A70005") winDialog.alert("今天你已经分享过了哦～");
				else winDialog.alert("系统错误");
			}
		});
		
		this.hide();
	}
});






