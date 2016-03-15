/**
 * 消息评论页面
 */
$import("tempLib/magicFace/magicFace.js");
$registJob("msg_commtrash", function(){
    var commonds = ['恢复','黑名单'];    
    var eles = scope.msg_panel.getNodes();
    scope.msg_panel.report=function()
    {      
      report(scope.msg_panel.commentId);
	  return false;
    }  
	scope.msg_panel.recover = function()
	{
		commentResume(scope.msg_panel.commentId);
		return false;
	}
	
    //绑定恢复按钮事件
    eles['recover'].parentNode.style.display="";
    Core.Events.addEvent(eles['recover'],scope.msg_panel.recover);
    //绑定举报按钮事件
	/**
    eles['report'].parentNode.style.display="";
    Core.Events.addEvent(eles['report'],scope.msg_panel.report);
    **/
    //绑定黑名单按钮事件
    eles['backlist'].parentNode.style.display="";
    Core.Events.addEvent(eles['backlist'],scope.msg_panel.blackList);
});