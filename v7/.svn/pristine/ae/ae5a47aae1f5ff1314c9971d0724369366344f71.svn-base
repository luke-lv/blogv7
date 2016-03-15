/**
 * @fileoverview 编辑器绑定到微博
 * @author wujian wujian@staff.sina.com.cn
 * @create 2010-12-15
 */
$import("sina/sina.js");
$import("sina/core/events/addEvent.js");
$import("lib/dialogConfig.js");

$import("sina/core/dom/insertAfter.js");
$import("/sina/core/dom/insertHTML.js");
$import("sina/core/dom/getXY.js");
$import("/sina/core/dom/removeNode.js");

$registJob("bindToTSina",function(){
	//通过弹出小窗口  实现 基本参照个人中心的相关代码
	var tEle=$E("bindtot");
	if(tEle){//存在绑定按钮
		//http://api.t.sina.com.cn/oauth/authorize?display=popup&from=blog&oauth_token=1e39d3c6fd8fcacf59f395b58790e1db&oauth_callback=http%3A%2F%2Fcontrol.blog.sina.com.cn%2Ft_sina_blog%2Fcallback.php
		Core.Events.addEvent(tEle,function(){
			
			//从php的页面 中转到微博 然后 php 最后 回调js 
			var url='http://control.blog.sina.com.cn/t_sina_blog/bind_weibo_form.php?from=js';
			window.open(url,'mb', 'toolbar=0,status=0,resizable=1,width=440,height=430,left=' + (screen.width - 440) / 2 + ',top=' + (screen.height - 430) / 2);
			
			//回调 ok
			window.tOkBack=function(){
				trace("微博绑定 ok");
				
				var tEle=$E("bindtot");
				//更改显示
				trace("微博绑定回调ok函数！");
				var ele=$C("label");
				ele.innerHTML="已同步到新浪微博";
				ele.setAttribute("for","input3");
				
				ele.title="取消微博绑定";
				
				tEle.parentNode.replaceChild(ele,tEle);
				
				Core.Events.addEvent(ele,function(){
					//document.location="http://control.blog.sina.com.cn/blogprofile/bind_t_sina_blog.php";
					window.open("http://control.blog.sina.com.cn/blogprofile/bind_t_sina_blog.php");
				});
				
				var input=$C("input");
				input.id="input3";
				input.type="checkbox";
				input.checked="checked";
				input.disabled="disabled";
				ele.parentNode.insertBefore(input,ele);
				
				//提示用户 绑定完毕
				winDialog.alert("绑定微博成功", {icon : "03"});		
			};
			
			//回调 fail
			window.tFailBack=function(){
				trace("微博绑定 fail");
				winDialog.alert("网络原因，操作失败<br/>请稍后再试。", {icon : "01"});
				
				
				
			};
		});
		
		
	}
	function openurl(){
		window.open("http://control.blog.sina.com.cn/blogprofile/bind_t_sina_blog.php");
	}
	//存在label 
	if($E("tlabel")){
		Core.Events.addEvent($E("tlabel"),function(){
			window.open("http://control.blog.sina.com.cn/blogprofile/bind_t_sina_blog.php");
		});	
		
		// var div = $C("a");
		// var pos = Core.Dom.getXY($E("input3"));

		// div.style.width = "12px";
		// div.style.height = "12px";
		// div.style.left = pos[0] + "px";
		// div.style.top = pos[1] + "px";
		// div.style.position = "absolute";
		// div.style.cursor = "pointer";
		// div.style.zIndex = "99999";
		// div.style.display = "block";
		// div.style.backgroundImage = "url('http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif')";
		
		// div.setAttribute("href", "http://control.blog.sina.com.cn/blogprofile/bind_t_sina_blog.php");
		// div.setAttribute("target", "_blank");
		
		// document.body.appendChild(div);		
	}

	if($E("mlabel")){
		Core.Events.addEvent($E("mlabel"),function(){
			window.open("http://control.blog.sina.com.cn/blog_rebuild/profile/controllers/bindwemeet.php");
		});
	}

});
