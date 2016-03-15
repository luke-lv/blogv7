/**
 * Copyright (c) 2010, Sina Inc. All rights reserved.
 * @fileoverview 关联博文-换封片
 * @author dg.liu | dongguang@staff.sina.com.cn
 */
$import("editor/plugins/plugins.js");
$import("sina/core/class/create.js");
$import("sina/core/dom/getChildrenByClass.js");

Editor.Plugins.ChangeCover = Core.Class.create();
Editor.Plugins.ChangeCover.prototype = {
	ITEM_ID:"cover_view_",
	COVER_ID:"img_view_",
	COVER_IMG_ID:"cover_img_",
	SAVE_ID:"save_cover_",
	CHANGE_ID:"change_cover_",
    initialize: function(){
		
        
    },initInterface: function(){
        this.list_interface = new Interface("http://control.blog.sina.com.cn/riaapi/photoblog/list_blogpic.php", "ajax");
		this.save_interface = new Interface("http://control.blog.sina.com.cn/riaapi/photoblog/set_cover.php", "ajax");
    },
	save:function(aid){
		var param = {
            blog_id: aid
        };
		var selected=this.getSelected(aid);
		if(selected){
			param.pic_id=selected.id.split("_")[3];
		}else{
			 showError("请选择一个封片");
			return false;
		}
		
		this.save_interface.request({
            GET: param,
            onSuccess: function(_data){
				articleAssociate.articleList[aid].imagePath=getImgStaticPath(param.pic_id,"small");
				this.set(aid,param.pic_id);
				this.swapView(aid);
            }.bind2(this)            ,
            onError: function(_data){
                showError(_data.code);
                //trace("error:" + _data);
            },
            onFail: function(){
            }
        });
	},
	/**
	 * 切换到提示信息模式
	 */
	swapTipMode:function(aid)
	{
		$E("img_view_"+aid).style.display="none";
		$E("cc_tip_"+aid).style.display="";
		
		$E("save_cover_"+aid).style.display="none";
		$E("back_cover_"+aid).style.display="";
		$E("change_cover_"+aid).style.display="none";
	},
	loadData:function(aid){
		  //trace("cate:" + cate);
	
        if(!this.list_interface){
			this.initInterface();
		}
		var param = {
            blog_id: aid
        };
        this.list_interface.request({
            GET: param,
            onSuccess: function(_data){
				if(_data.length<1){
					this.swapTipMode(aid);
				}else{
					this.buildList(_data,aid);
					this.swapView(aid);
				}
             
            }.bind2(this)            ,
            onError: function(_data){
                showError(_data.code);
                //trace("error:" + _data);
            },
            onFail: function(){
            }
        });
	},
	renderList:function(aid){
		this.loadData(aid);
	},
	set:function(aid,pid){
		var ele=$E(this.COVER_IMG_ID+aid);
		ele.src=getImgStaticPath(pid,"small");
	},
	swapView:function(aid){
		var changeModeEle=$E(this.ITEM_ID+aid);
		var showModeEle=$E(this.COVER_ID+aid);
		var saveBtnEle=$E(this.SAVE_ID+aid);
		var changeBtnEle=$E(this.CHANGE_ID+aid);
		
		//切换到封片选择模式
		if(changeModeEle.style.display=="none"){
			showModeEle.style.display="none";
			changeBtnEle.style.display="none";
			changeModeEle.style.display="";
			saveBtnEle.style.display="";
			
		}else{
			changeModeEle.style.display="none";
			saveBtnEle.style.display="none";
			showModeEle.style.display="";
			changeBtnEle.style.display="";
		}
	},
	getPicBySrc:function(src){
		return src.replace(/(.*?)\/(\w{16,21})[\^?&]?/,"$2");
	},
	initTemplate:function(){
		if(this.template){
			return ;
		}
		tempHtml='<span class="#{cls}" id="cover_item_#{aid}_#{pic_id}">\
			<a href="javascript:void(0)">\
				<img alt="" src="#{imgPath}" id="cover_#{aid}_#{pic_id}">\
			</a>\
			<img height="18" align="absmiddle" width="18" title="选中" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon106">\
		</span>';
		this.template = new Ui.Template(tempHtml);
	},
	buildList:function(data,aid){
		var container=$E(this.ITEM_ID+aid);
		var len=data.length;
		var select_pid=this.getPicBySrc($E(this.COVER_IMG_ID+aid).src);
		container.innerHTML="";
		this.initTemplate();
		for(var i=0;i<len;i++){
			if(select_pid==data[i].pic_id){
				data[i].cls="selected";
			}else{
				data[i].cls="";
			}
			data[i].imgPath=getImgStaticPath(data[i].pic_id,"small");
			data[i].aid=aid;
			Core.Dom.addHTML(container, this.template.evaluate(data[i]));
			Core.Events.addEvent($E("cover_"+aid+"_"+data[i].pic_id),this.select.bind2(this));
		};
	},
	select: function(){
		var ele=Core.Events.getEventTarget();
		var arr=ele.id.split("_");
		var aid=arr[1];
		var pid=arr[2];
		var container=$E(this.ITEM_ID+aid);
		var selected=this.getSelected(aid);
		if(selected){
			selected.className="";
		}
		$E("cover_item_"+aid+"_"+pid).className="selected";
		
	},getSelected:function(aid){
		var container=$E(this.ITEM_ID+aid);
		var list=Core.Dom.getChildrenByClass(container,"selected");
		if (list[0]) {
			return list[0];
		}
		return null;
	}
}
