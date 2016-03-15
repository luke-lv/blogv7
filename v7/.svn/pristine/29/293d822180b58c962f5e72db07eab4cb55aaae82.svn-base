
$import("sina/sina.js");
$import("sina/core/events/addEvent.js");
$import("sina/utils/io/jsload.js");
$import("sina/ui/dialog/backShadow.js");
$import("sina/utils/insertTemplate.js");
$import("sina/core/dom/setStyle2.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/string/trim.js");
$import("other/SinaEx.js");
$import("lib/checkAuthor.js");
$import("sina/core/dom/getElementsByAttr.js");
$import("nickactivity/layerTpl.js");
$import("nickactivity/nickLayerScroll.js");
$import("nickactivity/medalTween.js");
$import("lib/sendLog.js");
$import("sina/utils/limitLength.js");
$import('sina/core/events/stopDefaultEvent.js');
/**
 * @fileoverview 昵称活动页js
 * @author Liu xiaoyue | xiaoyue3@staff.sina.com.cn
 * @created 2013-06-06
 * @vertion 0.1v
 */
$registJob("nickActivityPage", function(){
	var __addEvent = Core.Events.addEvent;
	var searchBtn = $E("searchBtn");
	var textfield = $E("textfield");
	var getNickEl = $E("getNickEl"), choujiang = $E('choujiang'), __layerTips, mask;
	var t, b, m;
	var scrollGet = $E("scrollGet"),moreInfo = $E("moreInfo"),tuijiannick;
	var data;
	var urls = {
		// 获取用户博客微博信息
		getUinfo:"http://control.blog.sina.com.cn/blog_nickunify/getUinfo.php",
		openWeibo:"http://control.blog.sina.com.cn/blog_nickunify/openWeibo.php",
		openBlog:"http://control.blog.sina.com.cn/riaapi/reg/open_blog.php",
		tongbuNick:"http://control.blog.sina.com.cn/blog_nickunify/qianzhanNick.php",
		// 判断昵称是否可用
		searchNick:"http://control.blog.sina.com.cn/blog_nickunify/isVerifyNick.php",
		prize:"http://control.blog.sina.com.cn/blog_nickunify/choujiang.php"
	}
	var option = {
		css: {
			'z-index': '1501',
			'position':$IE6?'absolute':'fixed' ,
			'top': '50%',
			'left': '50%'
		}
	}

	NickAc.nickLayerScroll();
	NickAc.medalTween();

	Lib.checkAuthor();
	//点击领取按钮绑定事件
	__addEvent(scrollGet,function(event){
		sameNickFunc(event);
	});
	__addEvent(choujiang,function(event){
		sameNickFunc(event);
	});
	__addEvent(getNickEl, function(event){
		sameNickFunc(event);
  	}, "click");

	__addEvent(moreInfo, function(event){
		v7sendLog('35_01_03_'+ $UID);
  	}, "click");
	/**** 浮层位置设置 ****/
	function setLayerPosition(wrapper){
		if($IE6){
			setPos(wrapper);
			Core.Events.addEvent(window, function(){
				wrapper && setPos(wrapper);
			}, "scroll");
		}else{
			setPos(wrapper);
		}
	}
  	function setPos(obj){
		var w = 450, h = 242;
		obj.style.marginLeft = w / 2 * (-1) + 'px';
		if($IE6){
			obj.style.top = document.documentElement.scrollTop + parseInt(Math.abs((document.documentElement.offsetHeight - h)/2), 10);
			delete option.css.top;
		}else{
			obj.style.marginTop = h / 2 * (-1) + 'px';
		}
		Core.Dom.setStyle2(obj, option.css);
	}

	/**** 初始化浮层展示  关闭浮层事件****/
	function initLayerAll(tNum,bNum,mParm){
		mask = new BackShadow(0.4);
		mask.show();
		//页面只加载一次浮层模版
		if(!__layerTips){
			__layerTips = Utils.insertTemplate(document.body,scope.nickActivityLayerTpl,'BeforeEnd');
		}else{
			__layerTips.layerWrap.style.display ="";
		}
		
		setLayerPosition(__layerTips.layerWrap);
		if(tNum && bNum){
			t = Core.Dom.getElementsByAttr(__layerTips.layerWrap,"showLayer", tNum);
			t[0].style.display = "";
			if(mParm){
				m = Core.Dom.getElementsByAttr(__layerTips.layerWrap,"showLayer", mParm);
				if(m[0].style.display === "none"){
					m[0].style.display = "";
				}else{
					m[0].style.display = "none";
				}
			}
			b = Core.Dom.getElementsByAttr(__layerTips.layerWrap,"showLayer", bNum);
			b[0].style.display = "";
		}
		__addEvent(__layerTips.closeLayer, function(event){
			Core.Events.stopDefaultEvent(event);
			closeLayerFunc(t,b,m);
		});
	}
	function closeLayerFunc(t,b,m,num){
		if(t && t[0] && b && b[0]){
			t[0].style.display = "none";
			b[0].style.display = "none";
			if(m && m[0]){
				if(m[0].style.display === "none"){
					if(num){
						m[0].style.display = "none";
					}else{
						m[0].style.display = "";
					}
				}else{
					if(m[0].getAttribute("showLayer") === "blank_0"){
						m[0].style.display = "";
					}else{
						m[0].style.display = "none";
					}
				}
			}
		}
		__layerTips.layerWrap.style.display="none";
		try{
			mask && mask.close();
  		}catch(e){
		}
	}
	/**** 点击领取按钮各种浮层逻辑 *****/
  	function sameNickFunc(event,seaNick){
  		Core.Events.stopDefaultEvent(event);
  		if($isLogin){
  			var target= (event && event.target) || (window.event && window.event.srcElement);
  			if(target.id === "scrollGet"){
  				v7sendLog('35_01_02_'+ $UID);
  			}else{
  				v7sendLog('35_01_01_'+ $UID);
  			}
  			Utils.Io.JsLoad.request(urls.getUinfo, {
				GET: {
					uid: $UID
				},
				onComplete : function (result) {
					if(result && result.code==="A00006"){
						data = result.data.msg;
						openLuojiFunc(data,seaNick);
					}else{
						if(t){
							closeLayerFunc(t,b,m,1)
						}
						initLayerAll('1_0','b_1','1_0_5');//浮层弹出
						knowBtnFunc(t,b,m);
					}
				}
			});
		}else{
			if(t){
				closeLayerFunc(t,b,m,1)
			}
			initLayerAll('1_0','b_1','1_0_4');//浮层弹出
			knowBtnFunc(t,b,m);
		}	  		
  	}

  	function openLuojiFunc(data,snick){
  		if(data && !data.isgrab && !data.isprize){//没有抢占昵称,也没抽过奖
			if(data.isopenblog && data.isopenweibo){//开通博客，开通微博
				//判断是不是蓝v用户

				if(data.vinfo_verified && 0<data.vinfo_verifiedTpye<8){
					if(t){
						closeLayerFunc(t,b,m,1);
					}
					initLayerAll('5_0','b_5','5_0_1');//浮层弹出
					bindEvent1(data,"v");
				}else{
					//一进来直接点击搜索 ，并且开通了博客，开通了微博，直接同步搜索昵称
					if(snick){
						synchNickFunc(snick);
					}else{
						if(data.blognick === data.weibonick){//昵称一致
							 synchNickFunc(data.weibonick);
						}else{//昵称不一致

							// 判断博客昵称在微博是否可用
							Utils.Io.JsLoad.request(urls.searchNick, {
								GET: {
									uid: $UID,
									nick: data.blognick
								},
								onComplete : function (res) {
									if(res.data.is_legal) {
										if(t){
											closeLayerFunc(t,b,m,1);
										}
										initLayerAll('4_0','b_8','4_0_1');//浮层弹出
										bindEventBlogNick(data);
									}else {
										if(t){
											closeLayerFunc(t,b,m,1);
										}
										initLayerAll('2_0','b_5','2_0_1');//浮层弹出
										bindEvent1(data);
									}
								}
							});
						}
					}	
				}

				
			}

			if(!data.isopenblog && data.isopenweibo){//未开通博客，开通微博
				if(t){
					closeLayerFunc(t,b,m,1);
				}
				//直接从搜索进来，没有开通博客，开通微博了
				v7sendLog('35_01_07_'+ $UID);
				initLayerAll('1_0','b_2','1_0_1');//浮层弹出
				bindEvent2(data,snick);//一键开通博客//提示 登陆，注册浮层弹出
			}
			if(data.isopenblog && !data.isopenweibo){//开通博客，未开通微博

				if(t){
					closeLayerFunc(t,b,m,1);
				}
				v7sendLog('35_01_08_'+ $UID);
				//直接从搜索进来，开通博客，没有开通微博了
				if(snick){
					//此处直接用搜索昵称开通微博，并且用搜索昵称同步
					againOpenWeibo(snick);
				}else{
					initLayerAll('1_0','b_6','1_0_3',1);//浮层弹出
					bindEvent3(data);//一键开通博客//提示 登陆，注册浮层弹出
				}
				
			}
			if(!data.isopenblog && !data.isopenweibo){//未开通博客，未开通微博
				if(t){
					closeLayerFunc(t,b,m,1);
				}
				v7sendLog('35_01_07_'+ $UID);
				initLayerAll('1_0','b_2','1_0_1');//浮层弹出
				bindEvent2(data,snick);
			}
		}else if(data && data.isgrab && !data.isprize){//抢占过昵称，但没抽过奖
			tongbuNickFunc(data.blognick);
		}else{//抢占过昵称也抽
			if(t){
				closeLayerFunc(t,b,m,1);
			}
			initLayerAll('1_0','b_1','1_1_0');
			knowBtnFunc(t,b,m);
		}
  	}

  	/**** 浮层逻辑最终公共调用 同步昵称的逻辑 此方法为公共方法 *****/
	function synchNickFunc(nick){
		Utils.Io.JsLoad.request(urls.tongbuNick, {//此处调用同步昵称接口
			GET: {
				uid:$UID,
				nick:nick
			},
			onComplete : function (result) {
				if(result && result.code === "A00006"){
					if(t){
						closeLayerFunc(t,b,m);
					}
					tongbuNickFunc();
				}else if(result && result.code === "B00001"){//抢占过昵称
					if(t){
						closeLayerFunc(t,b,m,1);
					}
					initLayerAll('1_0','b_1','1_1_0');
					knowBtnFunc(t,b,m);
				}else{
					closeLayerFunc(t,b,m);
					initLayerAll('1_0','b_1','1_0_5');//浮层弹出
					knowBtnFunc(t,b,m);
				}
			}
		});
	}


	/**** 浮层里需要绑定的事件，一键开通博客 微博 尝试昵称搜索 *****/
	
	// 昵称不一致，推荐使用博客昵称
	function bindEventBlogNick(data) {
		$E("tjBlogNick").innerHTML = data.blognick;
		searchBlogNickEvent();
		$E("qiangzhanBlogNick").onclick = function(event){
			Core.Events.stopDefaultEvent(event);
			v7sendLog('35_01_10_'+ $UID);
			synchNickFunc(data.blognick);
		}
	}

	//昵称不一致，推荐使用微博昵称
	function bindEvent1(data,v){
		if(v){
			$E("tjWnick1").innerHTML = data.weibonick;
		}else{
			$E("tjWnick").innerHTML = data.weibonick;
			trySearchEvent();
		}
		$E("qiangzhan").onclick = function(event){
			Core.Events.stopDefaultEvent(event);
			v7sendLog('35_01_10_'+ $UID);
			synchNickFunc(data.weibonick);
		}
	}

	//一键开通博客绑定的方法
	function bindEvent2(data,snick){
		var opWei = data.isopenweibo;
		var opNick;
		if(data.blognick){
			opNick = data.blognick
		}else{
			opNick = '用户' + $UID;
		}
		$E("openBlogBtn").onclick = function(event){
			Core.Events.stopDefaultEvent(event);
			Utils.Io.JsLoad.request(urls.openBlog, {//此处调用开通博客接口，
				GET: {
					uid:$UID,
					blogname:encodeURIComponent(opNick)
				},
				onComplete : function (result) {
					if(result && result.code === "A00006"){
						if(!opWei){
							closeLayerFunc(t,b,m);
							v7sendLog('35_01_08_'+ $UID);
							initLayerAll('1_0','b_6','1_0_3');//浮层弹出
							if(snick){
								bindEvent3(data,snick);
							}else{
								bindEvent3(data,opNick);
							}	
						}else{
							v7sendLog('35_01_05_'+ $UID);
							closeLayerFunc(t,b,m);
							if(data.vinfo_verified && 0<data.vinfo_verifiedTpye<8 && snick){
								initLayerAll('5_0','b_5','5_0_1');//浮层弹出
								bindEvent1(data,"v");
							}else if(snick){
								synchNickFunc(snick);
							}else{
								synchNickFunc(data.weibonick);
							}	
						}
					}else{
						closeLayerFunc(t,b,m);
						initLayerAll('1_0','b_1','1_0_5');//浮层弹出
						knowBtnFunc(t,b,m);
					}
				}
			});
		}
	}

	//一键开通微博接口绑定的放法
	function bindEvent3(data,snick){
		var blogNick = data.blognick ? data.blognick : '用户' + $UID;
		if(snick){
			blogNick = snick;
		}
		$E("openweiboBtn").onclick = function(event){
			Core.Events.stopDefaultEvent(event);
			Utils.Io.JsLoad.request(urls.openWeibo, {
				GET: {
					uid:$UID,
					nick:blogNick
				},
				onComplete : function (result) {
					if(result && result.code === "A00006"){
						v7sendLog('35_01_06_'+ $UID);
						closeLayerFunc(t,b,m);
						synchNickFunc(blogNick);
					}else if(result && result.code === "B00003"){//昵称不可用
						closeLayerFunc(t,b,m);
						var snFlag = result.data.suggest_nickname;
						if( snFlag && snFlag.length){
							initLayerAll('2_0','b_0','2_0_2');//浮层弹出
							trySearchEvent();
							$E("tjNick").innerHTML = snFlag[0];
							tuijiannick = snFlag[0];
							$E("qiangzhan1").onclick = function(event){
								Core.Events.stopDefaultEvent(event);
								v7sendLog('35_01_09_'+ $UID);
								//使用推荐昵称的时候在调用一次开通微博接口
								againOpenWeibo(tuijiannick);
							}
						}else{
							initLayerAll('2_0','b_7');//浮层弹出
							trySearchEvent();
							$E("ssBtn").onclick = function(event){
								Core.Events.stopDefaultEvent(event);
								closeLayerFunc(t,b,m);
							}
						}
					}else{
						closeLayerFunc(t,b,m);
						initLayerAll('1_0','b_1','1_0_5');//浮层弹出
						knowBtnFunc(t,b,m);
					}
				}
			});
		}
	}

	//开通博客 未开通微博 并且昵称被占用 抢占的时候要重新调开通微博接口
	function againOpenWeibo(nick){
		Utils.Io.JsLoad.request(urls.openWeibo, {
			GET: {
				uid:$UID,
				nick:nick
			},
			onComplete : function (result) {
				if(result && result.code === "A00006"){
					if(t){
						closeLayerFunc(t,b,m);
					}
					synchNickFunc(nick);
				}else{
					if(t){
						closeLayerFunc(t,b,m,1);
					}
					initLayerAll('1_0','b_1','1_0_5');//浮层弹出
					knowBtnFunc(t,b,m);
				}
			}
		});
	}
	/************ 锚点定位到搜索昵称方法 *************/
	function trySearchEvent(){
		$E("tryNickTpl").onclick = function(event){
			Core.Events.stopDefaultEvent(event);
			searchNickTryFunc();
		}
	}
	function searchBlogNickEvent(){
		$E("searchBlogNick").onclick = function(event){
			Core.Events.stopDefaultEvent(event);
			searchNickTryFunc();
		}
	}
	function searchNickTryFunc(){
		closeLayerFunc(t,b,m);
		textfield.focus();
	}
	
	/************ 抢占成功 出现抽奖浮层 以及抽奖的事件 同事分享到微博 博客的事件 *************/
	function tongbuNickFunc(msg){

		initLayerAll('success_0','b_success_0');//浮层弹出
		var shareNA_weibo = $E("shareNA_weibo"),shareNA_blog = $E("shareNA_blog");
		shareWeiboBlogFunc(shareNA_weibo);
		shareWeiboBlogFunc(shareNA_blog);
		$E("getPrize").onclick = function(event){
			var event = event || window.event;
			Core.Events.stopDefaultEvent(event);
			var typeW = shareNA_weibo.getAttribute("type");
			var typeB = shareNA_blog.getAttribute("type");
			if(msg){
				getPrizeFunc(typeW,typeB,msg);
			}else{
				getPrizeFunc(typeW,typeB,data);
			}
			
		}
	}
	function shareWeiboBlogFunc(el){
		el.onclick = function(event){
			Core.Events.stopDefaultEvent(event);
			if(el.className === "choice"){
				el.className = "choice em_choice";
				el.setAttribute('type','0');
			}else{
				el.className = "choice";
				el.setAttribute('type','1');
			}
		}
	}
	
	/**** 立即抽奖调用方法 ****/
	function getPrizeFunc(tW,tB,data){
		Utils.Io.JsLoad.request(urls.prize, {
			GET: {
				uid: $UID,
				blognick:data.blognick,
				weibonick:data.weibonick,
				isopenweibo:data.isopenweibo,
				isopenblog:data.isopenblog,
				isnick:data.isnick,
				sendblog:tB,
				sendweibo:tW
			},
			onComplete : function (result) {
				if(result && result.code === "A00006"){
					if(!result.data){
						closeLayerFunc(t,b,m);
						initLayerAll('3_0','b_1');//浮层弹出
						knowBtnFunc(t,b,m);
					}else{
						switch(result.data){
							case "nickUniP1":
								closeLayerFunc(t,b,m);
								initLayerAll('prize_4','b_1','blank_0');
								knowBtnFunc(t,b,m);
							break;
							case "nickUniP2":
								closeLayerFunc(t,b,m);
								initLayerAll('prize_2','b_1','blank_0');
								knowBtnFunc(t,b,m);
							break;
							case "nickUniP3":
								closeLayerFunc(t,b,m);
								initLayerAll('prize_3','b_1','blank_0');
								knowBtnFunc(t,b,m);
							break;
							case "nickUniP4":
								closeLayerFunc(t,b,m);
								initLayerAll('prize_0','b_1','blank_0');
								knowBtnFunc(t,b,m);
							break;
							case "nickUniP5":
								closeLayerFunc(t,b,m);
								initLayerAll('prize_1','b_1','blank_0');
								knowBtnFunc(t,b,m);
							break;
						}
					}
				}else{
					closeLayerFunc(t,b,m);
					initLayerAll('1_0','b_1','1_0_5');//浮层弹出
					knowBtnFunc(t,b,m);
				}
			}
		});
	}

	/**** 浮层里知道了按钮的方法 ****/
	function knowBtnFunc(x,y,z){
		$E("knowBtn").onclick = function(event){
			Core.Events.stopDefaultEvent(event);
			if(z){
				closeLayerFunc(x,y,z);
			}else{
				closeLayerFunc(x,y);
			}	
		}
	}



	/**********************************
 	* 
 	* 搜索昵称模块
 	* 
 	**********************************/

	var __TIPS = "请输入昵称：4~30个字符，支持中英文、数字、“_”或减号";
	/****昵称搜索输入框  focus blur keyup事件 ****/
	textfield.parentNode.style.position = "relative";
	var sp = '<span style="position:absolute;top:10px; *top:15px; left:10px;width:450px;height:30px;font-size:14px;color:#dbc5e2; font-weight:bold;">'+ __TIPS +'</span>';
	Utils.insertTemplate(textfield,sp,'BeforeBegin');
	$E("search").children[0].children[0].onclick = function(){
		textfield.focus();
	}

	__addEvent(textfield, function(){
		if(textfield.value === ''){
			$E("search").children[0].children[0].style.display = "none";
		}
	},"focus");

	__addEvent(textfield, function(){
		if(textfield.value){
			$E("search").children[0].children[0].style.display = "none";
		}else{
			$E("search").children[0].children[0].style.display = "";
		}
	},"blur");

	Utils.limitLength(textfield, 30);

	__addEvent(textfield, function(event){
		var e= event || window.event;
		var keyCode = e.keyCode;
		if (keyCode === 13) {
			if($isLogin){
				if(Core.String.trim(textfield.value)=== __TIPS){
					textfield.focus();
				}else{
					if(textfield.value){
						v7sendLog('35_01_04_'+ $UID);

						searchVerifyNick(textfield.value);
						// verifyNick(textfield.value);
					}
				}	
			}else{
				if(t){
					closeLayerFunc(t,b,m)
				}
				initLayerAll('1_0','b_1','1_0_4');//浮层弹出
				knowBtnFunc(t[0],b[0],m[0]);
			}
		}
	}, "keyup");

	//昵称搜索，地图展现逻辑模块
	__addEvent(searchBtn, function(event){

		Core.Events.stopDefaultEvent(event);
		if($isLogin){
			if(!textfield.value){
				textfield.focus();
			}else{
				v7sendLog('35_01_04_'+ $UID);
				searchVerifyNick(textfield.value);
				// verifyNick(textfield.value);
			}	
		}else{
			if(t){
				closeLayerFunc(t,b,m,1);
			}
			initLayerAll('1_0','b_1','1_0_4');//浮层弹出
			knowBtnFunc(t[0],b[0],m[0]);
		}
		
  	}, "click");
	
	// 搜索昵称验证
	function searchVerifyNick(val) {
		var ch1 = $E("map").children[0].children[0];
		var ch2 = $E("map").children[0].children[1];
		var provinces = map.getElementsByTagName("div");
		for(var i=0; i<provinces.length; i++){
			SinaEx.removeClass(provinces[i],"location_ico02");
			SinaEx.removeClass(provinces[i],"location_ico");
		}
		var random10 = Math.floor(Math.random()*10+1);
		var random30 = Math.floor(Math.random()*30+1);

		// 根据用户状态判断不同情况
		Utils.Io.JsLoad.request(urls.getUinfo, {
			GET: {
				uid: $UID
			},
			onComplete : function (res) {
				if(res && res.code==="A00006") {
					var msg = res.data.msg;

					// 未开通博客，未开通微博
					if(!msg.isopenblog && !msg.isopenweibo) {
						verifyNick(val);
					}
					// 未开通博客，开通微博
					if(!msg.isopenblog && msg.isopenweibo) {
						// 搜索的是微博昵称，提示可用
						if(val == msg.weibonick) {
							SinaEx.addClass(provinces[random30-1],"location_ico02");
							ch1.innerHTML = "哇哦！您的昵称唯一";
							ch2.innerHTML = "马上保存参与抽奖";
							ch2.setAttribute("nickSval",val);
						}else {
							verifyNick(val);
						}
					}
					// 开通博客，未开通微博
					if(msg.isopenblog && !msg.isopenweibo) {
						verifyNick(val);
					}
					// 开通博客，开通微博
					if(msg.isopenblog && msg.isopenweibo) {
						//蓝v用户限制
						if(msg.vinfo_verified && 0<msg.vinfo_verifiedTpye<8 && !msg.isgrab){ //蓝v用户没有同步昵称
							if(t){
								closeLayerFunc(t,b,m,1);
							}
							initLayerAll('5_0','b_5','5_0_1');//浮层弹出
							bindEvent1(msg,"v");
						}else if(msg.vinfo_verified && 0<msg.vinfo_verifiedTpye<8 && msg.isgrab && !msg.isprize){ //蓝v用户同步了昵称 没有抽奖
							tongbuNickFunc(msg);
						}else if(msg.vinfo_verified && 0<msg.vinfo_verifiedTpye<8 && msg.isgrab && msg.isprize){ //蓝v用户同步过了并且也抽奖了
							if(t){
								closeLayerFunc(t,b,m,1);
							}
							initLayerAll('1_0','b_1','1_1_0');
							knowBtnFunc(t,b,m);
						}else{
							// 昵称是否一致
							if(msg.blognick == msg.weibonick) {
								if(val == msg.blognick) {
									SinaEx.addClass(provinces[random30-1],"location_ico02");
									ch1.innerHTML = "哇哦！您的昵称唯一";
									ch2.innerHTML = "马上保存参与抽奖";
									ch2.setAttribute("nickSval",val);
								}else {
									verifyNick(val);
								}
							}else {
								if(val == msg.weibonick) {
									SinaEx.addClass(provinces[random30-1],"location_ico02");
									ch1.innerHTML = "哇哦！您的昵称唯一";
									ch2.innerHTML = "马上保存参与抽奖";
									ch2.setAttribute("nickSval",val);
								}else {
									verifyNick(val);
								}
							}
						}	
					}

					ch2.onclick = function(event){
						Core.Events.stopDefaultEvent(event);
						if(ch2.getAttribute("nickSval")){
							var seNVal = ch2.getAttribute("nickSval");
							if(msg && msg.isgrab &&  msg.isopenweibo && msg.isopenblog && !msg.isprize){
								tongbuNickFunc()
							}else if(msg && msg.isopenweibo && msg.isopenblog){
								synchNickFunc(seNVal);
							}else if(msg && msg.isopenblog && tuijiannick){
								againOpenWeibo(seNVal);
							}else if(msg){
								openLuojiFunc(msg,seNVal);//此处产品策略，都不用搜索昵称去开通微博，博客，搜索昵称刚刚用一个东东
							}else{
								sameNickFunc(event,seNVal);//用户一进来，直接点击搜索昵称按钮
							}
							setTimeout(function(){
								ch1.innerHTML = "";
								ch2.innerHTML = "";	
							},200);
						}else{
							textfield.focus();
						}
					}
					
				}else {
					// 网络错误
					if(t){
						closeLayerFunc(t,b,m,1)
					}
					initLayerAll('1_0','b_1','1_0_5');//浮层弹出
					knowBtnFunc(t,b,m);
				}
			}
		});
	}

	//验证输入昵称在微博可不可用
	function verifyNick(val){
		Utils.Io.JsLoad.request(urls.searchNick, {
			GET: {
				uid:$UID,
				nick:val
			},
			onComplete : function (result) {
				if(result && result.code === "A00006"){
					textfield.value="";
					var map = $E("map");
					var provinces = map.getElementsByTagName("div");
					for(var i=0; i<provinces.length; i++){
						SinaEx.removeClass(provinces[i],"location_ico02");
						SinaEx.removeClass(provinces[i],"location_ico");
					}
					var random10 = Math.floor(Math.random()*10+1);
					var random30 = Math.floor(Math.random()*30+1);
					var ch1 = $E("map").children[0].children[0];
					var ch2 = $E("map").children[0].children[1];
					if(result.data.is_legal){
						SinaEx.addClass(provinces[random30-1],"location_ico02");
						ch1.innerHTML = "哇哦！您的昵称唯一";
						ch2.innerHTML = "马上保存参与抽奖";
						ch2.setAttribute("nickSval",val);
					}else{
						textfield.value="";
						textfield.focus();
						ch1.innerHTML = "非常遗憾！您输入的昵称已被占用";
						ch2.innerHTML = "换个昵称试试";
						ch2.setAttribute("nickSval",'');
						// 随机生成1-30之间的任意n数
						var arr = [];
						for(var j=0; j<Number.MAX_VALUE; j++){
							var num = Math.floor(Math.random()*30+1);
							if(checkSameNum(arr,num)){
								if(arr.length<random10){
					                arr.push(num);
					            }else{ 
					                break;
					            }
							}
						}
						for(var m=0; m<arr.length; m++){
							SinaEx.addClass(provinces[arr[m]],"location_ico");
						}
						if(checkSameNum(arr,random30)){
							SinaEx.addClass(provinces[random30-1],"location_ico02");
						}
					}
					ch2.onclick = function(event){
						Core.Events.stopDefaultEvent(event);
						if(ch2.getAttribute("nickSval")){
							var seNVal = ch2.getAttribute("nickSval");
							if(data && data.isgrab &&  data.isopenweibo && data.isopenblog && !data.isprize){
								tongbuNickFunc()
							}else if(data && data.isopenweibo && data.isopenblog){
								synchNickFunc(seNVal);
							}else if(data && data.isopenblog && tuijiannick){
								againOpenWeibo(seNVal);
							}else if(data){
								openLuojiFunc(data,seNVal);//此处产品策略，都不用搜索昵称去开通微博，博客，搜索昵称刚刚用一个东东
							}else{
								sameNickFunc(event,seNVal);//用户一进来，直接点击搜索昵称按钮
							}
							setTimeout(function(){
								ch1.innerHTML = "";
								ch2.innerHTML = "";	
							},200);
						}else{
							textfield.focus();
						}
					}
				}
			}
	 	});
	}
	//随机显示地图的位置不能重复的方法
	function checkSameNum(arrs,el){
		for(var k=0;k<arrs.length;k++){
		    //包含该元素
		    if(arrs[k] === el){
		        //跳出循环
		       return false;
		    }
        }
       	return true;	
	}
});