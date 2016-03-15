/**
 * @author guangtian| guangtian@staff.sina.com.cn
 * @date 2015/11/3
 * 图片验证码
 */
$import("lib/imgCheck.js");
$registJob('imgCheck', function () {
    Lib.imgCheck.init();
    //return {
    //    refresh: function () {
    //        //           if (!fresh_chk) {
    //        $E("comment_check_img").src = "http://interface.blog.sina.com.cn/riaapi/checkwd_image.php?" + new Date().valueOf();
    //        $E("comment_check_img").style.display = "inline";
    //        $E("check_show").style.display = "none";
    //        //              fresh_chk = true;
    //        //           }
    //    }
    //};
});