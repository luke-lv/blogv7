/**
 * Copyright (c) 2010, Sina Inc. All rights reserved.
 * @fileoverview 关联博文-换封片
 * @author dg.liu | dongguang@staff.sina.com.cn
 */
$import("editor/plugins/plugins.js");
$import("sina/core/class/create.js");
$import("sina/core/dom/getChildrenByClass.js");

SinaEditor.ChangeCover = Core.Class.create();
SinaEditor.ChangeCover.prototype = {
	ITEM_ID:"cover_view_",		// 封面列表
	COVER_ID:"img_view_",		// 单图容器
	COVER_IMG_ID:"cover_img_", // 单图图片id
	SAVE_ID:"save_cover_",
	CHANGE_ID:"change_cover_",	// 换封面按钮
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
				this.swapView(aid, 'show_cover');
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
		
		// $E("save_cover_"+aid).style.display="none"; // 没有保存按钮
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
					this.swapView(aid, 'show_list');
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
	swapView:function(aid, type){
		var changeModeEle=$E(this.ITEM_ID+aid);	// cover_view  显示列表
		var showModeEle=$E(this.COVER_ID+aid);	// img_view  显示单图
		var changeBtnEle=$E(this.CHANGE_ID+aid); // change_cover 换封面按钮

		if (type === 'show_list'){
			showModeEle.style.display="none";
			changeBtnEle.style.display="none";
			changeModeEle.style.display="";
		}else{
			changeModeEle.style.display="none";
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


		// tempHtml='<span class="#{cls}" id="cover_item_#{aid}_#{pic_id}">\
		// 	<a href="javascript:void(0)">\
		// 		<img alt="" src="#{imgPath}" id="cover_#{aid}_#{pic_id}">\
		// 	</a>\
		// 	<img height="18" align="absmiddle" width="18" title="选中" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon106">\
		// </span>';
		tempHtml = 	'<a href="javascript:;" title="" class="pic_small" is_selected="#{is_selected}" id="cover_item_#{aid}_#{pic_id}">'+
			            '<i class="icon i22_clicked" style="#{is_show}"></i>'+
			            '<img id="cover_#{aid}_#{pic_id}" src="#{imgPath}" class="pic_img" alt="">'+
			        '</a>';
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
				data[i].cls="pic_hover";
				data[i].is_show = "display:;";
				data[i].is_selected = 1;
			}else{
				data[i].cls="";
				data[i].is_show = "display:none";
				data[i].is_selected = 0;
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
		// console.log('container', container)
		var selected=this.getSelected(aid);
		if (selected){
			selected.setAttribute('is_selected', 0);
			var iNode = selected.getElementsByTagName('i')[0];
			if(iNode){
				iNode.style.display = 'none';
			}
		}
		
		var coverNode = $E("cover_item_"+aid+"_"+pid);
		coverNode.className += ' pic_hover';
		var iNode = coverNode.getElementsByTagName('i')[0];
		if (iNode){
			if (iNode.style.display == 'none'){
				iNode.style.display = '';
				coverNode.setAttribute('is_selected', 1);
				this.save(aid);
			}
		}
		
	},
	getSelected:function(aid){
		var container=$E(this.ITEM_ID+aid);
		// console.log('container', container)
		var children = container.children;
		for (var i=0; i<children.length; i++){
			var node = children[i];
			if (node.getAttribute('is_selected') == 1){
				return node;
			}
		}
		return null;
	}
}
