/**
 * @author shaomin | shaomin@staff.sina.com.cn
 * @ desc 上传图片
 * @ Date 2008-9-27
 */
 $import("sina/sina.js");
 $import("lib/jobs.js");
$import("lib/panel.js");
 $import("sina/core/events/addEvent.js");
 $import("sina/core/system/br.js");
 $import("action/PhotoUploader.js");

 $registJob("uploadPics",function(){   
     var numName = ['一','二','三','四','五','六','七','八','九','十'];
     var myTable = $E("uploadArea");
     var childNodesLen = myTable.getElementsByTagName("tr").length;
     var temValue = childNodesLen;
     for(var i=1;i<=childNodesLen;i++){
	 Core.Events.addEvent($E("pic"+i),
			      function(e){
				  var _self = e.srcElement || e.target;
				  SinaPhotoUploader.previewPic(_self.id);
			      },
			      'change',
			      false
			     );
 	 
     }	    
     
     Core.Events.addEvent("go_on",function(e){
	 $E('upload_6_files').style.display = '';
	 $E('go_on').style.display = 'none';
	 var myTable = $E("upload_6_files").getElementsByTagName("tbody")[0];
	 var childNodesLen = myTable.getElementsByTagName("tr").length;
	 for (var i = 6; i <= childNodesLen+5; i++){
	     Core.Events.addEvent($E("pic" + i),function(e){
				      var _self = e.srcElement || e.target;
				      SinaPhotoUploader.previewPic(_self.id);			      
				  },
				  'change',  
				  false
				 );
	 }
     },'click',false);
     
     Core.Events.addEvent("bt_upload", function(e){
	 SinaPhotoUploader.Start();
	 return false;
       },
      'click',
      false
     );

 });

