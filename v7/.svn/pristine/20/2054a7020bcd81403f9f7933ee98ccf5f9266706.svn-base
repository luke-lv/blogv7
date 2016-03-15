/* @ author shaomin|shaomin@staff.sina.com.cn
 @ desc 加密专辑验证
 
 

*/
 $import("lib/jobs.js");
 $import("lib/sysmsg.js");
 $import("lib/interface.js");
 $import("lib/dialogConfig.js");
 $import("sina/core/dom/getElementsByClass.js");
 $import("sina/core/string/trim.js");
 $import("sina/core/events/addEvent.js")
 $import("sina/utils/cookie/getCookie.js");
 $import("msg/transcode.js");
 $import("common/BF.js");
 $import("sina/utils/form/sinput.js");

 window.encrypt = {
     checkKey : function(ctg_id){
	 var encrypt1 = {content : '<form name="keyform"><div class="CP_layercon1">'+		
		'<div class="writeSpecialSn">'+
			'<div class="row1">输入专辑密码：<input type="password" class="fm1" name="pwd" onkeydown="encrypt.checkEnter(event,\''+ctg_id+'\')"/></div>'+
			'<div class="ErrTips" id="pwdErr" style="display:none;">密码错误</div>'+
			 '<div class="row1" id="chkcode" style="display:none;"> 验 证 码：<input type="text" style="width: 50px;" class="fm1" name="authcode" maxLength="4"/> <img width="51" height="16" align="absmiddle" id="authImg" src="http://photo.blog.sina.com.cn/helpers/checkwd_image.php" onclick="getAuthCode(\'authImg\')"/></div><div class="ErrTips" id="authErr" style="display:none;">请输入密码</div>'+
			 '<div class="btn"><a href="javascript:encrypt.checkEncryptKey(\''+ctg_id+'\');" class="SG_aBtn SG_aBtnB"><cite>确定</cite></a>  <a href="javascript:void(encryptDialog.hidden());"" class="SG_aBtn SG_aBtnB"><cite>取消</cite></a></div>'+
		'</div>'+
		'</div></form>',
	     title:"输入专辑密码"
}

     
     window.createDialog = function(){
	var abcdesfgsadas = '';
	 if(typeof encryptDialog != "undefined"){
	    // encryptDialog.setContent(encrypt1.html);
	     encryptDialog.setMiddle();
	     encryptDialog.show();
	     $E('pwdErr').style.display = "none";
	     $E('authErr').style.display = "none";
	     document.forms["keyform"].pwd.value = "";
	     document.forms["keyform"].authcode.value = "";
	     
	 } else{
	     window.encryptDialog = winDialog.createCustomsDialog(encrypt1);
	     encryptDialog.setMiddle();
	     encryptDialog.show();
	 }
	  Utils.Form.limitMaxLen(document.forms["keyform"].pwd,16);
	 if(Utils.Cookie.getCookie("__PicNeedVcode")!== undefined 
	    && parseInt(Utils.Cookie.getCookie("__PicNeedVcode")) >= 3){
	     $E("chkcode").style.display = "block";
	 }
     };
     setTimeout(createDialog, 3);
     
 },

 
 checkEnter : function(event, ctg_id){
 
     var evt = window.event || event;
  
     if(evt.keyCode == 13){
	 this.checkEncryptKey(ctg_id);
     }
 },

 checkEncryptKey : function(ctg_id){
   
     var keyform = document.forms["keyform"];
      if(keyform.pwd.value.length < 1){
	
	 $E("pwdErr").style.display = 'block';
	 $E("pwdErr").innerHTML = "请输入密码。";
	 return;
     }
     phpENTRY['validatePw'].request({
	 GET : {
	     uid : scope.$uid,
	     ctg_id : ctg_id,
	     pw : keyform.pwd.value,
	     vcode : keyform.authcode.value
	 },
	 onSuccess: function(res){
	     encryptDialog.hidden();
	     window.location.href = DOMAIN+"/category/u/"+scope.$uid+"/s/"+ctg_id;
	 },
	 onError: function(res){
	     $E("pwdErr").style.display = 'none';
	     $E("authErr").style.display = 'none';
	     $E(res.data+"Err").style.display = "block";
	     $E(res.data+"Err").innerHTML = $SYSMSG[res.code];
	     if(parseInt(Utils.Cookie.getCookie("__PicNeedVcode")) >= 3){
		 $E("chkcode").style.display = "block";
   	     }
	     getAuthCode('authImg');
	 }
     });
 }	
 };
