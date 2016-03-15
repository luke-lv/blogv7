/**
 * 左侧专辑点击 响应函数
 * @param {Object} albumId
 * @param {Object} page
 */
$import("lib/dialogConfig.js");
$import("sina/core/system/getParam.js");
$import("printPhoto/template.js");
window.showAlbumPic=function(albumId,page){
			//先根据 id 调用接口数据 然后 根据数据渲染 图片
			//trace("a.data.urlAlbumId+"+a.data.urlAlbumId);
	var faCon=$E("albumPicCon");
	faCon.innerHTML="正在加载数据，请稍后……";
	window.showPage(0,0);
	$E("selectAll").className="prite_noclick";
	if(!$E("none_album")){
		var none_album=$C("div");
		none_album.id="none_album";					
		none_album.innerHTML="<div>您当前的专辑中没有照片</div>";
					
		faCon.parentNode.appendChild(none_album);					
	}	
	$E("none_album").style.cssText="display:none";
			
	//if(!a.data.urlAlbumId){	
				//trace("here 11");
		try {
			window.focusThis();
		} 
		catch (e) {
		}				
				//trace("here 22");
	//}
			window.state.jsLoad="on";
			//渲染 节点 开始
			//trace("showAlbumPic=="+albumId)
			page=page||1;
			window.state.currPage=page;
			albumId=albumId||1658965305;
			window.state.albumId=albumId;
			
			if(scope.album["album_"+albumId]&&scope.album["album_"+albumId]["page_"+page]){
				//查看是否 有缓存的数据
				trace("调用旧数据"+albumId+"  "+page);				
				window.getAlbumPicOk(scope.album["album_"+albumId]["page_"+page]);					
			}else{
				//trace("调用新数据"+a.data.albumId+"  "+page);				
				scope.listData.request(
				{
					GET : {
						uid:scope.$uid,
						ctg_id:albumId,
						p:page				
					},
				onSuccess : function (data) {				
					//alert(data.code);
					window.getAlbumPicOk(data);		
					},
				onError : function (data) {	
						if(data.code=="A00004"){
							winDialog.alert('系统繁忙，请稍后再试', {
					    	    icon:"01"
	/*							funcOk: function(){window.location.reload(); }*/
					    	});	
							return ;
						}			
						//提示用户登录	
						//if (!a.data.loginWin) {
						//		a.data.loginWin=new Lib.Login.Ui();
						//	}
						//	a.data.loginWin.login();			
						
						//a.data.loginWin=null;
					},
				onFail : function (){					
					}					
					
				});
			}			
		};
		/**
		 * 调用专辑数据 ok回调
		 * @param {Object} data
		 */
		window.getAlbumPicOk=function(data){
			if(window.state.jsLoad=="off"){
				return;
			}else{
				window.state.jsLoad="off";
			}
			var faCon=$E("albumPicCon");
			$E("selectAll").className="";
			if(!$E("none_album")){
					var none_album=$C("div");
					none_album.id="none_album";					
					none_album.innerHTML="<div>您当前的专辑没有图片</div>";
					
					faCon.parentNode.appendChild(none_album);
					
				}	
				
			$E("none_album").style.cssText="display:none";
			
			var picArr=data["picArr"];//trace("picArr="+picArr);
			var pageAll=Math.ceil(data["pic_cnt"]/21);
			
			if(data["pic_cnt"]==0||picArr.length==0){				
				faCon.innerHTML="";							
				$E("none_album").style.cssText="display:block";
				window.showPage(0,0);
				
				//选择全部按钮 置灰
				$E("selectAll").className="prite_noclick";
					
				//if(a.data.urlAlbumId&&!Core.System.getParam("pic_id")){	
				////a.selectAll();
				//	a.data.urlAlbumId=null;
				////trace("select select select");				
				//}
			
			//if(a.data.urlPicId){
				////window.addPic(a.data.urlPicId);				
				//a.data.urlPicId=null;
				////trace(" picid pic id");
			//}
				return false;
			}
			//trace("共"+pageAll+"页数据");//trace("pageAll="+pageAll);
			//var pageNow=data["pageCurr"];//trace("pageNow="+pageNow);
			var pageNow=window.state.currPage;
			window.showPage(pageNow,pageAll);
			
			faCon.innerHTML="";
			var ele=null;var picStr=null;
			var clsName="";var ico="";
			var picId="";var w=100,h=100;var smallSize="";id="";
			for(var i=0,len=picArr.length;i<len;i++){
				ele=$C("li");
				//clsName="indefin_pic";//ok_pic
				clsName="ok_pic";//ok_pic
				ico="";
				w=picArr[i]["w"];
				h=picArr[i]["h"];
				smallSize="";
				tipCls="tip_info";
				id=picArr[i].pic_id;
				if(w==0||h==0){
					//图片 宽高不存在 待会获取
					//trace("a.data.picObj['pic_'+id].w"+a.data.picObj["pic_"+id].w);
					if(window.state.picCache["pic_"+id]&&(window.state.picCache["pic_"+id].w*window.state.picCache["pic_"+id].h)>0){
						w=window.state.picCache["pic_"+id].w;
						h=window.state.picCache["pic_"+id].h;						
					}else{						
						//trace("缺少宽高数据："+id);
						if(!window.state.picCache["pic_"+id]){
							scope.noWHArr.push(picArr[i].pic_id);
							scope.whCache["pic_"+id]="asking";
						}
						
					}					
				}
				if((w*h)<(800*600)&&(w*h)>0){
					smallSize=[	'<span class="indefin_pic_ico" onmouseover="showTip()" onmouseout="hideTip()"></span>'/*,
								'<div class="@tipCls@" style="display:none" >为保证优质的冲印效果，我们建议您使用的照片尺寸大于800 x 600像素</div>'*/
								].join("");
					//trace("size 太小")
				}
				if((i+1)%7==0){
					tipCls="tip_info info_right";
				}
				picId="pic_"+picArr[i].pic_id;
				if(window.state.picNum){
					//trace("冲印篮 已经存在图片");
					if (window.state.chyObj["pic_"+id]) {
						//trace("已经存在" + picArr[i].id + "图片");
						//alert(scope.printPhoto.data.chyObj[picId+""]);
						clsName = "ok_pic";
						ico = "ok_pic_ico";
					}
				}
				//trace("chyObj="+picId);			
				//trace("picArr[i].id"+picArr[i].id);	
				picStr=PicTemplate.normal.replace("@smallSize@",smallSize);
				picStr=picStr.replace("@picName@",picArr[i].name);
				picStr=picStr.replace("@clsName@",clsName);
				picStr=picStr.replace("@ico@",ico);
				picStr=picStr.replace(/@picId@/g,picArr[i].pic_id);
				picStr=picStr.replace("@tipCls@",tipCls);
				picStr=picStr.replace("@picURL@",picArr[i].square_url);
				ele.innerHTML=picStr;
				//if(!Core.System.getParam("pic_id")){
					faCon.appendChild(ele);
				//}
				if(window.state.picCache["pic_"+id]){					
					window.state.picCache["pic_"+id]=picArr[i];
					window.state.picCache["pic_"+id].w=w;
					window.state.picCache["pic_"+id].h=h;					
				}else{
					window.state.picCache["pic_"+id]=picArr[i];
				}					
				//trace("url="+a.data.picObj["pic_"+picId].middle)				
			}
			//trace("a.data.albumId="+a.data.albumId)
			//trace("a.data.currPage="+a.data.currPage)
			if(!scope.album["album_"+window.state.albumId]){
				scope.album["album_"+window.state.albumId]={};
			}
			scope.album["album_"+window.state.albumId]["page_"+window.state.currPage]=data;
			trace("tt="+window.state.currPage)
			//trace("a.data.albumId="+a.data.albumId)
			//trace("a.data.currPage="+a.data.currPage)
			//trace(""+)
			//a.data.album[a.data.albumId]["allPage"]=pageAll;
			//a.data.urlAlbumId=Core.System.getParam("ctg_id");
			//a.data.urlPicId=Core.System.getParam("pic_id");			
			//if(Core.System.getParam("ctg_id")&&!Core.System.getParam("pic_id")){	
			//alert(Core.System.getParam("pic_id")==null)
			//var ctg_id=Core.System.getParam("ctg_id"),
			//	pic_id=Core.System.getParam("pic_id");
				
			//alert(pic_id)
			if(ctg_id&&!pic_id&&!re){	//只有 专辑id
				trace("---选择全部了----")
				window.selectAll();
				ctg_id=null;
				//a.data.urlAlbumId=null;
				//trace("select select select");
				}
			//alert(window.state.picCache["pic_"+pic_id])
			if(pic_id&&pic_id!="loadok"&&!window.state.chyObj["pic_"+pic_id]&&!re){
				window.addPic(pic_id);
				pic_id="loadok";				
				//a.data.urlPicId=null;
				//trace(" picid pic id");
			}
			
			if(scope.noWHArr.length>0){
				trace("准备调用第二个接口 取得宽高数据");
				setTimeout(function(){
					window.getWH(scope.noWHArr);
					},10);
			}
		};