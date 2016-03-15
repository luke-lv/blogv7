/**
 * @author darkty2009 | darkty2009@gmail.com
 */
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/string/trim.js");
$import("sina/core/string/byteLength.js");
$import("lib/showError.js");
$import("lib/interface.js");
$import("lib/dialogConfig.js");
$import("jobs/resource.js");
$import("msg/messagecode.js");
$registJob("paperlist", function() {
	
	var all = Core.Dom.getElementsByClass(document, "div", "chbox");
	var chooses = document.getElementsByName("ids[]");
	if(!chooses.length)return;
	
	for(var i=0;i<all.length;i++) {
		all[i].firstChild.checked = false;
	}
	
	all[0].onclick = function() {
		for(var i=1;i<all.length;i++) {
			all[i].firstChild.checked = this.firstChild.checked;
		}
	};
	/**
	all[all.length-1].onclick = function() {
		for(var i=0;i<all.length-1;i++) {
			all[i].firstChild.checked = this.firstChild.checked;
		}
	};
	**/
	var chooLen = chooses.length;
	
	function checkAll(dom) {
		trace("check");
		
		if(!dom.checked) {
			all[0].firstChild.checked = false;
			//all[all.length-1].firstChild.checked = false;
		}else {
			var flag = true;
			for(var i=0;i<chooLen;i++) {
				if(!chooses[i].checked) {
					flag = false;
					break;
				}
			}
			
			all[0].firstChild.checked = flag;
			//all[all.length-1].firstChild.checked = flag;
		}
	}
	
	for(var i=0;i<chooLen;i++) {
		chooses[i].onclick = function() {
			checkAll(this);
		};
	}
	
	window.deleteAll = function(type) {
		var ids = [];
		var chooses2 = document.getElementsByName("ids[]");
		
        for (var i = 0, l = chooses2.length; i < l; i++) {
            if (chooses2[i].checked) {
                ids.push(chooses2[i].value);
            }
        }
        if (ids.length > 0) {
            winDialog.confirm("<p class='sTit'><strong>"+$RESOURCE['paper_delete']+"</strong></p>", {
				icon:"04",
				textOk :'删除',
                funcOk: function(){
					try {
						Core.Events.stopEvent();
					}catch(e) {

					}
                    new Interface("http://control.blog.sina.com.cn/riaapi/profile/messagetalkdel.php?version=7", "jsload").request({
                        GET: {
                            uid: scope.$uid,
                            type: type,
                            mid: ids.join(",")
                        },
                        onSuccess: function(res){
                           window.location.reload();
                        },
                        onError: function(res){
                            winDialog.alert($SYSMSG[res.code], {
                                icon: "02"
                            });
                        }
                    });
                }
            });
        }
        else {
            winDialog.alert($RESOURCE['paper_choose'], {
                icon: "01"
            });
        }
	};
	
	window.deleteAll2 = function(type) {
		var ids = [];
		var chooses2 = document.getElementsByName("ids[]");
		
        for (var i = 0, l = chooses2.length; i < l; i++) {
            if (chooses2[i].checked) {
                ids.push(chooses2[i].value);
            }
        }
        if (ids.length > 0) {
                    new Interface("http://control.blog.sina.com.cn/riaapi/profile/messagetalkdel.php?version=7", "jsload").request({
                        GET: {
                            uid: scope.$uid,
                            type: type,
                            mid: ids.join(",")
                        },
                        onSuccess: function(res){
                           window.location.reload();
                        },
                        onError: function(res){
                            winDialog.alert($SYSMSG[res.code], {
                                icon: "02"
                            });
                        }
                    });
               
        }
        else {
            winDialog.alert($RESOURCE['paper_choose'], {
                icon: "01"
            });
        }
	};
	
	window.sendReceiveMessage = function(id, tuid){
		
		var value = $E(id+"").value;
		value = Core.String.trim(value+"");
		
		try {
			Core.Events.stopEvent();
		}catch(e) {
		
		}
        new Interface("http://control.blog.sina.com.cn/riaapi/profile/messagesend.php?version=7", "ijax").request({
            POST: {
                tuid: tuid,
                fuid: scope.$uid,
                content: value,
				reply: 1
            },
            onSuccess: function(res){
                document.location.reload();
            },
            onError: function(res){
                showError($SYSMSG[res.code])
            }
            
        });
        
    };
	
	window.showReceivePanel = function(fuid, tuid, dom, e, name, mname, notesId){
		var id = notesId;
		var __inputLimit = 300;		// dcw1123
		
		if($E("msg_"+id)) {
			$E("msg_"+id).style.display = "block";
			return;
		}
		
		var form = $C("dd");
		var html='';
		form.id = "msg_"+id;
		form.className = "cBox_re";
		
		html += '<div class="SG_revert_Answer">';
		html += '<div class="SG_revert_Answer_Top" style="width:490px;"><span class="SG_floatL">回复：</span><span id="txt_'+id+'" class="SG_floatR">还可以输入'+Math.ceil(__inputLimit/2)+'个汉字</span></div>';
		html += '<div class="SG_revert_Answer_right">';
		html += '<textarea id="'+id+'" class="SG_textarea"></textarea>';
		html += '<div class="SG_revert_Btn"><div class="SG_revert_Btn_left"><span><a href="javascript:void(0);" onclick="javascript:sendReceiveMessage('+id+','+tuid+');" class="SG_aBtn SG_aBtnB"><cite id="reply_btn'+id+'">发送</cite></a></span><span><a href="javascript:void(0);" onclick="javascript:closePanel('+id+')" class="SG_aBtn SG_aBtnB"><cite id="reply_cancel'+id+'">取消</cite></a></span></div></div>';
		html += '</div>';
		html += '</div>';
		
		form.innerHTML = html;
		
		var target = $E("note"+notesId).getElementsByTagName("dl")[0];
		target.appendChild(form);
		
		Core.Events.addEvent($E(id+""), function(){
			var value = $E(id+"").value;
			if(Core.String.byteLength(value) > __inputLimit){
				$E("txt_"+id).innerHTML = "还可以输入0个汉字";
				while(Core.String.byteLength(value) > __inputLimit){
					value = value.substr(0, value.length-1);
				}
				$E(id+"").value = value;					
			}else{
				$E("txt_"+id).innerHTML = "还可以输入" + Math.floor((__inputLimit - Core.String.byteLength(value)) / 2) + "个汉字";
			}
		}, 'keyup');
		
		return false;
	};
	
	window.closePanel = function(id) {
		if($E("msg_"+id)) {
			$E("msg_"+id).style.display = "none";
		}
	};
	
	window.deleteNote = function(id, type, del_uid){
        var addBlackOption = type==2 ? '<p class="c666">\
			<input class="iptChk" type="checkbox" id="isAddBlack"/>\
			'+$RESOURCE['paper_panel_title']+'</p>\
		' : "";
        winDialog.confirm("<p class='sTit'><strong>"+$RESOURCE['paper_panel_confirm']+"</strong></p>", {
			icon:"04",
            //width:400,
            subText: addBlackOption,
			textOk :'删除',
            funcOk: function(){
				try {
					Core.Events.stopEvent();
				}catch(e) {

				}
                var request_obj = new Interface("http://control.blog.sina.com.cn/riaapi/profile/messagetalkdel.php?version=7", "jsload");
                var params = {
                    GET: {
                        uid: scope.$uid,
                        type: type,
                        mid: id
                    },
                    onSuccess: function(res){						
                        document.location.reload();
                    },
                    onError: function(res){						
						if($SYSMSG[res.code] == 'A20105')
						{
							winDialog.alert("删除成功，黑名单已达上限。",{funcOk:
							function()
							{
								window.location.reload();
							}});
							return;
						}
                        winDialog.alert($SYSMSG[res.code], {
                            icon: "02"
                        });
                    }
                };
                if ($E("isAddBlack") && $E("isAddBlack").checked) {
                    params.GET["inblack"] = "1";
                    params.GET["tuid"] = del_uid;
                }
                else {
                    params.GET["inblack"] = "0";
                }
                request_obj.request(params);
                
                //删除加入黑名单checkbox
                Core.Dom.removeNode("isAddBlack");
            }
        });
    };
	
	window.deleteNote2 = function(id, type, del_uid){				
                var request_obj = new Interface("http://control.blog.sina.com.cn/riaapi/profile/messagetalkdel.php?version=7", "jsload");
                var params = {
                    GET: {
                        uid: scope.$uid,
                        type: type,
                        mid: id
                    },
                    onSuccess: function(res){
                        document.location.reload();
                    },
                    onError: function(res){
                        winDialog.alert($SYSMSG[res.code], {
                            icon: "02"
                        });
                    }
                };
                if ($E("isAddBlack") && $E("isAddBlack").checked) {
                    params.GET["inblack"] = "1";
                    params.GET["tuid"] = del_uid;
                }
                else {
                    params.GET["inblack"] = "0";
                }
                request_obj.request(params);   
    };
	
	//未读的变粗
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
					if($E("zhitiaonumber"))
					{
						var n = parseInt($E("zhitiaonumber").innerHTML,10);
						$E("zhitiaonumber").innerHTML = n-1;
					}
					if($E("zhitiaonumbertop"))
					{
						var n = parseInt($E("zhitiaonumbertop").innerHTML,10);
						$E("zhitiaonumbertop").innerHTML = n-1;
					}
					if($E("zhitiaonumbertop0"))
					{
						var n = parseInt($E("zhitiaonumbertop0").innerHTML,10);
						$E("zhitiaonumbertop0").innerHTML = n-1;
					}					
					this.style.fontWeight="400";
					this.onclick=function(){};
				}
			}else
			{
				break;
			}
		}
	}
	
	
});
