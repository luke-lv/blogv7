/**
 * 从 http://hits.blog.sina.com.cn/hits 返回的 SetPV 方法的定义
 * @author L.Ming | liming1@staff.sina.com.cn
 * @since 2008.02.04
 */
$import("sina/core/string/formatNumber.js");
$import('lib/checkAuthor.js');
$SetPV = function(nPv){
	/*
	if ($isAdmin && $E("comp_901_grade").innerHTML != "读取中…") {
		return;
	}
	*/
    nPv = window.parseInt(nPv);
    Lib.checkAuthor();
	if($E("comp_901_pv")){
        if($isAdmin) {
            $E("comp_901_pv").innerHTML = '<strong><a title="您的访问统计" href="http://i.blog.sina.com.cn/blogprofile/profilevisitanaly.php" target="_blank">' + Core.String.formatNumber(nPv) + '</a></strong>';
        } else {
            $E("comp_901_pv").innerHTML = '<strong>' + Core.String.formatNumber(nPv) + '</strong>';
        }
    }
    var grade = 0;
    var score = [0, 50, 100, 150, 200, 300, 500, 800, 1500, 3000, 5000, 10000, 15000, 25000, 40000, 70000, 100000, 150000, 200000, 500000, 1000000, 2000000, 5000000, 10000000, 20000000, 50000000, 100000000, 150000000, 200000000, 250000000, 300000000, 350000000, 400000000, 450000000, 500000000, 550000000];
    if (nPv >= 50000000) { // 如果大于 5000 万，就每 5000 万升一级
        grade = Math.floor(nPv / 50000000) + 24;
    }
    else { // 如果小于 5000 万，就在数组中去查找
        grade = -1;
        score = score.join(",").replace(/(\d+)/g, function(a, b){
            if (window.parseInt(b) <= nPv) {
               grade++;
            }
        });
    }
    if(scope.$pageid === "article" || scope.$pageid === "articleM" || scope.$pageid === "articletj"){
        scope.$rank = grade;
    }
    grade = grade.toString().replace(/(\d)/g, function($0, $1){
        return "<img src=\"http://simg.sinajs.cn/blog7style/images/common/number/" + $1 + ".gif\"/>";
    });
    if($E("comp_901_grade")){
        $E("comp_901_grade").innerHTML = grade;
    }
};
