/** 
 * @fileoverview 插入一段模板HTML到指定节点里面或前后，并返回所有的id节点
 * @author Book | liming9@staff.sina.com.cn
 * @version 0.01 | 2011-06-21
 * @importcopy $import("comps/insertTemplate.js");
 */
$import("other/SinaEx.js");
$import("sina/core/dom/insertHTML.js");
/** 
 * 插入一段模板HTML到指定节点里面或前后，并返回所有的id节点
 * @method
 * @param {HTMLElement} el 要插到的指定的节点
 * @param {String} template 要插入的模板HTML字符串
 * @param {String} where 插入的位置。@see sina/core/dom/insertHTML.js
 * @type Object 返回包含所有id节点的对象
 */
SinaEx.insertTemplate = function(el, template, where){
	var ids = [], //没有带随机数的原始id
		nodes = {},
		idreg = /#{(\w+)}/g,
		rndNum = "_"+(new Date().getTime().toString()).slice(-5)+Math.floor(Math.random()*1E5);
	
	template = template.replace(idreg, function(match, id){ //将#{test}替换成 test_01234 形式。
		ids.push(id);
		return id+rndNum;
	});
	
	Core.Dom.insertHTML(el, template, where);
	
	for(var i=ids.length, id; i--;){
		id = ids[i];
		nodes[id] = $E(id+rndNum);
	}
	
	return nodes;
};
