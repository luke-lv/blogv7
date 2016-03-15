/** 
 * @fileoverview 长微博工具 写文章
 * @author Book | liming9@staff.sina.com.cn
 * @version 1 | 2012-03-22
 */
$import("lib/jobs.js");
$import("lib/dialogConfig.js");
$import("lib/interface.js");
$import("lib/showError.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/function/bind3.js");
$import("sina/core/string/trim.js");
$import("sina/core/string/j2o.js");
$import("sina/utils/io/ajax.js");
$import("other/ijax_blank.js");
$import("jobs/weibo/CWB.js");

$registJob("writeBlog", function(){
    var TIPS_TITLE = "标题",
        TIPS_URLERR = "您粘贴的链接地址不对",
        TIPS_DATAERR = "返回数据不对",
        TIPS_NETERR = "网络繁忙，请稍后再试",
        TIPS_NOCONTENT = "博文内容不能为空",
        TIPS_PRIVATE = "您已设置了私密博客，该条长微博将在微博上公开。是否继续发表长微博？",
        //TIPS_IMGMORETHAN50 = "图片数超过20张，不能生成长微博",
        
        API_GETART = "http://control.blog.sina.com.cn/riaapi/article/getArticle.php",
        API_PREVIEW = "http://control.blog.sina.com.cn/admin/article/changWeiBoPreview.php",
    
        URLREG = /^http:\/\/(?:blog.sina.com.cn|qing.blog.sina.com.cn)\S+$/;
        
    var __addEvent = Core.Events.addEvent,
        __trim = Core.String.trim,
        
        el_articleTitle = $E("articleTitle"),
        //el_previewCwb = $E("previewCwb"),
        el_pubToWeibo = $E("pubToWeibo"),
        el_editorForm = $E("editorForm"),
        
        db_blogid,
        db_content = "";
        
    //标题输入框
    __addEvent(el_articleTitle, function(){
        var val = __trim( el_articleTitle.value );
        if( val===TIPS_TITLE ){
            el_articleTitle.value = "";
        }
    }, "focus");
    __addEvent(el_articleTitle, function(){
        var val = __trim( el_articleTitle.value );
        if( val==="" ){
            el_articleTitle.value = TIPS_TITLE;
        }
    }, "blur");
    
    __addEvent($E("previewCwb"), function(){
        var data = getPreviewData();
        if( !data ){ return; }
        
        Utils.Io.Ijax_blank.request(API_PREVIEW, {
            POST: data
        });
        return false;
    });
    
    function getPreviewData(){
        var contentBody = window.editor.iframeDocument.body;
//        if( checkImgCount(contentBody) ){
//            return null;
//        }
        if( __trim(contentBody.innerHTML).replace(/^<br>/,"")==="" ){
            winDialog.alert(TIPS_NOCONTENT, {icon: "01"});
            return null;
        }
        
        editor.setSourceValue();
        var title = __trim( el_articleTitle.value );
        return {
            blog_title: title===TIPS_TITLE?"":title,
            blog_body: $E("SinaEditorTextarea").value
        };
    }
    
    //检查图片数，图片数大于50不让发布。。。产品后来说不要图片张数限制了
    //图片数大于50返回true
//    function checkImgCount(elem){
//        if( elem.getElementsByTagName("img").length>20 ){
//            winDialog.alert(TIPS_IMGMORETHAN50, {icon: "01"});
//            return true;
//        }
//        return false;
//    }
    
    //发表博文的之前验证数据，验证通过返回false，否则返回true
    function validData(){
       var contentBody = window.editor.iframeDocument.body;
//        if( checkImgCount(contentBody) ){
//            return true;
//        }
        db_content = __trim(contentBody.innerText||contentBody.textContent||"");
        if( __trim(contentBody.innerHTML).replace(/^<br>/,"")==="" ){
            winDialog.alert(TIPS_NOCONTENT, {icon: "01"});
            return true;
        }
        if( __trim(el_articleTitle.value)===TIPS_TITLE ){
            el_articleTitle.value = "";
        }
        return false;
    }
    
    function getFrameValue(FrameNode){
        return Core.String.j2o(Core.String.trim(FrameNode.contentWindow.document.body.innerHTML));
    }
    function tagFunc(FrameNode, oFunc){
        try {
            var frmJosn = getFrameValue(FrameNode);
            if (frmJosn == null){
                frmJosn = {
                    code: "A00001",
                    data: []
                };
            }
            if (frmJosn.code != null) {
                if (oFunc) {
                    oFunc(frmJosn);
                } else {
                    showError(frmJosn.code, {
                        close: false
                    });
                }
            }
        } catch (e) {
            window.editor.editSaveing = false;
            //el_pubToWeibo.busy = false;
        }
    }
    //判断文章内是否有图片或视频
    function checkMedia(){
        var checkValue = editor.getMediaTag();
        
        $E("is_album").value = checkValue[0];
        if ($E("is_media").value != "1") {
            $E("is_media").value = checkValue[1];
        }
    }
    
    var bindFrameEvt = true;
    window.editor_Timer = 0;
    // 文章新发,新发文章
    window.articlePostBtnFunc = function(){
        //避免重复保存
        if(window.editor.articleSaveing){
            return;
        }
        if(validData()){return} //验证数据是否为空
        window.editor.articleSaveing = true;
        
        //$E("articlePostBtn").disabled = true;
        //createIFM("fileFrame");
        editor.setSourceValue();
        checkMedia();
        var hiddenTip;
        if (arguments[0] && arguments[0].hiddenTip) {
            hiddenTip = arguments[0].hiddenTip;
        }else{
            hiddenTip=function(){};
        }
        
        var callback;
        if (arguments[0] && arguments[0].callback) {
            callback = arguments[0].callback;
        } else {
            callback = function(frmJson){
                var isPrivateBlog = false;
                var isPrivateArticle = false;
                
                editor.userData.clear("blog_user_data_"+scope.$uid,["content"]);
                db_blogid = frmJson.data;
                $E("blog_id").value = db_blogid;
                CWB.checkPic({
                    tips: "已发表一篇博文，",
                    blogid: db_blogid,
                    title: el_articleTitle.value,
                    content: db_content
                });
//                var sucdlg = winDialog.alert("博文已发布成功<br/>正在生成长微博图片…", {
//                    funcOk: function(){
//                        alert(8);
//                        setTimeout(function(){
//                          window.onbeforeunload=function(){};
//                          window.location.href = "http://blog.sina.com.cn/s/blog_" + frmJson.data + ".html";
//                        },1);
//                    },
//                    funcClose: function(){alert(9)},
//                    textOk: "确定",
//                    title: "提示",
//                    icon: "03" // 可选值："01"、"02"、"03"、"04"、"05"
//                }, "sendArticleSucsessDialog");
//                var closeEle = winDialog.getDialog("sendArticleSucsessDialog").getNodes()["btnClose"];
//                Core.Events.addEvent(closeEle, function(){
//                    setTimeout(function(){
//                        window.onbeforeunload=function(){};
//                        window.location.href = window.location.href ="http://blog.sina.com.cn/s/blog_" + frmJson.data + ".html";
//                    },1);
//                }, 'click');
            };
        }
        
        //已经发表了，则提交到编辑接口；已存过草稿再发表时将草稿删除
        if( db_blogid || articleEditorCFG.articleStatus=="3") {
            //trace("草稿->发表");
            el_editorForm.action = articleEditorCFG.articleEditPostURL;
        } else {
            //trace("新发");
            el_editorForm.action = articleEditorCFG.articlePostURL;
        }
        //"http://control.blog.sina.com.cn/admin/article/article_post.php"; //articleEditorCFG.articlePostURL
        
        if(!scope.$user_channel) {
            if ((new Date().valueOf() - editor_Timer) < 1000 * 60) {
                showError("B08001");
                //$E("articlePostBtn").disabled = false;
                window.editor.articleSaveing= false;
                hiddenTip();
                return false;
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
            //trace("新发文章,返回状态码: " + frmJson.code);
            //trace("新发文章,返回内容: " + frmJson.data);
            window.editor.articleSaveing= false;
            //$E("articlePostBtn").disabled = false;
            hiddenTip();
            switch (frmJson.code) {
				case "B00111": // 先审核再发布
				case "B00110": // 禁止发布博文
					var sucdlg = winDialog.alert("新浪博客正在维护中。对由此给您造成的不便，深表歉意。", {
						funcOk: function(){

						}.bind2(this),
						textOk: "确定",
						title: "提示",
						width: 430,
						icon: "01" // 可选值："01"、"02"、"03"、"04"、"05"
					}, "sendKillDialog");
					window.onbeforeunload=function(){};
					break;
                case "B06001":// 新发成功
                    editor_Timer = new Date().valueOf();
                    //SaveEditorRev();
                   editor.userData.clear("blog_user_data",["content","uid"])
                    succ_code = "B06001";
                    //trace("succ_code=" + succ_code);
                    callback(frmJson);
                    break;
                case "B00312": //图片超过50张
                    winDialog.alert(TIPS_IMGMORETHAN50, {icon: "01"});
                    break;
                case "B66666":      //故障
                        var sucdlg = winDialog.alert("服务器临时遇见问题，发博文功能暂时不可用。工程师正在恢复中，请稍后再试。", {
                            funcOk: function(){},
                            textOk: "确定",
                            title: "提示",
                            icon: "03" // 可选值："01"、"02"、"03"、"04"、"05"
                        }, "sendArticleProblemDialog");
                        break;
                case "B07006":      //审查中
                        var sucdlg = winDialog.alert("由于您已发布的博文正在审查中，您暂时不能发文", {
                            funcOk: function(){},
                            textOk: "确定",
                            title: "提示",
                            icon: "03" // 可选值："01"、"02"、"03"、"04"、"05"
                        }, "sendArticleSucsessDialog");
                        break;
                case "B02005": //非法推广的处理 xy 2009-07-17
                    var sucdlg = winDialog.confirm($SYSMSG["B02005"], {
                        funcOk: function(){
                            var inp = $C('input');
                            inp.id = "feifa";
                            inp.name = "check";
                            inp.value = "no";
                            inp.type = "hidden";
                            el_editorForm.appendChild(inp);
                            articlePostBtnFunc();
                        },
                        funcCancel: function(){
                            var inp = $E('feifa');
                            if (inp) {
                                el_editorForm.removeChild(inp);
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
                //可能有xss攻击需要验证码 擦，不管了
                case 'B06013':
                    needSafeCode(frmJson);
                    break;
                //验证码错误
                case 'B06014':
                    safeCodeErr(frmJson);
                    break;
//                case 'B06015':     //dove（多芬）广告投递
//                    sendContextToDove(frmJson);
//                    break;
//                case "B06012":      //博客五周年活动
//                    sendContextToBlog5Year(frmJson);
//                    break;
                case "B07001":// 新发失败
                  winDialog.confirm($SYSMSG["B07001"], {
                        ico: "03",
                        btn: [{
                            label: "是",
                            focus: true,
                            func: function(){
                                articlePostBtnFunc();
                                el_editorForm.submit();
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
                    window.editorTabs.showTab("vote");
                    break;
                default:
                    showError(frmJson.code);
                    break;
            }
        }]), "load");
        bindFrameEvt = false;
        //el_editorForm.target = "fileFrame";
        el_editorForm.submit();
    };
    //__addEvent(el_pubToWeibo, articlePostBtnFunc);
    __addEvent(el_pubToWeibo, function(){
        if(scope && scope.$isopen === false){
            Utils.Io.JsLoad.request("http://control.blog.sina.com.cn/admin/article/changWeiBoOpenBlog.php", {//此处调用同步昵称接口
                GET: {
                },
                onComplete : function (result) {
                    if(result && result.code === "A00006"){
                        articlePostBtnFunc();
                    }else{
                        winDialog.confirm(TIPS_NETERR, {
                            icon: '04',
                            funcOk: function(){},
                            textOk:'确定',
                            textCancel: '取消'
                        })
                    }   
                }
            });
        }else if(scope.$private&&scope.$private.isprivate==1 ){
            winDialog.confirm(TIPS_PRIVATE, {
                icon: '04',
                funcOk: articlePostBtnFunc,
                textOk: '发布',
                textCancel: '取消'
            })
        }else{
            articlePostBtnFunc();
        }
    });
    
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
    
    function needSafeCode(frmJson){
        var safeimgsrc = "http://interface.blog.sina.com.cn/riaapi/checkwd_image.php";
        var tpl = ['<table id="#{entity}" class="CP_w">', '<thead id="#{titleBar}">', '<tr>', '<th class="tLeft"><span></span></th>', '<th class="tMid">', '<div class="bLyTop">', '<strong id="#{titleName}"></strong>', '<cite><a title="关闭" class="CP_w_shut"  id="#{btnClose}" href="javascript:;">关闭</a></cite>', '</div>', '</th>', '<th class="tRight"><span></span></th>', '</tr>', '</thead>', '<tfoot>', '<tr>', '<td class="tLeft"><span></span></td>', '<td class="tMid"><span></span></td>', '<td class="tRight"><span></span></td>', '</tr>', '</tfoot>', '<tbody>', '<tr>', '<td class="tLeft"><span></span></td>', '<td class="tMid">', '<div class="" style="width:auto;" id="#{content}">', '</div>', '</td>', '<td class="tRight"><span></span></td>', '</tr>', '</tbody>', '</table>'].join("");
        var content = '<div class="CP_layercon2">' +
                        '<div class="CP_prompt">' +
                        '<img class="SG_icon SG_icon201" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="50" height="50" align="absmiddle" />' +
                        '<table class="CP_w_ttl CP_m"><tr>' +
                          '<td >请输入验证码......</td>' +
                        '</tr></table>' +
                        '<ul class="CP_w_part SG_txtb">' +
                            '<li class="mb">填写验证码后可继续操作</li>' +
                            '<li><span class="a">验证码：</span><span class="b"><input name="checkword" id="xssSafeCodeDiag_checkword" type="text" class="SG_input" style="width:75px;" />  <a href="javascript:scope.xssSafeCodeDiag.changeSafeCode();void(0);"><img id="xssSafeCodeDiag_safeimg"  src="http://simg.sinajs.cn/blog7style/images/common/yzm1.gif" width="58" height="20" align="absmiddle" /></a> <a href="javascript:scope.xssSafeCodeDiag.changeSafeCode();void(0);">换一个</a></span></li>' +
                        '</ul>' +
                        '<p class="CP_w_btns_Mid"><a class="SG_aBtn SG_aBtnB" id="xssSafeCodeDiag_okbtn" href="javascript:scope.xssSafeCodeDiag.ok();void(0);"><cite> 确定 </cite></a>&nbsp;&nbsp;<a class="SG_aBtn SG_aBtnB" id="xssSafeCodeDiag_cancelbtn"  href="javascript:scope.xssSafeCodeDiag.cancel();void(0);"><cite> 取消 </cite></a></p>' +
                        '</div>' +
                    '</div>';
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
                if( typeof el_editorForm.checkword == 'undefined' ||  el_editorForm.checkword == null)
                {
                    var input = $IE? document.createElement('<input value="'+v+'" type="hidden" name="checkword" />') :document.createElement('input');
                    el_editorForm.appendChild(input);
                    input.name ='checkword';
                    input.type = "hidden";  
                    input.value = v; 
                }
                el_editorForm.submit();
                scope.xssSafeCodeDiag.hidden();
                el_editorForm.removeChild(el_editorForm.checkword);
                el_editorForm.checkword=null;
            }
            scope.xssSafeCodeDiag.cancel= function(){
                scope.xssSafeCodeDiag.hidden()
            };
            
             __addEvent($E('xssSafeCodeDiag_checkword'),function(){
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
                    };
                    __addEvent($E('xssSafeCodeDiag_checkword'),scope.xssSafeCodeDiag.keydownFn,'keydown');
                }                   
             },'focus');
             __addEvent($E('xssSafeCodeDiag_checkword'),function(){
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
