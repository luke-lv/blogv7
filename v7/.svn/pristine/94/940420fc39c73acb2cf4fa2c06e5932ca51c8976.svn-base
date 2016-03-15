/**
 * Copyright (c) 2010, Sina Inc. All rights reserved.
 * @fileoverview 博客乐库合作项目 - 选择音乐列表
 * @author dg Liu | dongguang@staff.sina.com.cn
 */
$import("sina/core/dom/removeNode.js");
$import("editor/plugins/plugins.js");

Editor.Plugins.SelectList = Core.Class.create();
Editor.Plugins.SelectList.prototype = {
	container_id:"",
	item_id:"mslItem_",
	item_del_id:"mslItemDel_",
	template:{},
	isShow:false,
	list:{},
	max:20,
	len:0,
	initialize:function(container_id) {
		this.container_id=container_id;
		this.initTemplate();
	},
	show:function(){
		if(this.isShow){
			return;
		}
		$E(this.container_id).style.display="";
		this.isShow=true;
	},
	hidden:function(){
		if(this.isShow){
			$E(this.container_id).style.display="none";
			this.isShow=false;
		}
		
	},
	reset:function(){
		var container=$E(this.container_id);
		this.hidden();
		container.getElementsByTagName("ul")[0].innerHTML="";
		this.list={};
		this.len=0;
	},
	clearAlbum:function(){
		for(key in this.list){
			if(this.list[key].isAlbum){
				this.del(key);
			}
		}
	},
	add:function(key,name,type,_isAlbum){
		
		var isAlbum=_isAlbum||false;
		
//		if(this.len>this.max-1 && isAlbum){
//			return;
//		}
		var container=$E(this.container_id);
		if(this.list[key]){
			return;
		}
		
		this.list[key]={
			key:key,
			name:scope.musicOperate.shorten(name),
			at:this.len+1,
			type:type,
			isAlbum:isAlbum
		};
		var s_data=scope.musicOperate.songData[key];
		if(type!="web" && s_data){
			this.list[key].sgId=s_data.SINGERID;
			this.list[key].sgName=s_data.SINGERNAME;
		}
		var ul = container.getElementsByTagName("ul")[0];
		Core.Dom.addHTML(ul,this.template.evaluate(this.list[key]));
		ul.scrollTop = ul.scrollHeight;
		Core.Events.addEvent($E(this.item_del_id+key),function(){
			this.del(key);
		}.bind2(this));
		this.len++;
		this.show();
	},
	del:function(key,backFunc){
		//插入专辑时，如果要对此专辑进行修改，就按插入歌曲方式处理
		scope.musicOperate.insertType="song";
		this.list[key]=false;
		Core.Dom.removeNode($E(this.item_id+key));
		var favBox=$E(scope.musicHash.fav_song_checkbox+key);
		var storeBox=$E(scope.musicHash.song_checkbox+key);
		if(favBox){
			favBox.checked=false;
		}
		if(storeBox){
			storeBox.checked=false;
		}
		this.len--;
	},
	getAllKey:function(){
		var array=[];
		for(key in this.list){
			array.push(key);
		}
		return array;
	},
	/**
	 * 获取一首音乐的id
	*/
	getOneKey:function(){
		var i=0;
		for(key in this.list){
			i++;
			break;
		}
		if(i<1){
			return false;
		}
		return this.list[key].key;
	},initTemplate:function(){
		var html='<li id="'+this.item_id+'#{key}"><div class="muOpt"></div><div class="muName">#{name}</div><div class="muStarName">#{sgName}</div><div class="muDel"><a title="删除" class="CP_w_shut" id="'+this.item_del_id+'#{key}" href="#" onclick="return false">删除</a></div></li>';
//		var html='<div id="'+this.item_id+'#{key}">#{name}<a id="'+this.item_del_id+'#{key}" href="#" onclick="return false">删除</a></div>';
		this.template=new Ui.Template(html);
	}
};