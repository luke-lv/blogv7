/**
 * @author darkty2009
 */
$import("sina/core/class/create.js");
$import("sina/ui/pagination.js");
$import("sina/ui/slide.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/domInsert.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/string/leftB.js");
$import("lib/showError.js");
$import("msg/guestBook.js");
$import("sina/utils/io/jsload.js");
$import("lib/component/report/blogReport.js");
$import("tempLib/magicFace/magicFace.js");
$import("jobs/resource.js");
$import("product/blogmsg/centertip.js");
$import("lib/uic.js");

$registJob("profile_guestbook", function() {
	scope.gb_class = new GuestBook_Class();
	
	var chooses = document.getElementsByName("ids[]");
	
	if(!$E("selectAll"))return;
	
	$E("selectAll").onclick = function()
	{		
		for(var i=0;i<chooses.length;i++)
		{
			chooses[i].checked = this.checked;
		}
	}
	for(var i=0;i<chooses.length;i++)
	{
		chooses[i].onclick = function()
		{
			for(var j=0;j<chooses.length;j++)
			{
				if(!chooses[j].checked)break;
			}
			if(j==chooses.length)
			{
				$E("selectAll").checked = "checked";
			}else
			{
				$E("selectAll").checked = "";
			}
		}
	}
	$E("deleteAll").onclick = function()
	{
		var f = 0;
		for(var i=0;i<chooses.length;i++)
		{
			if (chooses[i].checked) {
				f+=1;
			}
		}
		if(f==0)
		{
			winDialog.alert("请选择要删除的留言");
			return;
		}
		
		var deleteids = [];
		for(var i=0;i<chooses.length;i++)
		{			
			if(chooses[i].checked)
			{
				var p = chooses[i].parentNode.parentNode;
				var pid = p.id.replace("item_",'');
				var friendUID = $E("guestNick_" + pid).getElementsByTagName("A")[0].href.match(/\d+/g)[0];				
				deleteids.push({'msgid':pid,'fuid':friendUID});
			}
		}
		
		winDialog.confirm("确认删除这些留言?", {
			textOk:'删除',
			funcOk: function(){
				function cal()
				{
					var popVal = deleteids.pop();
					scope.gb_class.removeInterface.request({
						POST: {
							msgid: popVal['msgid'],
							uid: $UID,
							friend_uid: popVal['fuid'],
							inblack: ''
						
						},
						onSuccess: function(data){
							if(deleteids.length)
							{
								cal();
							}else
							{
								//winDialog.alert("操作成功。");
								window.location.reload();
							}
						},
						onError: function(data){
							winDialog.alert($GUESTBOOK_MSG[data["code"]], {
								icon: "02"
							});
						},
						onFail: function(){
						}
					});
				}
				
				cal();
			}
		});
	}	
});

GuestBook_Class = Core.Class.create();
GuestBook_Class.prototype = {
	
	_itemNodeName:['item', 'photo', 'reply_create', 'remove', 'content','report','guestNick'],
	_answerNodeName:['label', 'reply_content', 'reply', 'cancel', 'field'],
	
	_pagesize:20,
	_count:0,
	_currentPage:1,
	_offset:0,
	
	countInterface:null,
	dateInterface:null,
	removeInterface:null,
	replyInterface:null,
	
	template:null,
	
	data:null,
	
	hostNickName:"",
	blogReport:null,
	
	
	initialize:function() {
		var _this = this;
		this.blogReport=new Lib.BlogReport();
		this.template = new GuestBook_Template();
		
		this.countInterface = new Interface("http://wall.cws.api.sina.com.cn/count_all.php?version=7","jsload");
		this.dateInterface = new Interface("http://wall.cws.api.sina.com.cn/list3.php?version=7","jsload");
		//this.removeInterface = new Interface("http://wall.cws.api.sina.com.cn/delete.php?version=7","jsload");
		this.removeInterface = new Interface("http://control.blog.sina.com.cn/blog_rebuild/riaapi/profile/note/gbookdelete.php","ijax");
		
		this.replyInterface = new Interface("http://wall.cws.api.sina.com.cn/reply.php?version=7","ijax");
		
	},
	
	
	
	
	
	
	_updateAnswerTpl:function(id) {
		var tpl = this.template.answer;
		for(var i=0;i<this._answerNodeName.length;i++) {
			tpl = tpl.replace("{id"+i+"}", this._answerNodeName[i]+"_"+id);
		}
		
		return tpl;
	},
	
	createField:function(dom,uid) {
		
		var id = dom.id.split("_")[2];
		if (!$E("field_" + id)) {
			var tpl = this._updateAnswerTpl(id);
			$E("content_" + id).innerHTML = $E("content_" + id).innerHTML+tpl;
			$E("content_" + id).value =uid;
			this.initFieldEvent($E("field_"+id));			
		}
		else {
			$E("field_" + id).style.display = "";
		}
	},
	
	initFieldEvent:function(dom) {
		var id = dom.id.split("_")[1];
		var _this = this;
		
		Core.Events.addEvent($E("reply_content_"+id), function() {
			var value = $E("reply_content_"+id).value;
			
			if (Core.String.byteLength(value) > 600) {
	            $E("label_"+id).innerHTML = "还可以输入0个汉字";
				$E("reply_content_"+id).value = Core.String.leftB($E("reply_content_"+id).value, 600);
	        }
	        else {
	            $E("label_"+id).innerHTML = "还可以输入" + Math.floor((600 - Core.String.byteLength(value)) / 2) + "个汉字";
	        }
		}, 'keyup');
		
		Core.Events.addEvent($E("reply_"+id), function() {
			var value = $E("reply_content_"+id).value;
			
			if(value && value.replace(/\s/g, "") != "") {
				_this.replyInterface.request({
					POST: {
						rid: $E("content_" + id).value,
						msg: value
					},
					onSuccess: function(res) {
						//winDialog.alert("操作成功");
						window.location.href = window.location.href;
					},
					onError: function(res) {						
						if(res.code == 'A00004')
						{
							if(res.data =="you can not reply to yourself")
							{
								msg = "你不能回复你自己的留言。";
							}
							if(res.data =="message contains keyword")
							{
								msg = "您的留言含有敏感词";
							}
							winDialog.alert(msg);
							return;
						}
						showError($GUESTBOOK_MSG[res.code]);
					},
					onFail: function() {
						trace("on Fail");
					}
				});
			}
			else {
				winDialog.alert("请填写留言内容。");
			}
		});
	},
	
	deleteBook:function(dom,uid) {
		var id = dom.id.split("_")[1];
		var _this = this;
		var friendUID = uid; 
		/**
		winDialog.confirm("确认删除该留言?", {
			funcOk: function(){
				_this.removeInterface.request({
					GET: {
						msgid: id
					},
					onSuccess: function(data){
						winDialog.alert("操作成功。");
						window.location.href = window.location.href;
					},
					onError: function(data){
						winDialog.alert($GUESTBOOK_MSG[data["code"]], {
							icon: "02"
						});
					},
					onFail: function(){
					}
				});
				
				
			}
		});
		**/
		var styleState="";
		if($UID==friendUID||friendUID==0){
			styleState=' style="display:none" ';
		}		
		winDialog.confirm($RESOURCE.delete_guestBook, {
			subText:'<div '+styleState+'><input id="ccbAddToBlock" type="checkbox"/><label for="ccbAddToBlock">将此人加入黑名单</label></div>',
			textOk:'删除',
			funcOk:function() {				
				//加入黑名单				
				/**
				if ($E("ccbAddToBlock").checked) {
					new Interface("http://control.blog.sina.com.cn/blog_rebuild/riaapi/profile/note/deleblackuid.php", "jsload").request({
						GET: {
							uid: $UID,
							friend_uid: friendUID,
							inblack: 1
						},
						onSuccess: function(res){
						
						},
						onError: function(res){
						
						}
					});
				}
				**/
				//删除留言
				_this.removeInterface.request({
					POST: {
						msgid: id,
						uid: $UID,
						friend_uid: friendUID,
						inblack: ($E("ccbAddToBlock").checked?1:0)
					},
					onSuccess: function(data){
						//winDialog.alert("操作成功。");
						window.location.href = window.location.href;						
					},
					onError: function(data){						
						if(data["code"] == 'A00023')
							{
								winDialog.alert('删除成功，黑名单已达到上限', {
									 funcOk: function(){
										location.reload();
					    			},
									icon: "02"
								});
								return;
							}
						winDialog.alert($GUESTBOOK_MSG[data["code"]], {
							icon: "02"
						});
					},
					onFail: function(){
					}
				});
			}
		});
	},
	
	/**
	 * 举报
	 */
	report:function(dom){
		var me=this,
			cID=dom.id.split("_")[1],
			bodyID=scope.$uid+"_"+cID,
			links=$E("guestNick_"+cID).getElementsByTagName("a"),
			reportUID=links.length>0?links[0].href.split("/").pop():"",
			nickName=links.length>0?links[0].innerHTML.replace(/:/g,""):"新浪网友",
			userNameInfo1='<a target="_blank" href="'+links[0].href+'">'+nickName+'</a>',
			userNameInfo2="",
			titleInfo="",
			contentInfo=$E("content_"+cID).innerHTML;
			
		//获取博主昵称
		if (this.hostNickName === "") {
			// var url = "http://uic.internal.sina.com.cn/uic/Query.php?" + "UID="+ scope.$uid +"&Check=null&UserInfoTypes=[1]&ProductType=2";
			// Utils.Io.JsLoad.request(url, {
			// 	onComplete: function(result){
			// 		me.hostNickName=result && result.UserInfo && result.UserInfo[0][1];
			// 		me.blogReport.start("guestBook",nickName,bodyID,reportUID,userNameInfo1,'<a target="_blank" href="http://blog.sina.com.cn/u/'+scope.$uid+'">'+me.hostNickName+'</a>',titleInfo,contentInfo);
			// 	},
			// 	onException: function(){
			// 		me.blogReport.start("guestBook","新浪网友",bodyID,reportUID,userNameInfo1,"<strong>新浪网友</strong>",titleInfo,contentInfo);
			// 	}
			// });
			Lib.Uic.getNickName([scope.$uid],function(result){
				if(result && result[scope.$uid]){
					me.hostNickName =result[scope.$uid];
					me.blogReport.start("guestBook",nickName,bodyID,reportUID,userNameInfo1,'<a target="_blank" href="http://blog.sina.com.cn/u/'+scope.$uid+'">'+me.hostNickName+'</a>',titleInfo,contentInfo);
				}else{
					me.blogReport.start("guestBook","新浪网友",bodyID,reportUID,userNameInfo1,"<strong>新浪网友</strong>",titleInfo,contentInfo);
				}
			});
		}else{
			userNameInfo2='<a target="_blank" href="http://blog.sina.com.cn/u/'+scope.$uid+'">'+this.hostNickName+'</a>';
			this.blogReport.start("guestBook",nickName,bodyID,reportUID,userNameInfo1,userNameInfo2,titleInfo,contentInfo);
		}

	},
	
	
	removeField:function(dom) {
		var id = dom.id.split("_")[1];		
		if($E("field_" + id)) {
			$E("field_" + id).style.display = "none";
		}
	}
};

GuestBook_Template = Core.Class.create();
GuestBook_Template.prototype = {
	
	initialize	:	function() {
		
	},
	
	container 	: 	'<ul class="SG_cmp_revert">{0}</ul>',
	
	item		: 	'<li id="{id0}" class="SG_j_linedot1">'+
        				'<div class="fPic SG_revert_Left"><img id="{id1}" src="{data0}"/></div>'+
                        '<div class="SG_revert_Cont">'+
                            '<p><span id="{id6}" class="SG_revert_Tit"><a href="{data1}" target="_blank">{data2}</a>{data5}</span><span class="SG_revert_Time"><em class="SG_txtc">{data3}</em><a style="display:{data6}" onclick="scope.gb_class.createField(this);return false;" id="{id2}" class="CP_a_fuc" href="#">[<cite>回复</cite>]</a><a onclick="scope.gb_class.deleteBook(this);return false;" id="{id3}" class="CP_a_fuc" href="#">[<cite>删除</cite>]</a><a href="#" id="{id5}" onclick="scope.gb_class.report(this);return false;">[<cite>举报</cite>]</a></span></p>{data7}'+
                   			'<div id="{id4}" class="SG_revert_Inner">{data4}</div>'+
                        '</div>'+
              		'</li>',
	
	answer		:	'<div id="{id4}" class="SG_revert_Answer">'+
                    	'<div class="SG_revert_Answer_Top" style="width:490px;"><span class="SG_floatL">回复：</span><span id="{id0}" class="SG_floatR" style="width:157px;">还可以输入300个汉字</span></div>'+
                        '<div class="SG_revert_Answer_right">'+
                            '<textarea id="{id1}" class="SG_textarea"></textarea>'+
                            '<div class="SG_revert_Btn"><div class="SG_revert_Btn_left"><span><a onclick="return false;" id="{id2}" class="SG_aBtn SG_aBtnB" href="#"><cite>回复</cite></a></span><span><a onclick="scope.gb_class.removeField(this);return false;" id="{id3}" class="SG_aBtn SG_aBtnB" href="#"><cite>取消</cite></a></span></div></div>'+
                        '</div>'+
                    '</div>'
	
};
