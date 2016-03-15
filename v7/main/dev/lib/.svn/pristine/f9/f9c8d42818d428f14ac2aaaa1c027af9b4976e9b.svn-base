$import("sina/sina.js");
$import("sina/core/class/define.js");
$import("sina/core/events/addEvent.js");
$import("sina/utils/io/jsload.js");
$import("sina/utils/cookie/getCookie.js");

$import("lib/lib.js");
$import("lib/register.js");
$import("lib/panel.js");
$import("lib/tray/tpl/userMenu.js");
$import("lib/tray/loginOut.js");

/**
 * @fileoverview 右侧托盘(加强版)登录后的昵称下拉面板
 * @author Qiangyee | wangqiang1@staff
 * @created 2013-04-12
 */
Lib.register('tray.UserMenuPanel', function(lib){
    var userMenu = Core.Class.define(function() {
        lib.Panel.prototype.initialize.apply(this, arguments);
        this.setTemplate(lib.tray.tpl.userMenu);
    }, lib.Panel, {

        /**
         * 根据用户ID初始化用户信息
         * @param {String} uid
         */
        initUserInfo:function(uid) {
            var nodes = this.getNodes();
            
            // 配置链接
            nodes["linkBlog"].href = "http://blog.sina.com.cn/u/" + uid;
            nodes["linkPhoto"].href = "http://photo.blog.sina.com.cn/u/" + uid;
            // nodes["linkVBlog"].href = "http://you.video.sina.com.cn/m/" + uid;
            nodes["miniblog"].href = "http://control.blog.sina.com.cn/t_sina_blog/tb.php?uname=" + uid;
            // nodes["qingblog"].href = "http://qing.weibo.com/fancy.html";
            nodes["mySpace"].href = "http://blog.sina.com.cn/s/profile_" + uid + ".html";
            nodes["linkChangeFace"].href = "http://control.blog.sina.com.cn/blogprofile/nick.php";
            nodes["linkChangePassword"].href = "http://login.sina.com.cn/member/security/password.php";
            nodes["linkAccountSetup"].href = "http://login.sina.com.cn/member/security.php";
            
            this.initLoginOut(nodes["loginOut"]);
        }
        ,initLoginOut : function(outBtn){

            outBtn.onclick = function(){
                return false;
            };
            
            Core.Events.addEvent(outBtn, function(){
                lib.tray.loginOut(null, !0);
            });
            
        }
    });
    return userMenu;
});