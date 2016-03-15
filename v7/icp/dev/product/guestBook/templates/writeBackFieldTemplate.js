/**
 * @fileoverview 留言页回复的模板
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-25
 */

scope.writeBackFieldTemplate=[
	'<div class="SG_revert_Answer_Top" style="width:490px;"><span class="SG_floatL">回复：</span><span id="#{txtWriteBackPrompt}" class="SG_floatR" >还可以输入50个汉字</span></div>',
	'<div class="SG_revert_Answer_right">',
		'<textarea id="#{txtWriteBackContent}" class="SG_textarea"></textarea>',
		'<div class="SG_revert_Btn">',
			'<div class="SG_revert_Btn_left">',
				'<span><a id="#{linkWriteBackSubmit}" href="javascript:;" class="SG_aBtn SG_aBtnB "><cite id="#{btnWriteBackSubmit}">回复</cite></a></span>',
				'<span><a id="#{linkWriteBackCancel}" href="javascript:;" class="SG_aBtn SG_aBtnB "><cite id="#{btnWriteBackCancel}">取消</cite></a></span>',
			'</div>',
		'</div>',
	'</div>'
].join("");
