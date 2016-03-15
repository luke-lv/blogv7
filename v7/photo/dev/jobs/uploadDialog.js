/**
 * @author shaomin | shaomin@staff.sina.com.cn
 * @ desc 这个实例里的所有对话框都是上传图片页面
 */

 $import("sina/sina.js");
 $import("lib/jobs.js");
 $import("sina/core/string/decodeHTML.js");
 $import("sina/core/events/addEvent.js");
$import('sina/utils/limitLength.js');
 $import("sina/core/string/trim.js");
 $import("sina/core/string/format.js");
 $import("lib/dialogConfig.js");

 $import("msg/pageDom.js");
 $import("common/BF.js");
 $import("action/dialogDefine.js");


 $registJob("uploadDialog", function(){
     window.nk_name = scope.visitor.nk_name.length < 1 ? "新浪网友" : scope.visitor.nk_name;
 
     var cellPhoneBind = {
	 content: ' <div class="CP_layercon2 phoneLink">'+
        '<form onsubmit="return false;" id="cellPhoneForm">'+
        '<p class="CP_txtb">将你的手机号码与博客图片进行绑定，你就可以用手机编辑彩信发送到</p>'+
        '<p><strong class="redff">1066888855</strong>，即可直接上传到你的博客图片。</p>'+
        '<div class="phonenum">'+
        '<p class="phonenum_wrone"><strong>请输入手机号码：</strong><input type="text" value="" name="mobile"/></p>'+
        '<p style="display:none;" id="note1" class="ErrTips"><img class="SG_icon SG_icon47" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" align="absmiddle" /> 很抱歉！你的手机号码格式不正确，请输入正确的手机号</p></div>'+
        '<p phonelast="" cp_txtb="" class="">资费说明：<span>新浪不收取任何费用</span>，每条彩信中国移动按当地彩信资费标准收取费用，此业务仅限移动用户使用。</p>'+
        '<div class="r_btn"><a href="javascript:;" id="#{btn1}" class="SG_aBtn SG_aBtnB "><cite>保存</cite></a>&nbsp;&nbsp;<a href="javascript:(function(){bindDialog.hidden()})();" class="SG_aBtn SG_aBtnB "><cite>取消</cite></a></div></form></div>',
	 title: "手机绑定"
     };
  
var bindSucc =   '<div class="CP_layercon2 phoneLink">	'+		
			'<div class="CP_prompt">'+
			'<img class="SG_icon SG_icon203" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="50" height="50" align="absmiddle" />'+
			'<div class="CP_w_cnt SG_txtb"><br />'+
           '{0}，你好，你的手机号码<strong class="SG_clewtxta">{1}</strong>'+
      '已经与你的博客图片绑定成功。<br />通过手机编辑彩信到'+
     '<strong class="SG_clewtxta"> 1066888855 </strong>'+
       ' 就可以将照片直接上传到你的博客图片。</div>'+
    '<p class="CP_w_btns">'+
       '<a class="SG_aBtn SG_aBtnB" href="javascript:(function(){dialog2.hidden()})();"><cite>关闭</cite></a></p>'+
			'</div>'+
	 '</div>';
  
       
  
     
     var cancelSucc =  '<div class="CP_layercon2 phoneLink">'+
                  '<div class="CP_prompt">'+
                     '<img class="SG_icon SG_icon203" align="absmiddle" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="50" height="50"/>'+
		    '<div class="CP_w_cnt SG_txtb">'+
	                '{0}，你好，你的手机号码'+
                        '<strong class="SG_clewtxta">{1}</strong>'+
                        '已经与你的博客图片取消绑定。'+
		   '<br/>'+
                       '你还可以进入博客图片的个人中心重新绑定手机与你的博客图片。'+
                 '</div>'+
                 '<p class="CP_w_btns"> '+
                  '<a href="javascript:(function(){dialog1.hidden()})();" class="SG_aBtn SG_aBtnB"><cite>我知道了</cite></a>'+
                '</p>'+
            '</div>'+
         '</div>';


 
     var cancelBind = '<div class="CP_layercon2 phoneLink">'+			
			'<div class="CP_prompt">'+
			'<img class="SG_icon SG_icon201" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="50" height="50" align="absmiddle" />'+
			'<div class="CP_w_cnt SG_txtb"><br />{0}，你好，你的手机号'+
                        '<strong class="SG_clewtxta">{1}</strong>已经与你的博客图片绑定。<br />'+
                        '<strong>你要取消手机号码与博客图片的绑定吗？</strong></div>'+		
			'<p class="CP_w_btns">'+
                         '<a class="SG_aBtn SG_aBtnB" id="#{btn1}" href="javascript:void(0)">'+
                           '<cite>确定</cite></a>&nbsp;&nbsp;'+
                         '<a class="SG_aBtn SG_aBtnB" href="javascript:(function(){removeDialog.hidden()})();">'+
                           '<cite>取消</cite></a></p></div></div>'  ;
       
     if($E("bindMobile")){
	 Core.Events.addEvent('bindMobile', function(){
	     if (typeof bindDialog == 'undefined') {
		 window.bindDialog = winDialog.createCustomsDialog(cellPhoneBind);
		
		 bindDialog.setMiddle();
 		 bindDialog.show();
		 Utils.limitLength($E("cellPhoneForm").mobile,11);
		 var btns = bindDialog.nodes;
		 Core.Events.addEvent(btns['btn1'],function(){
		     phpENTRY["bindCellPhone"].request({
			 GET: {
			     uid: scope.$uid,
			     mobile: $E("cellPhoneForm").mobile.value
			 },
			 onSuccess: function(res){
			     bindDialog.hidden();
			   
			     window.myNo = res.mobile;
			  
			     if (typeof dialog2 == 'undefined'){
				 window.dialog2 = winDialog.createCustomsDialog(
				     {
					 content:bindSucc.format(nk_name,myNo),
					 title:"绑定成功！"
				     });
				   
			     }else{
				 dialog2.setContent(bindSucc.format(nk_name,myNo));
			     }
			     dialog2.setMiddle();
			     dialog2.show();
			     $E('removeMobileArea').style.display = 'block';
			     $E('bindMobileArea').style.display = 'none';
			 },
			 onError: function(res){
			     $E("note1").style.display = 'inline';
			     $E('cellPhoneForm').mobile.focus();
			     $E("note1").innerHTML = '<img align="absmiddle" title="" alt="" src="http://simg.sinajs.cn/common/images/CP_i.gif" '
				 + 'class="SG_icon SG_icon47"/>' + $SYSMSG[res.code];
			 }
		     });
		 },'click');
	     }else{
		 $E("cellPhoneForm").mobile.value = '';
		 $E("note1").style.display = 'none';
		 bindDialog.show();
	     }
	     return false;
	 }, 'click', false);
	 
     }

	 if($E("removeMobile")){
	     Core.Events.addEvent('removeMobile', function(e){
		
		 if (typeof(myNo) == 'undefined') {
		     myNo = mobile;
		 }  
		
		 if (typeof removeDialog == 'undefined'){		    
		     window.removeDialog = winDialog.createCustomsDialog({
			 content : cancelBind.format(nk_name,myNo),
		         title   : "取消手机绑定"});
		     
		     
		     removeDialog.setMiddle();
		     removeDialog.show();
		     
		 }else{
		     removeDialog.setMiddle();
		     removeDialog.show();
		     removeDialog.setContent(cancelBind.format(nk_name,myNo));
		 }
		 var btns = removeDialog.nodes;
		     Core.Events.addEvent(btns['btn1'],function(){
			 phpENTRY["cancelBind"].request({
			     GET : {
				 uid: scope.$uid
			     },
			     onSuccess: function(res){
				 removeDialog.hidden();
				 if (typeof dialog1 == 'undefined'){
				     window.dialog1 = winDialog.createCustomsDialog({
					 content : cancelSucc.format(nk_name,myNo),
					 title   : "取消手机绑定"
				     });
				 }else{
				     dialog1.setContent(cancelSucc.format(nk_name,myNo));
				 }
				 dialog1.setMiddle();
				 dialog1.show();
				 $E('removeMobileArea').style.display = 'none';
				 $E('bindMobileArea').style.display = 'block';
			     },
			     onError: function(res){
				 removeDialog.hidden();
				 callErr(res.code);
			     }
			 });
		     },'click');
		 return false;
	     }, 'click', false);
	 }

     Core.Events.addEvent('newAlbum', function(){
	 window.moveDialog = winDialog.createCustomsDialog(
	     {
		 content : '<div class="CP_layercon2">'
			       +'<div class="newPhotoItemContent">'
		     +PhotoDom["createAlbum"].format("","","请输入专辑标题","请输入专辑描述","")
		     +'</div></div>',
		 title   : "新建专辑"
	     }
	 );

	 moveDialog.setMiddle()
		.show()
		.addEventListener("hidden",function(){
			this.destroy();
		});
	 Utils.limitLength($E("AlbumForm").albumtitle,50);
	 Utils.limitLength($E("AlbumForm").albumdesc,500);
	 Utils.limitLength($E("encrypt_pwd"),16);
	
     }, 'click', false);
	 
     });
