/**
 * @fileoverview 留言列表
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-25
 */

$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/ui/pagination.js");
$import("sina/ui/slide.js");

$import("lib/dialogConfig.js");
$import("lib/interface.js");
$import("lib/login/loginPost.js");
$import("lib/blogv/getVHTML.js");

$import("msg/guestBook.js");
$import("product/guestBook/templates/guestBookListTemplate.js");
$import("product/guestBook/writeBackField.js");
$import("other/getPromoteURL.js");
$import("lib/uic.js");
/**
 * 留言列表类
 */
scope.GuestBookList=Core.Class.create();
scope.GuestBookList.prototype = {
	
	/**
	 * 要更新的模板节点名称数组
	 */
	nodeNames:["guestBookArea","linkFace","imgFace","userInfo","messageDateTime","btnWriteBackMessage","btnDeleteMessage","btnReport","txtMessageContent","divWriteBack"],
	
	/*
	 * BEGIN:  modifed by W.Qiang | wangqiang1@staff.sina.com.cn, 2011-03-14
	 * 新增营销推广地址
	 */
	"PromoteUserBlogInterface" : new Interface("http://control.blog.sina.com.cn/riaapi/profile/AdTaskTools.php", "jsload"),
	/*END: modifed by W.Qiang | wangqiang1@staff.sina.com.cn, 2011-03-14*/
	
	/**
	 * 获取数据的偏移量
	 */
	offset:0,
	
	/**
	 * 每次获取的最大数据条数
	 */
	limit:20,
	
	/**
	 * 留言数据请求接口
	 */
	interfaceMessage:null,
	
	/**
	 * 删除留言接口
	 */
	interfaceRemoveMessage:null,
	
	/**
	 * 留言列表显示区域
	 */
	divMessageList:null,
	
	/**
	 * 初始化
	 */
	initialize:function(){
		this.interfaceMessage=new Interface("http://wall.cws.api.sina.com.cn/list3.php","jsload");		
		//this.interfaceRemoveMessage=new Interface("http://wall.cws.api.sina.com.cn/delete.php","jsload");
		this.interfaceRemoveMessage=new Interface("http://control.blog.sina.com.cn/blog_rebuild/riaapi/profile/note/gbookdelete.php","ijax"); //全部调整了ijax的POST方式
		this.divMessageList=$E("divMessageList");
	},
	
	/**
	 * 根据pageID显示留言列表
	 * @param {Number} pageID 要显示的页号
	 * @param {Function} callBack 回调方法
	 */
	display:function(pageID,callBack){
		pageID = pageID || 1;
		this.offset = (pageID - 1) * this.limit;
		this._update(callBack);
	},
	
	/**
	 * 删除留言
	 * @param {String} messageID 留言唯一ID
	 */
	remove:function(messageID){
		var _this=this;
		Lib.checkAuthor();
		
		var links=$E("userInfo_"+messageID).getElementsByTagName("a"),
			friendUID=links.length>0?links[0].href.split("/").pop():"";
		var styleState="";
		if($UID==friendUID||friendUID==0){
			styleState=' style="display:none" ';
		}
		if ($isAdmin) {
			winDialog.confirm("确认需要删除此条留言?", {
				subText:'<div '+styleState+'><input id="ccbAddToBlock" type="checkbox"/><label for="ccbAddToBlock">将此人加入黑名单</label></div>',
				textOk:'删除',
				funcOk: function(){
					//修改提交方式POST jiangwei 20140408
					_this.interfaceRemoveMessage.request({
						POST: {
							msgid: messageID,
							uid: $UID,
							friend_uid: friendUID,
							inblack: ($E("ccbAddToBlock").checked?1:0)
						},
						onSuccess: function(data){
							if (parseInt(data["rows"]) > 0) {
								var slide = new Ui.Slide($E("guestBookArea_"+messageID));
                				slide.onSlideOut = function(){
									_this.onRemoved();			                    
                				};
                				slide.slideOut();
								$E("btnReport_"+messageID).onclick="";
							}
						},
						onError: function(data){	
							if(data["code"] == 'A00023')
							{
								winDialog.alert('删除成功，黑名单已达到上限', {
									 funcOk: function(){
										if (parseInt(data["rows"]) > 0) {
											var slide = new Ui.Slide($E("guestBookArea_"+messageID));
			                				slide.onSlideOut = function(){
												_this.onRemoved();			                    
			                				};
			                				slide.slideOut();
											$E("btnReport_"+messageID).onclick="";
										}
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
		}
	},
	
	/**
	 * 成功删除一条留言后触发
	 */
	onRemoved:function(){
		
	},
	
	
	/**
	 * 呈现留言数据
	 * @param messages 消息列表对象数组
	 * 			[{"msgid":"11","uid":"1141100895","msg":"nihao","time":"2009-01-07 17:07:08","extinfo":"reply=1171541980","nick":"\u597d\u5927\u7684\u98ce","reply_nick":"\u946b\u54c8"},
	 *			{"msgid":"10","uid":"1141100895","msg":"nihaoareyou","time":"2009-01-07 10:30:50","extinfo":"","nick":"\u597d\u5927\u7684\u98ce"}]
	 */
	_render:function(messages){
		var me = this;
		//没有留言数据
		if(!messages || messages.length==0){
			this.divMessageList.innerHTML='<div class="SG_nodata">暂无留言</div>';
			scope.guestBookHasDatas = 'no';
			scope.guestBookHasNext = 'no';
			return;
		}
		scope.guestBookHasDatas = 'yes';
		
		var _this=this;

		var i,len=messages.length;
		scope.guestBookHasNext = len == me.limit ? 'yes' : 'no';
		var writeBackFields=[];
		
		this.divMessageList.innerHTML="";

        var getVHTML = Lib.blogv.getVHTML;
		for (i = 0; i < len; i++) {
			var messageID = messages[i]["msgid"];
            
			this.divMessageList.innerHTML += this._getNodesUpdatedHTML(scope.guestBookListTemplate, messageID, this.nodeNames);
			
			//留言内容
			$E("txtMessageContent_" + messageID).innerHTML = messages[i]["msg"];
			
			//用户头像
			$E("imgFace_"+messageID).src=this.getFaceURL(messages[i]["uid"]);
			$E("imgFace_"+messageID).title=messages[i]["nick"];
			
			/*
			 * BEGIN:  modifed by W.Qiang | wangqiang1@staff.sina.com.cn, 2011-03-14
			 * 新增营销推广地址
			 */
			//用户头像链接--deleted by W.Qiang | wangqiang1@staff.sina.com.cn, 2011-03-14
//			if(messages[i]["uid"]==1259295385){
//				var url=$E("linkFace_"+messageID).href='http://sina.allyes.com/main/adfclick?db=sina&bid=204720,285857,291088&cid=0,0,0&sid=284105&advid=358&camid=37389&show=ignore&url=http://blog.sina.com.cn/u/'+messages[i]["uid"];
//			}else{
//				var url=$E("linkFace_"+messageID).href="http://blog.sina.com.cn/u/"+messages[i]["uid"];
//			}
			
			var url = scope.getPromoteURL(messages[i]);
			$E("linkFace_"+messageID).href = url;
			
			/*END: modifed by W.Qiang | wangqiang1@staff.sina.com.cn, 2011-03-14*/
			
			//用户名
            var userInfo = '<a target="_blank" href="' + url + '">' + messages[i]["nick"] +'</a>';
            var wtype = messages[i]["wtype"];
            wtype = wtype === "undefined"?-1:parseInt(wtype);
            userInfo += getVHTML(wtype);

			//如果有回复的用户则显示其昵称
			if (messages[i]["extinfo"] && messages[i]["extinfo"].replace(/\s/g, "") != "") {
                
				var replyUID = messages[i]["extinfo"].split("=").length > 0 ? messages[i]["extinfo"].split("=")[1] : "";
                var exUserInfo = ' <strong>回复</strong> <a target="_blank" href="http://blog.sina.com.cn/u/' + replyUID + '">' + messages[i]["reply_nick"] + '</a>';
                var rwtype = messages[i]["rwtype"];
                rwtype = (rwtype === "undefined") ? -1 : parseInt(rwtype);
                exUserInfo += getVHTML(rwtype);
				userInfo = userInfo + exUserInfo + '：';
			}
			$E("userInfo_" + messageID).innerHTML = userInfo
			//留言日期时间
			$E("messageDateTime_" + messageID).innerHTML = messages[i]["time"];
			
			//回复区域面板对象数组
			writeBackFields[i] = new scope.WriteBackField(messageID,messages[i]["uid"]);
			writeBackFields[i].onReplied = function(){
				_this.display(1);
				this.hidden();
				window.location = window.location.toString().replace(/#.*/, "") + "#divMessageList";
				
			};
		}
		
		//举报
		for(i=0;i<len;i++){
			$E("btnReport_"+messages[i]["msgid"]).onclick=function(idx){
				var hostNickName="";
				return function(){
						//window.report && window.report(messages[idx]["msgid"]);
						var cID = messages[idx]["msgid"]
						var BR=new Lib.BlogReport();
						var nickName = '',
						bodyID=scope.$uid+"_"+cID,
						links=$E("userInfo_"+cID).getElementsByTagName("a"),
						reportUID=links.length>0?links[0].href.split("/").pop():"",
						nickName=links.length>0?links[0].innerHTML:"新浪网友",						
						userNameInfo1=$E("userInfo_"+cID).innerHTML,						
						userNameInfo2='',
						titleInfo='',
						contentInfo=$E("txtMessageContent_"+cID).innerHTML;						
						//获取博主昵称
						if (hostNickName === "") {
							// var url = "http://uic.internal.sina.com.cn/uic/Query.php?" + "UID="+ scope.$uid +"&Check=null&UserInfoTypes=[1]&ProductType=2";
							// Utils.Io.JsLoad.request(url, {
							// 	onComplete: function(result){
							// 		hostNickName=result && result.UserInfo && result.UserInfo[0][1];
							// 		BR.start("guestBook",nickName,bodyID,reportUID,userNameInfo1,'<a target="_blank" href="http://blog.sina.com.cn/u/'+scope.$uid+'">'+hostNickName+'</a>',titleInfo,contentInfo);
							// 	},
							// 	onException: function(){
							// 		BR.start("guestBook","新浪网友",bodyID,reportUID,userNameInfo1,"<strong>新浪网友</strong>",titleInfo,contentInfo);
							// 	}
							// });
							Lib.Uic.getNickName([scope.$uid],function(result){
								if(result && result[scope.$uid]){
									hostNickName=result[scope.$uid];
									BR.start("guestBook",nickName,bodyID,reportUID,userNameInfo1,'<a target="_blank" href="http://blog.sina.com.cn/u/'+scope.$uid+'">'+hostNickName+'</a>',titleInfo,contentInfo);
								}else{
									BR.start("guestBook","新浪网友",bodyID,reportUID,userNameInfo1,"<strong>新浪网友</strong>",titleInfo,contentInfo);
								}
							});
						}else{
							userNameInfo2='<a target="_blank" href="http://blog.sina.com.cn/u/'+scope.$uid+'">'+hostNickName+'</a>';
							BR.start("guestBook",nickName,bodyID,reportUID,userNameInfo1,userNameInfo2,titleInfo,contentInfo);
						}
						return false;
								
				};
			}(i);
		}
		
		
		//该留言的博主才能管理权限
		Lib.checkAuthor();
		if ($isAdmin) {
			//循环给按钮绑定事件
			for (i = 0; i < len; i++) {
				//删除留言按钮
				$E("btnDeleteMessage_" + messages[i]["msgid"]).innerHTML="[删除]";
				Core.Events.addEvent($E("btnDeleteMessage_" + messages[i]["msgid"]), (function(idx){
					return function(){
						_this.remove(messages[idx]["msgid"]);
					};
				})(i), "click");
				
				
				//显示回复区域面板按钮
				if (messages[i]["uid"] != scope.$uid) {
					$E("btnWriteBackMessage_" + messages[i]["msgid"]).innerHTML = "[回复]";
					Core.Events.addEvent($E("btnWriteBackMessage_" + messages[i]["msgid"]), (function(idx){
						return function(){
							writeBackFields[idx].show();
						};
					})(i), "click");
				}
				writeBackFields[i].onShow=function(idx){
					return function(){
						writeBackFields[idx].txtContent.focus();
						$E("btnWriteBackMessage_" + messages[idx]["msgid"]).style.display="none";
					};
				}(i);
				writeBackFields[i].onHidden=function(idx){
					return function(){
						$E("btnWriteBackMessage_" + messages[idx]["msgid"]).style.display = "";
					};
				}(i);
			}
		}

		
	},
	
	/**
	 * 根据用户昵称获取头像地址
	 * @param {String} uid
	 */
	getFaceURL:function(uid){
		var n=parseInt(uid) % 8 + 1;
		return "http://portrait"+n+".sinaimg.cn/"+uid+"/blog/50";
	},
	/**
	 * 请求留言更新留言数据--add by wangqiang1
	 * @param {Function} callBack 回调方法
	 * @param {Object} promoteUid 需要营销推广的用户ID
	 */
	_getMessage : function(callBack,promoteUid)
	{
		var _this=this;
		if(!promoteUid){
			promoteUid = {};
		}
		this.interfaceMessage.request({
				GET : {
					uid:scope.$uid,	
					offset:_this.offset,
					limit:_this.limit
				},
				onSuccess : function (data) {
					var _list = data.list;
					if(_list instanceof Array){
						Core.Array.foreach(_list, Core.Function.bind2(function(o){
							if(promoteUid[o.uid]){
								o["isPromote"] = true;
							}
						}, this));
					}
					_this._render(_list);
					if(callBack){
						callBack(_list.length);
					}
				},
				onError : function (data) {
					//博主设置了留言为隐私数据
					if (data["code"] == "A00101") {
						_this.onPermissionDenied();
					}
					else {
						winDialog.alert($GUESTBOOK_MSG[data["code"]], {
							icon: "02"
						});
					}
				},
				onFail : function (){
				}
			});
	},
	
	/**
	 * 请求留言更新留言数据
	 * 新增博客营销推广--add by wangqiang1
	 * @param {Function} callBack 回调方法
	 */
	_update:function(callBack){
		var _this=this;
		/*
		 * BEGIN:  modifed by W.Qiang | wangqiang1@staff.sina.com.cn, 2011-03-14
		 * 新增营销推广地址
		 */
		this.PromoteUserBlogInterface.request({
				GET			: {
					uid : scope.$uid
				}
				,onSuccess  :  Core.Function.bind2(function (promoteData) {
					var promoteUidStr = promoteData["HtAdTaskToolsUids"];
					if(!promoteUidStr){
						promoteUidStr = "";
					}
					var promoteUidArray = promoteUidStr.split(",");
					var length = promoteUidArray.length;
					var promoteUid = {};
					Core.Array.foreach(promoteUidArray, Core.Function.bind2(function(v){
						promoteUid[v] = true;
					}, this));
					//加载访客
					//this.requestParam.varname = "requestId_9134300";
					_this._getMessage(callBack,promoteUid);
				}, this)
				,onError	:  Core.Function.bind2(function (data) {
					//var promoteUid = {1615954924:true,2014483223:true}
					//_this._getMessage(callBack,promoteUid);
					_this._getMessage(callBack);
				}, this)
				,onFail		:  Core.Function.bind2(function (data) {
					//var promoteUid = {1615954924:true,2014483223:true}
					//_this._getMessage(callBack,promoteUid);
					_this._getMessage(callBack);
				}, this)
			});
		/*END: modifed by W.Qiang | wangqiang1@staff.sina.com.cn, 2011-03-14*/
	},
	
	/**
	 * 当前博主设置了留言为隐私，无访问权限时触发
	 */
	onPermissionDenied:function(){
		
	},
	
	/**
	 * 获取更新模板获取节点后的HTML
	 * @param {String} tempalte 模板
	 * @param {String} ID 留言的唯一ID
	 * @param {Array} nodeNames 要更新的节点名称
	 * @descriptioin
	 * 		ID="100"
	 * 		"<div id="#{divContent}"></div>"
	 * 		替换成
	 * 		"<div id="divContent_100"></div>"
	 */
	_getNodesUpdatedHTML:function(template,messageID,nodeNames){
		var i,len=nodeNames.length;
		for(i=0;i<len;i++){
			template=template.replace(new RegExp("#\{" + nodeNames[i]+"\}","g"),nodeNames[i] + "_" + messageID);
		}
		return template;
	}
	
	
};