/**
 * @fileoverview 此文件是应用于博客个人中心改版后，用户引导
 * @author   Liu Xiaoyue || xiaoyue3@staff.sina.com.cn
 * @created     2012-07-27
 * @vertion 0.01
 */
$import("lib/jobs.js");
$import("sina/utils/insertTemplate.js");
$import("sina/utils/io/loadExternalCSS.js");
$import("sina/core/events/addEvent.js");
$import("sina/utils/cookie/getCookie.js");
$import("sina/utils/cookie/setCookie.js");
$import("sina/utils/cookie/deleteCookie.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/events/getEventTarget.js");
$import("sina/core/dom/setStyle2.js");
$import("sina/ui/dialog/backShadow.js");
$import("sina/utils/io/ajax.js");
$import("sina/core/array/uniq.js");
$import("sina/core/string/j2o.js");
$import("sina/core/dom/removeNode.js");

$registJob('profileUserGuide', function() {
	var __getCookie = Utils.Cookie.getCookie,
	__setCookie = Utils.Cookie.setCookie,
	__addEvent = Core.Events.addEvent,
	url,
	cver = scope.$uid,
	getCook = __getCookie("ugv2s_fzp"),
	isAtten = window.location.href.indexOf("atten=1") > -1;

	var nickCookie = __getCookie("nickGuild");

	//浮层模版
	var template = {
		startRelate:'<div class="l_guide" id="#{relateGuide}" style="z-index:20000;" >'+
			'<div class="guide_nav">'+
				'<ul id="labelList">'+
					'<li class="label"><a href="javascript:void(0);"></a></li>'+
					'<li class="label"><a href="javascript:void(0);"></a></li>'+
					'<li class="label"><a href="javascript:void(0);"></a></li>'+
					'<li class="label"><a href="javascript:void(0);"></a></li>'+
					'<li class="label"><a href="javascript:void(0);"></a></li>'+
					'<li class="label"><a href="javascript:void(0);"></a></li>'+
					'<li class="label"><a href="javascript:void(0);"></a></li>'+
					'<li class="label"><a href="javascript:void(0);"></a></li>'+
					'<li class="label"><a href="javascript:void(0);"></a></li>'+
					'<li class="label"><a href="javascript:void(0);"></a></li>'+
					'<li class="label"><a href="javascript:void(0);"></a></li>'+
				'</ul>'+
			'</div>'+
			'<div class="gd_cnt">'+
				'<div class="hd">'+
					'<a title="关闭" class="CP_w_shut" href="javascript:void(0);" id="#{close}">关闭</a>'+
					'<h3 id="#{nick}"></h3>'+
					'<p class="wlcm">你好，欢迎来到新浪博客！告诉我们你的爱好，我们将根据你的爱好为你推荐优质博主</p>'+
				'</div>'+
				'<div class="user_lst" id="#{userList}">'+
					
				'</div>'+
				'<div class="ft">'+
					'<div class="select_all"><input type="checkbox" id="#{selectAll}"/><label for="">关注全部</label></div>'+
					'<div class="opt"><a href="#" id="#{noSelect}">不，谢谢</a><a href="#" class="btn_complete" id="#{doneRelate}">完成</a></div>'+
				'</div>'+
			'</div>'+
		'</div>',
		guildNick: '<div id="#{nickGuild}" class="guide_nctx" style="left:300px; top:20px;"><a id="#{close}" href="javascript:void(0)" class="close" title="关闭"></a><a id="#{modifyBtn}" href="javascript:;" class="btn" title="马上修改"></a></div>'
	};
	//获取用户昵称
	var  timer = setInterval(nicks,300);
	function nicks(){
		if(scope.nickname){
			try {
  				_layer.nick.innerHTML = scope.nickname;
				clearInterval(timer);
   			} catch(e){}	
		}
	}
	if((getCook && getCook === cver) || !isAtten){
		//新用户，未完成昵称修改引导
		if(nickCookie!='done' && isAtten) {
			window.setTimeout(function() {
				renderNickGuild();
			}, 500);
			// renderNickGuild();
			return;
		}else {
			return;
		}
	}

	var option = {
		css: {
			'z-index': '5002',
			'position':$IE6?'absolute':'fixed' ,
			'top': '50%',
			'left': '50%'
		},
		mid: {
			'z-index': '5002',
			'position':$IE6?'absolute':'fixed' ,
			'left': '50%'
		}
	};
	
	var screenW = screen.width, screenH = screen.height; 
	
	//判断是否是新用户
	if(isAtten){
		initRelate();
	}

	Utils.Io.loadExternalCSS('http://simg.sinajs.cn/blog7style/css/module/layer/layer21.css');
	var mask, _layer, _guide,
		_userStruc, _default, diffUser=[], idx;
	var _layer_nick;
	function initRelate(){
		mask = new BackShadow(0.4);
		mask.show();
		_layer = Utils.insertTemplate(document.body,template.startRelate,'BeforeEnd');
		_layer.userList.innerHTML = ['<div id="loading" style="text-align:center;padding-top:200px; height:400px">',
			           				'<img src="http://simg.sinajs.cn/blog7style/images/common/loading.gif">加载中…',
				           		'</div>'].join('');
	    if(screenW < 882 || screenH < 600){
	    	//修复不同分辨率下，浮层无法关闭的情况
	    	_layer.relateGuide.style.position = "absolute";
	    	_layer.relateGuide.style.top = "0px";
	    	_layer.relateGuide.style.left = "0px";
	    }else{
	    	if($IE6){
				Core.Events.addEvent(window, function(){
					_layer.relateGuide && setPos(_layer.relateGuide);
				}, "scroll");
			}
			setTimeout(function(){
				setPos(_layer.relateGuide);
			},200);
	    }
		url = "http://control.blog.sina.com.cn/blog_rebuild/riaapi/profile/userguide/userGuideData.php"; 
		Utils.Io.Ijax.request(url, {
			onComplete: function(result) {
				var result = Core.String.j2o(result);
				if(result && result.code==="A00006") {
					var labList = Core.Dom.byClz(_layer.labelList,"li","label");
					var tags = [],tagId = [];
					//获取不同tag下的用户数
					for(i in result.data){
						tags.push(result.data[i].tag);
						tagId.push(result.data[i].tag_id);
					};
					for(var i = 0;i<labList.length;i++){
						labList[i].children[0].innerHTML = tags[i];
						labList[i].children[0].setAttribute("tag_id",tagId[i]);
					};
					//渲染用户浮层
					var struc = "";
					for(i in result.data){
						var diffId = i;
						diffUser.push(diffId);
						var renderUser = result.data[i].users;
						for(i in renderUser){
							var detail = renderUser[i];
							if(detail.resume === null){
								detail.resume = "";
							}
							struc += '<div class="user_item" style="display:none;" diffuser="'+ diffId +'">'+
								'<div class="thumb"><img src="'+ detail.imgurl +'" width="110px" height="110px" title="'+detail.nickname+'"/><span class="hvbtn addcan" userId="'+i+'">加关注</span></div>'+
								'<dl class="detail" id="#{detail}">'+
									'<dt class="name" title="'+ detail.nickname +'">' + detail.nickname.substring(0,5) +'</dt>'+
									'<dd>访问 '+ detail.pv +'</dd>'+
									'<dd>关注 '+ detail.attention +'</dd>'+
									'<dd class="outline">'+ detail.resume+'</dd>'+
								'</dl>'+
							'</div>';
						}
					};
					_userStruc = Utils.insertTemplate(_layer.userList,struc,'AfterBegin');
				    
					//随机显示某一tag下的用户
					idx = parseInt(10*Math.random());    //返回0~10之间的数
					_default = Core.Dom.byClz(_layer.userList,"div","user_item");
					for(var i=0;i< _default.length; i++){
						if(_default[i].getAttribute("diffuser") === diffUser[idx]){
							_default[i].style.display="";
							labList[idx].children[0].className = "cur";
						}
					}
					if($E("loading")){
						var load = $E("loading");
						Core.Dom.removeNode(load);
					}
					initRelateEvent();
				}else if(result && result.code==="A00001"){
					_layer.relateGuide.style.display = "none";
					mask.close();
				}else if(result && result.code==="A00007"){
					window.location.href = "http://blog.sina.com.cn";
				}
			},
			returnType:"json",
			POST: {
				type:1
			}
		});
	}
	//构建关系浮层所绑定的事件
	function initRelateEvent() {
		var userList = Core.Dom.byClz(_layer.userList,"div","thumb");
		var labelList = Core.Dom.byClz(_layer.labelList,"li","label");
		__addEvent(_layer.doneRelate,function(){
			//批量加关注代码
			var followArr = Core.Dom.byClz(_layer.userList, "span", "hvbtn addyet");
			if(followArr.length !== 0){
				var ids = [], tagid = [];
				for (var i=0; i<followArr.length; i++){
					ids.push(followArr[i].getAttribute("userid"));
					tagid.push(followArr[i].parentNode.parentNode.getAttribute("diffuser"));
				}
				tagid = Core.Array.uniq(tagid);
				var str_ids = ids.join(",");
				var tagids = tagid.join(",");
				var urlAtten = "http://control.blog.sina.com.cn/riaapi/reg/attention_add_batch.php?" + Math.random();
				Utils.Io.Ijax.request(url, {
					POST:{
						type:3,
						tagid:tagids
					},
					onComplete: function(result){
						var result = Core.String.j2o(result);
						if(result && result.code==="A00006") {
							Utils.Io.Ijax.request(urlAtten, {
								POST:{
									uid:scope.$uid,
									aids:str_ids
								},
								onComplete: function(result){
									var result = Core.String.j2o(result);
									var address = window.location.href;
									if(result && result.code==="A00006") {
										_layer.relateGuide.style.display = "none";
										mask.close();
										__setCookie("ugv2s_fzp", scope.$uid, 10*365*24, "/", ".blog.sina.com.cn");
										window.location.href = address.replace(/#/g,'');
									}else{
										_layer.relateGuide.style.display = "none";
										__setCookie("ugv2s_fzp", scope.$uid, 10*365*24, "/", ".blog.sina.com.cn");
										mask.close();
										window.location.href = address.replace(/#/g,'');
									}	
								},
								onException: function(){
									window.location.href = window.location.href.replace(/#/g,'');
								}
							});
						}	
					}
				});
			}else{
				closeRequest();
			}
			
		});
		__addEvent(_layer.close,function(){
			closeRequest();
		});
		//关注某一tag下的 所有用户
		__addEvent(_layer.selectAll,function(){
			if(!_layer.selectAll.checked){
				for(var i = 0;i<userList.length;i++){
					if(userList[i].parentNode.style.display === ""){
						userList[i].children[1].className = "hvbtn addcan"; 
					}
				}
			}else{
				for(var i = 0;i<userList.length;i++){
					if(userList[i].parentNode.style.display === ""){
						userList[i].children[1].className = "hvbtn addyet"; 
					}
				}
			}
		});

		__addEvent(_layer.noSelect,function(){
			closeRequest();
		});
		//单击加关注，取消关注
		for(var i = 0;i<userList.length;i++){
			__addEvent(userList[i].children[1],function(e){
				var evn = Core.Events.getEvent(e);
				var ele = Core.Events.getEventTarget(evn);
				if(ele.className === "hvbtn addyet"){
					ele.className = "hvbtn addcan";
				}else{
					ele.className = "hvbtn addyet";
				}
			});
		}
		//显示不同tag下的用户
		var isClicked;
		for(var i = 0;i<labelList.length;i++){
			__addEvent(labelList[i].children[0],function(e){
				_layer.userList.scrollTop = "0px";
				var evn = Core.Events.getEvent(e);
				var ele = Core.Events.getEventTarget(evn);
				labelList[idx].children[0].className = "";
				ele.parentNode.parentNode.children[0].children[0].className="";
				if(isClicked && isClicked.className === "cur"){
					isClicked.className = "";
				}
				ele.className = "cur";
				isClicked = ele;
				var tagId = ele.getAttribute("tag_id");
				for(var i=0; i<diffUser.length; i++){
					if( tagId === diffUser[i]){
						for(var i=0;i< _default.length; i++){
							_default[i].style.display="none";
							if(_default[i].getAttribute("diffuser") === tagId){
								_default[i].style.display="";
							}
						}
					}
				}
				_layer.selectAll.checked = false;
			});
		}
	}
	//修改昵称引导浮层
	function renderNickGuild() {
		var nickel = Core.Dom.byClass('ntopbar_menu', 'div', document.body);
		var leftpx = parseInt(Core.Dom.getLeft(nickel[0]));
		// var nickwidth = 45;
		var nickwidth = parseInt(nickel[0].children[0].children[0].children[0].offsetWidth);
		if(!mask) {
			mask = new BackShadow(0.4);
			mask.show();
		}
		_layer_nick = Utils.insertTemplate(document.body,template.guildNick,'BeforeEnd');
		_layer_nick.nickGuild.style.left = leftpx + nickwidth/2 + 'px';
		initNickGuildEvent();
	}
	function initNickGuildEvent() {
		__addEvent(_layer_nick.close, function() {
			__setCookie("nickGuild", 'done', 10*365*24, "/", ".blog.sina.com.cn");
			_layer_nick.nickGuild.style.display = 'none';
			mask.close();
		});
		__addEvent(_layer_nick.modifyBtn, function(e) {
		  	var ev = window.event || e;
            if(ev.preventDefault){
                ev.preventDefault();
            }else{
                ev.returnValue = false;
            }
			__setCookie("nickGuild", 'done', 10*365*24, "/", ".blog.sina.com.cn");
			window.location.href = 'http://control.blog.sina.com.cn/blogprofile/nick.php';
		});
	}
	function closeRequest(){
		Utils.Io.Ijax.request(url, {
			onComplete: function(result) {
				var result = Core.String.j2o(result);
				if(result && result.code==="A00006") {
					_layer.relateGuide.style.display = "none";
					
					// mask.close();
					__setCookie("ugv2s_fzp", scope.$uid, 10*365*24, "/", ".blog.sina.com.cn");
					renderNickGuild();
					// var address = window.location.href;
					// window.location.href = address.replace(/#/g,'');
				}
			},
			returnType:"json",
			POST: {
				type:2
			}
		});
	}
	function setPos(obj){
		var w = 882, h = 547;
		obj.style.marginLeft = w / 2 * (-1) + 'px';
		if($IE6){
			obj.style.top = document.documentElement.scrollTop + parseInt(Math.abs((document.documentElement.offsetHeight - h)/2), 10);
			delete option.css.top;
		}else{
			obj.style.marginTop = h / 2 * (-1) + 'px';
		}
		Core.Dom.setStyle2(obj, option.css);
	}
	function setMiddle(obj){
		var w = 952;
		obj.style.marginLeft = w / 2 * (-1) + 'px';
		Core.Dom.setStyle2(obj, option.mid);
	}
 });