$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/events/stopBubble.js");
$import("lib/tabSwitch.js");
$import("lib/dialogConfig.js");
$import("lib/interface.js");
$import("lib/msg/inviteMSG.js");
$import("product/blogmsg/centertip.js");
$import("sina/utils/limitLength.js");
//验证码添加
$import("lib/checkManager.js");
$registJob('msg_sendpaper',function(){
	var div = $E("sendpaper_contact_div"),
		close = $E("sendpaper_contact_div_close"),		
		tabClassName="contact_tab",
		tabCurrentClassName = "cur",
		//checkManager=new checkManager(),
		btn = $E("sendpaper_contact_div_btn");
	//console.log(new checkManager())
	var checkCodeBox_send={
		id:'#checkCodeBox'
	}
	var checkManager=new Lib.checkManager(checkCodeBox_send);
	if(!div || !close)return;
	//初始化切换	
	 Lib.tabToggether(tabClassName,tabCurrentClassName,'click');
	 close.onclick=function(){
	 	div.style.display="none";
	 }
	 
	 var contact_div = $E("sendpaper_contact_to");
	 var contact = $E("sendpaper_contact_all");
	 var contact_del = $E("sendpaper_contact_del");
	 
	 var contact_id = "";
	 function addContact(uid,nick)
	 {
	 	contact_id = uid;
		nick = nick.replace("<","&lt;");
		nick = nick.replace("<","&gt;");
		contact_div.innerHTML ='<span>'+nick+'<a onclick ="scope.clearTmpccconnact(event);return false;" href="javascript:void(0);"> </a></span>'; 
	 }
	 contact_div.onclick = function()
	 {
	 	div.style.display="";
	 }
	 contact.onclick = function()
	 {
	 	if(div.offsetHeight)
		{
			div.style.display="none";	
		}else
		{
			div.style.display="";
		}	 	
	 }
	 contact_del.onclick = function()
	 {
	 	contact_id = "";
		contact_div.innerHTML ='';
	 }
	 scope.clearTmpccconnact=function(event)
	 {
		Core.Events.stopBubble(event);
	 	contact_id = "";
		contact_div.innerHTML ='';
	 }
	 
	 btn.onclick = function()
	 {
	 	var uid ="";
		var nick = "";
		var arr = div.getElementsByTagName("input");
		for(var i=0;i<arr.length;i++)
		{
			var p = arr[i];
			if(p.type=='radio' && p.offsetHeight&&p.checked)
			{
				uid =p.value;
				nick =p.getAttribute('ninknane');
				break;
			}
		}
		if(!uid || !nick)
		{
			alert("请选择联系人");
			return false;
		}
	 	addContact(uid,nick);
		div.style.display="none";
		return false;
	 }	 
	 /* $E("sendpaper_safelink").href="javascript:void(0)";
	 $E("sendpaper_safe").onclick=function()
	 {
	 	$E("sendpaper_safe").src = $E("sendpaper_safe").src.replace(/\?.*!/,"?"+Math.random());
		return false;
	 }
	 $E("sendpaper_safelink").onclick=function()
	 {	 	$E("sendpaper_safe").src = $E("sendpaper_safe").src.replace(/\?.*!/,"?"+Math.random());
	 		return false;
	 }*/
	 //发送消息
	 $E("sendpaper_submit").onclick=function()
	 {
	 	if(!contact_id)
		{
			alert("请选择联系人");
			return false;
		}
		if(!$E("textarea").value)
		{
			alert("请先填写内容");
			return false;
		}
		/*if(!$E("sendpaper_safecode").value)
		{
			alert("请先填验证码");
			return false;
		}*/
		 if (!checkManager.validate()) {
			 //新版验证码无效，旧版验证码为空
			 showError(checkManager.getErrorCode());
			 return false;
		 }
		//发送纸条
		 var check_vaule=checkManager.validate();
		postContent(contact_id,check_vaule,$E("textarea").value);
		return false;
	 }
	 
	 // 内容输入框获得焦点时候检查剩余字数
	 $E("textarea").contentLength =300;
		Core.Events.addEvent($E("textarea"), function () {			
			if($E("textarea").check)clearInterval($E("textarea").check);
			$E("textarea").check = setInterval(Core.Function.bind2(function (){
				var lengthOfContent = Core.String.byteLength($E("textarea").value);
				var visibleCount = Math.max(0, Math.floor(($E("textarea").contentLength - lengthOfContent)/2));
				$E("invite_limit").innerHTML = "您还可以输入" + visibleCount + "个汉字";
				/**
				if(Math.floor(($E("textarea").contentLength - lengthOfContent)/2) <0)
				{
					if($E("textarea").value != $E("textarea").value.substr(0,$E("textarea").contentLength -1))
					{
						$E("textarea").value = $E("textarea").value.substr(0,$E("textarea").contentLength -1)	
					}					
				}
				**/
				/**
				while(Core.String.byteLength($E("textarea").value)>$E("textarea").contentLength)
				{
					$E("textarea").value = $E("textarea").value.substr(0,$E("textarea").value.length -1);	
				}**/	
			}, $E("textarea")), 500);		
		}, "focus");
		// 内容输入框失去焦点时候停止检查
		Core.Events.addEvent($E("textarea"), function () {
			clearInterval($E("textarea").check);
			$E("textarea").check = null;
		}, "blur");
	 	//做字数限制
        if ($IE) {
			Core.Events.addEvent($E("textarea"),function(){
				var nValue = $E("textarea").value;
                var strLen = Core.String.byteLength(nValue);
                if (strLen > $E("textarea").contentLength) {
                    $E("textarea").value = Core.String.leftB(nValue, $E("textarea").contentLength);
                }
			},'blur');
        }
        else {
            Utils.limitLength($E("textarea"), $E("textarea").contentLength);
        }
		
	 function postContent(uid,safecode,content) {
		var i_addInvite = new Interface("http://control.blog.sina.com.cn/riaapi/profile/messagesend.php", "jsload");
		var param_m = {
			tuid		: uid
			,fuid		: $UID
			,authcode	: safecode
			,content	: content
			,varname	: "addFriendRequest"
			,version	: 7
			,rnd		: new Date().valueOf()
		};
		 var param=null;
		 param=checkManager.getPostData(param_m);
		i_addInvite.request({
			GET : param
			,onSuccess	: function (){
				checkManager.refresh();
				centerTips.show("纸条已发送");
				setTimeout(function(){
					window.location.href="http://control.blog.sina.com.cn/blogprofile/profilepaperlist.php?type=1";
				},2000);
				/**
				winDialog.alert("纸条已发",{
					funcOk:function(){window.location.reload();}
				});
				**/				
			}
			,onError	: function (oData) {				
					var msg = $SYSMSG[oData.code].replace("#{linkNewBlog}", "http://login.sina.com.cn/hd/reg_sec.php?entry=blog");		
					if('A00007' == oData.code)
					{
						winDialog.alert('权限不够',{funcOk: function(){
							window.location.reload();
							return;
						}});
					}else
					{
						if(oData.code == 'A11007')
						{
							winDialog.alert(msg,{funcOk: function(){
							window.location.reload();
							return;
						}});	
						}else
						{
							winDialog.alert(msg);
						}
						
					}
									
			}
			,onFail		: function () {
					winDialog.alert("发送失败请稍候重试");
			}
		});
	}
	 
});







