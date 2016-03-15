/**
 * @fileoverview 影视博客 影评发表页面 初始化
 * @author wujian|wujian@staff.sina.com.cn
 * @created 2010-11-17
 * @example
 * url : ?id=123456&fname=盗梦空间&type=1
 * id:查找键值
 * fname：影视名称
 * type：movie为电影 |tv为连续剧
 */
$import("sina/sina.js");
$import("sina/core/system/getParam.js");
$import("lib/dialogConfig.js");
$import("lib/interface.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/expand.js");
$import("sina/core/string/collapse.js");
$import("sina/core/events/addEvent.js");

$registJob("editor_pageInit", function(){
	//修复韩文乱码问题  就是直接显示韩文的编码 不显示文字 是因为 php将&转成了&amp;
	var div=$C("div");
	var textArea=$E("blog_body");
	var s=textArea.value;
	
	s=s.replace(/&nbsp;/gi," ");
	//因为没有换行符了，都为<br />标签了
	s=s.replace(/\r?\n/gi,"");
	//处理<br />标签 
	s = s.replace(/<br\s*\/?>/g,"{#sina_text_n_tag}"); 
	
	div.innerHTML=s;
	s=div.innerHTML;
	//增加对< >的支持，因为提交时候修改了
	s = s.replace(/&lt;/gi,"<").replace(/&gt;/gi, ">");
	//s=s.replace(/<BR >/gi,"\n");
	//if($IE){
		//s=s.replace(/<br>/gi,"");
	//}else{
		s=s.replace(/<br\s*\/?>/gi,"");
	//}
	s=s.replace(/{#sina_text_n_tag}/gi,"\n");	
	//s=s.replace(/<br \/>/gi,"\r");
	textArea.value=s;
	div=null;	
	//焦点事件 执行
	var focusFun=function(){
		//alert(1)
		textArea.style.cssText="";
		textArea.value="";
		Core.Events.removeEvent(textArea,focusFun,"focus");
	}
	
		
	var blog_id=Core.System.getParam("blog_id");//有blog_id 说明是 编辑影评
	
	if(!blog_id){//绑定focus 事件 执行一次
		Core.Events.addEvent(textArea,focusFun,"focus");
	}
	
	var filmId=Core.System.getParam("film_id")||scope.$film_id;
	filmId = encodeURIComponent(filmId);
	var filmType=Core.System.getParam("type")||scope.$type||"movie";
	scope.filmType=filmType;
	
	if(!filmId){
		//id 都没有 干嘛呀 提示出错
		winDialog.alert('出错啦,没有传入影视信息。', {
					    	    icon:"01",
								funcOk: function(){ }
					    	});	
		return false;
	}	
	/**
	 * 接口回调 渲染函数
	 * @param {Object} data
	 */
	scope.getFilmInfo=function(data){
		if(data&&data.result&&data.result.status){
			if(data.result.status.code=="0"){
				var filmData=data.result.data;
				scope.filmData=filmData;//保存到scope 备用
				//修复海报数据
				if(filmData.picture==""){//nnd 明明详情页有图片 就是没海报。
					filmData.picture="http://simg.sinajs.cn/blog7style/images/center/movies/img_200_266.png"
				}
				//设置海报
				if(filmData.picture&&filmData.picture.toString().indexOf("http:")>-1){
					$E("filmImg").src=filmData.picture;
				}else{
					filmData.picture=$E("filmImg").src="http://cache.mars.sina.com.cn/nd/dataent"+filmData.picture;					
				}
				
				//修复名称 带《》
				var strLen=filmData.title.length;
				if(filmData.title.substr(0,1)=="《"&&filmData.title.substr(strLen-1)=="》"){
					trace("影视名称中带括号了！");
					filmData.title=filmData.title.substr(1,strLen-2);
				}
				//alert(filmData.title.substr(strLen-1))
				//电影名称
				$E("filmName").innerHTML=filmData.title;
				scope.filmName=filmData.title;
				function checkStrLen(str, max){
           			 //str="test";
           			 //alert(str)
           			 var temp = Core.String.expand(str);
           			 if (temp.length > max) {
           			     temp = temp.substr(0, max);
           			 }
           			 temp = Core.String.collapse(temp);
           			 return temp;
      			  }
				articleEditorCFG.dftTagValue = '影评 '+checkStrLen(filmData.title,14);
				
				$E("articleTagInput").value=articleEditorCFG.dftTagValue;
				window.currentTag=articleEditorCFG.dftTagValue;
				
				var input=$E("articleTitle");
				if(!blog_id){
					//电影评论标题
					var type=(filmType=="movie")?"电影":"连续剧";
					$E("editorTitle").innerHTML="评论"+type+"《"+filmData.title+"》";
					
					//input.value="影评《"+filmData.title+"》";
				}
				
				
				//绑定全部选中事件
				Core.Events.addEvent(input,function(){
					input.select();
				},"focus")
				
				//电影详情页面地址				
				var url="http://data.ent.sina.com.cn/"+filmType+"/"+filmId+".html";
				$E("filmImgA").href=$E("filmName").href=url
				//英文名称
				$E("engName").innerHTML=filmData.entitle;
				//其他名称
				$E("moreName").innerHTML=filmData.moreentitle||"暂无";
				//导演
				var maxNum=40;
				var director=Core.String.expand(filmData.directorcontent)//;
				var more='…<a href="'+url+'" target="_blank">[更多]</a>'
				if(director.length>maxNum){					
					director=Core.String.collapse(director.substr(0,maxNum))+more;
				}else{
					director=Core.String.collapse(director);
				}
				$E("director").innerHTML=director;
				//演员
				var actor=Core.String.expand(filmData.actorcontent);
				if(actor.length>maxNum){
					actor=Core.String.collapse(actor.substr(0,maxNum))+more;
				}else{
					actor=Core.String.collapse(actor);
				}
				$E("mainActor").innerHTML=actor;
				//电影类型 冒险 爱情等
				$E("filmType").innerHTML=filmData["class"];
				//地区
				$E("region").innerHTML=filmData["area"];
				//国家
				$E("country").innerHTML=filmData["nationality"];
				
				//时长
				$E("filmTime").innerHTML=filmData["length"]==""?"暂无":filmData["length"]+"分钟";
				//上映日期
				$E("filmDate").innerHTML=filmData["premiere"];
				//连续剧 特殊处理
				if(filmType=="tv"){
					$E("filmTime").parentNode.style.display="none";
					$E("filmDate").parentNode.firstChild.innerHTML="出品年份：";
				}
				//官网地址
				var site=filmData["official"];
				//alert(site)
				if(site.length>0){
					var reg=/http:\/\//gi;
					if(!reg.test(site)){
						site="http://"+site;
					};				
					$E("filmSite").href=site;
					maxNum=18;
					
					//if(site.length>=maxNum){
						//site=site.substr(0,maxNum)+"  "+site.substr(maxNum,site.length-1);
					//}
					//看是21的多少倍
					var r=site.length/maxNum,siteLength=site.length,out="";
					for (var i=1; i<=r; i++) {
						if(maxNum*(i+1)>siteLength-1){
							var sMax=siteLength-1;
						}else{
							var sMax=maxNum*(i+1);
						}
						out=out+site.substr(maxNum*(i-1),maxNum*i)+"  "+site.substr(maxNum*i,sMax);
						
					};
					$E("filmSite").innerHTML=out;
				}else{
					$E("filmSite").parentNode.innerHTML="暂无";
				}
				
				//渲染 推荐指数
				/*var rate=filmData["rating"];
				var valueEm=$T($E("filmValue"),"img")
				for (var i=0; i<rate; i++) {
					valueEm[i].className="SG_icon SG_icon80";
				};	*/			
			}else{//错误提示
				winDialog.alert(data.result.status.msg||"数据接口出错。", {
					    	    icon:"01",
								funcOk: function(){ }
					    	});
			}
		}
	}
	
	/**
	 * 调用接口 
	 * @param {Object} url
	 * @param {Object} cfg
	 */
	function callInterFace(url,cfg){
		//cfg		
		var param="";
		for (var key in cfg) {			
			param=param+key+"="+cfg[key]+"&";
		};
		if(param.length>0){
			param=param.substr(0,param.length-1);			
			url=url+"?"+param;
		}
		
		var js = $C("script");			
		js.src = url;//alert(url)
		js.charset = "utf-8";
		js.onload = js.onerror = js.onreadystatechange = function () {
			if (js && js.readyState && js.readyState != "loaded" && js.readyState != "complete") {
				return;
			}			
			//清理script标记
			js.onload = js.onreadystatechange = js.onerror = null;
			js.src = "";
			js.parentNode.removeChild(js);
			js = null; 
		};
		document.getElementsByTagName("head")[0].appendChild(js);
	}
	
	//发出调用请求  。&withintro=none
	callInterFace("http://data.ent.sina.com.cn/interface/movieapi.php",{
						auth_type:"uuid",
						auth_value:"4c4a98cd-0d6c-478c-8873-14449fde689a",
						type:filmType,
						id:filmId,
						callback:"scope.getFilmInfo",
						withintro:"none"				
					});		
		
});
