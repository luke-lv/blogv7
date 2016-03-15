
/**
 * @id Core.System.htmlFilter
 * @description html代码过滤
 * @author Random | YangHao@staff.sina.com.cn
 * @demo
 * 		dom1.innerHTML=Core.System.htmlFilter(dom2.value);
 */
$import('sina/core/system/_system.js');

Core.System.htmlFilter = function(content){
	var codeHash={
		"&":"&#038;",
		"<":"&#060;",
		">":"&#062;"
	};
	var k;
	for(k in codeHash){
		content=content.replace(new RegExp(k,"g"),codeHash[k]);
	}
	return content;
};