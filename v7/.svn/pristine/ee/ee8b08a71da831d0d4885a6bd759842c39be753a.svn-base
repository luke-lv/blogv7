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
$import("sina/core/string/byteLength.js");
$import("sina/ui/dialog/windowDialog.js");
$import("lib/showError.js");
$import("vote/vote.js");
$import("vote/removeVote.js");
$import("lib/login/ui.js");
$import("sina/utils/io/jsload.js");
$import("sina/utils/io/ijax.js");
$import("comment/formatTime.js");
$import("sina/utils/cookie/setCookie.js");
$import("sina/utils/cookie/getCookie.js");
$import("sina/core/string/leftB.js");
$import("sina/core/string/decodeHTML.js");
$import("lib/interface.js");

$registJob("send_article_page_init", function(){

    var _CFG = articleEditorCFG;
    var _EditorCase = SinaEditor.get(0);
    // var userData = 

    function forbiddenArticleTips(){// 禁止发布博文
        var sucdlg = winDialog.alert("新浪博客正在维护中。对由此给您造成的不便，深表歉意。", {
            funcOk: function(){
            },
            textOk: "确定",
            title: "提示",
            width: 430,
            icon: "01" // 可选值："01"、"02"、"03"、"04"、"05"
        }, "sendKillDialog");
        window.onbeforeunload=function(){};
    }

    function auditArticleTips(){// 先审核再发布
        var sucdlg = winDialog.alert("文明办网文明上网。请您不要发布淫秽色情等违法信息。<br/>您的博文已发布，稍后显示，请耐心等待。", {
            funcOk: function(){
                location.href = "http://blog.sina.com.cn/u/"+scope.$uid;
            },
            textOk: "确定",
            title: "提示",
            width: 430,
            icon: "01" // 可选值："01"、"02"、"03"、"04"、"05"
        }, "sendAuditDialog");
        window.onbeforeunload=function(){};
    }


    function serverErrorArticleTips(){// 服务器故障
        var sucdlg = winDialog.alert("服务器临时遇见问题，发博文功能暂时不可用。工程师正在恢复中，请稍后再试。", {
            funcOk: function(){

            }.bind2(this),
            textOk: "确定",
            title: "提示",
            icon: "02" // 可选值："01"、"02"、"03"、"04"、"05"
        }, "sendArticleProblemDialog");
    }

    //积分项目 针对私密博文的处理 add start↓
    var isPAP = 0;//是否有私密博文权限标识
    
    function isPrivacyArticle(){// 是否为私密博文
        return $E("xRankRadio").checked || $E("componentSelect").value === "0";
    }
    //验证是否有私密博文权限
    function privacyArticleCheck(cb){
        var itf = new Interface("http://control.blog.sina.com.cn/blog_rebuild/riaapi/points/check_vip.php","ajax");
        itf.request({
            POST: {
                type: 4
            },
            onSuccess: function (data){
                isPAP = 1;
                cb();
            },
            onError: function (result){
                //未开通没有权限时
                if(result && result.code == "A00001"){
                    privacyArticleTips(cb);
                }
            },
            onFail: function (){
            }
        }); 
    }
    function privacyArticleTips(cb){
        var interfacePrivacy=new Interface("http://control.blog.sina.com.cn/blog_rebuild/riaapi/points/points_redeem.php","ajax");
        var sucdlg = winDialog.alert("你尚未开通私密博文功能!", {
            funcOk: function(){
                interfacePrivacy.request({
                    POST: {
                        user: scope.$uid || $UID,
                        type: 4
                    },
                    onSuccess: function(data){
                        isPAP = 1;
                        cb();
                    },
                    onError: function(result){
                        if(result && result.code == "A00001"){
                            winDialog.alert(result.data);
                        }
                    },
                    onFail: function(){
                    }
                });
            },
            textOk: "兑换并发表",
            subText: "私密博文一个月(30天)功能仅需30积分"
        }, "privacyArticleDialog");
        window.onbeforeunload=function(){};
    }
    //end
    
    window.editor_Timer = 0;
    
    if (_CFG.articleStatus != 1) {  // 不是新发文章，需要初始化相关博文
        
        // 初始化相关博文
        if (_CFG.articleAssociateHistory && _CFG.articleAssociateHistory.length > 0) {
            if (!window.articleAssociate){
                window.articleAssociate = new SinaEditor.newArticleAssociate("article_associate",_CFG.articleStatus);
            }
            window.articleAssociate.history(_CFG.articleAssociateHistory);
            window.articleAssociate.add();
        }

        var editor = SinaEditor.get(0);
        editor.ready(function(){
            if (window.editorPlaceHolder){
                window.editorPlaceHolder.hide();
            }
            var content = $E('SinaEditorTextarea') && $E('SinaEditorTextarea').value;
            editor.setContent(content, true);
        });
        // 初始化图片编辑 TODO ＝＝＝＝＝
    }
    
    // 发博文后的回调相关函数   start ＝＝＝＝＝
    var getFrameValue = function(FrameNode){// 获取回调iframe中的内容
        //trace(FrameNode.contentWindow.document.body);
        return Core.String.j2o(Core.String.trim(FrameNode.contentWindow.document.body.innerHTML));
    }
    
    var cIFM = function(sFrameName){// 创建iframe
        if ($E(sFrameName)) 
            Core.Dom.removeNode($E(sFrameName));
        Core.Dom.addHTML(document.body, "<iframe name='" + sFrameName + "' id='" + sFrameName + "' style='display: none;'></iframe>");
    }

    function tagFunc(FrameNode, oFunc){// 回调函数
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
                } else {
                    showError(frmJosn.code, {
                        close: false
                    });
                }
            }
        } catch (e) {
            $E("articlePostBtn") && ($E("articlePostBtn").disabled = false);
            $E("articlePosTempBtn") && ($E("articlePosTempBtn").disabled = false);
            $E("articleTagAutoSub") && ($E("articleTagAutoSub").disabled = false);
            // $E("articleSaveBtn") && ($E("articleSaveBtn").disabled = false);
        }
    }
    // 发博文后的回调相关函数  end ＝＝＝＝＝


    // 判断文章内是否有图片或视频 start ＝＝＝＝
    function getMediaTag(){
        var imgs = $E('editor').getElementsByTagName("img");
        var lens = imgs.length;
        var facepath = "http://simg.sinajs.cn/blog/images/face/";
        var d_face="sina.com.cn/myshow/blog/misc/gif/";
        var worldcup = "simg.sinajs.cn/blog7style/images/common/worldcup";
        var sg_trans = "simg.sinajs.cn/blog7style/images/common/sg_trans.gif";      //随图进入 iframe 里面。
        var facepathlen = facepath.length;
        var isIMG = 0;
        var isMedia = 0;
        for(var i = 0; i < lens && isIMG == false; i ++) {
            if((imgs[i].src.indexOf(worldcup)==-1)
            && (imgs[i].src.indexOf(d_face)==-1)
            && (imgs[i].src.substr(0, facepathlen) != facepath)
            && (imgs[i].src != "http://simg.sinajs.cn/blog7style/images/common/editor/insetvideo.gif")
            && (imgs[i].src.indexOf(sg_trans)==-1)) {
                if(!imgs[i].getAttribute("type") && (imgs[i].getAttribute("type") != "face")){                  //iframe 里面的 表情没有 type 属性。所以此处……无效。
                    isIMG = 1;
                }
            }
            if(imgs[i].src == "http://simg.sinajs.cn/blog7style/images/common/editor/insetvideo.gif"){
                isMedia = 1;
            }
        }
        
        var objs = $E('editor').getElementsByTagName("object");
        if(objs.length > 0) isMedia = 1;
        
        var objs = $E('editor').getElementsByTagName("embed");
        if(objs.length > 0) isMedia = 1;
        
        
        return [isIMG, isMedia];  
    }

    function checkMedia(){
        var checkValue = getMediaTag();
        
        $E("is_album").value = checkValue[0];
        if ($E("is_media").value != "1") {
            $E("is_media").value = checkValue[1];
        }
    }
    // 判断文章内是否有图片或视频 end

    // 删掉投稿到排行榜，怕出问题，根据tag默认增加一个排行榜例子
    function checkCateTag(){
        // window.onerror = null;
        var tags = $E('article_tag_input') && $E('article_tag_input').value,
            i=0, len, editorForm, hotTagNum;

        editorForm = $E('editorForm');
        if (!editorForm){
            return;
        }
        tags = tags.split(' ');
        len = tags.length;
        
        var tag, sortitem, defaultFlag = false;
        // console.log(len);

        hotTagNum = articleEditorCFG.articleAllTagList.hotTagNum;

        for (i; i<len; i++){
            tag = tags[i];
            if (hotTagNum[tag] && !defaultFlag){
                sortitem = $C('input');
                sortitem.type = 'hidden';
                sortitem.name = 'sina_sort_id';
                sortitem.value = hotTagNum[tag];
                defaultFlag = true;
                break;
            }
        }
        if (!defaultFlag){
            sortitem = $C('input');
            sortitem.type = 'hidden';
            sortitem.name = 'sina_sort_id';
            sortitem.value = '117';
        }

        editorForm.appendChild(sortitem);
        return;

    }

    function setSourceValue(){
        var editor = SinaEditor.get(0);
        var html = editor.getContent(null,false);
        // 修复没有闭合的标签
        var fixDiv = document.createElement('div');
        fixDiv.innerHTML = html;
        html = fixDiv.innerHTML;
        $E('SinaEditorTextarea').value = html;
        return html;
    }

    // 预览博文 start ＝＝＝＝＝＝
    // $E("articlePreviewBtn").onclick = $E("articlePreviewBtn2").onclick =
    $E("articlePreviewBtn").onclick  = articlePreviewHandler;
    //  预览功能
    function articlePreviewHandler(e){
        v7sendLog('16_01_26');
        //判断标签是否为空或默认值
        if ($E("article_tag_input").value == _CFG.dftTagValue) 
            $E("article_tag_input").value = "";

        // 复制编辑器内容到textarea #SinaEditorTextarea
        var html = setSourceValue();
        var isEmpty = _EditorCase.isEmptyContent();

        if(isEmpty){
            winDialog.alert("博文内容不能为空", {icon: "01"});
            return;
        }
        
        // 保存相关文章数据到 #assoc_article_data
        if (window.articleAssociate) {
            window.articleAssociate.saveSeleteData();
        }

        // $E("articleSaveBtn").disabled = false
        $E("editorForm").target = "_blank";
        $E("editorForm").action = _CFG.articlePreviewURL;
        $E("editorForm").submit();
        return false;
    }
    // 预览博文  end ＝＝＝＝＝

 //    // 文章编辑,保存文章 
    Core.Events.addEvent($E("articleSaveBtn"), tempArticleSave);

    function tempArticleSave(){
        // debugger;//wjw
        v7sendLog('16_01_29');
        //私密博文验证, 属于私密博文且无私密博文服务权限
        if(isPrivacyArticle() && !isPAP){
            privacyArticleCheck(tempArticleSave);
            return;
        }
        //避免重复保存
        if(_EditorCase.editSaveing){
            return;
        }

        var isEmpty = _EditorCase.isEmptyContent();
        if(isEmpty){
            winDialog.alert("博文内容不能为空", {icon: "01"});
            return;
        }
        //trace("tempArticleSave");
        _EditorCase.editSaveing= true;
        // $E("articleSaveBtn").disabled = true;
        cIFM("fileFrame");
        setSourceValue();
        checkMedia();
        checkCateTag();

        if (window.articleAssociate) {
            window.articleAssociate.save();
        }
   //      if (window.insertMusic) {
   //           if(!window.insertMusic.save()){
            //       window.editor.editSaveing= false;
            //       $E("articleSaveBtn").disabled = false;
            //  return;
            // }
   //      }
        
        $E("editorForm").target = "fileFrame";
        $E("editorForm").action = _CFG.articlePostURL;
        
        //判断标签是否为空或默认值
        if ($E("article_tag_input").value == _CFG.dftTagValue) 
            $E("article_tag_input").value = "";
            
        //添加一个参数，用于判断浏览器发送的文章是否被截断。2011-06-13 何知翰
        var contentLen = $E('conlen');
        if(contentLen) {
            contentLen.value = $E('SinaEditorTextarea').value.length;
        }
        
        Core.Events.addEvent($E("fileFrame"), Core.Function.bind3(tagFunc, this, [$E("fileFrame"), function(frmJson){
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
            //trace("编辑文章,返回状态码: " + frmJson.code);
            //trace("编辑文章,返回内容: " + frmJson.data);
            _EditorCase.editSaveing= false;
            // $E("articleSaveBtn").disabled = false;
            switch(frmJson.code) {
                case "B00111": // 先审核再发布
                    auditArticleTips();
                    break;
                case "B00110": // 禁止发布博文
                    forbiddenArticleTips();
                    break;
                case "B66666":      //故障
                    serverErrorArticleTips();
                    break;
                case "B06001":
                    window.editor.editSaveing= true;
                    $E("articleSaveBtn").disabled = true;
                    window.onbeforeunload=function(){};
                    setTimeout(function(){
                        _EditorCase.editSaveing= false;
                        $E("articleSaveBtn").disabled = false;
                        location.href = "http://blog.sina.com.cn/s/blog_" + frmJson.data + ".html";
                    },1000);
                    break;
                case "B02005":
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
                case "A00004":// 请登陆
                    new Lib.Login.Ui().login(tempArticleSave,true);
                    break;
                case "B00905":
                case "B00907":
                case "B00908":
                case "B00909":
                case "B00906":
                    showError(frmJson.code);
                    // window.editorTabs.showTab("vote");
                    break;              
                //可能有xss攻击需要验证码
                case 'B06013':
                    needSafeCode(frmJson);
                    break;                  
                //验证码错误
                case 'B06014':
                    safeCodeErr(frmJson);
                    break;
                default:
                    showError(frmJson.code );
            }
        }]), "load");
        
        $E("editorForm").submit();
    };

    //保存到草稿
    window.articlePosTempBtnFunc = function(){
        //避免重复保存
        v7sendLog('16_01_27');
        if(_EditorCase.tempSaveing){
            return;
        }
        var isEmpty = _EditorCase.isEmptyContent();
        if(isEmpty){
            winDialog.alert("博文内容不能为空", {icon: "01"});
            return;
        }
        //trace("articlePosTempBtnFunc");
        _EditorCase.tempSaveing= true;
        
        var tempBtn = $E("articlePosTempBtn");
        tempBtn.disabled = true;
        cIFM("fileFrame");
        setSourceValue();
        checkMedia();
        checkCateTag();
        if (window.articleAssociate) {
            window.articleAssociate.save();
        }
   //      if (window.insertMusic) {
   //          if(!window.insertMusic.save()){
            //  window.editor.tempSaveing= false;
            //  tempBtn.disabled = false
            //  return;
            // }
   //      }
        $E("editorForm").target = "fileFrame";
        if (_CFG.articleStatus == "3") {
            //trace("草稿->草稿");
            $E("editorForm").action = _CFG.articleEditPostTempURL;
        }
        else if (_CFG.articleStatus == "7") {
            //trace("定时列表->定时列表");
            $E('isTimed').value = 7;
            $E("editorForm").action = _CFG.articleEditPostURL;//.replace('?act=3',''); //编辑定时列表时，保存到定时列表
        }
        else {
            //trace("新发->草稿");
            $E("editorForm").action = _CFG.articlePostTempURL;
        }
        //判断标签是否为空或默认值
        if ($E("article_tag_input").value == _CFG.dftTagValue) 
            $E("article_tag_input").value = "";
            
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
        
        Core.Events.addEvent($E("fileFrame"), Core.Function.bind3(tagFunc, this, [$E("fileFrame"), function(frmJson){
            
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
            
            trace("新发保存草稿,返回状态码:=== " + frmJson.code);
            //trace("新发保存草稿,返回内容: " + frmJson.data);
            _EditorCase.tempSaveing= false;
            $E("articlePosTempBtn").disabled = false;
            hiddenTip();
            switch (frmJson.code) {
                case "B06003":// 草稿成功
                    // editor.userData.clear("blog_user_data",["content","uid"]);
                    _CFG.articleStatus = "3";
                    $E("blog_id").value = frmJson.data;
                    
                    // if(typeof frmJson.voteId != 'undefined') {
                    //     $E("voteId").value = frmJson.voteId;
                    // }
                    callback(frmJson.code);
                    break;
                case "B06006":      //定时发布保存修改成功
                    winDialog.alert('已保存到定时列表', {
                        subText: '将于'+$E('date_pub').value+' '+$E('articleTime').value+'发布',
                        funcOk: function(){
                            window.onbeforeunload=function(){};
                            window.location.href = 'http://control.blog.sina.com.cn/blog_rebuild/blog/controllers/articlelist.php?p=1&status=7&uid='+scope.$uid;
                        },
                        funcClose: function(){
                            window.onbeforeunload=function(){};
                            window.location.href = 'http://control.blog.sina.com.cn/blog_rebuild/blog/controllers/articlelist.php?p=1&status=7&uid='+scope.$uid;
                        },
                        icon: "03"
                    });
                    break;
                case "B06001":      //定时发布保存修改，但时间是过去时间，立即发布了
                    window.onbeforeunload=function(){};
                    window.location.href = 'http://blog.sina.com.cn/s/blog_' + frmJson.data + '.html';
                    break;
                case "B40001":
                    winDialog.alert('定时列表中文章数已达上限，请立即发布', {
                        icon: "01"
                    });
                    break;
                case "B40002":
                    winDialog.alert('此时间已被设置过定时发布，请您修改定时设置后再发布', {
                        icon: "01"
                    });
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
                    // window.editorTabs.showTab("vote");
                    break;
                default:
                    showError(frmJson.code);
                    break;
            }
        }]), "load");
        $E("editorForm").submit();
    };
    Core.Events.addEvent($E("articlePosTempBtn"), function(){
        var st = scope.$server_time, pt = scope.$pub_time;
        if (_CFG.articleStatus == "7"&&st&&pt&&st>pt) {
            var tobj = Core.Date.getTimeObj(pt);
            winDialog.confirm('博文将立即发布', {
                subText: '发布时间：'+tobj.yy+'-'+tobj.MM+'-'+tobj.dd+' '+tobj.hh+':'+tobj.mm+':'+tobj.ss,
                funcOk: function(){
                    articlePosTempBtnFunc();
                },
                icon: '04'
            });
        }else{
            articlePosTempBtnFunc();
        }
    });
    
    // 文章新发,新发文章
    window.articlePostBtnFunc = function(){
        v7sendLog('16_01_28');
        // debugger;//wjw
        //私密博文验证, 属于私密博文且无私密博文服务权限
        //if(isPrivacyArticle() && !isPAP){
        //    privacyArticleCheck(articlePostBtnFunc);
        //    return;
        //}

        var isEmpty = _EditorCase.isEmptyContent();
        if(isEmpty){
            winDialog.alert("博文内容不能为空", {icon: "01"});
            return;
        }

        //避免重复保存
        if(_EditorCase.articleSaveing){
            return;
        }
        //trace("articlePostBtnFunc");
        _EditorCase.articleSaveing= true;
        
        $E("articlePostBtn").disabled = true;
        cIFM("fileFrame");
        setSourceValue();
        checkMedia();
        checkCateTag();
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
                var isPrivateBlog = (scope.$private.isprivate == '1');
                var isPrivateArticle = $E('componentSelect').value === '0';
                var wl_internalState_cid;
                //取msn登录的cookie
                try{
                    var wl_internalState = (new Function('return ' + decodeURIComponent(Utils.Cookie.getCookie('wl_internalState'))))();
                    wl_internalState_cid = wl_internalState.wl_cid;
                    //trace('获取wl_internalState_cid cookies成功');
                }catch(e){
                    //trace('获取wl_internalState_cid cookies失败！');
                }
                if(scope.$private.msnfeed&&parseInt(scope.$private.msnfeed)>=100){
                    wl_internalState_cid=true;
                    //trace("有private数据字段");
                }else{
                    //trace("msn logined");
                }
                //如果取到msn登录的cookie，且不是私密博客，且不是私密博文，则发送feed
                if (wl_internalState_cid && !isPrivateBlog && !isPrivateArticle){
                    new Interface('http://control.blog.sina.com.cn/riaapi/feed/msn_feed.php', 'jsload').request({
                        GET: {
                            uid: scope.$uid,
                            title: encodeURIComponent($E('article_title').value),
                            link: encodeURIComponent("http://blog.sina.com.cn/s/blog_" + frmJson.data + ".html")
                        },
                        onSuccess: function(){}
                    });
                    //trace('有msncookie，发送feed, 放弃使用new image方式');
                }else{
                    //trace('不发送feed，info:' + [wl_internalState_cid , !isPrivateBlog , !isPrivateArticle]);
                }
                
                // editor.userData.clear("blog_user_data_"+scope.$uid,["content"]);
                
                var nomarlFuncOk = function(){
                    setTimeout(function(){
                          window.onbeforeunload=function(){};
                          window.location.href = "http://blog.sina.com.cn/s/blog_" + frmJson.data + ".html";
                    },1);
                };
                
                var blog365FuncOk = function(){
                    winDialog.alert("感谢参加365活动",{
                        funcOk: function(){
                            nomarlFuncOk();
                        },
                        textOk: "确定",
                        title: "提示",
                        subText: '<a href="//control.blog.sina.com.cn/blog_rebuild/blog/controllers/setpage.php?uid='+scope.$uid+'&status=pageset" target="_blank">使用365专属配套博客模板</a>',
                        icon: "03"
                    });
                }
                var sucdlg = winDialog.alert("博文已发布成功", {
                    funcOk: function(){
                        if($E("article_tag_input") && $E("article_tag_input").value.indexOf("365")>=0 && !Utils.Cookie.getCookie("blog365tpltips")){//如果是带365标签的博文，提示使用365模版
                            Utils.Cookie.setCookie("blog365tpltips", "true", 1*24*365);
                            blog365FuncOk();
                        }else{
                            nomarlFuncOk();
                        }
                    },
                    funcClose: function(){
                        nomarlFuncOk();
                    },
                    textOk: "确定",
                    title: "提示",
                    subText: '<a href="http://control.blog.sina.com.cn/admin/article/changWeiBo.php?url='+
                        encodeURIComponent("http://blog.sina.com.cn/s/blog_" + frmJson.data + ".html")
                        +'" target="_blank">去发一篇长微博</a>',
                    icon: "03" // 可选值："01"、"02"、"03"、"04"、"05"
                }, "sendArticleSucsessDialog");
            }
        }
        
        
        if (window.articleAssociate) {
            window.articleAssociate.save();
        }
   //      if (window.insertMusic) {
   //           if(!window.insertMusic.save()){
            //      window.editor.articleSaveing= false;
            //       $E("articlePostBtn").disabled = false
            //   hiddenTip();
            //  return false;
            // }
   //      }

        // setTBHWareInfo();
        $E("editorForm").target = "fileFrame";
        
        //已存过草稿再发表时将草稿删除
        if (_CFG.articleStatus == "3") {
            //trace("草稿->发表");
            $E("editorForm").action = _CFG.articleEditPostURL;
        }
        else if (_CFG.articleStatus == "7") {
            //trace("定时列表->发布");
            $E('isTimed').value = 0;
            $E('immediatepub').value = 1;
            $E("editorForm").action = _CFG.articleEditPostURL; //.replace('?act=3','')
        }
        else {
            //trace("新发");
            $E("editorForm").action = _CFG.articlePostURL;
        }
        
        if(!scope.$user_channel) {
            if ((new Date().valueOf() - editor_Timer) < 1000 * 60) {
                showError("B08001");
                $E("articlePostBtn").disabled = false;
                $E("articlePosTempBtn").disabled = false;
                // $E("articleTagAutoSub").disabled = false;
                // $E("articleSaveBtn").disabled = false;
                _EditorCase.articleSaveing= false;
                hiddenTip();
                return false;
            }
        }
        
        ////trace(typeof $E("fileFrame"));
        //判断标签是否为空或默认值
        if ($E("article_tag_input").value == _CFG.dftTagValue) {
            $E("article_tag_input").value = "";
        }
        
        //添加一个参数，用于判断浏览器发送的文章是否被截断。2011-06-13 何知翰
        var contentLen = $E('conlen');
        if(contentLen) {
            contentLen.value = $E('SinaEditorTextarea').value.length;
        }
        
        Core.Events.addEvent($E("fileFrame"), Core.Function.bind3(tagFunc, this, [$E("fileFrame"), function(frmJson){
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
            _EditorCase.articleSaveing= false;
            $E("articlePostBtn").disabled = false;
            hiddenTip();
            switch (frmJson.code) {
                case "B00111": // 先审核再发布
                    auditArticleTips();
                    break;
                case "B00110": // 禁止发布博文
                    forbiddenArticleTips();
                    break;
                case "B66666":      //故障
                    serverErrorArticleTips();
                    break;
                case "B06006":      //定时发布提交成功
                    winDialog.alert('博文已加入定时发布列表', {
                        subText: '将于'+$E('date_pub').value+' '+$E('articleTime').value+'发布',
                        funcOk: function(){
                            window.onbeforeunload=function(){};
                            window.location.href = 'http://control.blog.sina.com.cn/blog_rebuild/blog/controllers/articlelist.php?p=1&status=7&uid='+scope.$uid;
                        },
                        funcClose: function(){
                            window.onbeforeunload=function(){};
                            window.location.href = 'http://control.blog.sina.com.cn/blog_rebuild/blog/controllers/articlelist.php?p=1&status=7&uid='+scope.$uid;
                        },
                        icon: "03"
                    });
                    break;
                case "B40001":
                    winDialog.alert('定时列表中文章数已达上限，请立即发布', {
                        icon: "01"
                    });
                    break;
                case "B40002":
                    winDialog.alert('此时间已被设置过定时发布，请您修改定时设置后再发布', {
                        icon: "01"
                    });
                    break;
                case "B07006":      //审查中
                    var sucdlg = winDialog.alert("您所发表的相似内容过多，请稍后再试~", {
                        textOk: "确定",
                        title: "提示",
                        icon: "03" // 可选值："01"、"02"、"03"、"04"、"05"
                    }, "sendArticleSucsessDialog");                   
                    break;  
                case "B06001":// 新发成功
                    editor_Timer = new Date().valueOf();                 
                    succ_code = "B06001";
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
                case "B06011":      // KFC 博文  KFC生活如此多娇  A06011 
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
                    // window.editorTabs.showTab("vote");
                    break;
                default:
                    showError(frmJson.code);
                    break;
            }
        }]), "load");
        $E("editorForm").submit();
    };
    Core.Events.addEvent($E("articlePostBtn"), window.articlePostBtnFunc);
    
    //------------------------------------------------  
    function safeCodeErr(frmJson)
    {     
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
        scope.xssSafeCodeDiag.show();
        scope.xssSafeCodeDiag.setMiddle();
        scope.xssSafeCodeDiag.changeSafeCode();
    }
    
});
