/**
 * @fileoverview 搜索面板的模板HTML
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-04
 */

var st=[
		'<div id="#{panel}" style="z-index:512;" class="tb_layerBox">',
			'<ul>',
				'<li id="#{blog}"><a href="javascript:;" onclick="v7sendLog(\'40_01_19\')">博文</a></li>',
				'<li id="#{bauthor}"><a href="javascript:;" onclick="v7sendLog(\'40_01_19\')">博主</a></li>',
				'<li id="#{song}"><a href="javascript:;" onclick="v7sendLog(\'40_01_19\')">音乐</a></li>',
				'<li id="#{video}"><a href="javascript:;" onclick="v7sendLog(\'40_01_19\')">视频</a></li>',
				'<li id="#{vauthor}"><a href="javascript:;" onclick="v7sendLog(\'40_01_19\')">播主 </a></li>',
			'</ul>',
		'</div>'
];

scope.searchPanelTemplate=st.join("");
