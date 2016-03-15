$import("lib/lib.js");
$import("lib/register.js");
$import("lib/sendLog.js");
/**
 * @fileoverview 用户昵称下拉面板模板
 * @author Qiangyee | wangqiang1@staff
 * @created 2013-04-12
 */
 Lib.register("tray.tpl.userMenu", function(){
    var tpl = [
        '<div id="#{panel}" class="mUserMenu">',
          '<ul>',
            // 发博文按钮
            '<li>',
              '<span class="tb_ps_nm"><a id="#{linkBlog}" onclick="v7sendLog(\'40_01_22\')" href="###"><img class="SG_icon SG_icon15" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" title="博客" align="absmiddle">博客</a></span>',
              '<span class="rlink"><a target="_blank" onclick="v7sendLog(\'40_01_22\')" id="#{linkPostBlog}" href="http://control.blog.sina.com.cn/admin/article/article_add.php">发博文</a></span>',
            '</li>',
            // 发图片按钮
            '<li> <span class="tb_ps_nm"><a id="#{linkPhoto}" onclick="v7sendLog(\'40_01_22\')" href="###"><img class="SG_icon SG_icon18" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" title="相册" align="absmiddle">相册</a></span> <span class="rlink"><a target="_blank" id="#{linkPostPhoto}" onclick="v7sendLog(\'40_01_22\')" href="http://photo.blog.sina.com.cn/upload/upload.php">发图片</a></span> </li>',
            // 博客按钮
            // '<li> <span class="tb_ps_nm"><a target="_blank" id="#{linkVBlog}" onclick="v7sendLog(\'40_01_22\')" href="###"><img class="SG_icon SG_icon16" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" title="播客" align="absmiddle">播客</a></span> <span class="rlink"><a target="_blank" id="#{linkUpload}" onclick="v7sendLog(\'40_01_22\')" href="http://vupload.you.video.sina.com.cn/u.php?m=1">发视频</a>&nbsp;&nbsp;<a id="#{linkRecord}" onclick="v7sendLog(\'40_01_22\')" href="http://vupload.you.video.sina.com.cn/r.php" target="_blank">录视频</a></span> </li>',
            // 微博按钮
            '<li> <span class="tb_ps_nm"><a id="#{miniblog}" onclick="v7sendLog(\'40_01_22\')" href="###" target="_blank"><img class="SG_icon SG_icon110" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="17" title="微博" align="absmiddle">微博</a></span> </li>',
            // Qing博客按钮
            // '<li> <span class="tb_ps_nm"><a id="#{qingblog}" onclick="v7sendLog && v7sendLog(\'79_01_02\',scope.$pageid,\'qingLink\');" onclick="v7sendLog(\'40_01_22\')" href="###" target="_blank"><img class="SG_icon SG_icon205" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" title="Qing" align="absmiddle">Qing</a></span> </li>',
            // 邮件按钮
            '<li style="display:none;" id="#{mail}"> <span class="tb_ps_nm"><a id="#{bindEmail}" target="_blank" href="http://mail.sina.com.cn/?s=2" onclick="v7sendLog(\'40_01_22\')"><img class="SG_icon SG_icon212" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="13" title="邮件" align="absmiddle">邮件</a></span> </li>',
            // '<li style="display:none;" id="#{mail}"> <span class="tb_ps_nm"><a id="#{bindEmail}" target="_blank" href="http://mail.sina.com.cn/sepwakeup.php?suda-key=mail_sep&suda-value=blog_dingdao" onclick="v7sendLog(\'40_01_22\')"><img class="SG_icon SG_icon212" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="13" title="邮件" align="absmiddle">邮箱活动</a></span> </li>',
            // 进入关于我按钮
            '<li> <span class="tb_ps_nm"><a id="#{mySpace}" onclick="v7sendLog(\'40_01_22\')" href="###"><img class="SG_icon SG_icon41" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" title="关于我" align="absmiddle">关于我</a></span> </li>',
          '</ul>',
          '<div class="links">',
            '<p><a target="_blank" id="#{linkChangeFace}" onclick="v7sendLog(\'40_01_22\')" href="###">修改头像昵称&gt;&gt;</a></p>',
            '<p><a target="_blank" id="#{linkChangePassword}" onclick="v7sendLog(\'40_01_22\')" href="###">修改登录密码&gt;&gt;</a></p>',
            '<p><a target="_blank" id="#{linkAccountSetup}" onclick="v7sendLog(\'40_01_22\')" href="###">帐号安全设置&gt;&gt;</a></p>',
            '<p><a id="#{loginOut}" onclick="v7sendLog(\'40_01_23\');return false;" href="#">退出&gt;&gt;</a></p>',
          '</div>',
        '</div>'].join('');
    return tpl;
});