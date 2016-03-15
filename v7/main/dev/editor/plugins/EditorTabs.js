/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 插入音乐|插入投票|相关文章选项卡
 */
$import("editor/plugins/plugins.js");
$import("sina/core/class/create.js");
$import("sina/core/math/getUniqueId.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");



Editor.Plugins.EditorTabs = Core.Class.create();
Editor.Plugins.EditorTabs.prototype = {
    tabs: {},
    initialize: function(containerId){
        this.containerId = containerId;
        this.tabManage = new Tabs($E("addTab"), {});
        
    },
    show: function(){
        $E(this.containerId).style.display = "block";
        this.isShow = true;
    },
    hidden: function(){
        $E(this.containerId).style.display = "none";
        this.isShow = false;
    },
	showTab:function(name){
		if(this.tabs[name]){
			if(!this.isShow){
				this.show();
			}
			this.abortAll();
			this.tabs[name].setFocus();
	        this.tabs[name].show();
		}
	},
    addTab: function(data){
        this.abortAll();
        if (!this.tabs[data.name]) {
            data.id = Core.Math.getUniqueId();
            var template = '<span><a href="javascript:;" onclick="return false">#{title}</a><a class="closed" id="close_#{id}" onclick="return false" href="javascript:;"/></span>';
            var temp = new Ui.Template(template);
            this.tabs[data.name] = new Tab(temp.evaluate(data), {
                isFocus: true,
                className: "cur"
            });
            this.tabs[data.name]._id = data.id;
            this.tabManage.add(this.tabs[data.name]);
            this.tabs[data.name].addOnAbort(Core.Function.bind3(swapTab, this, [data.contentId, "hidden"]));
            this.tabs[data.name].addOnFocus(Core.Function.bind3(swapTab, this, [data.contentId]));
            Core.Events.addEvent($E("close_" + data.id), Core.Function.bind3(this.close, this, [data.id]), "click");
            
            if (data.callVote) {
                if (data.callVote['remove']) 
                    Core.Events.addEvent($E("close_" + data.id), Core.Function.bind3(data.callVote['remove'], this, [data.id]), "click");
                
            }
			
        }
		this.showTab(data.name);
        if (data.callVote && data.callVote['show']) 
	            data.callVote['show']();
         function swapTab(tabContentId, type){
	            //trace(tabContentId);
	            if (type && type == "hidden") {
	                $E(tabContentId).style.display = "none"
	            }
	            else {
	                $E(tabContentId).style.display = ""
	            }
	        }
        
    },
	addCloseCallbackFunc:function(name,func){
		this.tabs[name].closeFunc=func;
	},
    abortAll: function(){
        for (var name in this.tabs) {
            this.tabs[name].setAbort();
        }
    },
    close: function(id){
        Core.Events.stopEvent();
        var len = 0;
        at = 0;
        names = [];
        for (var name in this.tabs) {
            names.push(name);
            if (this.tabs[name]._id == id) {
                this.tabs[name].setAbort();
				if(this.tabs[name].closeFunc){
					this.tabs[name].closeFunc();
				}
                this.tabs[name].hidden();
                //trace(this.tabs[name].isShow);
                at = len;
            }
            len++;
        }
        if (len == 1) {
            this.hidden();
        }
        else {
            var isShow = false;
            for (var i = 0; i < names.length; i++) {
                if (this.tabs[names[i]].isShow) {
                    isShow = true;
                    this.tabs[names[i]].setFocus();
                    break;
                }
            }
            if (!isShow) {
                this.hidden();
            }
        }
    },
    removeTab: function(){
    
    }
    
};
