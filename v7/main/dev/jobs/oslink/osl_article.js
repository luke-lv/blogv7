/** 
 * @fileoverview 外链统计 - 用于article、articleM、articletj页
 * @author Book | liming9@staff.sina.com.cn
 * @version 1 | 2012-10-19
 */
$import("other/countOSLink.js");

$registJob('osl_article', function(){
    
    Lib.countOSLink([{
        blogid: scope.$articleid || '',
        container: $E('sina_keyword_ad_area2')
    }]);
    
});
