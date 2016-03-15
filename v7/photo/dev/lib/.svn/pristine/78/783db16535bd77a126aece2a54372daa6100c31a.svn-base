/**
 * @fileoverview 托盘(加强版)的模板HTML
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-09-14
 */
//未登录的模板HTML
scope.trayPlusTemplayLogout=[
	'<div class="topbar_menu">',
		'<span class="link"><a target="_blank" href="http://blog.sina.com.cn">博客首页</a></span>',
		'<span class="line_s"></span>',
	'</div>',
	// ' <div class="topbar_update"><a id="btnBlog7LevelUp" class="update" onclick="return false;" href="#">升级新版博客</a></div>',	
	'<div class="topbar_login"><a id="linkTrayLogin" class="login" href="javascript:;">登录</a><a id="linkReg" target="_blank" class="register" href="">注册</a></div>',
	'<div id="divPopularize" class="topbar_ad"></div>',
	'<div id="loginBarActivity" class="topbar_activity"></div>'
].join("");


//登录后的模板HTML
scope.trayPlusTemplayLogin=[
	'<div class="topbar_menu" id="openedBlogTray">',
		'<span id="loginBarOptApp" class="link"><a id="loginBarAppMenuLabel" href="javascript:;">读取中...</a><a href="javascript:;" class="link_arrow" title=""></a></span>',
		'<span class="line_s"></span>',
		'<span style="display:none;" id="loginBarMail" class="link imfor blog_to_mail"><a target="_blank" href="http://mail.sina.com.cn/?s=2">邮件</a><div id="mailpiaohong" style="display:none;" class="imforbox"></div></span>',
		'<span class="line_s" style="display:none;" id="line"></span>',
		'<span id="loginBarCenter" class="link"><a target="_self" href="http://i.blog.sina.com.cn/blogprofile/index.php?com=1">个人中心</a></span>',
		'<span class="line_s"></span>',
		'<span id="loginBarFriend" class="link"><a target="_blank" href="http://control.blog.sina.com.cn/blogprofile/profilefriendlist.php">好友</a></span>',
		'<span class="line_s"></span>',
		'<span id="loginBarInbox" class="link imfor"><img id="imgNewMessage" style="display:none;" class="topbar_msg" src="http://simg.sinajs.cn/blog7style/images/common/topbar/topbar_msg.gif"/><a href="#" onclick="return false;">消息</a><a href="#" onclick="return false;" class="link_arrow" title=""></a><div id="ccnotepiaohong" style="display:none;" class="imforbox"></div></span>',
		'<span class="line_s"></span>',
		'<span class="link" id="logOut"><a href="#">退出</a></span>',
	'</div>',
	'<div style="display:none" class="topbar_menu" id="noOpenedBlogTray">',
		'<span class="link" style="cursor:default;"><a id="noOpenBlogName">读取中...</a></span>',
		'<span class="line_s"></span>',
		'<span class="link"><a href="#">退出</a></span>',
	'</div>',
	'<div class="topbar_noopen" style="display:none" id="outOfOpenBlogTray">',
		'<a id="openBlogBtnTray" title="立即开通博客" class="nowopen" href="javascript:void(0)" onclick="return false;"></a>',
	'</div>',
	'<div id="loginBarActivity" class="topbar_activity"></div>'
].join("");

//促登陆的模板HTML
scope.trayPlusTemplayOnceLoged=[
	'<div class="topbar_menu" id="openedBlogTray">',
		'<span id="loginBarOptApp" class="link"><a id="loginBarAppMenuLabel" href="javascript:;">读取中...</a></span>',
		'<span class="line_s"></span>',
		'<span id="loginBarMail" class="link imfor blog_to_mail"><a target="_blank" href="http://mail.sina.com.cn/?s=2">邮件</a><div id="mailpiaohong" style="display:none;" class="imforbox"></div></span>',
		'<span class="line_s" id="line"></span>',
		'<span id="loginBarCenter" class="link"><a target="_self" href="http://i.blog.sina.com.cn/blogprofile/index.php?com=1">个人中心</a></span>',
		'<span class="line_s"></span>',
		'<span id="loginBarFriend" class="link"><a target="_blank" href="http://control.blog.sina.com.cn/blogprofile/profilefriendlist.php">好友</a></span>',
		'<span class="line_s"></span>',
		'<span id="loginBarInbox" class="link imfor"><img id="imgNewMessage" style="display:none;" class="topbar_msg" src="http://simg.sinajs.cn/blog7style/images/common/topbar/topbar_msg.gif"/><a href="#" onclick="return false;">消息</a><div id="ccnotepiaohong" style="display:none;" class="imforbox"></div></span>',
	'</div>',
	'<div style="display:none" class="topbar_menu" id="noOpenedBlogTray">',
		'<span class="link" style="cursor:default;"><a id="noOpenBlogName">读取中...</a></span>',
		'<span class="line_s"></span>',
		'<span class="link"><a href="#">退出</a></span>',
	'</div>',
	'<div class="topbar_noopen" style="display:none" id="outOfOpenBlogTray">',
		'<a id="openBlogBtnTray" title="立即开通博客" class="nowopen" href="javascript:void(0)" onclick="return false;"></a>',
	'</div>',
	'<div id="divPopularize" class="topbar_ad"></div>',
	'<div id="loginBarActivity" class="topbar_activity"></div>'
].join("");

//'有新动态产生'浮层
scope.newStatusTipTemplay = [
	'<div class="tb_layer_arrow"></div>',
	'<div class="tb_layer_Y_main tip_ps" style="width:130px;text-align:left;padding:5px 0 2px 5px;color:#000000">',
		'<a onclick="$E(\'newStatusTip\').style.display=\'none\';return false" href="#" class="tb_friend_inputDel" title="关闭" style="margin-top: 5px;"></a>',
		'<a href="http://i.blog.sina.com.cn/blogprofile/index.php?type=3&from=newstatus&com=2"><span id="nstFeed" style="padding:2px 2px;display:none;">你有<span style="color:red">新动态</span>可查看</span></a>',
		'<a href="http://control.blog.sina.com.cn/blogprofile/profileremind.php?com=2"><span id="nstFavorite" style="padding:3px 2px;display:none;">你有博文被<span style="color:red">转载/收藏</span></span></a>',
		'<img id="gbimg" class="SG_icon SG_icon83" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="17" height="15" align="absmiddle" style="display:none"/><a style="display:none" href="http://i.blog.sina.com.cn/blogprofile/index.php?com=g" id="gbmsg">官博<em>新动态</em></a>',
	'</div>'
].join('');

//'促登陆状态的 新动态 浮层
scope.onceLogedStatusTipTemplay = [
	'<div class="tb_layer_arrow"></div>',
	'<div class="tb_layer_Y_main tip_ps" style="width:130px;text-align:left;padding:5px 0 2px 5px;color:#000000">',
		'<a onclick="$E(\'newStatusTip\').style.display=\'none\';return false" href="#" class="tb_friend_inputDel" title="关闭" style="margin-top: 5px;"></a>',
		'<a href="javascript:void(0);return false;"><span id="nstUnread" style="padding:3px 2px;display:none;">你有<span style="color:red">未读消息</span>可查看</span></a>',
		'<a href="javascript:void(0);return false;"><span id="nstFeed" style="padding:2px 2px;display:none;">你有<span style="color:red">新动态</span>可查看</span></a>',
		'<a href="javascript:void(0);return false;"><span id="nstUpdate" style="padding:3px 2px;display:none;">你最近浏览的博主<span style="color:red">有更新</span></span></a>',
		'<a href="javascript:void(0);return false;"><span id="nstUnpub" style="padding:2px 2px;display:none;">你有<span style="color:red">尚未发表</span>的博文</span></a>',
	'</div>'
].join('');

