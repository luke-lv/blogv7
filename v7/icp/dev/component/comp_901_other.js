/**
 * @fileoverview
 *	我的动态、关注、收藏、留言、圈子页——个人资料组件
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("lib/component/class/registComp.js");
$import("component/comp_901_myprofile.js");

$registComp(901, {
	/*
	 * 加载其他的附加信息接口
	 */
	"loadOtherInfo"	: function () {
		this.loadAttention();
		// 判断彩信用户
		
		// 判断广告共享计划用户
	}
}, 901);