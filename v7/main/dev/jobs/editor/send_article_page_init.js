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
    //xiaoyue3 @modified  淘博会下线 20140115
    
    // // 注册加载商品消息
    // Lib.Listener.add("editor-ware-before-load");
    // Lib.Listener.add("editor-ware-loaded");
    // // 监听商品加载消息
    // Lib.Listener.on({
    //     name : "editor-ware-before-load",
    //     callBack : function(){
    //         $E("articlePostBtn").disabled = true;
    //         $E("articlePosTempBtn").disabled = true;
    //         $E("articleTagAutoSub").disabled = true;
    //         $E("articleSaveBtn").disabled = true;
    //     }
    // }, {
    //     name : "editor-ware-loaded",
    //     callBack : function(){
    //         $E("articlePostBtn").disabled = false;
    //         $E("articlePosTempBtn").disabled = false;
    //         $E("articleTagAutoSub").disabled = false;
    //         $E("articleSaveBtn").disabled = false;
    //     }
    // });
    // // 获取淘博会发商品信息
    // var getTBHWareInfo = function(){
    //     var w = window.articleReleaseWares;
    //     return w && w.getInfo ? w.getInfo():null;
    // };
    // // 设置淘博会商品信息
    // var setTBHWareInfo = function(){
    //     var wareInfo = getTBHWareInfo();
    //     if (wareInfo) {
    //         var clickUrlEl = $E("tbh_click_item_url");
    //         clickUrlEl && (clickUrlEl.value = wareInfo["click_item_url"]);

    //         var titleEl = $E("tbh_title");
    //         titleEl && (titleEl.value = wareInfo["title"]);

    //         var picEl = $E("tbh_pic_url");
    //         picEl && (picEl.value = wareInfo["pic_url"]);

    //         var priceEl = $E("tbh_price");
    //         picEl && (priceEl.value = wareInfo["price"]);

    //         var wareTypeEl = $E("tbh_item_type");
    //         wareTypeEl && (wareTypeEl.value = wareInfo["item_type"]);

    //         var fromEl = $E("tbh_from");
    //         fromEl && (fromEl.value = wareInfo["from"]);
    //     }
    // };

    var _CFG = articleEditorCFG;


	function forbiddenArticleTips(){
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
	function auditArticleTips(){
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
    //积分项目 针对私密博文的处理 add start↓
    var isPAP = 0;//是否有私密博文权限标识
    //是否为私密博文
    function isPrivacyArticle(){
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
                        type: 4,
                        auto: 1
                    },
                    onSuccess: function(data){
                        isPAP = 1;
                        cb();
                    },
                    onError: function(result){
                        if(result && result.code == "A00003"){
                            winDialog.alert(result.data, {subText:'<a href="http://blog.sina.com.cn/huodong/lottery.html?f=1">马上获得1888积分! </a>'});
                        }else{
                            winDialog.alert(result && result.data);
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
    //end↑
    
    window.editor_Timer = 0;
    
    //if ((_CFG && _CFG.articleStatus != 1) || (_CFG && _CFG.worldcupPics)) {
    if (_CFG && (_CFG.articleStatus != 1 || _CFG.worldcupPics)) {
        //编辑草稿时，初始化将草稿内容充textarea中复制到iframe
        editor.areaToFrame();
    }
    var souEle=$E("source");
    if(souEle && souEle.value!=""){
        editor.areaToFrame();
    }
    
    if (_CFG.articleStatus != 1) {
		//插入投票
        if (typeof _CFG.articlevData != "undefined" && _CFG.articlevData != null) {
            editorTabs.addTab({
                name: "vote",
                title: "投票",
                contentId: "addVote",
				callVote :{remove : removeVote,show:showVote}
            });
            window.editorTabs.show();
            window.insertVote = new Vote(_CFG.articlevData);
          //  insertVote.add();
        }
		
        //相关博文
        if (_CFG.articleAssociateHistory && _CFG.articleAssociateHistory.length > 0) {
            editorTabs.addTab({
                name: "article",
                title: "相关博文",
                contentId: "article_associate"
            });
            window.editorTabs.show();
            window.articleAssociate = new Editor.Plugins.ArticleAssociate("article_associate",_CFG.articleStatus);
			editorTabs.addCloseCallbackFunc("article",articleAssociate.del.bind2(articleAssociate));
         	window.articleAssociate.history(_CFG.articleAssociateHistory);
            window.articleAssociate.add();
        }
        

        //推荐活动
        if(_CFG.articleActivity){
			if(!$E("tab_content_activity")){
				Core.Dom.insertHTML($E("article_associate"),"<div class='myActive' id='tab_content_activity'></div>","AfterEnd");
			}
			//var activity=new Activity();
	        editorTabs.addTab({
	            name: "activity",
	            title: "推荐活动",
	            contentId: "tab_content_activity"
	        });
			if(activity.state!="finish"){
				editorTabs.addCloseCallbackFunc("activity",activity.del.bind2(activity));
			}
			
			activity.setConHtml("tab_content_activity");
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

    //xiaoyue3 @modified  淘博会下线 20140115

    // 淘宝会发商品链接
	// var isAddWare = -1 != location.search.indexOf("tbh=1");
    //淘博会商品
    // if (scope.$private.tbh_status && (isAddWare || _CFG.tbhWare)) {
        
    //     editorTabs.addTab({
    //         name: "releaseWares",
    //         title: "发商品",
    //         contentId: "article_releaseWares"
    //     });
    //     window.editorTabs.show();

    //     window.articleReleaseWares = new Editor.Plugins.ReleaseWares("article_releaseWares", _CFG.articleStatus);
        
    //     editorTabs.addCloseCallbackFunc("releaseWares", 
    //         articleReleaseWares.del.bind2(articleReleaseWares));
    //     if (_CFG.tbhWare) {
    //         articleReleaseWares.showOldData(_CFG.tbhWare);
    //     }
    //     // 考虑是否做成一个动画
    //     //setTimeout(function(){
    //     //    location.hash = "addTab";
    //     //},100);
    // }

    if(_CFG.articleStatus==2){
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
                } else {
                    showError(frmJosn.code, {
                        close: false
                    });
                }
            }
        } 
        catch (e) {
            //traceError(e);
            //showError("00001");
            $E("articlePostBtn").disabled = false;
            $E("articlePosTempBtn").disabled = false;
            $E("articleTagAutoSub").disabled = false;
            $E("articleSaveBtn").disabled = false;
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
        var stockValue = editor.checkStock();
        var ele= $E("is_stock");
        ele.value = stockValue;
    }
	//判断文章内是否有投票
	function checkVote(){
        
        if(window.insertVote){
            var vote_data=insertVote.toData();
            if(vote_data){
                if(!insertVote.compare(_CFG.articlevData,vote_data)){
                    insertVote.setBlogVote();
                }
            }else{
                //setBlogVote('no');
                if(insertVote.getBlogVote()=="yes"){
                    insertVote.setBlogVote("noedit");
                }
            }
        }
    }

    // 删掉投稿到排行榜，怕出问题，根据tag默认增加一个排行榜例子
    function checkCateTag(){
        // window.onerror = null;
        var tags = $E('articleTagInput') && $E('articleTagInput').value,
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
    
    //添加自动匹配到的标签
    function addAutoTags(tags){
        tags = (tags||'').split(' ');
        for(var i=0,len=tags.length; i<len; i++){
            scope._tagsMng.addTag(tags[i], {notip:true});
        }
    }

    // // 检测淘博会发商品类型
    // function checkTbh() {
    //     var tbhWare = getTBHWareInfo();
    //     var cb = function(){
    //         location.hash = "#addWrap";
    //         editorTabs.showTab("releaseWares");
    //         cb = null;
    //     };
    //     if (tbhWare && !tbhWare["item_type"]) {
    //         //addTab
    //         winDialog.alert("请选择商品类型！", {
    //             width : 220,
    //             icon: "01",
    //             funcClose : cb,
    //             funcOk : cb
    //         });
    //         return false;
    //     }
    //     return true;
    // }
   
    // 文章Tag自动提取
    $E("articleTagAutoSub").onclick = function(){
        editor.setSourceValue();
        var contentBody = window.editor.iframeDocument.body;
        if( Core.String.byteLength(contentBody.innerText||contentBody.textContent||'')<40 ){
            showError('B03106');
            v7sendLog('48_01_01_B03106', 'editor'); //liming9@2012年10月29日
            return;
        }
        $E("articleTagAutoSub").disabled = true;
        // window.onerror = null;
        var title = ($E('articleTitle') && $E('articleTitle').value) || '';
            body = contentBody.innerHTML || '';
        Utils.Io.Ijax.request('http://interface.blog.sina.com.cn/api/get_blog_classify.php', {
            POST : {
                blog_body: body,                      //必选 文章正文，默认为''
                blog_title: title,  //必选 标题， 默认为''
                utf8: 'utf8',
                top: 5,
                action: 'tag'                                  //必选 1）action=tag: 提取关键词 （自动匹配标签）
                                                             //     2) action=classify：分类关键词 （自动获取分类，new!） 
            },
            onComplete : function(resultText) {
                // console.log(resultText);
                var resObj = Core.String.j2o(resultText);
                // console.log(resObj);
                $E("articleTagAutoSub").disabled = false;
                switch (resObj.code) {
                    case "B00000":
                        break;
                    case "B00006": addAutoTags(resObj.data);
                        break;
                    case "00001":
                        showError($SYSMSG['A00001']);
                        break;
                    case "A00006": addAutoTags(resObj.data);
                        break;
                    default:
                        if(resObj.code.charAt(0) == '0') {
                            showError('B'+resObj.code);
                        } else {
                            showError(resObj.code);
                        }
                        break;
                }
                v7sendLog('48_01_01_'+resObj.code, 'editor'); //liming9@2012年10月29日
            },
            onException: function() {
                // console.log("error");
            }
        });
		return false;
    };


    // 预览博文
    $E("articlePreviewBtn").onclick = $E("articlePreviewBtn2").onclick = function(){
        
        //判断标签是否为空或默认值
        if ($E("articleTagInput").value == _CFG.dftTagValue) 
            $E("articleTagInput").value = "";
        editor.setSourceValue();
        var contentBody = window.editor.iframeDocument.body;
        if( Core.String.trim(contentBody.innerHTML).replace(/^<br>/,"")==="" ){
            winDialog.alert("博文内容不能为空", {icon: "01"});
            return;
        }
        // if (!checkTbh()) {
        //     return;
        // }
        // setTBHWareInfo();
        
        if (window.articleAssociate) {
            // window.articleAssociate.save();
            window.articleAssociate.saveSeleteData();
        }
        if (window.insertMusic) {
             if(!window.insertMusic.save()){
			 	 $E("articleSaveBtn").disabled = false
				return false;
			}
        }
		
        $E("editorForm").target = "_blank";
        $E("editorForm").action = _CFG.articlePreviewURL;
        $E("editorForm").submit();
		return false;
    };
//    if(_CFG.articleStatus == "7") {
//        //trace("编辑定时列表->未保存");
//        var unloadconfirm = 0;
//        Core.Events.addEvent(window, function(event){
//            //winDialog.alert('你本次编辑还未保存，你原来的内容已被保存到草稿箱',{icon:'01'});
//            if (unloadconfirm) {
//                //Core.Events.stopEvent(event);
//                event = event || window.event;
//                event.returnValue = '你本次编辑还未保存，你原来的内容已被保存到草稿箱';
//                //window.confirm('你本次编辑还未保存，你原来的内容已被保存到草稿箱');
//                unloadconfirm = 0;
//            }
//            //alert('sdfjiwjie');
//            //unloadconfirm = 0;
//            //return false;
//        }, 'beforeunload');
//    }
    // 文章编辑,保存文章

	Core.Events.addEvent($E("articleSaveBtn"), tempArticleSave);

	function tempArticleSave(){
        // debugger;//wjw
        //私密博文验证, 属于私密博文且无私密博文服务权限
        //if(isPrivacyArticle() && !isPAP){
        //    privacyArticleCheck(tempArticleSave);
        //    return;
        //}
	 	//避免重复保存
		if(window.editor.editSaveing){
			return;
		}
		//trace("tempArticleSave");
		window.editor.editSaveing= true;
        $E("articleSaveBtn").disabled = true;
        cIFM("fileFrame");
        editor.setSourceValue();
        checkMedia();
		checkStock();
        
        if (window.articleAssociate) {
            window.articleAssociate.save();
        }
        if (window.insertMusic) {
             if(!window.insertMusic.save()){
			 	 window.editor.editSaveing= false;
			 	 $E("articleSaveBtn").disabled = false;
				return;
			}
        }
        // if (!checkTbh()) {
        //     window.editor.editSaveing = false;
        //     $E("articleSaveBtn").disabled = false;
        //     return;
        // }
        // setTBHWareInfo();
		//投票
        checkVote();
		
        $E("editorForm").target = "fileFrame";
        $E("editorForm").action = _CFG.articlePostURL;
        
        //判断标签是否为空或默认值
        if ($E("articleTagInput").value == _CFG.dftTagValue) 
            $E("articleTagInput").value = "";
			
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
			window.editor.editSaveing= false;
            $E("articleSaveBtn").disabled = false;
            switch(frmJson.code) {
				case "B00111": // 先审核再发布
					auditArticleTips();
					break;
				case "B00110": // 禁止发布博文
					forbiddenArticleTips();
					break;
				case "B66666":		//故障
					var sucdlg = winDialog.alert("服务器临时遇见问题，发博文功能暂时不可用。工程师正在恢复中，请稍后再试。", {
						funcOk: function(){

						}.bind2(this),
						textOk: "确定",
						title: "提示",
						icon: "02" // 可选值："01"、"02"、"03"、"04"、"05"
					}, "sendArticleProblemDialog");
					break;
				case "B06001":
					window.editor.editSaveing= true;
		            $E("articleSaveBtn").disabled = true;
					window.onbeforeunload=function(){};
					setTimeout(function(){
						window.editor.editSaveing= false;
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
					window.editorTabs.showTab("vote");
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
		if(window.editor.tempSaveing){
			return;
		}
		//trace("articlePosTempBtnFunc");
		window.editor.tempSaveing= true;
		
        var tempBtn = $E("articlePosTempBtn");
        tempBtn.disabled = true;
        cIFM("fileFrame");
        editor.setSourceValue();
        checkMedia();
		checkStock();
        checkVote();
        checkCateTag();
        if (window.articleAssociate) {
            window.articleAssociate.save();
        }
        if (window.insertMusic) {
            if(!window.insertMusic.save()){
				window.editor.tempSaveing= false;
				tempBtn.disabled = false
				return;
			}
        }
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
        if ($E("articleTagInput").value == _CFG.dftTagValue) 
            $E("articleTagInput").value = "";
			
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
			window.editor.tempSaveing= false;
            $E("articlePosTempBtn").disabled = false;
			hiddenTip();
            switch (frmJson.code) {
                case "B06003":// 草稿成功
                    editor.userData.clear("blog_user_data",["content","uid"]);
                    _CFG.articleStatus = "3";
                    $E("blog_id").value = frmJson.data;
					
					// if(typeof frmJson.voteId != 'undefined') {
					// 	   $E("voteId").value = frmJson.voteId;
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
					window.editorTabs.showTab("vote");
					break;
                default:
                    showError(frmJson.code);
                    break;
            }
        }]), "load");
        $E("editorForm").submit();
    };
	//Core.Events.addEvent($E("articlePosTempBtn"),window.articlePosTempBtnFunc);
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
        // debugger;//wjw
        //私密博文验证, 属于私密博文且无私密博文服务权限
        if(isPrivacyArticle() && !isPAP){
            privacyArticleCheck(articlePostBtnFunc);
            return;
        }
		//避免重复保存
		if(window.editor.articleSaveing){
			return;
		}
		//trace("articlePostBtnFunc");
		window.editor.articleSaveing= true;
		
        $E("articlePostBtn").disabled = true;
        cIFM("fileFrame");
        editor.setSourceValue();
        checkMedia();
		checkStock();
        checkCateTag();
        // if (!checkTbh()) {
        //     window.editor.articleSaveing= false;
        //     $E("articlePostBtn").disabled = false;
        //     return;
        // }
        // setTBHWareInfo();
		var hiddenTip;
		if (arguments[0] && arguments[0].hiddenTip) {
            hiddenTip = arguments[0].hiddenTip;
        }else{
			hiddenTip=function(){};
		}
		
		checkVote();
		
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
							title: encodeURIComponent($E('articleTitle').value),
							link: encodeURIComponent("http://blog.sina.com.cn/s/blog_" + frmJson.data + ".html")
						},
						onSuccess: function(){}
					});
					//trace('有msncookie，发送feed, 放弃使用new image方式');
				}else{
					//trace('不发送feed，info:' + [wl_internalState_cid , !isPrivateBlog , !isPrivateArticle]);
				}
				
				editor.userData.clear("blog_user_data_"+scope.$uid,["content"]);
				
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
						if($E("articleTagInput") && $E("articleTagInput").value.indexOf("365")>=0 && !Utils.Cookie.getCookie("blog365tpltips")){//如果是带365标签的博文，提示使用365模版
							Utils.Cookie.setCookie("blog365tpltips", "true", 1*24*365);
							blog365FuncOk();
						}else{
							nomarlFuncOk();
						}
				    },
                    textOk: "确定",
                    title: "提示",
                    subText: '<a href="http://control.blog.sina.com.cn/admin/article/changWeiBo.php?url='+
                        encodeURIComponent("http://blog.sina.com.cn/s/blog_" + frmJson.data + ".html")
                        +'" target="_blank">去发一篇长微博</a>',
                    icon: "03" // 可选值："01"、"02"、"03"、"04"、"05"
                }, "sendArticleSucsessDialog");
                var closeEle = winDialog.getDialog("sendArticleSucsessDialog").getNodes()["btnClose"];
                Core.Events.addEvent(closeEle, function(){
					setTimeout(function(){
						window.onbeforeunload=function(){};
                   		window.location.href = window.location.href ="http://blog.sina.com.cn/s/blog_" + frmJson.data + ".html";
           		    },1);
			    }, 'click');
            }
        }
        
		
        if (window.articleAssociate) {
            window.articleAssociate.save();
        }
        if (window.insertMusic) {
             if(!window.insertMusic.save()){
			 	window.editor.articleSaveing= false;
			 	 $E("articlePostBtn").disabled = false
				 hiddenTip();
				return false;
			}
        }

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
	            $E("articleTagAutoSub").disabled = false;
	            $E("articleSaveBtn").disabled = false;
				window.editor.articleSaveing= false;
	            hiddenTip();
	            return false;
	        }
		}
        
        ////trace(typeof $E("fileFrame"));
        //判断标签是否为空或默认值
        if ($E("articleTagInput").value == _CFG.dftTagValue) {
            $E("articleTagInput").value = "";
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
			window.editor.articleSaveing= false;
            $E("articlePostBtn").disabled = false;
			hiddenTip();
            switch (frmJson.code) {
				case "B00111": // 先审核再发布
					auditArticleTips();
					break;
				case "B00110": // 禁止发布博文
					forbiddenArticleTips();
					break;
				case "B66666":		//故障
						var sucdlg = winDialog.alert("服务器临时遇见问题，发博文功能暂时不可用。工程师正在恢复中，请稍后再试。", {
		                    textOk: "确定",
		                    title: "提示",
		                    icon: "03" // 可选值："01"、"02"、"03"、"04"、"05"
		                }, "sendArticleProblemDialog");
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
				case "B07006":		//审查中
						var sucdlg = winDialog.alert("您所发表的相似内容过多，请稍后再试~", {
		                    textOk: "确定",
		                    title: "提示",
		                    icon: "03" // 可选值："01"、"02"、"03"、"04"、"05"
		                }, "sendArticleSucsessDialog");		              
						break;
						
                case "B06001":// 新发成功
                    //race("这次发表时间: " + new Date().valueOf());
                    //trace("上次发表时间: " + editor_Timer);
					/*
                    if ((new Date().valueOf() - editor_Timer) < 1000 * 60) {
                        showError("B08001");
                        return;
                    }
                    */
                    editor_Timer = new Date().valueOf();
                    //SaveEditorRev();
                    editor.userData.clear("blog_user_data",["content","uid"]);
                    
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
				case 'B06015':     //dove（多芬）广告投递
				    sendContextToDove(frmJson);
				    break;
				case "B06012":		//博客五周年活动 改成 可乐雪碧活动 modify by gaolei2@  2012-12-21
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
					window.editorTabs.showTab("vote");
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
	Core.Events.addEvent($E("articlePostBtn"),window.articlePostBtnFunc);
	
	/*
    $E("articleTime").onblur = function(){
        var timeBox = $E("articleTime");
        str = timeBox.value;
        ss = str.split(":");
        
        if (isNaN(ss[0]) == true || isNaN(parseInt(ss[0], 10)) || !ss[0]) {
            ss[0] = "00";
        }
        else {
            if (parseInt(ss[0], 10) <= 0) {
                ss[0] = "00";
            }
            if (parseInt(ss[0], 10) > 23) {
                ss[0] = "23";
            }
        }
        if (isNaN(ss[1]) == true || isNaN(parseInt(ss[1], 10)) || !ss[1]) {
            ss[1] = "00";
        }
        else {
            if (parseInt(ss[1], 10) <= 0) {
                ss[1] = "00";
            }
            if (parseInt(ss[1], 10) > 59) {
                ss[1] = "59";
            }
        }
        if (isNaN(ss[2]) == true || isNaN(parseInt(ss[2], 10)) || !ss[2]) {
            ss[2] = "00";
        }
        else {
            if (parseInt(ss[2], 10) <= 0) {
                ss[2] = "00";
            }
            if (parseInt(ss[2], 10) > 59) {
                ss[2] = "59";
            }
        }
		//过滤.
        cur_ss = (ss[0] + ":" + ss[1] + ":" + ss[2]).replace(/\./g,"");
		//cur_ss = ss[0] + ":" + ss[1];
		//发博文或编辑博文页 时间输入框输入正确的数据前包含多个0 不会自动过滤
        timeBox.value = cur_ss.replace(/\d*(\d{2}:)/gi,"$1");
    };
    */
    
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
    //------------------------------------------------
	//把博文投稿到kfc活动
    function sendContextToKfc(frmJson)
	{
		winDialog.alert($SYSMSG["B06011"], {
						icon:"03",
						width: 350,
						funcOk : function(){
							if($E("up2kfcAct").checked){
								Utils.Io.JsLoad.request("http://kfc.sina.com.cn/js/api_to_blog.php?varname=signKFC", {
									GET:{										
										url:"http://blog.sina.com.cn/s/blog_" + frmJson.data + ".html",
										sinaid:scope.$uid,
										title:$E('articleTitle').value==''?Comment.formatTime():$E('articleTitle').value,
										username:scope.nickname							
									},
									onComplete:function(){									
										//var name is signKFC									
										switch(signKFC.data.code){
											case "A00006":		 //一切正常			
											default:
												window.location.href ="http://blog.sina.com.cn/s/blog_" + frmJson.data + ".html";
												break;
										}
									},
									onError:function(){ 
										window.location.href ="http://blog.sina.com.cn/s/blog_" + frmJson.data + ".html";
									}
								});
							}else{								
								window.location.href ="http://blog.sina.com.cn/s/blog_" + frmJson.data + ".html";
							}
						},
						subText:
"看起来，这是一篇跟生活有关的博文。<br/>\
<input id='up2kfcAct' type='checkbox' checked/>是否将此篇博文投稿到<a href='http://kfc.sina.com.cn/' target=\"_blank\">“KFC生活如此多娇”</a>活动？\
<br/>投稿后，将有可能获得1000元携程旅游卡。"
					});
	}
	
	//把博文投递到DOVE的活动接口
	function sendContextToDove(frmJson){
	    winDialog.alert($SYSMSG["B06011"], {
						icon:"03",
						width: 350,
						funcOk : function(){
							if($E("up2doveAct").checked){
								Utils.Io.JsLoad.request("http://dove.sina.com.cn/save_blog_info.php?varname=signDove", {
									GET:{										
										blog_url : encodeURIComponent("http://blog.sina.com.cn/s/blog_" + frmJson.data + ".html"),
										user_id  : scope.$uid,
										title    : encodeURIComponent($E('articleTitle').value==''?Comment.formatTime():$E('articleTitle').value),
										username : encodeURIComponent(scope.nickname)
									},
									onComplete:function(data){	
										//投完不管成功与否跳转到文章页			
										window.location.href ="http://blog.sina.com.cn/s/blog_" + frmJson.data + ".html";
									},
									onError:function(data){ 
										window.location.href ="http://blog.sina.com.cn/s/blog_" + frmJson.data + ".html";
									}
								});
							}else{								
								window.location.href ="http://blog.sina.com.cn/s/blog_" + frmJson.data + ".html";
							}
						},
						subText: "<input id='up2doveAct' type='checkbox' checked/>参加多芬<a href='http://dove.sina.com.cn/' target=\"_blank\">“美丽故事”</a>征文赢大奖。"
					});
	}
        ////把博文投稿博客5周年活动--改成七喜活动的了
		////七喜活动下线了，改成可乐雪碧活动  modify by gaolei2@  2012-12-21
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
	
    $E("cateManageLink").onclick = function(){
        window.CateDialog.show();
		return false;
    };
	
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
