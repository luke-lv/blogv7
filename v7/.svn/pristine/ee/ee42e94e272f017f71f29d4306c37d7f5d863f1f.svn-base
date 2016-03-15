$import("editor/BlogEditor.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/string/byteLength.js");
$import("sina/utils/cookie/getCookie.js");
$import("sina/utils/url.js");
$import("mojie/setTimeDialog.js");
$import("sina/core/date/getTimeObj.js");
$import("sina/core/date/UTC.js");
$import("sina/utils/io/ijax.js");
$import("sina/core/string/j2o.js");
$import("sina/core/string/trim.js");

$registJob("editor_init", function(){
	/* 365预置博文需要打开日历界面——开始
		http://control.blog.sina.com.cn/admin/article/article_add.php?tag365=2012-11-13*/
	var url = new Utils.Url(location.href);
	var query = url.query;
	
	if (query && query.tag365){//365标签存在且有日期值
	// debugger;
		var timeArr = query.tag365.split("-");
		
		if (timeArr){
			var hhmmss = $E('articleTime').value;
			var yyMMdd = timeArr, hhmmss = hhmmss.split(":");
			//trace(yyMMdd);trace(hhmmss);
			db_time = Core.Date.UTC({
				y: yyMMdd[0],
				M: parseInt(yyMMdd[1], 10) - 1,
				d: parseInt(yyMMdd[2], 10),
				h: parseInt(hhmmss[0], 10),
				m: parseInt(hhmmss[1], 10),
				s: parseInt(hhmmss[2], 10)
			});
				
			var now = new Date();
			now_time = Core.Date.UTC({
				y: now.getFullYear(),
				M: now.getMonth(),
				d: now.getDate(),
				h: now.getHours(),
				m: now.getMinutes(),
				s: now.getMilliseconds()
			});
			
			if (now_time < db_time){//只有传递的是将来的时间，才出现浮层
				scope.$pub_time = db_time;
			
				Mojie.setTimeDialog({
					time: db_time,
					funcOk: setTimeOk
				});
			}
		}
	}
	
	function setTimeOk(time){
        db_time = time;
        scope.$pub_time = time;
        var tobj = Core.Date.getTimeObj(time),
            yMd = tobj.yy+'-'+tobj.MM+'-'+tobj.dd,
            hms = tobj.hh+':'+tobj.mm+':'+tobj.ss;
        $E('date_pub').value = yMd;
        $E('articleTime').value = hms;
        $E('timeTips').innerHTML = '博文将于 '+yMd+' '+hms+' 发布<a href="javascript:;">×</a>';
        $E('isTimed').value = 7;
		var servertime = parseInt(articleEditorCFG.servertime,10)||0;
		servertime *= 1000; //转换成毫秒
        if(time<servertime){
            v7sendLog('50_01_20'); //设置的时间是历史时间
        }
    }
    
	/* 365预置博文需要打开日历界面——结束 */
    
    var blogHtml = $E("SinaEditorTextarea").value;
    // 淘博会相关html处理
    // 淘博会的东西放在博文正文里了，这里必须处理，我擦
    if (scope.$private.tbh_status && blogHtml) {
        var tbhDivIndex = blogHtml.lastIndexOf('<div class="taofair">');
        if (0 <= tbhDivIndex) {
            blogHtml = blogHtml.substring(0, tbhDivIndex);
            $E("SinaEditorTextarea").value = blogHtml;
        }
    }
	
    var editmenuCookie = Utils.Cookie.getCookie("EditorToolType");
    //trace("编辑器菜单的Cookie: " + editmenuCookie);
    var option = {
        iframe_container: "SinaEditor_Iframe",
        iframe_cls: "iframe",
        textarea: "SinaEditorTextarea",
        checkbox: "SinaEditor_59_viewcodecheckbox",
        heightModeId: "height_mode",
        toolType: editmenuCookie || "base",
		focusElementId:"articleTitle",
        mode: "edit"
    };

    window.editor = new Editor.BlogEditor(option);
	window.editor.iframeWindow.focus();

    /***************  编辑器自动加标签功能开始 modify by gaolei2@  ****************************/
	var addEvent = Core.Events.addEvent,
		removeEvent = Core.Events.removeEvent,
        trim = Core.String.trim;
    addEvent(window.editor.iframeWindow, editorWindowBlur, 'blur');

    function editorWindowBlur(e){
    	var contentBody = window.editor.iframeDocument.body;
        if( Core.String.byteLength(contentBody.innerText||contentBody.textContent||'')<400 ){ // 不满400字退出
            return;
        }
        if (editor.iframe.getAttribute('get-tag') == 1 || trim($E('articleTagInput').value) != ''){ // 已经请求过接口了或已经有标签，退出
        	removeEvent(window.editor.iframeWindow, editorWindowBlur, 'blur');
            return;
        }
        getDefaultTag(contentBody);
    }

    function getDefaultTag(contentBody){
        //alert('default-tag')
        var title = ($E('articleTitle') && $E('articleTitle').value) || '';
            body = contentBody.innerHTML || '';
        Utils.Io.Ijax.request('http://interface.blog.sina.com.cn/api/get_blog_classify.php', {
            POST : {
                blog_body: body,                      //必选 文章正文，默认为''
                blog_title: title,                      //必选 标题， 默认为''
                utf8: 'utf8',
                action: 'classify'
            },
            onComplete : function(resultText) {
                editor.iframe.setAttribute('get-tag', 1);
                var resObj = Core.String.j2o(resultText);
                if (resObj.code && resObj.code === "A00006"){
                    renderDefalutTag(resObj.data);
                }
            },
            onException: function() {
                // console.log("error");
            }
        });

    }

    function renderDefalutTag(data){
    	var articleTagInput = $E('articleTagInput'), tInput = $E('tInput');
        if (!articleTagInput || !tInput){
            return;
        }
    	if (document.activeElement == tInput){
    		editor.iframe.setAttribute('default-tag', data);
    		addEvent(tInput, tInputBlur, 'blur');
    		return;
    	}
        if (trim(articleTagInput.value) == ""){ // 只有用户没有自动加标签时，才加入选定标签
            scope._tagsMng.addTag(data);
        }

    	removeEvent(window.editor.iframeWindow, editorWindowBlur, 'blur');
    }

    function tInputBlur(e){
        var articleTagInput = $E('articleTagInput'), tInput = $E('tInput'), data;
        if (!articleTagInput || !tInput){
            return;
        }
        
        if (trim(articleTagInput.value) == ""){ // 只有用户没有自动加标签时，才加入选定标签
    		data = editor.iframe.getAttribute('default-tag');
    		scope._tagsMng.addTag(data);
    	}
        removeEvent(tInput, tInputBlur, 'blur');
        removeEvent(window.editor.iframeWindow, editorWindowBlur, 'blur');

    }
    /***************  编辑器自动加标签功能结束  moidfy by gaolei2@ ****************************/

	var is_mobile = /Mobile/i.test(navigator.userAgent);
	if(is_mobile){
		var meditor = $E("mobileEditor");
		if(!meditor){
			winDialog.alert("您所使用的设备暂不能使用完整功能，请在电脑上进行操作", {icon:'01'});
			return;
		}
		var encodeHTML = function(str){
			var div = document.createElement("div");
			div.appendChild(document.createTextNode(str));
			return div.innerHTML.replace(/\r?\n/g,"<br/>").replace(/\s/g, "&nbsp;");
		};
		$E("SinaEditor").style.display = "none";
		meditor.style.display = "";
		//移动系统如iPad，覆盖setSourceValue方法即可不用改其他功能鸟，哈哈哈哈~
		window.editor.setSourceValue = function(){
			this.textarea.value = encodeHTML($E("mobileTextarea").value);
		};
	}
});
