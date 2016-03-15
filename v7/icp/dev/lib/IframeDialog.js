/**
 * 插入iframe对话框
 */
$import("lib/lib.js");
$import("lib/dialogConfig.js");
$import("sina/core/class/create.js");
$import("sina/core/math/getUniqueId.js");
$import("sina/ui/renderer/simpleRenderer.js");

Lib.IframeDialog = Core.Class.create();
Lib.IframeDialog.prototype = {
    dialog: null,
    initialize: function(option){
       this.id=Core.Math.getUniqueId();
       this.option=option;
    },
    /**
     * 初始化dialog
     */
    initDialog: function(){
        var _this = this, this_option = this.option;
        var obj = {
            ad: false,
            drag: true,
            tpl: this_option.tpl || _this.tpl,
            title: this_option.title,
            content: '<iframe frameborder="0" id="ifrDialog_'+_this.id+'" scrolling="no"></iframe>',
            renderer: Ui.SimpleRenderer,
            width: this_option.width,
            height: this_option.height //title高度26
        };
        this.dialog = winDialog.createCustomsDialog(obj);
        this.dialog.setAreaLocked(true);
        //this.dialog.setFixed(true);
        var iframe = $E("ifrDialog_"+this.id);
        iframe.src = this_option.url;
        iframe.style.width = this_option.width+'px';
        iframe.style.height = this_option.height+'px';
        this_option.funcClose && this.bindColseFunc();
    },
	tpl: '<table id="#{entity}" class="CP_w">' +
			'<thead id="#{titleBar}">' +
				'<tr>' +
					'<th class="tLeft"><span></span></th>' +
					'<th class="tMid">' +
						'<div class="bLyTop">' +
							'<strong id="#{titleName}">提示</strong>' +
							'<cite><a id="#{btnClose}" href="javascript:;" class="CP_w_shut" title="关闭">关闭</a></cite>' +
						'</div>' +
					'</th>' +
					'<th class="tRight"><span></span></th>' +
				'</tr>' +
			'</thead>' +
			'<tfoot>' +
				'<tr>' +
					'<td class="tLeft"><span></span></td>' +
					'<td class="tMid"><span></span></td>' +
					'<td class="tRight"><span></span></td>' +
				'</tr>' +
			'</tfoot>' +
			'<tbody>' +
				'<tr>' +
					'<td class="tLeft"><span></span></td>' +
					'<td class="tMid" id="#{content}">' +
					'</td>' +
					'<td class="tRight"><span></span></td>' +
				'</tr>' +
			'</tbody>' +
		'</table>',
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
	 */
	bindColseFunc: function(){
		Core.Events.addEvent(this.dialog.nodes.btnClose, this.option.funcClose);
	},
	/**
	 * 设置高宽
	 * @param {Object} nWidth
	 * @param {Object} nHeight
	 */
    setSize: function(nWidth, nHeight){
	    var ele= this.dialog.nodes.content.firstChild;
        this.dialog.setSize(nWidth, nHeight);
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
    close: function(){
		this.dialog.hidden();
    }
};
