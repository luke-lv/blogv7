/**
 * @fileoverview 托盘的模板HTML
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-06
 */

//未登录的模板HTML
var str=[
	'<div id="#{panel}" style="z-index:512;" class="sinatopbar">',
		'<div class="topbar_main">',
			'<a id="#{loginBarLogoLink}" href="javascript:;"><img id="#{loginBarLogo}" class="topbar_logo" src="http://simg.sinajs.cn/blog7style/images/common/topbar/topbar_logo.gif" width="100" alt="新浪博客"/></a>',
			'<div class="topbar_menu">',
				'<span class="link"><a target="_blank" href="http://blog.sina.com.cn">博客首页</a></span>',
				'<span class="line_s"></span>',
				'<span class="link"><a target="_blank" href="http://blog.sina.com.cn/lm/rank/index.html">排行榜</a></span>',
			'</div>',
			'<div class="topbar_ad"><a target="_blank" id="#{linkPopularize}" href="javascript:;"></a></div>',
			'<div class="topbar_login"><a id="#{trayLogin}" class="login" href="javascript:;">登录</a><a target="_blank" class="register" href="http://login.sina.com.cn/hd/reg.php?entry=blog">注册</a></div>',
			'<div class="topbar_floatR">',
				'<span class="tb_wrtBlog">',
					'<img class="SG_icon SG_icon15" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" title="博文" align="absmiddle"/>',
					'<a target="_blank" href="http://control.blog.sina.com.cn/admin/article/article_add.php">发博文</a>',
					'<span id="#{arrowAddArticle}" class="wrtblog_arrow"></span>',
				'</span>',
				'<div class="topbar_search">',
					'<form action="" target="_blank" method="get" id="#{loginBarSearchForm}">',
						'<div class="topbar_input">',
							'<input id="#{loginBarSearchInput}" name="k" class="topbar_txt" type="text"/>',
						'</div>',
						'<div id="#{searchSelect}" class="topbar_list">',
							'<div id="#{loginBarSearchMenuLabel}" class="anainp">博文</div>',
							'<div class="arrow"></div>',
						'</div>',
						'<input type="submit" class="topbar_searchBtn" value="搜索"/>',
						'<input type="hidden" id="" value="utf-8" name="e"/>',
						'<input type="hidden" id="" value="utf-8" name="ie"/>',
						'<input type="hidden" id="#{loginBarSearchT}" value="" name="t"/>',
						'<input type="hidden" id="#{loginBarSearchTS}" value="" name="ts"/>',
						'<input type="hidden" id="#{loginBarSearchS}" value="" name="s"/>',
						'<input type="hidden" id="#{loginBarSearchType}" value="" name="type"/>',
						'<input type="hidden" id="#{loginBarSearchSType}" value="" name="stype"/>',
					'</form>',
				'</div>',
				'<a target="_blank" class="topbar_help" href="http://blog.sina.com.cn/lm/help/2009/index.html">帮助</a>',
			'</div>',
		'</div>',
	'</div>'
];

scope.trayTemplayLogout=str.join("");



//登录后的模板HTML
str=['<div id="#{panel}" style="z-index:512;" class="sinatopbar">',
		'<div class="topbar_main">',
			'<a id="#{loginBarLogoLink}" href="javascript:;"><img id="#{loginBarLogo}" class="topbar_logo" src="http://simg.sinajs.cn/blog7style/images/common/topbar/topbar_logo.gif" width="100" alt="新浪博客"/></a>',
			'<div class="topbar_menu">',
				'<span id="#{loginBarOptApp}" class="link"><a id="#{loginBarAppMenuLabel}" href="javascript:;">读取中...</a><a href="javascript:;" class="link_arrow" title=""></a></span>',
				'<span class="line_s"></span>',
				'<span id="#{loginBarFriend}" class="link"><a target="_self" href="http://i.blog.sina.com.cn/blogprofile/index.php">个人中心</a></span>',
				'<span class="line_s"></span>',
				'<span id="#{loginBarFriend}" class="link"><a target="_blank" href="http://control.blog.sina.com.cn/blogprofile/profilefriendlist.php">好友</a></span>',
				'<span class="line_s"></span>',
				'<span id="#{loginBarInbox}" class="link"><img id="#{imgNewMessage}" style="display:none;" class="SG_icon SG_icon40" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" title="消息" align="absmiddle"/><a href="javascript:return false;">消息</a><a href="javascript:return false;" class="link_arrow" title=""></a></span>',
				'<span class="line_s"></span>',
				'<span class="link"><a href="http://login.sina.com.cn/cgi/login/logout.php">退出</a></span>',
			'</div>',
			'<div class="topbar_floatR">',
				'<span class="tb_wrtBlog">',
					'<img class="SG_icon SG_icon15" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" title="博文" align="absmiddle"/>',
					'<a target="_blank" href="http://control.blog.sina.com.cn/admin/article/article_add.php">发博文</a>',
					'<span id="#{arrowAddArticle}" class="wrtblog_arrow"></span>',
				'</span>',
				'<div class="topbar_search">',
					'<form action="" target="_blank" method="get" id="#{loginBarSearchForm}">',
						'<div class="topbar_input">',
							'<input id="#{loginBarSearchInput}" maxlength="100" name="k" class="topbar_txt" type="text"/>',
						'</div>',
						'<div id="#{searchSelect}" class="topbar_list">',
							'<div id="#{loginBarSearchMenuLabel}" class="anainp">博文</div>',
							'<div class="arrow"></div>',
						'</div>',
						'<input type="submit" class="topbar_searchBtn" value="搜索"/>',
						'<input type="hidden" id="" value="utf-8" name="e"/>',
						'<input type="hidden" id="" value="utf-8" name="ie"/>',
						'<input type="hidden" id="#{loginBarSearchT}" value="" name="t"/>',
						'<input type="hidden" id="#{loginBarSearchTS}" value="" name="ts"/>',
						'<input type="hidden" id="#{loginBarSearchS}" value="" name="s"/>',
						'<input type="hidden" id="#{loginBarSearchType}" value="" name="type"/>',
						'<input type="hidden" id="#{loginBarSearchSType}" value="" name="stype"/>',
					'</form>',
				'</div>',
				'<a target="_blank" class="topbar_help" href="http://blog.sina.com.cn/lm/help/2009/index.html">帮助</a>',
			'</div>',
		'</div>',
		'<div style="position:absolute;left:0;top:0;" id="trayFlashConnetion">',
		'</div>',
	'</div>'];

scope.trayTemplayLogin=str.join("");
