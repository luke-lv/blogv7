/**
 * @author shaomin | shaomin@staff.sina.com.cn
 * desc this job for rendering the index page
 */
 

$import("common/BF.js");
$import("common/Photo.js");
$import("common/PhotoSon.js");


$registJob("renderPhoto",function(){
    if(!(scope.login && scope.myself)) return;
    var oPhoto = new Photo(picInfo.pic_id,picInfo.ctg_id);
    var tags = ["title","memo",'tag'];
    oPhoto.createObj(tags);
    oPhoto.initBtnPanel(picInfo.pic_id,picInfo.ctg_id);
   
});	

