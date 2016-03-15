/**
 * @author shaomin | shaomin@staff.sina.com.cn
 * desc this job for rendering the index page
 */
 
$import("sina/sina.js");
$import("lib/jobs.js");

$import("common/Album.js");

$registJob("renderCtg",function(){
    if(!(scope.login && scope.myself)) return;

    if(typeof ctg_id != 'undefined'){
	var oCtg = new Album(ctg_id);
	oCtg.initBtnPanel(ctg_id);
	return;
    }

    var ctgLen = id_list.length; 
    for(var i=0;i<ctgLen;i++){
	var ids = id_list[i].ctg || id_list[i];
	var oCtg = new Album(ids);
	oCtg.initBtnPanel(ids);
    }
});	

