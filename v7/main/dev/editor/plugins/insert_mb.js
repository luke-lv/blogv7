/**
 * Copyright (c) 2010, Sina Inc. All rights reserved.
 * @fileoverview 插入微博
 * @author dg.liu | dongguang@staff.sina.com.cn
 */
$import("editor/plugins/plugins.js");
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/math/getUniqueId.js");
$import("sina/core/function/bind3.js");
$import("sina/utils/io/jsload.js");
$import("sina/core/dom/addHTML.js");
$import("sina/core/events/getEventTarget.js");
$import("sina/core/array/ArrayWithout.js");
$import("sina/core/array/findit.js");

Editor.Plugins.InsertMB = Core.Class.create();
Editor.Plugins.InsertMB.prototype = {
	select:[],
	selectData:[],
	childData:[],
	btnState:"dis",
	tipType:"loading",
    initialize: function(containerId){
       this.initDialog();
	   this.initInterface();
	   this.bindEvent();
    },
	 initInterface: function(){
        this._interface = new Interface("http://control.blog.sina.com.cn/admin/article/admin_mblog.php", "ajax");
    },
	 initDialog: function(){
        this.dialog = winDialog.createCustomsDialog({
            title: "插入微博条目",
            content: this.initHtml(),
            width: 500,
            height: 200
        }, "tips");
        
		this.dialog
			.setAreaLocked(true)
			.addEventListener("beforeShow",function(){
				 this.setMiddle();
			});
    },
	bindEvent:function(){
		Core.Events.addEvent($E("mb_ok"),this.toEditor.bind2(this));
		Core.Events.addEvent($E("mb_cancel"),this.cancel.bind2(this));
	},
	cancel:function(){
		this.hidden();
	},
	loadData: function(page){
		this.setTip("loading");
        var page = page || 1;
        var param = {
            uid: scope.$uid,
			version:7,
			pagesize:10,
			page:page,
            random: Math.random()
        }
        this._interface.request({
            GET: param,
            onSuccess: function(_data){
				this.setTip("hidden");
				if(_data.count==0 && page<2){
					this.hidden();
					showError("还没有发表微博<br/><a target='_blank' href='http://weibo.com/"+$UID+"'>现在发一条>></a>");
				}else{
					this.currentData=_data.result;
					this.pics=[];
					this.buildLink(_data);
					this.buildList(_data.result);
					this.initSelect();
					this.page(page, _data.count);
				}
            }.bind2(this)            ,
            onError: function(_data){
               // showError(_data.code);
                //trace("error:" + _data);
					this.hidden();
					if(_data.code=="B120001"){
						showError("还没有发表微博<br/><a target='_blank' href='http://weibo.com/"+$UID+"'>现在发一条>></a>");
					}else{
						showError(_data.code);
					}
					
            }.bind2(this),
            onFail: function(){
            }
        });
    },
	getTime:function(newtime){
	   var d, y,m,day;                
	   d = new Date();            
	   d.setTime(newtime*1000);        
	   y=d.getFullYear();
	   m=(d.getMonth()+1).toString();
	   if(m.length<2){
	      m="0"+m;
	   }
	   day=d.getDate().toString();
	   if(day.length<2){
	      day="0"+day;
	   }
	   return y+"-"+m+"-"+day	  
	},
	show:function(){
		this.dialog.show();
		this.setData();
	},
	setData:function(){
		this.select=[];
		this.selectData=[];
		this.childData=[];
		this.loadData();
	},
	hidden:function(){
		this.dialog.hidden();
	},
	buildLink:function buildLink(data){
		var that = this;
		if (typeof data.t_sina_uid == undefined) {
			setTimeout(function() {
				trace('buildLink');
				buildLink.call(that, data);
			}, 100);
			return;
		}
		if (data.t_sina_uid){
			$E('mb_link').innerHTML = '<div class="tEdit_tips" style="text-align:right;margin-bottom:10px">已绑定微博：weibo.com/'+data.result[0].uid+' <span class="SG_more"><a href="http://control.blog.sina.com.cn/blogprofile/bind_t_sina_blog.php" target="_blank">修改&gt;&gt;</a></span></div>';
		}else{
			$E('mb_link').innerHTML = '<div class="tEdit_tips" style="text-align:right;margin-bottom:10px">还未绑定新浪微博...  <span class="SG_more"><a href="http://control.blog.sina.com.cn/blogprofile/bind_t_sina_blog.php" target="_blank">设置&gt;&gt;</a></span></div>'; 
		}
	},
	buildList:function(data){
		var html="",len=data.length;
		this.childData=[];
		for(var i=0;i<len;i++){
			html+=this.buildListItem(data[i]);
		}
		$E("mb_content").innerHTML=html;
		this.initListEvent(data);
		this.buildPics();
		this.buildchild();
	},
	initListEvent:function(data){
		var len=data.length;
		for(var i=0;i<len;i++){
			var ele=$E("mblog_int_"+data[i].mblogid);
			Core.Events.addEvent(ele,this.selectItem.bind2(this));
		}
	},
	initSelect:function(){
		var len=this.select.length;
		for(var i=0;i<len;i++){
			if($E("mblog_list_"+this.select[i])){
				$E("mblog_int_"+this.select[i]).click();	
			}
		}
	},
	selectItem:function(){
		var ele=Core.Events.getEventTarget();
		var id=ele.id.split("_")[2];
		if(ele.checked){
			ele.parentNode.parentNode.className="current";
			if(Core.Array.findit(this.select,id)==-1){
				this.select.push(id);
			}
			if(!this.selectData[id]){
				for(var name in this.currentData){
					if(id== this.currentData[name].mblogid){
						this.selectData[id]=this.currentData[name];
					}
				}
			}
			this.setBtnState();
		}else{
			ele.parentNode.parentNode.className="";
			this.select=Core.Array.ArrayWithout(this.select,id);
		}
		this.setBtnState();
	},
	buildPics:function(){
		for(var name in this.pics){
			var ele=$E("mblog_pic_"+name);
			if(ele){
				Core.Dom.addHTML(ele,'<img align="absmiddle" alt="" src="'+this.pics[name]+'"/>');
				ele.style.display="block";
			}
		}
	},
	replaceUrl:function(content){
//		var reg=/<sina:link src="(.*)"\/>/;
//		var url="";
//		if(reg.test(content)){
//			var urlCode;
//			content.replace(reg,function(a,b){
//				urlCode=b;
//			});
//			if(/^\w+$/.test(urlCode)){
//				url="http://sinaurl.cn/"+urlCode;
//			}else{
//				url=urlCode;
//			}
//			return content.replace(reg,"<a target='_blank' targellt='_blank' href='"+url+"'>"+url+"</a>");
//		}else{
//			return content;
//		}
		var reg=/(http:\/\/[^\s]*)/gi;
		if(reg.test(content)){
				trace(content)
			return content.replace(reg,"<a target='_blank' href='$1'>$1</a>");
		}else{
			return content;
		}
	
		
	},
	/**
     * 分页
     */
    page: function(pageNum, count){
        var maxPage = Math.ceil(count / 10, 10);
        if (maxPage > 1) {
            Ui.Pagination.init({
                "pageNode": "mb_page",
                "nodeClassNamePrefix": "SG",
                "curPage": pageNum, // 当前所在页码
                "maxPage": maxPage,
                "pageTpl": this.loadData.bind2(this),
                "type":1 // 指定类型为小区域翻页
            }).show();
        }
        else {
            $E("mb_page").innerHTML = '';
        }
    },
	selectSort:function(s_array,s_compare){
		var len=s_array.length;
		for(var i=0;i<len;i++){
			var minIndex=i;
			for(j=i+1;j<len;j++){
				if(s_compare(s_array[minIndex],s_array[j])){
					minIndex=j;
				}
			}
			swap(i,minIndex);
		}
		function swap(x,y){
			var x_bak=s_array[x];
			s_array[x]=s_array[y];
			s_array[y]=x_bak;
		}
		return s_array;
	},
	compare:function(x,y){
		if(this.selectData[x].time<this.selectData[y].time){
			return true;
		}else{
			return false;
		}
	},
	buildListItem:function(data){
		var d={};
		d.mblogid=data.mblogid;
		d.time=this.getTime(data.time);
		if(data.rt && data.rt.rtreason){
			d.text=this.replaceUrl(data.rt.rtreason);	
			this.childData.push(data);
		}else{
			d.text=this.replaceUrl(data.content.text);	
		}
		if(data.content.pic){
			for(name in data.content.pic){
				this.pics[data.mblogid]=data.content.pic[name];
			}
		}
		var html='\
		<li id="mblog_list_#{mblogid}">\
		  <div class="tEditSInp">\
		    <input id="mblog_int_#{mblogid}" type="checkbox"/>\
		  </div>\
		  <div class="tEditSTxt" >\
		    <label id="mblog_txt_#{mblogid}" for="mblog_int_#{mblogid}">#{text}</label>\
			<div class="tCiteBox" id="mblog_child_#{mblogid}" style="display:none"></div>\
			<p class="tcontentPic" id="mblog_pic_#{mblogid}" style="display:none"></p>\
		    <p class="time" id="mblog_time_#{mblogid}">#{time}</p>\
		  </div>\
		  <div class="clearit"/>\
		</li>'
		return new Ui.Template(html).evaluate(d);
	},
	setBtnState:function(state){
		var ele=$E("mb_ok");
		if(this.select.length>0){
			ele.parentNode.className="SG_aBtn SG_aBtnB";
			this.btnState="ok";
		}else{
			ele.parentNode.className="SG_aBtn SG_aBtn_dis";
			this.btnState="dis";
		}
		
	},
	setTip:function(type){
		var ele=$E("mb_tip");
		switch(type) {
			case "hidden":
				if(this.tipType!="hidden"){
					ele.style.display="none";
					this.tipType="hidden";
				}
				break;
			case "loading":
				if (this.tipType == "hidden") {
					ele.style.display="block";
				}
				ele.innerHTML="加载中";
				this.tipType="loading";
				break;
		}

	},
	buildchild:function(){
		var len=this.childData.length;
		for(var i=0;i<len;i++){
			var d={};
			for(var name in this.childData[i].content.atUsers){
				d.user=name;
				break;
			}
			if(d.user){
				d.uid=	this.childData[i].rt.fromuid;
			}else{
				if(this.childData[i].rt.fromuserinfo){
					d.user=this.childData[i].rt.fromuserinfo.nick;
					d.uid=this.childData[i].rt.fromuserinfo.uid;
				}
			}
			d.text=this.replaceUrl(this.childData[i].content.text);
			var html='<div class="tCiteBox_top"></div>\
						  <div class="tCiteBox_cen">\
							<span class="name"><a target="_blank" href="http://weibo.com/#{uid}">#{user}</a>：</span>\
							<span class="txt">#{text}</span>\
						  </div>\
						  <div class="tCiteBox_bottom"></div>';
			var ele=$E("mblog_child_"+this.childData[i].mblogid);
			Core.Dom.addHTML(ele,new Ui.Template(html).evaluate(d));
			ele.style.display="block";
		}
		
	},
    initHtml: function(){
        var html = '<div class="CP_layercon3">\
		<div id="mb_link"></div>\
		<div class="tEditBoxS">\
			<div class="tEditS">\
			  <ul id="mb_content">\
			  </ul>\
			  <div id="mb_tip">加载中。。。</div>\
			</div>\
			<div class="fenyeCon">\
				<div class="SG_page" id="mb_page"></div>\
			</div>\
			<div class="btn"><a class="SG_aBtn SG_aBtn_dis" href="#" onclick="return false"><cite id="mb_ok">确定</cite></a>&nbsp;&nbsp;\
			<a class="SG_aBtn SG_aBtnB" href="#" onclick="return false"><cite id="mb_cancel">取消</cite></a></div>\
		</div>\
		</div>';
		return html;
    },
	toEditor:function(){
		if(this.btnState!="ok"){
			return;
		}
//		var itemHtml='<div class="tEditBox" style="border:2px solid #ccc; background:#efefef; color:#333; padding:18px; font-size:14px;">\
//				<div class="tcontent">#{text}</div>\
//				#{child}\
//				#{pics}\
//				<div class="tEditTime" style="font-size:12px; color:#999; margin-top:8px;">#{time}</div>\
//			</div><br/>';
		var itemHtml='<div>\
		   <p>#{text}</p>\
		    <BLOCKQUOTE style="FONT-SIZE: 12px">#{child}</BLOCKQUOTE>\
			 #{pics}\
		   <P style="COLOR: rgb(153,153,153); FONT-SIZE: 12px">#{time}</P>\
			</div>\
			<br/>';
//		var childHtml='	<div class="tCiteBox">\
//		  <div class="tCiteBox_top" style="display:none;"></div>\
//		  <div class="tCiteBox_cen" style="font-size:12px; margin-top:10px; padding:8px 13px; line-height:1.5em; color:#666; border:1px solid #c7c7c7; background:#f7f7f7;">\
//		    <span class="name"><a target="_blank" href="http://weibo.com/#{uid}">#{name}</a>：</span><span class="txt">#{text}</span>\
//		  </div>\
//		  <div class="tCiteBox_bottom" style="display:none;"></div>\
//		</div>';
		
		var childHtml='<p>\
				<SPAN>\
					<A href="http://weibo.com/#{uid}" target=_blank>#{name}</A>：\
				</SPAN>\
				<SPAN style="COLOR: rgb(153,153,153)">\
					#{text}\
				</SPAN>\
			</p>';
		  
//		var picHtml='<div class="tcontentPic" style="margin-top:12px;"><a target="_blank" href="http://weibo.com/#{uid}/#{mblogid}"><img src="#{pic}" alt="" align="absmiddle" width="130" height="130"/></a></div>'
		var picHtml='<p><A target="_blank" href="http://weibo.com/#{uid}/#{mblogid}"><IMG src="#{pic}" title="查看原图" ></A> </p>';
		var len =this.select.length;
		var html="";
		this.select=this.selectSort(this.select,this.compare.bind2(this));
		
		for(var i=0;i<len;i++){
			var data=this.selectData[this.select[i]];
			var d={};
			d.time=this.getTime(data.time);
			if(data.rt && data.rt.rtreason){
				d.text=this.replaceUrl(data.rt.rtreason);	
				var dc={};
				dc.uid=data.rt.rootuid;
				for(var name in data.content.atUsers){
					dc.name=name;	
					break;
				}
				if(!dc.name){
					if(data.rt.fromuserinfo){
					dc.name=data.rt.fromuserinfo.nick;
					dc.uid=data.rt.fromuserinfo.uid;
				}
				}
				dc.text=this.replaceUrl(data.content.text);
				d.child=new Ui.Template(childHtml).evaluate(dc);
				
			}else{
				d.text=this.replaceUrl(data.content.text);	
				d.child="";
			}
			if(data.content.pic){
				var dp={};
				dp.uid=data.uid;
				dp.mblogid=data.mblogid;
				for(name in data.content.pic){
					dp.pic=data.content.pic[name].replace('thumbnail','bmiddle');
					break;
				}
				d.pics=new Ui.Template(picHtml).evaluate(dp);
			}else{
				d.pics="";
			}
			html+=new Ui.Template(itemHtml).evaluate(d);
		}
		editor.insertHTML(html);
		this.hidden();
	}
};


