$import("lib/panel.js");
$import("sina/core/events/stopEvent.js");
$import("lib/component/include/invite.js");
$import("lib/component/include/attention.js");
$import("lib/interface.js");
$import("product/blogmsg/centertip.js");

/**
 * 生产 消息页，操作面板
 */
$registJob("msg_panel", function(){
	
  scope.msg_panel = new Lib.Panel();
    var html = '<div id="#{panel}" class="feed_addlist feedTop_addlist " style="background:#fff;z-index:1000">\
              <div style="display: block;" class="cBox_main">\
                            <ul class="toollist">\
                                <li style="display:none;"><a id="#{follow}" href="javascript:void(0);">加关注</a></li>\
                                <li style="display:none;"><a id="#{friend}" href="javascript:void(0);">加好友</a></li>\
                                <li style="display:none;"><a id="#{delete}" href="javascript:void(0);">删除</a></li>\
                                <li style="display:none;"><a id="#{recover}" href="javascript:void(0);">恢复</a></li>\
                                <li style="display:none;"><a id="#{report}" href="javascript:void(0);">举报</a></li>\
                                <li style="display:none;" class="end"><a id="#{backlist}" href="javascript:void(0);">黑名单</a></li>\
                            </ul>\
                            </div>\
            </div>';
    scope.msg_panel.setTemplate(html);
    
    scope.msg_panel.commentId ="";
    scope.msg_panel.friendUid ="";
    scope.msg_panel.friendNick ="";
    
    //加关注
     scope.msg_panel.addFollow=function(friendId)
    {
		if($UID == scope.msg_panel.friendUid)
		{
			winDialog.alert("抱歉！不能关注自己");
			return false;
		}
      Lib.Component.Attention($UID,scope.msg_panel.friendUid);
	  return false;
    }
    //加好友
    scope.msg_panel.addfriend=function(friendId)
    {
		if($UID == scope.msg_panel.friendUid)
		{
			winDialog.alert("抱歉！不能加自己为好友");
			return false;
		}
      Lib.invite3(scope.msg_panel.friendUid,scope.msg_panel.friendNick);
	  return false;
    }
	
	//------上面的方法不用覆盖--------------------------
    //黑名单
    scope.msg_panel.blackList=function()
    {     
	
	if($UID == scope.msg_panel.friendUid)
	{
		winDialog.alert("抱歉！不能把自己添加到黑名单");
		return false;
	}
	winDialog.confirm("确实将此人加入黑名单？<br/>加入黑名单的用户将不能和你沟通",{
					funcOk:function(){
						
						new Interface("http://control.blog.sina.com.cn/blog_rebuild/riaapi/profile/note/deleblackuid.php", "jsload").request(
							  {
							  		GET:{				
										uid:$UID,
										friend_uid:scope.msg_panel.friendUid,
										inblack:1
									},
									onSuccess : function(){	
									 				window.centerTips.show("已成功添加到黑名单");
												},
									onError : function(res){
											
													if(typeof res)
													{
														if(res.code =='blacklist_full')
														{
															winDialog.alert("抱歉！您的黑名单已经满了");
														}else
														{
															showError(res.code);	
														}
															
													}else
													{
														
													}							
												}
								});	
					}
				});  
		return false;
    }
    
    
     //举报 举报有3种
    scope.msg_panel.report=function()
    {
    //  alert('举报');
      report('44a300b8010005ti_200501');
	  return false;
    }
    //删除 
    scope.msg_panel.dele=function()
    {
     // alert('删除');
      /**
       var CommentDel = new Comment.Delete();
        CommentDel.articleid = scope.$articleid;
        CommentDel.del(id,'true',friendUID);
      **/
    }
    //恢复
    scope.msg_panel.recover=function()
    {
     // alert('恢复');
    }
    
    scope.msg_panel._showEvent=function(_m,e,commentId,friendUid,friendNick)
    {
        scope.msg_panel.commentId =commentId;
        scope.msg_panel.friendUid =friendUid;
        scope.msg_panel.friendNick =friendNick;        
		//scope.msg_panel.setPosition(0, 0 );
		
		var eles = scope.msg_panel.getNodes();
		if(eles['backlist'].parentNode.style.display != "none" || typeof eles['backlist'].bFlg != 'undefined')
		{
			if($UID == friendUid)
		   {
		   		eles['backlist'].parentNode.style.display="none";
				eles['backlist'].bFlg = true;
		   }else
		   {
		   		eles['backlist'].parentNode.style.display="";
		   }
		}
       
	   _m = _m.getElementsByTagName('img')[0];
		//scope.msg_panel.setPosition(Core.Dom.getLeft(_m)+13, Core.Dom.getTop(_m) );
		
		scope.msg_panel.setPosition(_m.getBoundingClientRect().left+document.documentElement.scrollLeft, _m.getBoundingClientRect().top+Math.max(document.body.scrollTop,document.documentElement.scrollTop)+13 );
		 scope.msg_panel.show();
        Core.Events.stopEvent(e);
		return false;
    }
    Core.Events.addEvent(document.body,function(){
                                                    scope.msg_panel.hidden();
													
                                                  },"click");
   /**
	 scope.msg_panel.addShowBtn=function(obj)
	 {
	   Core.Events.addEvent(obj,scope.msg_panel._showEvent.bind2(obj),"click");
	 }
	 
	 // scope.msg_panel.show();
	 var obj = $E('commet').getElementsByTagName('a')[0];
	 scope.msg_panel.addShowBtn(obj);
	 var obj = $E('oldmsg').getElementsByTagName('a')[0];
   scope.msg_panel.addShowBtn(obj);
   scope.msg_panel._showEvent(this,event,commentId,friendUid,friendNick)
   **/
    
});