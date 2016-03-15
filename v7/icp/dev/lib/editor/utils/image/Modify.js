/**
 * Copyright (c) 2010, Sina Inc. All rights reserved.
 * @fileoverview 图片编辑
 * @author dg.liu | dongguang@staff.sina.com.cn
 */
$import("lib/editor/utils/utils.js");
$import("lib/editor/utils/image/staticClass.js");
$import("sina/utils/flash/swfObject.js");
$import("sina/ui/renderer/simpleRenderer.js");
 
Editor.Utils.Modify = Core.Class.create();

Editor.Utils.Modify.prototype = {
	//获取flash地址接口
    _getFlashUrl: "http://www.picself.cn/GetPicselfUrl.php",
	//flash地址
    _flashUrl: "",
	_dFlashUrl:"http://www.picself.cn/flash/picself.swf",
	//flash容器元素id
	container_id:"image_modify_con",
	isInit:false,
	isClosed:true,
	showNum:0,
    initialize: function(target){
		this.target=target;
		if(this.checkFlashVersion()){
			this.init();
		}else{
			this.installTip();
		}
    },
	init:function(){
			if(this.isInit){
				return;
			}
	    	this.getFlash();
			this.initDialog();
			this.bindFuncToStatic();
			this.isInit=true;
	},
	checkFlashVersion:function(){
		var obj=deconcept.SWFObjectUtil.getPlayerVersion();
		if(obj.major<10){
			return false;
		}
		return true;
	},
	installTip:function(){
		winDialog.alert('我们的产品需要安装flashplayer 10或更高版本，请<a href="http://get.adobe.com/flashplayer">点击此处</a>免费下载');
	},
	refreshTip:function(){
		//点击刷新，我们帮您检测是否已成功安装flashplayer 10 
		winDialog.alert('<a href="#" onclick="Editor.Utils.staticClass.refresh()">点击刷新</a>，我们帮您检测是否已成功安装flashplayer 10',{
			textOk:'刷新',
			funcOk:function(){
				Editor.Utils.staticClass.refresh();
			}
		});
	},
	//创建弹出层
	initDialog:function(){
		var me = this;
		var tpl = ['<table id="#{entity}" class="CP_w">', '<thead id="#{titleBar}">', '<tr>', '<th class="tLeft"><span></span></th>', '<th class="tMid">', '<div class="bLyTop">', '<strong id="#{titleName}"></strong>', '<cite><a title="关闭" class="CP_w_shut" id="#{btnClose}" href="javascript:;" onclick="return false">关闭</a></cite>', '</div>', '</th>', '<th class="tRight"><span></span></th>', '</tr>', '</thead>', '<tfoot>', '<tr>', '<td class="tLeft"><span/></td>', '<td class="tMid"><span></span></td>', '<td class="tRight"><span></span></td>', '</tr>', '</tfoot>', '<tbody>', '<tr>', '<td class="tLeft"><span></span></td>', '<td class="tMid">', '<div id="#{content}">', '</div>', '</td>', '<td class="tRight"><span></span></td>', '</tr>', '</tbody>', '</table>'].join("");      
		this.dialog = winDialog.createCustomsDialog({
            tpl: tpl,
            title: "编辑图片",
            content: '<div id='+this.container_id+'><div style="width:920px;height:500px;"></div></div>',
			renderer:Ui.SimpleRenderer,
            width: 920
        }, "imageModify");
		this.dialog.addEventListener("hidden",function() {
			me.isClosed = true;
			$E(me.container_id).innerHTML="";
		});
        this.dialog.setMiddle();
		this.dialog.setAreaLocked(true);
		var count=20;
		setTimeout(function(){
			var s=me.setContent();
			if(!s && count-- > 0){
				arguments.callee();
			}
		},100);
		
	},
	//绑定一些方法到静态类中
	bindFuncToStatic:function(){
		Editor.Utils.staticClass.closeEditLayer=this.hide.bind2(this);
		Editor.Utils.staticClass.changeImg=this.changeImg.bind2(this);
		
	},
	//调用接口，获取flash地址
    getFlash: function(){
        var getInterface = new Interface(this._getFlashUrl, "jsload");
        getInterface.request({
            GET: {},
            onSuccess: function(_data){
				this._flashUrl=_data;
				scope.modify_flash_domain=_data.replace(/\w*\.swf.*$/,"");
				//this.setContent();
            }.bind2(this),
            onError: function(_data){
				this._flashUrl=this._dFlashUrl;
				scope.modify_flash_domain=this._dFlashUrl.replace(/\w*\.swf.*$/,"");
				//this.setContent();
            }.bind2(this),
            onFail: function(_data){
				this._flashUrl=this._dFlashUrl;
				scope.modify_flash_domain=this._dFlashUrl.replace(/\w*\.swf.*$/,"");
				//this.setContent();
            }.bind2(this)            
        });
    },
	/**
	 * flash调用的回调函数中调用此方法，用于更换图片
	 * @param {String} pid 图片id
	 */
	changeImg:function(pid){
		if(this.isClosed) {
			return;
		}
		rssSendLog('11_31_pic_tupianbaocun');
		var url=scope.editImage.src;
		scope.editImage.src=url.replace(/\/\w*&/,"/"+pid+"&");	
		scope.editImage.style.height="";
		scope.editImage.style.width="";
		scope.editImage.removeAttribute("width");
		scope.editImage.removeAttribute("height");
		this.hide();
	},
	/**
	 * 隐藏dialog，并清除flash
	 */
	hide:function(){
		this.dialog.hidden();
		$E(this.container_id).innerHTML="";
	},
	/**
	 * 向页面添加flash并显示
	 */
	show:function(){
		var me=this;
		this.isClosed = false;
		if(this.isInit){
			this.dialog.show();
			window.setTimeout(function(){
				me.setContent();
			},1);
		}else{
			if(this.checkFlashVersion()){
				this.init();
			}else{
				if(this.showNum>0){
					this.refreshTip();	
				}
				
			}
		}
		this.showNum++;
	},
	/**
	 * 向页面添加flash
	 */
	setContent:function(){		
		if(this._flashUrl==""){
			return false;
		}			
		Utils.Flash.swfView.Add(this._flashUrl,this.container_id,Editor.Utils.staticClass.flash_id, '920','500' , "9.0.0.0", "#000", {
			getArgs:"Editor.Utils.staticClass.getArgs"
       	 }, {
            scale: "showall",
            pluginspage: "http://www.macromedia.com/go/getflashplayer",
            allowScriptAccess: "always",
            allowFullScreen: 'false',
			wmode:"opaque"
       	 });
		 return true;
	}    
};



