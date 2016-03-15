/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 插入运营需求swf
 */
$import("editor/plugins/plugins.js");
$import("sina/core/class/create.js");


Editor.Plugins.InsertOther = Core.Class.create();
Editor.Plugins.InsertOther.prototype = {
    initialize: function(html){
    	this.html="<div style='text-align:center;'>"+html+"</div><br/>"||"";
    },
	insert:function(){
		editor.insertHTML(this.html);
	}
};
