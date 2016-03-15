/*
* author : meichun1@staff.sina.com.cn 
* 育儿博客选择模板
* 17:38 2010/8/5
*/
$import("sina/sina.js");
$import("sina/core/array/foreach.js");
$import("msg/regmsg.js");
$import("sina/core/system/br.js");
$import("lib/dialogConfig.js");
$import("msg/baby_msg.js");
$import("lib/interface.js");
$import("sina/utils/cookie/setCookie.js");
$import("lib/jobs.js");
$import("jobs/baby_headPhotoEditor.js");
$import("jobs/baby_photoUpload.js");
$import("sina/core/dom/getElementsByClass.js");

$registJob("baby_style",
function() {
DialogTemplate.alert=$SYSMSG.alert;
var isFlashUploaded=false,
	isBgUploaded=false,
	uploadedURL="",
	flashUploadURL="",
	divPhotoUpload=$E("divPhotoUpload"),
	savedData={},
	uploadData={},
	tpls=["t3_34","t3_35","t3_36","t3_37"],
	uploadError="",
	getParamObj=function(param){
		if(param.indexOf("&")==-1){
			return null;
		}
		
		var arr=param.split("&"),
			paramObj={};
			
		for(var i=0,l=arr.length;i<l;i++){
			if(arr[i].indexOf("=")==-1){
				return null;
			}
			
			var ps=arr[i].split("="),
				k=ps[0],
				v=ps[1];

			paramObj[k]=v;
		}
		
		return paramObj;
	};
		
	$callJob("baby_headPhotoEditor");
	$callJob("baby_photoUpload");
	
	
	//上传完成
	scope.photoUpload.onComplete=function(dataStr){
		isBgUploaded=true;
		uploadError="";
		divPhotoUpload.innerHTML="";
		try{
			eval("uploadData="+dataStr);
		}catch(ex){}
		
		if(!uploadData){
			return;
		}
		uploadedURL=uploadData.url+"?"+(new Date()).getTime();
		pattern.disabled=horizontal.disabled=vertical.disabled=hheight.disabled="";
		changeHeadImage();
	};
	
	//文件类型错误
	scope.photoUpload.onFileTypeError=function(type){
		type && type=="serverError" && ($E("pichead").style.backgroundImage="");
		divPhotoUpload.innerHTML="图片类型错误";
		uploadError="上传的图片类型异常";
	};
	
	//文件大小超出范围
	scope.photoUpload.onMaxSizeError=function(){
		divPhotoUpload.innerHTML="文件大小超出范围";
	};
	
	//接口异常
	scope.photoUpload.onInterfaceError=function(){
		
	};
	
	//页面头图存储图片完成
	scope.photoUpload.onSendCompleted=function(dataStr){
		goNext(dataStr);
	};
	
	//相框头图存储图片完成
	scope.babyHeadPhotoEditor.onSendCompleted=function(dataStr){
		goNext(dataStr);
	};
	
	//相框头图上传完成
	scope.babyHeadPhotoEditor.onUploaded=function(url){
		isFlashUploaded=true;
		uploadError="";
	};
	
	scope.babyHeadPhotoEditor.onFileTypeError=function(){
		uploadError="上传的图片类型异常";
	};
	
	
	
	
	
		var eStyle = $E("blogList"),
		lis = $T(eStyle, "li"),
		radioes = $T(eStyle, "input"),
		imges = $T(eStyle, "img"),
		next = $E('next'),
		setTemp = $E('setimage'),
		flashHead=$E('flashHeadPhotoEditor'),
		hheight=$E('hheight'),
		
		pichead=$E('pichead') || Core.Dom.byClz(document,'div','bigPic_head')[0],
		upl=$E('upl'),
		pattern=$E('pattern'),
		horizontal=$E('horizontal'),
		vertical=$E('vertical'),
		
		bigPicBody= Core.Dom.byClz(document,'div','bigPic_body')[0],
								
		old = 0;
		radioes[0].checked = true;
		
		pichead.style.backgroundImage=bigPicBody.style.backgroundImage="url(http://simg.sinajs.cn/blog7style/images/common/baby/tpl_view/view_l.jpg)";
		
		
		
		/*用户没有上传图片时  这几个选项不可用*/
		pattern.disabled=horizontal.disabled=vertical.disabled=hheight.disabled="disabled";
		
		/*设置头图*/

		//var ratio=1/0.331579||15/4;
		var ratio=0.331579;
		function changeHeadImage(){
			
					if(/\D/.test(hheight.value)||  hheight.value==""){
							hheight.value=hheight.defaultValue;	
					}
					hheight.value = hheight.value > 450 ? 450 : hheight.value < 150 ? 150 : hheight.value;	
					pichead.style.height=(hheight.value*ratio)+"px";
					
					if(parseFloat(pichead.style.height)<50){
						
							pichead.style.height="50px";	
					}
					pichead.style.backgroundImage="url("+uploadedURL+")";
					pichead.style.backgroundRepeat=pattern.value;
					pichead.style.backgroundPosition=horizontal.value+" "+vertical.value;
		}
		
	//	uploadedURL="http://tp3.sinaimg.cn/1770438374/50/1279906558";
		
	//	upl.onclick=changeHeadImage;
		
		pattern.onchange=horizontal.onchange=vertical.onchange=hheight.onchange=changeHeadImage;
		
		
		
		/*提交数据*/
		
		function postDate(headPhotoParams){
			headPhotoParams=headPhotoParams || {};
			new Interface("http://control.blog.sina.com.cn/riaapi/reg/init_blog_module.php", "ajax").request({
							POST: {
									"image_url": uploadedURL,
									"pattern": $E('pattern').value,
									"horizontal": $E('horizontal').value,
									"vertical": $E('vertical').value,
									"hheight": hheight.value,
									"module_checked":old,
									"module":scope.$module,
									"uid":scope.$uid,
									"src":scope.$src,
									"photoX":headPhotoParams.photoX || 0,
									"photoY":headPhotoParams.photoY || 0,
									"photoURL":flashUploadURL,
									"angle":headPhotoParams.angle || 0,
									"zoom":headPhotoParams.zoom || 1
							},
							onSuccess: function(res) {
									//Utils.Cookie.setCookie("remberloginname", escape(scope.$loginname), 2400, "/", ".blog.sina.com.cn");
									window.location.href="http://control.blog.sina.com.cn/reg/reg_blog_attention.php?src="+scope.$src+"&version=7";
							},
							onError: function(res) {
									winDialog.alert($SYSMSG[res.code], {
											funcOk: function() {
													if (res.code == "A00113") {
															window.location.href = "http://blog.sina.com.cn/u/"+scope.$uid;
													}
											}
									});
							}
			});
	     }
		
		
		/*点击相应模板*/
		Core.Array.foreach([radioes, imges],
		function(elems) {
				Core.Array.foreach(elems,
				function(elem, i) {
						elem.onclick = function() {
								
								divPhotoUpload.innerHTML="";
								
								var setImage= i > 3;
								if (this.nodeName == "IMG") {
										this.parentNode.blur();	
										
										if($IE){
											    /*提案：ie BUG  http://issue.internal.sina.com.cn/browse/BLOGBUG-9174*/
												event.returnValue = false;	
												event.cancelBubble = true;
										}
								}
								var picUrl;
								if(setImage){
									
										bigPicBody.style.backgroundPosition=-314*(i-4)+"px -70px";
										if(!uploadedURL){
												pichead.style.backgroundPosition=-314*(i-4)+"px 0px";
										}
										
								}
								lis[old].className = "";
								lis[i].className = "current";
								radioes[i].checked = true;
								setTemp.style.display = setImage ? "": "none";
								flashHead.style.display=setImage?"none":"";
								
								scope.babyHeadPhotoEditor.setMessage("");
								!setImage && scope.babyHeadPhotoEditor.updateRender(tpls[i]);
								
								
								
								old = i;
						};
				});
		});
		
		/*头部高度 输入限制*/
		var number = function(evt) {
				evt = evt || event;
				var elem = evt.srcElement || evt.target,
				value = elem.value;
				
				if (/\D/.test(value.slice(-1))) {
						//elem.value = value.slice(0, -1);
						elem.value = value.replace(/\D/g,'');
				}
				
		};

		
		if ($IE || $SAFARI) {
				Core.Events.addEvent(hheight, number, "keyup");
				Core.Events.addEvent(hheight, number, "keypress");
		}
		else{
				Core.Events.addEvent(hheight, number, 'input');	
		}
		
		/*头部高度 输入限制数字
		function digitLimit(evt){
			evt=evt||event;
			var code = evt.keyCode;
				if ((code < 96 || code > 105) && (code < 48 || code > 57) && (code != 8) && (code != 39) && (code != 37) && (code != 46) ) {
						if (evt.preventDefault) {
								evt.preventDefault();
						}
						evt.returnValue = false;
				}
		}
		
		hheight.onkeydown=digitLimit;*/
		
		
		
		/*限制只能输入 150-450*/
		var auto;
		
		hheight.onblur=function(){
					
				if(/\D/.test(this.value)||this.value==""){
						this.value =this.defaultValue;
						changeHeadImage();
						auto=null;
						return;
				}
				this.value = this.value > 450 ? 450 : this.value < 150 ? 150 : this.value;	
				auto=true;
		};
		
		hheight.onfocus=function(){
			if(!auto){
				this.value='';	
			}
		};
		

		
		/*提交数据*/
		next.onclick = function() {
			if(uploadError){
				winDialog.alert(uploadError);
				return;
			}
			
			if (old > 3) {
				
				//存储页面头图图片
				if (isBgUploaded) {
					scope.photoUpload.saveToPhotoServer();
				}else{
					flashUploadURL="";
					uploadedURL="default";
					postDate();
				}
				
			}else {
				
				//存储相框头图图片
				if (isFlashUploaded) {
					scope.babyHeadPhotoEditor.saveToPhotoServer();
				}else{
					flashUploadURL="";
					uploadedURL="";
					postDate(getParamObj(scope.babyHeadPhotoEditor.getSaveParams()));
				}
				
			}
			
			return false;
			
		};
		
		//开始跳转到下一步
		function goNext(dataStr){
			var savedData,
					code;
				try{
					eval("savedData="+dataStr);
					flashUploadURL=savedData.data.pics.pic_1.pid;
					uploadedURL=savedData.data.pics.pic_1.pid;
					code=savedData.code;
				}catch(ex){}
				
				//图片保存成功
				if(code=="A00006"){
					if (old > 3) {
							flashUploadURL="";
							postDate();
					} else {
							uploadedURL="";
							postDate(getParamObj(scope.babyHeadPhotoEditor.getSaveParams()));
					}
				}else{
					
					//图片保存失败
					switch(savedData.data.pics.pic_1.ret){
						case -11:	
								winDialog.alert("图片格式异常，请重新上传");
								break;
						default:
								winDialog.alert("图片存储服务暂不可用!");								
					}
					
					
				}
				return false;
		}
		
		
});
