/**
 * @author shaomin | shaomin@staff.sina.com.cn
 */
 
$import("sina/sina.js");
$import("lib/jobs.js");
$import("common/Category.js");


 $registJob("list4Left",function(){
     if(typeof visible != 'undefined' && visible == 'public')
	 return;
     var currentData = {
	 pagerType  : 3,
	 currentTpl : 'leftOutline',
	 pagerNode  : 'leftPager',
	 listLayer  : $E("ctgLayer"),
	 pageNum    : 5
     };
  
     allCtg = new Category(currentData);
     allCtg.getList("public");

 });	



