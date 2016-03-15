$import("lib/lib.js");
$import("lib/register.js");
/**
 * @fileoverview 右侧托盘(加强版)登录后的模板HTML
 * @author Qiangyee | wangqiang1@staff
 * @created 2013-04-12
 */
Lib.register('tray.tpl.loginMemu', function(){
    var tpl = [
    '<div class="ntopbar_menu" id="#{panel}">',
        // 开通博客右侧结构
        '<div id="#{openBlog}" style="display:none;">',
            '<span class="link" id="#{userMenu}"><a id="#{userNick}" onclick="v7sendLog(\'40_01_21\');return false;" href="###">读取中...</a><a href="javascript:;" class="link_arrow" title=""></a></span>',
            '<span id="#{msnHolder}" class="ico_msn" style="display:none"><a id="#{msnLink}" href="http://control.blog.sina.com.cn/blogprofile/msnbind.php?c=" target="_blank"><img height="18" width="18" align="absmiddle" class="SG_icon SG_icon136" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif"></a></span>',
            '<span class="line_s"></span>',
            '<span class="link"><a onclick="v7sendLog(\'40_01_27\')" href="http://i.blog.sina.com.cn/blogprofile/index.php?com=1">个人中心</a></span>',
            '<span class="line_s"></span>',
      '<em id="#{newFeed}" class="mtip" style="left:341px;display:none;cursor:pointer;"></em>',
            '<span class="link" id="#{blogMenu}"><a target="_blank" onclick="v7sendLog(\'40_01_24\')" href="http://control.blog.sina.com.cn/admin/article/article_add.php">发博文</a><a id="#{addArticle}" onclick="v7sendLog(\'40_01_25\');return false;" href="###" class="link_arrow"></a></span>',
            '<span class="line_s"></span>',
            // '<span class="link"><a onclick="v7sendLog(\'40_01_28\')" target="_blank" href="http://control.blog.sina.com.cn/blogprofile/profilefriendlist.php">好友</a></span>',
            //'<span class="link"><a onclick="v7sendLog(\'40_01_28\')" target="_blank" href="http://wanwan.sina.com.cn/bloggame/">游戏</a></span>',
            //'<span class="line_s"></span>',
            '<span class="link" id="#{trayMsg}" msg-panel-show-state="0"><a onclick="v7sendLog(\'40_01_30\');return false;" href="###">消息</a><a href="javascript:return false;" class="link_arrow" title=""></a></span>',
            '<em id="#{newTips}" onclick="v7sendLog(\'40_01_29\')" class="mtip" style="left:341px;display:none;cursor:pointer;"></em>',
        '</div>',
        // 未开通博客右侧结构
        '<div id="#{noOpenBlog}" style="display:none;">',
            '<span class="link"><a id="#{ssoNick}" onclick="v7sendLog(\'40_01_40\');return false;" href="###">读取中...</a></span>', 
            '<span class="line_s"></span>', 
            '<span class="link"><a id="#{ssoLoginOut}" onclick="v7sendLog(\'40_01_41\');return false;" href="###">退出</a></span>',
            '<div class="ntopbar_login" style="float:left;"><a id="#{openBlogBtn}" onclick="v7sendLog(\'40_01_42\')" class="login" href="###"><span>立即拥有一个新博客</span></a></div>',
        '</div>',
    '</div>'].join("");
    return tpl;
});
/**
 * @fileoverview 右侧托盘(加强版)未登录的模板HTML
 * @author Qiangyee | wangqiang1@staff
 * @created 2013-04-12
 */
Lib.register('tray.tpl.loginOutMemu', function(){
    var uid = scope.$uid || '';
    //配置"注册"链接地址
    var regLink = 'http://login.sina.com.cn/signup/signupmail.php?entry=blog&srcuid=' + uid + '&src=';
    // 育儿频道
    if(scope.$channel == 2) {
        regLink += 'baby';
    } else {
        regLink += 'blogicp'
    }
    
    var tpl = ['<div id="#{panel}" class="ntopbar_login">',
            '<a class="login" onclick="v7sendLog(\'40_01_38\');return false;" href="###" action-type="tray-login-btn"><span>登录</span></a>',
            '<a class="register" onclick="v7sendLog(\'40_01_39\')" target="_blank" href="',regLink,'">注册</a></div>'].join('');
    return tpl;
});
