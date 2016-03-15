$import("sina/sina.js");
$import("msg/blogSystemMSG.js");
$import("msg/blogEditorMSG.js");
$import("lib/sendLog.js");
$import("sina/core/dom/setStyle.js");
$import("sina/core/dom/getStyle.js");
$import("sina/core/dom/addHTML.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/dom/removeNode.js");
$import("sina/utils/form/sinput.js");
$import("sina/core/function/bind3.js");
$import("sina/core/string/j2o.js");
$import("sina/core/string/trim.js");
$import("sina/ui/dialog/windowDialog.js");
$import("lib/showError.js");
$import("vote/vote.js");
$import("vote/removeVote.js");
$import("lib/login/ui.js");
$import("sina/utils/io/jsload.js");
$import("comment/formatTime.js");


$registJob("quickSave", function(){

    window.editor_Timer = 0;

	   if ((articleEditorCFG && articleEditorCFG.articleStatus != 1) || (articleEditorCFG && articleEditorCFG.worldcupPics)) {
		//编辑草稿时，初始化将草稿内容充textarea中复制到iframe
		editor.areaToFrame();
	   }
	   var souEle=$E("source");
		if(souEle && souEle.value!=""){
			editor.areaToFrame();
		}

    if (articleEditorCFG.articleStatus != 1) {
		  //插入投票
        
        if (typeof articleEditorCFG.articlevData != "undefined" && articleEditorCFG.articlevData != null) {
            editorTabs.addTab({
                name: "vote",
                title: "投票",
                contentId: "addVote",
				callVote :{remove : removeVote,show:showVote}
		
            });
            window.editorTabs.show();
            window.insertVote = new Vote(articleEditorCFG.articlevData);
          //  insertVote.add();
        }
		
        //相关博文
        if (articleEditorCFG.articleAssociateHistory && articleEditorCFG.articleAssociateHistory.length > 0) {
            editorTabs.addTab({
                name: "article",
                title: "相关博文",
                contentId: "article_associate"
            });
            window.editorTabs.show();
            window.articleAssociate = new Editor.Plugins.ArticleAssociate("article_associate",articleEditorCFG.articleStatus);
			editorTabs.addCloseCallbackFunc("article",articleAssociate.del.bind2(articleAssociate));
         	window.articleAssociate.history(articleEditorCFG.articleAssociateHistory);
            window.articleAssociate.add();
        }
        
		//图片操作层初始化
		editor.initTemplateImage();
        
		
		//草稿箱和编辑博文时不缓存本地数据
		editor.initUserData=true;
    }
    else {	
		//从本地恢复数据
		editor.redoData();
    }
	 
    if(articleEditorCFG.articleStatus==2){
		 //显示快速发表
      	editor.getToolElement("pro", "quickpost").style.display = "block";
       	editor.getToolElement("base", "quickpost").style.display = "block";
		editor.saveType="quickpost";
	}else{
		//显示快速保存（草稿箱）
       	editor.getToolElement("pro", "quicksave").style.display = "block";
        editor.getToolElement("base", "quicksave").style.display = "block";
		editor.saveType="quicksave";
	}
       
    var getFrameValue = function(FrameNode){
        //trace(FrameNode.contentWindow.document.body);
        return Core.String.j2o(Core.String.trim(FrameNode.contentWindow.document.body.innerHTML));
    };
    
    var cIFM = function(sFrameName){
        if ($E(sFrameName)) 
            Core.Dom.removeNode($E(sFrameName));
        Core.Dom.addHTML(document.body, "<iframe name='" + sFrameName + "' id='" + sFrameName + "' style='display: none;'></iframe>");
    };
    function tagFunc(FrameNode, oFunc){
        try {
        
            var frmJosn = getFrameValue(FrameNode);
            if (frmJosn == null) 
                frmJosn = {
                    code: "A00001",
                    data: []
                };
            
            if (frmJosn.code != null) {
                if (oFunc) {
                    oFunc(frmJosn);
                }
                else {
                    showError(frmJosn.code, {
                        close: false
                    });
                }
            }
        } 
        catch (e) {
            //traceError(e);
            //showError("00001");
//            $E("articlePostBtn").disabled = false;
//            $E("articlePosTempBtn").disabled = false;
//            $E("articleTagAutoSub").disabled = false;
//            $E("articleSaveBtn").disabled = false;
        }
    };
    //判断文章内是否有图片或视频
    function checkMedia(){
        var checkValue = editor.getMediaTag();
        
        $E("is_album").value = checkValue[0];
        if ($E("is_media").value != "1") {
            $E("is_media").value = checkValue[1];
        }
    };
	//判断文章内是否有股票图片
	 function checkStock(){
//        var stockValue = editor.checkStock();
//        var ele= $E("is_stock");
//        ele.value = stockValue;
    };
    
    var bindFrameEvt = true;
    //保存到草稿
	window.articlePosTempBtnFunc = function(){
		//避免重复保存
		if(window.editor.tempSaveing){
			return;
		}
		//trace("articlePosTempBtnFunc");
		window.editor.tempSaveing= true;
        
        if( Core.String.trim($E("articleTitle").value)==="标题" ){
            $E("articleTitle").value = "";
        }
        //$E("articlePosTempBtn").disabled = true;
        //cIFM("fileFrame");
        editor.setSourceValue();
        checkMedia();
		//checkStock();
        if (window.articleAssociate) {
            window.articleAssociate.save();
        }
        if (window.insertMusic) {
            if(!window.insertMusic.save()){
				 window.editor.tempSaveing= false;
			 	 //$E("articlePosTempBtn").disabled = false
				return;
			}
        }
        $E("editorForm").target = "fileFrame";
        if (articleEditorCFG.articleStatus == "3") {
            //trace("草稿->草稿");
            $E("editorForm").action = articleEditorCFG.articleEditPostTempURL;
        }
        else {
            //trace("新发->草稿");
            $E("editorForm").action = articleEditorCFG.articlePostTempURL;
        }
			
		var hiddenTip;
		if (arguments[0] && arguments[0].hiddenTip) {
            hiddenTip = arguments[0].hiddenTip;
        }else{
			hiddenTip=function(){};
		}
		
        var callback;
        if (arguments[0] && arguments[0].callback) {
            callback = arguments[0].callback;
        }
        else {
            callback = function(){
                showError("B06003");
            }
        }
		
		//添加一个参数，用于判断浏览器发送的文章是否被截断。2011-06-13 何知翰
		var contentLen = $E('conlen');
		if(contentLen) {
			contentLen.value = $E('SinaEditorTextarea').value.length;
		}
		
        bindFrameEvt && Core.Events.addEvent($E("fileFrame"), Core.Function.bind3(tagFunc, this, [$E("fileFrame"), function(frmJson){
			if(typeof frmJson.ycon_length !== undefined) {
				var len = $E('SinaEditorTextarea').value.length;
				new Interface("http://control.blog.sina.com.cn/admin/article/ria_debug.php","jsload").request({
					GET : {
						 'type' : 'js_err_log',
						 'desc' : 'num_'+len+'_ynum_'+frmJson.ycon_length+'_hnum_'+frmJson.hcon_length+'_uid_'+scope.$uid+'_bid_'+frmJson.data
					},
					onSuccess : function () {},
					onError : function () {},
					onFail : function (){}
				});
			}
			
            //trace("新发保存草稿,返回状态码: " + frmJson.code);
            //trace("新发保存草稿,返回内容: " + frmJson.data);
			window.editor.tempSaveing= false;
			hiddenTip();
            switch (frmJson.code) {
                case "B06003":// 草稿成功
                    editor.userData.clear("blog_user_data",["content","uid"]);
                    articleEditorCFG.articleStatus = "3";
                    $E("blog_id").value = frmJson.data;
					
					//if(typeof frmJson.voteId != 'undefined') {
					//	$E("voteId").value = frmJson.voteId;
					//}
					
					//trace("call 1");
					
                    callback(frmJson.code);
                    break;
                case "B07003":// 草稿失败
                    winDialog.confirm($SYSMSG["B07003"], {
                        ico: "03",
                        btn: [{
                            label: "是",
                            focus: true,
                            func: function(){
                                articlePosTempBtnFunc();
                            }
                        }, {
                            label: "否"
                        }]
                    });
                    break;
				case "A00004":// 请登陆
                    new Lib.Login.Ui().login(articlePosTempBtnFunc,true);
                    break;
					
				//可能有xss攻击需要验证码
				case 'B06013':
					needSafeCode(frmJson);
					break;					
				//验证码错误
				case 'B06014':
					safeCodeErr(frmJson);
					break;
					
				case "B00905":
				case "B00907":
				case "B00908":
				case "B00909":
				case "B00906":
					showError(frmJson.code);
					window.editorTabs.showTab("vote");
					break;
				
                default:
                    showError(frmJson.code);
                    break;
            }
        }]), "load");
        bindFrameEvt = false; //由于在这里fireFrame不再反复创建删除，所以只绑一次事件
        $E("editorForm").submit();
    };
	
	
    // 文章新发,新发文章
    
	
	function safeCodeErr(frmJson)
	{
		if(typeof scope.xssSafeCodeDiag =='undefined')
		{
			needSafeCode(frmJson);
			return ;
		}		
		scope.xssSafeCodeDiag.hidden();
		winDialog.alert("验证码错误，请重新输入。",{
			textOk :'确定',
					icon : '01',
					funcOk : function(){
							needSafeCode();
					},
					funcClose: function(){
							needSafeCode();
					}
		});
		
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
	
});
