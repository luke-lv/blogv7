/**
 * @fileoverview 留言板隐私设置模板
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-25
 */

scope.privacySetTemplate=[
	'<div class="CP_layercon1 msgSettingItem">',
		'<p>',
			'<input type="radio" value="0" id="#{rdAll}" name="radPrivacy"/><label for="#{rdAll}">所有人可见</label>',
			'<input type="radio" value="1" id="#{rdOwn}" name="radPrivacy"/><label for="#{rdOwn}">仅自己可见</label>',
		'</p>',
		'<div class="btn">',
			'<a id="#{btnSave}" class="SG_aBtn SG_aBtnB" href="javascript:;"><cite>保存</cite></a>&nbsp;&nbsp;',
			'<a id="#{btnCancel}" class="SG_aBtn SG_aBtnB" href="javascript:;"><cite>取消</cite></a>',
		'</div>',
	'</div>'
].join("");
