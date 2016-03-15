/**
 * Copyright (c) 2010, Sina Inc. All rights reserved.
 * @fileoverview 快速发博文
 * @author dg.liu | dongguang@staff.sina.com.cn
 */
$import("sina/core/class/create.js");
$import("lib/dialogConfig.js");
$import("editor/QuickEditor.js");
$import("lib/ticket.js");
$import("sina/utils/json.js");
$import("editor/image/LoadingManage.js");
$import("editor/image/UploadImage.js");
$import("lib/editor/plugins/face/FaceMain.js");
$import("sina/core/string/j2o.js");
$import("sina/core/string/trim.js");
$import("msg/blogEditorMSG.js");
$import("sina/core/string/trim.js");
$import('sina/utils/form/sinput.js');
$import('sina/utils/form/functionlimit.js');
$import("sina/core/string/trim.js");
$import("lib/sendLog.js");

App.SendArticle = Core.Class.create();
App.SendArticle.prototype={
	mini_editor:"as_mini_editor",
	editor_container:"as_editor_id",
	editor_parent:"as_editor_parent",
	insert_img:"qe_insert_img",
	insert_face:"qe_insert_face",
	upload_inputs:"qe_upload_inputs",
	loading_container:"qe_loading_container",
	save_btn:"qe_save_btn",
	article_titile:"qu_article_title",
	adv_mode:"qu_adv_editor",
	img_tip:"qe_img_tip",
	txt_dis:"qe_txt_display",
	title_data:"b_title",
	is_mobile: /Mobile/i.test(navigator.userAgent),
	initialize:function(position){
		this.initPanel();
		this.bindEvent();
		window.uploadImage=new Editor.UploadImage(this.loading_container,this.upload_inputs);
		window.editorFace=new Editor.Plugins.FaceMain();
		
	},
	bindEvent:function(){
		Core.Events.addEvent($E(this.mini_editor),this.swapEditorMode.bind2(this),"click");
		Core.Events.addEvent(this.ps.getNodes().btnClose,this.swapMiniMode.bind2(this),"click");
		window.onresize=function(){
			this.setPosition();
		}.bind2(this);
		
	},
	toBlogEditor:function(){
		
		if(uploadImage.uploadImages && uploadImage.uploadImages.length>0){
			showError("B79012");
			return;
		}
		
		v7sendLog('98_01_02_'+scope.$uid,scope.$pageid,'');

		if(this.is_mobile){
			window.open("http://control.blog.sina.com.cn/admin/article/article_add.php");
			this.clearEditorCon();
			this.swapMiniMode();
			return false;
		}
		
		var form=$C("form");
		var source=$C("input");
		var title=$C("input");
		var content=$C("input");
		
		source.type="hidden";
		title.type="hidden";
		content.type="hidden";
		
		form.action="http://control.blog.sina.com.cn/admin/article/article_add.php";
		form.method="post";
		form.target="_blank";
		
		source.name="source";
		title.name="title";
		content.name="content";
		
		source.value=window.location.href;
		title.value=$E(this.article_titile).value;
		content.value=this.replaceImageSize(editor.getContentHtml(),"small","bmiddle");
		
		
		
		form.appendChild(source);
		form.appendChild(title);
		form.appendChild(content);
		
		document.body.appendChild(form);
		form.submit();
		this.clearEditorCon();	
		this.swapMiniMode();
			
	},
	buildEditor:function(){
		window.editor = new Editor.QuickEditor({
			container: this.editor_container,
			className:"query_editor",
			focusElementId:"as_mini_editor"
		});
		//editor.setScrolling("no");
		//editor.iframeDocument.body.style.padding="0px 10px";

		//移动设备
		if(this.is_mobile){
			$E(this.editor_container).style.display = "none";
			$E("quick_tools").style.display = "none";
			$E("as_editor_mb").style.display = "";
			editor.getContentHtml = function(){
				var div = document.createElement("div");
				div.appendChild(document.createTextNode($E("editor_mb_ta").value));
				return div.innerHTML.replace(/\r?\n/g,"<br/>").replace(/\s/g, "&nbsp;");
			};
		}else{
			editor.setAutoHeight(this.autoHeight.bind2(this));
			Core.Events.addEvent($E(this.insert_img),this.renderInsertImg.bind2(this),"click");
			Core.Events.addEvent($E(this.insert_face),this.renderInsertFace.bind2(this),"click");
		}
		Core.Events.addEvent($E(this.save_btn),this.saveArticle.bind2(this),"click");
		Core.Events.addEvent($E(this.adv_mode),this.toBlogEditor.bind2(this),"click");
			
		var titleEle=$E(this.article_titile);
		Utils.Form.limitMaxLen(titleEle,96);
      	Utils.Form.functionlimit(titleEle,Core.String.trim,true);
		
		titleEle.value=$E(this.title_data).value;
		
	}
	,autoHeight:function(){
		var o_height=editor.iframeDocument.body.offsetHeight;
		var i_height=parseInt(editor.iframe.getAttribute('height'));
		var c_height=editor.iframeDocument.body.clientHeight;
		var s_height=editor.iframeDocument.body.scrollHeight;
		
		var s_top=editor.iframeDocument.body.scrollTop;
	
//		trace("o_height:"+o_height);
//		trace("i_height:"+i_height);
//		trace("s_height:"+s_height);
//		trace("c_height:"+c_height);
//		trace("s_top:"+s_top);
//		debugger;
//		if ($IE) {
			if(s_height>40){
				if(s_height>320){
					s_height=320;	
				}
				editor.setHeight(s_height);
			}
//		}else{
//			if(s_height>o_height){
//				if(s_height>470){
//					s_height=470;
//				}
//				editor.setHeight(s_height+30);
//			}
//		}
		uploadImage.setFlashPosition();
			
	}, 
	renderInsertImg:function(){
		
		Lib.checkAuthor();
		if(!$isLogin){
			new Lib.Login.Ui().login(this.renderInsertImg.bind2(this),true);
			return;
		}
		var container=$E(this.upload_inputs);
		container.parentNode.style.display="";
		
		if(!this.isRenderInsertImg){
			uploadImage.initFlashContainer($E(this.upload_inputs));
			uploadImage.initUploadFlash();
			uploadImage.setFlashPosition();
			this.isRenderInsertImg=true;
		}
		
	},
   	renderInsertFace:function(){
		
		Lib.checkAuthor();
		if(!$isLogin){
			new Lib.Login.Ui().login(this.renderInsertFace.bind2(this),true);
			return;
		}
		
		if(!this.isRenderInsertFace){
			editorFace.loadData(editorFace.showDialog.bind2(editorFace));
			this.isRenderInsertFace=true;
		}else{
			editorFace.showDialog();	
		}

		
	},
	getPidsByEditor:function(){
		var obj={
			is_album:0,
			album:''
		};
		var images=editor.iframeDocument.getElementsByTagName("img");
		var len=images.length;
		var count = [];
		for(var i=0;i<len;i++){
			if(images[i].getAttribute('type')!="face"){
				obj.is_album=1;
				//防止用户插入非正常的图片导致不能发表
				try {
					var nums = images[i].src.split('/');
					count.push(nums[nums.length-1]);
				} catch(e){}
			}
		}
		if(count.length) {
			obj.album = count.join(',');
		}
		return obj;
	},
	_getPidBySrc:function(src){
		var pid="";
		src.replace(/(\w{16,25})($|\&)/,function(a,b,c){
			pid=b;
		});
		return pid;
	},
	replaceImageSize:function(str,size1,size2){
		var reg=new RegExp("/"+size1+"/","g");
		return str.replace(reg,"/"+size2+"/");
		
	},
	saveArticle:function(){
		Lib.checkAuthor();
		if(!$isLogin){
			new Lib.Login.Ui().login(this.saveArticle.bind2(this),true);
			return;
		}
		
		if(uploadImage.uploadImages && uploadImage.uploadImages.length>0){
			showError("B79011");
			return;
		}
		
		if(this.saving){
			return false;
		}
		this.saving=true;
		
		
		var body=this.replaceImageSize(editor.getContentHtml(),"small","bmiddle");
		
		
		var params={
			blog_body:body,
			blog_title:$E(this.article_titile).value,
			vtoken:$E("vtoken").value,
			domain:1,
			noEncode:true,
			source:"platform"
		};
		if(this.noCheck){
			params.check="no";
		}
		var obj=this.getPidsByEditor();
		params.is_album=obj.is_album;
		params.album=obj.album;
		Utils.Io.Ijax.request("http://control.blog.sina.com.cn/admin/article/article_post.php", {
			onComplete : function(resultText) {
				var data=Core.String.j2o(Core.String.trim(resultText));
				switch(data.code) {
					case "B66666":		//故障
						var sucdlg = winDialog.alert("服务器临时遇见问题，发博文功能暂时不可用。工程师正在恢复中，请稍后再试。", {
							funcOk: function(){},
							textOk: "确定",
							title: "提示",
							icon: "02" // 可选值："01"、"02"、"03"、"04"、"05"
						}, "sendArticleProblemDialog");
						break;
					case "B07006":
						var sucdlg = winDialog.alert("您已发的博文正在审查中，请稍后再发文", {
		                    funcOk: function(){
								
							}.bind2(this),
		                    textOk: "确定",
		                    title: "提示",
		                    icon: "03" // 可选值："01"、"02"、"03"、"04"、"05"
		                }, "sendArticleSucsessDialog");		              
						break;
					case "B06011":
					case "B06012": //七喜活动的成功返回码
					case "B06001":
						scope.fackSend(data);
						break;
					case "B02005":
					 	var sucdlg = winDialog.confirm($SYSMSG["B02005"], {
	                        funcOk: function(){
								this.noCheck=true;
								this.saveArticle();
	                        }.bind2(this),
	                        funcCancel: function(){
	                         
	                        },
	                        textOk: "确定",
	                        textCancel: "取消",
	                        title: "提示",
	                        icon: "02" // 可选值："01"、"02"、"03"、"04"、"05"
	                    });
						break;
					case "B00010":
						showError("A00003");
						break;
					
					default:
						showError(data.code);
				}
				trace(resultText);
				//B06001
				this.saving=false;
			}.bind2(this),
			onException: function() {
				trace("error");
				this.saving=false;
				
			}.bind2(this),
			POST : params
		});
	},
	gotoArcitle:function(data){
		var url="http://blog.sina.com.cn/s/blog_" + data + ".html";
		var win=window.open(url,"_blank");
	
		this.clearEditorCon();
		this.swapMiniMode();
		win.focus();
	},
	clearEditorCon:function(){
		editor.iframeDocument.body.innerHTML="";
		editor.setHeight(53);
		$E(this.article_titile).value=$E(this.title_data).value;
		this.hiddenImg();
		
	},
	hiddenImg:function(){
		var container=$E(this.upload_inputs);
		container.parentNode.style.display="none";
		uploadImage.clearError();
	},
	swapEditorMode:function(){
		var nodes=this.ps.getNodes();
		if(!this._initEditor){
			nodes.content.innerHTML=this.getContentHTML();
			this.buildEditor();
			this._initEditor=true;
		}
		editor.iframeWindow.focus();
		nodes.panel.className+=" full_write";
		nodes.content.style.display="";
		$E(this.mini_editor).style.display="none";
		v7sendLog('98_01_01_'+scope.$uid,scope.$pageid,'');
		$E(this.editor_parent).style.display="";
	},
	swapMiniMode:function(){
		var nodes=this.ps.getNodes();
		var panel=nodes.panel;
		
		panel.className="quick_write";
		$E(this.editor_parent).style.display="none";
		$E(this.mini_editor).style.display="";
		
		var div = document.createElement('div');
		div.innerHTML = this.is_mobile ? $E("editor_mb_ta").value : editor.iframeDocument.body.innerHTML;
		div = this._clearNode(div,'style');
		div = this._clearNode(div,'script');
		
		var txt= Core.String.trim($IE ? div.innerText : div.textContent);
		var imgEle=$E(this.img_tip);
		var txtEle=$E(this.txt_dis);
		if(txt!="" && txt!="\n"){
			var shotStr = Core.String.shorten(txt,180);
			shotStr = shotStr.replace(/\</g,'&lt;');
			shotStr = shotStr.replace(/\>/g,'&gt;');
			txtEle.innerHTML='<div class="mini_writebox">'+shotStr+'</div>';
			imgEle.style.display="none";
			txtEle.style.display="";
		}else{
			imgEle.style.display="";
			txtEle.style.display="none";
		}
		editor.blur();
		
	},
	/**
	 * 清除节点
	 * @param {element} fakeEle 假节点,只用来清除内容，不会真正插入
	 * @param {string} tagName 要清除的节点名称
	 * @return {element} 返回清除掉内容的假节点
	 */
	_clearNode: function(fakeEle,tagName){
		var tgs = fakeEle.getElementsByTagName(tagName);
		for(var i=0; tgs[i]; i++) {
			tgs[i].parentNode.removeChild(tgs[i]);
		}
		return fakeEle;
	},
	setPosition:function(){
		var ele=$E("qEditor_container");
		var position={};
		position.x=Core.Dom.getLeft(ele);
		position.y=Core.Dom.getTop(ele);
		this.ps.setPosition(position.x,position.y);
	},
	initPanel:function(position){
		this.ps=new Lib.Panel();
		this.ps.setTemplate(this.getPanelTpl());
		this.setPosition();
		this.ps.show();
	},	
	getPanelTpl:function(){
		var temp='<div class="center_write"><div class="quick_write" style="z-index:511" id="#{panel}">' +
		    '<div class="arrow"></div>' +
		    '<a id="#{btnClose}" href="#" onclick="v7sendLog(\'98_01_03_'+scope.$uid+'\',\''+scope.$pageid+'\',\'\');return false;" title="收起" class="close"></a>' +
		    '<table cellspacing="0" cellpadding="0" border="0">' +
		    '<tbody>' +
		        '<tr>' +
		          '<td class="top"></td>' +
		          '<td class="topshadow"></td>' +
		        '</tr>' +
		        '<tr>' +
					'<td>' +
						'<div class="middle" id="'+this.mini_editor+'">' +
							'<div class="original" id="'+this.img_tip+'">' +
								'<img alt="" src="http://simg.sinajs.cn/blog7style/images/center/center_write03.gif">' +
							'</div>' +
							'<div class="original" id="'+this.txt_dis+'" style="display:none"></div>' +
						'</div>' +
						'<div class="middle" id="#{content}" style="display:none"></div>' +
					'</td>' +
					'<td class="middleshadow"></td>' +
				'</tr>' +
			'</tbody>' +
			'</table>' +
			'<div class="bottom">' +
				'<div class="bottomshadow"></div>' +
			'</div>' +
		'</div></div>';
		return temp;
	},
	getContentHTML:function(){
		var html='<div class="full" id="'+this.editor_parent+'">' +
		  '<div class="title_line">' +
		    '<span class="title_inputbox"><input type="text" size="65" onfocus="this.select()" class="title_input" id="'+this.article_titile+'"/></span>' +
		    '<a href="" onclick="return false;" id="'+this.adv_mode+'">高级模式</a></div>' +
		  '<div class="full_input">' +
		    '<div class="full_inputTop"></div>' +
		    '<div style="height: 53px;" id="'+this.editor_container+'" class="full_inputMid">' +
		      '<!--iframe width="386" height="53" frameborder="0" scrolling="no" src="test.html" allowtransparency="yes"></iframe-->' +
		    '</div>' +
			'<div id="as_editor_mb" class="full_inputMid" style="display:none;">' +
				'<textarea id="editor_mb_ta" style="width:376px;height:200px;border-width:0px;line-height:18px;padding:5px;"></textarea>' +
			'</div>' +
		    '<div class="full_inputBot"></div>' +
		  '</div>' +
		  '<div class="option_line" id="'+this.loading_container+'">' +
		    '<div class="option_btn">' +
		      '<div class="option_box" id="quick_tools">' +
				'<span><a id="'+this.insert_img+'" href="#" onclick="return false"><img width="15" height="15" align="absmiddle" title="插入图片" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon18"> 插入图片</a></span>' +
				'<span><a id="'+this.insert_face+'" onclick="return false" href="#"><img width="15" height="15" align="absmiddle" title="插入表情" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon45"> 插入表情</a></span>' +
			  '</div>' +
		      '<a id="'+this.save_btn+'" title="发博文" onclick="return false" class="postBtn" href="#"></a>' +
		      '<div class="clearit"></div>' +
		    '</div>' +
		    '<div class="option_file" style="display:none">' +
		      '<div class="file_fake" id="'+this.upload_inputs+'">' +
		        '<input type="text" value="" class="file_area"/>' +
		        '<a class="file_btn" href="#">选择</a>' +
		      '</div>' +
		    '</div>' +
		  '</div>' +
		'</div>';
		return html;
	}
};
