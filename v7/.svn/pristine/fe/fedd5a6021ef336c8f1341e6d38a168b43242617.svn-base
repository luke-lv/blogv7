/**
 * @fileoverview
 *	blog365列表滚动
 * @author Lvyuan | rarny@163.com
 * @version 1.0
 * @history
 *
 */
$import("component/slideBox.js");
$import("sina/sina.js");
$registJob("blog365Slide",function (){
	if (!$E("calendarCon")){
		return;
	}

	$E("calendarCon").style.width = 9999 + "px";

	new slideBox($E("swrap"), 
        $E("calendarCon"),$E("btn_preview"), 
        $E("btn_next"),
        {
            slideChildCount : 7,
            duration : 1
        });
});