/**
 * 向编辑器插入图片的Job,设置图片在编辑器中的大小、位置等操作
 * @author {FlashSoft}
 * @last changed {xs} 2008-4-6
 * @last wq | wangqiang1@staff 2011-10-26
 */
$import("sina/sina.js");
$registJob("editor_img", function () {
	window.ArticleIMGFuncs = { //文章发表: 插入图片回调接口
		addIMGList: function (aIMGList, sinaIMGList,dialogName,imgParam,selectImgList) {
			var dialogName=dialogName||"imageDialog";
			var imginput = $E("SinaPhotoAlbumList");
			var s_img_input=$E("SinaPhotoAlbumCiteList");
			editor.insertHTML(this.buildHtml(aIMGList, sinaIMGList,imgParam));
			if(imginput){
				imginput.value += (!imginput.value?sinaIMGList:','+sinaIMGList);
			}
			if(s_img_input){
				s_img_input.value += (!s_img_input.value?selectImgList:','+selectImgList);
			}
			window[dialogName].hidden();
		},
		picSizeObj:{},
		buildHtml:function(aIMGList,sinaIMGList,imgPrarm){
			var imgstr = "";
			var linkUrl = "http://album.sina.com.cn/pic/";
			for(var i = 0; i < aIMGList.length; i ++ ) {
				var curPic = aIMGList[i];
				var pId = curPic.substring(curPic.lastIndexOf('/')+1);
				var linkPic = linkUrl + pId;
				var picUrl = aIMGList[i];
				
				/*
				//插入网络图片不加690
				var regStr=/static\d{1,2}\.photo\.sina\.com\.cn/;
				if(regStr.test(picUrl)){
					picUrl=picUrl.replace(/&00[0-9]|$/,"&690");
					linkPic=linkPic.replace(/&00[0-9]|$/,"&690");
				}
				*/
					var w="",h="";
					if(top.isPicFlaReady){
						var picId=pId;
						picId=picId.replace(/&\d{3}$/,"");
						if(top.ArticleIMGFuncs.picSizeObj[picId]&&top.window.ArticleIMGFuncs.picSizeObj[picId].succ==true){
							w=top.window.ArticleIMGFuncs.picSizeObj[picId].w;
							h=top.window.ArticleIMGFuncs.picSizeObj[picId].h;
							var wh=this.checkPicSize(w,h,imgPrarm.size);//修正大小数据
							
							w="width='"+wh.w+"'";
							h="height='"+wh.h+"'";					
					
						}else{
						
							if(top.ArticleIMGFuncs.picSizeObj[picUrl]&&top.ArticleIMGFuncs.picSizeObj[picUrl].succ==true){
								w=top.window.ArticleIMGFuncs.picSizeObj[picUrl].w;
								h=top.window.ArticleIMGFuncs.picSizeObj[picUrl].h;	
								if(w>690){									
									h=Math.round(h/w*690);
									w=690;
									}
								var wh=this.checkPicSize(w,h,imgPrarm.size);//修正大小数据
							
							w="width='"+wh.w+"'";
							h="height='"+wh.h+"'";				
					
							}
						
						}	
						
						
					}
				
				//判断插入的是否为网络图片
				//Modified by W.Qiang , pictures's domain changes to sinaimg.cn, 2011-03-15
				//if(picUrl.indexOf("photo.sina")!=-1){
				if (picUrl.indexOf("photo.sina") != -1 || picUrl.indexOf("sinaimg.cn") != -1) {
					picUrl=this.replaceParam(picUrl);
					picUrl=this.replaceSize(picUrl);
					
					linkPic=this.replaceParam(linkPic);
					linkPic=this.replaceSize(linkPic);
//					if($IE6)
//						//imgstr += "<a href='" + linkPic + "' target='_blank'><img src='" + picUrl + "' onload=\"if(this.clientWidth>500)this.style.width='500px';\"/></a><br/><br/>";
//						imgstr += "<a href='" + linkPic + "' target='_blank'><img src='" + picUrl + "'/></a><br/><br/>";
//					else
						
						
					if(imgPrarm.position){
						switch(imgPrarm.position) {
							case "left":
								imgstr += "<a href='" + linkPic + "' target='_blank'><img src='" + picUrl + "' "+w+" "+h+"/></a><br/><br/>";
								break;
							case "center":
								if($IE){
									imgstr += "<a href='" + linkPic + "' target='_blank'><img src='" + picUrl + "' style='text-align:center;display:block' "+w+" "+h+" /></a><br/><br/>";
								}else{
									imgstr += "<a href='" + linkPic + "' target='_blank'><img src='" + picUrl + "' style='margin: 0pt auto;display:block' "+w+" "+h+"/></a><br/><br/>";
								}
								
								break;
							case "right":
								imgstr += "<a href='" + linkPic + "' target='_blank'><img src='" + picUrl + "' align='right' "+w+" "+h+"/></a><br style='clear:both'/><br/>";
								break;
						}
					}else{
						imgstr += "<a href='" + linkPic + "' target='_blank'><img src='" + picUrl + "' "+w+" "+h+" /></a><br/><br/>";
					}
						//imgstr += "<a href='" + linkPic + "' target='_blank'><img src='" + picUrl + "' style=\"max-width:'500px';\"/></a><br/><br/>";
				}else{	
					if (imgPrarm.position) {
						switch (imgPrarm.position) {
							case "left":
								if($IE){
									imgstr += "<img src='" + picUrl + "' onload=\"if(this.clientWidth>690)this.style.width='690px';\" "+w+" "+h+"/><br/><br/>";
								}
								else{
									imgstr += "<img src='" + picUrl + "' style='max-width:690px;' "+w+" "+h+"/><br/>";
								}
								break;
							case "center":
								if($IE){
									imgstr += "<img src='" + picUrl + "' style='text-align:center;display:block' onload=\"if(this.clientWidth>690)this.style.width='690px';\" "+w+" "+h+"/><br/><br/>";
								}
								else{
									imgstr += "<img src='" + picUrl + "' style='max-width:690px;margin:0pt auto;display:block' "+w+" "+h+"/><br/>";
								}
								break;
							case "right":
								if($IE){
									imgstr += "<img src='" + picUrl + "' onload=\"if(this.clientWidth>690)this.style.width='690px';\" align='right' "+w+" "+h+"/><br style='clear:both'/><br/>";
								}
								else{
									imgstr += "<img src='" + picUrl + "' style='max-width:690px;' align='right' "+w+" "+h+"/><br style='clear:both'/>";
								}
								break;
						}
					}else{
						if($IE){
							imgstr += "<img src='" + picUrl + "' onload=\"if(this.clientWidth>690)this.style.width='690px';\" "+w+" "+h+"/><br/><br/>";
						}
						else{
							imgstr += "<img src='" + picUrl + "' style='max-width:690px;' "+w+" "+h+"/><br/>";
						}
							
					}
						
				}
			}
			if(imgPrarm.size){
				imgstr=this.replaceSize(imgstr,imgPrarm.size);
			}
			return imgstr;
		},
		replaceSize:function(url,size){
			var size = size||"mw690"; //middle
			return url.replace(/(\/)((square)|(middle)|(bmiddle)|(small))(\/)/gi,"/"+size+"/");
		},
		replaceParam:function(url){
			//Modified by W.Qiang , pictures's domain changes to sinaimg.cn, 2011-03-15
			if (/&690$/.test(url)){
                return url; // 图片链接可能返回XXX&690
            }else if (url.indexOf("photo.sina") != -1 || url.indexOf("sinaimg.cn") != -1) {
				url=url.replace(/&00[0-9]|$/, "&690"); 
			}
			return url;
		},
		checkPicSize:function(w,h,size){
				
			var size=size||"mw690"; //middle
			var t={"w":w,"h":h};//w默认为 690
			if(w<=490&&w>=200){
				if(size=="small"){t.w=200;t.h=Math.round(h/w*200);}
			}else if(w>490){
				if(size=="small"){t.w=200;t.h=Math.round(h/w*200);}
				if(size=="bmiddle"){t.w=490;t.h=Math.round(h/w*490);}
			}//else if(w>=690){
				//if(size=="small"){t.w=200;t.h=h/w*200;}
				//if(size=="bmiddle"){t.w=490;t.h/w*490;}			
			//}	
			
			/*parent.trace("大小type----->"+size);	
			parent.trace("w:>"+t.w);
			parent.trace("h:>"+t.h);*/
			return t;
		},
		replaceTemplateImage:function(aIMGList, sinaIMGList,dialogName){
			var dialogName=dialogName||"templateDialog";
			var url=this.replaceParam(aIMGList[0]);
			trace(editor.templateImageId);
			var ele=editor.iframeDocument.getElementById(editor.templateImageId);
			url=this.replaceSize(url,"bmiddle");
			ele.src=url;
			ele.id="";
			//去掉“双击图片可以进行替换”提示
			ele.title="";
			//去掉双击图片弹出图片操作浮层
			ele.removeAttribute("name");
			editor.iframeWindow.focus();
			
			ele.removeAttribute("width");
			ele.removeAttribute("height");
			ele.style.width="";
			ele.style.height="";
			
			//替换图片链接中的pid
			var parentNode=ele.parentNode;
			if(parentNode.nodeName.toLowerCase()=="a"){
				var pidReg=/(\/)([a-f0-9]{8})[a-z0-9]{13}/gi;
				var pid=url.match(pidReg)[0].substr(1);
				parentNode.href=parentNode.href.replace(pidReg,"$1"+pid);
			}
			
			window[dialogName].hidden();
		}
		
	};
});