/**
 * 修改帐户密码
 * @author L.Ming | liming1@staff.sina.com.cn
 * @since 2008-09-20
 */
$import("lib/sysmsg.js");
$SYSMSG.extend({
	"A45001" : "请输入旧密码。",
	"A45002" : "请输入新密码。",
	"A45003" : "请再次输入新密码。",
	"A45004" : "两次输入的新密码不一致，请重新输入。",
	"A45005" : '密码必须是6-16个英文、数字、“.”、“-”、“?”和“_”，且下划线不能在最后，请重新输入。',
	"A45006" : "旧密码错误，请重新输入。",
	"A45007" : "密码已修改成功。"
});