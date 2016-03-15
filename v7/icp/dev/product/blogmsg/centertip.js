$import("lib/dialogConfig.js");
/**
 * 博客消息 在窗口当中提示2s后消失
 * @example:
 * 		 	var b = new CenterTips();
 			b.show("asdfasdf");
 **/
CenterTips = Core.Class.create();
CenterTips.prototype = {
    obj: null,
    tpl: ['<table id="#{entity}" class="CP_w">',  '<tbody>', '<tr>',  '<td class="tMid">', '<div class="" style="width:auto;" id="#{content}">', '</div>', '</td>',  '</tr>', '</tbody>', '</table>'].join(""),
    content: ['<div class="SG_clewbox twosed">',
                    '<span id="#{icon}"><img class="SG_icon SG_icon203" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="50" height="50" align="absmiddle" /></span>',
                    '<a title="关闭" href="javascript:window.centerTips.hidden();void(0);" class="layer_close SG_icon SG_icon76"></a>',
                    '<div class="SG_clewtxt"  id="#{msg}">',
                    '</div>',
                    '<div class="clearit"></div>',
                '</div>'].join(""),
    initialize: function(){
        this.obj = winDialog.createCustomsDialog({
            tpl: this.tpl,
            title: "",
            content: this.content,
            width: 258
            ,height: 77
        }, "tips");
    },
    show: function(msg,iserror){
		if(iserror)
		{			
			this.obj.nodes['icon'].innerHTML = '<img class="SG_icon SG_icon201" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="50" height="50" align="absmiddle" />';
		}else
		{
			this.obj.nodes['icon'].innerHTML = '<img class="SG_icon SG_icon203" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="50" height="50" align="absmiddle" />';
		}
        this.obj.nodes['msg'].innerHTML = msg;
        this.obj.show();
        this.obj.setMiddle();
        var m = this;
        setTimeout(function(){
            m.obj.hidden();
        }, 2000);
    },
	hidden:function()
	{
		this.obj.hidden();
	}
}
//
window.centerTips=new CenterTips();
