/**
 * @fileoverview
 *	在开通博客页面执行绑定事件
 * @author zhihan | zhihan@staff.sina.com.cn
 * @version 1.0
 */
$import("lib/openBlog.js");
$import("lib/audioCheck.js");
$import("lib/checkManager.js");
$registJob("openBlogPage", function (){
	if(!$E('blogNameInput')) {
		return;
	}
	var checkCodeBox_openpage={
		id:'#checkCodeBox_openpage'
	}
	var checkManager=new Lib.checkManager(checkCodeBox_openpage);
	checkManager_open_msg=checkManager;
	//blogNameInput 博客名称
	//blogNameError 博客名称错误提示区域
	//blogNameIcon  博客名称输入是否正确提示图片
	//博客名称输入检测
	scope.openBlogNameEvent($E('blogNameInput'),$E('blogNameError'),[],$E('blogNameIcon'));

	//modified xiaoyue3 微博通行证博客昵称统一问题去掉昵称输入框所以昵称监测被注释掉;
	//博客昵称输入检测
	// scope.openBlogLocEvent($E('blogLocInput'),$E('blogLocError'),[],$E('blogLocIcon'));
	
	//清空错误信息
	$E('blogNameError').innerHTML="";
	// $E('blogLocError').innerHTML="";
	
	function showError(ele,str,icon) {
		ele.innerHTML = str;
		ele.style.display = 'block';
		if(ele.id.indexOf("ErrTips")>=0){
			ele.style.visibility="visible";
		}
		if(icon){
			icon.className="SG_icon SG_icon48 tips";
			icon.style.display="";
		}
	}

	//名称 昵称 隐私设置单选框 赋初始值
	// $E('blogNameInput').value=scope.openBlogGetShotName();
	// $E('blogLocInput').value=$nick;
	$E('openAll1').checked=true;
/*    $E('checkword').onfocus = function(){
        if($E('checkwordErr').innerHTML.length > 0) {
           $E('checkwordErr').innerHTML = '';
            this.value = '';
        }
    }
    $E('code_img').onclick = function(){
        this.src = 'http://interface.blog.sina.com.cn/riaapi/checkwd_image.php'+ '?t='+ +new Date();
    }*/
	$E('openBlogOkBtn').onclick = function() {
		if($E('blogNameInput').value === '') {
			// if($E('blogNameInput').value === '') {
				showError($E('blogNameError'), '博客名称不能为空', $E('blogNameIcon'));	
			// }
			// if($E('blogLocInput').value === '') {
			// 	showError($E('blogLocError'), '博客昵称不能为空', $E('blogLocIcon'));	
			// }
			return;
		}

        if(!checkManager.validate()) {
				if(!$E('comment_check_img')){
					winDialog.alert('请拖动滑块儿开始验证');
				}else{
					winDialog('验证码不能为空');
				}
            return;
        }

		scope.openBlogWhenOpenBlog({
			'nameErrorEle' : $E('blogNameError')
			// ,'locErrorEle' : $E('blogLocError')
			,'nameOkIcon' : $E('blogNameIcon')
			// ,'locOkIcon' : $E('blogLocIcon')
			// ,'openName' : ($E('blogNameInput').value || scope.openBlogGetShotName())
			,'openName' : $E('blogNameInput').value
			// ,'openLoc' : $E('blogLocInput').value
			,'isprivate' : $E('openAll1').checked?0:1
			,'errorEle':$E("ErrTips")
           // ,'checkword' : $E('checkword')
           // ,'errorCheckword' : $E('checkwordErr')
			,'okCallback' : function(){
				//清除flash cookie存储的unread缓存
				//Lib.LocalDB前边已经加载
				Lib.LocalDB.clearCache(1,"uid_"+$UID+"unread");
				//modified xiaoyue3@staff 开通成功后跳转至个人中心页 

//				window.location.href='http://blog.sina.com.cn/u/'+$UID;
				window.location.href = "http://i.blog.sina.com.cn/blogprofile/index.php?atten=1";
			}
		});
		return false;
	}
});
