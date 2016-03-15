$import('sina/core/system/winSize.js');
$import("sina/utils/cookie/getCookie.js");
$import("sina/utils/cookie/setCookie.js");
$import("lib/component/msnGuide/JsLoadEx.js");
$import("lib/component/msnGuide/msnGuideDivTemplate.js");
$import("lib/component/msnGuide/TweenStrategyEx.js");
$import("sina/core/events/stopEvent.js");
/**
 * @fileoverview msn搬家用户引导组件
 * @author zhangkai2@staff.sina.com.cn
 * @created 2010-12-22
 */
scope.msnGuide={
		/**
		 * 创建msn引导div
		 */
        createMSNGuideDiv: function(){
			
			//点击彩蛋 记录到本地 下次访问不再显示彩蛋
			this.recordFlashClick1();
			
            var msnGuideDiv = $C("div");
			msnGuideDiv.id="msnGuide_MSNGuideDiv";
            msnGuideDiv.style.position = "absolute";
            msnGuideDiv.style.zIndex = "2000";
            msnGuideDiv.className = "movePop";
            msnGuideDiv.innerHTML = scope.msnGuideDivTemplateHTML;
            document.body.appendChild(msnGuideDiv);
            
			var elementWidth=msnGuideDiv.offsetWidth,
				elementHeight=msnGuideDiv.offsetHeight;
				
            //计算引导div显示位置
            var winSize = Core.System.winSize();
            msnGuideDiv.style.left = (winSize.width - elementWidth) / 2 + "px";
            msnGuideDiv.style.top = (winSize.height - elementHeight) / 2 + Math.max(document.documentElement.scrollTop, document.body.scrollTop) + "px";
            
            //判断是connect用户还是非connect用户 并显示相应的界面
			//用cookie msnBindInfo来判断是否已经绑定  uid_1才是绑定
			var msnBindInfo=Utils.Cookie.getCookie('msnBindInfo');
            
			if(scope.msnGuide.isConnect || (msnBindInfo && msnBindInfo===$UID+"_1")){
				//connect用户
				//判断是否发送过问候
                //通过scope.private.moveMedal 字段判断
				//这个属性不为undefined 则该用户发送过邀请
				//如果这个属性等于1 则是更换徽章
                if(scope.msnGuide.isRegard || (scope.$private && typeof scope.$private.moveMedal !== "undefined")){
					//发送过问候 
					this.displayModuleById("msnGuide_RegardSuccess",true);
				}else{
					//没发送过问候 显示问候界面
					this.displayModuleById("msnGuide_MSNRegard",true);
				}
			}else{
				//非connect用户
				this.displayModuleById("msnGuide_Connect",false);
			}
			//更改收藏博客地址url 规律为http://blog.sina.com.cn/u/ + 用户uid
			$E("msnGuide_AddToMyFavorite").href="http://blog.sina.com.cn/u/"+$UID;
			
			//点击彩蛋数据统计
			scope.msnGuideSupport.JsLoadEx.request("http://control.blog.sina.com.cn/blog_rebuild/msn/api/msnGuideCount.php?type=hit",{
				onComplete: function(){}
			});
			
			msnGuideDiv.style.display="none";
			
			//播放显示动画特效
			this.playShowEffect(msnGuideDiv,elementWidth,elementHeight);
			
			//为msn发送邀请输入用户名密码界面2个input添加回车提交事件
			Core.Events.addEvent($E("menGuide_MSNUserName"),function(e){
				if(e.keyCode===13){
					scope.msnGuide.sendRegards();
					Core.Events.stopEvent(e);
				}
			},"keydown");
			Core.Events.addEvent($E("menGuide_MSNPassword"),function(e){
				if(e.keyCode===13){
					scope.msnGuide.sendRegards();
					Core.Events.stopEvent(e);
				}
			},"keydown");
        },
		/**
		 * msn搬家引导显示特效
		 */
		playShowEffect:function(msnGuideDiv,elementWidth,elementHeight){
			var topStartValue=elementHeight/2,
				topEndValue=0,
				leftStartValue=elementWidth/2,
				leftEndValue=0,
				bottomStartValue=elementHeight/2,
				bottonEndValue=elementHeight,
				rightStartValue=elementWidth/2,
				rightEndValue=elementWidth;
				
				msnGuideDiv.style.clip="rect("+topStartValue+"px"+" "+rightStartValue+"px"+" "+bottomStartValue+"px"+" "+leftStartValue+"px"+")";
				msnGuideDiv.style.display="block";
				var showTween=new scope.msnGuideSupport.TweenStrategyEx([topStartValue,rightStartValue,bottomStartValue,leftStartValue],[topEndValue,rightEndValue,bottonEndValue,leftEndValue],0.5);
				showTween.onTween=function(v){
					msnGuideDiv.style.clip="rect("+v[0]+"px"+" "+v[1]+"px"+" "+v[2]+"px"+" "+v[3]+"px"+")";
				}
				showTween.start();
		},
		/**
		 * msn搬家引导关闭特效
		 */
		playHideEffect:function(msnGuideDiv){
			
			//清除缓存数据
			scope.msnGuide.friendListData=null;
			
			var elementWidth=msnGuideDiv.offsetWidth,
				elementHeight=msnGuideDiv.offsetHeight,
				topStartValue=0,
				topEndValue=elementHeight/2,
				leftStartValue=0,
				leftEndValue=elementWidth/2,
				bottomStartValue=elementHeight,
				bottonEndValue=elementHeight/2,
				rightStartValue=elementWidth,
				rightEndValue=elementWidth/2;
				
				var hideTween=new scope.msnGuideSupport.TweenStrategyEx([topStartValue,rightStartValue,bottomStartValue,leftStartValue],[topEndValue,rightEndValue,bottonEndValue,leftEndValue],0.5);
				hideTween.onTween=function(v){
					msnGuideDiv.style.clip="rect("+v[0]+"px"+" "+v[1]+"px"+" "+v[2]+"px"+" "+v[3]+"px"+")";
				}
				hideTween.onEnd=function(){
					if($E("msnGuide_MSNGuideDiv")){
						document.body.removeChild($E("msnGuide_MSNGuideDiv"));
					}
				};
				hideTween.start();
		},
		/**
		 * connect用户和非connect用户的选项卡切换
		 * @param {Object} domElement 激活click事件的dom元素
		 * @param {Boolean} isConnect true connect用户,false 非connect用户
		 */
		switchTab:function(domElement,isConnect){
			//点击的tab当前是选中状态 返回
			if(/[a-z]+[ ]+[a-z]+/i.test(domElement.className)){
				return;
			}
			if(isConnect){
				if(domElement.className==="rgt"){
					//切换到 新浪朋友在等你
					domElement.previousSibling.className="lft";
					domElement.className="rgt rgtact";
					this.getUserFriendList();
				}else{
					//切换到 问候msn老友
					domElement.nextSibling.className="rgt";
					domElement.className="lft lftact";
					//判断是否已经发送过问候 
					if(scope.msnGuide.isRegard/* 本次是否问候过 */ || (scope.$private && typeof scope.$private.moveMedal !== "undefined")/* 这个属性由服务器端输出 标识曾经是否问候过*/){
						//已经问候过
						this.displayModuleById("msnGuide_RegardSuccess",true);
					}else{
						//没有问候过 显示问候界面
						this.displayModuleById("msnGuide_MSNRegard",true);
					}
				}
			}else{
				if(domElement.className==="rgt"){
					//切换到   问候msn老友
					domElement.previousSibling.className="lft";
					domElement.className="rgt rgtact";
					//判断是否已经发送过问候 
					if(scope.msnGuide.isRegard/* 本次是否问候过 */ || (scope.$private && typeof scope.$private.moveMedal !== "undefined")/* 这个属性由服务器端输出 标识曾经是否问候过*/){
						//已经问候过 
						this.displayModuleById("msnGuide_RegardSuccess",false);
						
					}else{
						//没有问候过 显示问候界面
						this.displayModuleById("msnGuide_MSNRegard",false);
					}
				}else{
					//切换到   新浪朋友在等你
					domElement.nextSibling.className="rgt";
					domElement.className="lft lftact";
					//判断是否已经连接过
					if(!scope.msnGuide.isConnect){
						//如果没连接过 跳转到连接界面
						this.displayModuleById("msnGuide_Connect",false);
					}else{
						//如果连接过 跳转到好友列表界面
						this.getUserFriendList();
					}
				}
			}
		},
		/**
		 * 好友列表和msn问候模块之间切换
		 * @param {String} goToWhere
		 */
		switchModuleBetweenMSNRegardsAndFriendList:function(goToWhere){
			var isConnect=$E("msnGuide_ConnectTab").style.display==="none"?false:true,
				target;
			if(goToWhere==="friend"){
				target=isConnect?$E("msnGuide_ConnectTab").getElementsByTagName("a")[1]:$E("msnGuide_NotConnectTab").getElementsByTagName("a")[0];
			}else if(goToWhere==="regards"){
				target=isConnect?$E("msnGuide_ConnectTab").getElementsByTagName("a")[0]:$E("msnGuide_NotConnectTab").getElementsByTagName("a")[1];
			}
			//如果是选中状态 去掉选中状态
			target.className=target.className.split(/[ ]+/)[0];
			this.switchTab(target,isConnect);
		},
		/**
		 * 更新好友关注状态
		 * @param {Array} uids 好友的uid集合
		 */
		updateFriendConcernState:function(uids){
			var fData=scope.msnGuide.friendListData,i,n;
			for(n=0;n<uids.length;n++){
				for (i = 0; i < fData.length; i++) {
					if(uids[n]==fData[i].uid){
						fData[i].isAtt=1;
					}
				}
			}
		},
		/**
		 * 关注当前显示好友
		 */
		concernCurrentFriend:function(){
			var _this=this;
			var aids=new String();
			var aidsArr=[];
			var liArr=$E("msnGuide_FriendListContainer").getElementsByTagName("li");
			for(var i=0;i<liArr.length;i++){
				if(liArr[i].className==="xz"){
					aids+=liArr[i].getAttribute("uid")+",";
					aidsArr[aidsArr.length]=liArr[i].getAttribute("uid");
				}
			}
			if(aids.valueOf()===""){
				return;
			}
			
			//显示loading...
			$E("msnGuide_Loading").style.display="block";
			
			//以,结尾 截断,
			if(aids.lastIndexOf(",")===aids.length-1){
				aids=aids.substring(0,aids.length-1);
			}
			
			var url="http://control.blog.sina.com.cn/riaapi/reg/attention_add_batch.php?from=msn_guide&uid="+$UID+"&aids="+aids;
			scope.msnGuideSupport.JsLoadEx.request(url,{
				onComplete:function(result){
					$E("msnGuide_Loading").style.display="none";
					if(result && result.code && result.code==="A00006"){
						//更新好友状态
						_this.updateFriendConcernState(aidsArr);
						//关注成功
						_this.displayModuleById("msnGuide_ConcernSuccess",$E("msnGuide_ConnectTab").style.display==="none"?false:true);
					}else{
						//关注失败
						_this.displayModuleById("msnGuide_ConcernFailure",$E("msnGuide_ConnectTab").style.display==="none"?false:true);
					}
				}
			});
		},
		/**
		 * 关注所有msn好友
		 */
		concernAllFriends:function(){
			var _this=this;
			var aids=new String();
			var aidsArr=[];
			var friendData=scope.msnGuide.friendListData;
			for(var i=0;i<friendData.length;i++){
				if(friendData[i].type !=="tj" && friendData[i].isAtt === 0){
					aids+=friendData[i].uid+",";
					aidsArr[aidsArr.length]=friendData[i].uid;
				}
			}
			if(aids.valueOf()===""){
				return;
			}
			//显示loading...
			$E("msnGuide_Loading").style.display="block";
			//以,结尾 截断,
			if(aids.lastIndexOf(",")===aids.length-1){
				aids=aids.substring(0,aids.length-1);
			}
			var url="http://control.blog.sina.com.cn/riaapi/reg/attention_add_batch.php?from=msn_guide&uid="+$UID+"&aids="+aids;
			scope.msnGuideSupport.JsLoadEx.request(url,{
				onComplete:function(result){
					$E("msnGuide_Loading").style.display="none";
					if(result && result.code && result.code==="A00006"){
						//更新好友状态
						_this.updateFriendConcernState(aidsArr);
						//关注成功
						_this.displayModuleById("msnGuide_ConcernSuccess",$E("msnGuide_ConnectTab").style.display==="none"?false:true);
					}else{
						//关注失败
						_this.displayModuleById("msnGuide_ConcernFailure",$E("msnGuide_ConnectTab").style.display==="none"?false:true);
					}
				}
			});
		},
		/**
		 * 选中所有好友
		 * @param {Object} checkboxObj 全选checkbox
		 */
		selectAll:function(checkboxObj){
			var liArr=$E("msnGuide_FriendListContainer").getElementsByTagName("li");
			for(var i=0;i<liArr.length;i++){
				if(liArr[i].className!=="yx"){
					liArr[i].className=checkboxObj.checked?"xz":"";
				}
			}
		},
		/**
		 * 如果点击过flash 记录到flash cookie中
		 * 点击彩蛋中的不再显示按钮 调用此函数
		 * 并发送数据统计
		 */
		recordFlashClick:function(){
			//移除彩蛋
			if($E("msnGuide_MulticolorEggFlashContainer")){
				document.body.removeChild($E("msnGuide_MulticolorEggFlashContainer"));
			}

			if (Lib.LocalDB.FlaDom) {
				Lib.LocalDB.set("msnGuideFlashClicked_"+$UID,"clicked");
			}else{
				var localStoreFlashContainer=$C("div");
				localStoreFlashContainer.id="localStoreFlashContainer";
				localStoreFlashContainer.style.cssText="position:absolute;left:0;top:0;";
				document.body.appendChild(localStoreFlashContainer);
				Lib.LocalDB.regiFun.push(function(){
					Lib.LocalDB.set("msnGuideFlashClicked","clicked");
				});
				Lib.LocalDB.loadFlash(localStoreFlashContainer);
			}
			
			//点击彩蛋不再显示按钮 数据统计
			scope.msnGuideSupport.JsLoadEx.request("http://control.blog.sina.com.cn/blog_rebuild/msn/api/msnGuideCount.php?type=closeNer",{
				onComplete: function(){}
			});
		},
		/**
		 * 如果点击过flash 记录到flash cookie中
		 */
		recordFlashClick1:function(){
			//移除彩蛋
			if($E("msnGuide_MulticolorEggFlashContainer")){
				document.body.removeChild($E("msnGuide_MulticolorEggFlashContainer"));
			}

			if (Lib.LocalDB.FlaDom) {
				Lib.LocalDB.set("msnGuideFlashClicked_"+$UID,"clicked");
			}else{
				var localStoreFlashContainer=$C("div");
				localStoreFlashContainer.id="localStoreFlashContainer";
				localStoreFlashContainer.style.cssText="position:absolute;left:0;top:0;";
				document.body.appendChild(localStoreFlashContainer);
				Lib.LocalDB.regiFun.push(function(){
					Lib.LocalDB.set("msnGuideFlashClicked","clicked");
				});
				Lib.LocalDB.loadFlash(localStoreFlashContainer);
			}
		},
		/**
		 * 根据id显示该模块 并隐藏其他模块
		 * @param {String}  id  要显示的模块id
		 * @param {Boolean} isConnect connect用户还是非connect用户
		 */
		displayModuleById:function(id,isConnect){
			var ids=["msnGuide_ConnectTab",
					"msnGuide_NotConnectTab",
					"msnGuide_MSNRegardArea",
					"msnGuide_MSNRegard",
					"msnGuide_RegardLoading",
					"msnGuide_RegardError",
					"msnGuide_RegardSuccess",
					"msnGuide_Connect",
					"msnGuide_MSNForm",
					"msnGuide_ConcernSuccess",
					"msnGuide_ConcernFailure",
					"msnGuide_FriendList",
					"msnGuide_UsernameOrPasswordError",
					"msnGuide_ChangeBadgeInfo"
					];
			for(var i=0;i<ids.length;i++){
				$E(ids[i]).style.display="none";
			}
			$E(id).style.display="block";
			if(id==="msnGuide_MSNRegard" || id==="msnGuide_RegardLoading" || id==="msnGuide_RegardError" || id==="msnGuide_RegardSuccess" ||id==="msnGuide_Connect" || id==="msnGuide_MSNForm"){
				$E("msnGuide_MSNRegardArea").style.display="block";
			}
			//如果 显示问候成功模块 判断是否需要显示更换徽章信息
			if(id==="msnGuide_RegardSuccess" && (scope.$private && scope.$private && scope.$private.moveMedal/*这个属性由服务器输出*/ === 1 || scope.msnGuide.isChangeBadge/*这个属性由客户端保存 记录本次登录发送过问候 */)){
				$E("msnGuide_ChangeBadgeInfo").style.display="";
			}
			
			$E(isConnect?"msnGuide_ConnectTab":"msnGuide_NotConnectTab").style.display="block";
		},
		/**
		 * 循环检测reg_token reg_token为在微软登录成功后返回的标识
		 */
        msnrefreshWindow: function(){
            if (Utils.Cookie.getCookie('reg_token')) {
                var tk = Utils.Cookie.getCookie('reg_token');
				Utils.Cookie.setCookie('reg_token', '', '', '/', '.blog.sina.com.cn');
                this.msnBinding(tk);
            }
            else {
                setTimeout(function(){scope.msnGuide.msnrefreshWindow();}, 1000);
            }
        },
		/**
		 * 绑定msn
		 * @param {String} token 微软登录成功后返回的标识
		 */
        msnBinding: function(token){
			var _this=this;
            var cur_uid = scope.$uid;
            if (cur_uid) {
                scope.msnGuideSupport.JsLoadEx.request("http://control.blog.sina.com.cn/blog_rebuild/msn/api/setLink.php?token=" + token, {
                    onComplete: function(result){
						if(result && result.code && result.code==="A00006"){
							//绑定成功
							scope.msnGuide.isConnect=true;
							//获得好友列表
							_this.getUserFriendList();
						}else{
							//绑定失败
						}
                    }
                });
              
            }
        },
		/**
		 * 获得用户所有好友列表数据
		 */
		getUserFriendList:function(){
			//显示loading 隐藏全选区域
			$E("msnGuide_FriendListContainer").innerHTML='<li class="waiting"><p>正在查找搬家好友</p></li>';
			$E("msnGuide_SelectAllAndGetFriendListArea").style.display="none";
			
			this.displayModuleById("msnGuide_FriendList",$E("msnGuide_ConnectTab").style.display==="none"?false:true);
			
			var _this=this;
			
			//如果好友数据已加载了 则不再请求接口
			if(scope.msnGuide.friendListData){
				getUserFriendListCallback(scope.msnGuide.friendListData);
				return;
			}
			
			//隐藏关注 超时按钮
			$E("msnGuide_ConcernArea").style.display="none";
			$E("msnGuide_TimeoutArea").style.display="none";
			
            scope.msnGuideSupport.JsLoadEx.request("http://control.blog.sina.com.cn/blog_rebuild/msn/api/getUserFriList.php", {
				onComplete: function(getUserFriListResult){
					if (getUserFriListResult && getUserFriListResult.code && getUserFriListResult.code === "A00006") {
						$E("msnGuide_ConcernArea").style.display="";
						//更新好友数量
						var msnFirendCounter=0;
						for(var i=0;i<getUserFriListResult.data.length;i++){
							if(getUserFriListResult.data[i].type!=="tj"){
								msnFirendCounter++;
							}
						}
						$E("msnGuide_TotalMSNFriendNumber").innerHTML="有"+msnFirendCounter+"个你的MSN好友在新浪博客生活";
						scope.msnGuide.friendListData=getUserFriListResult.data;
						getUserFriendListCallback(getUserFriListResult.data);
					}else if(getUserFriListResult.code.toLowerCase() === "c10007"){
						//token失效 重新连接
						_this.displayModuleById("msnGuide_Connect",false);
					}else if(getUserFriListResult.code.toLowerCase() === "c10003"){
						//未及时同步
						$E("msnGuide_TimeoutArea").style.display="";
					}
                },
				timeout:10000,
				onException:function(){
					$E("msnGuide_TimeoutArea").style.display="";
				}
            });
			
			/**
			 * 获得用户所有好友列表数据回调函数
			 */
			function getUserFriendListCallback(friendData){
				$E("msnGuide_SelectAllAndGetFriendListArea").style.display="";
				$E("msnGuide_TotalMSNFriendNumber").style.display="";
				//如果好友数量大于12 显示换一组按钮 否则隐藏
				$E("msnGuide_GetFriendListButton").style.display=friendData.length>12?"":"none";
				
                //获得好友列表成功 更新好友列表
				setTimeout(function(){
					_this.updateFriendListArea(1);
				},10);
                
                _this.displayModuleById("msnGuide_FriendList",$E("msnGuide_ConnectTab").style.display==="none"?false:true);
			}
		},
		/**
		 * 根据页数更新当前好友数据
		 * @param {Number} currentPage 当前页
		 */
		updateFriendListArea:function(currentPage){
			
			//勾选全选
			$E("msnGuide_SelectAll").checked=true;
						
			var friendData=scope.msnGuide.friendListData;
			
			var totalPage=Math.ceil(scope.msnGuide.friendListData.length/12);
			if(currentPage<0 || currentPage>totalPage){
				currentPage=1;
			}
			scope.msnGuide.currentPage=currentPage;
			//好友数据全部返回 翻页在客户端进行 服务器端数据总是12的倍数
			var friendListHTMLContents=[];
			for(var i=(currentPage-1)*12;i<(currentPage-1)*12+12;i++){
				//如果msn好友名字长度大于5 则只显示前5个字符
				var msnName=friendData[i].name;
				if(msnName.length>5){
					msnName=msnName.substring(0,5);
				}
				friendListHTMLContents[i]='<li class="'+(friendData[i].isAtt===1?"yx":"xz")+'" uid="'+friendData[i].uid+'" ><a '+(friendData[i].isAtt!==1?"onclick='scope.msnGuide.concernOrNot(this);return false;'":"")+' href="javascript:void(0)" class="pic"><img src="'+friendData[i].pic+'" alt="" /></a><em '+(friendData[i].isAtt!==1?"onclick='scope.msnGuide.concernOrNot(this);return false;'":"")+' class="spic"></em><span><a href="'+"http://blog.sina.com.cn/u/"+friendData[i].uid+'" target="_blank">'+msnName+'</a></span><span>'+(friendData[i].type!=="tj"?"MSN好友":"新浪名博")+'</span></li>';
			}
			$E("msnGuide_FriendListContainer").innerHTML=friendListHTMLContents.join("");
		},
		/**
		 * 是否关注某人
		 * @param {Object} obj 被点击的元素
		 */
		concernOrNot:function(obj){
			var liObj=obj.parentNode;
			liObj.className=liObj.className==="xz"?"":"xz";
			//如果取消一个  去掉全选选中状态
			if(liObj.className===""){
				$E("msnGuide_SelectAll").checked=false;
			}
			obj.blur();
			
			//遍历所有好友 如果都是关注状态 勾选全选
			var isSelectAll=true;
			var liArr=$E("msnGuide_FriendListContainer").getElementsByTagName("li");
			for(var i=0;i<liArr.length;i++){
				if(liArr[i].className!=="yx" && liArr[i].className!=="xz"){
					isSelectAll=false;
				}
			}
			if(isSelectAll){
				$E("msnGuide_SelectAll").checked=true;
			}
		},
		/**
		 * 发送问候
		 */
		sendRegards:function(){
			//判断用户名密码是否为空
			var msnUserName=$E("menGuide_MSNUserName").value,
				msnPassword=$E("menGuide_MSNPassword").value;
				
			if(msnUserName==="" || /^[ ]+$/.test(msnUserName) || msnPassword==="" || /^[ ]+$/.test(msnPassword)){
				return;
			}
			
			var _this=this;
			//显示loading...
			this.displayModuleById("msnGuide_RegardLoading",$E("msnGuide_ConnectTab").style.display==="none"?false:true);
			
			if(scope.msnGuide.canselTimoutobj){
				clearTimeout(scope.msnGuide.canselTimoutobj);
			}
			
			//隐藏取消button
			$E("msnGuide_CancelSendRegardsButton").style.display="none";
			
			//10秒以后显示取消按钮
			scope.msnGuide.canselTimoutobj=setTimeout(function(){
				$E("msnGuide_CancelSendRegardsButton").style.display="";
			},10000);
			
			//为取消按钮注册click事件
			Core.Events.addEvent($E("msnGuide_CancelSendRegardsButton"),function(){
				isContinue=false;
				if(scriptNode){
					scriptNode.src="http://simg.sinajs.cn/blog7style/images/common/loading.gif?t="+(new Date().getTime());
				}
				//回到问候界面
				_this.displayModuleById("msnGuide_MSNRegard",$E("msnGuide_ConnectTab").style.display==="none"?false:true);
			});
			
			var url="http://control.blog.sina.com.cn/blog_rebuild/msn/api/inviteMsnFriend.php?",
				isChangeBadge=!$E("menGuide_ChangeBadgeCheckbox").checked;
		    url+="isChangeBadge="+isChangeBadge+"&msnName="+encodeURIComponent(msnUserName)+"&msnPassword="+encodeURIComponent(msnPassword);
			
			var isContinue=true;
			var scriptNode=scope.msnGuideSupport.JsLoadEx.request(url, {
                    onComplete: function(result){
						if(!isContinue){
							return;
						}
						if(result && result.code && result.code==="A00006"){
							//发送问候成功
							scope.msnGuide.isRegard=true;
							//记录是否更换徽章
							scope.msnGuide.isChangeBadge=!$E("menGuide_ChangeBadgeCheckbox").checked; 
							_this.displayModuleById("msnGuide_RegardSuccess",$E("msnGuide_ConnectTab").style.display==="none"?false:true);
						}else if(result && result.code && result.code==="c10003"){
							//用户名 密码错误 需提示
							_this.displayModuleById("msnGuide_MSNForm",$E("msnGuide_ConnectTab").style.display==="none"?false:true);
							$E("msnGuide_UsernameOrPasswordError").style.display="block";
						}else{
							//其他错误
							_this.displayModuleById("msnGuide_RegardError",$E("msnGuide_ConnectTab").style.display==="none"?false:true);
						}
                    }
            });
		},
		/**
		 * 点击falshz中关闭按钮
		 * 效果和不再显示按钮一样
		 */
		recordFlashCloseButtonClick:function(){
			this.recordFlashClick1();
		
			//点击彩蛋关闭按钮 数据统计
			scope.msnGuideSupport.JsLoadEx.request("http://control.blog.sina.com.cn/blog_rebuild/msn/api/msnGuideCount.php?type=close",{
				onComplete: function(){}
			});
		}
 };



