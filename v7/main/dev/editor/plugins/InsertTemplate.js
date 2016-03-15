/**
 * Copyright (c) 2010, Sina Inc. All rights reserved.
 * @fileoverview 插入模板
 */
$import("editor/plugins/plugins.js");
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/function/bind3.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/events/getEventTarget.js");
$import("editor/plugins/config/template.js");

Editor.Plugins.InsertTemplate = Core.Class.create();
Editor.Plugins.InsertTemplate.prototype = {
	countEle:"is_tpl",
    initialize: function(){
    },
	show:function(){
		editor.blur();
		if(!this.dialog){
			this.initDialog();
			this.initList();
			this.initEvent();
		}
		editor.blur();
		this.dialog.show();
	},
	hidden:function(){
//		this.selectData=null;
		this.dialog.hidden();
	},
	initEvent:function(){
		  Core.Events.addEvent($E("it_cancel"), this.hidden.bind2(this));
		  Core.Events.addEvent($E("it_insert"),Core.Function.bind3(this.insert,this,[]));
	},
	initDialog: function(){
        var tpl = ['<table id="#{entity}" class="CP_w">', '<thead id="#{titleBar}">', '<tr>', '<th class="tLeft"><span></span></th>', '<th class="tMid">', '<div class="bLyTop">', '<strong id="#{titleName}"></strong>', '<cite><a title="关闭" class="CP_w_shut" id="#{btnClose}" href="javascript:;" onclick="return false">关闭</a></cite>', '</div>', '</th>', '<th class="tRight"><span></span></th>', '</tr>', '</thead>', '<tfoot>', '<tr>', '<td class="tLeft"><span/></td>', '<td class="tMid"><span></span></td>', '<td class="tRight"><span></span></td>', '</tr>', '</tfoot>', '<tbody>', '<tr>', '<td class="tLeft"><span></span></td>', '<td class="tMid">', '<div id="#{content}">', '</div>', '</td>', '<td class="tRight"><span></span></td>', '</tr>', '</tbody>', '</table>'].join("");
        this.dialog = winDialog.createCustomsDialog({
            tpl: tpl,
            title: "插入模板",
            content: this.initHtml(),
            width: 500
        }, "tips");
		
       	this.dialog
			.setAreaLocked(true)
			.show()
			.addEventListener("beforeShow",function(){
				 this.setMiddle();
			});
    },
	initData:function(){
		this.template_data=new Editor.Plugins.TemplateConfig().get();
	},
	insert:function(type,id){
		var type=type||this.selectData.type;
		var id=id||this.selectData.id;
//		if(type && id){
//			editor.insertHTML(this.template_data[id].html)
//		}else{
//			if(this.selectData){
//				editor.insertHTML(this.selectData.html);
//			}	
//		}
		if(this.isInsert){
			Core.Dom.addHTML(editor.iframeDocument.body,this.template_data[type][id].html+"<br/>");
		}else{
			editor.insertHTML(this.template_data[type][id].html+"<br/>");
			
			//增加统计
			
			var tplEle=$E(this.countEle);
			if(tplEle){
				tplEle.value="1";
			}
			
			this.isInsert=true;
		}
		
//		editor.insertHTML(this.template_data[type][id].html);
		editor.initTemplateImage();
		this.hidden();
	},
	initList:function(){
		if(!this.template_data){
			this.initData();
		}
		//<li><a href="#" title=""><img src="../../images/blog/editor_format/format1.gif" alt="" /></a></li>\
		$E("it_template_content").innerHTML=buildList("layout",this.template_data.layout);
		$E("it_graphical_content").innerHTML=buildList("graphical",this.template_data.graphical);
		function buildList(type,data){
			var html="",len=data.length;
			for(i=0;i<len;i++){
				if(i<len-1){
					html+='<li><a href="#" ondblclick="insertTemplate.insert(\''+type+'\',\''+i+'\')" onclick="insertTemplate.select(\''+type+'\',\''+i+'\');return false;" title=""><img src="'+data[i].image+'" alt="" /></a></li>';	
				}else{
					html+='<li class="last"><a href="#" ondblclick="insertTemplate.insert(\''+type+'\',\''+i+'\')" onclick="insertTemplate.select(\''+type+'\',\''+i+'\');return false;" title=""><img src="'+data[i].image+'" alt="" /></a></li>';	
				}
			}
			return html+'<div class="clear"></div>';
		}
	},
	select:function(type,id){
		//this.selectData=this.template_data[type][id];
		this.selectData={
			id:id,
			type:type
		};
		var ele=Core.Events.getEventTarget().parentNode.parentNode;
	
		clearSelectClass("it_template_content");
		clearSelectClass("it_graphical_content");
		
		ele.className=ele.className+" formA_act";
			
		function clearSelectClass(parentId){
			var eles=Core.Dom.getElementsByClass($E(parentId),"li","formA_act")
			var len=eles.length;;
			for(var i=0;i<len;i++){
				if(eles[i].className.indexOf("last"!=-1)){
					eles[i].className="last";
				}else{
					eles[i].className="";
				}
			}
			
		}
	},
	initHtml:function(){
		var html='<div class="CP_layercon6 blogManageItem">\
			<div class="editFom_table">\
               <ul id="it_template_content">\
               </ul>\
            </div>\
            <div class="editFom_exp">\
                 <div class="top"></div>\
                 <div class="mid">\
                     <ul id="it_graphical_content">\
                     </ul>\
                 </div>\
                 <div class="bot"></div>\
            </div>\
			<div class="btn"><a class="SG_aBtn SG_aBtnB" onclick="return false" href="#"><cite id="it_insert">插入模板</cite></a>&nbsp;<a class="SG_aBtn SG_aBtnB" href="#" onclick="return false"><cite id="it_cancel">取消</cite></a></div>\
		</div>';
		return html;
	}
};
