/**
 * @fileoverview
 *    我的动态、关注、收藏、留言、圈子页——个人资料组件
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("lib/component/class/registComp.js");
$import("component/comp_901.js");

$registComp(901, {
    /*
     * 显示昵称
     */
    "showNickName": function (oResult) {
        var nickname = (/&[xy]$/.test(window.location.href)) ? "封杀用户" : oResult[scope.$uid] || "";
        scope.owenerNickName = nickname;

        $E("comp_901_nickname").innerHTML = nickname;
        if ($isAdmin == false) {
            $E("comp_901_head_image").title = nickname;
        } else {
            $E("comp_901_head").innerHTML = '<a href="http://control.blog.sina.com.cn/blogprofile/nick.php"' + ' title="点击上传头像" target="_blank"><img id="comp_901_head_image" width="180" height="180" alt="点击上传头像" src="http://portrait' + (scope.$uid * 1 % 8 + 1) + '.sinaimg.cn/' + scope.$uid + '/blog/180" /></a>'
        }
    }    /*
     * 加载其他的附加信息接口
     */,
    "loadOtherInfo": function () {
        // 判断彩信用户

        // 判断广告共享计划用户
    }
}, 901);
