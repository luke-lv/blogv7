/**
 * @fileoverview 上传图片状态码
 * @author xinyu@staff.sina.com.cn
 */
$import("lib/sysmsg.js");
$SYSMSG.extend({
    "A06001": "<b><span class=\"reason green\">添加中，</span>请稍候...</b>",
    "A06002": "<span class=\"reason red\">图片格式必须是jpg、gif、png，请重新选择。</span>",
    "A06003": "<span class=\"reason red\">路径错误或找不到文件，请重新选择。</span>",
    "A06004": "<b>图片大小必须是500K以内。</b>",
    "A06005": "<b style='color:#F00;'>添加失败，请重试。</b>",
    "A06006": "<b>关闭操作层将导致添加失败，是否继续？</b>",
    "A06007": "<b>离开操作层将导致上传中断，是否继续？</b>",
    "A06008": "<span class=\"reason green\">图片已添加成功。</span>",
    "A06009": "<b>图片格式必须是jpg、gif、png，请重新选择。</b>",
	"A06010": "跨域错误",
	"A06011": "您已经添加过这张图片了...",
	"A06012": "请输入图片的网络地址。"
	
});
