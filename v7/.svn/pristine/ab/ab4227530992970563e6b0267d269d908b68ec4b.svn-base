/*
 @ author shaomin |shaomin@staff.sina.com.cn|607
 @ desc  we define every photo as a object,this is better to manage and orgnize.
         It is extended from Father ,the super object 
         but we name it instead of super because "super" is a keyword
*/


$import("sina/sina.js");
$import("sina/core/class/define.js");
$import("sina/core/function/bind2.js");
$import("sina/core/function/bind3.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/getElementsByAttr.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/dom/addHTML.js");

$import("sina/core/string/format.js");
$import("sina/core/string/stringBuffer.js");
$import("sina/core/system/br.js");
$import('sina/utils/limitLength.js');

$import('lib/dialogConfig.js');
$import('lib/interface.js');
$import("msg/transcode.js");
$import("msg/pageDom.js");

$import("common/Father.js");
$import("common/BF.js");
$import("action/dialogDefine.js");
$import("common/Category.js");


 var Photo = Core.Class.define(Father,Father,{
     type : "photo" 
 });


Photo.prototype.createObj = function(tags){
     for(var i=0;i<tags.length;i++){
	 var oTag = {};
	 oTag.Panel = $E(tags[i]+"_"+this.id);
	 oTag.button = $E(tags[i]+"_button_"+this.id);
	 oTag.panelId = tags[i]+"_"+this.id;
	 oTag.defaultTXT = "请输入图片{0}";
	 Core.Events.addEvent(oTag.button,Core.Function.bind3(function(tag,id){   
	     this.modifyPanel(tag,id);
	 },this,[tags[i],this.id]),'click',false);
	 this.tags[tags[i]] = oTag;
     }   
     return this;
};

	 
 Photo.prototype.initBtnPanel = function(myid,albumid){ 
    
     var atags = $E(this.btnPanel).getElementsByTagName("a");
     var atagLen = atags.length;
   
     for(var i=0;i<atagLen;i++){
	 var oTag = atags[i];

	 switch(oTag[$IE?"innerText":"textContent"]){
	 case "转移专辑" :
	     Core.Events.addEvent(oTag,function(){		 
		 this.moveCtg(this.fatherID);
		 try{
		    Core.Events.stopEvent();
		 }catch(e){
		     
		 }
	     }.bind2(this),'click',false);	     
	     break;
	 case "设封皮":
	     Core.Events.addEvent(oTag,function(){		
		 this.setCover();
	     }.bind2(this),'click',false);
	     break;
	 case "删除":
	     Core.Events.addEvent(oTag,function(){
		 this.deletePhoto();
	     }.bind2(this),'click',false);	     
	     break;
	 case "旋转":
	     Core.Events.addEvent(oTag,function(){
		 this.rotateImg();
	     }.bind2(this),'click',false);	     
	     break;
	 default :
	     break;
	 }
     }
 };


 var currentPanel = [];

 Photo.prototype.getTpl = function(tag){
   
     if(scope.$pageid == "photo")
	 return  tag == 'memo' ? PhotoDom['memo'].format('ptedit_inputtxt') 
	      : PhotoDom['title'].format('ptedit_input');
   
     return  tag == 'memo' ? PhotoDom['memo'].format('ptlist_inputtxt') 
	 : PhotoDom['title'].format('ptlist_input');
 };

Photo.prototype.modifyPanel = function(tag,myid){
     var _self = this.tags[tag];
     var panelId = this.tags[tag].panelId;
     var contentHtml = this.getTpl(tag);
     _self.phpENTRY = phpENTRY.editPhotoAttr;
     show();
 
     function show(){
	 if($E("modify_" + panelId)){
 
	     _self.Content = $E("modify_" + panelId);
	     _self.Content.id = "modify_" + panelId;
	     _self.input = getFormElements(_self.Content)[0];
	     _self.output = Core.Dom.getElementsByAttr(_self.Panel, "isvalue", "1")[0];
	 } else{
	     _self.Content = document.createElement('div');
	     _self.Content.id = "modify_" + panelId;
	     _self.Panel.parentNode.insertBefore(_self.Content, _self.Panel);
	     Core.Dom.addHTML(_self.Content, contentHtml);
	     _self.ErrorPanel = Core.Dom.getElementsByClass(_self.Content,"p","ErrTips")[0];
	     _self.BtnArea = Core.Dom.getElementsByClass(_self.Content,"p","pt_list_btn")[0];
	     _self.input = getFormElements(_self.Content)[0];
	     switch (tag) {
	     case 'title' :
		 	Utils.limitLength(_self.input,50);
	     case 'tag' :
		 Core.Events.addEvent(_self.input,
				      function(e){
					  var self = e.target || e.srcElement;
					  get_tagLen(self);
				      },
				      'keyup',
				      false
				     );
		 	break;
	     case 'memo' :
		 	Utils.limitLength(_self.input, 500);
		 	break;
	     default : break;
	     }   
	     
	     _self.output = Core.Dom.getElementsByAttr(_self.Panel, "isvalue", "1")[0];
	     _self.input.id = "input_" + panelId;
	     _self.output.id = "output_" + panelId;
	     _self.Panel.style.display = "none";
	    
	  
	     Core.Events.addEvent(_self.BtnArea.getElementsByTagName("a")[0], update, "click", false);
	     Core.Events.addEvent(_self.BtnArea.getElementsByTagName("a")[1], hide, "click", false);
	 }
	 _self.ErrorPanel.style.display = "none";
	
	 if(currentPanel[0] === undefined){
	     currentPanel = [_self.Panel.id,_self.Content.id];
	 } else if(currentPanel[0] != _self.Panel.id){
	     $E(currentPanel[0]).style.display = "block";
	     $E(currentPanel[1]).style.display = "none";
	     currentPanel = [_self.Panel.id,_self.Content.id];
	 }
	 _self.Panel.style.display = "none";
	 _self.Content.style.display = "block";
	 if (_self.input.tagName.toLowerCase() == "input") {
	     _self.input.value = _self.output[$IE ? "innerText" : "textContent"];
	 }
	 else {
	     _self.input.value = switchMemo(_self.output.innerHTML,true);
	 }
	 _self.input.focus();

     }
     function hide(){
	 _self.input.blur();
	 _self.Panel.style.display = "block";
	 _self.Content.style.display = "none";
     }
     function update(evt){
	 var myValue = _self.input.value.replace(/(^ *| *$)/g,'');
	
	 var defultTXT = _self.defaultTXT.format(tag == "title" ? "标题" :"描述");
	 if ((_self.output[$IE ? "innerText" : "textContent"] == myValue)
	     ||(_self.output[$IE ? "innerText" : "textContent"] == defultTXT && myValue == "")){
	     hide();
	     return;
	 }

	 _self.phpENTRY.request({
	     POST : {
         "uid" : scope.$uid,
		 "do" : tag,
		 "pic_id" : myid,
		 "value" : myValue
	     },
	     onSuccess : function(res){		
		 if(tag == 'tag'){
		     var abc = new Core.String.StringBuffer();
		     for(var i =0 ;i<res.length;i++){
			 abc.append("<a target='_blank' href='http://uni.sina.com.cn/c.php?t=album&stype=tag&k=");
			 abc.append(res[i].tagCode.replace(/(^ *| *$)/g,''));
				    abc.append("'>");
				    abc.append(res[i].tagName.replace(/(^ *| *$)/g,''));
				    abc.append("</a>");
				    if(i < res.length - 1)
					abc.append("  ");
				   }
		
		     _self.output.innerHTML = abc.toString();
		     hide();
		 }
		 else{
		     if(myValue.length < 1){
			 _self.output[$IE?"innerText":"textContent"] =
			     _self.defaultTXT.format(tag == "title" ? "标题" :"描述");	     
		     }else{
			 _self.output.innerHTML = switchMemo(myValue,false);
		     }
		 }
		 hide();
	     },
	     onError : function(res){
		 _self.ErrorPanel.style.display = "";
		 _self.ErrorPanel[$IE?"innerText":"textContent"]= $SYSMSG[res.code];
		 
	     }
	 });
     }
    
 } ;   



 Photo.prototype.deletePhoto = function(){
     var id = this.id;
	 var fatherId = this.fatherID;
     winDialog.confirm("是否要删除此图片？删除后不可恢复。",{
	 //subText:"删除后不可恢复",
	 textOk : "是",
	 textCancel : "否",
	 icon : '04',
	 funcOk : function(){	       
	     phpENTRY["delPhoto"].request({
		 GET : {
             uid : scope.$uid,
		     pic_id : id
		 },
		 onSuccess : function(res){
		     if (scope.$pageid == 'photo'){
				 document.location.href = DOMAIN +"/category/u/" + scope.$uid + "/s/" +fatherId;
				 
		     }else{
				 document.location.reload();
		     }	     
		 },
		 onError : function(res){
		     callErr(res.code);
		 }
	     })
	 }
     });
 };

 Photo.prototype.setCover = function(){
     var id = this.id,fatherID = this.fatherID;
     phpENTRY["setCover"].request({
	 GET : {
	     ctg_id : fatherID,
	     pic_id : id,
	     uid : scope.$uid
	 },
	 onSuccess : function(res){
	     winDialog.alert(
			 '专辑封皮设置成功！',
			 { icon : "03" 
			 }
	     );
		
	     if($E("category_cover_" + fatherID)){
			 $E("category_cover_" +  fatherID).src = res;
	     }else{
		 try{
		     $callJob("list4Left");
		 }catch(e){}
	     }
		 return false;
	 },
	 onError : function(res){
	     callErr(res.code);
	 return false;
	 }
	
     });     
 };


 Photo.prototype.moveCtg = function(fatherID){
     var mylist = [];

     window.moveDialog = winDialog.createCustomsDialog(PhotoDom["moveAlbum"]);
     moveDialog.setMiddle()
     	.show()
		.addEventListener("hidden",function(){
			this.destroy();
		});
     window.picId = this.id;
   
    Core.Events.addEvent($E('moveBtn'),function(){
		if( $E("moveContent").style.display != 'none')
			return;
		$E("moveContent").style.display = '';
		$E("newContent").style.display = 'none';
		$E("moveBtn").className = 'cur';
		$E("newBtn").className = '';
     },'click');

     Core.Events.addEvent($E('newBtn'),function(){

		// if($E("newContent").style.display != 'none')
		//	 return;
		 $E("newContent").style.display = '';
		 $E("moveContent").style.display = 'none';
		 $E("moveBtn").className = '';
		 $E("newBtn").className = 'cur';
		 $E("newContent").innerHTML = PhotoDom["createAlbum"].format('',picId,'请输入专辑标题','请输入专辑描述','');
	      Utils.limitLength($E("AlbumForm").albumtitle,50);
	      Utils.limitLength($E("AlbumForm").albumdesc,500);

	     Utils.limitLength($E("encrypt_pwd"),16);
		
		//董艳妹妹说要改转移专辑的样式
		Core.Events.addEvent($E("AlbumForm").albumtitle,function(){
			if(Core.String.trim($E("AlbumForm").albumtitle.value)!='请输入专辑标题'){
				$E("AlbumForm").albumtitle.style.color="";
			}else{
				$E("AlbumForm").albumtitle.style.color="#999999";
			}
     	},'blur');
		
		Core.Events.addEvent($E("AlbumForm").albumdesc,function(){
			if(Core.String.trim($E("AlbumForm").albumdesc.value)!='请输入专辑描述'){
				$E("AlbumForm").albumdesc.style.color="";
			}else{
				$E("AlbumForm").albumdesc.style.color="#999999";
			}
     	},'blur');
	 
     },'click');
	
	
	 
	
    var cd = {
	  pagerType   :  2,
	  currentTpl  : 'moveOne',
	  pagerNode   : 'mPager',
	  listLayer   : $E("moveList"),
          pageNum     : 10
     }
     var ctg = new Category(cd);
     ctg.getList("all",function(){
	 for(var i=0;i<ctglist.length;i++){
	     var cate = ctglist[i];    
	     if( cate.ctg_id == fatherID)continue;
	     mylist.push(cate);
	 }
	 window.movelist = ctg.initCfg.currentList = mylist;
	 ctg.createPager(1);
	 ctg.applyHtml(1);
	 
     });
    
     

 }
