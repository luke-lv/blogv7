/**
 * @fileoverview 相册冲印 存储数据
 * @author wujian|wujian@staff.sina.com.cn
 * 
 */
$import("lib/LocalDB.js");
$import("lib/dialogConfig.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/dom/getElementsByClass.js");


scope.listData=new Interface("http://photo.blog.sina.com.cn/services/ctg_photo_list_by_page.php","jsload");
		scope.picWHData=new Interface("http://photo.blog.sina.com.cn/services/photo_xy.php","jsload");
		//d 为备用
		//var d=new Interface("http://photo.blog.sina.com.cn/services/ctg_photo_list_by_page.php","jsload");
		//var b=new Interface("http://blog.sina.com.cn/interface.php","jsload");
		//var c=new Interface("http://blog.sina.com.cn/interface2.php","jsload");
		//scope.printPhoto={};
		//var a=scope.printPhoto;
		 scope.cfg={
			max:100,// 最多选择的图片数量
			repeat:3//宽高接口调用失败 尝试次数
		};
		scope.album={};//专辑数据 id 为索引
			
		scope.whCache={};// 图片宽高数据 图片id 为索引
		scope.noWHArr=[];
		window.state={
				currentAlbum:null,
				picNum:0,
				picCache:{},
				chyObj:{}
				
		}// 运行数据
		window.updateScroll=function(){
			var faCon=$E("chyPicCon").parentNode;
			//faCon.style.cssText="width: "+(a.data.picNum+1) * 94+"px;";	
			faCon.style.cssText="width: "+($E("chyPicCon").childNodes.length) * 94+"px;";			
			countPay();
		};
		window.moveScroll=function(){
			var faCon=$E("chyPicCon").parentNode;
			var len=$E("chyPicCon").childNodes.length;
			//if(len>){
				$E("chyPicCon").parentNode.parentNode.scrollLeft=(len-9) * 94;				
			//}
		};					
		
		window.countPay=function(){
			$E("picNum").innerHTML=window.state.picNum;
			if(window.state.picNum===0){
				$E("picMoney").innerHTML="0.00";
				$E("clearAll").className="del_ico prite_noclick";
			}else{
				$E("clearAll").className="del_ico";
				var s=(window.state.picNum*35/100).toString();
				var num=s.split(".");
				var len=0;
				if(num[1]){
					len=num[1].length;
					if(len==1){
						$E("picMoney").innerHTML=s+"0";
					}else{
						$E("picMoney").innerHTML=s;
					}
				}else{
					$E("picMoney").innerHTML=s+".00";
				}				
			}					
		};		

//flash 部分,开发时托盘没有统一，相册不含localDB，上线时，托盘已经统一，此处为避免大幅修改，将此部分调用localDB
window.DB = {  	
    set: function(key, data){ 	       
        return Lib.LocalDB.set(key,data);       
    },
    get: function(key, escapeMsecond){       
        return Lib.LocalDB.get(key,escapeMsecond);       
    }
};



DB.setFlashCookie=function(data){
	if(DB.isFlashReady){
		DB.set("printPhoto"+scope.$uid,data);
	}else{
		setTimeout(function(){
			//再试一次
			DB.set("printPhoto"+scope.$uid,data);
		},3000);
	}			
};

DB.confirmRecovery=function(){
	var faCon=$E("chyPicCon");
	var childLen=faCon.childNodes.length;
	var blankLen=Core.Dom.byClz(faCon,"li","pic_blank").length;
			//trace("childLen=="+childLen);
			//trace("blankLen=="+blankLen);
	if(childLen-blankLen>0){
		winDialog.confirm("需要清空现有冲印篮内的照片，才能导入上次提交冲印的照片", {
		    icon:"04",
			funcOk: function(){
							//Core.Events.removeEvent("recoverNode",a.confirmRecovery,"click")
							//var b=a;
				setTimeout(function(){
					window.clearAll();
		      		DB.recover(DB.get("printPhoto"+scope.$uid,3600*24*30*1000));
				},10);							
		  }
		});
		return false;
	}else{trace("recover");
		window.clearAll();
		setTimeout(function(){
			DB.recover(DB.get("printPhoto" + scope.$uid, 3600 * 24 * 30 * 1000));
		},10);
	}			
};
DB.getFlashCookie=function(){	
	setTimeout(function(){	
	var re=DB.get("printPhoto"+scope.$uid,3600*24*30*1000);		
	
	if(re){		trace("ppppppppppppppp")		
		Core.Events.addEvent("recoverNode",DB.confirmRecovery,"click");
		$E("recoverNode").className="";//去处置灰状态
		if(Core.System.getParam("re")=="recover"){
				//后端session 返回 立即 恢复 flash cookie
				//trace("re=="+Core.System.getParam("re"));
			DB.confirmRecovery();
			winDialog.alert('我们为您保存了上一次送冲的照片，请点击“立即冲印”完成后面的步骤', {
				icon: "01",
				funcOk: function(){					
						}
			});
		}
	}
	},10)
};	
DB.recover=function(data){//alert(123)
	var id="";
	
			/*for(var i in data){
				id=i.split("_")[1];
				a.data.picObj["pic_"+id]=data[i];
				window.addPic(id);
				//trace("recover all=="+data[i].square_url);
			}*/
	for(var i=0,len=data.length;i<len;i++){
				
		id=data[i].pic_id;
		trace("id======"+data[i].pic_id);
		window.state.picCache["pic_"+id]=data[i];
		//setTimeout(function(){
			window.addPic(id);
		//},1000)
	}
			//trace("recover all")
};	