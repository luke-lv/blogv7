/**
 * @id Core.System.htmlDecode
 * @description html解码
 * @author Random | YangHao@staff.sina.com.cn
 * @demo
 * 		dom1.value=Core.System.htmlDecode(dom2.innerHTML);
 */
$import('sina/core/system/_system.js');

Core.System.htmlDecode = function(content){
	var codeHash={
		"&lt;" : "<",
		"&gt;" : ">",
		"&nbsp;" : " ",
		"&amp;" : "&",
		"&quot;" : "\""
	};
	var k;
	for(k in codeHash){
		content=content.replace(new RegExp(k,"g"),codeHash[k]);
	}
	return content;
};