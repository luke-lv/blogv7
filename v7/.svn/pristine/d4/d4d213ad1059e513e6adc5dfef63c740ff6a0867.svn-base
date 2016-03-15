/**
 * @fileoverview 博客推荐
 * @author Luo Rui | luorui1@staff.sina.com.cn
 * @created 2009-12-29
 */
$import("sina/sina.js");
$import("lib/checkAuthor.js");

$registJob("loginHelp", function(){
	Lib.checkAuthor();
	var a = $T(document.body, 'a')[0];
	var referrer = document.referrer;
    if (!referrer) {
        try {
            if (window.opener) {
                // IE下如果跨域则抛出权限异常
                // Safari和Chrome下window.opener.location没有任何属性
                referrer = window.opener.location.href;
            }
        }
        catch (e) {}
    }
	$E('iknowBtn').onclick = function(){
		window.close();
	};
	a.href += '&r=' + encodeURIComponent(referrer);
});
