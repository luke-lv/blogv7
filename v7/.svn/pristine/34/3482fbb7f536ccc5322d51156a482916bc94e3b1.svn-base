/**
 * @author shaomin | shaomin@staff.sina.com.cn
 * desc this job for rendering the index page
 */
 

$import("common/BF.js");
$import("common/Photo.js");

$registJob("renderIndex",function(){
    if(!(scope.login && scope.myself)) return;
    if(id_list)
		var photoLen = id_list.length;

	if(typeof ctg_id != 'undefined'){

		for(var i=0;i<photoLen;i++){
			var ids = id_list[i];
			var oPhoto = new Photo(ids,ctg_id);
			var tags = ["title","memo"];
			oPhoto.createObj(tags);
			oPhoto.initBtnPanel(ids,ctg_id);
		}
        return;
	}
	
    for(var i=0;i<photoLen;i++){
		var ids = id_list[i];
		var oPhoto = new Photo(ids.photo,ids.ctg);
		var tags = ["title","memo"];
		oPhoto.createObj(tags);
		oPhoto.initBtnPanel(ids.photo,ids.ctg);
    }
});	

