/**
 * @fileoverview 影视博客 编辑器 发博文按钮
 * @author wujian|wujian@staff.sina.com.cn
 * @create 2010-11-19
 */

$import("sina/core/string/trim.js");
$import("sina/core/system/getParam.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/function/bind3.js");
$import("sina/ui/dialog/windowDialog.js");
$import("sina/utils/cookie/getCookie.js");
$import("sina/core/string/leftB.js");
$import("sina/core/string/decodeHTML.js");
$import("lib/dialogConfig.js");
$import("lib/interface.js");
$import("sina/utils/io/ijax.js");
$import("lib/sendLog.js");

$registJob("editor_initSendArticle",function(){
	
	window.editor_Timer = 0;	
	 // 文章编辑,保存文章
	
//把博文投稿到kfc活动
    function sendContextToKfc(frmJson)
	{
								
		window.location.href ="http://blog.sina.com.cn/s/blog_" + frmJson.data + ".html";
					
	}	
	function needSafeCode(frmJson)
	{
		var safeimgsrc = "http://interface.blog.sina.com.cn/riaapi/checkwd_image.php";
		var tpl = ['<table id="#{entity}" class="CP_w">', '<thead id="#{titleBar}">', '<tr>', '<th class="tLeft"><span></span></th>', '<th class="tMid">', '<div class="bLyTop">', '<strong id="#{titleName}"></strong>', '<cite><a title="关闭" class="CP_w_shut"  id="#{btnClose}" href="javascript:;">关闭</a></cite>', '</div>', '</th>', '<th class="tRight"><span></span></th>', '</tr>', '</thead>', '<tfoot>', '<tr>', '<td class="tLeft"><span></span></td>', '<td class="tMid"><span></span></td>', '<td class="tRight"><span></span></td>', '</tr>', '</tfoot>', '<tbody>', '<tr>', '<td class="tLeft"><span></span></td>', '<td class="tMid">', '<div class="" style="width:auto;" id="#{content}">', '</div>', '</td>', '<td class="tRight"><span></span></td>', '</tr>', '</tbody>', '</table>'].join("");
		var content = '<div class="CP_layercon2">\
						<div class="CP_prompt">\
						<img class="SG_icon SG_icon201" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="50" height="50" align="absmiddle" />\
						<table class="CP_w_ttl CP_m"><tr>\
						  <td >请输入验证码......</td>\
						</tr></table>\
						<ul class="CP_w_part SG_txtb">\
							<li class="mb">填写验证码后可继续操作</li>\
			                <li><span class="a">验证码：</span><span class="b"><input name="checkword" id="xssSafeCodeDiag_checkword" type="text" class="SG_input" style="width:75px;" />  <a href="javascript:scope.xssSafeCodeDiag.changeSafeCode();void(0);"><img id="xssSafeCodeDiag_safeimg"  src="http://simg.sinajs.cn/blog7style/images/common/yzm1.gif" width="58" height="20" align="absmiddle" /></a> <a href="javascript:scope.xssSafeCodeDiag.changeSafeCode();void(0);">换一个</a></span></li>\
						</ul>\
						<p class="CP_w_btns_Mid"><a class="SG_aBtn SG_aBtnB" id="xssSafeCodeDiag_okbtn" href="javascript:scope.xssSafeCodeDiag.ok();void(0);"><cite> 确定 </cite></a>&nbsp;&nbsp;<a class="SG_aBtn SG_aBtnB" id="xssSafeCodeDiag_cancelbtn"  href="javascript:scope.xssSafeCodeDiag.cancel();void(0);"><cite> 取消 </cite></a></p>\
						</div>\
					</div>';
		if (typeof scope.xssSafeCodeDiag == 'undefined') {
			scope.xssSafeCodeDiag =  winDialog.createCustomsDialog({
				tpl: tpl,
				title: "提示",
				content: content,
				width: 400,
				height: 210,
				funcDisplayFinished: function(){
				}
			}, "note");
			
			scope.xssSafeCodeDiag.changeSafeCode = function()
			{
				$E('xssSafeCodeDiag_checkword').value = '';
				$E('xssSafeCodeDiag_safeimg').src = safeimgsrc + "?r="+Math.random();
			}
			scope.xssSafeCodeDiag.ok= function()
			{
				var v = $E('xssSafeCodeDiag_checkword').value;
				if(v==='')
				{
					scope.xssSafeCodeDiag.hidden();
					//显示请输入验证码
					winDialog.alert("请输入验证码。",{
						textOk :'确定',
								icon : '01',
								funcOk : function(){
										winDialog.close();										
										needSafeCode();
								}
					});
					
					return;
				}
				if( typeof $E("editorForm").checkword == 'undefined' ||  $E("editorForm").checkword == null)
				{				
					var input = $IE? document.createElement('<input value="'+v+'" type="hidden" name="checkword" />') :document.createElement('input');
					$E("editorForm").appendChild(input);		
					input.name ='checkword';
					input.type = "hidden";	
					input.value = v;							
				}
				$E("editorForm").submit();
				scope.xssSafeCodeDiag.hidden();
				$E("editorForm").removeChild($E("editorForm").checkword);
				$E("editorForm").checkword=null;
			}
			scope.xssSafeCodeDiag.cancel= function()
			{
				scope.xssSafeCodeDiag.hidden()
			}
			
			 Core.Events.addEvent($E('xssSafeCodeDiag_checkword'),function(){
			 	if(typeof scope.xssSafeCodeDiag.keydownFn == 'undefined')
				{
					scope.xssSafeCodeDiag.keydownFn =function(e)
					{
						e = e|| window.event;
						var kc = e.keyCode || e.charCode;
						if(kc =='13')
						{
							scope.xssSafeCodeDiag.ok();
						}
					}
					Core.Events.addEvent($E('xssSafeCodeDiag_checkword'),scope.xssSafeCodeDiag.keydownFn,'keydown');
				}				 	
			 },'focus');
			 Core.Events.addEvent($E('xssSafeCodeDiag_checkword'),function(){
			 	if(typeof scope.xssSafeCodeDiag.keydownFn != 'undefined')
				{
					Core.Events.removeEvent($E('xssSafeCodeDiag_checkword'),scope.xssSafeCodeDiag.keydownFn,'keydown');
					scope.xssSafeCodeDiag.keydownFn = null;
				}			 	
			 },'blur');
			
		}
		
		scope.xssSafeCodeDiag.show();
		scope.xssSafeCodeDiag.setMiddle();
		scope.xssSafeCodeDiag.changeSafeCode();
	}
		//私密博文那里的 xy 2009.07.28
    if ($E('xRankRadio')) {//兼容，存在那个按钮才进行相应事件绑定
        Core.Events.addEvent($E('componentSelect'), function(){
            if ($E('componentSelect').value == "0") {
                $E('xRankRadio').checked = true;
            }
            else {
                $E('xRankRadio').checked = false;
            }
        }, 'change');
        
        Core.Events.addEvent($E('xRankRadio'), function(){
           if($E('xRankRadio').checked){
		   	 $E('componentSelect').selectedIndex = $E('componentSelect').length - 1;
		   }else{
		   	 $E('componentSelect').selectedIndex = "0";
		   }
			
        }, 'click');
    }
	     ////把博文投稿博客5周年活动
    function sendContextToBlog5Year(frmJson){
		v7sendLog('48_01_26');//浮层曝光次数统计
		var gourl = 'http://blog.sina.com.cn/s/blog_' + frmJson.data + '.html';
		var colaurl = 'http://sina.allyes.com/main/adfclick?db=sina&bid=204720,574361,579621&cid=0,0,0&sid=581984&advid=358&camid=37389&show=ignore&url=http://e.weibo.com/1795839430/app_3089170920?key=from_blog';
		var seeurl = 'http://sina.allyes.com/main/adfclick?db=sina&bid=204720,574363,579623&cid=0,0,0&sid=581986&advid=358&camid=37389&show=ignore&url=http://e.weibo.com/1795839430/app_3089170920?key=from_blog';

		winDialog.confirm($SYSMSG["B06012"], {
            icon: "03",
            width: 300,
			textOk: "知道了",
			textCancel: "去看看",
			defaultButton: 0,
            funcOk: function(){//知道了
				v7sendLog('48_01_41');
				if($E("upColorSprite").checked){
					sendBlogToCola("iknow");
				}else{
					setTimeout(function(){
						location.href = gourl;
					},1000);
				}
            },
			funcClose: function(){
				if($E("upColorSprite").checked){//直接关闭，同点击知道了
					sendBlogToCola("iknow");
				}else{								
					window.location.href = gourl;
				}
            },
			funcCancel: function(){//去看看
				v7sendLog('48_01_42');
				if($E("upColorSprite").checked){
					sendBlogToCola("see");
				}else{
					openColaPage();
				}
			},
            subText: '这是一篇跟快乐有关的博文。<br/>\<input id="upColorSprite" type="checkbox" checked/>投稿到可口可乐圈？\<br/><a style="color:red" href="'+colaurl+'" target="_blank">去活动站看看，惊喜奖品等你来拿</a>'
        });
		
		var sendBlogToCola = function(type){
			var type = type || "iknow";
			var len = 50;
			var iframe = $E("SinaEditor_Iframe").children[0].contentWindow.document;
			var img = iframe.getElementsByTagName("img")[0];
			var imgSrc = img ? img.src : "";
			// console.log(img);
			var abs = Core.String.decodeHTML(iframe.body.innerHTML);
			if(Core.String.byteLength(abs) > len){
				abs = Core.String.leftB(abs, len);
			}
			// console.log(abs);
			Utils.Io.Ijax.request("http://happiness.sinaapp.com/services/blogsync", {
				POST:{										
					'url' : encodeURIComponent("http://blog.sina.com.cn/s/blog_" + frmJson.data + ".html"),
					'uid'  : scope.$uid,
					'title'    : encodeURIComponent($E('articleTitle').value==''?Comment.formatTime():$E('articleTitle').value),
					'nick' : encodeURIComponent(scope.nickname),
					'abstract': abs?encodeURIComponent(abs):"",
					'img': encodeURIComponent(imgSrc)
				},
				onComplete:function(data){	
				},
				onError:function(data){ 
				}
			});
			if (type === "iknow"){//投完不管成功与否跳转到文章页
				setTimeout(function(){
					location.href = gourl;
				},1000);
			}else if (type === "see"){
				openColaPage();
			}
		};
		
		var openColaPage = function(){
			window.open(seeurl);
			setTimeout(function(){
				location.href = gourl;
			},1000);
		}
    }
	
	/**构造filminput值
	 * 
	 *film_id:电影编号
	 *type： 数据类别（1-电视剧 ，2-电影）
	 *film_name: 电影名称
	 *film_poster: 封面地址
	 *film_url: 电影详情页地址
	 *film_record  :电影评分
	 *film_official ：官网地址
	 */
	function getFilmInput(){
		var t={},d=scope.filmData;
		t.film_id=d.id;
		t.type=scope.filmType=="movie"?2:1;
		t.film_name=d.title;
		//t.film_poster="http://cache.mars.sina.com.cn/nd/dataent"+d.picture;
		t.film_poster=d.picture;
		
		t.film_url="http://data.ent.sina.com.cn/"+scope.filmType+"/"+d.id+".html";
		//这里应该是用户的打分  没有咋办？
		var record=document.getElementsByName("filmRecord");
		var val=null;
		for (var i=0,len=record.length; i<len; i++) {
			if(record[i].checked){
				val=record[i].value;
				break;
			}
		};
		t.film_record=val||3;
		t.film_official=d.official||"";
		var str=[];//转换对象为string
		for (var key in t) {
			str.push('"'+key+'":"'+t[key]+'"');	
		};
		str="{"+str.join(",")+"}";
		$E("film").value=str;		
	}
	
	 // 文章新发,新发文章
	window.articlePostBtnFunc = function(){
		//转换textarea中的< >符号
		var textArea=$E("blog_body");
		var v=textArea.value;
		var realValue=Core.String.trim(v);
		if(realValue==""||realValue=="快说两句吧，让更多的博友也分享我看过的电影。"){//上线前 临时改的
			winDialog.alert("请输入内容。");
			return;
			
		}
		v=v.replace(/<br\s*\/?>/g,"{#sina_text_n_tag}");//防止二次发送 bug
		
		v=v.replace(/</g,"&lt;");
		v=v.replace(/>/g,"&gt;");
		
		v=v.replace(/\n/g,"<br/>");
		v=v.replace(/{#sina_text_n_tag}/g,"<br/>");
		v=v.replace(/\s/g,"&nbsp;");
		//
		textArea.id="old_blog_body";
		textArea.name = "old_blog_body";
		//
		var newBlogBody;
        if ($IE) {
			newBlogBody = document.createElement('<textarea id="blog_body" name="blog_body"></textarea>');
        } else {
			newBlogBody =document.createElement("textarea");
			newBlogBody.id="blog_body";
			newBlogBody.name="blog_body";
        }
		newBlogBody.style.display="none";
		textArea.parentNode.insertBefore(newBlogBody, textArea);
		newBlogBody.value =v; 
		//
		//textArea.value=v;
		textArea=null;
		newBlogBody=null;		
		
		
		
		//测试说 连续点击 会报错
		if(window.isSended){
			return;
		}
		window.isSended=true;
		
		//构造filminput值 
		getFilmInput();
		
		//构造iframe 		
        scope.cIFM("fileFrame");
    	
		var hiddenTip;
		if (arguments[0] && arguments[0].hiddenTip) {
            hiddenTip = arguments[0].hiddenTip;
        }else{
			hiddenTip=function(){};
		}		
		
		//callback
        var callback;
        if (arguments[0] && arguments[0].callback) {
            callback = arguments[0].callback;
			
        } else {
            callback = function(frmJson){
				
				var isPrivateBlog = (scope.$private.isprivate == '1');
				var isPrivateArticle = $E('componentSelect').value === '0';
				var wl_internalState_cid;
				//取msn登录的cookie
				try{
					var wl_internalState = (new Function('return ' + decodeURIComponent(Utils.Cookie.getCookie('wl_internalState'))))();
					wl_internalState_cid = wl_internalState.wl_cid;
					trace('获取wl_internalState_cid cookies成功');
				}catch(e){
					trace('获取wl_internalState_cid cookies失败！');
				}
				//如果取到msn登录的cookie，且不是私密博客，且不是私密博文，则发送feed
				if (wl_internalState_cid && !isPrivateBlog && !isPrivateArticle){
					new Interface('http://control.blog.sina.com.cn/riaapi/feed/msn_feed.php', 'jsload').request({
						GET: {
							uid: scope.$uid,
							title: encodeURIComponent($E('articleTitle').value),
							link: encodeURIComponent("http://blog.sina.com.cn/s/blog_" + frmJson.data + ".html")
						},
						onSuccess: function(){}
					});
					trace('有msncookie，发送feed, 放弃使用new image方式');
				}else{
					trace('不发送feed，info:' + [wl_internalState_cid , !isPrivateBlog , !isPrivateArticle]);
				}
				var msg=Core.System.getParam("blog_id")?"博文已修改成功":"博文已发布成功";
                var sucdlg = winDialog.alert(msg, {
                    funcOk: function(){
						setTimeout(function(){
						  window.onbeforeunload=function(){};
                      	  window.location.href = "http://blog.sina.com.cn/s/blog_" + frmJson.data + ".html";
                   		},1);
				    },
                    textOk: "确定",
                    title: "提示",
                    icon: "03" // 可选值："01"、"02"、"03"、"04"、"05"
                }, "sendArticleSucsessDialog");
                var closeEle = winDialog.getDialog("sendArticleSucsessDialog").getNodes()["btnClose"];
                Core.Events.addEvent(closeEle, function(){
					setTimeout(function(){
						window.onbeforeunload=function(){};
                   		window.location.href = window.location.href ="http://blog.sina.com.cn/s/blog_" + frmJson.data + ".html";
           		    },1);
			    }, 'click');
            }//callback 结束
        }
               
       //设置 target
        $E("editorForm").target = "fileFrame";
		//因为 tag匹配 改变原来的地址 这里在赋值一下下
		if(Core.System.getParam("blog_id")){
			//编辑文章
			$E("editorForm").action = articleEditorCFG.articleEditPostURL;
		}else{
			//发表文章
			$E("editorForm").action = articleEditorCFG.articlePostURL;
		}
		
		//alert($E("editorForm").target);
		//alert($E("editorForm").action)
        
        //判断标签是否为空或默认值
        if ($E("articleTagInput")&&($E("articleTagInput").value == articleEditorCFG.dftTagValue||$E("articleTagInput").value=="")){
            $E("articleTagInput").value = "影评 "+checkStrLen(scope.filmName,14)||"";
        }   
		function checkStrLen(str, max){
            //str="test";
            //alert(str)
            var temp = Core.String.expand(str);
            if (temp.length > max) {
                temp = temp.substr(0, max);
            }
            temp = Core.String.collapse(temp);
            return temp;
        }     
		//判断 文章标题是否为空
		if ($E("articleTitle")&&Core.String.trim($E("articleTitle").value) =="") {
			
            $E("articleTitle").value = "影评《"+scope.filmName+"》";
        } 
		
        Core.Events.addEvent($E("fileFrame"), Core.Function.bind3(scope.tagFunc, this, [$E("fileFrame"), function(frmJson){
            trace("新发文章,返回状态码: " + frmJson.code);
            trace("新发文章,返回内容: " + frmJson.data);
			//window.editor.articleSaveing= false;
           // $E("articlePostBtn").disabled = false;
		   window.isSended=false;
			hiddenTip();
            switch (frmJson.code) {
				case "B66666":		//故障
						var sucdlg = winDialog.alert("服务器临时遇见问题，发博文功能暂时不可用。工程师正在恢复中，请稍后再试。", {
		                    funcOk: function(){

							}.bind2(this),
		                    textOk: "确定",
		                    title: "提示",
		                    icon: "03" // 可选值："01"、"02"、"03"、"04"、"05"
		                }, "sendArticleProblemDialog");
						break;
				case "B07006":		//审查中
						var sucdlg = winDialog.alert("您已发的博文正在审查中，请稍后再发文", {
		                    funcOk: function(){
								
							}.bind2(this),
		                    textOk: "确定",
		                    title: "提示",
		                    icon: "03" // 可选值："01"、"02"、"03"、"04"、"05"
		                }, "sendArticleSucsessDialog");		              
						break;
						
                case "B06001":// 新发成功
                    //trace("这次发表时间: " + new Date().valueOf());
                    //trace("上次发表时间: " + editor_Timer);
					/*
                    if ((new Date().valueOf() - editor_Timer) < 1000 * 60) {
                        showError("B08001");
                        return;
                    }
                    */
                    editor_Timer = new Date().valueOf();
                    //SaveEditorRev();
                  // editor.userData.clear("blog_user_data",["content","uid"])
                    
                    succ_code = "B06001";
                    //trace("succ_code=" + succ_code);
                    callback(frmJson);
                    break;
                case "B02005": //非法推广的处理 xy 2009-07-17
                    var sucdlg = winDialog.confirm($SYSMSG["B02005"], {
                        funcOk: function(){
                            var inp = $C('input');
                            inp.id = "feifa";
                            inp.name = "check";
                            inp.value = "no";
                            inp.type = "hidden";
                            $E("editorForm").appendChild(inp);
                            articlePostBtnFunc();
                        },
                        funcCancel: function(){
                            var inp = $E('feifa');
                            if (inp) {
                                $E("editorForm").removeChild(inp);
                            }
                        },
                        textOk: "确定",
                        textCancel: "取消",
                        title: "提示",
                        icon: "02" // 可选值："01"、"02"、"03"、"04"、"05"
                    });
                    break;
                case "B06002":// 新发成功,并且在审核中
                    //trace("这次发表时间: " + new Date().valueOf());
                    //trace("上次发表时间: " + editor_Timer);
                    if ((new Date().valueOf() - editor_Timer) < 1000 * 60) {
                        showError("B08001");
                        return;
                    }
                    editor_Timer = new Date().valueOf();
                    showError(frmJson.code);
                    break;
                case "B06004":// 新发成功,并且在审核中
                    //trace("这次发表时间: " + new Date().valueOf());
                    //trace("上次发表时间: " + editor_Timer);
                    if ((new Date().valueOf() - editor_Timer) < 1000 * 60) {
                        showError("B08001");
                        return;
                    }
                    editor_Timer = new Date().valueOf();
                    showError(frmJson.code);
                    break;
				
				case "B06011":		// KFC 博文  KFC生活如此多娇  A06011 
					sendContextToKfc(frmJson);
					break;
					
				//可能有xss攻击需要验证码
				case 'B06013':
					needSafeCode(frmJson);
					break;					
				//验证码错误
				case 'B06014':
					safeCodeErr(frmJson);
					break;
				case "B06012":		//博客五周年活动
					sendContextToBlog5Year(frmJson);
					break;					
                case "B07001":// 新发失败
                  winDialog.confirm($SYSMSG["B07001"], {
                        ico: "03",
                        btn: [{
                            label: "是",
                            focus: true,
                            func: function(){
                                articlePostBtnFunc();
                                $E("editorForm").submit();
                            }
                        }, {
                            label: "否"
                        }],
                        close: false
                    });
                    break;
				case "A00004":// 请登陆
                    new Lib.Login.Ui().login(articlePostBtnFunc,true);
                    break;
				case "B00905":
				case "B00907":
				case "B00908":
				case "B00909":
				case "B00906":
					//trace("----CODE HERE----"+frmJson.code+"----"+$SYSMSG[frmJson.code]);
					showError(frmJson.code);
					//window.editorTabs.showTab("vote");
					break;
				case "B00010"://没有权限  当前账户未开通博客
					winDialog.alert("无权限。", {
		                    funcOk: function(){
								Lib.checkAuthor();
								window.location.href="http://control.blog.sina.com.cn/myblog/htmlsource/blog_notopen.php?uid="+$UID+"&version=7";
							}.bind2(this),
		                    textOk: "确定",
		                    title: "提示",
		                    icon: "01" // 可选值："01"、"02"、"03"、"04"、"05"
		                });
						break;
//				case "B06010":				//世界杯博文
// 					winDialog.alert($SYSMSG["B06010"], {
// 						icon:"03",
// 						width: 290,
// 						funcOk : function(){
// 							if($E("up2wcAct").checked){
// 								Utils.Io.JsLoad.request("http://control.blog.sina.com.cn/admin/article/article_sign_WorldCup.php?varname=signWc", {
// 									GET:{
// 										blog_id: frmJson.data
// 									},
// 									onComplete:function(res){
// 										//var name is signWc
// 										switch(res.code){
// 											case "B06001":
// 												window.location.href ="http://blog.sina.com.cn/s/blog_" + frmJson.data + ".html";
// 												break;
// 											default:
// 												break;
// 										}
// 									},
// 									onError:function(){  }
// 								});
// 							}else{
// 								window.location.href ="http://blog.sina.com.cn/s/blog_" + frmJson.data + ".html";
// 							}
// 						},
// 						subText:
// "看起来，这是一篇跟世界杯有关的博文。<br/>\
// <input id='up2wcAct' type='checkbox' checked/>是否将此篇博文投稿到世界杯？\
// <br/><a style='color:red' href='http://blog.2010.sina.com.cn/yunying/2010worldcup/' target='_blank'>投稿后，将有可能获得抽奖机会。</a>"
// 					});
// 					break;
                default:
                    showError(frmJson.code);
                    break;
            }
        }]), "load");
        $E("editorForm").submit();
    };
	
	//绑定发送事件 
	Core.Events.addEvent($E("sendBtn1"),articlePostBtnFunc,"click");
	//Core.Events.addEvent($E("sendBtn2"),articlePostBtnFunc,"click");
});