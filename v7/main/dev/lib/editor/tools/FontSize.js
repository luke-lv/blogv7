/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 设置背景色
 * @author dongguang | dongguang@staff.sina.com.cn
 */
$import("lib/editor/tools/tools.js");
$import("sina/core/class/create.js");
$import("sina/core/class/extend.js");
$import("sina/ui/panel.js");
$import("lib/editor/tools/OperateLayer.js");

Editor.Tools.FontSize= Core.Class.create();
Editor.Tools.FontSize.prototype={
	initialize:function(editor,tamplate){
		//trace("FontSize");
		this.stopEvent();
		this.editor=editor;
		this.layer=new Ui.Panel();
		this.layer.setTemplate(tamplate);
		this.initElement();
		this.setPosition();
	},
	/**
	 * 初始化内容元素
	 */
	initElement:function(){
		var size;
			//小编辑器
		if (this.editor.type != "smallEditor") {
			size = {
				"10px": "10px<i>(六号)</i>",
				"12px": "12px<i>(小五)</i>",
				"14px": "14px<i>(五号)</i>",
				"16px": "16px<i>(小四)</i>",
				"18px": "18px",
				"20px": "20px<i>(小三)</i>",
				"22px": "22px",
				"24px": "24px<i>(小二)</i>",
				"32px": "32px<i>(小一)</i>",
				"56px": "56px<i>(初号)</i>"
			};
		}else{
			size={
				"10px":"10px<i>(六号)</i>",
				"12px":"12px<i>(小五)</i>",
				"18px":"18px", 
				"22px":"22px", 
				"32px":"32px<i>(小一)</i>", 
				"56px":"56px<i>(初号)</i>"
			};
		}

		for(var name in size){
			var a=$C("a");
			a.innerHTML=size[name];
			//小编辑器
			if(this.editor.type!="smallEditor"){
				a.style.cssText="font-size:"+name;
			}
			//trace(a.cssText);
			a.href="javascript:void(0);";
			a.onclick = function(){
				return false;
			};
			a.className="fontItem";
			this.layer.entity.appendChild(a);
			Core.Events.addEvent(a, this.exec.bind2(this), "click");
		}		
	},
	/**
	 * 替换字号设置 （只有ie执行）
	 * @param {String} size 字号
	 */
	replaceSize:function(size){
		var fonts = this.editor.iframeDocument.body.getElementsByTagName("font");
			//trace("innerHTML:"+this.editor.iframeDocument.body.innerHTML)
			var fontsLen = fonts.length;
			var fontNode = null;
			var clear=false;
			trace(fontsLen);
			for(var i = 0; i < fontsLen; i ++ ) {
				fontNode = fonts[i];
				if (fontNode.getAttribute("face") == "SinaEditor_Temp_FontName") {
					Core.Dom.setStyle(fontNode, "fontSize", size);
					fontNode.removeAttribute("face");
					clear=true;
					//删除被选中内容中的字号
					//http://issue.internal.sina.com.cn/browse/BLOG-15129
					var childFonts=fontNode.getElementsByTagName("font");
					var len=childFonts.length;
					var parentNode=fontNode.parentNode;
					for(var j=0;j<len;j++){
						Core.Dom.setStyle(childFonts[j], "fontSize", "");
						if(parentNode.tagName.toLowerCase()=="font"){
							if(parentNode.innerText==fontNode.innerText){
								Core.Dom.setStyle(parentNode, "fontSize", "");
							}	
						}
					}
				}
			}
	},
	/**
	 * 事件的执行函数
	 */
	exec:function(){
		this.hidden();
		var ele=this.getEventElement();
		if(ele.nodeName.toLowerCase()!="a"){
			ele=ele.parentNode;
		}
		var size=ele.innerHTML.replace(/(\d{1,2}px).*/gi,"$1");
		//trace(size);
		this.editor.iframeWindow.focus();
		if($IE) {
			this.editor.selectRange();
			this.editor.execCommand("fontname", "SinaEditor_Temp_FontName", "");
			this.replaceSize(size);
		} else {
            this.editor.execCommand("FontSize", size, false);
            var fontEles = this.editor.iframeDocument.getElementsByTagName("font"),
                len = fontEles.length,
                fontEle, shitBrowse = false;
            while(len--){
                //trace("size=-"+sz);
                if(fontEles[len].getAttribute('size')){
                    fontEle = fontEles[len];
                    fontEle.removeAttribute('size');
                    fontEle.style.fontSize = size;
                    fuckBrw = false;
                }
            }
            if(shitBrowse){ //对safari之类的傻逼浏览器，暂时继续用传统方法了
                this.editor.execCommand("CreateLink", "#SinaEditor_Temp_FontName", false);
                var links = this.editor.iframeDocument.getElementsByTagName("a");
                var lens = links.length, linkEl, fontEl, childEl;
                for(var i = 0; i < lens; i ++ ) {
                    linkEl = links[i];
                    if(linkEl.href.indexOf("#SinaEditor_Temp_FontName")!=-1) {
                        fontEl = linkEl.parentNode;
                        childEl = linkEl.childNodes[0];
                        fontEl.removeAttribute("size");
                        //用户没有选中任何文字
                        if("#SinaEditor_Temp_FontName" === childEl.nodeValue){
                            childEl.nodeValue = "";
                        } else {
                            fontEl.style.fontSize = size;
                        }
                        fontEl.replaceChild(childEl, linkEl);
                    }
                }
            }
            /*
            this.editor.execCommand("CreateLink", "#SinaEditor_Temp_FontName", false);
            var links = this.editor.iframeDocument.getElementsByTagName("a");
            var lens = links.length, linkEl, fontEl, childEl;
            
            for(var i = 0; i < lens; i ++ ) {
                linkEl = links[i];
                // 经测试FF会将a标签插入font标签外 wangqiang1
                if(linkEl.href.indexOf("#SinaEditor_Temp_FontName")!=-1) {
                    if ($MOZ) {
                        fontEl = linkEl.childNodes[0];
                        fontEl.style.fontSize = fSize;
                        fontEl.removeAttribute("size");
                        linkEl.parentNode.replaceChild(fontEl, linkEl);
                    } else {
                        fontEl = linkEl.parentNode;
                        childEl = linkEl.childNodes[0];
                        
                        fontEl.removeAttribute("size");
                        //用户没有选中任何文字
                        if("#SinaEditor_Temp_FontName" === childEl.nodeValue){
                            childEl.nodeValue = "";
                        } else {
                            fontEl.style.fontSize = fSize;
                        }
                        fontEl.replaceChild(childEl, linkEl);
                    } 
                }
            }
            */
		}
		if(this.editor.swapToolStatus){
			this.editor.swapToolStatus("fontsize");
		}
		this.editor.iframeWindow.focus();
	}
};
Core.Class.extend(Editor.Tools.FontSize.prototype,Editor.Tools.OperateLayer.prototype,true);
	
