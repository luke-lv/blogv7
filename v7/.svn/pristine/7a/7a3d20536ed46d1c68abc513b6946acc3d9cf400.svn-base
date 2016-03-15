$import("lib/dialogConfig.js");
$import("lib/interface.js");
$import("lib/component/include/attention.js");
$import("sina/core/dom/getElementsByClass.js");
$registJob("msg_sysmsg", function(){
	/**
	 * 删除通知 noteid 存在时删除指定的通知，不存在时删除所有通知
	 * @param {Object} noteid
	 */
    scope.clearSysNote = function(noteid){
        noteid = noteid || "";
        var action = noteid ? "delone" : "delall";        
        winDialog.confirm("您确定要删除" + (noteid ? '这条' : '所有') + "通知吗？", {
			textOk:'删除',
            funcOk: function(){
                var inter = new Interface('http://i.blog.sina.com.cn/blog_rebuild/riaapi/profile/note/notedelete.php', "jsload");
                inter.request({
                    GET: {
                        action: action,
                        noteid: (noteid ? noteid : "")
                    },
                    onSuccess: function(){
                       // winDialog.alert("操作已完成");
                        window.location.href = window.location.href;
                    },
                    onFail: function(res){
                        winDialog.alert($SYSMSG[res.code], {
                            icon: "02"
                        });
                    },
                    
                    onError: function(res){
                        winDialog.alert($SYSMSG[res.code], {
                            icon: "02"
                        });
                    }
                });
            }
        });
		return false;
    }
	scope.clearNewSysNote = function(){
        var noteid = "";
        var action = noteid ? "delone" : "delall";        
        winDialog.confirm("确实要清空全部最新消息吗？", {
            funcOk: function(){
                var inter = new Interface('http://i.blog.sina.com.cn/blog_rebuild/riaapi/profile/note/notedelete.php', "jsload");
                inter.request({
                    GET: {
                        action: action,
                        noteid: (noteid ? noteid : "")
                    },
                    onSuccess: function(){
                       // winDialog.alert("操作已完成");
                        window.location.href = window.location.href;
                    },
                    onFail: function(res){
                        winDialog.alert($SYSMSG[res.code], {
                            icon: "02"
                        });
                    },
                    
                    onError: function(res){
                        winDialog.alert($SYSMSG[res.code], {
                            icon: "02"
                        });
                    }
                });
            }
        });
		return false;
    }
	/**
	 <input id="js_unread_changnum_20101022" value="" type="hidden"/>
class="js_unread_changnum_20101022"
	 */
	if($E("js_unread_changnum_20101022") && $E("js_unread_changnum_20101022").value)
	{
		var num = parseInt($E("js_unread_changnum_20101022").value);
		var arr = Core.Dom.getElementsByClass(document, '*', 'js_unread_changnum_20101022');
		for(var i=0;i<arr.length;i++)
		{
			if(num>i)
			{
				arr[i].style.fontWeight="700";
				arr[i].onclick=function()
				{
					this.style.fontWeight="400";					
				}
			}else
			{
				break;
			}
		}
	}
});
