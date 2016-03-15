/**
 * @fileoverview
 *	开通博客弹出浮层
 * @author zhihan | zhihan@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("lib/jobs.js");
$import("lib/lazyload.js");
$import("sina/ui/dialog/dialog.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/trim.js");
$import("sina/utils/cookie/getCookie.js");
$import("lib/util/ls.js");
$import("lib/msg/obMsg.js");
$import("lib/checkAuthor.js");

(function() {
	if(scope.blogOpener) {
		scope.addBlogOpenerEvent = function(){};
		return;
	}
	var openURL = 'http://control.blog.sina.com.cn/riaapi/reg/open_blog.php';

	//关于开通新博客
	var openBlog = function() {
		this._hasInit = false;
	};
	
	openBlog.prototype = {
	
		getCon : function() {
			/** zk
			return '<div class="CP_layercon3">\
			<div class="blognoopen" id="tipToOpenOrNot">\
					  <div class="noopen_tit SG_j_linedot1 SG_txtb">您还未开通新浪博客，请先开通。</div>\
				</div>\
				<div class="blognopenBox">\
					<div class="blognoopenTips">\
						<p><strong>只需一步，立即开通新浪博客</strong></p>\
						<p>您目前正在使用的通行账号是<span class="SG_clewtxtb">'+this.key+'</span></p>\
					</div>\
					<table border="0" cellspacing="0" cellpadding="0">\
					  <tr>\
						<th scope="row"><em class="SG_clewtxta">*</em>博客名称：</th>\
						<td><input id="blogNameInput_t" type="text" value="'+getShotName()+'" class="noopen_input1" /> <img id="blogNameIcon_t" height="15" align="absmiddle" width="15" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon49">\
						<p id="blogNameTip_t" class="tip SG_txtb">12个中文或24个字符以内</p>\
						<p id="blogNameError_t" class="err SG_clewtxta"></p>\
						</td>\
					  </tr>\
					  <tr>\
						<th scope="row">地址：</th>\
						<td>http://blog.sina.com.cn/ <input type="text" id="blogLocInput_t" class="noopen_input2" /> <img style="display:none" id="blogLocIcon_t" height="15" align="absmiddle" width="15" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon49">\
							<p id="blogLocTip_t2" class="tip SG_txtb">地址确认后不可修改，如果没想好，可以先不填，进入自己博客后再填写。</p>\
							<p style="display:none" id="blogLocTip_t1" class="tip SG_txtb">可以是3-24位小写字母与数字的组合，不支持纯数字。</p>\
							<p style="display:none" id="blogLocError_t" class="err SG_clewtxta"></p>\
						</td>\
					  </tr>\
					  <tr>\
						<th scope="row"></th>\
						<td><a href="javascript:void(0)" onclick="return false;" id="openBlogOk" class="SG_aBtn SG_aBtnB "><cite>完成开通</cite></a>&nbsp;&nbsp;<a href="javascript:void(0)" id="openBlogCancel" onclick="return false;" class="SG_aBtn SG_aBtnB "><cite>取消</cite></a> </td>\
					  </tr>\
					</table>\
				</div>\
			</div>'*/

            var checkcodeHTML = ['<div class="boxA" style="margin: 20px 0; overflow: hidden; zoom: 1;">'
            ,'<label style="font-size: 14px; float: left; line-height: 22px;">验证码：</label>'
            ,'<input style="float: left; width: 50px; margin-right: 7px;" id="fcheckword" name="checkword" type="text" value="">'
            ,'<span style="float: left; margin-top:2px;"><img style="vertical-align: middle; margin-right: 5px;" id="fcode_img" class="code_img" src="http://interface.blog.sina.com.cn/riaapi/checkwd_image.php" alt="验证码"></span>'
                    ,'<span style="float: left;">'
,'<a style="float: left; margin:3px 0 0 3px; *display: inline; color: #3e6b71; text-decoration: none;" id="fcode_link" id="comment_get_vcode" href="javascript:;" onclick="document.getElementById(\'fcode_img\').src = \'http://interface.blog.sina.com.cn/riaapi/checkwd_image.php?t=\'+ +new Date();return false;">看不清，换一张</a> <img id="play_img" name="play_img" src="http://image2.sina.com.cn/blog/tmpl/v3/images/blank.gif" align="absmiddle" style="margin:0 2px 0 4px;" height="15"> '
,'</span>'

            ,'<p style="display:block;clear:both;" id="fcheckwordErr" class="tip"></p>'
          ,'</div>'].join('');
			return [
					'<div class="CP_layercon8">'+
			        	'<div class="nowOpenBlog">'+
			        	    '<strong>您的博客尚未开通,仅一步操作就能开通您的个人博客</strong>'+
			                '<div class="boxA">'+
			                  '<label>博客名称：</label>'+
			                  '<input id="blogNameInput_t" type="text" class="ipt" />'+
			                  '<img style="display:none" id="blogNameIcon_t" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" class="SG_icon SG_icon49 tips">'+
			                  '<p id="blogNameError_t" class="tip">名称不能为空</p>'+
			                '</div>'+
			                // '<div class="boxA">'+
			                //   '<label>个人昵称：</label>'+
			                //   '<input id="blogLocInput_t" type="text" class="ipt" />'+
			                //   '<img style="display:none" id="blogLocIcon_t" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" class="SG_icon SG_icon49 tips">'+
			                //   '<p id="blogLocError_t" class="tip">昵称不能为空</p>'+
			                // '</div>'+
							'<div  class="boxA"> '+
							  '<p>隐私设置：'+
	                  			'<input type="radio" name="isPrivate_t" checked id="openAll1_t" class="rd" /><label for="openAll1_t">对所有人开放</label>'+
	                  			'<input type="radio" name="isPrivate_t" id="openMe1_t" class="rd" /><label for="openMe1_t">仅对自己开放，私密博客</label>'+
	                  	      '</p>'+
	               			'</div>'+
                            checkcodeHTML+
			            	'<div id="ErrTips_t" class="ErrTips">系统繁忙，请稍后再试</div>'+
							'<div class="boxB">'+
							  '<p><a id="openBlogOkBtn_t" class="btn" href="javascript:void(0)">完成开通</a><a id="openBlogCancel" href="javascript:void(0)">取消</a></p>'+
							'</div>'+
			            '</div>'+
		      		'</div>'
				].join("");
		}
		
		,_initDialog : function() {
			Lib.checkAuthor();
			this.key = getKeyName();
			this._dialog = winDialog.createCustomsDialog({
					content: this.getCon()
			}, "openblog");
			this.bindEvent();
			blogNameEvent($E('blogNameInput_t'),$E('blogNameError_t'),[],$E('blogNameIcon_t'));
			// blogLocEvent($E('blogLocInput_t'),$E('blogLocError_t'),[],$E('blogLocIcon_t'));
		}
		
		,showDialog : function(callBack, needToOpen, forceOpen) {
			needToOpen = needToOpen || false;
			if(!this._hasInit) {
				this._initDialog();
				this._hasInit = true;
			}
			var me = this;
			scope.whenOpenBlogCallback = callBack;
			if(!scope.hasOpenBlog) {
				trace('这是一位后登陆的用户');
				var t = 0;
				var timmer = setInterval(function(){
					trace('呀，怎么还没有出结果啊--'+t);
					if(scope.hasOpenBlog) {
						clearInterval(timmer);
						if(scope.hasOpenBlog == 'open') {
							trace('并且他开通的博客');
							if(scope.whenOpenBlogCallback) {
								scope.whenOpenBlogCallback();
							}
						} else {
							trace('他们没有开通博客');
							me._showDialog(needToOpen);
						}
					}
					t++;
					if(t == 10) {
						Lib.checkAuthor();
						trace('等不及了，自己发吧。。。');
						clearInterval(timmer);
						(new Interface("http://control.blog.sina.com.cn/riaapi/profile/unread.php","jsload")).request({
							GET : {
								uid:$UID,
								product:"blog"
							},
							onSuccess : function (data) {
								scope.hasOpenBlog = data.isbloguser == 1 ? 'open' : 'no';
								trace('~~~~~~~~~~~~~~~~~~~'+scope.hasOpenBlog);
								if(scope.hasOpenBlog == 'open') {
									trace('并且他开通的博客');
									if(scope.whenOpenBlogCallback) {
										scope.whenOpenBlogCallback();
									}
								} else {
									if(!$E('openblogcss')) {
										Utils.Io.loadCss({
											id:'openblogcss',
											url:$_GLOBAL.cssBasicURL + 'module/layer/re_nowopen.css'
										});
									}
									trace('他们没有开通博客');
									me._showDialog(needToOpen);
								}
							}
						});
					}
				},10);
			} else {
				trace('这是已登陆的用户');
				if(scope.hasOpenBlog == 'open') {
					trace('并且他开通的博客');
					if(scope.whenOpenBlogCallback) {
						scope.whenOpenBlogCallback();
					}
				} else {
					if(!$E('openblogcss')) {
						Utils.Io.loadCss({
							id:'openblogcss',
							url:$_GLOBAL.cssBasicURL + 'module/layer/re_nowopen.css'
						});
					}
					trace('他们没有开通博客');
					this._showDialog(needToOpen);
				}
			}
			if(forceOpen){
				$E("openBlogCancel").style.display = "none";
				this._dialog.getNodes().btnClose.style.display = "none";
			}
		}
		
		,_showDialog : function(needToOpen) {
			$E('blogNameInput_t').value = getShotName();
			hiddenError($E('blogNameError_t'),$E('blogNameIcon_t'));
			// $E('blogLocInput_t').value = $nick;
			// hiddenError($E('blogLocError_t'),$E('blogLocIcon_t'));
			$E('ErrTips_t').style.visibility="hidden";
			
			$E("blogNameIcon_t").style.display="none";
			// $E("blogLocIcon_t").style.display="none";
			/** zk
			$E('blogLocIcon_t').style.display = 'none';
			
			if(needToOpen) {
				$E('tipToOpenOrNot').style.display = 'none';
			} else {
				$E('tipToOpenOrNot').style.display = '';
			}*/
			
			this._dialog.show();
			this._dialog.setAreaLocked(true);
			this._dialog.setMiddle();
		}
		
		,bindEvent : function() {
			var me = this;
			if($E('fcheckword')){
				$E('fcheckword').onfocus = function(){
				    if($E('fcheckwordErr').innerHTML.length > 0) {
				        $E('fcheckwordErr').innerHTML = '';
				        this.value = '';
				    }
				}
			}
            if($E('fcode_img')){
            	$E('fcode_img').onclick = function(){
            	    this.src = 'http://interface.blog.sina.com.cn/riaapi/checkwd_image.php?t='+ +new Date();
            	}
            }
            Core.Events.addEvent($E('openBlogCancel'),function(){
				me.closeDialog();
				return false;
			});
			Core.Events.addEvent($E('openBlogOkBtn_t'),function(){
                if($E('fcheckword').value === '') {
                    showError($E('fcheckwordErr'),'验证码不能为空。');
                    return;
                }
				whenOpenBlog({
					'nameErrorEle' : $E('blogNameError_t')
					// ,'locErrorEle' : $E('blogLocError_t')
					,'nameOkIcon' : $E('blogNameIcon_t')
					// ,'locOkIcon' : $E('blogLocIcon_t')
					,'openName' : ($E('blogNameInput_t').value || getShotName())
					// ,'openLoc' : $E('blogLocInput_t').value
					,'isprivate' : $E('openAll1_t').checked?0:1
					,'errorEle':$E("ErrTips_t")
                    ,'errorCheckword' :$E('fcheckwordErr')
                    ,'checkword' : $E('fcheckword')
					,'from':"floatingLayer"
					,'okCallback' : function(res, blogInfo){
						if(scope.whenOpenBlogCallback) {
							scope.whenOpenBlogCallback(res, blogInfo);
						}
						if($E('openedBlogTray') && $E('openedBlogTray').style.display == 'none') {
							$E('outOfOpenBlogTray').style.display = 'none';
							$E('noOpenedBlogTray').style.display = 'none';
							$E('openedBlogTray').style.display = '';
						}
						if($E('noOpendBlogSearchTip') && $E('noOpendBlogSearchTip').style.display == 'block') {
							$E('noOpendBlogSearchTip').style.display = 'none';
							$E('opendBlogSearchTip').style.display = 'block';
						}
						scope.hasOpenBlog = 'open';
						me.closeDialog();
						scope.whenOpenBlogCallback = function(){};
					}
				});
				
				return false;
			});
		}

		,closeDialog : function() {
			var me = this;
			this._dialog.hidden();
		}
	}
	
	function getShotName() {
		var val = $nick;
		var nameLen = Core.String.byteLength(val);
		while(nameLen > 18) {
			val = val.substring(0,val.length-1);
			nameLen = Core.String.byteLength(val);
		}
		return val+'的博客';
	}
	scope.openBlogGetShotName = getShotName;
	
	//关于绑定博客名称事件
	function blogNameEvent(inputEle,errEle,optArr,icon) {
		inputEle.onfocus = function(){
			inputEle.className="ipt focus";
			styleThey(optArr,'');
			icon.style.display="";
		};
		inputEle.onblur = function(){
			inputEle.className="ipt";
			checkBlogName(inputEle,errEle,icon);
			styleThey(optArr,'none');
		};
		inputEle.onkeyup = function(){
			checkBlogName(inputEle,errEle,icon);
		};
	}
	scope.openBlogNameEvent = blogNameEvent;
	
	//关于绑定博客URL地址
	// function blogLocEvent(inputEle,errEle,optArr,icon) {
	// 	inputEle.onfocus = function(){
	// 		inputEle.className="ipt focus";
	// 		styleThey(optArr,'');
	// 		icon.style.display="";
	// 	};
	// 	inputEle.onblur = function(){
	// 		inputEle.className="ipt";
	// 		checkUserNickname(inputEle,errEle,icon);
	// 		//styleThey(optArr,'none');
	// 	};
	// 	inputEle.onkeyup = function(){
	// 		checkUserNickname(inputEle,errEle,icon);
	// 	};
	// }
	// scope.openBlogLocEvent = blogLocEvent;
	
	//关于提交开通地址
	function whenOpenBlog(opt) {
		//防止重复提交
		if(whenOpenBlog.requestComplete === false){
			return;
		}
		
		if(opt.nameErrorEle.innerHTML) {
			changeTextBgC(opt.nameErrorEle.parentNode);
			setTimeout(function(){
				changeTextBgC(opt.nameErrorEle.parentNode);
			},442);
			return;
		}
		// if(opt.locErrorEle.innerHTML) {
		// 	changeTextBgC(opt.locErrorEle.parentNode);
		// 	setTimeout(function(){
		// 		changeTextBgC(opt.locErrorEle.parentNode);
		// 	},442);
		// 	return;
		// }
	    
        whenOpenBlog.requestComplete=false;
		
		var targetButtonId=opt.from==="floatingLayer"?"openBlogOkBtn_t":"openBlogOkBtn";
		//显示完成开通按钮loading状态
		$E(targetButtonId).className="loading";
		var blogInfo = {
			// loginNick : opt.openLoc,
			loginName : getKeyName(),
			blogName : opt.openName
		}
        
		new Interface(openURL, "jsload").request({
			GET : {
				'uid' : $UID,
				// 'uname' : blogInfo.loginNick,
				'loginname' : blogInfo.loginName,
				'blogname' : blogInfo.blogName,
				'version' : 7,
				'src' : 'layer',
				'isprivate':opt.isprivate,
                'checkword' : opt.checkword ? opt.checkword.value : ''
			},
			onSuccess : function(res){
				whenOpenBlog.requestComplete=true;
				$E(targetButtonId).className="btn";
				opt.okCallback(res, blogInfo);
				blogInfo = null;
				//Utils.Cookie.setCookie("remberloginname", escape(scope.$loginname), 2400, "/", ".blog.sina.com.cn");
				//window.location.href = jumpPhp + scope.$src + "&version=7";
			},
			onError : function(res){
				var nameErr = $E('blogNameError'),nameIcon = $E('blogNameIcon'), 
					layerNameErr = $E('blogNameError_t'), layerNameIcon = $E('blogNameIcon_t');
				switch(res.code) {
					//博客名称有敏感词
					case 'A11008':
						if (nameErr && nameIcon) {
							showError(nameErr, '输入内容有误，请修改', nameIcon);
						};
						if (layerNameErr && layerNameIcon) {
							showError(layerNameErr, '输入内容有误，请修改', layerNameIcon);
						};
						break;
					//博客昵称有敏感词
					// case 'A11009':
					// 	showError($E('blogLocError'), '输入内容有误，请修改', $E('blogLocIcon'));
					// 	break;
					//博客名称和昵称都有敏感词
					case 'A11010':
						if (nameErr && nameIcon) {
							showError(nameErr, '输入内容有误，请修改', nameIcon);
						};
						if (layerNameErr && layerNameIcon) {
							showError(layerNameErr, '输入内容有误，请修改', layerNameIcon);
						};
						// showError($E('blogLocError'), '输入内容有误，请修改', $E('blogLocIcon'));
						break;
                    case 'B36002':
                        showError(opt.errorCheckword,'验证码错误，请修改。')
                        break
					default:
						showError(opt.errorEle, '系统繁忙，请稍后再试。');
						break;
				}

				whenOpenBlog.requestComplete=true;
				$E(targetButtonId).className="btn";
				// setTimeout(function(){
				// 	showError(opt.errorEle,$SYSMSG[res.code]);
				// },450);
			}
		});
	}
	scope.openBlogWhenOpenBlog = whenOpenBlog;
	
	function changeTextBgC(ele) {
		for (var i = 1; i <= 55; i++) {
		  (function(val) {
			setTimeout(function() {
				  ele.style.backgroundColor = 'rgb(255, '
					  + +(200 + val) + ', ' + (200 + val) + ')';
				}, val * 8)
		  })(i);
		}
	}
	
	function getKeyName() {
		var key = decodeURIComponent(Utils.Cookie.getCookie('SUP'));
		key = key.split('&name=')[1];
		key = decodeURIComponent(key.split('&')[0]);
		return key;
	}
	
	// function checkUserNickname(inputEle,errEle,icon){
	// 	//4-20个字符  只能是中文,英文,数字
	// 	var nickname=inputEle.value,
	// 		temp=nickname.replace(/[\u4E00-\u9FA5]/g,""),
	// 		length;
	// 	//是否有特殊字符
	// 	if(/[^A-Za-z0-9]/.test(temp)){
	// 		showError(errEle,'昵称不能含有特殊字符',icon);
	// 		return;
	// 	}
	// 	//长度是否符合规则
	// 	length=Core.String.byteLength(nickname);
	// 	if(length>20){
	// 		showError(errEle,'昵称不能多于10个汉字或20个字符',icon);
	// 		return;
	// 	}
	// 	if(length<4){
	// 		showError(errEle,'昵称不能少于2个汉字或4个字符',icon);
	// 		return;
	// 	}
	// 	hiddenError(errEle,icon);
	// } 
	
	function styleThey(eleArr,str) {
		for(var i=0; eleArr[i]; i++) {
			eleArr[i].style.display = str;
		}
	}
	
	function checkBlogName(inputEle,errEle,icon){
		//此处去掉超时处理
		// if(typeof ttm != 'undefined') {
		// 	clearTimeout(ttm);
		// }
		// ttm = setTimeout(function(){
			var val = inputEle.value;
			if(/^(?:\s|[　])+|(?:\s|[　])+$/.test(val)){		//非字符键也响应赋值，光标会变。
				inputEle.value = Core.String.trim(val);	//trim
				val = inputEle.value;
			}
			if(val){
				var nameLen = Core.String.byteLength(val);
				if(nameLen > 24){
					showError(errEle,'博客名称超长',icon);
				}else{
					hiddenError(errEle,icon);
					//activePass = true;
				}
			}else{				
				//inputEle.value = getShotName();
				//hiddenError(errEle,icon);
				showError(errEle,'博客名称不能为空',icon);
				//activePass = true;
			}
		// }, 500);
	}
	
	function showError(ele,str,icon) {
		ele.innerHTML = str;
		ele.style.display = 'block';
		if(ele.id.indexOf("ErrTips")>=0){
			ele.style.visibility="visible";
		}
		if(icon){
			icon.className="SG_icon SG_icon48 tips";
		}
	}
	
	function hiddenError(ele,icon) {
		ele.innerHTML = '';
		ele.style.display = 'none';
		if(icon){
			icon.className="SG_icon SG_icon49 tips";
		}
	}
	
	//var open = new openBlog();
	//open.showDialog();
	scope.blogOpener = new openBlog();
	
	//document.body.onclick = function() {
	//	open.showDialog();
	//}
//});
	scope.addBlogOpenerEvent = function(el){
		Core.Events.addEvent(el,function(e){
			scope.blogOpener.showDialog(function(res, blogInfo){
				//清除flash cookie存储的unread缓存
				//Lib.LocalDB前边已经加载
				Lib.LocalDB.clearCache(1,"uid_"+$UID+"unread");
                Lib.util.LS.removeItem("uid"+$UID);
			    if (scope.$pageid == 'fakeIndex') {
					// window.location.href='http://blog.sina.com.cn/u/'+$UID;
					window.location.href = "http://i.blog.sina.com.cn/blogprofile/index.php?atten=1";
					return;
			    }
				
				//开通成功 移除问卷调查连接
				/*---2011-04-06/wangqiang/7314|下线
				if($E("loginBarActivity") && $E("_questionnaire")){
					$E("loginBarActivity").removeChild($E("_questionnaire"));
				}
				*/
                //TODO 新托盘上线后去掉
                if ($E('openedBlogTray')) {
                    $E('openedBlogTray').style.display = '';
                    $E('noOpenedBlogTray').style.display = 'none';
                    $E('outOfOpenBlogTray').style.display = 'none';
                    
                    if(blogInfo){ //显示昵称
                        $E("loginBarAppMenuLabel").innerHTML = blogInfo.loginNick
                    }
                } else {
                    var wnd = window;
                    wnd.$tray && wnd.$tray.renderLogin();
                }
			    
				//浮层中开通成功 弹出对话框提示开通成功
                var successOpenFun = function(){
                    if (scope.___importV) {
                        scope.___importV();
                        scope.___openBlogFlag = 1;
                    }
                };
				var alertConf = {
					subText : !scope.___importV ? ['<div class="CP_w_cnt SG_txtb">欢迎您在新浪博客安家！除了写博客，看博客外，您还可以进入个人中心完善您的个人资料，更有很多有趣的应用等着您哦。</div>'
						, '<ul class="CP_w_part CP_w_aLine">'
							, '<li><a href="http://control.blog.sina.com.cn/blogprofile/index.php" onclick="winDialog.getDialog(\'unregister\').hidden();" target="_blank">到博客个人中心&gt;&gt;</a></li>'
						, '</ul>'].join("") : "",
					icon:	"03",
                    funcOk : successOpenFun,
                    funcClose : successOpenFun,
					width:	300
				};
				winDialog.alert("开通博客成功", alertConf, "unregister");
				/*删除发表评论框的开通链接，并替换为昵称*/
				var commentNickEl = $E("commentNick");
				if(commentNickEl){
					var child = commentNickEl.firstChild;
					while(child){
						commentNickEl.removeChild(child);
						child = commentNickEl.firstChild;
					};
					commentNickEl.innerHTML = blogInfo.loginNick+":";
				}
			}, true);
		},'click');
	}

})();
