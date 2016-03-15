/**
 * @fileoverview 九宫格博客发布
 * @author zhihan|zhihan@staff.sina.com.cn
 */

$import("sina/core/string/trim.js");
$import("sina/core/system/getParam.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/function/bind3.js");
$import("sina/ui/dialog/windowDialog.js");
$import("sina/utils/cookie/getCookie.js");

$import("lib/dialogConfig.js");
$import("lib/interface.js");
$import("msg/blogEditorMSG.js");
$import("msg/nineGrid.js");
$import("jobs/nineGrid/postArticleCall.js");

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
        winDialog.alert($SYSMSG["B06012"], {
            icon: "03",
            width: 350,
            funcOk: function(){
                if ($E("up2blog5year").checked) {
                    
					var cInterface = new Interface("http://hi.blog.sina.com.cn/DataInterface.php","ijax");
					
					cInterface.request({
								POST : {
									 project_id: 2343,
									 _need_decode:'true',
									 _request_chars:'utf-8',
		                            auth: "2dc169561fe2568a37c97fb2b8bae4cf",
		                            t_col1: $E('articleTitle').value == '' ? Comment.formatTime() : $E('articleTitle').value, // 博文标题（可选）
		                            t_col2: "http://blog.sina.com.cn/s/blog_" + frmJson.data + ".html", //  博文链接（可选）
		                            t_col3: scope.nickname //  博友昵称（可选）
		                            /**t_col4 :     , // 博客地址（可选）
		                             t_col6 :      ,// 真实姓名（可选）
		                             t_col7 :      ,// 手机号码（可选）
		                             t_col8 :     , // 详细地址（可选）
		                             t_col9 :      // 博文分类（可选：改变生活,影响文学,见证时代,其它）
		                             **/
								},
								onSuccess : function (data) {									
									window.location.href = "http://blog.sina.com.cn/s/blog_" + frmJson.data + ".html";
								},
								onError : function (err) {									
									window.location.href = "http://blog.sina.com.cn/s/blog_" + frmJson.data + ".html";
								},
								onFail : function (){									
									window.location.href = "http://blog.sina.com.cn/s/blog_" + frmJson.data + ".html";
								}
							});				
                }
                else {
                    window.location.href = "http://blog.sina.com.cn/s/blog_" + frmJson.data + ".html";
                }
                
            },
            subText: "亲爱的博友，您好！<br/>\
    您的博文与博客五周年主题相关，是否投稿参与征文？\
    <input id='up2blog5year' type='checkbox' checked/>是"
        });
    }
	
	 // 文章新发,新发文章
	var articlePostBtnFunc = function(isPreview){
		
		if(!scope.submitCheck()) {
			return false;
		}
		
		//测试说 连续点击 会报错
		if(window.isSended){
			return;
		}
		window.isSended=true;
		
		//构造iframe 		
        scope.cIFM("fileFrame");
    	
		var hiddenTip;
		if (arguments[0] && arguments[0].hiddenTip) {
            hiddenTip = arguments[0].hiddenTip;
        }else{
			hiddenTip=function(){};
		}		
		
		//callback
        if (arguments[0] && arguments[0].callback) {
            scope.postArticleCall = arguments[0].callback;
			
        }
               
		//因为 tag匹配 改变原来的地址 这里在赋值一下下
		/*
		if(Core.System.getParam("blog_id")){
			//编辑文章
			$E("editorForm").action = articleEditorCFG.articleEditPostURL;
		}else{
			//发表文章
			$E("editorForm").action = articleEditorCFG.articlePostURL;
		}
		*/
		//新的提交位置
		if(isPreview) {
			$E('editorForm').target = '_self';
			$E('editorForm').action = 'http://control.blog.sina.com.cn/admin/article/daily_preview.php?preview=1&t='+new Date().getTime();
		} else {
			$E("editorForm").target = "fileFrame";
			$E('editorForm').action = 'http://control.blog.sina.com.cn/admin/article/process.php';
		}
		
		//alert($E("editorForm").target);
		//alert($E("editorForm").action)
        
        //判断标签是否为空或默认值
        if ($E("articleTagInput")&&($E("articleTagInput").value == articleEditorCFG.dftTagValue||$E("articleTagInput").value=="")){
            $E("articleTagInput").value = "九宫格日记";
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
		//if ($E("articleTitle")&&Core.String.trim($E("articleTitle").value) =="") {
		//	
        //    $E("articleTitle").value = "";
        //} 
		
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
                    scope.postArticleCall(frmJson);
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
                            articlePostBtnFunc(isPreview);
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
                                articlePostBtnFunc(isPreview);
                                $E("editorForm").submit();
                            }
                        }, {
                            label: "否"
                        }],
                        close: false
                    });
                    break;
				case "A00004":// 请登陆
                    new Lib.Login.Ui().login(function(){articlePostBtnFunc(isPreview);},true);
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
                default:
                    showError(frmJson.code);
                    break;
            }
        }]), "load");
        $E("editorForm").submit();
    };
	
	//绑定发送事件 
	Core.Events.addEvent($E("grid_post"),function(){articlePostBtnFunc(false);},"click");
	Core.Events.addEvent($E("grid_post_preview"),function(){articlePostBtnFunc(true);},"click");
})
