/*
 @info		template 相关的工具方法，建议用于 MixPrototype
 @usage		oop.js 中定义的 $mixProto 方法： function(){}.$mixProto(Lib.templateUtils);
 @author	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("lib/lib.js");
$import("sina/core/string/trim.js");

Lib.templateUtils = function(){};

// 将模板中的 id 节点化
Lib.templateUtils.prototype.getTemplateNodes = function(template){
	var box = document.createElement("div");
	var nodes = {};
	var ids_without_rndNum = [];
	var rndNum = (new Date().getTime().toString()).slice(-5)+Math.floor(Math.random()*1E5);
	var testReg = /#{([a-z0-9_]+)}/gi;
	
	template = template.replace(testReg, function(match, f1){		//将 #{test} 替换成 test_01234 形式。
		ids_without_rndNum.push(f1);
		return f1+"_"+rndNum;
	});
	box.innerHTML = template;
	
	var i;
	var len = ids_without_rndNum.length;
	var key;
	for(i=0; i<len; i++){
		key = ids_without_rndNum[i];
		nodes[key] = this.findById(key+"_"+rndNum, box);
	}
	
	return nodes;
};


// 获得内部所有带 id 的节点。
Lib.templateUtils.prototype.getIdNodes = function(template){
	var i, j, len, tagsLen, idName, idNode;
	var nodes = {};
	var ids = [];
	var idTags = [];
	var tags = [];
	var box = document.createElement("div");
	
	box.innerHTML = template;
	tags = box.getElementsByTagName("*");
	template.replace(/id *= *"([^{ ]+?)"/ig, function(match, f1){
		ids[ids.length] = f1;
	});
	
	len = tags.length;
	for(i=0; i<len; i++){
		if(tags[i].id)
		idTags[idTags.length] = tags[i];
	}
	len = ids.length;
	for(i=0; i<len; i++){
		idName = ids[i];
		j = 0;
		tagsLen = idTags.length;
		while(j<tagsLen){
			idNode = idTags[j];
			if(idName == idNode.id){
				nodes[idName] = idNode;
				idTags.splice(j, 1);
			}
			j++;
		}
	}
	return nodes;
};


// 根据给定父节点找旗下 id。
Lib.templateUtils.prototype.findById = function(id, context, tag){
	var i;
	var context = context || document;			// nodeType 1 & 9
	var tags = context.getElementsByTagName(tag || "*");
	var len = tags.length;
	for(i=0; i<len; i++){
		if(tags[i].getAttribute("id") == id){
			return tags[i];
		}
	}
};


// 根据参数格式化 String 模板
Lib.templateUtils.prototype.formatTemplate = function(curStr, oParam){
	var curStr;
	var formatReg = new RegExp("#{([a-z0-9]+)}", "ig");
	curStr = curStr.replace(formatReg, function(match, f1, index, srcStr){
		return oParam[f1];
	});
	return curStr;
};





