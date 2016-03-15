/**
 * @fileoverview 长微博登录浮层
 *
 * @author  Qiangyee | wangqiang1@staff
 * @date    2012-07-12
 */
$import("lib/login/ui.js");
$import("lib/checkAuthor.js");

$registJob("login", function (){
    Lib.checkAuthor();
    if ($isLogin){
        return;
    }

	var handler = new Lib.Login.Ui();
    handler.onShow = function(){
        var closeBtn = this.dialog.nodes["btnClose"];
        if (closeBtn){
            closeBtn.style.visibility = "hidden";
        }
    };
    handler.login(function(){
        location.reload(true);
    });

});