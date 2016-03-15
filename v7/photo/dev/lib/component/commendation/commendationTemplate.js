/**
 * @fileoverview 推荐面板的模板HTML
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-10
 */

//面板统一标准界面模板
var pt=[
	'<div id="#{panel}" style="z-index:256;" class="tb_layer_G">',
		'<div class="tb_layer_G_tit">',
			'<h2 id="#{title}"></h2>',
			'<span class="tb_layer_G_tit_btn">',
				'<a class="tb_layer_G_max" href="javascript:;" title="最大化"></a>',
				'<a id="#{btnMin}" class="tb_layer_G_mini" href="javascript:;" title="最小化"></a>',
				'<a id="#{btnClose}" class="tb_layer_G_close" href="javascript:;" title="关闭"></a>',
			'</span>',
		'</div>',
		'<div id="#{content}" class="tb_layer_G_main">',
	    '</div>',
	'</div>'
];
scope.commendationTemplate=pt.join("");


//今日焦点最小化时的模板
pt=[
	'<div id="#{panel}" class="tb_layer_G tb_layer_mini" style="z-index:256;">',
		'<div class="tb_layer_G_tit">',
			'<h2>消息提示 - 今日焦点</h2>',
			'<span class="tb_layer_G_tit_btn">',
				'<a id="#{btnMax}" class="tb_layer_G_max" href="javascript:;" title="最大化"></a>',
				'<a id="#{btnMin}" class="tb_layer_G_mini" href="javascript:;" title="最小化"></a>',
				'<a id="#{btnClose}" class="tb_layer_G_close" href="javascript:;" title="关闭"></a>',
			'</span>',
		'</div>',
	'</div>'
];
scope.todayFocusMinTemplate=pt.join("");


//即时快报最小化时的模板
pt=[
	'<div id="#{panel}" class="tb_layer_G tb_layer_mini" style="z-index:256;">',
		'<div class="tb_layer_G_tit">',
			'<h2>消息提示 - 即时快报</h2>',
			'<span class="tb_layer_G_tit_btn">',
				'<a id="#{btnMax}" class="tb_layer_G_max" href="javascript:;" title="最大化"></a>',
				'<a id="#{btnMin}" class="tb_layer_G_mini" href="javascript:;" title="最小化"></a>',
				'<a id="#{btnClose}" class="tb_layer_G_close" href="javascript:;" title="关闭"></a>',
			'</span>',
		'</div>',
	'</div>'
];
scope.urgencyMinTemplate=pt.join("");


//聊天窗口最小化时的模板
pt=[
	'<div id="#{panel}" class="tb_layer_G tb_layer_mini" style="left:610px; top:850px;">',
		'<div class="layer_G_chat_muti">',
			'<p><strong><img class="SG_icon SG_icon108" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="18" height="18" title="推荐" align="absmiddle" /><a href="javascript:;">有10个好友跟你聊天</a></strong></p>',
			'<span class="layer_G_chat_manage">[<a id="#{btnMax}" href="javascript:;">打开聊天</a>]</span>',
		'</div>',
	'</div>'
];
scope.chatMinTemplate=pt.join("");
