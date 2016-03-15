/**
 * @author darkty2009
 */
$import("sina/core/events/addEvent.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/string/format.js");
$import("sina/core/string/shorten.js");
$import("lib/interface.js");
$import("lib/showError.js");
$import("jobs/setNick.js");
$import("jobs/resource.js");
$import("msg/invite.js");
$import("product/blogmsg/centertip.js");

$registJob("invitelist", function(){

    var all = Core.Dom.getElementsByClass(document, "div", "chbox");
    var chooses = document.getElementsByName("ids[]");
    var chooLen = chooses.length;
    
	if(!chooses.length)return;
	
    if (all.length > 0) {
        for (var i = 0; i < all.length; i++) {
            all[i].firstChild.checked = false;
        }
        all[0].onclick = function(){
            for (var i = 1; i < all.length; i++) {
                all[i].firstChild.checked = this.firstChild.checked;
            }
        };
		/**
        all[all.length - 1].onclick = function(){
            for (var i = 0; i < all.length - 1; i++) {
                all[i].firstChild.checked = this.firstChild.checked;
            }
        };
        **/
    }
    if (chooses.length > 0) {
        for (var i = 0; i < chooLen; i++) {
            chooses[i].onclick = function(){
                checkAll(this);
            };
        }
    }
    
    function checkAll(dom){
        if (!dom.checked) {
            all[0].firstChild.checked = false;
           // all[all.length - 1].firstChild.checked = false;
        }
        else {
            var flag = true;
            for (var i = 0; i < chooLen; i++) {
                if (!chooses[i].checked) {
                    flag = false;
                    break;
                }
            }
            all[0].firstChild.checked = flag;
           // all[all.length - 1].firstChild.checked = flag;
        }
    }
    
    window.deleteAll = function(type){
        var array = [];
        var arr_msgid = [];
        var arr_fromid = [];
        
        for (var i = 0; i < chooses.length; i++) {
            if (chooses[i].checked) 
                array.push(chooses[i].value);
        }
        for (var i = 0; i < array.length; i++) {
            var temp = array[i].split("|");
            arr_msgid.push(temp[1]);
            arr_fromid.push(temp[2]);
        }
        
        if (arr_msgid.length < 1) {
            winDialog.alert("尚未选择好友邀请", {
                funcOk: function(){
                }
            });
        }
        else {
            winDialog.confirm('确实删除所选的好友邀请？', {
				textOk:'删除',
                funcOk: function(){
                    try {
                        Core.Events.stopEvent();
                    } 
                    catch (e) {
                    }
                    new Interface("http://control.blog.sina.com.cn/riaapi/profile/invitedelall.php?version=7", "jsload").request({
                        GET: {
                            uid: scope.$uid,
                            msgid: arr_msgid.join(","),
                            fromuid: arr_fromid.join(",")
                        },
                        onSuccess: function(){
							window.centerTips.show("已删除好友邀请");
							setTimeout(function(){
								window.location.reload();
							},2000);   
                        },
                        onError: function(res){
                            showError(res.code);
                        }
                    });
                }
            });
        }
    };
    
	/**
	 * 批量拒绝
	 */
	window.rejectAll=function(type){
		 var array = [];
        var arr_msgid = [];
        var arr_fromid = [];
        
        for (var i = 0; i < chooses.length; i++) {
            if (chooses[i].checked) 
                array.push(chooses[i].value);
        }
        for (var i = 0; i < array.length; i++) {
            var temp = array[i].split("|");
            arr_msgid.push(temp[1]);
            arr_fromid.push(temp[2]);
        }
        
        if (arr_msgid.length < 1) {
            winDialog.alert("尚未选择好友邀请", {
                funcOk: function(){
                }
            });
        }
        else {
            winDialog.confirm('确实要拒绝全部好友邀请？', {
                funcOk: function(){
                    try {
                        Core.Events.stopEvent();
                    } 
                    catch (e) {
                    }
                    new Interface("http://control.blog.sina.com.cn/riaapi/profile/invitedelall.php?version=7", "jsload").request({
                        GET: {
                            uid: scope.$uid,
                            msgid: arr_msgid.join(","),
                            fromuid: arr_fromid.join(",")
                        },
                        onSuccess: function(){							
						
							window.centerTips.show("已拒绝好友邀请");	
							setTimeout(function(){
								window.location.reload();
							},2000);                       
                        },
                        onError: function(res){
                            showError(res.code);
                        }
                    });
                }
            });
        }
	}
	
    window.acceptAll = function(){
        var array = [];
        var arr_msgid = [];
        var arr_fuid = [];
        var arr_nick = [];
        for (var i = 0; i < chooses.length; i++) {
            if (chooses[i].checked) 
                array.push(chooses[i].value);
        }
        
        if (scope.left_fnum == 0) {
            showError("A20105"); //好友超过上限。
            return;
        }
        else 
            if ((scope.left_fnum != "undefined") && (array.length > scope.left_fnum)) {
                winDialog.alert("您还能再邀请 " + scope.left_fnum + " 个好友，目前您选择了" + array.length + "个。");
                return;
            }
        
        for (var i = 0; i < array.length; i++) {
            var temp = array[i].split("|");
            arr_msgid.push(temp[1]);
            arr_fuid.push(temp[2]);
        }
        for (var i = 0; i < arr_msgid.length; i++) {
            arr_nick.push($E("nick_" + arr_msgid[i]).getElementsByTagName("a")[0].innerHTML);
        }
        if (arr_msgid.length < 1) {
            winDialog.alert("尚未选择好友邀请", {
                funcOk: function(){
                }
            });
        }
        else {                    
                    new Interface("http://control.blog.sina.com.cn/riaapi/profile/AddFriend_multi.php", "jsload").request({
                        GET: {
                            fuids: arr_fuid.join(","),
                            inviteids: arr_msgid.join(",")
                        },
                        onSuccess: function(){
							window.centerTips.show("已成功添加好友");	
							setTimeout(function(){
								window.location.reload();
							},2000);                           
                        },
                        onError: function(res){
                            if (res.code == "A30002") {
                                winDialog.alert($SYSMSG[res.code], {
                                    icon: "03", //也算成功。所以画勾。
                                    funcOk: function(){
                                        window.location.reload();
                                    }
                                });
                            }
							//已被对方加入黑名单
                            else if(res.code == "A10016"){
								winDialog.alert($SYSMSG[res.code], {                                     
                                    funcOk: function(){
                                        window.location.reload();
                                    }
								});
								return false;
							}
							else{
                                showError(res.code);
                            }
                        }
                    });
                }
        }
		/**
        function collectInvitedInfo(){
            var info = "";
            var templt = "<span style='width:90px; display:inline-block; white-space:nowrap; overflow:hidden; margin-right:5px;' title='{1}'>{0}</span>";
            if (arr_nick.length != chooLen) {
                for (var i = 0; i < arr_nick.length; i++) {
                    info += templt.format(Core.String.shorten(arr_nick[i], 8), arr_nick[i]);
                }
            }
            return info;
        }
    **/
    window.accept = function(id, postid, postname){
        try {
            Core.Events.stopEvent();
        } 
        catch (e) {
        }
        
        if (scope.left_fnum != "undefined" && scope.left_fnum < 1) {
            showError("A20105"); //好友超过上限。
            return;
        }
        var _accept = new Interface("http://control.blog.sina.com.cn/riaapi/profile/AddFriend.php?version=7", "jsload");
        setNick.get(function(){
            _accept.request({
                GET: {
                    friend_uid: postid,
                    inviteid: id,
                    uname: scope.nick[scope.$uid]
                },
                onSuccess: function(){
					window.centerTips.show("你已经与"+postname+"成为好友");                   
					setTimeout(function(){
						window.location.reload();
					},2000);
                    /**
                     winDialog.alert('你已经与 <a href="http://blog.sina.com.cn/u/' + postid + '" target="_blank">' + postname + '</a> 成为好友<br/>', {
                     funcOk : function(){
                     //winDialog.getDialog("alert1").getNodes().btnClose.onclick = null;
                     window.location.reload();
                     },
                     icon : "03",
                     subText : ['<ul class="CP_w_part CP_w_aLine">'
                     , '<li><a style="font-weight:normal;font-size:12px;" href="http://control.blog.sina.com.cn/blogprofile/index.php?type=3&from=addfiendok" >查看好友动态&gt;&gt;</a></li>'
                     ,'</ul>'].join('')
                     }, "alert1");
                     winDialog.getDialog("alert1").getNodes().btnClose.onclick = function () {
                     window.location.href = window.location.href.replace(/#.+$/, "");
                     };
                     **/
                },
                onError: function(res){
							//已被对方加入黑名单
                            if(res.code == "A10016"){
								winDialog.alert($SYSMSG[res.code], {                                     
                                    funcOk: function(){
                                        window.location.reload();
                                    }								
							});
							return false;
							}
                    showError(res.code);
                },
                onFail: function(res){
                    showError(res.code);
                }
            });
        });
    };
    
    window.ignore = function(id, postid, postname){
        try {
            Core.Events.stopEvent();
        } 
        catch (e) {
        
        }
        var _data = {
            uid: scope.$uid,
            id: id
        };
		/**
        if ($E("addToBlackList").checked == true) {
            _data.isblack = "1";
            _data.tuid = postid;
        }
        **/		
        var _ignore = new Interface("http://control.blog.sina.com.cn/riaapi/profile/invitedel.php?version=7", "jsload");
        _ignore.request({
            GET: _data,
            onSuccess: function(){				
							window.centerTips.show("你已经拒绝了"+postname+"的好友邀请");	
				// tip.show("你已经拒绝了"+postname+"的好友邀请");	
				 setTimeout(function(){
						window.location.reload();
					},2000);			
                //window.location.reload();// 忽略邀请后刷新页面
            },
            onError: function(_data){
                trace("忽略邀请出错");
                showError(_data.code);
            },
            onFail: function(){
                trace("忽略邀请出错");
            }
        });
        /**
         var msg = '确认拒绝来自“' + postname + '”的好友邀请？';
         var tips = '<p  class="c666"><input type="checkbox" id="addToBlackList" class="iptChk" />'+$RESOURCE['black_1']+'</p><p class="c999 l20">'+$RESOURCE['black_2']+' </p>';
         winDialog.confirm(msg, {
         subText: tips,
         icon:"04",
         funcOk : function () {
         try {
         Core.Events.stopEvent();
         }catch(e) {
         
         }
         var _data = {
         uid : scope.$uid,
         id : id
         };
         if($E("addToBlackList").checked == true){
         _data.isblack = "1";
         _data.tuid = postid;
         }
         var _ignore = new Interface("http://control.blog.sina.com.cn/riaapi/profile/invitedel.php?version=7", "jsload");
         _ignore.request({
         GET : _data,
         onSuccess : function () {
         window.location.reload();// 忽略邀请后刷新页面
         },
         onError : function (_data) {
         trace("忽略邀请出错");
         showError(_data.code);
         },
         onFail : function () {
         trace("忽略邀请出错");
         }
         });
         }
         });
         **/
    }
});
