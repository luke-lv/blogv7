/**
 * @fileoverview 编辑器 绑定msn
 * @author wujian wujian@staff.sina.com.cn
 * @create 2010-12-15 
 */
$import("sina/sina.js");
$import("sina/core/events/addEvent.js");

$registJob("bindTomsn",function(){
	var tEle=$E("bindtomsn");
	if(tEle){
		//http://api.t.sina.com.cn/oauth/authorize?display=popup&from=blog&oauth_token=1e39d3c6fd8fcacf59f395b58790e1db&oauth_callback=http%3A%2F%2Fcontrol.blog.sina.com.cn%2Ft_sina_blog%2Fcallback.php
		Core.Events.addEvent(tEle,function(){
			//trace("cccccc");
			//调用微软的页面 然后回调php的页面 最后 回调js 
			Utils.Cookie.setCookie("artPost","1",1,"/","control.blog.sina.com.cn");
			//setTimeout(function(){
				var url='https://login.live.com/oauth20_authorize.srf?client_id=0000000040046F08&redirect_uri=http%3A%2F%2Fcontrol.blog.sina.com.cn%2Fblog_rebuild%2Fmsn%2FmsnLoginCallBack.php&response_type=code&scope=wl.basic%20wl.signin%20wl.offline_access%20wl.share%20wl.emails';
				window.open(url,'mb', 'toolbar=0,status=0,resizable=1,width=440,height=430,left=' + (screen.width - 440) / 2 + ',top=' + (screen.height - 430) / 2);
			//},500);
			
			//回调
			window.msnOkBack=function(){
				var tEle=$E("bindtomsn");
				//更改显示
				trace("msn绑定回调ok函数！");
				var ele=$C("label");
				ele.innerHTML="已同步Windows Live";
				ele.setAttribute("for","input4");
				
				ele.title="取消连接MSN";
				
				tEle.parentNode.replaceChild(ele,tEle);
				
				Core.Events.addEvent(ele,function(){
					//document.location="http://control.blog.sina.com.cn/blogprofile/msnbind.php";
					window.open("http://control.blog.sina.com.cn/blogprofile/msnbind.php");
				});
				
				var input=$C("input");
				input.id="input4";
				input.type="checkbox";
				input.checked="checked";
				input.disabled="disabled";
				ele.parentNode.insertBefore(input,ele);
				
				//提示用户 绑定完毕
				winDialog.alert("绑定MSN成功", {icon : "03"});	
						
			};
			
			//回调 fail
			window.msnFailBack=function(){
				trace("msn绑定 fail");
				winDialog.alert("网络原因，操作失败<br/>请稍后再试。", {icon : "01"});				
			};
		});		
	}
	//存在label 
	if($E("msnlabel")){
		Core.Events.addEvent($E("msnlabel"),function(){
					window.open("http://control.blog.sina.com.cn/blogprofile/msnbind.php");
		});		
	}
	
	
	
	
	
	
});
