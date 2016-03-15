

$import("sina/core/events/addEvent.js");
$import("comps/tips.js");

(function(){
	
	var _helpBtn = $E("helpBtn");
	var _TPL;
	if(!_helpBtn) return;
	
	function init(){
		// tips 初始化
		var tips = new Comps.TipsSimp({
			template: _TPL
		});
		tips.setToNode({
			node:	_helpBtn,
			direct:	3,
			offset: {
				x: -100
			}
		});
		
		// 点击关闭
		Core.Events.addEvent(tips.nodes.btnCls, function(){
			tips.disappear();
		});
		
		// 
		Core.Events.addEvent(_helpBtn, function(){
			if(tips.stat){
				tips.disappear();
			}else{
				tips.appear();
			}
		}, "click");
	}
	
	
	
	
	// 模板
	_TPL = [
	'<div style="position:absolute; width:299px; padding-top:7px; font-size:12px;" id="#{entity}">',
		'<div style="top:0; left:240px; position:absolute; width:16px; height:8px; background:url(http://simg.sinajs.cn/blog7actstyle/images/bg_boxtop.png) no-repeat 0 0; z-index:100"></div>',
		'<div style="padding:5px 6px 9px 14px; border:1px solid #c57f10 ;background:#fffce7 url(http://simg.sinajs.cn/blog7actstyle/images/bg_5years.gif) no-repeat left bottom; z-index:1">',
			'<p id="#{btnCls}" style="float:right; margin:0; cursor:pointer; width:8px; height:8px; font-size:0; background:url(http://simg.sinajs.cn/blog7actstyle/images/btn_close.gif) no-repeat 0 0;" class="close"></p>',
			'<ul style="width:280px; margin:10px 0 0 0; padding:0; list-style:none;">',
				'<li style="padding-left:15px; background:url(http://simg.sinajs.cn/blog7actstyle/images/bg_dot_gary.gif) no-repeat 8px 10px; line-height:20px;">',
					'关注博客5周年活动，可以获得一颗种子！',
				'</li>',
				'<li style="padding-left:15px; background:url(http://simg.sinajs.cn/blog7actstyle/images/bg_dot_gary.gif) no-repeat 8px 10px; line-height:20px;">',
					'在活动里<a href="http://joy.blog.sina.com.cn/blog_5years/invite_friend.php">邀请好友</a>或被邀请，均可获得一颗种子',
				'</li>',
				'<li style="padding-left:15px; background:url(http://simg.sinajs.cn/blog7actstyle/images/bg_dot_gary.gif) no-repeat 8px 10px; line-height:20px;">',
					'记录博客历程，可以获得一颗种子！',
				'</li>',
			'</ul>',
			'<p style="width:200px; height:36px; padding:14px 0 0 68px; *padding:18px 0 0 68px; border-top:1px solid #f1dab6; color:#ff1200;">集齐5颗种子即可点亮纪念勋章！</p>',
		'</div>',
	'</div>',].join("");
	
	
	// 执行
	init();
	
	
	
})();