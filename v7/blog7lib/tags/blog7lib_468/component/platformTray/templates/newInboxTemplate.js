/**
 * @fileoverview 消息模板HTML
 * @author 常川 | changchuan@staff.sina.com.cn
 * @created 2010-09-27
 */


var st=[
'<div id="#{panel}" style="z-index:512;" class="tb_layer_Y tb_layer_w6" style="left:400px; top:700px;">',
	'<div class="tb_layer_arrow"></div>',
    '<div class="tb_layer_Y_main">',
		/**'<div id="#{newInboxLoding}" class="tb_loading" >',
					'<img src="http://simg.sinajs.cn/blog7style/images/common/loading.gif"/>',
					'<p>加载中…</p>',
		'</div>',**/
		'<div class="tb_mas" id="#{newInboxList}" style="">',
        	'<div class="tb_mas_list">',
            	'<ul id="#{changebgli1}"  style="display:none" >',
                    '<li  style="display:none" >',
                        '<span id="#{ccsysgonggao}" class="tb_friend_nm">[<strong>公告</strong>] <a href="http://control.blog.sina.com.cn/blog_rebuild/profile/controllers/notelist.php?action=profilesysnote">新浪邀你一起共度中秋活动</a></span>',
                        '<span class="tb_friend_set"><a href="http://control.blog.sina.com.cn/blog_rebuild/profile/controllers/notelist.php?action=profilesysnote">&gt;&gt;</a></span>',
                    '</li>',
                    '<li style="display:none">',
                        '<span id="#{ccsystongzhi}" class="tb_friend_nm">[<strong>通知</strong>] <a href="http://control.blog.sina.com.cn/blog_rebuild/profile/controllers/notelist.php?action=profilesysnote">新浪2010邀你一起共度中秋活动...</a></span>',
                        '<span class="tb_friend_set"><a href="http://control.blog.sina.com.cn/blog_rebuild/profile/controllers/notelist.php?action=profilesysnote">&gt;&gt;</a></span>',
                    '</li>',
                '</ul>',
            	'<ul class="bd" id="#{changebgli2}">',  
					'<li  id="#{newInboxLoding}" style="cursor:default" ><div style="margin: 0pt; padding: 10px;text-align:center;"><img src="http://simg.sinajs.cn/blog7style/images/common/loading.gif"><div></li>',                 
					'<li  id="#{nomsgli}" style="cursor:default;" >还没有消息</li>',
                    '<li style="float:none;"><span class="mas_more"><a id="#{mas_moremsg}" href="http://i.blog.sina.com.cn/blogprofile/profilelatestnote.php">全部消息</a></span></li>',
                '</ul>',
            	'<div class="clearit"></div>',
            '</div>',
			'<ul class="commentslist" id="commentdata">',
				
				/**'<li class="fst"><span style="color:#999;">未读</span></li>',**/                    
					'<li><a class="conn" href="http://i.blog.sina.com.cn/blogprofile/profilecommlist.php?type=1">评论</a><a class="num" href="http://i.blog.sina.com.cn/blogprofile/profilecommlist.php?type=1" id="#{commentRelapseCount}" ></a></li>',
                    '<li><a class="conn" href="http://i.blog.sina.com.cn/blogprofile/wall.php">留言</a><a class="num" href="http://i.blog.sina.com.cn/blogprofile/wall.php" id="#{guestBookCount}">1</a></li>',
                    '<li class="lst"><a class="conn" href="http://control.blog.sina.com.cn/blogprofile/profileinvitelist.php">好友邀请</a><a class="num" href="http://control.blog.sina.com.cn/blogprofile/profileinvitelist.php" id="#{inviteCount}" ></a></li>',
                    '<li><a class="conn" href="http://control.blog.sina.com.cn/blogprofile/profilepaperlist.php?type=1">纸条</a><a class="num" href="http://control.blog.sina.com.cn/blogprofile/profilepaperlist.php?type=1" id="#{messageCount}" ></a></li>',
					'<li><a class="conn" target="_blank" href="http://mail.sina.com.cn" reject="1">邮箱</a><a class="num" href="http://mail.sina.com.cn" id="#{mailCount}" target="_blank" reject="1"></a></li>',
                   '<li><a class="conn" href="http://control.blog.sina.com.cn/blog_rebuild/profile/controllers/notelist.php?action=profilesysnote">系统消息</a><a class="num" href="http://control.blog.sina.com.cn/blog_rebuild/profile/controllers/notelist.php?action=profilesysnote" id="#{sysnoticeCount}" ></a></li>',
			'</ul>',
        '</div>',
    '</div>',
'</div>'
];
scope.newInboxPanelTemplate=st.join("");