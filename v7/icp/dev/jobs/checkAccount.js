/** 
 * @fileoverview 漫游账号、高危账号处理
 * @author Book | liming9@staff.sina.com.cn
 * @version 1 | 2012-05-25
 */
$import("lib/accountChecker.js");

$registJob('checkAccount', function(){
    var url = scope.$ssoUseUrl;
    if( url && url !== '0' ){
        new Lib.AccountChecker(url);
    }
});
