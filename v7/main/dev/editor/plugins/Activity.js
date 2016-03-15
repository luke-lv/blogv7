/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 运营活动添加
 * @author dg.liu | dongguang@staff.sina.com.cn
 */
$import("editor/plugins/plugins.js");
$import("sina/core/class/create.js");
$import("lib/interface.js");
$import("sina/core/function/bind3.js");
$import("sina/ui/template.js");

Editor.Plugins.Activity = Core.Class.create();
Editor.Plugins.Activity.prototype = {
	state:"init",
	activitys:[],
	games:[],
    initialize: function(containerId){
		//articleEditorCFG.articleActivity=["1"]
		this.initInterface();
		this.loadData();
    },
	/**
	 * 建立读取文章数据的interface
	 */
    initInterface: function(){
        this._interface = new Interface("http://control.blog.sina.com.cn/riaapi/activity/get_activity.php", "ajax");
    }
	,loadData:function(){
		  var param = {
      	  };
		  this._interface.request({
            GET: param,
            onSuccess: function(_data){
				
               this.setDate(_data);
			   this.addToMenu(_data);
            }.bind2(this)            ,
            onError: function(_data){
               // showError(_data.code);
                //traceError("error:" + _data.code);
            },
            onFail: function(){
            }
        });
	},
	addToMenu:function(_data){
		if(_data.activity){
			this.addMenuFunc(_data.activity_publish_pic,_data.activity_name,this.addTabFunc);
		}
		var len=this.games.length;
		for(var i=0;i<len;i++){
			this.addMenuFunc(this.games[i].picurl,this.games[i].name,Core.Function.bind3(this.addGameToEditor,this,[i]));
		}
	},
	addGameToEditor:function(num){
		var ele=$E("articleTitle");
		if(ele && ele.value=="" && this.games[num].blogname){
			ele.value=this.games[num].blogname;
		}
		editor.insertHTML(this.games[num].htmlcode);
	},
	addToMenuFunc:function(func){
		this.addMenuFunc=func;
	},
	addTabFunc:function(func){
		this.addTabFunc=func;
	},
	setDate:function(_data){
		//trace("setDate");
		for(var name in _data.activity){
			this.activitys.push(_data.activity[name]);
		}
		for(var name in _data.game){
			_data.game[name].htmlcode=_data.game[name].htmlcode.replace(/(\.swf)/,"$1?uid="+scope.$uid);
			this.games.push(_data.game[name]);
		}

	},
	setContentList:function(){
		var len=this.activitys.length;
		var html="";
		var tempHtml='<li>\
                  	<input value="#{id}" name="activity[]" type="checkbox" id="sc_check_#{id}"/>\
                  	<label for="sc_check_#{id}"><a target="_blank" href="#{url}">#{name}</a></label>\
                  </li>';
		var template = new Ui.Template(tempHtml);
		for(var i=0;i<len;i++){
			html+=template.evaluate(this.activitys[i]);
		}
		Core.Dom.addHTML($E("ac_content"),html);
	},
	del:function(){
		winDialog.confirm($SYSMSG['B79009'], {
            funcOk: function(){
                this.unselect();
            }.bind2(this),
			funcCancel: function(){
               editorTabs.showTab("activity");
            }.bind2(this),
            textOk: "是",
            textCancel: "否",
            defaultButton: 1, // 默认是1，表示确定按钮默认聚焦，0 表示取消按钮默认聚焦
            title: "提示",
            icon: "03" // 可选值："01"、"02"、"03"、"04"、"05"
        },"insertActivityTip");
		var dia=winDialog.getDialog("insertActivityTip");
		var closeBtn=dia.getNodes().btnClose;
		Core.Events.addEvent(closeBtn,function(){editorTabs.showTab("activity");},"click");
	},
	selectByIds:function(ids){
		if(ids && ids.length>0){
			var len=ids.length;
			for(var i=0;i<len;i++){
				var ele=$E("sc_check_"+ids[i]);
				if(ele){
					ele.checked=true;
				}
			}	
		}
		
	},
	unselect:function(){
		var len=this.activitys.length;
		for(var i=0;i<len;i++){
			$E("sc_check_"+this.activitys[i].id).checked=false;
		}
	}
	,setConHtml:function(containerId){
		if (this.state!="finish") {
			var html = ' <div class="Actit">\
                        <div class="fL">请选择你要参加的活动：</div>\
                      </div>\
					   <div class="AcInfo">\
                        <div class="AcInfoBg">\
                          <div class="chooseCurr">\
                            <ul id="ac_content"></ul>\
                        </div>\
                      </div>\
                    </div>\
                    <div class="clearit"></div>\
                  </div>';
			Core.Dom.addHTML($E(containerId), html);
			this.setContentList();
			this.selectByIds(articleEditorCFG.articleActivity);
			this.state="finish"
		}
	}
};


