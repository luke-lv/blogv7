/*
 @ author shaomin |shaomin@staff.sina.com.cn|6207
 @ desc  we define every album is a Class,that is good to manage and orgnize.
         It is extended from BF(short for Base Function)

*/

 $import("sina/sina.js");
 $import("sina/core/system/br.js");
 $import("lib/dialogConfig.js");
 $import("sina/core/class/define.js");
$import('sina/utils/limitLength.js');
 $import("sina/core/string/format.js");
 $import("sina/core/function/bind2.js");
 $import("sina/core/events/addEvent.js");
 $import("common/BF.js");
 $import("common/Father.js");
 $import("action/dialogDefine.js");
 $import("msg/pageDom.js");
 
 var Album = Core.Class.define(Father,Father,{
     type : "Album"
 });


 Album.prototype.initBtnPanel = function(myid){
     var atags = $E(this.btnPanel).getElementsByTagName("a");
     var atagLen = atags.length;
     for(var i=0;i<atagLen;i++){
	 var oTag = atags[i];

	 switch(oTag[$IE?"innerText":"textContent"]){
	 case "[编辑]":
	     Core.Events.addEvent(oTag, this.editAlbum.bind2(this),'click',false);
	     break;
	 case "[删除]":
	     Core.Events.addEvent(oTag, this.deleteAlbum.bind2(this),'click',false);	     
	     break;
	 default :
	     break;
	 }
     }
 };



 Album.prototype.deleteAlbum = function(){
     var ctgId = this.id;
     winDialog.confirm("是否要删除此专辑？删除后不可恢复。", {
	 //subText : '删除后此专辑的图片也会消失，不可恢复。',
	 textOk:'是',
	 textCancel : '否',
	 icon : '04',
	 funcOk : function(){
	     phpENTRY["delAlbum"].request({
		 GET : {
		     ctg_id : ctgId,	
		     uid    : scope.$uid
		 },
		 onSuccess : function(res){			
		     if(typeof ctg_id !="undefined" && ctgId == ctg_id){
				 document.location.replace(DOMAIN+ "/u/" + scope.$uid);
				 return;
		     }
		     window.location.reload();
		 },
		 onError : function(res){
		     callErr(res.code);
		 }
	     });
	 }
     });
 };


 Album.prototype.editAlbum = function(){
     var thisId = this.id;
     try{
     	 Core.Events.stopEvent();
     }catch(e){
	 
     }
     phpENTRY["albumInfo"].request({
	 GET : {
	     uid    : scope.$uid,
	     ctg_id : thisId
	 },
	 onSuccess : function(res){
	     var memo = res.memo.length <  1 ? "请输入专辑描述" : switchMemo(res.memo,true);
	     var title = switchMemo(res.category,true);
	      window.moveDialog = winDialog.createCustomsDialog(
		 {
		     content : '<div class="CP_layercon2">\
			       <div class="newPhotoItemContent">'
                         +PhotoDom["createAlbum"].format(thisId,"","",memo,res.password)
                              +'</div></div>',
		     title   : "修改此专辑"
		 }
	     );
	     if(res.is_def){
		 $E("AlbumForm").albumtitle.disabled = true;		 
	     }
	  
	     moveDialog.setMiddle()
			 .show()
			 .addEventListener("hidden",function(){
			 	this.destroy();
			 });
	     $E("AlbumForm").albumtitle.value = title;
	     Utils.limitLength($E("AlbumForm").albumtitle, 50);
	     Utils.limitLength($E("AlbumForm").albumdesc, 500);
	     
	     if(res.encrypt == 'friends'){
		 $E("rdo2").checked = true;
		 $E("encrypt_pwd").style.display = '';
		 
		 $E("AlbumForm").is_pw.value = '1';
	     }else{
		 $E("rdo1").checked = true;
		 $E("AlbumForm").is_pw.value = '0';
	     }
	   
	     Utils.limitLength($E("encrypt_pwd"),16);
	 },
	 onError : function(res){
	     callErr(res.code);
	 }
     });
 };
