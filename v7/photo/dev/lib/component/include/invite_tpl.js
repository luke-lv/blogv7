/**
 * @fileoverview
 *	邀请对话框的模板文件
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("lib/lib.js");
Lib.invite_tpl = [
				'<table id="#{entity}" class="CP_w">',
					'<thead id="#{titleBar}">',
						'<tr>',
							'<th class="tLeft"><span></span></th>',
							'<th class="tMid">',
								'<div class="bLyTop">',
									'<strong id="#{titleName}">提示标题</strong>',
									'<cite><a id="#{btnClose}" href="javascript:void(0)" class="CP_w_shut" title="关闭">关闭</a></cite>',
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
				'</table>'
			].join("");