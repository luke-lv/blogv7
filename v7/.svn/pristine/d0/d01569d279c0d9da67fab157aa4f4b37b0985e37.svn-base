$import("sina/core/events/addEvent.js");
$import("sina/core/dom/contains.js");
$import("sina/core/dom/getXY.js");
$import('sina/core/system/winSize.js');
$import('sina/core/system/getScrollPos.js');
$import("sina/core/events/fireEvent.js");
$import("sina/core/dom/getElementsByClass.js");
$import("lib/sendLog.js");
$import("sina/core/events/stopBubble.js");
$import("sina/core/events/stopDefaultEvent.js");
$import("sina/utils/cookie/getCookie.js");
$import("sina/utils/cookie/setCookie.js");
if(typeof scope != "undefined"){
	scope.userGuideDataSource={
		userGuideArr:[
			{
				htmlContents:'欢迎来到个人中心！首先，通过导航区域可以查看<span style="color:red">最新消息</span>，更改<span style="color:red">博客设置</span>，<span style="color:red">管理关系</span>。',
				position:{x:221,y:222},
				arrowClassName:"ctTipCorl"
			},
			{
				htmlContents:'然后可以在此<span style="color:red">快速发表博文</span>，简单记事，记录心情，随意挥写。',
				position:{x:380,y:223},
				arrowClassName:"ctTipCort"
			},
			{
				htmlContents:'当然还可以在这查看<span style="color:red">好友</span>与<span style="color:red">关注的人</span>的博客动态，掌握他在博客的一举一动。',
				position:{x:366,y:118},
				arrowClassName:"ctTipCorb"
			},
			{
				htmlContents:'还有<span style="color:red">每日天气</span>、<span style="color:red">博客等级</span>，更有星座<span style="color:red">音乐电台</span>，方便你的博客生活。',
				position:{x:456,y:124},
				arrowClassName:"ctTipCorr"
			},
			{
				htmlContents:'也可通过这里到达你的<span style="color:red">博客首页</span>与<span style="color:red">相册</span>，通过页面设置更换<span style="color:red">炫酷模板</span>。',
				position:{x:681,y:0},
				arrowClassName:"ctTipCort"
			}
		],
		containerWidth:"272px",
		nextStepButtonId:"userGuideNextButton",
		baseDomElementId:"column_1",
		itemCloseButtonId:"itemCloseButton",
		templateHTML:'<div class="ctTipWrap">'+
						  '<div id="userGuideArrow"></div>'+
						  '<table class="ctTipb">'+
						    '<thead>'+
						      '<th class="tLeft"><span></span></th>'+
						      '<th class="tMid"><span></span></th>'+
						      '<th class="tRight"><span></span></th>'+
						    '</thead>'+
						    '<tfoot>'+
						      '<td class="tLeft"><span></span></td>'+
						      '<td class="tMid"><span></span></td>'+
						      '<td class="tRight"><span></span></td>'+
						    '</tfoot>'+
						    '<tbody>'+
						      '<td class="tLeft"><span></span></td>'+
						      '<td class="tMid">'+
						        '<div class="ctTipBCon">'+
						          '<a href="javascript:void(0)" id="itemCloseButton" class="shut" title="关闭"></a>'+
						          '<div class="xlz"></div>'+
						          '<div style="width:190px" class="guide">'+
							        '<p><strong id="itemTextDescription">单击此处发布博文</strong></p>'+
							        '<div class="btn"><em id="currentStep">1</em>/<span id="totalStep"></span><a id="userGuideNextButton" onclick="this.blur();" href="javascript:void(0)"><cite>下一步</cite></a></div>'+
						          '</div>'+
						        '</div>'+
						      '</td>'+
						      '<td class="tRight"><span></span></td>'+
						    '</tbody>'+
						  '</table>'+
						'</div>'
	}
}

/**
 * @fileoverview 功能引导组件类
 * @author zhangkai2@staff.sina.com.cn
 * @created 2010-12-06
 * @param {Object} dataSource 组件所需要的数据
 * dataSource={
 * 		//播放数据项集合
 *		userGuideArr:[
 *			{
 *			    //单项html
 *				htmlContents:'test',
 *				//单项显示位置 相对于baseDomElementId
 *				position:{x:631,y:262},
 *				//箭头方向
 *				arrowClassName: ctTipCort(上) ctTipCorb(下) ctTipCorl(左) ctTipCorr(右)
 *			}
 *			...
 *		],
 *		//下一项按钮id 如果templateHTML内容中有id为nextStepButtonId的元素 组件会为其注册跳到下一步事件
 *		nextStepButtonId:"userGuideNextButton",
 *		//计算播放对话显示位置的基址dom元素id
 *		baseDomElementId:"sinablogHead",
 *		//计算播放对话显示位置的基址dom元素 className 如果没有baseDomElementId 则会尝试用这个属性
 *		baseDomElementClassName:"dada",
 *		//播放单项关闭按钮id 如果该项templateHTML内容中有id为itemCloseButtonId的元素 组件会为其注册单项关闭事件
 *		itemCloseButtonId:"itemCloseButton",
 *		//播放对话框html模板
 *		templateHTML:"",
 *		//播放对话框宽度 为其设置宽度 防止窗口重置大小时 对话框被挤压变形
 *		containerWidth:""
 *	}
 *
 * @param {Object} eventObj 组件所支持的事件
 * eventObj.onStartFun->组件开始播放时自定义执行函数
 * eventObj.onEndFun->组件播放结束时自定义执行函数
 * eventObj.onItemCloseFun->播放某一项时关闭自定义执行函数
 * eventObj.onItemPlayFun->单步执行自定义事件
 */
function UserGuide(dataSource,eventObj){
	
	if(!dataSource){
		return;
	}
	/**
	 * 播放对话框宽度
	 */
	this.containerWidth=dataSource.containerWidth||"300px";
	/**
	 * 播放对话框html模板
	 */
	this.templateHTML=dataSource.templateHTML;
	
	/**
	 * 播放开始自定义执行函数
	 */
	this.onStartFun=eventObj && eventObj.onStartFun;
	
	/**
	 * 播放结束自定义执行函数
	 */
	this.onEndFun=eventObj && eventObj.onEndFun;;
	
	/**
	 * 播放某一项时关闭自定义事件
	 */
	this.onItemCloseFun=eventObj && eventObj.onItemCloseFun;
	/**
	 * 单步执行自定义事件
	 */
	this.onItemPlayFun=eventObj && eventObj.onItemPlayFun;
	/**
	 * 下一步按钮id
	 */
	this.nextStepButtonId=dataSource.nextStepButtonId;
	/**
	 * 单项退出按钮id
	 */
	this.itemCloseButtonId=dataSource.itemCloseButtonId;
	/**
	 * 数据项集合
	 */
	this.userGuideArr=dataSource.userGuideArr;
	/**
	 * 当前播放的项在数据项中的索引值
	 */
	this.playIndex=0;
	/**
	 * 播放对话框容器
	 */
	this.guideContainer=$C("div");
	this.guideContainer.style.cssText="z-index:2000;position:absolute;width:"+this.containerWidth;
	/**
	 * 数据项显示位置基址 默认为body
	 */
	this.baseDomElement=(dataSource.baseDomElementId && $E(dataSource.baseDomElementId)) || (dataSource.baseDomElementClassName && Core.Dom.getElementsByClass(document,"div",dataSource.baseDomElementClassName)[0]) || document.body;
	
	//窗口大小发生改变 更新播放对话框的位置
	Core.Events.addEvent(window,function(e){
		if(_this.playIndex<1){
			return;
		}
		var pos=Core.Dom.getXY(_this.baseDomElement);
		_this.guideContainer.style.left=(pos&&pos[0]||0)+_this.userGuideArr[_this.playIndex-1].position.x+"px";
		_this.guideContainer.style.top=(pos&&pos[1]||0)+_this.userGuideArr[_this.playIndex-1].position.y+"px";
	},"resize");
}
/**
 * 播放开始函数
 */
UserGuide.prototype.start=function(){
	this.playIndex=0;
	document.body.appendChild(this.guideContainer);
	this.updateGuideContainer();
	
	//如果注册了自定义函数 执行
	if(this.onStartFun && typeof this.onStartFun === "function"){
		this.onStartFun();
	}
}
/**
 * 播放结束函数
 */
UserGuide.prototype.end=function(){
	this.playIndex=0;
	document.body.removeChild(this.guideContainer);
	
	//如果注册了自定义函数 执行
	if(this.onEndFun && typeof this.onEndFun === "function"){
		this.onEndFun();
	}
}

/**
 * 更新播放对话框内容,位置
 */
UserGuide.prototype.updateGuideContainer=function(){
	//判断是否播放到最后一项
	if(this.playIndex  == this.userGuideArr.length){
		this.end();
		return;
	}
	
	var index=this.playIndex;
	
	if(index==0){
		this.guideContainer.innerHTML=this.templateHTML;
		//更新总步数
		$E("totalStep").innerHTML=this.userGuideArr.length;
		
		//检测是否有跳转到下一步按钮 如果该按钮存在 注册click事件
		if($E(this.nextStepButtonId)){
			Core.Events.addEvent($E(this.nextStepButtonId),function(){
				//不设置这个值 点击按钮时ie8下会触发播放对话框的mouseout事件 导致计时器错误
				_this.nextButtonClicked=true;
				_this.updateGuideContainer();
				//下一步点击 部码
				v7sendLog("87_10_06_"+$UID,scope.$pageid,"");
			},"click");
		}
		
		//检测是否有关闭按钮 如果有 为关闭按钮注册关闭事件
		if($E(this.itemCloseButtonId)){
			Core.Events.addEvent($E(this.itemCloseButtonId),function(){
				document.body.removeChild(_this.guideContainer);
				if(_this.onItemCloseFun && typeof _this.onItemCloseFun === "function"){
					_this.onItemCloseFun();
				}
				//播放过程中关闭 部码
				v7sendLog("87_10_05_"+$UID,scope.$pageid,"");
			},"click");
			
			//ie6下需要执行这段 要不关闭超链接消失
			setTimeout(function(){
				$E(_this.itemCloseButtonId).className="shut";
			},100);
			
		}
	}
	
	//更新单步文字描述
	$E("itemTextDescription").innerHTML=this.userGuideArr[index].htmlContents;
	//更新箭头方向
	$E("userGuideArrow").className=this.userGuideArr[index].arrowClassName;
	//更新执行到第几步
	$E("currentStep").innerHTML=this.playIndex+1;
	
	if(this.baseDomElement!==document.body){
		var pos=Core.Dom.getXY(this.baseDomElement);
	}
	
	var _this=this;
	
	this.guideContainer.style.left=(pos&&pos[0]||0)+this.userGuideArr[index].position.x+"px";
	this.guideContainer.style.top=(pos&&pos[1]||0)+this.userGuideArr[index].position.y+"px";
	
	//判断guideContainer是否在可见区域 
	var size = Core.System.winSize(),
		scrollPos=Core.System.getScrollPos();
	if(scrollPos[0]+size.height<parseInt(this.guideContainer.style.top)+this.guideContainer.offsetHeight || parseInt(this.guideContainer.style.top)<scrollPos[0]){
		this.guideContainer.scrollIntoView(false);
	}
	
	//如果注册了单步执行自定义函数 则执行
	if(this.onItemPlayFun && typeof this.onItemPlayFun === "function"){
		this.onItemPlayFun();
	}
	
	this.playIndex++;
}

$registJob("userGuide", function(){
	
	//根据cookie检测用户是否点击过停留div关闭按钮 如果点击过 不再显示停留div
	if(Utils.Cookie.getCookie("stayDivClosed"+$UID)==="true"){
		return;
	}
	
	var stayDivTemplateHTML=   '<table class="ctTipb">'+
							    '<thead>'+
							      '<th class="tLeft"><span></span></th>'+
							      '<th class="tMid"><span></span></th>'+
							      '<th class="tRight"><span></span></th>'+
							    '</thead>'+
							    '<tfoot>'+
							      '<td class="tLeft"><span></span></td>'+
							      '<td class="tMid"><span></span></td>'+
							      '<td class="tRight"><span></span></td>'+
							    '</tfoot>'+
							    '<tbody>'+
							      '<td class="tLeft"><span></span></td>'+
							      '<td class="tMid">'+
							        '<div class="ctTipBCon">'+
							          '<a id="userGuide_StayDivCloseButton" href="javascript:void(0)" class="shut" title="关闭"></a>'+
							          '<div class="xlx"></div>'+
							          '<div style="width:133px;margin:1px 10px 0 30px" class="visit">'+
								        '<p>对这里不熟悉？<span style="color:red">点此开始</span>个人中心功能介绍</p>'+
							          '</div>'+
							        '</div>'+
							      '</td>'+
							      '<td class="tRight"><span></span></td>'+
							    '</tbody>'+
							  '</table>';
	
	//添加停留位置
	var stayDiv=$C("div");
	stayDiv.id="userGuide_StayDiv";
	stayDiv.style.cssText="position:absolute;z-index:2000;cursor:pointer;width:205px";
	stayDiv.className="ctTipWrap";
	stayDiv.innerHTML=stayDivTemplateHTML;
	document.body.appendChild(stayDiv);
	
	updateStayDivPos();
	
	//为停留div 关闭按钮注册 click事件
	if($E("userGuide_StayDivCloseButton")){
		Core.Events.addEvent($E("userGuide_StayDivCloseButton"),function(e){
			
			document.body.removeChild($E('userGuide_StayDiv'));
			
			Core.Events.stopBubble(e);
			Core.Events.stopDefaultEvent(e);
			
			//记录cookie 关闭后在个人中心不再显示停留div 
			Utils.Cookie.setCookie("stayDivClosed"+$UID,"true",86400,"/",".sina.com.cn");
			
			//关闭部码
			v7sendLog('87_10_04_'+$UID,scope.$pageid,'');
		});
	}

	//为停留div 注册resize事件
	Core.Events.addEvent(window,function(e){
		updateStayDivPos();
	},"resize");
	
	//为停留位置注册点击事件 点击后自动播放功能向导
	Core.Events.addEvent(stayDiv,function(e){
		var d=$E("userGuide_StayDiv");
		if(d){
			d.style.display="none";
			if(!scope.userGuide){
				scope.userGuide=new UserGuide(scope.userGuideDataSource,{onItemCloseFun:onItemCloseFun,onEndFun:onEndFun,onItemPlayFun:onItemPlayFun});
			}
			scope.userGuide.start();
		}
		//停留位置点击部码
		v7sendLog("87_10_03_"+$UID,scope.$pageid,"");
	},"click");
	
	/**
	 * 单步执行自定义事件
	 * this指向UserGuide实例
	 */
	function onItemPlayFun(){
		
		if(this.playIndex===1){
			setTimeout(function(){
				Core.Events.fireEvent($E("as_mini_editor"),"click");
			},100);
		}
		if(this.playIndex===2){
			setTimeout(function(){
				var arr=Core.Dom.getElementsByClass(document,"a","close");
				for(var i=0;i<arr.length;i++){
					if(arr[i].id && arr[i].id.indexOf("btnClose")>-1){
						Core.Events.fireEvent($E(arr[i].id),"click");
					}
				}
			},100)
		}
	}
	
	/**
	 * 单步关闭事件
	 */
    function onItemCloseFun(){
        if ($E("userGuide_StayDiv")) {
            $E("userGuide_StayDiv").style.display = "block";
        }
    };
	/**
	 * 播放完毕事件
	 */
    function onEndFun(){
		var endDivTemplateHTML=   '<table class="ctTipb">'+
								    '<thead>'+
								      '<th class="tLeft"><span></span></th>'+
								      '<th class="tMid"><span></span></th>'+
								      '<th class="tRight"><span></span></th>'+
								    '</thead>'+
								    '<tfoot>'+
								      '<td class="tLeft"><span></span></td>'+
								      '<td class="tMid"><span></span></td>'+
								      '<td class="tRight"><span></span></td>'+
								    '</tfoot>'+
								    '<tbody>'+
								      '<td class="tLeft"><span></span></td>'+
								      '<td class="tMid">'+
								        '<div class="ctTipBCon">'+
								          '<a id="userGuide_EndDivCloseButton" href="javascript:void(0)" class="shut" onclick="UserGuide.closeEndDiv && UserGuide.closeEndDiv();" title="关闭"></a>'+
								          '<div class="xld"></div>'+
								          '<div class="des">'+
									        '<p><strong>个人中心，只属于你的博客大本营。<br>博客生活，从个人中心开始～</strong>'+
									         '您可以随时通过<a onclick="v7sendLog(\'87_10_07_\'+$UID,scope.$pageid,\'\');" href="http://i.blog.sina.com.cn/">i.blog.sina.com.cn</a>快速访问个人<br />中心；当然，您也可以将个人中心加入收藏夹，方<br />便您更迅速的进入。</p>'+
									        '<div class="btn"><a href="javascript:void(0)" onclick="v7sendLog(\'87_10_09_\'+$UID,scope.$pageid,\'\');UserGuide.addBookmark && UserGuide.addBookmark(\'博客个人中心\',\'http://i.blog.sina.com.cn/\');this.blur();"><cite>加入收藏夹</cite></a><a href="javascript:void(0)" onclick="UserGuide.playAgain && UserGuide.playAgain();v7sendLog(\'87_10_08_\'+$UID,scope.$pageid,\'\');" ><cite>再看一次</cite></a></div>'+
								          '</div>'+
								        '</div>'+
								      '</td>'+
								      '<td class="tRight"><span></span></td>'+
								    '</tbody>'+
								  '</table>';
	
        var endDiv = $C("div");
        endDiv.id = "userGuide_EndDiv";
		endDiv.className="ctTipWrap";
		//设置宽高 防止窗口大小改变时被挤压变形
		endDiv.style.width="418px";
		endDiv.style.height="175px";
		endDiv.style.position="absolute";
		endDiv.style.zIndex="2000";
        endDiv.innerHTML=endDivTemplateHTML;
		document.body.appendChild(endDiv);
		
		//ie6下需要执行这段 要不关闭超链接消失
		setTimeout(function(){$E("userGuide_EndDivCloseButton").className="shut";},100);
			
        var size = Core.System.winSize();
        endDiv.style.left = (size.width - endDiv.offsetWidth) / 2 + "px";
        endDiv.style.top = (size.height - endDiv.offsetHeight) / 2 + Math.max(document.documentElement.scrollTop, document.body.scrollTop) + "px";
    }
	
	/**
	 * 再播放一次
	 */
    UserGuide.playAgain = function(){
        if ($E("userGuide_EndDiv")) {
            document.body.removeChild($E("userGuide_EndDiv"));
        };
        scope.userGuide.start();
    };
	/**
	 * 
	 */
    UserGuide.closeEndDiv = function(){
        if ($E("userGuide_EndDiv")) {
            document.body.removeChild($E("userGuide_EndDiv"));
        }
        if ($E("userGuide_StayDiv")) {
            $E("userGuide_StayDiv").style.display = "block";
        }
    };
	
	/**
	 * 加入收藏夹 只支持ie firefox
	 * @param {String} title 收藏夹名称
	 * @param {String} url   收藏夹url
	 */
    UserGuide.addBookmark = function(title, url){
        if (window.sidebar) {
			alert("请您使用CTRL+D键添加本页到收藏夹！");
        }
        else if (document.all) {
            window.external.AddFavorite(url, title);
        }
    }
	
	/**
	 * 更新停留div位置
	 */
	function updateStayDivPos(){
		var o=$E("userGuide_StayDiv");
		
		if(o.style.display==="none"){
			return;
		}
		
		var SG_Publish=$E("SG_Publish"),
		pos=Core.Dom.getXY(SG_Publish),
		top=pos[1]-o.offsetHeight-5+"px",
		left=pos[0]+40+"px";
		
		o.style.left=left;
		o.style.top=top;
	}
	
	stayDiv=null;
});

