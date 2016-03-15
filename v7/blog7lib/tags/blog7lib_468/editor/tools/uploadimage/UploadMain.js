/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 图片上传
 */
$import("sina/core/class/create.js");
$import("sina/core/function/bind3.js");
$import("editor/tools/uploadimage/ImageList.js");
$import("editor/tools/uploadimage/UploadImage.js");
$import("editor/tools/uploadimage/AlbumImage.js");
$import("editor/tools/uploadimage/WebImage.js");
$import("editor/tools/uploadimage/PropertySet.js");
$import("lib/showError.js");
$import("msg/uploadPicMSG.js");
$import("sina/core/math/getUniqueId.js");
$import("sina/core/dom/addHTML.js");
$import('sina/core/system/getParam.js');



var UploadMain = Core.Class.create();

UploadMain.prototype = {
    initialize: function(insertFunc,max,dialogName){
		max=max||20;
		this.insertFunc=insertFunc||function(){};
		this.dialogName=dialogName||"imageDialog";
		this.createVipLayer();
        this.initTab();
		this.setHelp("http://photo.blog.sina.com.cn/client/SinaImageUpload-2-1-7120-2009-07-13.exe");
		window.uploadImageIsRead=function(){
			//trace("flase_callback:uploadImageIsRead");
			if(window.uploadImage){
				return true;
			}else{
				return false;
			}
		};
		window.uploadImage=new UploadImage("useClient",dialogName);
		
        window.imageList = new ImageList("img_list",max,this.swapButtonStatus.bind2(this));
		Core.Events.addEvent($E("insert_image"),this.insertToEditor.bind2(this),"click");
		//$E("insert_image").cilic();
		this.attachFuncOnClose();
		this.sizeSet=new PropertySet("chicun",{n:"尺寸",p:{middle:"大",bmiddle:"中",small:"小"}});
		this.positionSet=new PropertySet("duiqi",{n:"对齐",p:{left:"左",center:"中",right:"右"}});
		this.setSize();
		
		//相册专辑发博文
		var ctg_id=Core.System.getParam("ctg_id"); 
		if(ctg_id){
			this.tabs.swapTags(this.albumTab);
		}
    },
	/**
	 * 创建vip用户浮动层
	 */
	createVipLayer:function(){
		if(top.scope.$is_photo_vip){
			var html='<div class="errTips_l">'
				+ '<p>尊敬的图片VIP用户，您好：为了方便您在博文中插入照片，我们特为您提供单张照片最大10M的VIP服务，我们期待您的更多佳作。</p>'
				+ '</div>';
			var ele=Core.Dom.getElementsByClass(document.body,"div","insetPhotoContent")[0];
			Core.Dom.insertHTML(ele,html,"afterbegin");
		}
	},
	closeVipLayer:function(ele){
		ele.parentNode.style.display="none";
		this.setSize();
		uploadImage.moveFlash();
	},
	swapButtonStatus:function(len,type){
		if(len>0){
			$E("insert_image").title="";
			$E("insert_image").parentNode.className="SG_aBtn SG_aBtnB";
		}else{
			$E("insert_image").title="请先添加图片";
			$E("insert_image").parentNode.className="SG_aBtn SG_aBtn_dis";
		}
		this.initWeb();
		webImage.buttonStatus();
		if(type && type!="add"){
			uploadImage.swapGoto();
		}
	},
	attachFuncOnClose:function(){
		//trace(this.dialogName+"_"+top[this.dialogName].num);
		var dialog=top.winDialog.getDialog(this.dialogName+"_"+top[this.dialogName].num);
		var btnClose=dialog.getNodes().btnClose;
		Core.Events.addEvent(btnClose,function(){
			if(imageList.at>0 || (uploadImage.loadingList && uploadImage.loadingList.key.length>0)){
				this.showConfirm();
			}
			
		}.bind2(this));
	},
	showConfirm:function(){
		top.winDialog.confirm($SYSMSG['A77775'], {
                        funcOk: function(){
                        },
                        textOk: "是",
                        textCancel: "否",
						funcCancel:function(){
							top[this.dialogName].dialog.show();
						}.bind2(this),
                        defaultButton: 1, // 默认是1，表示确定按钮默认聚焦，0 表示取消按钮默认聚焦
                        title: "提示",
                        icon: "04" // 可选值："01"、"02"、"03"、"04"、"05"
                    });
	},
	setHelp:function(url){
		//Core.Dom.addHTML($E("headerTab"),'<div class="linkHelp"><a href="'+url+'" >下载上传工具</a><img width="15" height="15" align="absmiddle" title="帮助" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon46"/></div>');
		
	},
    initTab: function(){
        this.tabs = new Tabs($E("headerTab"), {});
        var clientTab = new Tab('<a href="javascript:void(0);">我的电脑</a>', {
            isFocus: true,
            className: "cur"
        });
       this.albumTab = new Tab('<a href="javascript:void(0);">博客图片</a>', {
            isFocus: false,
            className: "cur"
        });
        var webTab = new Tab('<a href="javascript:void(0);">网上图片</a>', {
            isFocus: false,
            className: "cur"
        });
        
        clientTab.addOnAbort(Core.Function.bind3(swapTab, this, ["useClient", "hidden"]));
        this.albumTab.addOnAbort(Core.Function.bind3(swapTab, this, ["sinaAlbum", "hidden"]));
        webTab.addOnAbort(Core.Function.bind3(swapTab, this, ["webUrl", "hidden"]));
        
        clientTab.addOnFocus(Core.Function.bind3(swapTab, this, ["useClient"]));
        this.albumTab.addOnFocus(Core.Function.bind3(swapTab, this, ["sinaAlbum"]));
		this.albumTab.addOnFocus(this.initAlbum);
        webTab.addOnFocus(Core.Function.bind3(swapTab, this, ["webUrl"]));
        webTab.addOnFocus(this.initWeb);
		
        this.tabs.add(clientTab);
        this.tabs.add(this.albumTab);
        this.tabs.add(webTab);
        
        function swapTab(tabContentId, type){
            if (type && type == "hidden") {
                $E(tabContentId).style.display = "none";
            }
            else {
                $E(tabContentId).style.display = "";
				if(tabContentId=="sinaAlbum"){
					$E("list_container").style.marginTop="25px";
				}else{
					$E("list_container").style.marginTop="";
				}
				//博文编辑，插入图片，浮层'我的电脑'添加本地图片成功后，在浮层'新浪相册'处取消已添加图片，返回'我的电脑'无法再次添加本地图片
				//http://issue.internal.sina.com.cn/browse/BLOGBUG-5472
				if(tabContentId=="useClient"){
					if (!this.view != "loading") {
						uploadImage.initFlashPosition();
					}					
				}
            }
			this.setSize();
			uploadImage.moveFlash();
            
        }
		
    },
    initAlbum: function(){
        //初始化相册图片数据
		//trace("初始化相册图片数据");
		if(!window.albumImage){
			window.albumImage=new AlbumImage();
		}
    }
	,
    initWeb: function(){
        //初始化网络图片
		//trace("initWeb");
		if(!window.webImage){
			window.webImage=new WebImage();
		}
    	
    }
	,insertToEditor:function(){
		if(imageList.at<1){
			return;
		}
		var len=imageList.eleList.length;
		var imageLst=[],uplaodImageLst=[],selectImageList=[];
		for(var i=0;i<len;i++){
			if(imageList.eleList[i].value && imageList.eleList[i].value!=""){
				type=imageList.eleList[i].type;
				if(type=="album" || type=="upload"){
					imageLst.push(imageList.eleList[i].value.replace(/bsquare/,"mw690")); //middle
					
					var curPic=imageList.eleList[i].value;
					var pId = curPic.substring(curPic.lastIndexOf('/')+1);
					if(type=="album"){
						selectImageList.push(pId);
					}else{
						uplaodImageLst.push(pId);
					}
				}else{
					imageLst.push(imageList.eleList[i].value);
				}
				
			}
		}
		
		this.insertFunc(imageLst,uplaodImageLst,this.getSetObj(),selectImageList);
	},setSize:function(){
		top[this.dialogName].setSize(660,document.body.offsetHeight);
	},
	/**
	 * 获得每个item的唯一id
	 * @param {Object} ele item元素或其子元素
	 */
	getIdByEle:function(ele){
		var arr=ele.id.split("_");
		return arr[arr.length-1];
	},
	getSetObj:function(){
		var obj={};
		obj.position=this.positionSet.value;
		obj.size=this.sizeSet.value;
		return obj;
	},
	/**
	 * 删除上传中和上传后的图片
	 * @param {String} id
	 */
	removeImage:function(id){
		loadingList.remove(id);
		imageList.remove('id',id);
	}
};
