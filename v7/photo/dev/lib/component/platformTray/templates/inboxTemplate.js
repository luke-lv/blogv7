/**
 * @fileoverview 收件箱面板的模板HTML
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-05
 */
var st=[
	'<div style="z-index:512;" class="tb_layer_Y tb_layer_w3" id="#{panel}">',
		'<div class="tb_layer_arrow"></div>',
		'<div class="tb_layer_Y_main">',
			'<div class="tb_msg">',
			
				'<div id="#{inboxLoding}" class="tb_loading">',
					'<img src="http://simg.sinajs.cn/blog7style/images/common/loading.gif"/>',
					'<p>加载中…</p>',
				'</div>',
				
				'<div id="#{inboxList}" style="display:none;" class="tb_msg_list">',
					'<ul>',
						'<li><a id="#{notice}" target="_blank" href="http://control.blog.sina.com.cn/blogprofile/profilenoticelist.php">通知</a><em id="#{noticeCount}"></em></li>',
						'<li><a id="#{message}" target="_blank" href="http://control.blog.sina.com.cn/blogprofile/profilepaperlist.php?type=1">纸条</a><em id="#{messageCount}"></em></li>',
						'<li><a id="#{invite}" target="_blank" href="http://control.blog.sina.com.cn/blogprofile/profileinvitelist.php">好友邀请</a><em id="#{inviteCount}"></em></li>',
						'<li id="#{liBlogComment}"><a target="_blank" id="#{blogComment}" href="http://i.blog.sina.com.cn/blogprofile/profilecommlist.php?type=1">博客评论</a><em id="#{blogCommentCount}"></em></li>',
						'<li id="#{liPhotoComment}"><a target="_blank" id="#{photoComment}" href="http://i.blog.sina.com.cn/blogprofile/profilecommlist.php?type=2">图片评论</a><em id="#{photoCommentCount}"></em></li>',
						'<li id="#{liVblogComment}"><a target="_blank" id="#{vblogComment}" href="http://icp.api.sina.com.cn/pubcontrol/index.php?ptype=10">播客评论</a><em id="#{vblogCommentCount}"></em></li>',
						'<li id="#{liCommentRelapse}"><a target="_blank" id="#{commentRelapse}" href="http://i.blog.sina.com.cn/blogprofile/profilereplylist.php">评论回复</a><em id="#{commentRelapseCount}"></em></li>',
						'<li><a id="#{guestBook}" target="_blank" href="http://i.blog.sina.com.cn/blogprofile/wall.php">留言</a><em id="#{guestBookCount}"></em></li>',
						'<li id="#{liGarbageBox}"><a target="_blank" href="http://control.blog.sina.com.cn/blogprofile/profilecommtrash.php" id="#{garbageBox}" href="javascript:;">垃圾箱</a><em id="#{garbageBoxCount}"></em></li>',
						'<li><a target="_blank" href="http://mail.sina.com.cn/">邮箱</a></li>',
						// '<li style="display:none;" id="#{liInviteUpgrade}"><a target="_blank"  href="http://control.blog.sina.com.cn/upgrade/upgrade_invite.php?version=7">邀请升级</a></li>',
					'</ul>',
					'<div class="clearit"></div>',
				'</div>',
			'</div>',
		'</div>',
	'</div>'
];

scope.inboxPanelTemplate=st.join("");