/**
 * @fileoverview 提示访问权限
 * @author meichun1@staff.sina.com.cn
 * @date 11:10 2010/9/29
 *
 */
$registJob("permission", function(){
    if (!$isLogin) {
    
        $E("loginli").style.display = "block";
        
        Core.Events.addEvent("perOutLogin", function(){
        
            new Lib.Login.Ui().login();
            
        });
        
        //默认登录成功后只刷新本页面，这里设置为转到个人博客首页,修改成功后的callback.
        Lib.Login.Ui.prototype.onShow = function(){
            this.callback = function(){
                location.replace("http://blog.sina.com.cn/u/" + $UID);
            };
            
        };
		
		
    }
	if(location.search.slice(5)=== $UID){
		
		location.replace("http://blog.sina.com.cn/u/" + $UID);
	}
    
});
