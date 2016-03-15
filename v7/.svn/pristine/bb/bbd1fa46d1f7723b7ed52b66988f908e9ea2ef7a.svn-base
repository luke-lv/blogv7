/**
 * 消息纸条页面
 */
$registJob("msg_paper", function(){
    var commonds = ['加关注','加好友','举报','黑名单'];    
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
   
    //绑定关注按钮事件
    eles['follow'].parentNode.style.display="";
    Core.Events.addEvent(eles['follow'],scope.msg_panel.addFollow);
    //绑定加好友按钮事件
    eles['friend'].parentNode.style.display="";
    Core.Events.addEvent(eles['friend'],scope.msg_panel.addfriend);
    //绑定举报按钮事件
    eles['report'].parentNode.style.display="";
    Core.Events.addEvent(eles['report'],scope.msg_panel.report);
    //绑定黑名单按钮事件
    eles['backlist'].parentNode.style.display="";
    Core.Events.addEvent(eles['backlist'],scope.msg_panel.blackList);
});