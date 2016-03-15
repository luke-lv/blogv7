/**
 * @fileoverview 博客365博文目录|博客365活动页——日历hover效果
 * @author gaolei | gaolei2
 * @date 2012-11-06
 */

$import("lib/util/hoverJq.js");
$import("lib/classUtils.js");
$import("lib/checkAuthor.js");

$registJob("calendarHover",function(){

	var calendarCon = $E("calendarCon") && $E("calendarCon").getElementsByTagName("li");
	var tempArr = [];
	var classUtil = new Lib.classUtils();
	
	if (!calendarCon){
		return;
	}
	
	Lib.checkAuthor();
	if (!$isAdmin){//新增需求，非博主访问365页面，没有hover效果，直接返回
		return;
	}
// window.onerror = null;
	for (var i=(calendarCon.length-1); i>=0; i--){
		var dom = calendarCon[i];
		// console.log(classUtil.hasClass(dom ,"coming"))
		// console.log(classUtil.hasClass(dom ,"today"))
		// console.log(dom.children[0].tagName.toLowerCase() != "div")
		var flag = classUtil.hasClass(dom ,"coming") || 
						classUtil.hasClass(dom ,"today") || 
						(dom.innerHTML.indexOf("article_edit.php") >=0) || 
						(dom.innerHTML.indexOf("sinaimg.cn") >= 0);

		if (flag){
			tempArr.push(dom);
		}
	}
	
	Lib.util.hoverJq({
		elm : tempArr,
		mouseenter : function(){
			classUtil.addClass(this, "hover");
		},
		mouseleave : function(){
			classUtil.delClass(this, "hover");
		}
	});
});