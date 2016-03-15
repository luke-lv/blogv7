/**
 * @fileoverview 添加手机订阅
 * @author dg.liu | dongguang@staff.sina.com.cn
 * @created 2009-11-11
 */
$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/events/stopEvent.js");

$import("lib/dialogConfig.js");
$import("lib/interface.js");
$import("lib/checkAuthor.js");
$import("lib/showError.js");
$import("lib/msg/phone_attention.js");
$import("sina/core/events/getEventTarget.js");
$import("lib/login/loginPost.js");
$import("lib/sendLog.js");

/**
 * 手机订阅
 */
scope.PhoneAttentionAdd = Core.Class.create();
scope.PhoneAttentionAdd.prototype = {

    initialize: function(){
    },
    add: function(fuid){
		try{
			Core.Events.stopEvent();
		}catch(e){}
        fuid = fuid || scope.$uid;
        if (!this.addInterface) {
            this.addInterface = new Interface("http://control.blog.sina.com.cn/admin/iphoneattention/attention.php", "jsload");
        }
        Lib.checkAuthor();
        if (!$isLogin) {
        	v7sendLog('48_01_31');
            new Lib.Login.Ui().login(Core.Function.bind3(this.request, this, [fuid]),false,"referer:"+location.hostname+location.pathname+",func:0005");	//添加统计点，手机订阅 0005
        }else{
			this.request(fuid);
		}

    },
    request: function(fuid){
        this.addInterface.request({
            GET: {
                fuid: fuid
            },
            onSuccess: function(data){
                var msg='手机订阅成功！若此人有新博文发布，我们会短信提醒你。" <br/><span style="font-weight: 100; font-size: 12px;"><a target="_blank" href="http://i.blog.sina.com.cn/blogprofile/profilephone.php">管理我的手机订阅</a>>></span>';
				winDialog.alert(msg,{
					icon: "03",
				    funcOk: function(){
						if(scope.$pageid == "profile_phone" || scope.$pageid == "profile_attention"){
							window.location.reload();
						}
					}
				});	
            },
            onError: function(data){
				if(data.code=="B24007"){
					window.location.href = "http://i.blog.sina.com.cn/blogprofile/profilephone.php";
				} else if(data.code == 'B24016') {
					var msg = '你还没有开通博客，现在立即开通？';
					winDialog.confirm(msg,{
						icon: '04',
						textOk: "是",
						textCancel: "否",
						funcOk:function() {
							window.open('http://control.blog.sina.com.cn/reg/reg_blog.php?version=7');
						}
					});
				} else{
					showError(data.code);
				}
            },
            onFail: function(){
            }
        });
    }
};
