/**
		 * 冲印篮 删除按钮
		 * @param {Object} id 图片id			
		 */		
		window.delEle=function(id){
			//trace("删除图片"+id);
			var e=$E("del_"+id).parentNode;
			//var a=scope.printPhoto;
			var blankEle=[];
			blankEle=$T($E("chyPicCon"),"li");		
			if(blankEle&&blankEle.length<=9){										
				e.parentNode.removeChild(e);				
				var ele=null;			
				ele=$C("li");	
				ele.className="pic_blank";			
				ele.innerHTML=PicTemplate.blank;
				$E("chyPicCon").appendChild(ele);								
			}else{
				e.parentNode.removeChild(e);
			}			
			delete window.state.chyObj["pic_"+id];
			window.state.picNum--;
			var ee=$E("pic_"+id);
			//ee.className="";
			if(ee){
				$T(ee,"span")[0].className="";
			}			
			window.updateScroll();
			//alert(e.innerHTML)						
		};
				
		
		
		window.addPic=function(id){
			
						
			// 先判断 num 小于8的话 写入 现有节点 否则 构造新的
			//var a=scope.printPhoto;
			//trace("id="+id);
			if(window.state.chyObj["pic_"+id]){
				//trace("图片"+id+"已经添加过了,现在删除");
				delete window.state.chyObj["pic_"+id];
				window.delEle(id);
				return false;
			}
			
			if(window.state.picNum>=scope.cfg.max ){
				//提示 用户 超过一百张了		 您最多选择100张图片		
				winDialog.alert('冲印篮已满，一次最多可选择100张照片，请点击"立即冲印"后再试', {
					        icon:"01"
	/*					funcOk: function(){window.location.reload(); }*/
					    });				
				return false;
			}
			
			//默认 添加节点渲染
			var faCon=$E("chyPicCon");
			var ele=null;var picStr=null;
			
				ele=$C("li");
				var w=0,h=0;
				if(window.state.picCache["pic_"+id]){
					w=window.state.picCache["pic_"+id].w;
					h=window.state.picCache["pic_"+id].h;
				}
				
			if(w==0||h==0){
					//trace("不存在 宽高");//图片 宽高不存在 待会获取	
					if(!window.state.picCache["pic_"+id]){
							scope.noWHArr.push(id);
							scope.whCache["pic_"+id]="asking";
						}				
										
				}
			var smallSize="";//,tipCls="";
				if((w*h)<(800*600)&&(w*h)>0){
					
					smallSize=[	'<span class="indefin_pic_ico" onmouseover="showTip()" onmouseout="hideTip()"></span>'/*,
								'<div class="tip_info" style="display:none" >为保证优质的冲印效果，我们建议您使用的照片尺寸大于800 x 600像素</div>'*/
								].join("");
					//trace("size 太小")
				}
				//trace("w="+w);	trace("w="+h);trace("id="+id);				
				picStr=PicTemplate.del.replace(/@picId@/g,id);
				picStr=picStr.replace("@smallSize@",smallSize);
				picStr=picStr.replace("@picURL@",window.state.picCache["pic_"+id].square_url);
				ele.innerHTML=picStr;
				var blankEle=[];
				blankEle=Core.Dom.byClz(faCon,"li","pic_blank");
			//	trace("blanlEle.length=="+blankEle.length);				
				if(blankEle&&blankEle.length>0){
					//trace("存在空白 节点  渲染	");	
					//alert(blankEle[0].className)					
					faCon.insertBefore(ele, blankEle[0]);
					faCon.removeChild(blankEle[0]);				
				}else{
					//trace("直接 添加节点");	
					faCon.appendChild(ele);	
				}									
				window.state.picNum++;				
				window.updateScroll();
				window.moveScroll();
					trace("here!!!")
				var e=$E("pic_"+id);
				if(e){
					e.className="ok_pic";
					$T(e,"span")[0].className="ok_pic_ico";
				}				
				window.state.chyObj["pic_"+id]=true;
				//if(a.data.picWHObj.length>0){
				////a.getWH(a.data.picWHObj);
				//}
				//changeMoney();
				
		};