/**
 * Copyright (c) 2010, Sina Inc. All rights reserved.
 * @fileoverview [反抓站]在博文中增加来源提示，在新浪博客中隐藏显示。
 * @author dg.liu dongguang@staff.sina.com.cn
 */

$import("sina/core/dom/addHTML.js");
$import("sina/core/dom/insertHTML.js");
$registJob("setBlogFrom", function(){
	var href=window.location.href;
	var title=document.title;
    var tipArr=['<ins>来源：(<a href="',href,'">',href,'</a>) - ',title,'</ins>'];
	var tipStr=tipArr.join("");
	var ele=$E("sina_keyword_ad_area2");
	if(ele){
		Core.Dom.addHTML(ele,tipStr);
		var divs=ele.getElementsByTagName("div");
		var eles;
		if(divs.length>0){
			eles=divs;
		}else{
			var ps=ele.getElementsByTagName("p");
			if(ps.length>0){
				eles=ps;
			}
		}
		if(eles){
			var num=parseInt(eles.length/2);
			if(num>0){
				var at;
				if(i>2){
					at=num-1;
				}else{
					at=num;
				}
				Core.Dom.insertHTML(eles[at],tipStr,"beforebegin");
			}
		}
		
		
	}
});
