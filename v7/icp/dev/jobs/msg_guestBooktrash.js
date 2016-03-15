/**
 * 消息纸条页面
 */
$import("tempLib/magicFace/magicFace.js");
$registJob("msg_guestBooktrash", function(){
    var commonds = ['恢复','举报','黑名单'];    
    var eles = scope.msg_panel.getNodes();
    scope.msg_panel.report=function()
    {
      if($UID == scope.msg_panel.friendUid)
		{
			alert("您不能举报自己");
			return false;
		}
      report(scope.msg_panel.commentId);
	  return false;
    }
   
	scope.msg_panel.recover=function()
	{
		wallResume(scope.msg_panel.commentId);
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