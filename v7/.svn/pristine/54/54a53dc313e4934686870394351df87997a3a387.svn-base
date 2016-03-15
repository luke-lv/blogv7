/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 博客发文章页编辑器类
 * @author dg.liu | dongguang@staff.sina.com.cn
 */
$import("sina/core/events/addEvent.js");
$import("sina/core/function/bind2.js");
$import("sina/core/function/bind3.js");
$import("sina/ui/template.js");
$import("sina/utils/cookie/setCookie.js");
$import("sina/utils/UserData.js");
$import("sina/utils/excBeforeCloseWin.js");
$import("lib/editor/AbstractStandard.js");
$import("lib/editor/tools/Tool.js");
$import("lib/editor/utils/EditorHistory.js");
$import("lib/editor/utils/RangeCache.js");
$import("lib/editor/utils/image/ImageDrag.js");
$import("lib/editor/tools/Status.js");
$import("lib/editor/utils/image/ImageOperate.js");
$import("lib/editor/tools/BlogOperate.js");

$import("lib/editor/utils/FormatDoc.js");
$import("msg/baby_msg.js");

Editor.BlogEditor = Core.Class.create();
Editor.BlogEditor.prototype = {
    //iframeUrl: "blank.html",
	//编辑器的iframe的url。实现是否设置domain ，""为不设；指向一个空白页面可以在空白页面设置domain
	//基础工具栏
	baseTools:null,
	//专业工具栏
	proTools:null,
	//类型
	type:"blogEditor",
	//显示的工具栏类型  base:基础;por：专业
	toolType:"base",
	/**
	 * 构造函数
	 * @param {Object} option
	 * {
			iframe_container:"SinaEditor_Iframe",
			iframe_cls:"iframe_h",
			textarea_container:"SinaEditor_Textarea",
			textarea_cls:"textarea_h"
		};
	 */
    initialize: function(option){
		
        //trace("BlogEditor");
		if(!option||!option.iframe_container){
			return;
		}
		this._focusElementId=option.focusElementId;
		this._addOperateToOnload(this.addEventsToBody.bind2(this));
		this._addOperateToOnload(this.addEventsToDocument.bind2(this));
		this._addOperateToOnload(this.initToosStatus.bind2(this));
		this._addOperateToOnload(function(){
			this.formatDoc=new Editor.Utils.FormatDoc(this.iframeDocument,this);
		}.bind2(this));
		
		this.initTextArea($E(option.textarea));
        this._initIframe($E(option.iframe_container), option.iframe_cls);
		
        this.operate = new Editor.Tools.Operate(this);
		this.history = new Editor.Utils.EditorHistory(this, 50);
		this.rangeCache=new Editor.Utils.RangeCache(this);
		this.initTool();
		this.initModeSwap(option.checkbox);
		this.initHeightModeSwap(option.heightModeId);
        
		if(option.mode!="edit"){
			this.swapMode();
		}
		this.swapTools(option.toolType);
		
		this.imageOperate=new Editor.Utils.ImageOperate();
		
		this.userData=new Utils.UserData();
	
		//当窗口尺寸改变时 重新调整遮盖层的位置
		var _this=this;
	    Core.Events.addEvent(window, (function(){
			_this.baseTools.setShutOutProperty(_this.baseTools.container.parentNode);
			_this.proTools.setShutOutProperty(_this.proTools.container.parentNode);
	    }), "resize");
		
		//将显示源代码的checkbox设置初始值
		if(option.checkbox){
			var checkboxObj=$E(option.checkbox);
			if(checkboxObj){
				checkboxObj.checked=false;
			}
		}
    },
	/**
	 * 根据userData中的数据恢复编辑器中的数据
	 */
	redoData:function(){
		var redo_data=this.userData.load("blog_user_data_"+scope.$uid,["content"]);
		if(redo_data && redo_data.content && redo_data.content != "") {
			//育儿博客的用户直接保存，所以不再需要这个提示
			if(scope.$user_channel && parseInt(scope.$user_channel) === 2) {
				this.userData.clear("blog_user_data_"+scope.$uid,["content"]);
				return;
			}
			winDialog.confirm($SYSMSG['B02004'], {
                funcOk: function(){
	                this.iframeDocument.body.innerHTML = redo_data.content;
					this.userData["blog_user_data_"+scope.$uid] = true;
					this.userData.clear("blog_user_data_"+scope.$uid,["content"]);
				}.bind2(this),
                textOk: "是",
                textCancel: "否",
				funcCancel:function(){
					this.userData.clear("blog_user_data_"+scope.$uid,["content"]);
				}.bind2(this),
                defaultButton: 1, // 默认是1，表示确定按钮默认聚焦，0 表示取消按钮默认聚焦
                title: "提示",
                icon: "04" // 可选值："01"、"02"、"03"、"04"、"05"
             });
		}
	},
	/**
	 * 初始化工具栏
	 */
    initTool: function(){
		var classTemplate="ico_#{operate}_#{num}";
        var baseToolConfig = {
            classTemplate: classTemplate,
            tools: {
                undo: {title: "撤销（Ctrl+Z）"},
                bold: {title: "加粗"},
                italic: {title: "斜体"},
                underline: {title: "下划线"},
                fontsize: {title: "字号",
				inner:"<div>14px</div>"},
                forecolor: {title: "文字颜色",style:"background-color:#000;" },
                link: {title: "插入链接"},
                justifyleft: {title: "左对齐"},
                justifycenter: {title: "居中对齐"},
                justifyright: {title: "右对齐"},
                marklist: {title: "项目符号"},
                numberlist: {title: "编号"},
                img: {title: "插入图片"},
                video: {title: "插入视频"},
                face: {title: "插入表情"},
                justifyfull: {title: "自动排版"},
                quicksave: {title: "快速保存（Ctrl+S）",style:"display:none"},
                quickpost: {title: "快速发表",style:"display:none"}
            }
        };
		var proToolConfig = {
            classTemplate: classTemplate,
            tools: {
				group_1:{ 
				    cls:"ctl_grp",
				    items:{ 
				        paste:{title:"粘贴（Ctrl+V）"},
				        cut:{title:"剪切（Ctrl+X）"},
				        copy:{title:"复制（Ctrl+C）"}
				    }
				},
				group_2:{ 
				    cls:"undo_grp",
				    items:{ 
				        redo: {
				            title: "重做（Ctrl+Y）"
				        },
			            undo: {
			                title: "撤销（Ctrl+Z）"
			            }
				    }
				},
                group_3:{ 
                    cls:"font_grp",
                    items:{ 
                        family: {title: "字体",inner:" <div>"+(scope.$newFontFamily?"微软雅黑":"宋体")+"</div>"}, 
        				fontsize: {title: "字号",inner:"<div>14px</div>"},
        				bold: {title: "加粗"},
        				italic: {title: "斜体"},
        				underline: {title: "下划线"},
        				forecolor: {title: "文字颜色",style:"background-color:#000;" },
        				hilitecolor: {title: "背景颜色",style:"background-color:#fff;" },
        				link: {title: "插入链接"}
    				}
				},
                group_4:{ 
                    cls:"format_grp",
                    items:{
                        marklist: {title: "项目符号"}, 
        				numberlist: {title: "编号"},
        				outdent: {title: "减少缩进"},
        				indent: {title: "增加缩进"},
        				imgdefault: {title: "默认排版"},
        				imgtop: {title: "图片居中排版"},
        				justifyleft: {title: "左对齐"},
        				justifycenter: {title: "居中对齐"},
        				justifyright: {title: "右对齐"},
        				space:{title:""},
        				imgleft: {title: "图片居左混排" },
        				imgright: {title: "图片居右混排"}
				    }
				},				
                group_5:{ 
                    cls:"media_grp",
                    items:{
                        img: {title: "插入图片"}, 
                        video: {title: "插入视频"}, 
                        face: {title: "插入表情"}, 
                        table: {title: "插入表格"}
                    }
                },				
                group_6:{ 
                    cls:"ext_grp",
                    items:{ 
                        justifyfull: {title: "自动排版"}
                    }
                },				
                group_7:{ 
                    cls:"ext_grp",
                    items:{ 
                        quickpost: {title: "快速发表",style:"display:none"},
                        quicksave: {title: "快速保存（Ctrl+S）",style:"display:none"}
                    }
                }
            }
        };
		
        this.baseTools = new Editor.Tools.Tool("base_tools", baseToolConfig);
		this.proTools = new Editor.Tools.Tool("pro_tools", proToolConfig);
        this.baseTools.setOperate(this.operate);
        this.baseTools.initElements();
		this.proTools.setOperate(this.operate);
        this.proTools.initElements();
        var bind = Core.Function.bind3;
		Core.Events.addEvent("SinaEditor_Baselink", 
		      bind(this.swapTools,this,["base"]));
		Core.Events.addEvent("SinaEditor_Prolink",
		      bind(this.swapTools,this,["pro"]));
		
    },
	/**
	 * 源码模式和编辑模式切换时回调的函数
	 * @param {String} type 切换的模式 edit:编辑;code：源码
	 */
	swapShutOut:function(type){
		if(this.toolType=="base"){
			if(type=="edit"){
				this.baseTools.setShutOutProperty();
				this.baseTools.shutOut.show();
			}else{
				this.baseTools.shutOut.hidden();
			}
		}else{
			if(type=="edit"){
				this.proTools.setShutOutProperty();
				this.proTools.shutOut.show();
			}else{
				this.proTools.shutOut.hidden();
			}
		}
		if(!this.rightMenuShutOut){
			this.rightMenuShutOut=new Editor.Utils.ShutOut();
			this.rightMenuShutOut.setProperty($E("editor_box_right"));
			//当窗口尺寸改变时 重新调整遮盖层的位置
			Core.Events.addEvent(window,(function(){this.rightMenuShutOut.setProperty($E("editor_box_right"));}).bind2(this),"resize");
		}
		if(type=="edit"){
			this.rightMenuShutOut.setProperty($E("editor_box_right"));
			this.rightMenuShutOut.show();	
		}else{
			this.rightMenuShutOut.hidden();
		}
		
	},
	/**
	 * 根据操作类型工具栏类型获取操作按钮元素
	 * @param {String} toolType   工具栏类型 base||pro
	 * @param {String} operateType 操作类型 例如：剪切
	 */
	getToolElement:function(toolType,operateType){
		var id;
		if(toolType=="base"){
			id=this.baseTools.id;
		}else{
			id=this.proTools.id;
		}
		return $E(operateType+"_"+id);
	},
	/**
	 * 初始化工具栏中按钮状态
	 */
	initToosStatus:function(){
		//trace("editor.initToosStatus");
		var i=0;
		var clearId=setInterval(function(){
			if(this.baseTools && this.proTools){
				//去掉字色
				//this.baseToolStatus=new ToolStatus(this.baseTools.id,this,["bold", "italic", "underline", "forecolor","fontsize"]);
				this.baseToolStatus=new Editor.Tools.Status(this.baseTools.id,this,["bold", "italic", "underline","fontsize"]);
				this.preToolStatus=new Editor.Tools.Status(this.proTools.id,this);
				Core.Events.addEvent(this.iframeDocument.body,this.baseToolStatus.checkAllStatus.bind2(this.baseToolStatus),"mouseup");
				//解决ie6下页面闪的问题
				//Core.Events.addEvent(this.iframeDocument,this.baseToolStatus.checkAllStatus.bind2(this.baseToolStatus),"keyup");
				Core.Events.addEvent(this.iframeDocument.body,this.preToolStatus.checkAllStatus.bind2(this.preToolStatus),"mouseup");
				//解决ie6下页面闪的问题
				//Core.Events.addEvent(this.iframeDocument,this.preToolStatus.checkAllStatus.bind2(this.baseToolStatus),"keyup");
				clearInterval(clearId);
			}
			//trace("editor.initToosStatus:"+i++);
		
		}.bind2(this),50);
		
	},
	/**
	 * 切换工具栏
	 * @param {String} type 工具栏类型 base||pro
	 */
	swapToolStatus:function(type,color){
		if(this.toolType=="base"){
			this.baseToolStatus.setToolItemStatus(type,color);
		}else{
			this.preToolStatus.setToolItemStatus(type,color);	
		}
	},
	/**
	 * 初始化代码模式与设计模式之间切换
	 * @param {String || Element} checkbox 绑定事件的元素或元素的id
	 */
	initModeSwap:function(checkbox){
		var ele=$E(checkbox);
		
		if(ele.disabled){
			ele.disabled=false;
		}
		Core.Events.addEvent(checkbox,this.swapMode.bind2(this),"click");
		
//		var clearId=setInterval(function(){
//			alert(ele.disabled);
//			if(ele.disabled){
//				alert(0)
//				ele.disabled=false;
//				Core.Events.addEvent(checkbox,this.swapMode.bind2(this),"click");
//				clearInterval(clearId);
//				alert(1)
//			}
//		},500);
//		
	},
	/**
	 * 初始化话编辑区大小切换
	 * @param {String || Element} heightEle 绑定事件的元素或元素的id
	 */
	initHeightModeSwap:function(heightEle){
		Core.Events.addEvent(heightEle,this.swapHightMode.bind2(this),"click");
	},
	/**
	 * 向编辑器的body中添加事件
	 */
	addEventsToBody:function(){
		Core.Events.addEvent(this.iframeDocument.body, this.rangeCache.save.bind2(this.rangeCache), "mouseup");
	},
	/**
	 * 向编辑器的document中添加事件
	 */
	addEventsToDocument:function(){
		//window.onbeforeunload = function() {return "关闭将可能导致内容丢失";}
		//this.iframeDocument.execCommand('formatblock','','<P>');
		var saveStatusTimer;
		Core.Events.addEvent(this.iframeDocument,function(){
			this.closeConfirm();
			clearTimeout(saveStatusTimer);
			saveStatusTimer = setTimeout(function(){
				this.rangeCache.save();
			}.bind2(this), 500);
		}.bind2(this),"mouseup");
		
		Core.Events.addEvent(this.iframeDocument,function(e){
			this.closeConfirm();
			//trace("add");
			//trace("-------------------start----------------------")
			//trace("ctrlKey:"+e.ctrlKey);
			//trace("keyCode:"+e.keyCode);
			//trace("e.keyCode == 83:"+(e.keyCode == 83));
			//trace("e.ctrlKey && e.keyCode == 83:"+ e.keyCode == 83 && e.ctrlKey);
			//trace("-------------------end----------------------");
			
			//在发博文和编辑草稿的时候设置为true;也就是articleStatus为1、3时。
				if (e.keyCode == 83 && e.ctrlKey) {
					if (!$IE) {
						Core.Events.stopEvent();
					}
					if(this.saveType){
						this.operate[this.saveType]();
					}
					
					return;
				}
			if (e.ctrlKey && e.keyCode == 90) {
				if($IE){
					this.operate.undo();
				}
				return;
			}
			if (e.ctrlKey && e.keyCode == 89) {
				if($IE){
					this.operate.redo();
				}
				return;
			}
			this.imageOperate.hidden();
		}.bind2(this), "keyup");
		
		var saveTimer;
		Core.Events.addEvent(this.iframeDocument,function(e){
			if (e.ctrlKey && e.keyCode == 90 || e.ctrlKey) {
				return;
			}
			//只有新发博文是可用，所有在草稿箱和编辑博文时initUserData都为true
			if(!this.initUserData){
				this.initUserData=true;
				//trace("new new UserData()");
				setInterval(function(){
					//trace("this.userData.save");
					if(this.iframeDocument.body.innerHTML.length<40000){
						this.userData.save("blog_user_data_"+scope.$uid,{content:this.iframeDocument.body.innerHTML});
					}
				//}.bind2(this),300000);
				}.bind2(this),60000);
				//this.userData.save("blog_user_data",{content:"lovemxj",uid:scope.$uid||"0000000000"});
				//alert(this.userData.load("blog_user_data",["content","uid"]).uid);
			}
			clearTimeout(saveTimer);
			saveTimer = setTimeout(function(){
				//trace("keydown:this.history.add");
				this.history.add();
				this.rangeCache.save();
			}.bind2(this), 500);
		}.bind2(this), "keydown");
		
		
		if($IE){
			Core.Events.addEvent(this.iframeWindow,hiddenOperate.bind2(this), "scroll");
		}else{
			Core.Events.addEvent(this.iframeDocument,hiddenOperate.bind2(this), "scroll");
		}
		
		function hiddenOperate(){
			if(!this.op_hidden && this.imageOperate.isShow){
				setTimeout(function(){
						this.imageOperate.hidden();
						this.op_hidden=false;
				}.bind2(this),1000);
				this.op_hidden=true;
			}
		};
	},
	/**
	 * 初始化图片操作浮层
	 */
	initImageOpertae:function(){
		if (!this.isInitImageOpertae) {
			if(!this.iframeDocument){
				return;
			}
			Core.Events.addEvent(this.iframeDocument.body, function(el){
				//trace("mousedown");
				var _target = el.target || el.srcElement;
				if (_target.tagName.toLowerCase() == "img") {
					if(!this.imageDrag){
						this.imageDrag=new Editor.Utils.ImageDrag(this);
					}else{
						this.imageDrag.drag(el);
					}
				}
			}.bind2(this), "mousedown");
			Core.Events.addEvent(this.iframeDocument.body, function(el){
				//trace("mousemove");
				var _target = el.target || el.srcElement;
				if (_target.tagName.toLowerCase() == "img") {
					if(_target.name.split("_")[0] != "articleTemplate"){
						editor.templateImageId = _target.id = "image_operate_"+Core.Math.getUniqueId();
						this.imageOperate.show(_target);
					}
				}
				else {
					this.imageOperate.hidden();
				}
			}.bind2(this), "mousemove");
			this.isInitImageOpertae=true;
		}
	},
	/**
	 * 初始化模板图片操作浮层
	 */
	initTemplateImage:function(){
		this.initImageOpertae();
		if (!this.isInitTemplateImage) {
			if(!this.iframeDocument){
				return;
			}
			Core.Events.addEvent(this.iframeDocument.body, function(el){
				//trace("mouseDown");
				var _target = el.target || el.srcElement;
				if (_target.tagName.toLowerCase() == "img") {
					if(!this.imageDrag){
						this.imageDrag=new Editor.Utils.ImageDrag(this);
					}else{
						this.imageDrag.drag(el);
					}
					if (_target.name.split("_")[0] == "articleTemplate"){
						_target.id=_target.name;
					}
					if (_target.id.split("_")[0] == "articleTemplate") {
						editor.templateImageId = _target.id;
			   			el.cancelBubble = true;
  						el.returnValue = false;
						if (!window.templateDialog) 
							window.templateDialog = new Editor.Utils.IframeDialog({
								url: "http://control.blog.sina.com.cn/admin/ria/article_addM_image.php?type=1",
								title: "插入图片",
								width: 660,
								height: 450,
								dialogName:"templateDialog"
							});
						window.templateDialog.show();
					}
				}
			}.bind2(this), "dblclick");
			this.isInitTemplateImage=true;
		}
	},
	/**
	 * 菜单栏简单功能和全部功能之间切换
	 * @param {String} type pro||base 
	 */
	swapTools:function(type){
		if(type=="pro"){
			 this.baseTools.hidden();
			 this.proTools.show();
			 Utils.Cookie.setCookie("EditorToolType", "pro");
			 this.toolType="pro";
		}else{
			 this.proTools.hidden();
			 this.baseTools.show();
			  Utils.Cookie.setCookie("EditorToolType", "base");
			  this.toolType="base";
		}
	},
	/**
	 * 根据类型是按钮可用或不可用
	 * @param {string} item 按钮类型；如:cut
	 * @param {boolean} isTrue 是否设置为不可用 ture:不可用;false：可用
	 */
	disabledToolItem:function(item,isTrue){
		if(!isTrue){
			this.proTools.setButtonState(item,4);
			this.baseTools.setButtonState(item,4);
		}else{
			this.proTools.setButtonState(item,1);
			this.baseTools.setButtonState(item,1);
		}
	},
	/** 
	 * 发表博文前转换博文到input中 
	 */
	setSourceValue:function () {
		if(this.modeType == "edit"){
//			_setEditorMode(true);
//			_formatVideo();

			/*分屏加载时需要给图片加高度
			var imgarr=this.iframeDocument.getElementsByTagName("IMG");
			var imglen=imgarr.length;
			for(var i=0;i<imglen;i++){
				var m=imgarr[i];
				//trace("m.offsetWidth="+m.offsetHeight+"clientWidth="+m.clientHeight);
				//trace(m.height);
				//trace(m.style.width);
				m.height=m.offsetHeight;
				//m.style.Width=m.offsetWidth+"px";
			}
			*/
			
			this.frameToArea();
			this.textarea.value =this.iframeDocument.body.innerHTML.replace(/title="?双击图片可进行替换"?/gi, '');
		}else {
//			_formatVideo();
//			_editorArea.value = _formatCode(_editorDocument.body.innerHTML);
		}
	},
	/**
     * 切换编辑区域大小
     */
    swapHightMode: function(){
        var isHeight = false;
        var right_box = $E("editor_box_right");
        var iClassName = this.iframe.className;
        var tClassName = this.textarea.className;
        var rbClassName = right_box.className;
        
        var icn_array = iClassName.split("_");
        var tcn_array = tClassName.split("_");
        var rbcn_array = rbClassName.split(" ");
        
        var ele = Core.Events.getEventTarget();
        if (icn_array.length > 1 && icn_array[icn_array.length - 1] == "h") {
            isHeight = true;
        }
        if (isHeight) {
            icn_array.pop();
            tcn_array.pop();
            rbcn_array.pop();
            this.iframe.className = icn_array.join("_");
            this.textarea.className = tcn_array.join("_");
            right_box.className = rbcn_array.join(" ");
            ele.innerHTML = "扩大编辑区域 ";
        }
        else {
            this.iframe.className = iClassName + "_h";
            this.textarea.className = tClassName + "_h";
            right_box.className = rbClassName + " EditorBoxRight_h";
            ele.innerHTML = "缩小编辑区域 ";
        }
        if (this.rightMenuShutOut) {
			var ele=$E("editor_box_right")
			this.rightMenuShutOut.setSize(ele.offsetWidth,ele.offsetHeight);
		}
    },
	/** 判断是否有股票 */
	checkStock:function(){
		var value=0;
		if(/stock_image_\d{15,25}/g.test(this.iframeDocument.body.innerHTML)){
			value=1;
		}
		return value;
	},
	/** 判断是否有图片跟Flash */
	getMediaTag : function () {
		var imgs = this.iframeDocument.getElementsByTagName("img");
		var lens = imgs.length;
		var facepath = "http://simg.sinajs.cn/blog/images/face/";
		var d_face="sina.com.cn/myshow/blog/misc/gif/";
		var worldcup = "simg.sinajs.cn/blog7style/images/common/worldcup";
		var sg_trans = "simg.sinajs.cn/blog7style/images/common/sg_trans.gif";		//随图进入 iframe 里面。
		var facepathlen = facepath.length;
		var isIMG = 0;
		var isMedia = 0;
		for(var i = 0; i < lens && isIMG == false; i ++) {
			if((imgs[i].src.indexOf(worldcup)==-1)
			&& (imgs[i].src.indexOf(d_face)==-1)
			&& (imgs[i].src.substr(0, facepathlen) != facepath)
			&& (imgs[i].src != "http://simg.sinajs.cn/blog7style/images/common/editor/insetvideo.gif")
			&& (imgs[i].src.indexOf(sg_trans)==-1)) {
				if(!imgs[i].getAttribute("type") && (imgs[i].getAttribute("type") != "face")){					//iframe 里面的 表情没有 type 属性。所以此处……无效。
					isIMG = 1;
				}
			}
			if(imgs[i].src == "http://simg.sinajs.cn/blog7style/images/common/editor/insetvideo.gif"){
				isMedia = 1;
			}
		}
		
		var objs = this.iframeDocument.getElementsByTagName("object");
		if(objs.length > 0) isMedia = 1;
		
		var objs = this.iframeDocument.getElementsByTagName("embed");
		if(objs.length > 0) isMedia = 1;
		
		
		return [isIMG, isMedia];
	},
	/**
	 * 在关闭或刷新页面时调用系统提示框提示用户是否真的要离开页面
	 */
	closeConfirm:function(){
		if(!this.isCloseConfirm){
			//trace("editor.closeConfirm");
			
			//a标签也会弹出此confirm 且有时return false也失效，跟产品确认先去掉
			//Utils.excBeforeCloseWin("关闭将可能导致内容丢失");
			this.isCloseConfirm=true;
		}
	},
	/**
	 * 初始化编辑器iframe中的内容（覆盖父类方法）
	 * @param {String} sContent body中的html
	 */
    _setEditorHTML:function (sContent){
       var html = "";
         html += "<html>";
         html += "<head>";
         html += '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />';
         
         //          //世界杯添加
         // if(window.location.href.indexOf("article_add_WorldCup.php")>-1 || window.location.href.indexOf("article_edit.php")>-1)
         // 	html += '<link href="http://simg.sinajs.cn/blog7style/css/common/worldcup.css" rel="stylesheet" type="text/css" />';
         
         html += "<style>";
		 html += "p {*margin:0.2em auto;}";
		 html += "body {\
			margin: 0;\
			scrollbar-face-color: #ffffff;\
			scrollbar-highlight-color: #ffffff;\
			scrollbar-shadow-color: #c0c1bb;\
			scrollbar-3dlight-color: #c0c1bb;\
			scrollbar-arrow-color: #c9cbb6;\
			scrollbar-track-color: #f4f5f0;\
			scrollbar-darkshadow-color: #ffffff;\
			scrollbar-base-color: #ffffff;\
			padding: 10px;\
			word-wrap: break-word;\
			overflow: scroll;\
			overflow-x: auto;\
			height: 90%;\
			font-size: 14px;\
		}";
		html += "body, td, textarea, input, br, div, span{";
		html += "	font-family: "+ (scope.$newFontFamily?"'Microsoft YaHei',":"")+"'SimSun', Verdana,Arial, Helvetica, sans-serif;";
		html += "	line-height:1.5;";
		html += "}";

		html +="img{\
			border: 0;\
		}\
		html{\
			height: 100%;\
			cursor: text;\
		}\
		pre{\
			white-space:normal;\
		}\
		ins{\
			width:0px;\
			height:0px;\
			overflow:hidden;\
			position:absolute;\
		}\
		form{margin: 0;}\
		body table{font-size: 14px;}\
		.border{ border:1px dashed #cfcfcf;}\
		</style>";
        html += "</head>";
        html += "<body>";
        html += sContent;
        html += "</body>";
        html += "</html>";
        return html;
	}
};
Core.Class.extend(Editor.BlogEditor.prototype,Editor.AbstractStandard.prototype,true);
