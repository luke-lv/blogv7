/**
 * 新注册流程文案
 * @author chengwei1@staff.sina.com.cn
 * @since 2010-01-11
 */
$import("lib/sysmsg.js");
$SYSMSG.extend({
	"A00001" : "系统繁忙，请稍候再试。",
	"A00007" : "未登录。",
	"A00004" : "系统繁忙，请稍候再试。",
	"A00112" : "博客名称超长。",
	"A00113" : "此账户已开通博客，点击确定，直接进入博客。",
	"A00116" : "不能包含 sina 等有特殊含义的字符。",
	"A11003" : "此账户已完成博客快速设置，点击确定，直接进入博客。",
	"A44001" : "博客个性地址不能为空。",
	"A44002" : "地址格式不对。",
	"A44003" : "抱歉，此地址已被占用。",
	"A44005" : "抱歉，请按照正确格式填写博客地址。",

	"alert"  : [						//alert 模板
'<table id="#{entity}" border="0" cellspacing="0" cellpadding="0" class="gModLayerBox twrap">',
    '<tr>',
        '<td></td>',
        '<td class="fixSize"></td>',
    '</tr>',
    '<tr>',
        '<td>',
            '<div class="layerDoc">',
                '<div class="midLayer">',
                    '<div id="#{titleBar}" class="gDialogTop">',
                        '<strong id="#{titleName}"></strong><cite><a id="#{btnClose}" href="#" class="CP_w_shut" title="关闭">关闭</a></cite>',
                    '</div>',
                    '<div id="#{content}" class="gDialogDoc">',
                        '<div class="diaBd">',
                            '<div class="gDiaC1"><img id="#{icon}" alt="警告" src="http://simg.sinajs.cn/blog7style/images/bring/warm.gif" width="50" height="50"/></div>',
                            '<div class="gDiaC2">',
                                '<h5 id="#{text}"></h5>',
                                '<p id="#{subText}"></p>',
                            '</div>',
                            '<div class="clearit"></div>',
                        '</div>',
                        '<div class="btnRow"><a id="#{linkOk}" href="#" onclick="return false" class="SG_aBtnB"><cite id="#{btnOk}"><span id="#{ok}">确定</span></cite></a></div>',
                    '</div>',
                '</div>',
            '</div>',
        '</td>',
        '<td class="tBg"></td>',
    '</tr>',
    '<tr>',
        '<td>',
            '<div class="tBg"></div>',
        '</td>',
        '<td class="tBg fixSize"></td>',
    '</tr>',
'</table>'
].join("")
	
	
	
});
