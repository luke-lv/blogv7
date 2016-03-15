/**
 * "文章发表中插入功能iframe对话框";
 */
$import("lib/editor/utils/utils.js");
$import("sina/core/class/create.js");
$import("lib/dialogConfig.js");
$import("sina/ui/template.js");
$import("sina/core/math/getUniqueId.js");
$import("sina/ui/renderer/simpleRenderer.js");


Editor.Utils.IframeDialog = Core.Class.create();
Editor.Utils.IframeDialog.prototype = {
    dialog: null,
	num:0,
    initialize: function(option){
	   this.id=Core.Math.getUniqueId();
	   this.dialogContent="<iframe frameborder='0' id='iframeDialog_"+this.id+"' scrolling='no' style='width: #{width}px; height: #{height}px;' src=''></iframe>";
	   this.option=option;
     
    },
	/**
	 * 初始化dialog
	 */
    initDialog: function(){
		this.num++;
		var contentHTML=new Ui.Template(this.dialogContent).evaluate(this.option);
        var obj = {
            ad: false,
            drag: true,
            title: this.option.title,
            content: contentHTML,
            renderer:Ui.SimpleRenderer,
            width: this.option.width,
            height: this.option.height
        
        };
		if(this.option.dialogName && this.option.dialogName=="imageDialog"){
			 obj.tpl=this.getTpl();
		}
        var dialog = winDialog.createCustomsDialog(obj,this.option.dialogName+"_"+(this.num)||"");
		//trace(this.option.dialogName+"_"+(this.num))
        this.dialog = dialog;
	    this.dialog.setAreaLocked(true);
	    $E("iframeDialog_"+this.id).src=this.option.url;
		this.bindColseFunc();
    },
	getTpl:function(){
		var tplarray=['<table id="#{entity}" class="CP_w">',
			'<thead id="#{titleBar}">',
				'<tr>',
					'<th class="tLeft"><span></span></th>',
					'<th class="tMid">',
						'<div class="bLyTop">',
							'<strong id="#{titleName}">提示标题</strong>',
							'<cite style="width:35px;">',
							'<a id="#{btnClose}" href="#" onclick="return false;" class="CP_w_shut" title="关闭">关闭</a></cite>',
						'</div>',
					'</th>',
					'<th class="tRight"><span></span></th>',
				'</tr>',
			'</thead>',
			'<tfoot>',
				'<tr>',
					'<td class="tLeft"><span></span></td>',
					'<td class="tMid"><span></span></td>',
					'<td class="tRight"><span></span></td>',
				'</tr>',
			'</tfoot>',
			'<tbody>',
				'<tr>',
					'<td class="tLeft"><span></span></td>',
					'<td class="tMid" id="#{content}">',
					'</td>',
					'<td class="tRight"><span></span></td>',
				'</tr>',
			'</tbody>',
		'</table>'];
		return tplarray.join("");
	},
	/**
	 * 设置，将dialog删除
	 */
    reset: function(){
		if(this.dialog){
		   this.hidden();
           //liming9 修正插入模板后在模板里先插一个图片，再插一个图片就不行的bug
	       var dialogParentNode = this.dialog.nodes.panel || this.dialog.nodes.entity;
	       dialogParentNode.parentNode.removeChild(dialogParentNode);
	       this.dialog = null;
		}
    },
	/**
	 * 添加关闭时事件
	 * 解决http://issue.internal.sina.com.cn/browse/BLOGBUG-5342
	 */
	bindColseFunc:function(){
		Core.Events.addEvent(this.dialog.nodes.btnClose,function(){editor.iframeWindow.focus();},"click");
	},
	/**
	 * 设置高宽
	 * @param {Object} nWidth
	 * @param {Object} nHeight
	 */
    setSize: function(nWidth, nHeight){
	   var ele= this.dialog.nodes.content.firstChild;
       this.dialog.setSize({
            "width": nWidth, 
            "height": nHeight
        });
	   ele.style.width=nWidth+"px";
	   ele.style.height=nHeight+"px";
	   
    },
	/**
	 * 显示dialog
	 */
	show: function(){
	   this.reset();
	   this.initDialog();
       this.dialog.show();
       this.dialog.setMiddle();
    },
	/**
	 * 隐藏dialog
	 */
    hidden: function(){
		this.dialog.hidden();
    }
};
