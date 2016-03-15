/**
 * @fileoverview 文章页分享
 * @author xy xinyu@staff.sina.com.cn
 */
$import("sina/core/string/encodeHTML.js");
$import("sina/core/string/decodeHTML.js");
$import("lib/jobs.js");
$import("lib/uic.js");
$import("lib/sendLog.js");
$import("other/getImgStaticPath.js");
$import("sina/utils/insertTemplate.js");
$import("lib/login/ui.js");

$registJob('articleShare', function(){
    
	if(!$E("t_" + scope.$articleid)) {
		trace('应该是私密博文');
		return;
	}

	//微博。
	var x = "javascript:void((function(s,d,e,r,l,p,t,z,c,w){var%20f='http://v.t.sina.com.cn/share/share.php?',u=z||d.location,p=['url=',e(u),'&title=',e(t||d.title),'&source=',e(r),'&sourceUrl=',e(l),'&content=',c||'gb2312','&pic=',e(p||''),'&ralateUid=',w].join('');function%20a(){if(!window.open([f,p].join(''),'mb',['toolbar=0,status=0,resizable=1,width=440,height=430,left=',(s.width-440)/2,',top=',(s.height-430)/2].join('')))u.href=[f,p].join('');};if(/Firefox/.test(navigator.userAgent))setTimeout(a,0);else%20a();})(screen,document,encodeURIComponent,'新浪-博客','http://blog.sina.com.cn','"+(scope.$album_pic?getImgStaticPath(scope.$album_pic,'bmiddle'):'')+"','分享" + scope.owenerNickName + "的博文：" + $E("t_" + scope.$articleid).innerHTML.replace(/'/g,"\\'")+" 推荐给@头条博客"+"','http://blog.sina.com.cn/s/blog_" + scope.$articleid + ".html','utf-8','1231759973'));";
    x = Core.String.decodeHTML(x);
    
	if ($E('shareminiblogfromblogatarticlepage')) {
        //scope.album_pic="http://static11.photo.sina.com.cn/middle/5a35c7fct7828f2f3b1aa";
        Lib.Uic.getNickName([scope.$uid], function(oResult){
            var nickname = oResult[scope.$uid] || "";
            nickname = Core.String.encodeHTML(nickname);
            scope.owenerNickName = nickname;
            $E('shareminiblogfromblogatarticlepage').href = x;
        });
    }
	
		
	if($_GLOBAL.diggerOpenFlag) {
		var sharewb = $E('sharewb'), shareqing = $E('shareqing'),sharemail = $E('sharemail');
		if(sharewb){
			sharewb.href=x;
			//分享到微薄布码 guanghui2
            Core.Events.addEvent(sharewb,function (){
                v7sendLog("80_01_04");
            });
		}
		// if(!shareqing && sharewb){ //缓存问题，后加上去的Qing按钮可能不能从页面上看到，所以JS补出来
		// 	shareqing = $C("a");
		// 	shareqing.href = "javascript:;";
		// 	shareqing.innerHTML = '<img width="18" height="18" align="absmiddle" title="分享到新浪Qing" alt="" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon205" />';
		// 	sharewb.parentNode.appendChild(shareqing);
		// }
		// if(shareqing) {
		// 	shareqing.onclick = function(){
		// 		var title = $E("t_" + scope.$articleid).innerHTML,
		// 			pics=[],
		// 			plist = $T($E("sina_keyword_ad_area2"), 'img');
		// 		if(title.length>120){
		// 			title = title.substr(0,120)+"…";
		// 		}
		// 		for(var i=0,len=Math.min(20,plist.length); i<len; i++){
		// 			pics.push(plist[i].src||plist[i].real_src);
		// 		}
		// 		var url = $_GLOBAL.qingURL+'blog/controllers/share.php?searchPics=0&content='
		// 			+ encodeURIComponent('分享' + scope.owenerNickName + '的博文《'+title+'》，查看原文：')
		// 			+ "&url=" + encodeURIComponent(location.href)
		// 			+ "&ralateNick=" + encodeURIComponent("新浪博客")
		// 			//+ '&shareType=0'
		// 			+ '&pics=' + encodeURIComponent(pics.join(","));
		// 		window.open(url, 'shareQing', 'toolbar=0,status=0,resizable=1,width=600,height=520,left='
		// 			+ (screen.width-600)/2 + ',top=' + (screen.height-520)/2);
				
		// 		v7sendLog("80_01_01");
		// 		return false;
		// 	};
		// }
		
		if(!sharemail&&sharewb){
			var con = '<a href="javascript:;" id="sharemail"><img width="16" height="16" align="absmiddle" title="分享到新浪邮箱" alt="" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon211"></a>'
			Utils.insertTemplate(sharewb,con,'beforebegin');
			sharemail = $E("sharemail");
		}
		if(sharemail){
			// 插入奖图标
			// 下线奖图标 @modified xiaoyue3
			// var jiangicon = '<span class="icon_award" style="left:168px; top:19px;cursor:pointer;"></span>';
			// Utils.insertTemplate(sharemail,jiangicon,'BeforeEnd');

			//获取用户昵称
			if(!scope.$rank || !scope.totalPv){
				var timer = setInterval(grades,300);
			    function grades(){
			    	var s = scope.$rank;
			    	var pv = scope.totalPv;
			        if(s && pv){
			            clearInterval(timer);   
			        }
			    }
			}
			sharemail.onclick = function(){
				if($isLogin) {
					var url = 'http://mail.sina.com.cn/share/mail.php?'
						+ "aid=" + encodeURIComponent(scope.$articleid)
						+ '&bl=' + encodeURIComponent(scope.$rank)
						+ '&ba=' + encodeURIComponent(scope.totalPv);
					window.open(url, 'shareMail', 'toolbar=0,status=0,scrollbars=1,resizable=1,width=970,height=630,left='
						+ (screen.width-970)/2 + ',top=' + (screen.height-630)/2);
					return false;
				}else {
					var handler = new Lib.Login.Ui();
					//下线登录浮层邮箱广告的图片 

					// handler.struc = '\
					// 			<div class="CP_layercon2 passLoginItem">\
					// 				<div>\
					// 					<div id="login_move_tip" style="display:none;margin-bottom:12px">可以使用新浪微博、邮箱、通行证的帐号进行登录</div>\
					// 					<div class="boxA">登录名：\
					// 						<input tabIndex="201" type="text" class="fm1" style="width:215px;" name="login_name" id="login_name_d" tabIndex=1/>  <a style="font-size: 12px;" href="http://login.sina.com.cn/signup/signupmail.php?entry=blog&srcuid='+scope.$uid+'&src=blogicp" target="_blank">立即注册</a>\
					// 					</div>\
					// 					<div class="boxA">密　码：\
					// 						<input tabIndex="202" type="password" class="fm1" style="width:215px;" name="login_pass" maxlength="16" id="login_pass_d" tabIndex=2/>  <a style="font-size: 12px;" href="http://login.sina.com.cn/getpass.html" target="_blank">找回密码</a>\
					// 					</div>\
					// 					<div id="login_ckimg" class="boxA" style="display:none"> <p class="p_img">验证码：\
					// 	                  	<input type="text" id="login_vcode" name="login_vcode" class="fm1" size="10" maxlength="5" /> \
					// 	                 	<img width="100" align="absmiddle" id="checkImg" src="http://login.sina.com.cn/cgi/pin.php?r='+ Core.Math.getUniqueId() +'&s=0" /> <a href="javascript:;" onclick="return false;" style="font-size: 12px;"><span id="reloadCode">换一换</span></a></p> \
					// 				    </div>\
					// 					<div class="ErrTips" id="login_div_error"></div>\
					// 					<div class="boxB"><p><input tabIndex="203" type="checkbox" value="" id="login_save" checked="checked" /><label for="login_save"> 记住登录状态</label></p><p id="login_save_tips" style="color:#999;display:none;">建议在网吧/公用电脑上取消该选项</p><p style="margin-top: 8px;"><a id="login_button" class="SG_aBtn SG_aBtnB SG_aBtn_sub" href="javascript:;" tabIndex=204><cite>登录<input type="text"/></cite></a> </p></div>\
					// 				</div>\
					// 				<div class="adv_sinamail">\
     //                    				<a target="_blank" href="http://mail.sina.com.cn/sepwakeup.php?suda-key=mail_sep&suda-value=blog_qing" title="21天好礼,一波接一波"></a>\
     //                				</div>\
					// 				<div class="CP_lg_ad SG_j_linedot1">\
					// 					<iframe id="login_ad" src="http://blog.sina.com.cn/lm/iframe/71/2008/0731/21.html" frameborder="0" scrolling="no" height="25" width="auto"></iframe>\
					// 				</div>\
					// 			</div>';
					handler.login(function() {
						var url = 'http://mail.sina.com.cn/share/mail.php?'
							+ "aid=" + encodeURIComponent(scope.$articleid)
							+ '&bl=' + encodeURIComponent(scope.$rank)
							+ '&ba=' + encodeURIComponent(scope.totalPv);
						window.open(url, 'shareMail', 'toolbar=0,status=0,scrollbars=1,resizable=1,width=970,height=630,left='
							+ (screen.width-970)/2 + ',top=' + (screen.height-630)/2);
						return false;
					});
				}
				
			};
		}


		if($E('sharexn')) {
			$E('sharexn').href="javascript:u='http://share.xiaonei.com/share/buttonshare.do?link='+location.href+'&title='+encodeURIComponent(document.title);window.open(u,'xiaonei','toolbar=0,resizable=1,scrollbars=yes,status=1,width=626,height=436');void(0)";
			//分享到校内，人人布码 guanghui2
			Core.Events.addEvent($E('sharexn'),function (){
			    v7sendLog("80_01_07");
			});
		}
	   // $E('sharebd').href="javascript:u=location.href;t=document.title;c = '' + (window.getSelection ? window.getSelection() : document.getSelection ? document.getSelection() : document.selection.createRange().text);var url='http://cang.baidu.com/do/add?it='+encodeURIComponent(t)+'&iu='+encodeURIComponent(u)+'&dc='+encodeURIComponent(c)+'&fr=ien#nw=1';window.open(url,'_blank','scrollbars=no,width=600,height=450,left=75,top=20,status=no,resizable=yes'); void 0";
		//$E('sharedl').href='http://del.icio.us/post?url='+location.href+'&title='+encodeURIComponent(document.title);
		if($E('sharedb')) {
			$E('sharedb').href="http://www.douban.com/recommend/?url="+window.location.href+"&title="+encodeURIComponent(document.title)+";window.open(u,'douban','toolbar=0,resizable=1,scrollbars=yes,status=1,width=450,height=330');void(0)";
			//分享到豆瓣布码 guanghui2
            Core.Events.addEvent($E('sharedb'),function (){
                v7sendLog("80_01_08");
            });
		}
		if($E('sharekx')) {
			$E('sharekx').href="javascript:d=document;t=d.selection?(d.selection.type!='None'?d.selection.createRange().text:''):(d.getSelection?d.getSelection():'');void(kaixin=window.open('http://www.kaixin001.com/~repaste/repaste.php?&rurl='+escape(d.location.href)+'&rtitle='+escape('"+document.title+"')+'&rcontent='+escape('"+document.title+"'),'kaixin'));kaixin.focus();";
			 //分享到开心布码 guanghui2
            Core.Events.addEvent($E('sharekx'),function (){
                v7sendLog("80_01_06");
            });
		}
		
		var sm = $E('sharemsn');
		if(sm) {
			var href = [];
			href.push('url='+encodeURIComponent('http://blog.sina.com.cn/s/blog_' + scope.$articleid + '.html'));
			var title = $E('t_'+scope.$articleid);
			if($IE) {
				title = title.innerText;
			} else {
				title = title.textContent;
			}
			href.push('title='+encodeURIComponent(title));
			var loc = scope.$album_pic ? getImgStaticPath(scope.$album_pic,'bmiddle') : 'http://portrait'+(parseInt(scope.$uid)%8+1)+'.sinaimg.cn/'+scope.$uid+'/blog/180';
			href.push('screenshot='+encodeURIComponent(loc));
			var ele = $E('sina_keyword_ad_area2');
			if(ele) {
				if($IE) {
					ele = ele.innerText;
				} else {
					ele = ele.textContent;
				}
				ele = ele.replace(/\n/ig, '');
				ele = ele.replace(/^\s\s*/, '');
				var ws = /\s/;
				var i = ele.length;
				while (ws.test(ele.charAt(--i)));
				href.push('description='+encodeURIComponent(ele.substring(0,101)));
			}
			//href.push('wa=wsignin1.0');
			sm.href="http://profile.live.com/badge/?"+href.join('&');
			sm.target = '_blank';
			 //分享到MSN布码 guanghui2
            Core.Events.addEvent(sm,function (){
                v7sendLog("80_01_05");
            });
		}
	}
			
	if ($E('moreshares')) {
        Core.Events.addEvent($E('moreshares'), function(){
            if ($E('sharelayer')) {
                if ($E('sharelayer').style.display == "none") {
                    var e = Core.Events.fixEvent(Core.Events.getEvent());
                    var xy = Core.Dom.getXY($E('moreshares'));
                    $E('sharelayer').style.left = (xy[0] - 45) + "px";
                    $E('sharelayer').style.top = (xy[1] + 15) + "px";
                    $E('sharelayer').style.display = "";
                }
                else {  }
            }
            else {
                var html = '<div id="sharelayer" style="z-index:100;width:120px;" class="tb_layer_Y tb_layer_w2">' +
                '<div class="tb_layer_arrow"></div>' +
                '<div class="tb_layer_Y_main" >' +
                '<div class="tb_ps_share" style="width:96px;">' +
				'<span class="share"><a id="sharewb" href="#" title="分享到新浪微博"><img height="16" align="absmiddle" width="16" title="微博" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon51"></a></span>' +
                '<span class="share"><a id="sharexn" href="#" title="分享到人人"><img height="16" align="absmiddle" width="16" title="人人" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon113"></a></span>' +
               // '<span class="share"><a id="sharebd" href="#" title="分享到百度收藏"><img height="16" align="absmiddle" width="16" title="百度" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon114"></a></span>' +
               // '<span class="share"><a id="sharedl" target="_blank" href="#" title="分享到美味书签"><img height="16" align="absmiddle" width="16" title="美味书签" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon115"></a></span>' +
                '<span class="share"><a id="sharedb" target="_blank" href="#" title="分享到豆瓣"><img height="16" align="absmiddle" width="16" title="豆瓣" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon116"></a></span>' +
                '<span class="share"><a id="sharekx" href="#" title="分享到开心001"><img height="16" align="absmiddle" width="16" title="开心001" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon117"></a></span>' +
               // '<span class="share"><a id="sharetx" href="#" title="分享到QQ书签"><img height="16" align="absmiddle" width="16" title="腾讯" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon118"></a></span>' +
                '<div class="clearit"></div>' +
                '</div>' +
                '</div>' +
                '</div>';
				
				//输出到页面上并确定位置-------------------------------
                Core.Dom.insertHTML(document.body, html, 'beforeend');
                var e = Core.Events.fixEvent(Core.Events.getEvent());
                var xy = Core.Dom.getXY($E('moreshares'));
                $E('sharelayer').style.left = (xy[0] - 45) + "px";
                $E('sharelayer').style.top = (xy[1] + 15) + "px";
				//-----------------------------------------------------
				
				$E('sharewb').href=x;
				$E('sharexn').href="javascript:u='http://share.xiaonei.com/share/buttonshare.do?link='+location.href+'&title='+encodeURIComponent(document.title);window.open(u,'xiaonei','toolbar=0,resizable=1,scrollbars=yes,status=1,width=626,height=436');void(0)";
               // $E('sharebd').href="javascript:u=location.href;t=document.title;c = '' + (window.getSelection ? window.getSelection() : document.getSelection ? document.getSelection() : document.selection.createRange().text);var url='http://cang.baidu.com/do/add?it='+encodeURIComponent(t)+'&iu='+encodeURIComponent(u)+'&dc='+encodeURIComponent(c)+'&fr=ien#nw=1';window.open(url,'_blank','scrollbars=no,width=600,height=450,left=75,top=20,status=no,resizable=yes'); void 0";
				//$E('sharedl').href='http://del.icio.us/post?url='+location.href+'&title='+encodeURIComponent(document.title);
				$E('sharedb').href="http://www.douban.com/recommend/?url="+window.location.href+"&title="+encodeURIComponent(document.title)+";window.open(u,'douban','toolbar=0,resizable=1,scrollbars=yes,status=1,width=450,height=330');void(0)";
				$E('sharekx').href="javascript:d=document;t=d.selection?(d.selection.type!='None'?d.selection.createRange().text:''):(d.getSelection?d.getSelection():'');void(kaixin=window.open('http://www.kaixin001.com/~repaste/repaste.php?&rurl='+escape(d.location.href)+'&rtitle='+escape('"+document.title+"')+'&rcontent='+escape('"+document.title+"'),'kaixin'));kaixin.focus();";
				//$E('sharetx').href="javascript:window.open('http://shuqian.qq.com/post?from=3&title='+encodeURIComponent(document.title)+'&uri='+encodeURIComponent(location.href)+'&jumpback=2&noui=1','favit','width=930,height=470,left=50,top=50,toolbar=no,menubar=no,location=no,scrollbars=yes,status=yes,resizable=yes');void(0)";
				Core.Events.addEvent($E('sharelayer'), function(){
                    var e = Core.Events.fixEvent(Core.Events.getEvent());
                    var xy = Core.Dom.getXY($E('sharelayer'));
                    var scrollPos = Core.System.getScrollPos(document);
                    var left = xy[0];
                    var top = xy[1];
                    var ex = scrollPos[1] + e.clientX;
                    var ey = scrollPos[0] + e.clientY;
                    //trace('left='+left+";x="+ex);
                    //trace('top='+top+";y="+ey);
                    //trace('src='+e.target.id);
                    if (ex >= (left + 116) || ex <= left || ey >= (top + 42) || ey <= top) {
                        $E('sharelayer').style.display = "none";
                    }
                }, 'mouseout');
            }
        }, 'mouseover');
    }

	var weimiShare = function(){
		var weimiTpl = ['<div class="layer_weimi">',
									'<a href="javascript:;" class="close" id="weimiShareClose"></a>',
									'<div class="title">微米分享</div>',
									'<ol class="list">',
											'<li class="step code"><img id="weimiQRCode" alt="二维码" /></li>',
											'<li class="step step1">',
												'<div class="pic"><img src="http://simg.sinajs.cn/blog7style/images/common/weimilayer/1.jpg" alt="步骤一" /></div>',
												'<div class="desc"><span class="num">1</span><span class="txt">微米扫描左侧二维码</span></div>',
											'</li>',
											'<li class="step step2">',
												'<div class="pic"><img src="http://simg.sinajs.cn/blog7style/images/common/weimilayer/2.jpg" alt="步骤二" /></div>',
												'<div class="desc"><span class="num">2</span><span class="txt">点击右上角的分享按钮</span></div>',
											'</li>',
											'<li class="step step3">',
												'<div class="pic"><img src="http://simg.sinajs.cn/blog7style/images/common/weimilayer/3.jpg" alt="步骤三" /></div>',
												'<div class="desc"><span class="num">3</span><span class="txt">选择分享给朋友</span></div>',
											'</li>',
									'</ol>',
								'</div>'].join("");
		
		var _this = {},that = {};
		// var backShadow = new BackShadow();
		
		var weimiShareLayer, closeBtn, shareBtn,
			qrImg = "http://comet.blog.sina.com.cn/qr?"+location.href.replace(/[#?](.*)/,"");
			// qrImg = "http://comet.blog.sina.com.cn/qr?http://blog.sina.com.cn/s/blog_9e63ccdd0101d5sh.html#commonComment"
		
		that.init = function(){
			shareBtn = $E("shareweimi");
			if (!shareBtn){
				_this.createShareNode();
			}
			// console.log(shareBtn)
			Core.Events.addEvent(shareBtn, _this.showLayer, 'click');
			Core.Events.addEvent(window, _this.resizeLayer, 'resize');
		};
		
/* 		_this.bindEvent = function(){

			Core.Events.addEvent(closeBtn, _this.hideLayer, 'click');
			Core.Events.addEvent(shareBtn, _this.showLayer, 'click');
			// Core.Events.addEvent(window, _this.setPos, 'resize');
		} */
		
		_this.createShareNode = function(btn){
			if(!$E("shareqing")){
				return;
			}
			var pNode = $E("shareqing").parentNode,
				  posNode = $E("shareqing"),
				  newNode;
			newNode = $C("a");
			newNode.id = "shareweimi";
			newNode.innerHTML = '<img width="51" height="16" align="absmiddle" title="分享到微米" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon213">';
			pNode.insertBefore(newNode, posNode);
			shareBtn = $E("shareweimi");
		};
		
		_this.createShareLayer = function(){
		
		// '<div style="position:absolute; top:100px; left:100px;" id="weimiShareLayer">'
			var node = $C("div");
			node.id = "weimiShareLayer";
			node.innerHTML = weimiTpl;
			document.body.appendChild(node);
			$E("weimiQRCode").src = qrImg;
			weimiShareLayer = $E("weimiShareLayer");
			closeBtn = $E("weimiShareClose");
			
			Core.Events.addEvent(closeBtn, _this.hideLayer, 'click');
		};
		
		_this.showLayer = function(){
			// debugger;
			// backShadow.show();
			weimiShareLayer = $E("weimiShareLayer");
			if (!weimiShareLayer){
				_this.createShareLayer();
			}
			_this.setPos();
			weimiShareLayer.style.display = "";
			return false;
		};
		
		_this.hideLayer = function(){
			// backShadow.hidden();
			weimiShareLayer && (weimiShareLayer.style.display = "none");
			return false;
		};
		
		_this.resizeLayer = function(){
			if (!weimiShareLayer){
				return;
			}
			if (weimiShareLayer.style.display == "none"){
				return;
			}
			_this.setPos();
		}
		
		_this.setPos = function(){
			// var pos = Core.Dom.getXY(shareBtn);
			// console.log(pos);
			var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
			var clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
			var layerWidth = 586;
			weimiShareLayer.style.position = $IE6 ? "absolute" : "fixed";
			weimiShareLayer.style.left = Math.abs(clientWidth-layerWidth)/2 + "px";
			weimiShareLayer.style.zIndex = "1025";
			if ($IE6) {
				weimiShareLayer.style.top = document.documentElement.scrollTop + 50 + "px";
			} else {
				weimiShareLayer.style.top = 50 + "px";
			}
			// weimiShareLayer.style.position = "absolute";
			// weimiShareLayer.style.top = pos[1] + "px";
			// weimiShareLayer.style.left = pos[0] + "px";
		};
		
		return that;
	
	};
	// console.log("weimi")
	var weimi = weimiShare();
	weimi.init();
	
	//微博抢红包活动，活动于2014年2月24日下线 @zhihang1
	// var weiboShare = function(){
	// 	var _this = {},
	// 		that = {},
	// 		shareBtn;

	// 	that.init = function(){
	// 		shareBtn = $E('shareweibo');
	// 		if(!shareBtn){
	// 			_this.createShareNode();
	// 		}
	// 		Core.Events.addEvent(shareBtn, _this.clickHandle, 'click');			
	// 	}

	// 	_this.createShareNode = function(){
	// 		var qingBtn = $E("shareqing"),
	// 		pNode = qingBtn.parentNode;
	// 		var oA = $C('a');
	// 		oA.href = 'javascript:;';
	// 		oA.id = 'shareweibo';
	// 		oA.innerHTML = '<img width="50" height="16" align="absmiddle" class="" src="http://simg.sinajs.cn/blog7style/images/common/weibo_prize.png" title="分享到新浪微博">';
	// 		pNode.insertBefore(oA, qingBtn);
	// 		pNode.insertBefore(document.createTextNode(' '),qingBtn); //插入的a标签后边有个空格
	// 		pNode.insertBefore(document.createTextNode(' '),oA); //插入的a标签后边有个空格
	// 		shareBtn = $E('shareweibo');
	// 	}

	// 	_this.clickHandle = function(){
	// 		var title = $E("t_" + scope.$articleid).innerHTML,
	// 			textNode = $E('sina_keyword_ad_area2'),
	// 			text;
	// 		if(title.length>60){
	// 			title = title.substr(0,60)+"...";
	// 		}
	// 		if(typeof textNode.innerText === 'string'){
	// 			text = textNode.innerText
	// 		}else{
	// 			text = textNode.textContent
	// 		}
	// 		text = text.replace(/\s+/g, '');
	// 		if(text.length >60){
	// 			text = text.substr(0,60)+'...';
	// 		}
	// 		var url = 'http://service.weibo.com/share/share.php?appkey=&title='
	// 			+ encodeURIComponent('#新浪博客让红包飞# ')
	// 			+ encodeURIComponent('分享自' + scope.owenerNickName + ' 《' + title + '》 -    ')
	// 			+ encodeURIComponent(text)
	// 			+ encodeURIComponent(' (来自 @头条博客) - ')
	// 			+ '&url=' + encodeURIComponent(window.location.href)
	// 			+ '&source=blog&retcode=0&ralateUid=';
	// 		window.open(url, '', 'toolbar=0,status=0,resizable=1,scrollbars=1,width=634,height=634,left=' //scrollbars=1可防止登录弹层不居中
	// 			+ (screen.width-634)/2 + ',top=' + (screen.height-634)/2);

	// 		v7sendLog("29_01_01");
	// 		return false;
	// 	}

	// 	return that;
	// }
	// var weibo = weiboShare();
	// weibo.init();
});

