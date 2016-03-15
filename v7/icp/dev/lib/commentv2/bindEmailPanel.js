/**
 * @fileoverview 绑定邮箱提示
 * @author Rui Luo | luorui1@staff.sina.com.cn
 * @created 2010-06-30
 */
$import("sina/sina.js");
$import("sina/core/class/define.js");
$import("sina/core/events/addEvent.js");
$import("sina/utils/io/jsload.js");

$import("lib/panel.js");

/**
 * 绑定邮箱提示类，继承于Panel类
 */
scope.bindEmailPanel = Core.Class.define(function() {
	Lib.Panel.prototype.initialize.apply(this, arguments);
	this.setTemplate(['<div id="#{panel}" style="z-index:512; width:200px" class="tb_layer_Y tb_layer_w5">',
			'<div class="tb_layer_Y_main tip_layer_main">',
				'<div class="tip_ps" style="width:auto;float:right">',
					'<a id="closeBindEmail" title="关闭提示" class="tb_friend_inputDel" href="#" onclick="return false"></a>',
				'</div>',
				'<div style="padding:6px">为了您的账号安全，请<a id="linkBindEmail" href="#" target="_blank">绑定邮箱</a></div>',
			'</div>',
			'<div class="tb_layer_arrow tip_arrow"></div>',
		'</div>'
	].join(''));
}, Lib.Panel, {

	initUserInfo:function(uid) {
		var nodes = this.getNodes();


		//配置链接
		//nodes["linkBlog"].href = "http://blog.sina.com.cn/u/" + uid;

	}
});


