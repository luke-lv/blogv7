/**
 * @id Core.String.format
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview 字符串 html 编码/解码
 */
$import("sina/core/string/_string.js");

/**
 * 对第字符串中的｛n｝进行替换
 * @author shaomin | shaomin@staff.sina.com.cn
 * format string (python style)
 * @for String.format
 * @param {String} 被替换的字符串
 * @param {String} 字符串中{0}被替换的内容
 * @param {String} 字符串中{1}被替换的内容
 * @return {String} 被替换后的字符串
 * @example
 *  var temp = "Greeting {0}, the method author is {1}";
 	temp = temp.format("SINA", "MaDFoX"); 
 	// return "Greeting SINA, the method author is MaDFoX"
	var temp = "15 == {0:16}".format(15);
	// return "15 == f";
	
 */
String.prototype.format = function(){
	var r = (!arguments[0] || typeof arguments[0] == "undefined")?"":arguments[0].toString();
	var re = /(.*?)({(\d+)(:([0-9a-z]+))?})/ig;
	var t = this.match(re);
	if(t){
		for(var i = 0, l = t.length; i<l; i++){			
			t[i] = t[i].replace(re, function(){				
				return RegExp.$1;
			});
			t[i]=RegExp.$1;	// 这里为修复chrome bug 换种写法 发现ie bug 在此修复。		wujian 2010-11-2
			//t[i] = t[i].replace(re, "$1");//这里 发现chrome 6.0 丢失RegExp.$1-9 值的bug haha wujian 2010-11-2
			switch(typeof arguments[parseInt(RegExp.$3)]){
				case "undefined" :
					t[i] += RegExp.$2;
					break;
				case "number" :
					t[i] += (isNaN(RegExp.$5) || RegExp.$5 =="") ? arguments[parseInt(RegExp.$3)] : arguments[parseInt(RegExp.$3)].toString(Math.max(Math.min(Math.round(RegExp.$5), 36), 2));
					break;
				default :
					t[i] += arguments[parseInt(RegExp.$3)];
			}
		}
		t.push(this.replace(re, ""));
		return t.join("");
	}
	return this;
};


