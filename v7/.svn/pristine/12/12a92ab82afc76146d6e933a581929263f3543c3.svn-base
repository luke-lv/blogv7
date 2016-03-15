/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 图片上传
 */
$import("sina/core/class/create.js");
$import("sina/core/function/bind3.js");
$import("sina/ui/template.js");
$import("sina/core/math/getUniqueId.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/array/without.js");
$import("sina/core/array/up.js");
$import("sina/core/array/down.js");
$import("editor/tools/uploadimage/drag.js");
$import("sina/core/array/insert.js");
$import("sina/core/array/without.js");

var ImageList = Core.Class.create();

ImageList.prototype = {
	ITEM_ID:"image_list_",
	CONTAINER_ID:"img_list",
	IMG_ID:"item_img_",
	TIP_ID:"image_list_tip_",
	DEL_ID:"item_del_",
	drags:{},
	containerId:"",
	eleList:[],
	eleMax:20,
	at:0,
	delCallbacks:[],
    initialize: function(containerId, max, operateCallback){
		this.containerId=containerId;
		this.operateCallback=operateCallback||function(){};
		if(max){
			this.eleMax=max;
		}
		this.initElement();
	},
	initElement:function(){
		var innerHtml="";
		for(var i=0;i<this.eleMax;i++){
			var obj={};
			obj.id=Core.Math.getUniqueId();
			this.eleList.push(obj);
			innerHtml+=this.createNodes(obj.id);
		}
		$E(this.containerId).innerHTML=innerHtml;
	},
	add:function(imageUrl, type){
		var type=type||"";
		//上传中禁止添加图片
		if(type != "upload"){
			if(window.loadingList.checkIsWoking()){
				return false;
			}
		}
		
		if(this.at<this.eleMax){
			this.eleList[this.at].value=imageUrl;
			this.eleList[this.at].type=type;

			var itemEle=$E(this.ITEM_ID+this.eleList[this.at].id);
			var imgEle=$E(this.IMG_ID+this.eleList[this.at].id);
			itemEle.isadd="yes";
			itemEle.setAttribute("isadd","yes");
            //console.log(imageUrl);
			imgEle.src=imageUrl;
			
			this.getImageSize(this.at);
			
			this.drags[this.eleList[this.at].id]=new ImageDrag(itemEle);
			this.showDelEle(this.eleList[this.at].id);
		
			this.swapStatus();
			this.operateCallback(this.at+1,"add");
			return this.eleList[this.at++].id;
		}
		return false;
	},
	showDelEle:function(id){
		$E(this.DEL_ID+id).style.display="";
	},
	getIdByIndex:function(index){
		 return this.eleList[index].id;
	},
	addToEditor:function(){
		
	},
	remove:function(type,value){
        //console.log("[ImageList->remove] type:"+type +"  value:"+value);
		var delId, isAt=false, 
            array = this.eleList, 
            len   = this.eleList.length, 
            clen  = this.delCallbacks.length;
		for(var i=0; i<len; i++){
			if(type=="id"){
				if(this.eleList[i].id==value){
					isAt=true;
				}
			}else{
				if(this.eleList[i].value==value){
					isAt=true;
				}
			}
			if(isAt==true){
				delId=this.eleList[i].id;
                
				//执行回调函数
				for(var j=0;j<clen;j++){
                    //console.log("[ImageList->remove] removeNodeId:"+this.ITEM_ID+delId);
					this.delCallbacks[j](delId,this.eleList[i].value);
				}
				this.eleList=Core.Array.without(this.eleList,i);
                //console.log("[ImageList->remove] after delCallbacks")
                //console.dir(this.eleList);
				break;
			}
		}
		
		if (!isAt) {
			return ;
		}
		//console.log("[ImageList->remove] removeNodeId:"+this.ITEM_ID+delId);
        var itemEle = $E(this.ITEM_ID+delId),
            isAdded = itemEle.getAttribute("isadd");
        if ("yes" === isAdded && this.at > 0){
            this.at--;
        }
		Core.Dom.removeNode(itemEle);
		var newid=Core.Math.getUniqueId();
		Core.Dom.addHTML($E(this.CONTAINER_ID),this.createNodes(newid));
		this.eleList.push({
			id: newid
		});
        
		this.swapStatus();
		this.operateCallback(this.at,"remove");
	},
	addDelCallback:function(callback){
		this.delCallbacks.push(callback);
	},
	getList:function(){
		return this.eleList;
	},
	checkValue:function(value){
		for(var i=0;i<this.at;i++){
			if(this.eleList[i].value==value){
				return this.eleList[i].id;
			}
		}
		return false;
		
	},
	swapNode:function(id,type){
		var len=this.eleList.length;
		for(var i=0;i<this.at;i++){
			if(this.eleList[i].id==id){
				if(type=="left"){
					var up_node=$E(this.ITEM_ID+this.eleList[i-1].id);
					$E(this.ITEM_ID+id).id=up_node.id;
					up_node.id=this.ITEM_ID+id;
					
					var obj_bak=this.eleList[i];
					this.eleList[i]=this.eleList[i-1];
					this.eleList[i-1]=obj_bak;
					
					Core.Array.up(this.eleList,i,1);
				}else{
					var next_node=$E(this.ITEM_ID+this.eleList[i+1].id);
					$E(this.ITEM_ID+id).id=next_node.id;
					next_node.id=this.ITEM_ID+id;
					
					var obj_bak=this.eleList[i];
					this.eleList[i]=this.eleList[i+1];
					this.eleList[i+1]=obj_bak;
					
					Core.Array.down(this.eleList,i,1);
				}
				break;
			}
		}
		this.createAllNodes();
	},
	/**
	 * 移动节点
	 * @param {Element} itemEle 将第二个参数（节点）插入到这个节点之前
	 * @param {Element} moveEleId 被移动的节点
	 */
	inserBefore:function(itemEle,moveEle){
		//var moveEle=$E(this.ITEM_ID+moveEleId);
		//Core.Dom.removeNode(moveEle);
		itemEle.parentNode.insertBefore(moveEle,itemEle);
		moveEle.style.position="";
		//解决ie下拖拽排序后鼠标已不在拖拽元素上  拖拽元素依然保持a:hover状态
		if(document.all){
			moveEle.firstChild.getElementsByTagName("div")[0].firstChild.style.borderColor="#F5F5F5";
		}

		this.changeEleList(uploadMain.getIdByEle(moveEle),uploadMain.getIdByEle(itemEle));
	},
	/**
	 * 移动list
	 * @param {String} moveId 被移动的元素
	 * @param {String} atId 移动到的位置的后一个元素
	 */
	changeEleList:function(moveId,atId){
		trace(moveId+":"+atId)
		var len=this.eleList.length;
		var moveObj={};
		for(var i=0;i<len;i++){
			if(this.eleList[i].id==moveId){
				moveObj=this.eleList[i];
				this.eleList=Core.Array.without (this.eleList,i);
				break;
			}
		}
		
		len=this.eleList.length;
		for(var j=0;j<len;j++){
			if(this.eleList[j].id==atId){
				this.eleList=Core.Array.insert(this.eleList,j,moveObj);
				break;
			}
		}
	},
	createAllNodes:function(){
		for (var i = 0; i < this.at; i++) {
			this.createNodes(i);
		}
		this.swapStatus();
	},
	swapStatus:function(){
		//trace("swapStatus");
		var l_class,l_click,r_class,r_click;
		for (var i = 0; i < this.at; i++) {
			if(i<1){
				l_class="La";
				l_click="javascript:;"
			}else{
				l_class="";
				l_click='javascript:window.imageList.swapNode(\''+this.eleList[i].id+'\',\'left\');'
			}
			if(i>=this.at-1){
				r_class="Ra";
				r_click="javascript:;";
			}else{
				r_class=""
				r_click='javascript:window.imageList.swapNode(\''+this.eleList[i].id+'\',\'right\');'
			}
		}
	},
	isFull:function(){
		if(this.at>=this.eleMax){
			return true;
		}
		return false;
	},
	createNodes:function(id){
        var html='<div isadd="no" id="'+this.ITEM_ID+id+'" class="orderCell"><div class="orderBlock">\
             <a style="display:none" id="'+this.DEL_ID+id+'" title="删除" class="del" onclick="window.uploadMain.removeImage(\''+id+'\');return false;" href="javascript:void(0);">\
             </a>\
            <div class="divImg">\
                <a onmouseover="this.style.borderColor=\'\';" href="javascript:void(0)">\
                    <img id="'+this.IMG_ID+id+'" height="50" width="50" alt=""  src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif"/>\
                </a>\
                <div id="loading_'+id+'" class="divImg_loading" style="display:none">\
               </div>\
            </div>\
             <span class="err" id="'+this.TIP_ID+id+'" style="display:none"></span>\
            </div></div>';
            
        return html;
	},
	getImageSize:function(id){
		if(top.isPicFlaReady) {
            try{
                uploadImage.getSizeStart();
                parent.trace(this.eleList[id].value);		
                var	t = this.eleList[id].value.replace(/square/, "mw690"); //middle
                uploadImage.getSize(t);
            }catch(e){
            }	
        }
	}
};
