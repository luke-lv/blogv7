/*
 * @author shaomin | shaomin@staff.sina.com.cn
 * @desc  declare some functions which are not base to sina libarary ,and are used in job
 */
$import("sina/sina.js");
$import("msg/transcode.js");

$import("lib/dialogConfig.js");
$import("lib/interface.js");

 var DICT = {"tag":"标签","title":"标题","demo":"描述","photo":"图片","album":"专辑"};
 var DOMAIN = "http://photo.blog.sina.com.cn";
var phpENTRY = {
     move          : new Interface("/services/ajax_photo_move.php", "ijax"),
     delPhoto      : new Interface("/services/ajax_photo_delete.php", "ijax"),
     rotate2       : new Interface("http://photo.blog.sina.com.cn/services/ajax_photo_vision.php","ijax"),
     rotate1       : new Interface("http://upload.photo.sina.com.cn/interface/pic_rotate.php","ijax"),
     collect       : new Interface("/services/ajax_collection_add.php", "ijax"),
     getList       : new Interface("http://photo.blog.sina.com.cn/services/ctg_list_ctg.php?format=gsonv", "jsload"),
     validatePw    : new Interface("/services/ctg_validate_pw.php?uid="+scope.$uid, "ijax"),
     delCmnt       : new Interface("/services/ajax_comment_delete.php", "ijax"),
     sendCmnt      : new Interface("/services/ajax_comment_send.php?uid="+scope.$uid, "ijax"),
     editPics      : new Interface("/upload/ajax_photoedit_post.php", "ijax"),
     impeach       : new Interface("/services/ajax_photo_impeach.php", "ajax"),
     setCover      : new Interface("/services/ctg_set_cover.php", "ijax"),
     bindCellPhone : new Interface("/services/ajax_mobile_bind.php", 'ijax'),
     cancelBind    : new Interface("/services/ajax_mobile_remove.php", 'ijax'),
     editPhotoAttr : new Interface("/services/ajax_photo_update.php", "ijax"),
     changeInfo    :new Interface("/upload/ajax_photoedit_post.php", "ijax"),
     delAlbum      : new Interface("/services/ctg_delete.php", "ijax"),
     handleAlbum   : new Interface("/services/ctg_edit.php","ijax"),
     albumInfo     : new Interface("/services/ctg_get_visible.php?format=gsonv","jsload")
     
}

 var getFormElements = function(node){
     var nodes = [];
     for(var i = 0, l = node.childNodes.length; i < l; i ++){
	 if(node.childNodes[i].nodeType == 1){
	     if(/^(input|textarea|select)$/i.test(node.childNodes[i].nodeName)){
		 nodes.push(node.childNodes[i]);
	     }
	     if(node.childNodes[i].childNodes.length > 0){
		 nodes = nodes.concat(arguments.callee.call(null, node.childNodes[i]));
	     }
	 }
     }
     return nodes;
 };

 var switchMemo = function(str,flag){

     if(flag){
	 return str.replace(/(<br>|&nbsp;|&amp;|&lt;|&gt;)/gi, function(b){
	     switch (b.toLowerCase()) {
	     case "<br>":
		 return "\r\n";
	     case "&nbsp;":
		 return " ";
	     case "&amp;":
		 return "&";
	     case "&lt;":
		 return "<";
	     case "&gt;":
		 return ">";
	     }
	 });
     }
     return str.replace(/(&|<|>| |\r\n|\n)/g, function(b){
	 switch(b){
	 case "\r\n":
	 case "\n":
	     return "<br>";
	 case " ":
	     return "&nbsp;";
	 case "&":
	     return "&amp;";
	 case "<":
	     return "&lt;";
	 case ">":
	     return "&gt;";	
	 }
     });
 };

 var get_tagLen = function(thisobj){
     var aList = thisobj.value.replace(/[;；，　 ,]{1,}/g," ").split(" ");
     if (aList.length > 15) {
	 var aTag = aList.splice(0, 15);
	 thisobj.value = aTag.join(" ");
     }
 }

window.callErr = function(code){
     winDialog.alert(
	 $SYSMSG[code],
	 { icon : "01" }
     );
}

function getTimestamp(strFormat){
    //the separatings line can be "-" ,'/' or '.' or else<br />
    var currentTime = new Date();
    var thisYear = currentTime.getFullYear();
    var thisMonth = currentTime.getMonth() + 1 ;
    thisMonth = thisMonth > 9 ? thisMonth : ("0" +thisMonth);
    var today = currentTime.getDate() > 9 ? currentTime.getDate() :("0" +currentTime.getDate());
    var hh = currentTime.getHours();
    var mm = currentTime.getMinutes() > 9 ? currentTime.getMinutes() : ("0" + currentTime.getMinutes());
    var ss = currentTime.getSeconds() > 9 ? currentTime.getSeconds() : ("0" + currentTime.getSeconds());
    return (strFormat.replace(/(y{2,4})/, thisYear).replace('MM', thisMonth).replace('dd', today).replace('hh', hh).replace('mm', mm).replace('ss', ss));
     }

   window.getAuthCode = function(imgID){
	$E(imgID).src = DOMAIN + "/helpers/checkwd_image.php?" + new Date().getTime();
    };
