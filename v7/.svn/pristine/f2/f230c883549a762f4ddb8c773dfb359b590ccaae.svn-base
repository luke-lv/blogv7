$import("editor/BlogEditor.js");

$registJob("editor_init", function(){
    var option = {
        iframe_container: "SinaEditor_Iframe",
        iframe_cls: "iframe",
        textarea: "SinaEditorTextarea",
        checkbox: "SinaEditor_59_viewcodecheckbox",
        heightModeId: "height_mode",
        toolType: "base",
		focusElementId:"articleTitle",
        mode: "edit"
    };
    window.editor = new Editor.BlogEditor(option);
    window.editor.iframeWindow.focus();

//	var is_mobile = /Mobile/i.test(navigator.userAgent);
//	if(is_mobile){
//		var meditor = $E("mobileEditor");
//		if(!meditor){
//			winDialog.alert("您所使用的设备暂不能使用完整功能，请在电脑上进行操作", {icon:'01'});
//			return;
//		}
//		var encodeHTML = function(str){
//			var div = document.createElement("div");
//			div.appendChild(document.createTextNode(str));
//			return div.innerHTML.replace(/\r?\n/g,"<br/>").replace(/\s/g, "&nbsp;");
//		};
//		$E("SinaEditor").style.display = "none";
//		meditor.style.display = "";
//		//移动系统如iPad，覆盖setSourceValue方法即可不用改其他功能鸟，哈哈哈哈~
//		window.editor.setSourceValue = function(){
//			this.textarea.value = encodeHTML($E("mobileTextarea").value);
//		};
//	}
});
