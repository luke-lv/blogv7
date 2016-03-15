/** 
 * @fileoverview 长微博工具 贴链接
 * @author Book | liming9@staff.sina.com.cn
 * @version 1 | 2012-03-22
 */
$import("lib/jobs.js");
$import("lib/dialogConfig.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/getEventTarget.js");
$import("sina/core/events/fireEvent.js");
$import("sina/core/string/trim.js");
$import("sina/core/dom/getXY.js");
$import("sina/utils/io/ajax.js");
$import("other/ijax_blank.js");
$import("other/insertTemplate.js");
$import("other/enterLeave.js");
$import("jobs/weibo/CWB.js");

$registJob("pasteUrl", function(){
    var TIPS_URL = "粘贴新浪博客或Qing的博文地址",
        TIPS_URLERR = "您粘贴的链接地址不对",
        TIPS_DATAERR = "服务器返回数据不对",
        TIPS_NETERR = "网络繁忙，请稍后再试",
        TIPS_NOART = "您还没有发表过博文",
        TIPS_PRIVATE = "您已设置了私密博客，该条长微博将在微博上公开。是否继续发表长微博？",
        //TIPS_IMGMORETHAN50 = "图片数超过20张，不能生成长微博",
        
        API_GETART = "http://control.blog.sina.com.cn/riaapi/article/getArticle.php",
        API_GETLIST = "http://control.blog.sina.com.cn/riaapi/article/getArticleList.php",
        API_PREVIEW = "http://control.blog.sina.com.cn/admin/article/changWeiBoPreview.php",
        API_PUBURL = "http://control.blog.sina.com.cn/admin/article/changWeiBoPic.php",
    
        URLREG = /^http:\/\/(?:blog.sina.com.cn|qing.blog.sina.com.cn)\S+$/;
        
    var __addEvent = Core.Events.addEvent,
        __getXY = Core.Dom.getXY,
        __trim = Core.String.trim,
        
        el_urlInput = $E("urlInput"),
        el_viewArticle = $E("viewArticle"),
        el_pubToWeiboUrl = $E("pubToWeiboUrl"),
        el_viewArtWrap = $E("viewArtWrap"),
        el_chooseArtBtn = $E("chooseArtBtn"),
        _nodes,
        el_listWrap,
        
        db_artData = null,
        db_artList;
        
    //链接输入框
    __addEvent(el_urlInput, function(){
        var val = __trim( el_urlInput.value );
        if( val===TIPS_URL ){
            el_urlInput.value = "";
        }
    }, "focus");
    __addEvent(el_urlInput, function(){
        var val = __trim( el_urlInput.value );
        if( val==="" ){
            el_urlInput.value = TIPS_URL;
        }
    }, "blur");
    
    __addEvent(el_viewArticle, function(){
        var url = getUrl();
        if( el_viewArticle.busy || !url ){ return; }
        el_viewArticle.busy = true;
        el_viewArtWrap.style.display = "none";
        el_viewArtWrap.innerHTML = "";
        el_pubToWeiboUrl.parentNode.style.display = "none";
        db_artData = null;
        
        Utils.Io.Ajax.request(API_GETART, {
            POST: {
                blog_url: url
            },
            returnType: "json",
            onComplete: function(result){
                //trace(result);
                if (result && result.code==="A00006") {
                    db_artData = result.data;
                    el_viewArtWrap.innerHTML = '<h4>'+db_artData.blog_title+'</h4>'+db_artData.blog_body;
                    el_viewArtWrap.style.display = "";
                    el_pubToWeiboUrl.parentNode.style.display = "";
                }else{
                    winDialog.alert( (result.data&&result.data.msg)||TIPS_DATAERR, {icon: "01"});
                    //db_artData = null;
                }
                el_viewArticle.busy = false;
            },
            onException: function(e){
                winDialog.alert(TIPS_NETERR, {icon: "01"});
                el_viewArticle.busy = false;
                //db_artData = null;
            }
        });
        return false;
    });
    
    //预览长微博
    __addEvent($E("previewCwbUrl"), function(){
        if( el_viewArticle.busy ){ return; }
        if( !db_artData ){ return; }
//        if( checkImgCount(el_viewArtWrap) ){
//            return;
//        }
        
        Utils.Io.Ijax_blank.request(API_PREVIEW, {
            POST: db_artData
        });
        return false;
    });
    
    //发布到sina微博
    function pubToWeibo(){
        if( el_viewArticle.busy || el_pubToWeiboUrl.busy ){ return; }
        if( !db_artData ){ return; }
//        if( checkImgCount(el_viewArtWrap) ){
//            return;
//        }
        el_pubToWeiboUrl.busy = true;
        
        Utils.Io.Ajax.request(API_PUBURL, {
            POST: {
                blog_id: db_artData.blog_id,
                blog_type: db_artData.blog_type,
                img_type: db_artData.img_type || "",
                uid: db_artData.uid
            },
            returnType: "json",
            onComplete: function(result){
                //trace(result);
                if (result && result.code==="A00006") {
                    CWB.checkPic({
                        tips: "",
                        blogid: db_artData.blog_id,
                        title: trimHTML(db_artData.blog_title),
                        content: trimHTML(db_artData.blog_body).replace(/[\r\n]/g, " ").replace(/\s\s+/g, " "), //去掉回车符和两个以上空格
                        uid: db_artData.uid,
                        blog_type: db_artData.blog_type
                    });
                }else{
                    winDialog.alert( (result.data&&result.data.msg)||TIPS_DATAERR, {icon: "01"});
                }
                el_pubToWeiboUrl.busy = false;
            },
            onException: function(e){
                winDialog.alert(TIPS_NETERR, {icon: "01"});
                el_pubToWeiboUrl.busy = false;
            }
        });
        return false;
    }
    __addEvent(el_pubToWeiboUrl, function(){
        if( scope.$private&&scope.$private.isprivate==1&&scope.$uid==db_artData.uid ){
            winDialog.confirm(TIPS_PRIVATE, {
                icon: '04',
                funcOk: pubToWeibo,
                textOk: '发布',
                textCancel: '取消'
            })
        }else{
            pubToWeibo();
        }
    });
    
    //验证URL，并且返回正确的URL
    function getUrl(){
        var url = __trim( el_urlInput.value );
        if( URLREG.test(url) ){
            return url;
        }else{
            winDialog.alert(TIPS_URLERR, {icon: "01"});
            return false;
        }
    }
    
    //检查图片数，图片数大于50不让发布
    //图片数大于50返回true
//    function checkImgCount(elem){
//        if( elem.getElementsByTagName("img").length>20 ){
//            winDialog.alert(TIPS_IMGMORETHAN50, {icon: "01"});
//            return true;
//        }
//        return false;
//    }
    
    //trimHTML
    function trimHTML(str){
        var div = document.createElement("div");
        div.innerHTML = str;
        //return __trim( div.innerText || div.textContent || "" ); //只有图片这些的时候就会暴露undefined
        return div.innerText || div.textContent || ""; //只有图片这些的时候就会暴露undefined
    }
    
    //点击“选择我的博文”
    __addEvent(el_chooseArtBtn, function(){
        if( el_chooseArtBtn.busy ){ return; }
        el_chooseArtBtn.busy = true;
        if( !db_artList ){
            getArtList();
            return;
        }
        if( el_listWrap.style.display==="none" ){
            showList();
        }else{
            hideList();
        }
        return false;
    });
    function getArtList(){
        Utils.Io.Ajax.request(API_GETLIST, {
            returnType: "json",
            onComplete: function(result){
                //trace(result);
                if (result && result.code==="A00006") {
                    db_artList = result.data;
                    if(db_artList.length){
                        initListNode();
                        showList();
                    }else{
                        winDialog.alert(TIPS_NOART, {icon: "01"});
                        el_chooseArtBtn.busy = false;
                    }
                }else{
                    winDialog.alert( (result.data&&result.data.msg)||TIPS_DATAERR, {icon: "01"});
                    el_chooseArtBtn.busy = false;
                }
            },
            onException: function(e){
                //trace(e);
                winDialog.alert(TIPS_NETERR, {icon: "01"});
                el_chooseArtBtn.busy = false;
            }
        });
    }
    function initListNode(){
        var h = '<div id="myArtListWrap" style="display:none;position:absolute;overflow:hidden;">'+
            '<div class="artical_selectlist">'+
                '<ul id="#{ul}"></ul>'+
                '<div class="pages"><a id="#{prev}" href="javascript:;">上一页</a><em id="#{line}">|</em>'+
                '<a id="#{next}" href="javascript:;">下一页</a></div>'+
            '</div>'+
        '</div>';
        _nodes = SinaEx.insertTemplate(document.body, h, "beforeend");
        el_listWrap = $E("myArtListWrap"); //_nodes.listWrap;
        el_listWrap.page = 1;
        changePage("prev");
        el_listWrap._height = 296;//el_listWrap.firstChild.offsetHeight; //
        el_listWrap._sw = 714-296;//el_listWrap.firstChild.offsetWidth-el_listWrap._height; //
        var xy = __getXY(el_chooseArtBtn),
            chooseArtBtnH = el_chooseArtBtn.offsetHeight;
        el_listWrap.style.left = xy[0]+"px";
        el_listWrap.style.top = (chooseArtBtnH+xy[1])+"px";
        
        SinaEx.enterLeave(_nodes.ul, function(li){
            li.className = "act";
        }, function(li){
            li.className = "";
        },15);
        __addEvent(_nodes.prev, function(){
            changePage("prev");
            return false;
        });
        __addEvent(_nodes.next, function(){
            changePage("next");
            return false;
        });
        __addEvent(_nodes.ul, function(evt){
            var t = Core.Events.getEventTarget(evt), arturl = t.getAttribute("arturl") ;
            if( arturl ){
                el_urlInput.value = arturl;
                Core.Events.fireEvent(el_viewArticle, "click");
                el_listWrap.style.display = "none";
            }
        });
        var resizetimer = 0;
        __addEvent(window, function(){
            clearTimeout(resizetimer);
            resizetimer = setTimeout(function(){
                var xy = __getXY(el_chooseArtBtn);
                el_listWrap.style.left = xy[0]+"px";
                el_listWrap.style.top = (chooseArtBtnH+xy[1])+"px";
            }, 50);
        }, "resize");
    }
    
    function changePage(act){
        act==="prev" ? el_listWrap.page-- : el_listWrap.page++;
        var s = el_listWrap.page*8, i = 0, len = db_artList.length,
            datai, h = '';
        for(; i<8&&(s+i)<len; i++){
            datai = db_artList[s+i];
            h = h+'<li><span arturl="http://blog.sina.com.cn/s/blog_'+datai.blog_id+'.html">'+datai.blog_title
                +'</span><em>'+datai.blog_pubdate+'</em></li>';
        }
        _nodes.prev.style.visibility = "visible";
        _nodes.line.style.visibility = "visible";
        _nodes.next.style.visibility = "visible";
        if(el_listWrap.page==0){
            _nodes.prev.style.visibility = "hidden";
            _nodes.line.style.visibility = "hidden";
        }
        var pages = Math.ceil(len/8);
        if( el_listWrap.page==(pages-1) ){
            _nodes.line.style.visibility = "hidden";
            _nodes.next.style.visibility = "hidden";
            for(; pages>1&&i<8; i++){
                h = h+'<li><span>&nbsp;</span><em></em></li>'; //超过1页则保持所有页高度一致
            }
        }
        _nodes.ul.innerHTML = h;
    }
    function showList(){
        var i = 0,
            h = el_listWrap._height, sw = el_listWrap._sw;
        el_listWrap.style.width = "0px";
        el_listWrap.style.height = sw+"px";
        el_listWrap.style.display = "";
        var foo = function(){
            if(i<h){
                i += 10;
                el_listWrap.style.width = (i+sw)+"px";
                el_listWrap.style.height = i+"px";
                setTimeout(foo, 15);
            }else{
                el_chooseArtBtn.busy = false;
            }
        };
        foo();
    }
    function hideList(){
        var i = el_listWrap._height, sw = el_listWrap._sw;
        var foo = function(){
            i -= 10;
            if(i>0){
                el_listWrap.style.width = (i+sw)+"px";
                el_listWrap.style.height = i+"px";
                setTimeout(foo, 15);
            }else{
                el_listWrap.style.display = "none";
                el_chooseArtBtn.busy = false;
            }
        };
        foo();
    }
});
