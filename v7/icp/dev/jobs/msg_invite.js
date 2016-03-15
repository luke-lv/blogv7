/**
 * 消息好友邀请页面
 */
$registJob("msg_invite", function(){
    var commonds = ['举报', '黑名单'];
    var eles = scope.msg_panel.getNodes();
    scope.msg_panel.report = function(){
        if ($UID == scope.msg_panel.friendUid) {
            alert("您不能举报自己");
            return false;
        }
        report(scope.msg_panel.commentId);
        return false;
    }
    
    scope.msg_panel.dele = function(){
        try {
            Core.Events.stopEvent();
        } 
        catch (e) {
        }
        var _data = {
            uid: scope.$uid,
            id: scope.msg_panel.commentId
        };
        var _ignore = new Interface("http://control.blog.sina.com.cn/riaapi/profile/invitedel.php?version=7", "jsload");
        _ignore.request({
            GET: _data,
            onSuccess: function(){
                window.location.reload();// 忽略邀请后刷新页面
            },
            onError: function(_data){
                trace("忽略邀请出错");
                showError(_data.code);
            },
            onFail: function(){
                trace("忽略邀请出错");
            }
        });
        return false;
    }
    
    //举报后删除该邀请
    window.msg_report_callback = function(){
        scope.msg_panel.dele();
        return false;
    }
    
    scope.msg_panel.blackList = function(){
    
        if ($UID == scope.msg_panel.friendUid) {
            winDialog.alert("抱歉！不能把自己添加到黑名单");
            return false;
        }
        winDialog.confirm("确实将此人加入黑名单？<br/>加入黑名单的用户将不能和你沟通", {
            funcOk: function(){
            
                new Interface("http://control.blog.sina.com.cn/blog_rebuild/riaapi/profile/note/deleblackuid.php", "jsload").request({
                    GET: {
                        uid: $UID,
                        friend_uid: scope.msg_panel.friendUid,
                        inblack: 1
                    },
                    onSuccess: function(){
                        window.centerTips.show("已成功添加到黑名单");
                        msg_report_callback();
                    },
                    onError: function(res){
                        if (typeof res) {
                            if (res.code == 'blacklist_full') {
                                winDialog.alert("抱歉！您的黑名单已经满了");
                            }
                            else {
                                showError(res.code);
                            }
                            
                        }
                        else {
                        
                        }
                    }
                });
            }
        });
        return false;
    }
    //绑定删除按钮事件
    eles['delete'].parentNode.style.display = "";
    Core.Events.addEvent(eles['delete'], scope.msg_panel.dele);
    //绑定举报按钮事件
    eles['report'].parentNode.style.display = "";
    Core.Events.addEvent(eles['report'], scope.msg_panel.report);
    //绑定黑名单按钮事件
    eles['backlist'].parentNode.style.display = "";
    Core.Events.addEvent(eles['backlist'], scope.msg_panel.blackList);
    
    var deleteAlllinkid = 'clearallinvite';
    if ($E(deleteAlllinkid)) {
        $E(deleteAlllinkid).onclick = function(){
            winDialog.confirm("您确定要删除所有好友邀请吗？", {
                funcOk: function(){
                    new Interface("http://control.blog.sina.com.cn//blog_rebuild/riaapi/profile/note/inviteempty.php", "jsload").request({
                        GET: {
                            uid: $UID
                        },
                        onSuccess: function(){
                            location.reload();
                        },
                        onError: function(res){
                            showError(res.code);
                        }
                    });
                }
            });
            
            return false;
        }
    }
});
