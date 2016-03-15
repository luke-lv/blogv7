/**
 * @fileoverview 留言板发留言登录
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-25
 * @modified dcw1123 | chengwei1@staff.sina.com.cn | 2010-03-03
 */
$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/utils/cookie/getCookie.js");

$import("lib/dialogConfig.js");
$import("lib/interface.js");

$import("msg/guestBook.js");
$import("lib/login/loginPost.js");
$import("lib/checkAuthor.js");
$import("lib/uic.js");
/**
 * 留言板发留言登录类
 */
scope.GuestBookLogin=Core.Class.create();
scope.GuestBookLogin.prototype = {
	
	/**
	 * 登录请求对象
	 */
	loginPost:null,
	
	/**
	 * 用户名输入框
	 */
	txtUserName:null,
	
	/**
	 * 密码输入框
	 */
	txtPassword:null,
	
	/**
	 * 验证码输入框
	 */
	txtCheckCode:null,
	
	/**
	 * 验证码图片
	 */
	imgCheckCode:null,
	
	/**
	 * 验证码显示区域
	 */
	divCheckCode:null,
	
	/**
	 * 是否有登录错误
	 */
	isError:false,
	
	/**
	 * 登录接口对象
	 */
	interfaceLogin:null,
		
	/**
	 * 初始化
	 */
	initialize:function(){
		this.renderLogin();
		this.interfaceLogin={};
		this.txtUserName=$E("txtMessageUserName");
		this.txtPassword=$E("txtMessagePassword");
		this.imgCheckCode=$E("comment_check_img");
		this.divCheckCode=$E("checkdiv");
		this.txtCheckCode=$E("txtMessageCehckCode");
		this.updateLoginForm();
	},
	
	/**
	 * 更新登录表单
	 */
	updateLoginForm:function(){
	},
	
	/**
	 * 重新载入验证码
	 */
	reloadCheckImage:function(){
	},
	
	/**
	 * 清除表单内容
	 */
	clearForm:function(){
		if($E("guestBookLoginForm")){
			this.renderLogin();
		}
		this.txtUserName.value = "";
		this.txtPassword.value = "";
		this.txtCheckCode.value = "";
	},
	
	/**
	 * 判断并渲染登录（留言区）
	 */
	renderLogin:function(){
		Lib.checkAuthor();
		if($isLogin){
			//$E("loginnamespan").parentNode.style.display="none";
			Lib.Uic.getNickName([$UID], function(nick){
				if($E("nickname") != null){
                    var vHTML = Lib.blogv.getVHTML(scope.loginUserWtype);
                    var _nick = nick[$UID]
                    if (_nick) {
                        _nick = _nick + "&nbsp;" + vHTML;
                    }
					$E("nickname").innerHTML = _nick || "";
					$E("nickname").style.display="";
				}
			});
		}
	},
	
	/**
	 * 登录
	 */
	login:function(){
		this.submit();
	},
	
	/**
	 * 提交登录数据
	 */
	submit: function(){
		var _this=this;
		var errMsg="";
		var loginReq = new Lib.Login.LoginPost(function(data){
			if(data.result){						//login successful
				_this.callBack();
			}else{									//login error
				switch(data.errno){
					case "5":
					case "2091":
					case "80":
					case "101": errMsg = "请输入正确的登录名或密码"; break;
					case "4010": errMsg = "账户尚未确认，请先在邮箱确认"; break;
					default: errMsg = "登录失败，请重试。"; break;
				}
				winDialog.alert(errMsg,
					{ icon : "02" }
				);
			}
		},false,"referer:"+location.hostname+location.pathname+",func:0009");		//统计点，留言 0009
		loginReq.login(_this.txtUserName.value, _this.txtPassword.value);
		return false;
	},
	
	/**
	 * 登录成功后的回调方法
	 */
	callBack:function(){
	}
};

